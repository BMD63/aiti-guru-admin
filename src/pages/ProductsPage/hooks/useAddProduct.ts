import { useQueryClient } from '@tanstack/react-query';

import type { Product, ProductsResponse } from '../../../entities/product/api/getProducts';
import type { CreateProductFormValues } from '../../../entities/product/schemas/createProduct.schema';

type Params = {
  queryKey: readonly unknown[];
  onClose: () => void;
  onToast: (message: string, severity?: 'success' | 'info') => void;
};

export function useAddProduct({ queryKey, onClose, onToast }: Params) {
  const queryClient = useQueryClient();

  const addProduct = (values: CreateProductFormValues) => {
    const newProduct: Product = {
      id: Date.now(),
      title: values.title,
      price: values.price,
      rating: 0,
      brand: values.brand,
    };

    queryClient.setQueryData<ProductsResponse>(queryKey, (old) => {
      if (!old) return old;
      return {
        ...old,
        products: [newProduct, ...old.products],
        total: old.total + 1,
      };
    });

    onClose();
    onToast('Товар успешно добавлен', 'success');
  };

  return { addProduct };
}