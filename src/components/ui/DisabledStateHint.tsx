import React from 'react';
import { Info, Lock } from 'lucide-react';
import { motion } from 'motion/react';

interface DisabledStateHintProps {
  reason: string;
  action?: string;
  role?: string;
  className?: string;
}

export const DisabledStateHint: React.FC<DisabledStateHintProps> = ({ 
  reason, 
  action, 
  role,
  className = '' 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-3 bg-gray-50 border border-gray-200 rounded-xl flex gap-3 items-start ${className}`}
    >
      <div className="p-1.5 bg-gray-200 rounded-lg text-gris shrink-0">
        <Lock size={14} />
      </div>
      <div>
        <div className="text-[10px] font-black uppercase tracking-widest text-gris mb-0.5">Acción restringida</div>
        <p className="text-xs font-bold text-texto leading-snug">{reason}</p>
        
        {(action || role) && (
          <div className="mt-2 flex flex-wrap gap-2">
            {role && (
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-black uppercase rounded tracking-wider border border-blue-100 italic">
                Rol: {role}
              </span>
            )}
            {action && (
              <span className="text-[10px] font-black text-rojo hover:underline cursor-pointer">
                {action}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
