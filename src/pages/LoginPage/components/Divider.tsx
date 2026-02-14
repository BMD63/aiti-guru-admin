import { Box, Typography } from '@mui/material';

export function Divider() {
  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box sx={{ height: '1px', bgcolor: 'divider', flex: 1 }} />
      <Typography variant="caption" color="text.secondary">
        или
      </Typography>
      <Box sx={{ height: '1px', bgcolor: 'divider', flex: 1 }} />
    </Box>
  );
}
