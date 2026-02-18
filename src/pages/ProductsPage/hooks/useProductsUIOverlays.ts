import { useState, useCallback } from 'react';

export type ToastSeverity = 'success' | 'info';

export function useProductsUIOverlays() {
  // toast
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState<ToastSeverity>('info');

  const openToast = useCallback((message: string, severity: ToastSeverity = 'info') => {
    setToastMessage(message);
    setToastSeverity(severity);
    setToastOpen(true);
  }, []);

  const closeToast = useCallback(() => setToastOpen(false), []);

  // menu
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [menuRowId, setMenuRowId] = useState<number | null>(null);

  const openMenu = useCallback((e: React.MouseEvent<HTMLElement>, id: number) => {
    e.stopPropagation();
    setMenuAnchorEl(e.currentTarget);
    setMenuRowId(id);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuAnchorEl(null);
    setMenuRowId(null);
  }, []);

  return {
    toastOpen,
    toastMessage,
    toastSeverity,
    openToast,
    closeToast,

    menuAnchorEl,
    menuRowId,
    openMenu,
    closeMenu,
  };
}