import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, AlertCircle, Trash2, CheckCircle2, X } from 'lucide-react';
import { Button } from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'neutral' | 'warning' | 'danger' | 'success' | 'financial';
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'warning',
  isLoading = false
}) => {
  const configs = {
    neutral: { icon: AlertCircle, color: 'text-gray-500', bg: 'bg-gray-50', btn: 'secondary' as const },
    warning: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50', btn: 'primary' as const },
    danger: { icon: Trash2, color: 'text-red-500', bg: 'bg-red-50', btn: 'danger' as const },
    success: { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50', btn: 'success' as const },
    financial: { icon: AlertCircle, color: 'text-blue-500', bg: 'bg-blue-50', btn: 'primary' as const }
  };

  const config = configs[variant];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-texto/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl overflow-hidden p-8"
          >
            <div className="flex flex-col items-center text-center">
              <div className={`w-20 h-20 rounded-full ${config.bg} flex items-center justify-center ${config.color} mb-6`}>
                <Icon size={40} />
              </div>
              
              <h3 className="text-2xl font-black text-texto tracking-tighter mb-2">{title}</h3>
              <p className="text-sm font-bold text-gris leading-relaxed mb-8">{description}</p>
              
              <div className="flex flex-col w-full gap-3">
                <Button 
                  variant={config.btn} 
                  className="w-full h-14 rounded-2xl"
                  onClick={onConfirm}
                  isLoading={isLoading}
                >
                  {confirmLabel}
                </Button>
                <button 
                  onClick={onClose}
                  className="w-full py-4 text-xs font-black uppercase tracking-widest text-gris hover:text-texto transition-colors"
                >
                  {cancelLabel}
                </button>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-gris hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X size={20} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
