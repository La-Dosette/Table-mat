import type { MaterialId, Recipe, UserVote } from '../types';
import { getMachine, getMaterial } from '../data/materials';
import {
  CRITERIA,
  baseScore,
  communityShift,
  recipeCriteria,
  recipeScore,
  scoreColor,
} from '../lib/scoring';
import { inventoryCode } from '../lib/exportSettings';
import { useI18n } from '../lib/i18n';

interface Props {
  recipe: Recipe;
  userVote: UserVote;
  onVote: (id: string, dir: 'up' | 'down') => void;
  /** Met en évidence l'interface correspondant à cette paire (vue matrice). */
  highlightPair?: { a: MaterialId; b: MaterialId };
  /** Numéro d'inventaire stable de la recette (logique de catalogue). */
  inventoryNo?: number;
  /** Ouvre l'export des réglages pour cette recette. */
  onExport?: (recipe: Recipe) => void;
  /** Ouvre l'édition de la recette. */
  onEdit?: (recipe: Recipe) => void;
  /** Supprime la recette. */
  onDelete?: (recipe: Recipe) => void;
  /** Duplique la recette (pré-remplit une nouvelle entrée). */
  onDuplicate?: (recipe: Recipe) => void;
  /** Affiche la case « comparer ». */
  selectable?: boolean;
  /** État de sélection pour le comparateur. */
  selected?: boolean;
  /** Bascule la sélection dans le comparateur. */
  onToggleCompare?: (recipe: Recipe) => void;
}

const GLOBAL_CRITERIA = CRITERIA.filter((c) => !c.perInterface);

const PARAM_FIELDS: { key: string; get: (r: Recipe) => string | null }[] = [
  { key: 'p.bed', get: (r) => `${r.params.bedTemp}°C` },
  { key: 'p.chamber', get: (r) => (r.params.chamberTemp ? `${r.params.chamberTemp}°C` : null) },
  { key: 'p.layer', get: (r) => `${r.params.layerHeight} mm` },
  { key: 'p.speed', get: (r) => `${r.params.printSpeed} mm/s` },
  { key: 'p.nozzle', get: (r) => `${r.params.nozzleDiameter} mm` },
  { key: 'p.purge', get: (r) => (r.params.purgeVolume ? `${r.params.purgeVolume} mm³` : null) },
  { key: 'p.iface', get: (r) => (r.params.interfaceLayers ? `${r.params.interfaceLayers} c.` : null) },
];

function samePair(a1: string, b1: string, a2: string, b2: string) {
  return (a1 === a2 && b1 === b2) || (a1 === b2 && b1 === a2);
}

