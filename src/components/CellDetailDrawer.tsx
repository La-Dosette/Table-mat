import type { Material, Recipe, UserVote } from '../types';
import { aggregateCell, scoreColor, scoreLabelKey, type InterfacePoint } from '../lib/scoring';
import { useEscapeKey } from '../lib/useEscapeKey';
import { useI18n } from '../lib/i18n';
import { RecipeCard } from './RecipeCard';

interface Props {
  matA: Material;
  matB: Material;
  points: InterfacePoint[];
  userVotes: Record<string, UserVote>;
  onVote: (id: string, dir: 'up' | 'down') => void;
  onClose: () => void;
  inventoryNos: Map<string, number>;
  onExport: (recipe: Recipe) => void;
  onEdit: (recipe: Recipe) => void;
  onDelete: (recipe: Recipe) => void;
  onDuplicate: (recipe: Recipe) => void;
}

export function CellDetailDrawer({
  matA, matB, points, userVotes, onVote, onClose, inventoryNos, onExport, onEdit, onDelete, onDuplicate,
}: Props) {
  useEscapeKey(onClose);
  const { t } = useI18n();
  const agg = aggregateCell(points);
  // Une recette peut apparaître une fois par interface ; on déduplique sur la
  // recette tout en gardant le score de liaison de CETTE paire pour le tri.
  const sorted = [...points].sort((a, b) => b.score - a.score);

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-label={t('drawer.ifaceAria', { a: matA.name, b: matB.name })}>
        <div className="drawer-head">
          <div className="score-ring" style={{ background: scoreColor(agg.score), width: 56, height: 56 }}>
            {agg.score}
          </div>
          <div style={{ flex: 1 }}>
            <h3>
              <span className="mat-dot" style={{ background: matA.accent }} />
              {matA.name}
              <span style={{ color: 'var(--text-faint)' }}>↔</span>
              <span className="mat-dot" style={{ background: matB.accent }} />
              {matB.name}
            </h3>
            <p className="sub">
              {t('drawer.sub', {
                label: t(scoreLabelKey(agg.score)), n: agg.recipeCount, conf: agg.confidence,
              })}
            </p>
          </div>
          <button className="close-btn" onClick={onClose} aria-label={t('common.close')}>✕</button>
        </div>
        <div className="drawer-body">
          <p className="drawer-intro">{t('drawer.intro')}</p>
          {sorted.map((p) => (
            <RecipeCard
              key={p.recipe.id + p.iface.a + p.iface.b}
              recipe={p.recipe}
              userVote={userVotes[p.recipe.id] ?? null}
              onVote={onVote}
              highlightPair={{ a: matA.id, b: matB.id }}
              inventoryNo={inventoryNos.get(p.recipe.id)}
              onExport={onExport}
              onEdit={onEdit}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
            />
          ))}
        </div>
      </aside>
    </>
  );
}
