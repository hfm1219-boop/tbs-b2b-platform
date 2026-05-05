import React, { createContext, useContext, useState, useCallback } from 'react';
import { ToastType } from './ui/Toast';
import { ToastContainer } from './ui/Toast';

interface ToastOptions {
  id: string;
  type: ToastType;
  message: string;
  description?: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (type: ToastType, message: string, description?: string, duration?: number) => void;
  success: (message: string, description?: string, duration?: number) => void;
  error: (message: string, description?: string, duration?: number) => void;
  info: (message: string, description?: string, duration?: number) => void;
  warning: (message: string, description?: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToasts = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToasts must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastOptions[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((type: ToastType, message: string, description?: string, duration?: number) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message, description, duration }]);
  }, []);

  const success = (message: string, description?: string, duration?: number) => showToast('success', message, description, duration);
  const error = (message: string, description?: string, duration?: number) => showToast('error', message, description, duration);
  const info = (message: string, description?: string, duration?: number) => showToast('info', message, description, duration);
  const warning = (message: string, description?: string, duration?: number) => showToast('warning', message, description, duration);

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};
