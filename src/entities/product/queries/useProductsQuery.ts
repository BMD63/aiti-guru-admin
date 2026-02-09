import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../api/getProducts';

export function useProductsQuery(params: { limit: number; skip: number }) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => getProducts(params),
    staleTime: 30_000,
  });
}
