import type { MachineSystem } from '../types';

export interface FilterState {
  query: string;
  system: MachineSystem | 'all';
  hideEmpty: boolean;
}

const SYSTEMS: { id: MachineSystem | 'all'; label: string }[] = [
  { id: 'all', label: 'Tous systèmes' },
  { id: 'AMS', label: 'AMS' },
  { id: 'MMU', label: 'MMU' },
  { id: 'Toolchanger', label: 'Toolchanger' },
  { id: 'IDEX', label: 'IDEX' },
  { id: 'ERCF', label: 'ERCF' },
  { id: 'Dual', label: 'Double extrudeur' },
];

interface Props {
  value: FilterState;
  onChange: (next: FilterState) => void;
}

export function Filters({ value, onChange }: Props) {
  return (
    <div className="filters">
      <label className="search">
        🔍
        <input
          type="text"
          placeholder="Rechercher un filament, une marque, un auteur, une note…"
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

      <label className="toggle">
        <input
          type="checkbox"
          checked={value.hideEmpty}
          onChange={(e) => onChange({ ...value, hideEmpty: e.target.checked })}
        />
        Masquer les combinaisons vides
      </label>
    </div>
  );
}
