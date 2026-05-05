import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FloatingActionButtonProps {
  icon: LucideIcon;
  label?: string;
  badgeCount?: number;
  onClick: () => void;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  color?: 'rojo' | 'texto' | 'white';
  show?: boolean;
  className?: string;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon: Icon,
  label,
  badgeCount,
  onClick,
  position = 'bottom-right',
  color = 'rojo',
  show = true,
  className = ''
}) => {
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
  };

  const colorClasses = {
    rojo: 'bg-rojo text-white shadow-rojo/30 hover:scale-105 active:scale-95',
    texto: 'bg-texto text-white shadow-black/20 hover:scale-105 active:scale-95',
    white: 'bg-white text-texto border border-borde shadow-sm hover:bg-gray-50 active:scale-95',
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ scale: 0, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0, opacity: 0, y: 20 }}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className={`fixed ${positionClasses[position]} z-[90] flex items-center gap-3 p-4 rounded-full shadow-2xl transition-all md:hidden ${colorClasses[color]} ${className}`}
          id={`fab-${label?.toLowerCase().replace(/\s+/g, '-') || 'action'}`}
        >
          <div className="relative">
            <Icon size={24} strokeWidth={2.5} />
            {badgeCount !== undefined && badgeCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-rojo text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-rojo shadow-sm">
                {badgeCount > 99 ? '99+' : badgeCount}
              </span>
            )}
          </div>
          {label && <span className="font-black text-sm pr-2">{label}</span>}
        </motion.button>
      )}
    </AnimatePresence>
  );
};
