import { useState } from 'react';

export type ToastSeverity = 'success' | 'info';

export function useProductsUIOverlays() {
  // toast
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState<ToastSeverity>('info');

  const openToast = (message: string, severity: ToastSeverity = 'info') => {
    setToastMessage(message);
    setToastSeverity(severity);
    setToastOpen(true);
  };

  const closeToast = () => setToastOpen(false);

  // menu
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);

  const openMenu = (e: React.MouseEvent<HTMLElement>, _id?: number) => {
    setMenuAnchorEl(e.currentTarget);
  };

  const closeMenu = () => setMenuAnchorEl(null);

  return {
    toastOpen,
    toastMessage,
    toastSeverity,
    openToast,
    closeToast,

    menuAnchorEl,
    openMenu,
    closeMenu,
  };
}
