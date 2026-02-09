import {
  Alert,
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { loginSchema, type LoginFormValues } from '../features/auth/schemas/login.schema';
import { login } from '../features/auth/api/login';
import { useAuth } from '../features/auth/useAuth';

export function LoginPage() {
  const navigate = useNavigate();
  const { setSession } = useAuth();

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
    <Stack spacing={2} sx={{ p: 3, maxWidth: 400 }}>
      <Typography variant="h5">Login</Typography>

      {mutation.isError && (
        <Alert severity="error">{(mutation.error as Error).message}</Alert>
      )}

      <TextField
        label="Username"
        error={!!errors.username}
        helperText={errors.username?.message}
        disabled={mutation.isPending}
        {...register('username')}
      />

      <TextField
        label="Password"
        type="password"
        error={!!errors.password}
        helperText={errors.password?.message}
        disabled={mutation.isPending}
        {...register('password')}
      />

      <FormControlLabel
        control={<Checkbox disabled={mutation.isPending} {...register('remember')} />}
        label="Remember me"
      />

      <Button
        variant="contained"
        disabled={mutation.isPending}
        onClick={handleSubmit(onSubmit)}
      >
        Sign in
      </Button>
    </Stack>
  );
}
