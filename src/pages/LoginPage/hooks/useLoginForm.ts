import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { login } from '../../../features/auth/api/login';
import { useAuth } from '../../../features/auth/useAuth';
import type { LoginFormValues } from '../../../features/auth/schemas/login.schema';
import { AUTH_EXPIRES_IN_MINS } from '../constants';

export function useLoginForm() {
  const navigate = useNavigate();
  const { setSession } = useAuth();

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

  return {
    mutation,
  };
}