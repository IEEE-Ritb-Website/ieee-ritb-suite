import { useState, useEffect } from "react";

type ToastVariant = "default" | "destructive" | "success";

export interface ToastProps {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

type ToastListeners = (toasts: ToastProps[]) => void;
let memoryToasts: ToastProps[] = [];
let listeners: ToastListeners[] = [];

const toastState = {
  addToast(toast: Omit<ToastProps, "id">) {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...toast, id };
    memoryToasts = [...memoryToasts, newToast];
    listeners.forEach((listener) => listener(memoryToasts));
    
    if (toast.duration !== Infinity) {
      setTimeout(() => {
        this.dismiss(id);
      }, toast.duration || 4000);
    }
    return id;
  },
  dismiss(id: string) {
    memoryToasts = memoryToasts.filter((t) => t.id !== id);
    listeners.forEach((listener) => listener(memoryToasts));
  },
  subscribe(listener: ToastListeners) {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }
};

export function toast(props: Omit<ToastProps, "id">) {
  return toastState.addToast(props);
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>(memoryToasts);

  useEffect(() => {
    return toastState.subscribe((newToasts) => {
      setToasts(newToasts);
    });
  }, []);

  return {
    toasts,
    toast,
    dismiss: (id: string) => toastState.dismiss(id),
  };
}
