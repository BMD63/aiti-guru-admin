import SearchIcon from '@mui/icons-material/Search';
import { Box, InputAdornment, TextField, Typography } from '@mui/material';
import { PRODUCTS_PAGE } from '../constants';

type Props = {
  q: string;
  onChangeQ: (value: string) => void;
};

export function ProductsToolbar({ q, onChangeQ }: Props) {
  return (
    <Box
      sx={{
        height: PRODUCTS_PAGE.layout.navbarHeight,
        bgcolor: '#FFFFFF',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: '30px',
        gap: '10px',
      }}
    >
      <Typography
        sx={{
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: '-0.015em',
          color: '#232323',
        }}
      >
        Товары
      </Typography>

      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <TextField
          size="small"
          placeholder="Найти"
          value={q}
          onChange={(e) => onChangeQ(e.target.value)}
          sx={{
            width: '100%',
            maxWidth: PRODUCTS_PAGE.search.inputWidth,
            '& .MuiOutlinedInput-root': { borderRadius: 2, height: 44 },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      <Box sx={{ width: 24 }} />
    </Box>
  );
}
