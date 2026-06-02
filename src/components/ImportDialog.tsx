import { useState } from 'react';
import type { Recipe } from '../types';
import { parseRecipesJson } from '../lib/exportSettings';
import { useEscapeKey } from '../lib/useEscapeKey';
import { useI18n } from '../lib/i18n';

interface Props {
  onImport: (recipes: Recipe[]) => void;
  onClose: () => void;
}

export function ImportDialog({ onImport, onClose }: Props) {
  useEscapeKey(onClose);
  const { t } = useI18n();
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
      <aside className="drawer export-drawer" role="dialog" aria-label={t('import.title')}>
        <div className="drawer-head">
          <div style={{ flex: 1 }}>
            <h3>{t('import.title')}</h3>
            <p className="sub">{t('import.sub')}</p>
          </div>
          <button className="close-btn" onClick={onClose} aria-label={t('common.close')}>✕</button>
        </div>
        <div className="drawer-body">
          <div className="section-title">{t('import.field')}</div>
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
            <button className="btn-secondary" onClick={onClose}>{t('common.cancel')}</button>
            <button className="btn-primary" onClick={handleImport} disabled={!text.trim()}>
              {t('import.do')}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
