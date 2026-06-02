import { useEffect, useMemo, useRef, useState } from 'react';

interface Props {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  className?: string;
}

/**
 * Combobox éditable : champ texte libre + liste de suggestions filtrée et
 * stylée (remplace le <datalist> natif au rendu inconsistant). On peut
 * sélectionner une suggestion ou taper une valeur absente de la liste.
 * Navigable au clavier (↑/↓, Entrée, Échap).
 */
export function Combobox({ value, onChange, options, placeholder, className }: Props) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const wrapRef = useRef<HTMLDivElement>(null);

  const matches = useMemo(() => {
    const q = value.trim().toLowerCase();
    const list = q
      ? options.filter((o) => o.toLowerCase().includes(q))
      : options;
    return list.slice(0, 8);
  }, [value, options]);

  // Ferme la liste si on clique en dehors du composant.
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  function choose(v: string) {
    onChange(v);
    setOpen(false);
    setActive(-1);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setActive((a) => Math.min(a + 1, matches.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter' && open && active >= 0 && matches[active]) {
      e.preventDefault();
      choose(matches[active]);
    } else if (e.key === 'Escape') {
      setOpen(false);
      setActive(-1);
    }
  }

  return (
    <div className={`combo ${className ?? ''}`} ref={wrapRef}>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => { onChange(e.target.value); setOpen(true); setActive(-1); }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        role="combobox"
        aria-expanded={open}
        autoComplete="off"
      />
      {open && matches.length > 0 && (
        <ul className="combo-list" role="listbox">
          {matches.map((o, idx) => (
            <li
              key={o}
              role="option"
              aria-selected={idx === active}
              className={`combo-opt ${idx === active ? 'active' : ''} ${o === value ? 'chosen' : ''}`}
              onMouseEnter={() => setActive(idx)}
              onMouseDown={(e) => { e.preventDefault(); choose(o); }}
            >
              {o}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
