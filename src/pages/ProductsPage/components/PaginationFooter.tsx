import {
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';

import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

type Props = {
  page: number;
  totalPages: number;
  total: number;
  skip: number;
  limit: number;
  pagesToShow: Array<number | 'dots'>;
  onChangePage: (page: number) => void;
};

export function PaginationFooter({
  page,
  totalPages,
  total,
  skip,
  limit,
  pagesToShow,
  onChangePage,
}: Props) {
  return (
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
        Показано: {total === 0 ? 0 : skip + 1}-
        {Math.min(skip + limit, total)} из {total}
      </Typography>

      <Stack direction="row" spacing={1} alignItems="center">
        <IconButton
          size="small"
          onClick={() => onChangePage(1)}
          disabled={page <= 1}
        >
          <FirstPageIcon fontSize="small" />
        </IconButton>

        <IconButton
          size="small"
          onClick={() => onChangePage(page - 1)}
          disabled={page <= 1}
        >
          <ChevronLeftIcon fontSize="small" />
        </IconButton>

        <Stack direction="row" spacing={0.5} alignItems="center">
          {pagesToShow.map((p, idx) =>
            p === 'dots' ? (
              <Typography key={`dots-${idx}`} sx={{ px: 1, color: '#6B6B6B' }}>
                …
              </Typography>
            ) : (
              <Button
                key={p}
                onClick={() => onChangePage(p)}
                variant={p === page ? 'contained' : 'text'}
                size="small"
                sx={{
                  minWidth: 34,
                  height: 32,
                  borderRadius: 2,
                  textTransform: 'none',
                  px: 1,
                }}
              >
                {p}
              </Button>
            ),
          )}
        </Stack>

        <IconButton
          size="small"
          onClick={() => onChangePage(page + 1)}
          disabled={page >= totalPages}
        >
          <ChevronRightIcon fontSize="small" />
        </IconButton>

        <IconButton
          size="small"
          onClick={() => onChangePage(totalPages)}
          disabled={page >= totalPages}
        >
          <LastPageIcon fontSize="small" />
        </IconButton>
      </Stack>
    </Box>
  );
}
