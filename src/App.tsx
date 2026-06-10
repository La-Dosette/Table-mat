import { useEffect, useMemo, useState } from 'react';
import type { Recipe, UserVote } from './types';
import { MATERIALS, getMachine, getMaterial } from './data/materials';
import { dataSource } from './lib/dataSource';
import { interfaceScore, recipeScore, type InterfacePoint } from './lib/scoring';
import { Filters, type FilterState } from './components/Filters';
import { CompatibilityMatrix } from './components/CompatibilityMatrix';
import { CellDetailDrawer } from './components/CellDetailDrawer';
import { RecipeGallery } from './components/RecipeGallery';
import { RecipeForm } from './components/RecipeForm';
import { ProtocolPanel } from './components/ProtocolPanel';
import { CommunityOverview } from './components/CommunityOverview';

type View = 'matrix' | 'recettes';

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
    query: '', system: 'all', count: 'all', hideEmpty: false,
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

  // --- Matériaux visibles (option « masquer les combinaisons vides ») ---
  const visibleMaterials = useMemo(() => {
    if (!filters.hideEmpty) return MATERIALS;
    const used = new Set<string>();
    for (const r of filtered) for (const s of r.slots) used.add(s.material);
    return MATERIALS.filter((m) => used.has(m.id));
  }, [filters.hideEmpty, filtered]);

  // --- Recettes triées pour la galerie ---
  const galleryRecipes = useMemo(
    () => [...filtered].sort((a, b) => recipeScore(b) - recipeScore(a)),
    [filtered],
  );

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
    setView('recettes');
    setRecipes((list) => [recipe, ...list]); // optimiste
    dataSource
      .addRecipe(recipe)
      .then((saved) =>
        setRecipes((list) => [saved, ...list.filter((r) => r.id !== recipe.id)]),
      )
      .catch((e) => console.error('addRecipe', e));
  }

  const totalVotes = recipes.reduce((s, r) => s + r.votesUp + r.votesDown, 0);
  const multiCount = recipes.filter((r) => r.slots.length >= 3).length;
  const selectedMatA = selected ? getMaterial(selected.a) : null;
  const selectedMatB = selected ? getMaterial(selected.b) : null;
  const selectedPoints = selected ? pointsFor(selected.a, selected.b) : [];

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <img className="brand-logo" src="./favicon.svg" alt="" />
          <div>
            <h1>Table-Mat</h1>
            <p className="tag">La matrice communautaire de l’impression multi-matériaux</p>
          </div>
        </div>
        <div className="spacer" />
        <span className="pill-stat"><b>{recipes.length}</b> recettes</span>
        <span className="pill-stat"><b>{multiCount}</b> à 3+ matériaux</span>
        <span className="pill-stat"><b>{totalVotes}</b> votes</span>
      </header>

      <div className="intro">
        <p>
          Chaque <b>recette</b> peut mêler de 2 à 16 matériaux. La matrice montre
          le <b>score de chaque liaison</b> (contact entre deux matériaux) ;{' '}
          <b>survolez</b> une case pour un aperçu, <b>cliquez</b> pour voir les
          recettes et leurs réglages. La vue <b>Recettes</b> liste les
          configurations complètes. <b>Votez</b> pour faire vivre les notes&nbsp;!
        </p>
      </div>

      <div className="toolbar">
        <div className="view-toggle">
          <button className={view === 'matrix' ? 'active' : ''} onClick={() => setView('matrix')}>
            🧩 Matrice
          </button>
          <button className={view === 'recettes' ? 'active' : ''} onClick={() => setView('recettes')}>
            📋 Recettes
          </button>
        </div>
        <button className="btn-primary add-recipe" onClick={() => setShowForm(true)}>
          ➕ Ajouter une recette
        </button>
      </div>

      <Filters value={filters} onChange={setFilters} showHideEmpty={view === 'matrix'} />

      {!loading && !loadError && (
        <CommunityOverview
          recipes={recipes}
          filteredRecipes={filtered}
          materials={visibleMaterials}
          pointsFor={pointsFor}
          onSelectPair={(a, b) => {
            setView('matrix');
            setSelected({ a, b });
          }}
          onOpenRecipes={() => setView('recettes')}
          onAddRecipe={() => setShowForm(true)}
        />
      )}

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
          />
        )
      ) : (
        <RecipeGallery recipes={galleryRecipes} userVotes={userVotes} onVote={vote} />
      )}

      <ProtocolPanel />

      <footer className="footer">
        Table-Mat · prototype communautaire open-source.
        <br />
        Source de données&nbsp;:{' '}
        <span className={dataSource.isRemote ? 'src-remote' : 'src-local'}>
          {dataSource.label}
        </span>
      </footer>

      {selected && selectedMatA && selectedMatB && (
        <CellDetailDrawer
          matA={selectedMatA}
          matB={selectedMatB}
          points={selectedPoints}
          userVotes={userVotes}
          onVote={vote}
          onClose={() => setSelected(null)}
        />
      )}

      {showForm && <RecipeForm onSubmit={addRecipe} onClose={() => setShowForm(false)} />}
    </div>
  );
}
