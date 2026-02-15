import { useSearchParamsState } from '../shared/hooks/useSearchParamsState';
import { useProductsSorting } from './ProductsPage/hooks/useProductsSorting';
import { useProductsSelection } from './ProductsPage/hooks/useProductsSelection';
import { createProductColumns } from './ProductsPage/columns';
import { AddProductDialog } from './ProductsPage/components/AddProductDialog';
import { PaginationFooter } from './ProductsPage/components/PaginationFooter';
import { ProductsToolbar } from './ProductsPage/components/ProductsToolbar';
import { ProductsHeaderActions } from './ProductsPage/components/ProductsHeaderActions';

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo, useState, useEffect, useRef, } from 'react';
import { PRODUCTS_PAGE } from './ProductsPage/constants';
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
  Card,
  CardContent,
  CardHeader,
  LinearProgress,
  Menu,
  MenuItem,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import AlertMUI from '@mui/material/Alert';

export function ProductsPage() {
  const [q, setQ] = useState('');
  const debouncedQ = useDebouncedValue(q, PRODUCTS_PAGE.search.debounceMs);


  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('Товар успешно добавлен');
  const [toastSeverity, setToastSeverity] = useState<'success' | 'info'>('success');

  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);

  const {getNumber, set: setParams } = useSearchParamsState();

  const page = Math.max(1, getNumber('page', 1));
  const limit = PRODUCTS_PAGE.limit;

  const skip = (page - 1) * limit;
  const { data, isFetching, isError, error } = useProductsQuery({
    q: debouncedQ,
    limit,
    skip,
  });

  const { sortingState, toggleSort, currentSort, currentOrder, sortableColumns } = useProductsSorting();


  const prevQRef = useRef(debouncedQ);

  useEffect(() => {
    if (prevQRef.current === debouncedQ) return;

    prevQRef.current = debouncedQ;
    setParams({ page: 1 }, { replace: true });
  }, [debouncedQ, setParams]);

  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / limit);
  const changePage = (nextPage: number) => {
    setParams({ page: nextPage });
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
  const {
    selectedIds,
    allChecked,
    someChecked,
    toggleAllCurrent,
    toggleOne,
  } = useProductsSelection(data?.products ?? []);

  const onCreate = (values: CreateProductFormValues) => {
    const newProduct: Product = {
      id: Date.now(),
      title: values.title,
      price: values.price,
      rating: 0,
      brand: values.brand,
    };

    queryClient.setQueryData<ProductsResponse>(
      ['products', { q: debouncedQ, limit, skip }],

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

  const handleOpenMenu = (e: React.MouseEvent<HTMLElement>, _id: number) => {
    setMenuAnchorEl(e.currentTarget);
  };


  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };
  const columns = useMemo(
  () =>
    createProductColumns({
      selectedIds,
      toggleAllCurrent,
      toggleOne,
      allChecked,
      someChecked,
      openToast,
      handleOpenMenu,
    }),
  [selectedIds, allChecked, someChecked, toggleAllCurrent, toggleOne, openToast, handleOpenMenu],
);



  const table = useReactTable({
    data: data?.products ?? [],
    columns,
    state: { sorting: sortingState },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: false,
  });
  const pagesToShow = useMemo(() => {
    const last = Math.max(totalPages, 1);
    const current = Math.min(Math.max(page, 1), last);

    const res: Array<number | 'dots'> = [];
    const push = (v: number | 'dots') => {
      if (res[res.length - 1] === v) return;
      res.push(v);
    };

    push(1);

    const start = Math.max(2, current - 1);
    const end = Math.min(last - 1, current + 1);

    if (start > 2) push('dots');

    for (let p = start; p <= end; p += 1) push(p);

    if (end < last - 1) push('dots');

    if (last > 1) push(last);

    return res;
  }, [page, totalPages]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F6F6F6', pt: `${PRODUCTS_PAGE.layout.topPadding}px` }}>

      {isFetching && <LinearProgress />}

      <Box sx={{ px: `${PRODUCTS_PAGE.layout.sidePadding}px`, display: 'flex', flexDirection: 'column', gap: '30px' }}>
        {/* Навигационная панель */}
        <ProductsToolbar q={q} onChangeQ={setQ} />

        {/* Контент */}
        <Box sx={{ width: '100%'}}>
          <Card
            sx={{
              borderRadius: '10px',
              boxShadow: '0px 4px 20px rgba(0,0,0,0.03)',
            }}
          >
            <CardHeader
              sx={{
                px: 3,
                pt: 3,
                pb: 2,
              }}
              title={<Typography sx={{ fontWeight: 600 }}>Все позиции</Typography>}
              action={
                <ProductsHeaderActions
                  onRefresh={() => queryClient.invalidateQueries({ queryKey: ['products'] })}
                  onAdd={() => setOpen(true)}
                />
              }
            />

            <CardContent sx={{ pt: 0, px: 3, pb: 2 }}>
              {isError ? (
                <Typography color="error">{(error as Error).message}</Typography>
              ) : (
                <>
                  <Box sx={{ width: '100%', overflowX: 'auto' }}>
                    <Table
                      size="medium"
                      sx={{
                        minWidth: PRODUCTS_PAGE.layout.cardMinTableWidth,
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
                              const id = header.column.id;
                              const sortable = sortableColumns.includes(id as any);
                              return (
                                <TableCell
                                  key={header.id}
                                  align={header.column.columnDef.meta?.align}
                                  onClick={sortable ? () => toggleSort(id as any) : undefined}
                                  sx={{
                                    width: header.column.columnDef.meta?.width,
                                    cursor: sortable ? 'pointer' : 'default',
                                    userSelect: 'none',
                                    fontWeight: 600,
                                  }}
                                >

                                  {flexRender(header.column.columnDef.header, header.getContext())}
                                  {sortable && currentSort === id && (currentOrder === 'desc' ? ' ↓' : ' ↑')}

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
                  <PaginationFooter
                    page={page}
                    totalPages={totalPages}
                    total={total}
                    skip={skip}
                    limit={limit}
                    pagesToShow={pagesToShow}
                    onChangePage={changePage}
                  />

                </>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>

      <AddProductDialog
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit(onCreate)}
        isSubmitting={isFetching}
        register={register}
        errors={errors}
      />

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
