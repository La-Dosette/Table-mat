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

interface Props {
  recipe: Recipe;
  userVote: UserVote;
  onVote: (id: string, dir: 'up' | 'down') => void;
  /** Met en évidence l'interface correspondant à cette paire (vue matrice). */
  highlightPair?: { a: MaterialId; b: MaterialId };
}

const GLOBAL_CRITERIA = CRITERIA.filter((c) => !c.perInterface);

const PARAM_FIELDS: { label: string; get: (r: Recipe) => string | null }[] = [
  { label: 'Plateau', get: (r) => `${r.params.bedTemp}°C` },
  { label: 'Caisson', get: (r) => (r.params.chamberTemp ? `${r.params.chamberTemp}°C` : null) },
  { label: 'Couche', get: (r) => `${r.params.layerHeight} mm` },
  { label: 'Vitesse', get: (r) => `${r.params.printSpeed} mm/s` },
  { label: 'Buse Ø', get: (r) => `${r.params.nozzleDiameter} mm` },
  { label: 'Purge', get: (r) => (r.params.purgeVolume ? `${r.params.purgeVolume} mm³` : null) },
  { label: 'Interface', get: (r) => (r.params.interfaceLayers ? `${r.params.interfaceLayers} c.` : null) },
];

function samePair(a1: string, b1: string, a2: string, b2: string) {
  return (a1 === a2 && b1 === b2) || (a1 === b2 && b1 === a2);
}

export function RecipeCard({ recipe, userVote, onVote, highlightPair }: Props) {
  const machine = getMachine(recipe.machineId);
  const score = recipeScore(recipe);
  const base = baseScore(recipeCriteria(recipe));
  const shift = Math.round(communityShift(recipe.votesUp, recipe.votesDown));

  return (
    <div className="attempt">
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
          <span className="n-badge">{recipe.slots.length} matériaux</span>
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

      {/* Interfaces (liaisons) */}
      <div className="ifaces">
        <div className="section-title">Liaisons</div>
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
            <div className="crit" key={c.key} title={c.help}>
              <span className="crit-label">{c.short}</span>
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
              <div className="k">{f.label}</div>
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
          👍 Ça marche · {recipe.votesUp}
        </button>
        <button
          className={`vote-btn down ${userVote === 'down' ? 'active' : ''}`}
          onClick={() => onVote(recipe.id, 'down')}
        >
          👎 Pas concluant · {recipe.votesDown}
        </button>
        <span className="vote-hint">votez si vous avez reproduit cette recette</span>
      </div>
    </div>
  );
}
