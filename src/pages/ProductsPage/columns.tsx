import type { ColumnDef } from '@tanstack/react-table';
import { Box, Checkbox, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import type { MouseEvent } from 'react';

import type { Product } from '../../entities/product/api/getProducts';

type Params = {
  selectedIds: Set<number>;
  toggleAllCurrent: () => void;
  toggleOne: (id: number) => void;
  allChecked: boolean;
  someChecked: boolean;
  openToast: (message: string, severity: 'success' | 'info') => void;
  handleOpenMenu: (e: MouseEvent<HTMLElement>, id: number) => void;
};

export function createProductColumns({
  selectedIds,
  toggleAllCurrent,
  toggleOne,
  allChecked,
  someChecked,
  openToast,
  handleOpenMenu,
}: Params): ColumnDef<Product>[] {
  return [
    {
      id: 'select',
      header: () => (
        <Checkbox
          checked={allChecked}
          indeterminate={someChecked}
          onChange={() => toggleAllCurrent()}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={selectedIds.has(row.original.id)}
          onChange={() => toggleOne(row.original.id)}
        />
      ),
      meta: { align: 'center', width: 60 } as any,
    },
    {
      id: 'title',
      accessorKey: 'title',
      header: 'Название',
      meta: { width: 350 } as any,
    },
    {
      id: 'price',
      accessorKey: 'price',
      header: 'Цена',
      meta: { width: 140, align: 'right' } as any,
    },
    {
      id: 'rating',
      accessorKey: 'rating',
      header: 'Рейтинг',
      cell: ({ getValue }) => {
        const value = getValue<number>();
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
      meta: { width: 120, align: 'center' } as any,
    },
    {
      id: 'brand',
      accessorKey: 'brand',
      header: 'Бренд',
      meta: { width: 200 } as any,
    },
    {
      id: 'plus',
      header: '',
      cell: () => (
        <Box
          onClick={() => openToast('Добавлено', 'info')}
          sx={{
            width: 52,
            height: 27,
            bgcolor: '#242EDB',
            borderRadius: '23px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            '&:hover': { backgroundColor: '#1F27C8' },
          }}
        >
          <AddIcon sx={{ color: '#FFFFFF', fontSize: 16 }} />
        </Box>
      ),
      meta: { align: 'center', width: 80 } as any,
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <IconButton size="small" onClick={(e) => handleOpenMenu(e, row.original.id)}>
          <MoreHorizIcon fontSize="small" />
        </IconButton>
      ),
      meta: { align: 'center', width: 80 } as any,
    },
  ];
}
