import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Product } from '../entities/product/api/getProducts';
import { useProductsQuery } from '../entities/product/queries/useProductsQuery';
import { useDebouncedValue } from '../shared/hooks/useDebouncedValue';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import {
  createProductSchema,
  type CreateProductFormValues,
  type CreateProductInput,
} from '../features/auth/schemas/createProduct.schema';

import {
  Alert,
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  IconButton,
  InputAdornment,
  LinearProgress,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';

type SortableColumnId = 'title' | 'price' | 'rating' | 'brand';
type SortOrder = 'asc' | 'desc';

function parseSort(searchParams: URLSearchParams): { sortBy: SortableColumnId | null; order: SortOrder } {
  const sortByRaw = searchParams.get('sortBy');
  const orderRaw = searchParams.get('order');

  const sortBy =
    sortByRaw === 'title' || sortByRaw === 'price' || sortByRaw === 'rating' || sortByRaw === 'brand'
      ? sortByRaw
      : null;

  const order: SortOrder = orderRaw === 'desc' ? 'desc' : 'asc';
  return { sortBy, order };
}

function toSortingState(sortBy: SortableColumnId | null, order: SortOrder): SortingState {
  if (!sortBy) return [];
  return [{ id: sortBy, desc: order === 'desc' }];
}

function nextSorting(current: SortingState, columnId: SortableColumnId): SortingState {
  const active = current[0];
  if (!active || active.id !== columnId) return [{ id: columnId, desc: false }]; // asc
  if (active.desc === false) return [{ id: columnId, desc: true }]; // desc
  return []; // off
}

function sortingToParams(sorting: SortingState): { sortBy?: string; order?: string } {
  const s = sorting[0];
  if (!s) return {};
  return { sortBy: String(s.id), order: s.desc ? 'desc' : 'asc' };
}

export function ProductsPage() {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [toastOpen, setToastOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateProductInput, unknown, CreateProductFormValues>({
    resolver: zodResolver(createProductSchema),
  });

  const onCreate = (values: CreateProductFormValues) => {
    const newProduct: Product = {
      id: Date.now(),
      title: values.title,
      price: values.price,
      rating: 0,
      brand: values.brand,
    };

    queryClient.setQueryData(
      ['products', { q: debouncedQ, limit: 20, skip: 0 }],
      (old: any) => {
        if (!old) return old;
        return {
          ...old,
          products: [newProduct, ...old.products],
        };
      },
    );

    reset();
    setOpen(false);
    setToastOpen(true);
  };

  const debouncedQ = useDebouncedValue(q, 400);

  const [searchParams, setSearchParams] = useSearchParams();
  const { sortBy, order } = parseSort(searchParams);

  const { data, isFetching, isError, error } = useProductsQuery({
    q: debouncedQ,
    limit: 20,
    skip: 0,
  });

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        id: 'title',
        accessorKey: 'title',
        header: 'Название',
        cell: (ctx) => ctx.getValue<string>(),
      },
      {
        id: 'price',
        accessorKey: 'price',
        header: 'Цена',
        cell: (ctx) => ctx.getValue<number>(),
      },
      {
        id: 'rating',
        accessorKey: 'rating',
        header: 'Рейтинг',
        cell: (ctx) => {
          const value = ctx.getValue<number>();
          return (
            <Typography
              component="span"
              color={value < 3 ? 'error.main' : 'text.primary'}
              fontWeight={value < 3 ? 600 : 400}
            >
              {value}
            </Typography>
          );
        },
      },
      {
        id: 'brand',
        accessorKey: 'brand',
        header: 'Бренд',
        cell: (ctx) => ctx.getValue<string>() ?? '—',
      },
    ],
    [],
  );

  const sortingState = useMemo(() => toSortingState(sortBy, order), [sortBy, order]);

  const table = useReactTable({
    data: data?.products ?? [],
    columns,
    state: { sorting: sortingState },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: false,
  });

  const handleHeaderClick = (columnId: SortableColumnId) => {
    const next = nextSorting(sortingState, columnId);
    const nextParams = sortingToParams(next);

    setSearchParams((prev) => {
      const sp = new URLSearchParams(prev);

      if (nextParams.sortBy) {
        sp.set('sortBy', nextParams.sortBy);
        sp.set('order', nextParams.order ?? 'asc');
      } else {
        sp.delete('sortBy');
        sp.delete('order');
      }

      return sp;
    });
  };

  const renderSortHint = (columnId: SortableColumnId) => {
    const s = sortingState[0];
    if (!s || s.id !== columnId) return null;
    return s.desc ? ' ↓' : ' ↑';
  };

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
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setOpen(true)}
                >
                  Добавить
                </Button>
              </Stack>
            }
          />

          <CardContent sx={{ pt: 0 }}>
            {isError ? (
              <Typography color="error">{(error as Error).message}</Typography>
            ) : (
              <Table size="small">
                <TableHead>
                  {table.getHeaderGroups().map((hg) => (
                    <TableRow key={hg.id}>
                      {hg.headers.map((header) => {
                        const id = header.column.id as SortableColumnId;
                        const sortable = id === 'title' || id === 'price' || id === 'rating' || id === 'brand';

                        return (
                          <TableCell
                            key={header.id}
                            onClick={sortable ? () => handleHeaderClick(id) : undefined}
                            sx={{
                              cursor: sortable ? 'pointer' : 'default',
                              userSelect: 'none',
                              fontWeight: 600,
                            }}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {sortable && renderSortHint(id)}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHead>

                <TableBody>
                  {table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </Container>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Добавить товар</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="Название"
            error={!!errors.title}
            helperText={errors.title?.message}
            {...register('title')}
          />

          <TextField
            label="Цена"
            type="number"
            error={!!errors.price}
            helperText={errors.price?.message}
            {...register('price')}
          />

          <TextField
            label="Бренд"
            {...register('brand')}
          />

          <TextField
            label="Артикул"
            {...register('sku')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Отмена</Button>
          <Button variant="contained" onClick={handleSubmit(onCreate)}>
            Сохранить
          </Button>

        </DialogActions>
      </Dialog>
      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setToastOpen(false)}
          severity="success"
          variant="filled"
        >
          Товар успешно добавлен
        </Alert>
      </Snackbar>

    </Box>
  );
}
