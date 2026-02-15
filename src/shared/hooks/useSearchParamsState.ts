import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

type SetterValue = string | number | boolean | null | undefined;

function toStringValue(v: SetterValue): string | null {
  if (v === null || v === undefined) return null;
  if (typeof v === 'boolean') return v ? '1' : '0';
  return String(v);
}

export function useSearchParamsState() {
  const [searchParams, setSearchParams] = useSearchParams();

  const get = useCallback(
    (key: string) => searchParams.get(key),
    [searchParams],
  );

  const getNumber = useCallback(
    (key: string, fallback: number) => {
      const raw = searchParams.get(key);
      if (!raw) return fallback;
      const n = Number(raw);
      return Number.isFinite(n) ? n : fallback;
    },
    [searchParams],
  );

  const set = useCallback(
    (patch: Record<string, SetterValue>, options?: { replace?: boolean }) => {
      setSearchParams(
        (prev) => {
          const sp = new URLSearchParams(prev);

          Object.entries(patch).forEach(([key, value]) => {
            const str = toStringValue(value);
            if (str === null) sp.delete(key);
            else sp.set(key, str);
          });

          return sp;
        },
        options,
      );
    },
    [setSearchParams],
  );

  const del = useCallback(
    (keys: string[], options?: { replace?: boolean }) => {
      setSearchParams(
        (prev) => {
          const sp = new URLSearchParams(prev);
          keys.forEach((k) => sp.delete(k));
          return sp;
        },
        options,
      );
    },
    [setSearchParams],
  );

  const api = useMemo(
    () => ({
      searchParams,
      get,
      getNumber,
      set,
      del,
    }),
    [searchParams, get, getNumber, set, del],
  );

  return api;
}
