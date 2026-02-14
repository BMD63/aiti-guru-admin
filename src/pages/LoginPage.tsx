import { Divider, FormField, LogoBadge } from './LoginPage/components';
import { LOGIN_UI } from './LoginPage/constants';
import { useLoginForm } from './LoginPage/hooks/useLoginForm';

import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { loginSchema, type LoginFormValues } from '../features/auth/schemas/login.schema';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'message' in error) {
    const msg = (error as { message?: unknown }).message;
    if (typeof msg === 'string') return msg;
  }
  return 'Не удалось выполнить вход';
}

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { remember: false },
  });

  const { mutation } = useLoginForm();
  const onSubmit = (values: LoginFormValues) => mutation.mutate(values);

  return (
  <Box
    sx={{
      minHeight: '100vh',
      bgcolor: '#F5F6F8',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 3,
    }}
  >
    {/* Outer frame (radius 40) */}
    <Box
      sx={{
        borderRadius: '40px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
        p: '6px',
      }}
    >
      {/* Inner frame (radius 34) */}
      <Box
        sx={{
          width: LOGIN_UI.innerWidth,
minHeight: LOGIN_UI.innerMinHeight,
borderRadius: `${LOGIN_UI.innerRadius}px`,
          background: `
            linear-gradient(
              180deg,
              rgba(35, 35, 35, 0.06) 0%,
              rgba(35, 35, 35, 0) 50%
            ),
            #FFFFFF
          `,
          p: `${LOGIN_UI.innerPadding}px`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Stack sx={{ width: '100%', gap: '32px', alignItems: 'center' }}>
          {/* Logo badge */}
          <LogoBadge />
          {/* Title + subtitle */}
          <Box sx={{ width: '100%' }}>
            <Typography sx={{ fontSize: 20, fontWeight: 700, textAlign: 'center' }}>
              Добро пожаловать!
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 1 }}>
              Пожалуйста, авторизируйтесь
            </Typography>
          </Box>

          {mutation.isError && <Alert severity="error">{getErrorMessage(mutation.error)}</Alert>}


          {/* Form */}
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ width: '100%' }}
            noValidate
          >
             <Stack sx={{ width: '100%', maxWidth: 399, mx: 'auto', gap: 2 }}>
              <FormField
                label="Логин"
                autoFocus
                autoComplete="username"
                placeholder="test"
                error={!!errors.username}
                helperText={errors.username?.message}
                disabled={mutation.isPending}
                {...register('username')}
                startAdornment={
                  <InputAdornment position="start">
                    <PersonOutlineIcon fontSize="small" />
                  </InputAdornment>
                }
              />


              <Box sx={{ width: '100%' }}>
                <Typography sx={{
                  fontStyle: 'normal',
                  fontWeight: 500,
                  fontSize: 18,
                  lineHeight: '150%',
                  letterSpacing: '-0.015em',
                  color: '#232323',
                  mb: 1,
                }}>
                  Пароль
                </Typography>

                <TextField
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  disabled={mutation.isPending}
                  size="small"
                  sx={{
                    width: '100%',
                    '& .MuiOutlinedInput-root': { borderRadius: 2, height: 44 },
                  }}
                  {...register('password')}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlinedIcon fontSize="small" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            type="button"

                            edge="end"
                            onClick={() => setShowPassword((v) => !v)}
                            disabled={mutation.isPending}
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Box>
                <FormField
                  label="Пароль"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  disabled={mutation.isPending}
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
                        disabled={mutation.isPending}
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  }
                />


              <FormControlLabel
                sx={{ color: 'text.secondary', '& .MuiFormControlLabel-label': { fontSize: 13 } }}
                control={<Checkbox disabled={mutation.isPending} {...register('remember')} />}
                label="Запомнить данные"
              />

              <Button
                type="submit"
                variant="contained"
                disabled={mutation.isPending}
                fullWidth
                size="large"
                sx={{ borderRadius: 2, height: 44, textTransform: 'none', fontWeight: 600 }}
              >
                Войти
              </Button>
            </Stack>
          </Box>

          {/* Divider "или" */}
          <Divider />
          {/* Bottom link */}
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            Нет аккаунта?{' '}
            <Box component="span" sx={{ color: 'primary.main', fontWeight: 600, cursor: 'pointer' }}>
              Создать
            </Box>
          </Typography>
        </Stack>
      </Box>
    </Box>
  </Box>
);


}
