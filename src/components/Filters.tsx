import type { MachineSystem } from '../types';

export type MaterialCount = 'all' | '2' | '3' | '4+';
export type SortKey = 'score' | 'recent' | 'votes' | 'materials';

export interface FilterState {
  query: string;
  system: MachineSystem | 'all';
  count: MaterialCount;
  hideEmpty: boolean;
  sort: SortKey;
}

const SORTS: { id: SortKey; label: string }[] = [
  { id: 'score', label: 'Meilleur score' },
  { id: 'recent', label: 'Plus récentes' },
  { id: 'votes', label: 'Plus plébiscitées' },
  { id: 'materials', label: 'Plus de matériaux' },
];

const SYSTEMS: { id: MachineSystem | 'all'; label: string }[] = [
  { id: 'all', label: 'Tous systèmes' },
  { id: 'AMS', label: 'AMS' },
  { id: 'MMU', label: 'MMU' },
  { id: 'Toolchanger', label: 'Toolchanger' },
  { id: 'IDEX', label: 'IDEX' },
  { id: 'ERCF', label: 'ERCF' },
  { id: 'Dual', label: 'Double extrudeur' },
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
}

export function Filters({ value, onChange, showHideEmpty, showSort }: Props) {
  return (
    <div className="filters">
      <label className="search">
        🔍
        <input
          type="text"
          placeholder="Rechercher…"
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
            {s.label}
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
            {c.label}
          </button>
        ))}
      </div>

      {showHideEmpty && (
        <label className="toggle">
          <input
            type="checkbox"
            checked={value.hideEmpty}
            onChange={(e) => onChange({ ...value, hideEmpty: e.target.checked })}
          />
          Masquer les combinaisons vides
        </label>
      )}

      {showSort && (
        <label className="sort-select">
          <span>Trier&nbsp;:</span>
          <select
            value={value.sort}
            onChange={(e) => onChange({ ...value, sort: e.target.value as SortKey })}
            aria-label="Trier les recettes"
          >
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </label>
      )}
    </div>
  );
}
