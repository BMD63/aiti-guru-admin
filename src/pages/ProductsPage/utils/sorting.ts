export const SORTABLE_COLUMNS = ['title', 'price', 'rating', 'brand'] as const;

export type SortableColumn = typeof SORTABLE_COLUMNS[number];

export function isSortableColumn(columnId: string|null): columnId is SortableColumn {
  return SORTABLE_COLUMNS.includes(columnId as SortableColumn);
}