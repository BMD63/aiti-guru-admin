import { Divider, LogoBadge, LoginForm } from './LoginPage/components';
import { LOGIN_UI, LOGIN_TEXT } from './LoginPage/constants';
import { useLoginForm } from './LoginPage/hooks/useLoginForm';

import { Alert, Box, Stack, Typography } from '@mui/material';

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
    const {
    register,
    formState: { errors },
    mutation,
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
            <LogoBadge />

            <Box sx={{ width: '100%' }}>
              <Typography sx={{ fontSize: 20, fontWeight: 700, textAlign: 'center' }}>
                {LOGIN_TEXT.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 1 }}>
                {LOGIN_TEXT.subtitle}
              </Typography>
            </Box>

            {mutation.isError && <Alert severity="error">{getErrorMessage(mutation.error)}</Alert>}

            <LoginForm
              onSubmit={onSubmit}
              register={register}
              errors={errors}
              isPending={mutation.isPending}
            />

            <Divider />

            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
              {LOGIN_TEXT.noAccount}{' '}
              <Box component="span" sx={{ color: 'primary.main', fontWeight: 600, cursor: 'pointer' }}>
                {LOGIN_TEXT.create}
              </Box>
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
