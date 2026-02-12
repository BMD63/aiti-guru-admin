import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/inter/latin.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { queryClient } from './app/queryClient';
import { AuthProvider } from './features/auth/AuthContext';

const theme = createTheme({
  typography: {
    fontFamily: ['Inter', 'system-ui', 'Arial', 'sans-serif'].join(','),
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
       <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <CssBaseline />
            <App />
          </AuthProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);