export function RecipeCard({
  recipe, userVote, onVote, highlightPair, inventoryNo, onExport, onEdit, onDelete,
  onDuplicate, selectable, selected, onToggleCompare,
}: Props) {
  const { t } = useI18n();
  const machine = getMachine(recipe.machineId);
  const score = recipeScore(recipe);
  const base = baseScore(recipeCriteria(recipe));
  const shift = Math.round(communityShift(recipe.votesUp, recipe.votesDown));

  return (
    <div className="attempt">
      {(inventoryNo != null || onEdit || onDelete || onDuplicate || selectable) && (
        <div className="card-meta-top">
          <span className="meta-left">
            {selectable && (
              <label className="compare-check" title={t('card.compareThis')}>
                <input
                  type="checkbox"
                  checked={!!selected}
                  onChange={() => onToggleCompare?.(recipe)}
                />
              </label>
            )}
            {inventoryNo != null && (
              <span className="inv-no">{inventoryCode(inventoryNo)}</span>
            )}
          </span>
          <span className="card-actions">
            {onDuplicate && (
              <button className="icon-btn mini-action" title={t('card.duplicate')} onClick={() => onDuplicate(recipe)}>
                ⧉
              </button>
            )}
            {onEdit && (
              <button className="icon-btn mini-action" title={t('card.edit')} onClick={() => onEdit(recipe)}>
                ✎
              </button>
            )}
            {onDelete && (
              <button
                className="icon-btn mini-action danger"
                title={t('card.delete')}
                onClick={() => {
                  if (window.confirm(t('card.confirmDelete', { title: recipe.title }))) onDelete(recipe);
                }}
              >
                🗑
              </button>
            )}
          </span>
        </div>
      )}
      <div className="attempt-top">
        <div
          className="score-ring"
          style={{ background: scoreColor(score) }}
          title={`Base ${base} ${shift >= 0 ? '+' : ''}${shift} communauté`}
        >
          {score}
        </div>
        <div className="who">
          <div className="author">{recipe.title}</div>
          <div className="meta">
            @{recipe.author} ·{' '}
            {new Date(recipe.date).toLocaleDateString('fr-FR', {
              day: 'numeric', month: 'short', year: 'numeric',
            })}
            {shift !== 0 && (
              <>
                {' · '}
                <span style={{ color: shift > 0 ? 'var(--good)' : 'var(--bad)' }}>
                  {shift > 0 ? '+' : ''}{shift} pts
                </span>
              </>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
          <span className="n-badge">{t('card.materials', { n: recipe.slots.length })}</span>
          <span className="machine-tag">{machine?.name ?? recipe.machineId}</span>
        </div>
      </div>

      {/* Chaîne des matériaux */}
      <div className="slots">
        {recipe.slots.map((s, i) => {
          const m = getMaterial(s.material);
          return (
            <span className="slot-chip" key={i}>
              <span className="mat-dot" style={{ background: m?.accent }} />
              <b>{m?.name}</b>
              {s.label ? <span className="slot-label">{s.label}</span> : null}
              <span className="slot-temp">{s.nozzleTemp}°C</span>
            </span>
          );
        })}
      </div>

      {/* Interfaces (contacts entre matériaux) */}
      <div className="ifaces">
        <div className="section-title">{t('card.interfaces')}</div>
        {recipe.interfaces.map((iface, i) => {
          const ma = getMaterial(iface.a);
          const mb = getMaterial(iface.b);
          const hot =
            highlightPair && samePair(iface.a, iface.b, highlightPair.a, highlightPair.b);
          return (
            <div className={`iface ${hot ? 'hot' : ''}`} key={i}>
              <span className="iface-pair">
                <span className="mat-dot" style={{ background: ma?.accent }} />
                {ma?.name}
                <span className="iface-link">↔</span>
                <span className="mat-dot" style={{ background: mb?.accent }} />
                {mb?.name}
              </span>
              <span className="bar">
                <i style={{ width: `${(iface.adhesion / 5) * 100}%`, background: scoreColor((iface.adhesion / 5) * 100) }} />
              </span>
              <span className="val">{iface.adhesion}/5</span>
            </div>
          );
        })}
      </div>

      {/* Critères globaux */}
      <div className="criteria">
        {GLOBAL_CRITERIA.map((c) => {
          const v = recipe.global[c.key as keyof typeof recipe.global];
          return (
            <div className="crit" key={c.key} title={t(`crit.${c.key}.help`)}>
              <span className="crit-label">{t(`crit.${c.key}.short`)}</span>
              <span className="bar">
                <i style={{ width: `${(v / 5) * 100}%`, background: scoreColor((v / 5) * 100) }} />
              </span>
              <span className="val">{v}/5</span>
            </div>
          );
        })}
      </div>

      <div className="params">
        {PARAM_FIELDS.map((f, i) => {
          const val = f.get(recipe);
          if (!val) return null;
          return (
            <div className="param" key={i}>
              <div className="k">{t(f.key)}</div>
              <div className="v">{val}</div>
            </div>
          );
        })}
      </div>

      <div className="notes">{recipe.notes}</div>

      <div className="vote-row">
        <button
          className={`vote-btn up ${userVote === 'up' ? 'active' : ''}`}
          onClick={() => onVote(recipe.id, 'up')}
        >
          {t('card.voteUp', { n: recipe.votesUp })}
        </button>
        <button
          className={`vote-btn down ${userVote === 'down' ? 'active' : ''}`}
          onClick={() => onVote(recipe.id, 'down')}
        >
          {t('card.voteDown', { n: recipe.votesDown })}
        </button>
        {onExport && (
          <button
            className="vote-btn export"
            onClick={() => onExport(recipe)}
            title={t('card.export')}
          >
            {t('card.export')}
          </button>
        )}
        <span className="vote-hint">{t('card.voteHint')}</span>
      </div>
    </div>
  );
}
