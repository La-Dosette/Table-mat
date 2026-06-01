import { useMemo, useState } from 'react';
import type { Recipe } from '../types';
import {
  SLICERS,
  buildSettingsText,
  buildChecklistText,
  recipeToJson,
  inventoryCode,
  type ExportFormat,
} from '../lib/exportSettings';
import { useEscapeKey } from '../lib/useEscapeKey';

interface Props {
  recipe: Recipe;
  inventoryNo?: number;
  onClose: () => void;
}

const FORMATS: { id: ExportFormat; label: string }[] = [
  { id: 'fiche', label: 'Fiche' },
  { id: 'checklist', label: 'Checklist' },
  { id: 'json', label: 'JSON' },
];

export function ExportDrawer({ recipe, inventoryNo, onClose }: Props) {
  useEscapeKey(onClose);
  const [slicerId, setSlicerId] = useState(SLICERS[0].id);
  const [format, setFormat] = useState<ExportFormat>('fiche');
  const [copied, setCopied] = useState(false);

  const slicer = SLICERS.find((s) => s.id === slicerId) ?? SLICERS[0];
  const text = useMemo(() => {
    if (format === 'json') return recipeToJson(recipe);
    if (format === 'checklist') return buildChecklistText(recipe, slicer, inventoryNo);
    return buildSettingsText(recipe, slicer, inventoryNo);
  }, [recipe, slicer, inventoryNo, format]);

  function copy() {
    navigator.clipboard
      ?.writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      })
      .catch(() => {});
  }

  function download() {
    const ext = format === 'json' ? 'json' : 'txt';
    const mime = format === 'json' ? 'application/json' : 'text/plain';
    const blob = new Blob([text], { type: `${mime};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const code = inventoryNo ? inventoryCode(inventoryNo) : 'recette';
    a.href = url;
    a.download = `table-mat_${code}_${format === 'json' ? 'data' : slicer.id}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const slicerDisabled = format === 'json';

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <aside className="drawer export-drawer" role="dialog" aria-label="Export des réglages">
        <div className="drawer-head">
          <div style={{ flex: 1 }}>
            <h3>⤓ Export des réglages</h3>
            <p className="sub">
              {inventoryNo ? `${inventoryCode(inventoryNo)} · ` : ''}
              {recipe.title}
            </p>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Fermer">✕</button>
        </div>

        <div className="drawer-body">
          <div className="section-title">Format</div>
          <div className="chips">
            {FORMATS.map((f) => (
              <button
                key={f.id}
                className={`chip ${f.id === format ? 'active' : ''}`}
                onClick={() => setFormat(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="section-title" style={{ marginTop: 16 }}>
            Slicer cible {slicerDisabled && <span className="hint-inline">— non requis pour le JSON</span>}
          </div>
          <div className="chips" style={{ opacity: slicerDisabled ? 0.4 : 1 }}>
            {SLICERS.map((s) => (
              <button
                key={s.id}
                className={`chip ${s.id === slicerId ? 'active' : ''}`}
                onClick={() => setSlicerId(s.id)}
                disabled={slicerDisabled}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="section-title" style={{ marginTop: 18 }}>
            {format === 'json' ? 'Données JSON (ré-importable)' : 'Résumé des paramètres à appliquer'}
          </div>
          <pre className="export-pre">{text}</pre>

          <div className="export-actions">
            <button className="btn-secondary" onClick={download}>
              ⤓ Télécharger .{format === 'json' ? 'json' : 'txt'}
            </button>
            <button className="btn-primary" onClick={copy}>{copied ? '✓ Copié' : '⧉ Copier'}</button>
          </div>
        </div>
      </aside>
    </>
  );
}
