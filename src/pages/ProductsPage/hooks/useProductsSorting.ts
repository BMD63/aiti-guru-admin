import { useState } from 'react';
import type { SortingState } from '@tanstack/react-table';

export function useProductsSorting() {
  const [sortingState, setSortingState] = useState<SortingState>([]);

  return {
    sortingState,
    setSortingState, 
  };
}