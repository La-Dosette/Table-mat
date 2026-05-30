import type { Attempt, Material, UserVote } from '../types';
import { aggregateCell, effectiveScore, scoreColor, scoreLabel } from '../lib/scoring';
import { AttemptCard } from './AttemptCard';

interface Props {
  matA: Material;
  matB: Material;
  attempts: Attempt[];
  userVotes: Record<string, UserVote>;
  onVote: (id: string, dir: 'up' | 'down') => void;
  onClose: () => void;
}

export function CellDetailDrawer({ matA, matB, attempts, userVotes, onVote, onClose }: Props) {
  const agg = aggregateCell(attempts);
  const sorted = [...attempts].sort((a, b) => effectiveScore(b) - effectiveScore(a));

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-label={`Essais ${matA.name} et ${matB.name}`}>
        <div className="drawer-head">
          <div
            className="score-ring"
            style={{ background: scoreColor(agg.score), width: 56, height: 56 }}
          >
            {agg.score}
          </div>
          <div style={{ flex: 1 }}>
            <h3>
              <span className="mat-dot" style={{ background: matA.accent }} />
              {matA.name}
              <span style={{ color: 'var(--text-faint)' }}>＋</span>
              <span className="mat-dot" style={{ background: matB.accent }} />
              {matB.name}
            </h3>
            <p className="sub">
              {scoreLabel(agg.score)} · {attempts.length} essai
              {attempts.length > 1 ? 's' : ''} · {agg.confidence} corroborations
            </p>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Fermer">
            ✕
          </button>
        </div>
        <div className="drawer-body">
          {sorted.map((a) => (
            <AttemptCard
              key={a.id}
              attempt={a}
              userVote={userVotes[a.id] ?? null}
              onVote={onVote}
            />
          ))}
        </div>
      </aside>
    </>
  );
}
