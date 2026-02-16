import { useQueryClient } from '@tanstack/react-query';
import type { UseFormReset } from 'react-hook-form';

import type { Product, ProductsResponse } from '../../../entities/product/api/getProducts';
import type { CreateProductFormValues, CreateProductInput } from '../../../features/auth/schemas/createProduct.schema';

type Params = {
  queryKey: readonly unknown[];
  onClose: () => void;
  onToast: (message: string, severity?: 'success' | 'info') => void;
  reset: UseFormReset<CreateProductInput>;
};

export function useAddProduct({ queryKey, onClose, onToast, reset }: Params) {
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

    reset();
    onClose();
    onToast('Товар успешно добавлен', 'success');
  };

  return { addProduct };
}
