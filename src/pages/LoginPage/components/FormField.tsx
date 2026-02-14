import type { ReactNode } from 'react';
import { Box, TextField, Typography, type TextFieldProps } from '@mui/material';

type Props = {
  label: string;
  endAdornment?: ReactNode;
  startAdornment?: ReactNode;
} & Omit<TextFieldProps, 'label' | 'slotProps'>;

export function FormField({ label, startAdornment, endAdornment, sx, ...props }: Props) {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography
        sx={{
          fontStyle: 'normal',
          fontWeight: 500,
          fontSize: 18,
          lineHeight: '150%',
          letterSpacing: '-0.015em',
          color: '#232323',
          mb: 1,
        }}
      >
        {label}
      </Typography>

      <TextField
        {...props}
        size="small"
        sx={{
          width: '100%',
          '& .MuiOutlinedInput-root': { borderRadius: 2, height: 44 },
          ...sx,
        }}
        slotProps={{
          input: {
            startAdornment,
            endAdornment,
          },
        }}
      />
    </Box>
  );
}
