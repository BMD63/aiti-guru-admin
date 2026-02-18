import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from '@mui/material';
import {
  createProductSchema,
  type CreateProductInput,
  type CreateProductFormValues,
} from '../../../entities/product/schemas/createProduct.schema';

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: (values: CreateProductFormValues) => void;
  isSubmitting?: boolean;
};

export function AddProductDialog({ open, onClose, onSuccess, isSubmitting = false }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateProductInput, unknown, CreateProductFormValues>({
    resolver: zodResolver(createProductSchema),
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (values: CreateProductFormValues) => {
    onSuccess(values);
    reset();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Добавить товар</DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <TextField
              label="Наименование"
              error={!!errors.title}
              helperText={errors.title?.message}
              disabled={isSubmitting}
              {...register('title')}
            />

            <TextField
              label="Цена"
              type="number"
              error={!!errors.price}
              helperText={errors.price?.message}
              disabled={isSubmitting}
              {...register('price', { valueAsNumber: true })}
            />

            <TextField
              label="Бренд"
              error={!!errors.brand}
              helperText={errors.brand?.message}
              disabled={isSubmitting}
              {...register('brand')}
            />

            <TextField
              label="Артикул"
              error={!!errors.sku}
              helperText={errors.sku?.message}
              disabled={isSubmitting}
              {...register('sku')}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="inherit" disabled={isSubmitting}>
            Отмена
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            Сохранить
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}