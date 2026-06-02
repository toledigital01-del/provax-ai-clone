import { useState, useEffect, useRef } from 'react';

/**
 * Hook que sincroniza estado React com localStorage automaticamente.
 * Funciona como useState mas persiste os dados entre recarregamentos.
 *
 * Importante: o valor inicial é sempre `initialValue` para evitar mismatch
 * de hidratação entre SSR e cliente. Após o mount, lemos do localStorage
 * e atualizamos o estado se houver valor salvo.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const hydratedRef = useRef(false);

  // Hidrata do localStorage após o mount (cliente apenas)
  useEffect(() => {
    try {
      const item = typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
      if (item !== null) {
        setStoredValue(JSON.parse(item) as T);
      }
    } catch {
      // ignore
    } finally {
      hydratedRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      setStoredValue(prev => {
        const next = typeof value === 'function' ? (value as (prev: T) => T)(prev) : value;
        try {
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem(key, JSON.stringify(next));
          }
        } catch (e) {
          console.warn(`[useLocalStorage] Erro ao salvar "${key}":`, e);
        }
        return next;
      });
    } catch (e) {
      console.warn(`[useLocalStorage] Erro ao salvar "${key}":`, e);
    }
  };

  return [storedValue, setValue] as const;
}
