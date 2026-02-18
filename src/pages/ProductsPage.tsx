import { useMemo, useState, useEffect, useRef, useCallback, } from 'react';
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { useQueryClient } from '@tanstack/react-query';

import { PRODUCTS_PAGE } from './ProductsPage/constants';
import { useSearchParamsState } from '../shared/hooks/useSearchParamsState';
import { useProductsSorting } from './ProductsPage/hooks/useProductsSorting';
import { useProductsSelection } from './ProductsPage/hooks/useProductsSelection';
import { useProductsUIOverlays } from './ProductsPage/hooks/useProductsUIOverlays';
import { useProductsQuery } from '../entities/product/queries/useProductsQuery';
import { useDebouncedValue } from '../shared/hooks/useDebouncedValue';
import { productsQueryKey } from '../entities/product/queries/queryKeys';
import { useAddProduct } from './ProductsPage/hooks/useAddProduct';
import { isSortableColumn } from './ProductsPage/utils/sorting';

import { createProductColumns } from './ProductsPage/columns';
import { AddProductDialog } from './ProductsPage/components/AddProductDialog';
import { PaginationFooter } from './ProductsPage/components/PaginationFooter';
import { ProductsToolbar } from './ProductsPage/components/ProductsToolbar';
import { ProductsHeaderActions } from './ProductsPage/components/ProductsHeaderActions';

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
  const queryClient = useQueryClient();

  // search
  const [q, setQ] = useState('');
  const debouncedQ = useDebouncedValue(q, 400);

  // dialog
  const [open, setOpen] = useState(false);

  // url
  const { getNumber, set: setParams } = useSearchParamsState();
  const page = Math.max(1, getNumber('page', 1));
  const limit = PRODUCTS_PAGE.limit;
  const skip = (page - 1) * limit;

  // stable query key
  const currentProductsKey = useMemo(
    () => productsQueryKey({ q: debouncedQ, limit, skip }),
    [debouncedQ, limit, skip],
  );

  // data
  const { data, isFetching, isError, error } = useProductsQuery({
    q: debouncedQ,
    limit,
    skip,
  });

  // sorting
  const { sortingState, toggleSort, currentSort, currentOrder, } =
    useProductsSorting();

  // reset page on search change
  const prevQRef = useRef(debouncedQ);
  useEffect(() => {
    if (prevQRef.current === debouncedQ) return;
    prevQRef.current = debouncedQ;
    setParams({ page: 1 }, { replace: true });
  }, [debouncedQ, setParams]);

  // pagination
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / limit);

  const changePage = (nextPage: number) => {
    setParams({ page: nextPage });
  };

  // selection
  const {
    selectedIds,
    allChecked,
    someChecked,
    toggleAllCurrent,
    toggleOne,
  } = useProductsSelection(data?.products ?? []);

  // overlays
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

  // form

  const { addProduct } = useAddProduct({
    queryKey: currentProductsKey,
    onClose: () => setOpen(false),
    onToast: openToast,
  });
    // columns
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
  const table = useReactTable({
    data: data?.products ?? [],
    columns,
    state: { sorting: sortingState },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });


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
                onAdd={() => setOpen(true)}
              />
            }
          />

          <CardContent>
            {isError ? (
              <Typography color="error">{(error as Error).message}</Typography>
            ) : (
              <>
                <Table>
                  <TableHead>
                    {table.getHeaderGroups().map((hg) => (
                      <TableRow key={hg.id}>
                        {hg.headers.map((header) => {
                          const id = header.column.id;
                          const sortable = isSortableColumn(id);

                          return (
                            <TableCell
                              key={header.id}
                              onClick={sortable ? () => toggleSort(id) : undefined}
                            >
                              {flexRender(header.column.columnDef.header, header.getContext())}
                              {sortable &&
                                currentSort === id &&
                                (currentOrder === 'desc' ? ' ↓' : ' ↑')}
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
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={addProduct}
        isSubmitting={isFetching}
      />

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={closeMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        keepMounted
      >
        <MenuItem onClick={() => { closeMenu(); openToast('Редактирование скоро', 'info'); }}>
          Редактировать
        </MenuItem>
        <MenuItem onClick={() => { closeMenu(); openToast('Удаление скоро', 'info'); }}>
          Удалить
        </MenuItem>
      </Menu>

      <Snackbar open={toastOpen} autoHideDuration={3000} onClose={closeToast}>
        <AlertMUI severity={toastSeverity} variant="filled">
          {toastMessage}
        </AlertMUI>
      </Snackbar>
    </Box>
  );
}
