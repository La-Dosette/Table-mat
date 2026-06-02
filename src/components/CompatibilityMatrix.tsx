import { useState, type CSSProperties } from 'react';
import type { Material } from '../types';
import { aggregateCell, scoreColor, scoreLabelKey, type InterfacePoint } from '../lib/scoring';
import { useI18n } from '../lib/i18n';

interface Props {
  materials: Material[];
  /** Renvoie les points d'interface pour une paire (non ordonnée). */
  pointsFor: (a: string, b: string) => InterfacePoint[];
  selected: { a: string; b: string } | null;
  onSelect: (a: string, b: string) => void;
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

export function CompatibilityMatrix({ materials, pointsFor, selected, onSelect }: Props) {
  const { t } = useI18n();
  const [hover, setHover] = useState<HoverState | null>(null);

  return (
    <>
      <div className="matrix-wrap">
        <table className="matrix">
          <thead>
            <tr>
              <th className="corner">{t('matrix.corner')}</th>
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
                    ? t('matrix.cellNone', { a: rowMat.name, b: colMat.name })
                    : t('matrix.cellScore', {
                        a: rowMat.name, b: colMat.name, s: agg.score ?? 0, n: agg.recipeCount,
                      });
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
                            <span className="count">{t('cell.recipes', { n: agg.recipeCount })}</span>
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
        <span>{t('matrix.scale')}</span>
        <span>0</span>
        <div className="legend-bar" />
        <span>100</span>
        <span className="diag-key">
          <i /> {t('matrix.diag')}
        </span>
      </div>

      {hover && <MatrixTooltip hover={hover} />}
    </>
  );
}

function MatrixTooltip({ hover }: { hover: HoverState }) {
  const { t } = useI18n();
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
        <span>{t('tt.index')}</span>
        <span className="tt-score" style={{ color: scoreColor(agg.score) }}>
          {agg.score} · {t(scoreLabelKey(agg.score))}
        </span>
      </div>
      <div className="tt-row">
        <span>{t('tt.recipes')}</span>
        <span>{agg.recipeCount}</span>
      </div>
      <div className="tt-row">
        <span>{t('tt.interfaces')}</span>
        <span>{hover.points.length}</span>
      </div>
      <div className="tt-hint">{t('tt.hint')}</div>
    </div>
  );
}
