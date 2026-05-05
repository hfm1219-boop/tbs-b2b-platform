import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  id: string;
  type?: ToastType;
  message: string;
  description?: string;
  duration?: number;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({
  id,
  type = 'success',
  message,
  description,
  duration = 5000,
  onClose
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const variants = {
    success: { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-white', border: 'border-green-100', accent: 'bg-green-500' },
    error: { icon: AlertCircle, color: 'text-red-500', bg: 'bg-white', border: 'border-red-100', accent: 'bg-red-500' },
    info: { icon: Info, color: 'text-blue-500', bg: 'bg-white', border: 'border-blue-100', accent: 'bg-blue-500' },
    warning: { icon: AlertCircle, color: 'text-amber-500', bg: 'bg-white', border: 'border-amber-100', accent: 'bg-amber-500' }
  };

  const { icon: Icon, color, bg, border, accent } = variants[type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.95, transition: { duration: 0.2 } }}
      layout
      className={`flex items-start gap-4 p-4 min-w-[320px] max-w-md rounded-2xl border shadow-[0_8px_30px_rgb(0,0,0,0.08)] ${bg} ${border} relative overflow-hidden`}
    >
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${accent}`} />
      <div className={`mt-0.5 p-1.5 rounded-lg ${accent} bg-opacity-10 shrink-0`}>
        <Icon className={color} size={18} />
      </div>
      <div className="flex-1 pr-4">
        <h4 className="text-sm font-black text-texto leading-snug">{message}</h4>
        {description && <p className="text-xs font-medium text-gris mt-1 leading-relaxed">{description}</p>}
      </div>
      <button 
        onClick={() => onClose(id)} 
        className="text-gris hover:text-texto p-1 hover:bg-gray-100 rounded-lg transition-colors absolute top-3 right-3"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
};

// Simplified Toast Container component logic
export const ToastContainer: React.FC<{ toasts: any[], removeToast: any }> = ({ toasts, removeToast }) => (
  <div className="fixed bottom-6 right-6 z-[250] flex flex-col gap-3 pointer-events-none">
    <AnimatePresence mode="popLayout">
      {toasts.map(toast => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast {...toast} onClose={removeToast} />
        </div>
      ))}
    </AnimatePresence>
  </div>
);
