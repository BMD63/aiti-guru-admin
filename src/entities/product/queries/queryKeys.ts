export type ProductsQueryParams = {
  q: string;
  limit: number;
  skip: number;
};

export const productsQueryKey = (params: ProductsQueryParams) =>
  ['products', params] as const;
