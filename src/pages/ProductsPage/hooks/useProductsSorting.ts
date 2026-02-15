import { useMemo } from 'react';
import type { SortingState } from '@tanstack/react-table';
import { useSearchParamsState } from '../../../shared/hooks/useSearchParamsState';

const SORTABLE_COLUMNS = ['title', 'price', 'rating', 'brand'] as const;
type SortableColumn = typeof SORTABLE_COLUMNS[number];

function isSortableColumn(value: string | null): value is SortableColumn {
  return !!value && SORTABLE_COLUMNS.includes(value as SortableColumn);
}

export function useProductsSorting() {
  const { searchParams, set } = useSearchParamsState();

  const sortByRaw = searchParams.get('sortBy');
  const orderRaw = searchParams.get('order');

  const sortBy = isSortableColumn(sortByRaw) ? sortByRaw : null;
  const order = orderRaw === 'desc' ? 'desc' : 'asc';

  const sortingState: SortingState = useMemo(() => {
    if (!sortBy) return [];
    return [{ id: sortBy, desc: order === 'desc' }];
  }, [sortBy, order]);

  const toggleSort = (columnId: SortableColumn) => {
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
