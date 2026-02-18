import { flexRender } from '@tanstack/react-table';
import type { Table as TableInstance } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';

const tableHeaderCellStyle = {
  cursor: 'pointer',
  userSelect: 'none',
};

const tableRowHoverStyle = {
  '&:hover': {
    backgroundColor: 'action.hover',
  },
};

type Props<TData extends object> = {
  table: TableInstance<TData>;
  emptyMessage?: string;
};

// 1. Переименовали функцию: ProductsTable -> DataTable
export function DataTable<TData extends object>({ table, emptyMessage = 'Нет данных' }: Props<TData>) {
  const rows = table.getRowModel().rows;
  const columnsCount = table.getAllColumns().length;

  return (
    <Table>
      <TableHead>
        {table.getHeaderGroups().map((hg) => (
          <TableRow key={hg.id}>
            {hg.headers.map((header) => {
              const canSort = header.column.getCanSort();
              const sortDirection = header.column.getIsSorted();

              return (
                <TableCell
                  key={header.id}
                  onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                  sx={canSort ? tableHeaderCellStyle : undefined}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {canSort && sortDirection && (sortDirection === 'desc' ? ' ↓' : ' ↑')}
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableHead>

      <TableBody>
        {rows.length > 0 ? (
          rows.map((row) => (
            <TableRow key={row.id} sx={tableRowHoverStyle}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columnsCount} align="center" sx={{ py: 4 }}>
              <Typography color="text.secondary">{emptyMessage}</Typography>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}