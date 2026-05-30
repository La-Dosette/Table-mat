import type { Attempt, UserVote } from '../types';
import { getMachine, getMaterial } from '../data/materials';
import {
  CRITERIA,
  baseScore,
  communityShift,
  effectiveScore,
  scoreColor,
} from '../lib/scoring';

interface Props {
  attempt: Attempt;
  userVote: UserVote;
  onVote: (id: string, dir: 'up' | 'down') => void;
}

const PARAM_FIELDS: { key: string; label: string; fmt: (a: Attempt) => string | null }[] = [
  { key: 'tA', label: 'Buse A', fmt: (a) => `${a.params.nozzleTempA}°C` },
  { key: 'tB', label: 'Buse B', fmt: (a) => `${a.params.nozzleTempB}°C` },
  { key: 'bed', label: 'Plateau', fmt: (a) => `${a.params.bedTemp}°C` },
  { key: 'chamber', label: 'Caisson', fmt: (a) => (a.params.chamberTemp ? `${a.params.chamberTemp}°C` : null) },
  { key: 'lh', label: 'Couche', fmt: (a) => `${a.params.layerHeight} mm` },
  { key: 'spd', label: 'Vitesse', fmt: (a) => `${a.params.printSpeed} mm/s` },
  { key: 'nz', label: 'Buse Ø', fmt: (a) => `${a.params.nozzleDiameter} mm` },
  { key: 'purge', label: 'Purge', fmt: (a) => (a.params.purgeVolume ? `${a.params.purgeVolume} mm³` : null) },
  { key: 'iface', label: 'Interface', fmt: (a) => (a.params.interfaceLayers ? `${a.params.interfaceLayers} c.` : null) },
];

export function AttemptCard({ attempt, userVote, onVote }: Props) {
  const machine = getMachine(attempt.machineId);
  const matA = getMaterial(attempt.materialA);
  const matB = getMaterial(attempt.materialB);
  const score = effectiveScore(attempt);
  const shift = Math.round(communityShift(attempt));
  const base = baseScore(attempt.ratings);

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
          <div className="author">@{attempt.author}</div>
          <div className="meta">
            {new Date(attempt.date).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
            {shift !== 0 && (
              <>
                {' · '}
                <span style={{ color: shift > 0 ? 'var(--good)' : 'var(--bad)' }}>
                  {shift > 0 ? '+' : ''}
                  {shift} pts communauté
                </span>
              </>
            )}
          </div>
        </div>
        <span className="machine-tag">{machine?.name ?? attempt.machineId}</span>
      </div>

      <div className="brands">
        <span className="brand-chip">
          <span className="mat-dot" style={{ background: matA?.accent }} />
          {matA?.name} · {attempt.brandA}
        </span>
        <span className="arrow">＋</span>
        <span className="brand-chip">
          <span className="mat-dot" style={{ background: matB?.accent }} />
          {matB?.name} · {attempt.brandB}
        </span>
      </div>

      <div className="criteria">
        {CRITERIA.map((c) => {
          const v = attempt.ratings[c.key];
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
        {PARAM_FIELDS.map((f) => {
          const val = f.fmt(attempt);
          if (!val) return null;
          return (
            <div className="param" key={f.key}>
              <div className="k">{f.label}</div>
              <div className="v">{val}</div>
            </div>
          );
        })}
      </div>

      <div className="notes">{attempt.notes}</div>

      <div className="vote-row">
        <button
          className={`vote-btn up ${userVote === 'up' ? 'active' : ''}`}
          onClick={() => onVote(attempt.id, 'up')}
        >
          👍 Ça marche · {attempt.votesUp}
        </button>
        <button
          className={`vote-btn down ${userVote === 'down' ? 'active' : ''}`}
          onClick={() => onVote(attempt.id, 'down')}
        >
          👎 Pas concluant · {attempt.votesDown}
        </button>
        <span className="vote-hint">votez si vous avez reproduit ce réglage</span>
      </div>
    </div>
  );
}
