import { useEffect } from 'react';

/** Appelle `onEscape` quand l'utilisateur appuie sur la touche Échap. */
export function useEscapeKey(onEscape: () => void): void {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === 'Escape') onEscape();
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onEscape]);
}
