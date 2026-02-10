import { API_BASE_URL } from '../../../shared/config/api';

export type Product = {
  id: number;
  title: string;
  price: number;
  rating: number;
  brand?: string;
  sku?: string;
  category?: string;
  thumbnail?: string;
};

export type ProductsResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};

export async function getProducts(params: { limit: number; skip: number }): Promise<ProductsResponse> {
  const url = new URL(`${API_BASE_URL}/products`);
  url.searchParams.set('limit', String(params.limit));
  url.searchParams.set('skip', String(params.skip));

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to load products');

  const data: unknown = await res.json();
  return data as ProductsResponse;
}
