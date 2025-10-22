/**
 * Toast Context Provider
 * Provides app-wide toast notification functionality
 */

import type { ReactNode } from 'react';
import ToastContainer from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';
import { ToastContext } from '@/hooks/useToastContext';

export function ToastProvider({ children }: { children: ReactNode }) {
  const { toasts, removeToast, success, error, warning, info } = useToast();

  return (
    <ToastContext.Provider value={{ success, error, warning, info }}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
}
