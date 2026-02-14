import { Box } from '@mui/material';

export function LogoBadge() {
  return (
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
  );
}
