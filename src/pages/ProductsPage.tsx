import AddIcon from '@mui/icons-material/Add';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
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

import type { Product, ProductsResponse } from '../entities/product/api/getProducts';
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
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  LinearProgress,
  Menu,
  MenuItem,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import AlertMUI from '@mui/material/Alert';

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
  const debouncedQ = useDebouncedValue(q, 400);

  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('Товар успешно добавлен');
  const [toastSeverity, setToastSeverity] = useState<'success' | 'info'>('success');

  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const { sortBy, order } = parseSort(searchParams);
  const pageParam = Number(searchParams.get('page') ?? '1');
  const page = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
  const limit = 20;
  const skip = (page - 1) * limit;
  const { data, isFetching, isError, error } = useProductsQuery({
  q: debouncedQ,
  limit,
  skip,
});

  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / limit);
  const changePage = (nextPage: number) => {
    setSearchParams((prev) => {
      const sp = new URLSearchParams(prev);
      sp.set('page', String(nextPage));
      return sp;
    });
  };

  const currentIds = (data?.products ?? []).map((p) => p.id);
  const allChecked = currentIds.length > 0 && currentIds.every((id) => selectedIds.has(id));
  const someChecked = currentIds.some((id) => selectedIds.has(id)) && !allChecked;

  const toggleAllCurrent = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allChecked) {
        currentIds.forEach((id) => next.delete(id));
      } else {
        currentIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const toggleRow = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const openToast = (message: string, severity: 'success' | 'info' = 'info') => {
    setToastMessage(message);
    setToastSeverity(severity);
    setToastOpen(true);
  };

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

    queryClient.setQueryData<ProductsResponse>(
      ['products', { q: debouncedQ, limit: 20, skip: 0 }],
      (old) => {
        if (!old) return old;
        return {
          ...old,
          products: [newProduct, ...old.products],
          total: old.total + 1,
        };
      },
    );

    reset();
    setOpen(false);
    openToast('Товар успешно добавлен', 'success');
  };

  const sortingState = useMemo(() => toSortingState(sortBy, order), [sortBy, order]);

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

  const handleOpenMenu = (e: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(e.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        id: 'select',
        header: () => (
          <Checkbox
            checked={allChecked}
            indeterminate={someChecked}
            onChange={toggleAllCurrent}
            size="small"
          />
        ),
        cell: ({ row }) => {
          const p = row.original;
          const checked = selectedIds.has(p.id);
          return <Checkbox checked={checked} onChange={() => toggleRow(p.id)} size="small" />;
        },
        meta: { align: 'center', width: 60 },
      },

      {
        id: 'title',
        accessorKey: 'title',
        header: 'Название',
        cell: (ctx) => ctx.getValue<string>(),
        meta: { align: 'left', width: 350 },
      },

      {
        id: 'price',
        accessorKey: 'price',
        header: 'Цена',
        cell: (ctx) => ctx.getValue<number>(),
        meta: { align: 'right', width: 140 },
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
        meta: { align: 'center', width: 120 },
      },

      {
        id: 'brand',
        accessorKey: 'brand',
        header: 'Бренд',
        cell: (ctx) => ctx.getValue<string>() ?? '—',
        meta: { align: 'left', width: 220 },
      },

      {
        id: 'plus',
        header: '',
        cell: () => (
          <IconButton size="small" onClick={() => openToast('Добавлено', 'info')}>
            <AddIcon fontSize="small" />
          </IconButton>
        ),
        meta: { align: 'center', width: 60 },
      },

      {
        id: 'more',
        header: '',
        cell: () => (
          <IconButton size="small" onClick={(e) => handleOpenMenu(e)}>
            <MoreHorizIcon fontSize="small" />
          </IconButton>
        ),
        meta: { align: 'center', width: 60 },
      },

    ],
    [allChecked, someChecked, selectedIds],
  );

  const table = useReactTable({
    data: data?.products ?? [],
    columns,
    state: { sorting: sortingState },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: false,
  });

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F6F6F6', pt: '20px' }}>
      {isFetching && <LinearProgress />}

      <Box sx={{ px: '30px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
        {/* Навигационная панель */}
        <Box
          sx={{
            height: 105,
            bgcolor: '#FFFFFF',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: '30px',
            gap: '10px',
          }}
        >
          <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#232323' }}>Товары</Typography>

          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <TextField
              size="small"
              placeholder="Найти"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              sx={{
                width: 'min(560px, 100%)',
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

        {/* Контент */}
        <Box sx={{ width: '100%'}}>
          <Card>
            <CardHeader
              title={<Typography sx={{ fontWeight: 600 }}>Все позиции</Typography>}
              action={
                <Stack direction="row" spacing={1}>
                  <IconButton aria-label="refresh">
                    <RefreshIcon />
                  </IconButton>
                  <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
                    Добавить
                  </Button>
                </Stack>
              }
            />

            <CardContent sx={{ pt: 0 }}>
              {isError ? (
                <Typography color="error">{(error as Error).message}</Typography>
              ) : (
                <>
                  <Box sx={{ width: '100%', overflowX: 'auto' }}>
                    <Table
                      size="medium"
                      sx={{
                        minWidth: 1100,
                        tableLayout: 'fixed',
                        '& .MuiTableCell-root': {
                          py: 2,
                        },
                      }}
                    >


                      <TableHead
                        sx={{
                          backgroundColor: '#F9F9F9',
                          '& .MuiTableCell-root': {
                            fontWeight: 600,
                            color: '#6B6B6B',
                            fontSize: 14,
                          },
                        }}
                      >
                        {table.getHeaderGroups().map((hg) => (
                          <TableRow key={hg.id}>
                            {hg.headers.map((header) => {
                              const id = header.column.id as SortableColumnId;
                              const sortable = id === 'title' || id === 'price' || id === 'rating' || id === 'brand';

                              return (
                                <TableCell
                                  key={header.id}
                                  align={header.column.columnDef.meta?.align}
                                  onClick={sortable ? () => handleHeaderClick(id) : undefined}
                                  sx={{
                                    width: header.column.columnDef.meta?.width,
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
                          <TableRow
                            key={row.id}
                            sx={{
                              '&:hover': {
                                backgroundColor: '#FAFAFA',
                              },
                            }}
                          >

                            {row.getVisibleCells().map((cell) => (
                              <TableCell
                                key={cell.id}
                                align={cell.column.columnDef.meta?.align}
                                sx={{
                                  width: cell.column.columnDef.meta?.width,
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >

                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                  <Box
                    sx={{
                      height: 52,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      py: '11px',
                      mt: 1,
                      borderTop: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Typography sx={{ fontSize: 14, color: '#6B6B6B' }}>
                      Показано: {skip + 1}-{Math.min(skip + limit, total)} из {total}
                    </Typography>

                    <Stack direction="row" spacing={1} alignItems="center">
                      <Button
                        variant="text"
                        disabled={page <= 1}
                        onClick={() => changePage(page - 1)}
                        sx={{ textTransform: 'none' }}
                      >
                        Назад
                      </Button>

                      <Typography sx={{ fontSize: 14, color: '#232323', fontWeight: 600 }}>
                        {page}
                      </Typography>

                      <Button
                        variant="text"
                        disabled={page >= totalPages}
                        onClick={() => changePage(page + 1)}
                        sx={{ textTransform: 'none' }}
                      >
                        Вперёд
                      </Button>
                    </Stack>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Добавить товар</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2}>
            <TextField
              label="Наименование"
              error={!!errors.title}
              helperText={errors.title?.message}
              {...register('title')}
            />
            <TextField
              label="Цена"
              type="number"
              error={!!errors.price}
              helperText={errors.price?.message}
              {...register('price', { valueAsNumber: true })}
            />
            <TextField label="Вендор" error={!!errors.brand} helperText={errors.brand?.message} {...register('brand')} />
            <TextField label="Артикул" error={!!errors.sku} helperText={errors.sku?.message} {...register('sku')} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="inherit">
            Отмена
          </Button>
          <Button variant="contained" onClick={handleSubmit(onCreate)}>
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          onClick={() => {
            handleCloseMenu();
            openToast('Скоро будет: редактирование', 'info');
          }}
        >
          Редактировать
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleCloseMenu();
            openToast('Скоро будет: удаление', 'info');
          }}
        >
          Удалить
        </MenuItem>
      </Menu>

      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <AlertMUI onClose={() => setToastOpen(false)} severity={toastSeverity} variant="filled">
          {toastMessage}
        </AlertMUI>
      </Snackbar>
    </Box>
  );
}
