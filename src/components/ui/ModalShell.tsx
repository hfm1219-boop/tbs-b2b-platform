import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Loader2 } from 'lucide-react';
import { Button } from './Button';

interface ModalShellProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  isLoading?: boolean;
}

export const ModalShell: React.FC<ModalShellProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  isLoading = false
}) => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-[95vw]'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
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
            className={`relative w-full ${sizes[size]} bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]`}
          >
            {/* Header */}
            <div className="p-8 border-b border-gray-100 flex items-start justify-between">
              <div>
                {title && <h3 className="text-2xl font-black text-texto tracking-tighter">{title}</h3>}
                {description && <p className="text-sm text-texto-sec mt-1">{description}</p>}
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gris"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8">
              {isLoading ? (
                <div className="py-20 flex flex-col items-center justify-center">
                  <Loader2 className="animate-spin text-rojo mb-4" size={40} />
                  <p className="text-sm font-bold text-gris uppercase tracking-widest">Cargando información...</p>
                </div>
              ) : (
                children
              )}
            </div>

            {/* Footer */}
            {footer && (
              <div className="p-8 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
