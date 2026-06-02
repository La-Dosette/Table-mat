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
import { ComparatorPanel } from './components/ComparatorPanel';
import { recipesToJson } from './lib/exportSettings';
import { useLocalStorage } from './lib/settings';
import { useI18n } from './lib/i18n';

type View = 'matrix' | 'recettes' | 'digest';

/** Clé non ordonnée d'une paire de matériaux : pair(a,b) === pair(b,a). */
function pairKey(a: string, b: string): string {
  return [a, b].sort().join('|');
}

export default function App() {
  const { t, lang, setLang } = useI18n();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [userVotes, setUserVotes] = useState<Record<string, UserVote>>({});
  const [view, setView] = useState<View>('matrix');
  const [showForm, setShowForm] = useState(false);
  const [editRecipe, setEditRecipe] = useState<Recipe | null>(null);
  const [duplicateSource, setDuplicateSource] = useState<Recipe | null>(null);
  const [showImport, setShowImport] = useState(false);
  const [exportRecipe, setExportRecipe] = useState<Recipe | null>(null);
  const [compareIds, setCompareIds] = useState<Set<string>>(new Set());
  const [showComparator, setShowComparator] = useState(false);

  // Thème clair / sombre, mémorisé dans le navigateur.
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('tm.theme', 'light');
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

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
    query: '', system: 'all', count: 'all', hideEmpty: false, sort: 'score', families: [],
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

  // --- Matériaux restreints aux familles sélectionnées (vide = toutes) ---
  const familyMaterials = useMemo(
    () =>
      filters.families.length
        ? MATERIALS.filter((m) => filters.families.includes(m.family))
        : MATERIALS,
    [filters.families],
  );

  // --- Récap par matériau : meilleur partenaire de chaque filament ---
  const materialDigest = useMemo<DigestEntry[]>(() => {
    return familyMaterials.map((material) => {
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
  }, [byPair, familyMaterials]);

  // --- Matériaux visibles (familles sélectionnées + option « masquer les vides ») ---
  const visibleMaterials = useMemo(() => {
    if (!filters.hideEmpty) return familyMaterials;
    const used = new Set<string>();
    for (const r of filtered) for (const s of r.slots) used.add(s.material);
    return familyMaterials.filter((m) => used.has(m.id));
  }, [filters.hideEmpty, filtered, familyMaterials]);

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
    setCompareIds((s) => {
      if (!s.has(recipe.id)) return s;
      const n = new Set(s);
      n.delete(recipe.id);
      return n;
    });
    dataSource.deleteRecipe(recipe.id).catch((e) => console.error('deleteRecipe', e));
  }

  // --- Import (une ou plusieurs recettes depuis un JSON) ---
  function importRecipes(list: Recipe[]) {
    setShowImport(false);
    setView('recettes');
    setRecipes((cur) => [...list, ...cur]);
    list.forEach((r) => dataSource.addRecipe(r).catch((e) => console.error('import', e)));
  }

  // --- Export global de toutes les recettes en un JSON ---
  function exportAll() {
    const blob = new Blob([recipesToJson(recipes)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `table-mat_export_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // --- Sélection pour le comparateur (max 4) ---
  function toggleCompare(recipe: Recipe) {
    setCompareIds((s) => {
      const n = new Set(s);
      if (n.has(recipe.id)) n.delete(recipe.id);
      else if (n.size < 4) n.add(recipe.id);
      return n;
    });
  }
  const compareRecipes = recipes.filter((r) => compareIds.has(r.id));

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
          <h1>TM</h1>
        </div>
        <div className="spacer" />
        <span className="pill-stat"><b>{recipes.length}</b> {t('stat.recipes')}</span>
        <span className="pill-stat"><b>{multiCount}</b> {t('stat.multi')}</span>
        <span className="pill-stat"><b>{totalVotes}</b> {t('stat.votes')}</span>
        <div className="lang-toggle" role="group" aria-label={t('lang.label')}>
          <button className={lang === 'fr' ? 'active' : ''} onClick={() => setLang('fr')}>FR</button>
          <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button>
        </div>
        <button
          className="theme-toggle"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label={theme === 'dark' ? t('theme.toLight') : t('theme.toDark')}
          title={theme === 'dark' ? t('theme.toLight') : t('theme.toDark')}
        >
          {theme === 'dark' ? '☀' : '☾'}
        </button>
      </header>

      <div className="toolbar">
        <div className="view-toggle">
          <button className={view === 'matrix' ? 'active' : ''} onClick={() => setView('matrix')}>
            {t('view.matrix')}
          </button>
          <button className={view === 'recettes' ? 'active' : ''} onClick={() => setView('recettes')}>
            {t('view.recettes')}
          </button>
          <button className={view === 'digest' ? 'active' : ''} onClick={() => setView('digest')}>
            {t('view.digest')}
          </button>
        </div>
        <div className="toolbar-actions">
          <button className="btn-secondary" onClick={exportAll} disabled={recipes.length === 0}>
            {t('action.exportAll')}
          </button>
          <button className="btn-secondary" onClick={() => setShowImport(true)}>
            {t('action.import')}
          </button>
          <button className="btn-primary add-recipe" onClick={() => setShowForm(true)}>
            {t('action.add')}
          </button>
        </div>
      </div>

      <Filters
        value={filters}
        onChange={setFilters}
        showHideEmpty={view === 'matrix'}
        showSort={view === 'recettes'}
        showFamilies={view === 'matrix' || view === 'digest'}
      />

      {loading ? (
        <div className="matrix-wrap">
          <div className="empty-state">{t('state.loading')}</div>
        </div>
      ) : loadError ? (
        <div className="matrix-wrap">
          <div className="empty-state">{t('state.loadError', { e: loadError })}</div>
        </div>
      ) : view === 'matrix' ? (
        visibleMaterials.length === 0 ? (
          <div className="matrix-wrap">
            <div className="empty-state">{t('state.emptyMatrix')}</div>
          </div>
        ) : (
          <CompatibilityMatrix
            materials={visibleMaterials}
            pointsFor={pointsFor}
            selected={selected}
            onSelect={(a, b) => setSelected({ a, b })}
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
          onDuplicate={setDuplicateSource}
          compareIds={compareIds}
          onToggleCompare={toggleCompare}
        />
      ) : (
        <MaterialDigest
          entries={materialDigest}
          onSelect={(a, b) => setSelected({ a, b })}
        />
      )}

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
          onDuplicate={setDuplicateSource}
        />
      )}

      {view === 'recettes' && compareIds.size > 0 && (
        <div className="compare-bar">
          <span>{t('cmp.bar', { n: compareIds.size })}</span>
          <button
            className="btn-primary"
            disabled={compareIds.size < 2}
            onClick={() => setShowComparator(true)}
          >
            {t('cmp.compare')}
          </button>
          <button className="btn-secondary" onClick={() => setCompareIds(new Set())}>
            {t('cmp.clear')}
          </button>
        </div>
      )}

      {showForm && <RecipeForm onSubmit={addRecipe} onClose={() => setShowForm(false)} />}

      {duplicateSource && (
        <RecipeForm
          initial={duplicateSource}
          duplicate
          onSubmit={addRecipe}
          onClose={() => setDuplicateSource(null)}
        />
      )}

      {showComparator && compareRecipes.length >= 2 && (
        <ComparatorPanel
          recipes={compareRecipes}
          inventoryNos={inventoryNos}
          onClose={() => setShowComparator(false)}
        />
      )}

      {editRecipe && (
        <RecipeForm
          initial={editRecipe}
          onSubmit={updateRecipe}
          onClose={() => setEditRecipe(null)}
        />
      )}

      {showImport && (
        <ImportDialog onImport={importRecipes} onClose={() => setShowImport(false)} />
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
