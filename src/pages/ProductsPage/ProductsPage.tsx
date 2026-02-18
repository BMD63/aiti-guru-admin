import { useMemo, useState, useCallback } from 'react';
import { useReactTable, getCoreRowModel, getSortedRowModel } from '@tanstack/react-table';
import { useQueryClient } from '@tanstack/react-query';

import { PRODUCTS_PAGE } from './constants';
import { useSearchParamsState } from '../../shared/hooks/useSearchParamsState';
import { useProductsSorting } from './hooks/useProductsSorting';
import { useProductsSelection } from './hooks/useProductsSelection';
import { useProductsUIOverlays } from './hooks/useProductsUIOverlays';
import { useProductsQuery } from '../../entities/product/queries/useProductsQuery';
import { useDebouncedValue } from '../../shared/hooks/useDebouncedValue';
import { productsQueryKey } from '../../entities/product/queries/queryKeys';
import { useAddProduct } from './hooks/useAddProduct';

import { DataTable } from '../../shared/ui/DataTable';

import { createProductColumns } from './columns';
import { AddProductDialog } from './components/AddProductDialog';
import { PaginationFooter } from './components/PaginationFooter';
import { ProductsToolbar } from './components/ProductsToolbar';
import { ProductsHeaderActions } from './components/ProductsHeaderActions';
import { ProductActionsMenu } from './components/ProductActionsMenu';

import {
  Box,
  Card,
  CardContent,
  CardHeader,
  LinearProgress,
  Snackbar,
  Typography,
} from '@mui/material';
import AlertMUI from '@mui/material/Alert';

export function ProductsPage() {
  const queryClient = useQueryClient();

  const { searchParams, set: setParams, getNumber } = useSearchParamsState();
  
  const q = searchParams.get('q') ?? '';
  const debouncedQ = useDebouncedValue(q, 400);

  const setQ = (value: string) => {
    setParams({ q: value || null, page: 1 });
  };

  const page = Math.max(1, getNumber('page', 1));
  const limit = PRODUCTS_PAGE.limit;
  const skip = (page - 1) * limit;

  const currentProductsKey = useMemo(
    () => productsQueryKey({ q: debouncedQ, limit, skip }),
    [debouncedQ, limit, skip]
  );

  const { data, isFetching, isError, error } = useProductsQuery({
    q: debouncedQ,
    limit,
    skip,
  });

  const { sortingState, setSortingState } = useProductsSorting();

  const {
    selectedIds,
    allChecked,
    someChecked,
    toggleAllCurrent,
    toggleOne,
  } = useProductsSelection(data?.products ?? []);

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

  const [openDialog, setOpenDialog] = useState(false);

  const { addProduct } = useAddProduct({
    queryKey: currentProductsKey,
    onClose: () => setOpenDialog(false),
    onToast: openToast,
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
    [selectedIds, allChecked, someChecked, toggleAllCurrent, toggleOne, openToast, openMenu],
  );
  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table manages its own memoization stability
  const table = useReactTable({
    data: data?.products ?? [],
    columns,
    state: { sorting: sortingState },
    onSortingChange: setSortingState,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // --- Handlers ---
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / limit);

  const changePage = (nextPage: number) => {
    setParams({ page: nextPage });
  };

  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: currentProductsKey, exact: true });
  }, [queryClient, currentProductsKey]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F6F6F6', pt: 3 }}>
      {isFetching && <LinearProgress />}

      <Box sx={{ px: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <ProductsToolbar q={q} onChangeQ={setQ} />

        <Card>
          <CardHeader
            title={<Typography fontWeight={600}>Все позиции</Typography>}
            action={
              <ProductsHeaderActions
                onRefresh={handleRefresh}
                onAdd={() => setOpenDialog(true)}
              />
            }
          />

          <CardContent>
            {isError ? (
              <Typography color="error">{(error as Error).message}</Typography>
            ) : (
              <>
                <DataTable 
                  table={table} 
                  emptyMessage="Товары не найдены" 
                />

                <PaginationFooter
                  page={page}
                  totalPages={totalPages}
                  total={total}
                  skip={skip}
                  limit={limit}
                  onChangePage={changePage}
                />
              </>
            )}
          </CardContent>
        </Card>
      </Box>

      <AddProductDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSuccess={addProduct}
        isSubmitting={isFetching}
      />

      <ProductActionsMenu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={closeMenu}
        onEdit={() => openToast('Редактирование скоро', 'info')}
        onDelete={() => openToast('Удаление скоро', 'info')}
      />

      <Snackbar open={toastOpen} autoHideDuration={3000} onClose={closeToast}>
        <AlertMUI severity={toastSeverity} variant="filled">
          {toastMessage}
        </AlertMUI>
      </Snackbar>
    </Box>
  );
}