import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../api/getProducts';
import { searchProducts } from '../api/searchProducts';
import { productsQueryKey } from './queryKeys';

type Params = {
  q?: string;
  limit: number;
  skip: number;
};

export function useProductsQuery(params: Params) {
  const q = (params.q ?? '').trim();
  const { limit, skip } = params;

  return useQuery({
    queryKey: productsQueryKey({ q, limit, skip }),
    queryFn: () =>
      q
        ? searchProducts({ q, limit, skip })
        : getProducts({ limit, skip }),
    staleTime: 30_000,
  });
}
