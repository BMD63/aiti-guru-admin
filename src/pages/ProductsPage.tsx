import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import { useDebouncedValue } from '../shared/hooks/useDebouncedValue';

import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  IconButton,
  InputAdornment,
  LinearProgress,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { useProductsQuery } from '../entities/product/queries/useProductsQuery';

export function ProductsPage() {
  const [q, setQ] = useState('');
  const debouncedQ = useDebouncedValue(q, 400);

  const { data, isFetching, isError, error } = useProductsQuery({
    q: debouncedQ,
    limit: 20,
    skip: 0,
  });

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.100' }}>
      {isFetching && <LinearProgress />}

      <AppBar position="static" color="inherit" elevation={0}>
        <Toolbar sx={{ gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Товары
          </Typography>

          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <TextField
              size="small"
              placeholder="Найти"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              sx={{ width: 'min(720px, 100%)' }}
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

          <Box sx={{ width: 120 }} />
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 3 }}>
        <Card>
          <CardHeader
            title={<Typography sx={{ fontWeight: 600 }}>Все позиции</Typography>}
            action={
              <Stack direction="row" spacing={1}>
                <IconButton aria-label="refresh">
                  <RefreshIcon />
                </IconButton>
                <Button variant="contained" startIcon={<AddIcon />}>
                  Добавить
                </Button>
              </Stack>
            }
          />
          <CardContent sx={{ pt: 0 }}>
            {isError ? (
              <Typography color="error">{(error as Error).message}</Typography>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Получено товаров: {data?.products.length ?? 0}
              </Typography>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
