import type { Recipe } from '../types';
import { getMachine, getMaterial } from '../data/materials';
import { recipeScore, avgAdhesion, scoreColor } from '../lib/scoring';
import { inventoryCode } from '../lib/exportSettings';
import { useEscapeKey } from '../lib/useEscapeKey';
import { useI18n } from '../lib/i18n';

interface Props {
  recipes: Recipe[];
  inventoryNos: Map<string, number>;
  onClose: () => void;
}

interface Row {
  /** Clé i18n du libellé de ligne. */
  labelKey: string;
  /** Valeur numérique pour comparer (ou null si non comparable). */
  num?: (r: Recipe) => number | null;
  /** Texte affiché. */
  text: (r: Recipe) => string;
  /** Mettre en avant la plus grande valeur. */
  best?: boolean;
  /** Colorer la cellule selon un score 0–100. */
  scored?: (r: Recipe) => number;
}

const ROWS: Row[] = [
  { labelKey: 'cmp.index', num: (r) => recipeScore(r), text: (r) => String(recipeScore(r)), best: true, scored: (r) => recipeScore(r) },
  { labelKey: 'cmp.adhesion', num: (r) => avgAdhesion(r), text: (r) => `${avgAdhesion(r).toFixed(1)}/5`, best: true },
  { labelKey: 'crit.printQuality.short', num: (r) => r.global.printQuality, text: (r) => `${r.global.printQuality}/5`, best: true },
  { labelKey: 'crit.reliability.short', num: (r) => r.global.reliability, text: (r) => `${r.global.reliability}/5`, best: true },
  { labelKey: 'crit.warpResistance.short', num: (r) => r.global.warpResistance, text: (r) => `${r.global.warpResistance}/5`, best: true },
  { labelKey: 'crit.interfaceCleanliness.short', num: (r) => r.global.interfaceCleanliness, text: (r) => `${r.global.interfaceCleanliness}/5`, best: true },
  { labelKey: 'crit.separability.short', num: (r) => r.global.separability, text: (r) => `${r.global.separability}/5`, best: true },
  { labelKey: 'cmp.votesNet', num: (r) => r.votesUp - r.votesDown, text: (r) => `${r.votesUp - r.votesDown >= 0 ? '+' : ''}${r.votesUp - r.votesDown}`, best: true },
  { labelKey: 'cmp.materials', num: (r) => r.slots.length, text: (r) => String(r.slots.length) },
  { labelKey: 'cmp.machine', text: (r) => getMachine(r.machineId)?.name ?? r.machineId },
  { labelKey: 'p.bed', text: (r) => `${r.params.bedTemp} °C` },
  { labelKey: 'p.chamber', text: (r) => (r.params.chamberTemp ? `${r.params.chamberTemp} °C` : '—') },
  { labelKey: 'p.layer', text: (r) => `${r.params.layerHeight} mm` },
  { labelKey: 'p.speed', text: (r) => `${r.params.printSpeed} mm/s` },
  { labelKey: 'p.nozzle', text: (r) => `${r.params.nozzleDiameter} mm` },
  { labelKey: 'p.purge', text: (r) => (r.params.purgeVolume ? `${r.params.purgeVolume} mm³` : '—') },
  { labelKey: 'p.iface', text: (r) => (r.params.interfaceLayers ? `${r.params.interfaceLayers} c.` : '—') },
];

export function ComparatorPanel({ recipes, inventoryNos, onClose }: Props) {
  useEscapeKey(onClose);
  const { t } = useI18n();

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <div className="comparator" role="dialog" aria-label={t('cmp.title')}>
        <div className="comparator-head">
          <div style={{ flex: 1 }}>
            <h3>{t('cmp.title')}</h3>
            <p className="sub">{t('cmp.sub', { n: recipes.length })}</p>
          </div>
          <button className="close-btn" onClick={onClose} aria-label={t('common.close')}>✕</button>
        </div>
        <div className="comparator-body">
          <table className="compare-table">
            <thead>
              <tr>
                <th className="row-label">—</th>
                {recipes.map((r) => (
                  <th key={r.id}>
                    <span className="cmp-inv">{inventoryNos.get(r.id) != null ? inventoryCode(inventoryNos.get(r.id)!) : ''}</span>
                    <span className="cmp-title">{r.title}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => {
                // Déterminer la (les) meilleure(s) valeur(s) de la ligne.
                let bestVal = -Infinity;
                if (row.best && row.num) {
                  for (const r of recipes) {
                    const v = row.num(r);
                    if (v != null && v > bestVal) bestVal = v;
                  }
                }
                return (
                  <tr key={row.labelKey}>
                    <th className="row-label">{t(row.labelKey)}</th>
                    {recipes.map((r) => {
                      const isBest =
                        row.best && row.num && recipes.length > 1 && row.num(r) === bestVal && bestVal !== -Infinity;
                      const style = row.scored
                        ? { color: scoreColor(row.scored(r)), fontWeight: 800 }
                        : undefined;
                      return (
                        <td key={r.id} className={isBest ? 'cmp-best' : ''}>
                          <span style={style}>{row.text(r)}</span>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
