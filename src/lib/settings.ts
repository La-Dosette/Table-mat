import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';

/**
 * État synchronisé avec localStorage (persiste au rechargement).
 * Le setter se comporte comme celui de useState (valeur ou updater).
 * Tolérant aux environnements sans localStorage (SSR, mode privé strict).
 */
export function useLocalStorage<T>(key: string, initial: T): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw != null ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* stockage indisponible : on ignore silencieusement */
    }
  }, [key, value]);

  return [value, setValue];
}
