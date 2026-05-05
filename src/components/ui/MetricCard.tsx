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
    color?: string;
  };
  color?: 'red' | 'green' | 'amber' | 'blue' | 'gray';
  className?: string;
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
  className = ''
}) => {
  const displayTitle = title || label;

  const renderIcon = () => {
    if (!Icon) return null;
    if (React.isValidElement(Icon)) return Icon;
    
    const IconComp = Icon as any;
    return <IconComp size={24} />;
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
      className={`bg-white p-6 rounded-[24px] border border-borde hover:border-rojo/20 transition-all duration-300 panel-shadow ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-[11px] font-black text-gris uppercase tracking-widest mb-1">{displayTitle}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-black text-texto tracking-tighter">{value}</h3>
            {trendData && (
              <span className={`flex items-center text-[10px] font-bold ${trendData.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trendData.isPositive ? <TrendingUp size={12} className="mr-0.5" /> : <TrendingDown size={12} className="mr-0.5" />}
                {trendData.value && `${trendData.value}%`}
              </span>
            )}
          </div>
        </div>
        {Icon && (
          <div className={`p-3 rounded-2xl ${iconColorClass}`}>
            {renderIcon()}
          </div>
        )}
      </div>

      {(subtitle || badge) && (
        <div className="flex items-center justify-between mb-4">
          {subtitle && <p className="text-xs text-texto-sec">{subtitle}</p>}
          {badge && (
            <span className="px-2 py-0.5 bg-rojo-suave text-rojo text-[10px] font-black uppercase rounded-lg">
              {badge}
            </span>
          )}
        </div>
      )}

      {progress && (
        <div className="mb-4">
          <div className="flex justify-between text-[10px] font-bold text-gris uppercase mb-1.5">
            <span>Progreso</span>
            <span>{Math.round((progress.current / progress.total) * 100)}%</span>
          </div>
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={`h-full ${progress.color || 'bg-rojo'} transition-all duration-500`}
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            />
          </div>
        </div>
      )}

      {cta && (
        <button 
          onClick={cta.onClick}
          className="w-full mt-2 py-2.5 text-[10px] font-black text-texto uppercase tracking-widest bg-gray-50 hover:bg-rojo hover:text-white rounded-xl transition-all duration-200"
        >
          {cta.label}
        </button>
      )}
    </motion.div>
  );
};
