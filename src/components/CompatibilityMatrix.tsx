import { useState } from 'react';
import type { Attempt, Material } from '../types';
import { aggregateCell, scoreColor, scoreLabel } from '../lib/scoring';

interface Props {
  materials: Material[];
  /** Renvoie les essais d'une paire (non ordonnée) de matériaux. */
  attemptsFor: (a: string, b: string) => Attempt[];
  selected: { a: string; b: string } | null;
  onSelect: (a: string, b: string) => void;
}

interface HoverState {
  a: Material;
  b: Material;
  x: number;
  y: number;
  attempts: Attempt[];
}

export function CompatibilityMatrix({ materials, attemptsFor, selected, onSelect }: Props) {
  const [hover, setHover] = useState<HoverState | null>(null);

  return (
    <>
      <div className="matrix-wrap">
        <table className="matrix">
          <thead>
            <tr>
              <th className="corner">Mat. A ＼ Mat. B</th>
              {materials.map((m) => (
                <th key={m.id}>
                  <span className="mat-head">
                    <span className="mat-dot" style={{ background: m.accent }} />
                    {m.name}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {materials.map((rowMat) => (
              <tr key={rowMat.id}>
                <th className="row-head">
                  <span className="mat-head">
                    <span className="mat-dot" style={{ background: rowMat.accent }} />
                    {rowMat.name}
                  </span>
                </th>
                {materials.map((colMat) => {
                  const attempts = attemptsFor(rowMat.id, colMat.id);
                  const agg = aggregateCell(attempts);
                  const isDiag = rowMat.id === colMat.id;
                  const isSelected =
                    !!selected &&
                    ((selected.a === rowMat.id && selected.b === colMat.id) ||
                      (selected.a === colMat.id && selected.b === rowMat.id));
                  const empty = attempts.length === 0;
                  return (
                    <td key={colMat.id}>
                      <div
                        className={[
                          'cell',
                          empty ? 'empty' : '',
                          isDiag ? 'diag' : '',
                          isSelected ? 'selected' : '',
                        ].join(' ')}
                        style={{ background: scoreColor(agg.score) }}
                        onMouseEnter={(e) =>
                          !empty &&
                          setHover({
                            a: rowMat,
                            b: colMat,
                            x: e.clientX,
                            y: e.clientY,
                            attempts,
                          })
                        }
                        onMouseMove={(e) =>
                          setHover((h) => (h ? { ...h, x: e.clientX, y: e.clientY } : h))
                        }
                        onMouseLeave={() => setHover(null)}
                        onClick={() => !empty && onSelect(rowMat.id, colMat.id)}
                      >
                        {empty ? (
                          <span className="count">—</span>
                        ) : (
                          <>
                            <span className="score">{agg.score}</span>
                            <span className="count">
                              {attempts.length} essai{attempts.length > 1 ? 's' : ''}
                            </span>
                          </>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="legend">
        <span>Score de viabilité&nbsp;:</span>
        <span>0</span>
        <div className="legend-bar" />
        <span>100</span>
        <span className="diag-key">
          <i /> diagonale = même matériau (multicolore)
        </span>
      </div>

      {hover && <MatrixTooltip hover={hover} />}
    </>
  );
}

function MatrixTooltip({ hover }: { hover: HoverState }) {
  const agg = aggregateCell(hover.attempts);
  const top = [...hover.attempts].sort((a, b) => b.votesUp - a.votesUp)[0];
  // Décale la tooltip pour ne pas masquer le curseur, en restant dans l'écran.
  const left = Math.min(hover.x + 16, window.innerWidth - 266);
  const tTop = Math.min(hover.y + 16, window.innerHeight - 190);
  return (
    <div className="tooltip" style={{ left, top: tTop }}>
      <h4>
        <span className="mat-dot" style={{ background: hover.a.accent }} />
        {hover.a.name}
        <span style={{ color: 'var(--text-faint)' }}>＋</span>
        <span className="mat-dot" style={{ background: hover.b.accent }} />
        {hover.b.name}
      </h4>
      <div className="tt-row">
        <span>Score communautaire</span>
        <span className="tt-score" style={{ color: scoreColor(agg.score) }}>
          {agg.score} · {scoreLabel(agg.score)}
        </span>
      </div>
      <div className="tt-row">
        <span>Essais partagés</span>
        <span>{hover.attempts.length}</span>
      </div>
      <div className="tt-row">
        <span>Corroborations</span>
        <span>{agg.confidence}</span>
      </div>
      {top && (
        <div className="tt-row">
          <span>Meilleur réglage</span>
          <span>
            {top.params.nozzleTempA}/{top.params.nozzleTempB}°C
          </span>
        </div>
      )}
      <div className="tt-hint">Cliquez pour voir tous les essais et leurs paramètres →</div>
    </div>
  );
}
