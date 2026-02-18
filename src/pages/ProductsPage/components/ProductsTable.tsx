import { flexRender } from '@tanstack/react-table';
import type { Table as TableInstance } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { isSortableColumn } from '../utils/sorting';
import type { Product } from '../../../entities/product/api/getProducts';
import type { SortingState } from '@tanstack/react-table';

type Props = {
  table: TableInstance<Product>;
  sortingState: SortingState;
  onToggleSort: (columnId: string) => void;
};

export function ProductsTable({ table, sortingState, onToggleSort }: Props) {
  return (
    <Table>
      <TableHead>
        {table.getHeaderGroups().map((hg) => (
          <TableRow key={hg.id}>
            {hg.headers.map((header) => {
              const id = header.column.id;
              const sortable = isSortableColumn(id);
              const isActive = sortingState[0]?.id === id;
              const isDesc = sortingState[0]?.desc;

              return (
                <TableCell
                  key={header.id}
                  onClick={sortable ? () => onToggleSort(id) : undefined}
                  sx={{
                    cursor: sortable ? 'pointer' : 'default',
                    userSelect: 'none',
                  }}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {sortable && isActive && (isDesc ? ' ↓' : ' ↑')}
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
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}