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
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { loginSchema, type LoginFormValues } from '../features/auth/schemas/login.schema';
import { login } from '../features/auth/api/login';
import { useAuth } from '../features/auth/useAuth';

export function LoginPage() {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { remember: false },
  });

  const mutation = useMutation({
    mutationFn: (values: LoginFormValues) =>
      login({
        username: values.username,
        password: values.password,
        expiresInMins: 60,
      }),
    onSuccess: (data, values) => {
      setSession(data.accessToken, !!values.remember);
      navigate('/products', { replace: true });
    },
  });

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
          width: 515,
          minHeight: 704,
          borderRadius: '34px',
          background: `
            linear-gradient(
              180deg,
              rgba(35, 35, 35, 0.06) 0%,
              rgba(35, 35, 35, 0) 50%
            ),
            #FFFFFF
          `,
          p: '48px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Stack sx={{ width: '100%', gap: '32px', alignItems: 'center' }}>
          {/* Logo badge */}
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: '100px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background:
                'linear-gradient(360deg, rgba(35, 35, 35, 0) 50%, rgba(35, 35, 35, 0.06) 100%), #FFFFFF',
              boxShadow: '0px 0px 0px 2px #FFFFFF, 0px 12px 8px rgba(0, 0, 0, 0.03)',
            }}
          >
            <Box
              component="img"
              src="/AITI_Logo.png"
              alt="AITI"
              sx={{ width: 35, height: 34, display: 'block' }}
            />
          </Box>

          {/* Title + subtitle */}
          <Box sx={{ width: '100%' }}>
            <Typography sx={{ fontSize: 20, fontWeight: 700, textAlign: 'center' }}>
              Добро пожаловать!
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 1 }}>
              Пожалуйста, авторизируйтесь
            </Typography>
          </Box>

          {mutation.isError && <Alert severity="error">{(mutation.error as Error).message}</Alert>}

          {/* Form */}
          <Box sx={{ width: '100%' }}>
             <Stack sx={{ width: '100%', maxWidth: 399, mx: 'auto', gap: 2 }}>
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
                  Логин
                </Typography>

                <TextField
                  placeholder="test"
                  error={!!errors.username}
                  helperText={errors.username?.message}
                  disabled={mutation.isPending}
                  size="small"
                  sx={{
                    width: '100%',
                    '& .MuiOutlinedInput-root': { borderRadius: 2, height: 44 },
                  }}
                  {...register('username')}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutlineIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Box>

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


              <FormControlLabel
                sx={{ color: 'text.secondary', '& .MuiFormControlLabel-label': { fontSize: 13 } }}
                control={<Checkbox disabled={mutation.isPending} {...register('remember')} />}
                label="Запомнить данные"
              />

              <Button
                variant="contained"
                disabled={mutation.isPending}
                onClick={handleSubmit(onSubmit)}
                fullWidth
                size="large"
                sx={{ borderRadius: 2, height: 44, textTransform: 'none', fontWeight: 600 }}
              >
                Войти
              </Button>
            </Stack>
          </Box>

          {/* Divider "или" */}
          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ height: '1px', bgcolor: 'divider', flex: 1 }} />
            <Typography variant="caption" color="text.secondary">
              или
            </Typography>
            <Box sx={{ height: '1px', bgcolor: 'divider', flex: 1 }} />
          </Box>

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
