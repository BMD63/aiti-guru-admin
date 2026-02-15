import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Button, IconButton, Stack } from '@mui/material';

type Props = {
  onRefresh: () => void;
  onAdd: () => void;
};

export function ProductsHeaderActions({ onRefresh, onAdd }: Props) {
  return (
    <Stack direction="row" spacing={1}>
      <IconButton aria-label="refresh" onClick={onRefresh}>
        <RefreshIcon />
      </IconButton>

      <Button variant="contained" startIcon={<AddIcon />} onClick={onAdd}>
        Добавить
      </Button>
    </Stack>
  );
}
