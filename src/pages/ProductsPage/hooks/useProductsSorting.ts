import { useState, useCallback } from 'react';
import type { SortingState } from '@tanstack/react-table';
import { isSortableColumn } from '../utils/sorting';

export function useProductsSorting() {
  const [sortingState, setSortingState] = useState<SortingState>([]);

  const toggleSort = useCallback((columnId: string) => {
    if (!isSortableColumn(columnId)) return;

    setSortingState((prev) => {
      const current = prev[0];

      if (!current || current.id !== columnId) {
        return [{ id: columnId, desc: false }];
      }

      if (!current.desc) {
        return [{ id: columnId, desc: true }];
      }

      return [];
    });
  }, []);

  return {
    sortingState,
    toggleSort,
  };
}