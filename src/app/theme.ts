import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  typography: {
    fontFamily: ['Inter', 'system-ui', 'Arial', 'sans-serif'].join(','),
  },
  palette: {
    primary: {
      main: '#242EDB',
    },
  },
});