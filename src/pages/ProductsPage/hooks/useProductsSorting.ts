import { useMemo } from 'react';
import type { SortingState } from '@tanstack/react-table';
import { useSearchParamsState } from '../../../shared/hooks/useSearchParamsState';

export const SORTABLE_COLUMNS = ['title', 'price', 'rating', 'brand'] as const;
export type SortableColumnId = (typeof SORTABLE_COLUMNS)[number];
export type SortOrder = 'asc' | 'desc';

export function isSortableColumn(value: string | null): value is SortableColumnId {
  return value !== null && (SORTABLE_COLUMNS as readonly string[]).includes(value);
}

export function useProductsSorting() {
  const { searchParams, set } = useSearchParamsState();

  const sortByRaw = searchParams.get('sortBy');
  const orderRaw = searchParams.get('order');

  const sortBy = isSortableColumn(sortByRaw) ? sortByRaw : null;
  const order: SortOrder = orderRaw === 'desc' ? 'desc' : 'asc';

  const sortingState: SortingState = useMemo(() => {
    if (!sortBy) return [];
    return [{ id: sortBy, desc: order === 'desc' }];
  }, [sortBy, order]);

  const toggleSort = (columnId: SortableColumnId) => {
    if (sortBy !== columnId) {
      set({ sortBy: columnId, order: 'asc', page: 1 });
      return;
    }

    if (order === 'asc') {
      set({ sortBy: columnId, order: 'desc', page: 1 });
      return;
    }

    set({ sortBy: null, order: null, page: 1 });
  };

  return {
    sortingState,
    toggleSort,
    currentSort: sortBy,
    currentOrder: order,
    sortableColumns: SORTABLE_COLUMNS,
  };
}
