import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../api/getProducts';
import { searchProducts } from '../api/searchProducts';

type Params = {
  q?: string;
  limit: number;
  skip: number;
};

export function useProductsQuery(params: Params) {
  const q = (params.q ?? '').trim();

  return useQuery({
    queryKey: ['products', { ...params, q }],
    queryFn: () => (q ? searchProducts({ q, limit: params.limit, skip: params.skip }) : getProducts(params)),
    staleTime: 30_000,
  });
}
