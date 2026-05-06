import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Divide as LucideDivide } from 'lucide-react';
import { motion } from 'motion/react';

interface MetricCardProps {
  title?: string;
  label?: string; // Alias for title used in some pages
  value: string | number;
  subtitle?: string;
  icon?: any; // Can be LucideIcon or ReactNode
  trend?: {
    value: number | string;
    isPositive: boolean;
  } | 'up' | 'down';
  trendValue?: string | number;
  badge?: string;
  cta?: {
    label: string;
    onClick: () => void;
  };
  progress?: {
    current: number;
    total: number;
    label?: string;
    color?: string;
  };
  color?: 'red' | 'green' | 'amber' | 'blue' | 'gray';
  featured?: boolean;
  className?: string;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  label,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  badge,
  cta,
  progress,
  color,
  featured,
  className = '',
  onClick
}) => {
  const displayTitle = title || label;

  const renderIcon = () => {
    if (!Icon) return null;
    if (React.isValidElement(Icon)) return Icon;
    
    const IconComp = Icon as any;
    return <IconComp size={featured ? 32 : 24} />;
  };

  const trendData = typeof trend === 'object' ? trend : 
                    trend === 'up' ? { value: trendValue || '', isPositive: true } :
                    trend === 'down' ? { value: trendValue || '', isPositive: false } :
                    null;

  const colorClasses = {
    red: 'bg-rojo-suave text-rojo',
    green: 'bg-green-50 text-green-600',
    amber: 'bg-amber-50 text-amber-600',
    blue: 'bg-blue-50 text-blue-600',
    gray: 'bg-gray-50 text-texto'
  };

  const iconColorClass = color ? colorClasses[color] : 'bg-gray-50 text-texto';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className={`relative overflow-hidden group transition-all duration-300 ${
        featured 
          ? 'p-6 lg:p-7 rounded-[32px] min-h-[160px]' 
          : 'p-6 rounded-[24px]'
      } border border-borde panel-shadow ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Decorative patterns for featured cards */}
      {featured && (
        <>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
        </>
      )}

      <div className={`flex items-start justify-between ${featured ? 'mb-4' : 'mb-3'}`}>
        <div className="relative z-10 flex-1 min-w-0">
          <p className={`font-black uppercase tracking-widest mb-1 opacity-70 truncate ${featured ? 'text-[11px]' : 'text-[11px]'}`}>
            {displayTitle}
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className={`font-black tracking-tighter truncate ${featured ? 'text-3xl lg:text-4xl' : 'text-2xl'}`}>
              {value}
            </h3>
            {trendData && (
              <span className={`flex items-center font-bold shrink-0 relative z-10 ${
                featured || className.includes('text-white') 
                  ? 'bg-white/20 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full text-[10px]' 
                  : `text-[10px] ${trendData.isPositive ? 'text-green-600' : 'text-red-600'}`
              }`}>
                {trendData.isPositive ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
                {trendData.value && (typeof trendData.value === 'number' ? `${trendData.value}%` : trendData.value)}
              </span>
            )}
          </div>
        </div>
        
        {Icon && (
          <div className={`relative z-10 transition-transform group-hover:scale-110 shrink-0 ${
            featured 
              ? 'p-4 rounded-2xl bg-white/20 backdrop-blur-md text-white shadow-xl ring-1 ring-white/30' 
              : `p-3 rounded-2xl ${className.includes('text-white') ? 'bg-white text-rojo shadow-lg' : iconColorClass}`
          }`}>
            {renderIcon()}
          </div>
        )}
      </div>

      {(subtitle || badge) && (
        <div className="flex items-center justify-between mb-4 relative z-10 gap-4">
          {subtitle && <p className={`${featured ? 'text-xs' : 'text-xs'} font-medium opacity-80 uppercase tracking-wide truncate`}>{subtitle}</p>}
          {badge && (
            <span className="px-2 py-0.5 bg-rojo-suave text-rojo text-[10px] font-black uppercase rounded-lg shrink-0">
              {badge}
            </span>
          )}
        </div>
      )}

      {progress && (
        <div className="mt-auto relative z-10 pt-2 font-sans">
          <div className={`flex justify-between font-bold uppercase mb-1.5 ${featured ? 'text-[10px]' : 'text-[10px]'} opacity-70`}>
            <span>{progress.label || 'Progreso'}</span>
            <span>{Math.round((progress.current / progress.total) * 100)}%</span>
          </div>
          <div className={`${featured ? 'h-1.5' : 'h-1.5'} w-full bg-black/10 rounded-full overflow-hidden backdrop-blur-sm`}>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (progress.current / progress.total) * 100)}%` }}
              className={`h-full ${progress.color || 'bg-white'} transition-all duration-500`}
            />
          </div>
        </div>
      )}

      {cta && (
        <div className="mt-6 relative z-10">
          <button 
            disabled // Placeholder for now, handled by onClick on card or specific logic
            className={`w-full py-3 font-black uppercase tracking-widest rounded-xl transition-all duration-200 ${
              featured 
                ? 'bg-white text-rojo hover:bg-gray-100 text-[11px]' 
                : 'bg-gray-50 text-texto hover:bg-rojo hover:text-white text-[10px]'
            }`}
          >
            {cta.label}
          </button>
        </div>
      )}
    </motion.div>
  );
};
