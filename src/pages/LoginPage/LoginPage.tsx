import { Link } from 'react-router-dom'; // 1. Используем Link для навигации
import { Divider, LogoBadge, LoginForm } from './components';
import { LOGIN_TEXT } from './constants';
import { useLoginForm } from './hooks/useLoginForm';
import { getErrorMessage } from  '../../shared/lib/getErrorMessage';

import { Alert, Box, Stack, Typography } from '@mui/material';

export function LoginPage() {
  const {
    register,
    formState: { errors },
    isLoading, 
    error,    
    onSubmit,
  } = useLoginForm();

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
      <Box
        sx={{
          borderRadius: '40px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
          p: '6px',
        }}
      >
        <Box
          sx={{
            width: 480, 
            minHeight: 500,
            borderRadius: '34px', 
            background: `
              linear-gradient(
                180deg,
                rgba(35, 35, 35, 0.06) 0%,
                rgba(35, 35, 35, 0) 50%
              ),
              #FFFFFF
            `,
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Stack sx={{ width: '100%', gap: 4, alignItems: 'center' }}>
            <LogoBadge />

            <Box sx={{ width: '100%' }}>
              <Typography sx={{ fontSize: 20, fontWeight: 700, textAlign: 'center' }}>
                {LOGIN_TEXT.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 1 }}>
                {LOGIN_TEXT.subtitle}
              </Typography>
            </Box>

            {error && <Alert severity="error">{getErrorMessage(error)}</Alert>}

            <LoginForm
              onSubmit={onSubmit}
              register={register}
              errors={errors}
              isPending={isLoading}
            />

            <Divider />

            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
              {LOGIN_TEXT.noAccount}{' '}
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <Typography
                  component="span"
                  color="primary.main"
                  fontWeight={600}
                  sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                >
                  {LOGIN_TEXT.create}
                </Typography>
              </Link>
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}