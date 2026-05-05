import React from 'react';
import { LucideIcon, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface ActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
  badge?: string;
  variant?: 'default' | 'highlight' | 'outline';
  className?: string;
}

export const ActionCard: React.FC<ActionCardProps> = ({
  icon: Icon,
  title,
  description,
  onClick,
  badge,
  variant = 'default',
  className = ''
}) => {
  const variants = {
    default: "bg-white border-transparent hover:border-rojo/20 panel-shadow",
    highlight: "bg-rojo-suave border-rojo/10 hover:border-rojo/30",
    outline: "bg-transparent border-borde hover:border-rojo/30 hover:bg-rojo-suave/30"
  };

  return (
    <motion.button
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative w-full text-left p-6 rounded-[28px] border-2 transition-all duration-300 group cursor-pointer ${variants[variant]} ${className}`}
    >
      {badge && (
        <span className="absolute top-4 right-4 px-2 py-1 bg-rojo text-white text-[9px] font-black uppercase tracking-widest rounded-lg shadow-sm">
          {badge}
        </span>
      )}
      
      <div className="p-3 bg-gray-50 group-hover:bg-rojo-suave rounded-2xl text-texto group-hover:text-rojo transition-colors w-fit mb-4">
        <Icon size={24} />
      </div>
      
      <h3 className="text-base font-black text-texto tracking-tight mb-1 group-hover:text-rojo transition-colors">
        {title}
      </h3>
      <p className="text-xs text-texto-sec leading-relaxed pr-8">
        {description}
      </p>

      <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all">
        <ArrowRight size={20} className="text-rojo" />
      </div>
    </motion.button>
  );
};
