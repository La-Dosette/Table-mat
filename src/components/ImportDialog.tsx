import { useState } from 'react';
import type { Recipe } from '../types';
import { parseRecipesJson } from '../lib/exportSettings';
import { useEscapeKey } from '../lib/useEscapeKey';

interface Props {
  onImport: (recipes: Recipe[]) => void;
  onClose: () => void;
}

export function ImportDialog({ onImport, onClose }: Props) {
  useEscapeKey(onClose);
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  function handleImport() {
    try {
      const recipes = parseRecipesJson(text);
      onImport(recipes);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Import impossible.');
    }
  }

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <aside className="drawer export-drawer" role="dialog" aria-label="Importer une recette">
        <div className="drawer-head">
          <div style={{ flex: 1 }}>
            <h3>⇪ Importer une recette</h3>
            <p className="sub">Colle un JSON exporté depuis TM (une recette ou une collection).</p>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Fermer">✕</button>
        </div>
        <div className="drawer-body">
          <div className="section-title">JSON de la recette</div>
          <textarea
            className="import-area"
            value={text}
            onChange={(e) => { setText(e.target.value); setError(''); }}
            placeholder='{ "_format": "tm/recipe@1", "title": "…", "slots": [...], "interfaces": [...] }'
            rows={14}
            spellCheck={false}
          />
          {error && <p className="form-error">{error}</p>}
          <div className="export-actions">
            <button className="btn-secondary" onClick={onClose}>Annuler</button>
            <button className="btn-primary" onClick={handleImport} disabled={!text.trim()}>
              ⇪ Importer
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
