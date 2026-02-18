import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { loginSchema, type LoginFormValues } from '../../../features/auth/schemas/login.schema';
import { login } from '../../../features/auth/api/login';
import { useAuth } from '../../../features/auth/useAuth';
import { AUTH_EXPIRES_IN_MINS } from '../constants';

export function useLoginForm() {
  const navigate = useNavigate();
  const { setSession } = useAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { remember: false },
  });

  const mutation = useMutation({
    mutationFn: (values: LoginFormValues) =>
      login({
        username: values.username,
        password: values.password,
        expiresInMins: AUTH_EXPIRES_IN_MINS,
      }),
    onSuccess: (data, values) => {
      setSession(data.accessToken, !!values.remember);
      navigate('/products', { replace: true });
    },
  });

  const onSubmit = form.handleSubmit((values) => mutation.mutate(values));

  return {
    register: form.register,
    formState: form.formState, 
    onSubmit,
    
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}