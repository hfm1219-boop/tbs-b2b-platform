import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info } from 'lucide-react';

interface TooltipProps {
  content: string;
  title?: string;
  children?: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  showIcon?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  title, 
  children, 
  position = 'top',
  showIcon = false 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const containerVariants = {
    top: { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '10px' },
    bottom: { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '10px' },
    left: { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: '10px' },
    right: { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: '10px' }
  };

  const arrowVariants = {
    top: { bottom: '-4px', left: '50%', transform: 'translateX(-50%) rotate(45deg)', borderRight: '1px solid #f1f3f6', borderBottom: '1px solid #f1f3f6' },
    bottom: { top: '-4px', left: '50%', transform: 'translateX(-50%) rotate(45deg)', borderLeft: '1px solid #f1f3f6', borderTop: '1px solid #f1f3f6' },
    left: { right: '-4px', top: '50%', transform: 'translateY(-50%) rotate(45deg)', borderRight: '1px solid #f1f3f6', borderTop: '1px solid #f1f3f6' },
    right: { left: '-4px', top: '50%', transform: 'translateY(-50%) rotate(45deg)', borderLeft: '1px solid #f1f3f6', borderBottom: '1px solid #f1f3f6' }
  };

  return (
    <div 
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onClick={() => setIsVisible(!isVisible)}
    >
      {children ? children : showIcon && <Info size={14} className="text-gris cursor-help" />}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={containerVariants[position]}
            className="absolute z-[300] bg-white border border-[#f1f3f6] shadow-xl rounded-xl p-3 w-64 pointer-events-none"
          >
            {title && <div className="text-[10px] font-black uppercase tracking-widest text-rojo mb-1">{title}</div>}
            <p className="text-xs font-bold text-texto leading-relaxed">{content}</p>
            <div 
              style={arrowVariants[position]} 
              className="absolute w-2 h-2 bg-white" 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
