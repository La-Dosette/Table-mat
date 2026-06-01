import { useMemo, useState } from 'react';
import type { Recipe } from '../types';
import { SLICERS, buildSettingsText, inventoryCode } from '../lib/exportSettings';
import { useEscapeKey } from '../lib/useEscapeKey';

interface Props {
  recipe: Recipe;
  inventoryNo?: number;
  onClose: () => void;
}

export function ExportDrawer({ recipe, inventoryNo, onClose }: Props) {
  useEscapeKey(onClose);
  const [slicerId, setSlicerId] = useState(SLICERS[0].id);
  const [copied, setCopied] = useState(false);

  const slicer = SLICERS.find((s) => s.id === slicerId) ?? SLICERS[0];
  const text = useMemo(
    () => buildSettingsText(recipe, slicer, inventoryNo),
    [recipe, slicer, inventoryNo],
  );

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
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const code = inventoryNo ? inventoryCode(inventoryNo) : 'recette';
    a.href = url;
    a.download = `table-mat_${code}_${slicer.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

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
          <div className="section-title">Slicer cible</div>
          <div className="chips">
            {SLICERS.map((s) => (
              <button
                key={s.id}
                className={`chip ${s.id === slicerId ? 'active' : ''}`}
                onClick={() => setSlicerId(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="section-title" style={{ marginTop: 18 }}>
            Résumé des paramètres à appliquer
          </div>
          <pre className="export-pre">{text}</pre>

          <div className="export-actions">
            <button className="btn-secondary" onClick={download}>⤓ Télécharger .txt</button>
            <button className="btn-primary" onClick={copy}>{copied ? '✓ Copié' : '⧉ Copier'}</button>
          </div>
        </div>
      </aside>
    </>
  );
}
