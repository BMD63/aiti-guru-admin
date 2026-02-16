import { useSearchParamsState } from '../shared/hooks/useSearchParamsState';
import { useProductsSorting } from './ProductsPage/hooks/useProductsSorting';
import { useProductsSelection } from './ProductsPage/hooks/useProductsSelection';
import { useProductsUIOverlays } from './ProductsPage/hooks/useProductsUIOverlays';
import { useAddProduct } from './ProductsPage/hooks/useAddProduct';

import { createProductColumns } from './ProductsPage/columns';
import { AddProductDialog } from './ProductsPage/components/AddProductDialog';
import { PaginationFooter } from './ProductsPage/components/PaginationFooter';
import { ProductsToolbar } from './ProductsPage/components/ProductsToolbar';
import { ProductsHeaderActions } from './ProductsPage/components/ProductsHeaderActions';

import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable, } from '@tanstack/react-table';
import { useQueryClient } from '@tanstack/react-query';

import { useEffect, useMemo, useRef, useState } from 'react';

import { PRODUCTS_PAGE } from './ProductsPage/constants';
import { useProductsQuery } from '../entities/product/queries/useProductsQuery';
import { useDebouncedValue } from '../shared/hooks/useDebouncedValue';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

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
  const { getNumber, set: setParams } = useSearchParamsState();

  const page = Math.max(1, getNumber('page', 1));
  const limit = PRODUCTS_PAGE.limit;
  const skip = (page - 1) * limit;

  const { data, isFetching, isError, error } = useProductsQuery({
    q: debouncedQ,
    limit,
    skip,
  });

  const { sortingState, toggleSort, currentSort, currentOrder, sortableColumns } = useProductsSorting();

  const {
    toastOpen,
    toastMessage,
    toastSeverity,
    openToast,
    closeToast,
    menuAnchorEl,
    openMenu,
    closeMenu,
  } = useProductsUIOverlays();

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

  const { selectedIds, allChecked, someChecked, toggleAllCurrent, toggleOne } = useProductsSelection(data?.products ?? []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateProductInput, unknown, CreateProductFormValues>({
    resolver: zodResolver(createProductSchema),
  });

  const productsQueryKey = useMemo(
    () => ['products', { q: debouncedQ, limit, skip }] as const,
    [debouncedQ, limit, skip],
  );

  const { addProduct } = useAddProduct({
    queryKey: productsQueryKey,
    onClose: () => setOpen(false),
    onToast: openToast,
    reset,
  });

  const columns = useMemo(
    () =>
      createProductColumns({
        selectedIds,
        toggleAllCurrent,
        toggleOne,
        allChecked,
        someChecked,
        openToast,
        handleOpenMenu: openMenu,
      }),
    [selectedIds, toggleAllCurrent, toggleOne, allChecked, someChecked, openToast, openMenu],
  );

  const table = useReactTable({
    data: data?.products ?? [],
    columns,
    state: { sorting: sortingState },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['products'] });
  };

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
        <ProductsToolbar q={q} onChangeQ={setQ} />

        <Box sx={{ width: '100%' }}>
          <Card sx={{ borderRadius: '10px', boxShadow: '0px 4px 20px rgba(0,0,0,0.03)' }}>
            <CardHeader
              sx={{ px: 3, pt: 3, pb: 2 }}
              title={<Typography sx={{ fontWeight: 600 }}>Все позиции</Typography>}
              action={
                <ProductsHeaderActions
                  onRefresh={handleRefresh}
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
                        '& .MuiTableCell-root': { py: 2 },
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
                          <TableRow key={row.id} sx={{ '&:hover': { backgroundColor: '#FAFAFA' } }}>
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
        onSubmit={handleSubmit(addProduct)}
        isSubmitting={isFetching}
        register={register}
        errors={errors}
      />

      <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={closeMenu}>
        <MenuItem
          onClick={() => {
            closeMenu();
            openToast('Скоро будет: редактирование', 'info');
          }}
        >
          Редактировать
        </MenuItem>
        <MenuItem
          onClick={() => {
            closeMenu();
            openToast('Скоро будет: удаление', 'info');
          }}
        >
          Удалить
        </MenuItem>
      </Menu>

      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={closeToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <AlertMUI onClose={closeToast} severity={toastSeverity} variant="filled">
          {toastMessage}
        </AlertMUI>
      </Snackbar>
    </Box>
  );
}
