import { useEffect, useMemo, useState } from 'react';
import type { Recipe, UserVote } from './types';
import { MATERIALS, getMachine, getMaterial } from './data/materials';
import { dataSource } from './lib/dataSource';
import { aggregateCell, interfaceScore, recipeScore, type InterfacePoint } from './lib/scoring';
import { Filters, type FilterState } from './components/Filters';
import { CompatibilityMatrix } from './components/CompatibilityMatrix';
import { CellDetailDrawer } from './components/CellDetailDrawer';
import { RecipeGallery } from './components/RecipeGallery';
import { RecipeForm } from './components/RecipeForm';
import { MaterialDigest, type DigestEntry } from './components/MaterialDigest';
import { ExportDrawer } from './components/ExportDrawer';
import { ImportDialog } from './components/ImportDialog';

type View = 'matrix' | 'recettes' | 'digest';

/** Clé non ordonnée d'une paire de matériaux : pair(a,b) === pair(b,a). */
function pairKey(a: string, b: string): string {
  return [a, b].sort().join('|');
}

export default function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [userVotes, setUserVotes] = useState<Record<string, UserVote>>({});
  const [view, setView] = useState<View>('matrix');
  const [showForm, setShowForm] = useState(false);
  const [editRecipe, setEditRecipe] = useState<Recipe | null>(null);
  const [showImport, setShowImport] = useState(false);
  const [exportRecipe, setExportRecipe] = useState<Recipe | null>(null);

  // Chargement initial des recettes depuis la source de données.
  useEffect(() => {
    let active = true;
    dataSource
      .listRecipes()
      .then((list) => active && setRecipes(list))
      .catch((e) => active && setLoadError(String(e?.message ?? e)))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);
  const [filters, setFilters] = useState<FilterState>({
    query: '', system: 'all', count: 'all', hideEmpty: false, sort: 'score',
  });
  const [selected, setSelected] = useState<{ a: string; b: string } | null>(null);

  // --- Filtrage des recettes ---
  const filtered = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    return recipes.filter((r) => {
      if (filters.system !== 'all') {
        const machine = getMachine(r.machineId);
        if (!machine || machine.system !== filters.system) return false;
      }
      if (filters.count !== 'all') {
        const n = r.slots.length;
        if (filters.count === '2' && n !== 2) return false;
        if (filters.count === '3' && n !== 3) return false;
        if (filters.count === '4+' && n < 4) return false;
      }
      if (q) {
        const haystack = [
          r.title,
          r.author,
          r.notes,
          getMachine(r.machineId)?.name,
          ...r.slots.flatMap((s) => [s.brand, s.label, getMaterial(s.material)?.name, getMaterial(s.material)?.fullName]),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [recipes, filters.system, filters.count, filters.query]);

  // --- Index paire -> points d'interface (décomposition des recettes) ---
  const byPair = useMemo(() => {
    const map = new Map<string, InterfacePoint[]>();
    for (const r of filtered) {
      for (const iface of r.interfaces) {
        const key = pairKey(iface.a, iface.b);
        const point: InterfacePoint = { recipe: r, iface, score: interfaceScore(r, iface) };
        const list = map.get(key);
        if (list) list.push(point);
        else map.set(key, [point]);
      }
    }
    return map;
  }, [filtered]);

  const pointsFor = (a: string, b: string) => byPair.get(pairKey(a, b)) ?? [];

  // --- Récap par matériau : meilleur partenaire de chaque filament ---
  const materialDigest = useMemo<DigestEntry[]>(() => {
    return MATERIALS.map((material) => {
      let best: DigestEntry['best'] = null;
      for (const other of MATERIALS) {
        // On cherche le meilleur partenaire DIFFÉRENT : un matériau adhère
        // toujours à lui-même, ça n'a aucune valeur de recommandation.
        if (other.id === material.id) continue;
        const agg = aggregateCell(byPair.get(pairKey(material.id, other.id)) ?? []);
        if (agg.score === null) continue;
        if (!best || agg.score > best.score) {
          best = { partner: other, score: agg.score, recipeCount: agg.recipeCount };
        }
      }
      return { material, best };
    });
  }, [byPair]);

  // --- Matériaux visibles (option « masquer les combinaisons vides ») ---
  const visibleMaterials = useMemo(() => {
    if (!filters.hideEmpty) return MATERIALS;
    const used = new Set<string>();
    for (const r of filtered) for (const s of r.slots) used.add(s.material);
    return MATERIALS.filter((m) => used.has(m.id));
  }, [filters.hideEmpty, filtered]);

  // --- Recettes triées pour la galerie (selon le critère choisi) ---
  const galleryRecipes = useMemo(() => {
    const list = [...filtered];
    switch (filters.sort) {
      case 'recent':
        return list.sort((a, b) => b.date.localeCompare(a.date));
      case 'votes':
        return list.sort(
          (a, b) =>
            b.votesUp - b.votesDown - (a.votesUp - a.votesDown) ||
            recipeScore(b) - recipeScore(a),
        );
      case 'materials':
        return list.sort(
          (a, b) => b.slots.length - a.slots.length || recipeScore(b) - recipeScore(a),
        );
      case 'score':
      default:
        return list.sort((a, b) => recipeScore(b) - recipeScore(a));
    }
  }, [filtered, filters.sort]);

  // --- Vote communautaire (optimiste + persistance via la source) ---
  function vote(id: string, dir: 'up' | 'down') {
    const prev = userVotes[id] ?? null;
    const next: UserVote = prev === dir ? null : dir;
    let upDelta = 0;
    let downDelta = 0;
    if (prev === 'up') upDelta--;
    if (prev === 'down') downDelta--;
    if (next === 'up') upDelta++;
    if (next === 'down') downDelta++;

    setRecipes((list) =>
      list.map((r) =>
        r.id === id
          ? { ...r, votesUp: r.votesUp + upDelta, votesDown: r.votesDown + downDelta }
          : r,
      ),
    );
    setUserVotes((v) => ({ ...v, [id]: next }));
    dataSource.applyVote(id, upDelta, downDelta).catch((e) => console.error('vote', e));
  }

  // --- Ajout d'une recette (persisté via la source de données) ---
  function addRecipe(recipe: Recipe) {
    setShowForm(false);
    setShowImport(false);
    setView('recettes');
    setRecipes((list) => [recipe, ...list]); // optimiste
    dataSource
      .addRecipe(recipe)
      .then((saved) =>
        setRecipes((list) => [saved, ...list.filter((r) => r.id !== recipe.id)]),
      )
      .catch((e) => console.error('addRecipe', e));
  }

  // --- Édition d'une recette existante (optimiste + persistance) ---
  function updateRecipe(recipe: Recipe) {
    setEditRecipe(null);
    setRecipes((list) => list.map((r) => (r.id === recipe.id ? recipe : r)));
    dataSource.updateRecipe(recipe).catch((e) => console.error('updateRecipe', e));
  }

  // --- Suppression d'une recette (optimiste + persistance) ---
  function deleteRecipe(recipe: Recipe) {
    setRecipes((list) => list.filter((r) => r.id !== recipe.id));
    if (exportRecipe?.id === recipe.id) setExportRecipe(null);
    if (editRecipe?.id === recipe.id) setEditRecipe(null);
    dataSource.deleteRecipe(recipe.id).catch((e) => console.error('deleteRecipe', e));
  }

  // Numéro d'inventaire stable par recette (ordre de la liste source).
  const inventoryNos = useMemo(
    () => new Map(recipes.map((r, i) => [r.id, i + 1])),
    [recipes],
  );

  const totalVotes = recipes.reduce((s, r) => s + r.votesUp + r.votesDown, 0);
  const multiCount = recipes.filter((r) => r.slots.length >= 3).length;
  const selectedMatA = selected ? getMaterial(selected.a) : null;
  const selectedMatB = selected ? getMaterial(selected.b) : null;
  const selectedPoints = selected ? pointsFor(selected.a, selected.b) : [];

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">TM</span>
          <div>
            <h1>TM</h1>
            <p className="tag">réf. TM-09 · espace privé</p>
          </div>
        </div>
        <div className="spacer" />
        <span className="pill-stat"><b>{recipes.length}</b> recettes</span>
        <span className="pill-stat"><b>{multiCount}</b> à 3+ matériaux</span>
        <span className="pill-stat"><b>{totalVotes}</b> votes</span>
      </header>

      <div className="toolbar">
        <div className="view-toggle">
          <button className={view === 'matrix' ? 'active' : ''} onClick={() => setView('matrix')}>
            🧩 Matrice
          </button>
          <button className={view === 'recettes' ? 'active' : ''} onClick={() => setView('recettes')}>
            📋 Recettes
          </button>
          <button className={view === 'digest' ? 'active' : ''} onClick={() => setView('digest')}>
            🏅 Récap
          </button>
        </div>
        <div className="toolbar-actions">
          <button className="btn-secondary" onClick={() => setShowImport(true)}>
            ⇪ Importer
          </button>
          <button className="btn-primary add-recipe" onClick={() => setShowForm(true)}>
            ➕ Ajouter une recette
          </button>
        </div>
      </div>

      <Filters
        value={filters}
        onChange={setFilters}
        showHideEmpty={view === 'matrix'}
        showSort={view === 'recettes'}
      />

      {loading ? (
        <div className="matrix-wrap">
          <div className="empty-state">Chargement des recettes…</div>
        </div>
      ) : loadError ? (
        <div className="matrix-wrap">
          <div className="empty-state">
            Impossible de charger les recettes&nbsp;: {loadError}
          </div>
        </div>
      ) : view === 'matrix' ? (
        visibleMaterials.length === 0 ? (
          <div className="matrix-wrap">
            <div className="empty-state">
              Aucune recette ne correspond à ces filtres. Essayez d’élargir la recherche.
            </div>
          </div>
        ) : (
          <CompatibilityMatrix
            materials={visibleMaterials}
            pointsFor={pointsFor}
            selected={selected}
            onSelect={(a, b) => setSelected({ a, b })}
            recipeCount={filtered.length}
          />
        )
      ) : view === 'recettes' ? (
        <RecipeGallery
          recipes={galleryRecipes}
          userVotes={userVotes}
          onVote={vote}
          inventoryNos={inventoryNos}
          onExport={setExportRecipe}
          onEdit={setEditRecipe}
          onDelete={deleteRecipe}
        />
      ) : (
        <MaterialDigest
          entries={materialDigest}
          onSelect={(a, b) => setSelected({ a, b })}
        />
      )}

      <footer className="footer">réf. TM-09 · usage privé</footer>

      {selected && selectedMatA && selectedMatB && (
        <CellDetailDrawer
          matA={selectedMatA}
          matB={selectedMatB}
          points={selectedPoints}
          userVotes={userVotes}
          onVote={vote}
          onClose={() => setSelected(null)}
          inventoryNos={inventoryNos}
          onExport={setExportRecipe}
          onEdit={setEditRecipe}
          onDelete={deleteRecipe}
        />
      )}

      {showForm && <RecipeForm onSubmit={addRecipe} onClose={() => setShowForm(false)} />}

      {editRecipe && (
        <RecipeForm
          initial={editRecipe}
          onSubmit={updateRecipe}
          onClose={() => setEditRecipe(null)}
        />
      )}

      {showImport && (
        <ImportDialog onImport={addRecipe} onClose={() => setShowImport(false)} />
      )}

      {exportRecipe && (
        <ExportDrawer
          recipe={exportRecipe}
          inventoryNo={inventoryNos.get(exportRecipe.id)}
          onClose={() => setExportRecipe(null)}
        />
      )}
    </div>
  );
}
