import type { Material } from '../types';
import { scoreColor, scoreLabelKey } from '../lib/scoring';
import { useI18n } from '../lib/i18n';

/** Meilleur partenaire (matériau différent) trouvé pour un matériau donné. */
export interface BestPartner {
  partner: Material;
  score: number;
  recipeCount: number;
}

export interface DigestEntry {
  material: Material;
  best: BestPartner | null;
}

interface Props {
  entries: DigestEntry[];
  /** Ouvre le détail de la liaison material ↔ partenaire. */
  onSelect: (a: string, b: string) => void;
}

export function MaterialDigest({ entries, onSelect }: Props) {
  const { t } = useI18n();
  return (
    <div className="digest">
      {entries.map(({ material, best }) => (
        <div className="digest-card" key={material.id}>
          <div className="digest-head">
            <span className="mat-dot" style={{ background: material.accent }} />
            <b>{material.name}</b>
            <span className="digest-full">{material.fullName}</span>
          </div>

          {best ? (
            <button
              type="button"
              className="digest-best"
              onClick={() => onSelect(material.id, best.partner.id)}
              aria-label={t('digest.bestAria', { m: material.name, p: best.partner.name, s: best.score })}
            >
              <span className="digest-label">{t('digest.bestPartner')}</span>
              <span className="digest-partner">
                <span className="mat-dot" style={{ background: best.partner.accent }} />
                {best.partner.name}
              </span>
              <span className="digest-meta">
                <span className="digest-pill" style={{ background: scoreColor(best.score) }}>
                  {best.score}
                </span>
                <span className="digest-sub">
                  {t('digest.sub', { label: t(scoreLabelKey(best.score)), n: best.recipeCount })}
                </span>
              </span>
            </button>
          ) : (
            <div className="digest-empty">{t('digest.none')}</div>
          )}
        </div>
      ))}
    </div>
  );
}
