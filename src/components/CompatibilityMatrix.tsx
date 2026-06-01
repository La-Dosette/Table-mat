import { useState, type CSSProperties } from 'react';
import type { Material } from '../types';
import { aggregateCell, scoreColor, scoreLabel, type InterfacePoint } from '../lib/scoring';

interface Props {
  materials: Material[];
  /** Renvoie les points d'interface pour une paire (non ordonnée). */
  pointsFor: (a: string, b: string) => InterfacePoint[];
  selected: { a: string; b: string } | null;
  onSelect: (a: string, b: string) => void;
  /** Nombre de recettes prises en compte (affiché dans le cartouche). */
  recipeCount?: number;
}

/** Indice d'inventaire d'un axe, ex. 0 -> "01". */
function axisIdx(i: number): string {
  return String(i + 1).padStart(2, '0');
}

interface HoverState {
  a: Material;
  b: Material;
  x: number;
  y: number;
  points: InterfacePoint[];
}

export function CompatibilityMatrix({ materials, pointsFor, selected, onSelect, recipeCount }: Props) {
  const [hover, setHover] = useState<HoverState | null>(null);
  const today = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <>
      <div className="matrix-wrap">
        <div className="matrix-caption">
          <span className="fig">FIG. 01</span>
          <span>réf. interne · barème 0–100</span>
          <span className="matrix-ref">TM·MAT</span>
        </div>
        <table className="matrix">
          <thead>
            <tr>
              <th className="corner">Mat. A ＼ Mat. B</th>
              {materials.map((m, i) => (
                <th key={m.id}>
                  <span className="axis-idx">{axisIdx(i)}</span>
                  <span className="mat-head">
                    <span className="mat-dot" style={{ background: m.accent }} />
                    {m.name}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {materials.map((rowMat, rowIndex) => (
              <tr key={rowMat.id}>
                <th className="row-head">
                  <span className="mat-head">
                    <span className="mat-dot" style={{ background: rowMat.accent }} />
                    {rowMat.name}
                    <span className="axis-idx">{axisIdx(rowIndex)}</span>
                  </span>
                </th>
                {materials.map((colMat, colIndex) => {
                  const points = pointsFor(rowMat.id, colMat.id);
                  const agg = aggregateCell(points);
                  const isDiag = rowMat.id === colMat.id;
                  const isSelected =
                    !!selected &&
                    ((selected.a === rowMat.id && selected.b === colMat.id) ||
                      (selected.a === colMat.id && selected.b === rowMat.id));
                  const empty = points.length === 0;
                  const label = empty
                    ? `${rowMat.name} ↔ ${colMat.name} : aucun essai`
                    : `${rowMat.name} ↔ ${colMat.name} : indice ${agg.score}, ${agg.recipeCount} recette${
                        agg.recipeCount > 1 ? 's' : ''
                      }`;
                  return (
                    <td key={colMat.id}>
                      <button
                        type="button"
                        className={[
                          'cell',
                          empty ? 'empty' : '',
                          isDiag ? 'diag' : '',
                          isSelected ? 'selected' : '',
                        ].join(' ')}
                        style={{
                          background: scoreColor(agg.score),
                          ['--cell-i' as string]: rowIndex + colIndex,
                        } as CSSProperties}
                        disabled={empty}
                        aria-label={label}
                        aria-pressed={isSelected}
                        onMouseEnter={(e) =>
                          !empty &&
                          setHover({ a: rowMat, b: colMat, x: e.clientX, y: e.clientY, points })
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
                              {agg.recipeCount} recette{agg.recipeCount > 1 ? 's' : ''}
                            </span>
                          </>
                        )}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="legend">
        <span>Barème&nbsp;:</span>
        <span>0</span>
        <div className="legend-bar" />
        <span>100</span>
        <span className="diag-key">
          <i /> diagonale = même axe
        </span>
      </div>

      <div className="matrix-cartouche">
        <span><i>réf.</i> TM·MAT-01</span>
        <span><i>date</i> {today}</span>
        <span><i>échelle</i> 1:1</span>
        <span><i>axes</i> {materials.length}</span>
        <span><i>entrées</i> {recipeCount ?? '—'}</span>
      </div>

      {hover && <MatrixTooltip hover={hover} />}
    </>
  );
}

function MatrixTooltip({ hover }: { hover: HoverState }) {
  const agg = aggregateCell(hover.points);
  const left = Math.min(hover.x + 16, window.innerWidth - 266);
  const tTop = Math.min(hover.y + 16, window.innerHeight - 190);
  return (
    <div className="tooltip" style={{ left, top: tTop }}>
      <h4>
        <span className="mat-dot" style={{ background: hover.a.accent }} />
        {hover.a.name}
        <span style={{ color: 'var(--text-faint)' }}>↔</span>
        <span className="mat-dot" style={{ background: hover.b.accent }} />
        {hover.b.name}
      </h4>
      <div className="tt-row">
        <span>Indice de compatibilité</span>
        <span className="tt-score" style={{ color: scoreColor(agg.score) }}>
          {agg.score} · {scoreLabel(agg.score)}
        </span>
      </div>
      <div className="tt-row">
        <span>Recettes concernées</span>
        <span>{agg.recipeCount}</span>
      </div>
      <div className="tt-row">
        <span>Interfaces notées</span>
        <span>{hover.points.length}</span>
      </div>
      <div className="tt-hint">Cliquez pour voir les recettes et leurs réglages →</div>
    </div>
  );
}
