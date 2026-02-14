import { useState } from 'react';
import type { SubmitEventHandler } from 'react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

import { Box, Button, Checkbox, FormControlLabel, IconButton, InputAdornment, Stack } from '@mui/material';

import type { LoginFormValues } from '../../../features/auth/schemas/login.schema';
import { FormField } from './FormField';

type Props = {
  onSubmit: SubmitEventHandler<HTMLFormElement>;
  register: UseFormRegister<LoginFormValues>;
  errors: FieldErrors<LoginFormValues>;
  isPending: boolean;
};

export function LoginForm({ onSubmit, register, errors, isPending }: Props) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Box component="form" onSubmit={onSubmit} sx={{ width: '100%' }} noValidate>
      <Stack sx={{ width: '100%', maxWidth: 399, mx: 'auto', gap: 2 }}>
        <FormField
          label="Логин"
          autoFocus
          autoComplete="username"
          placeholder="test"
          error={!!errors.username}
          helperText={errors.username?.message}
          disabled={isPending}
          {...register('username')}
          startAdornment={
            <InputAdornment position="start">
              <PersonOutlineIcon fontSize="small" />
            </InputAdornment>
          }
        />

        <FormField
          label="Пароль"
          autoComplete="current-password"
          placeholder="••••••••"
          type={showPassword ? 'text' : 'password'}
          error={!!errors.password}
          helperText={errors.password?.message}
          disabled={isPending}
          {...register('password')}
          startAdornment={
            <InputAdornment position="start">
              <LockOutlinedIcon fontSize="small" />
            </InputAdornment>
          }
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                type="button"
                edge="end"
                aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                aria-pressed={showPassword}
                onClick={() => setShowPassword((v) => !v)}
                disabled={isPending}
              >
                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </InputAdornment>
          }
        />

        <FormControlLabel
          control={<Checkbox disabled={isPending} {...register('remember')} />}
          label="Запомнить данные"
        />

        <Button
          type="submit"
          variant="contained"
          disabled={isPending}
          fullWidth
          size="large"
          sx={{ borderRadius: 2, height: 44, textTransform: 'none', fontWeight: 600 }}
        >
          Войти
        </Button>
      </Stack>
    </Box>
  );
}
