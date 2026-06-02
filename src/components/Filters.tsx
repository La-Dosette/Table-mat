import type { MachineSystem, MaterialFamily } from '../types';
import { useI18n } from '../lib/i18n';

export type MaterialCount = 'all' | '2' | '3' | '4+';
export type SortKey = 'score' | 'recent' | 'votes' | 'materials';

export interface FilterState {
  query: string;
  system: MachineSystem | 'all';
  count: MaterialCount;
  hideEmpty: boolean;
  sort: SortKey;
  /** Familles de matériaux affichées dans la matrice ; vide = toutes. */
  families: MaterialFamily[];
}

const FAMILIES: { id: MaterialFamily; label: string }[] = [
  { id: 'standard', label: 'standard' },
  { id: 'technique', label: 'technique' },
  { id: 'flexible', label: 'flexible' },
  { id: 'composite', label: 'composite' },
  { id: 'haute-température', label: 'haute temp.' },
  { id: 'spécial', label: 'spécial' },
  { id: 'support', label: 'support' },
];

const SORTS: { id: SortKey; label: string }[] = [
  { id: 'score', label: 'Meilleur score' },
  { id: 'recent', label: 'Plus récentes' },
  { id: 'votes', label: 'Plus plébiscitées' },
  { id: 'materials', label: 'Plus de matériaux' },
];

const SYSTEMS: { id: MachineSystem | 'all'; label: string }[] = [
  { id: 'all', label: 'Tous systèmes' },
  { id: 'AMS', label: 'AMS / IFS / CFS' },
  { id: 'MMU', label: 'MMU' },
  { id: 'Toolchanger', label: 'Toolchanger' },
  { id: 'IDEX', label: 'IDEX' },
  { id: 'ERCF', label: 'ERCF / AFC' },
  { id: 'Dual', label: 'Double extrudeur' },
  { id: 'Palette', label: 'Palette / splice' },
];

const COUNTS: { id: MaterialCount; label: string }[] = [
  { id: 'all', label: 'Tous' },
  { id: '2', label: '2 mat.' },
  { id: '3', label: '3 mat.' },
  { id: '4+', label: '4+ mat.' },
];

interface Props {
  value: FilterState;
  onChange: (next: FilterState) => void;
  /** Affiche l'option « masquer les combinaisons vides » (vue matrice). */
  showHideEmpty: boolean;
  /** Affiche le sélecteur de tri (vue recettes). */
  showSort: boolean;
  /** Affiche les chips de famille de matériaux (vues matrice & récap). */
  showFamilies: boolean;
}

export function Filters({ value, onChange, showHideEmpty, showSort, showFamilies }: Props) {
  const { t } = useI18n();
  const sysLabel = (s: { id: MachineSystem | 'all'; label: string }) =>
    s.id === 'all' ? t('sys.all') : s.id === 'Dual' ? t('sys.Dual') : s.label;
  function toggleFamily(id: MaterialFamily) {
    const next = value.families.includes(id)
      ? value.families.filter((f) => f !== id)
      : [...value.families, id];
    onChange({ ...value, families: next });
  }
  return (
    <div className="filters">
      <label className="search">
        🔍
        <input
          type="text"
          placeholder={t('filters.search')}
          value={value.query}
          onChange={(e) => onChange({ ...value, query: e.target.value })}
        />
      </label>

      <div className="chips">
        {SYSTEMS.map((s) => (
          <button
            key={s.id}
            className={`chip ${value.system === s.id ? 'active' : ''}`}
            onClick={() => onChange({ ...value, system: s.id })}
          >
            {sysLabel(s)}
          </button>
        ))}
      </div>

      <div className="chips count-chips">
        {COUNTS.map((c) => (
          <button
            key={c.id}
            className={`chip ${value.count === c.id ? 'active' : ''}`}
            onClick={() => onChange({ ...value, count: c.id })}
          >
            {t(`count.${c.id}`)}
          </button>
        ))}
      </div>

      {showFamilies && (
        <div className="chips family-chips">
          <button
            className={`chip ${value.families.length === 0 ? 'active' : ''}`}
            onClick={() => onChange({ ...value, families: [] })}
          >
            {t('fam.all')}
          </button>
          {FAMILIES.map((f) => (
            <button
              key={f.id}
              className={`chip ${value.families.includes(f.id) ? 'active' : ''}`}
              onClick={() => toggleFamily(f.id)}
            >
              {t(`fam.${f.id}`)}
            </button>
          ))}
        </div>
      )}

      {showHideEmpty && (
        <label className="toggle">
          <input
            type="checkbox"
            checked={value.hideEmpty}
            onChange={(e) => onChange({ ...value, hideEmpty: e.target.checked })}
          />
          {t('filters.hideEmpty')}
        </label>
      )}

      {showSort && (
        <label className="sort-select">
          <span>{t('sort.label')}</span>
          <select
            value={value.sort}
            onChange={(e) => onChange({ ...value, sort: e.target.value as SortKey })}
            aria-label={t('sort.label')}
          >
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>{t(`sort.${s.id}`)}</option>
            ))}
          </select>
        </label>
      )}
    </div>
  );
}
