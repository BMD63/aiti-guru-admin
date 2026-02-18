import { useCallback, useMemo, useState } from 'react';
import type { Product } from '../../../entities/product/api/getProducts';

export function useProductsSelection(products: Product[]) {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const currentIds = useMemo(() => products.map((p) => p.id), [products]);

  const allChecked =
    currentIds.length > 0 && currentIds.every((id) => selectedIds.has(id));

  const someChecked =
    currentIds.some((id) => selectedIds.has(id)) && !allChecked;

  const toggleAllCurrent = useCallback(() => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allChecked) {
        currentIds.forEach((id) => next.delete(id));
      } else {
        currentIds.forEach((id) => next.add(id));
      }
      return next;
    });
  }, [allChecked, currentIds]);

  const toggleOne = useCallback((id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return {
    selectedIds,
    allChecked,
    someChecked,
    toggleAllCurrent,
    toggleOne,
  };
}