import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from '@mui/material';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { CreateProductInput } from '../../../features/auth/schemas/createProduct.schema';

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;          // ✅ было SubmitHandler
  isSubmitting: boolean;
  register: UseFormRegister<CreateProductInput>;
  errors: FieldErrors<CreateProductInput>;
};

export function AddProductDialog({ open, onClose, onSubmit, isSubmitting, register, errors }: Props) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Добавить товар</DialogTitle>

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
        <Button onClick={onClose} color="inherit" disabled={isSubmitting}>
          Отмена
        </Button>
        <Button variant="contained" onClick={onSubmit} disabled={isSubmitting}>
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
}
