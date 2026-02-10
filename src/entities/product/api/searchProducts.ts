import { API_BASE_URL } from '../../../shared/config/api';

import type { ProductsResponse } from './getProducts';

export async function searchProducts(params: { q: string; limit: number; skip: number }): Promise<ProductsResponse> {
  const url = new URL(`${API_BASE_URL}/products/search`);
  url.searchParams.set('q', params.q);
  url.searchParams.set('limit', String(params.limit));
  url.searchParams.set('skip', String(params.skip));

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to search products');

  const data: unknown = await res.json();
  return data as ProductsResponse;
}
