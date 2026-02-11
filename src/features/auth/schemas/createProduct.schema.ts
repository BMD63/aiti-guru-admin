import { z } from 'zod';

export const createProductSchema = z.object({
  title: z.string().min(1, 'Обязательно'),
  price: z.coerce.number().min(0, '>= 0'),
  brand: z.string().optional(),
  sku: z.string().optional(),
});

export type CreateProductInput = z.input<typeof createProductSchema>;
export type CreateProductFormValues = z.output<typeof createProductSchema>;
