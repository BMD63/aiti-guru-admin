import { Button, Stack, Typography } from '@mui/material';

export default function App() {
  return (
    <Stack spacing={2} sx={{ p: 3 }}>
      <Typography variant="h5">MUI is connected</Typography>
      <Button variant="contained">Test button</Button>
    </Stack>
  );
}
