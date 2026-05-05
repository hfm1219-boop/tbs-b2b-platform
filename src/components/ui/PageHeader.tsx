import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from './Button';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
    isLoading?: boolean;
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  };
  badge?: {
    label: string;
    status?: string;
  };
  metric?: {
    label: string;
    value: string;
    trend?: 'up' | 'down';
  };
  variant?: 'public' | 'dashboard' | 'operative' | 'compact';
  tabs?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
  badge,
  metric,
  variant = 'dashboard',
  tabs,
  className = ''
}) => {
  const isCompact = variant === 'compact';
  const isPublic = variant === 'public';

  return (
    <div className={`flex flex-col gap-6 mb-8 ${className}`}>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex-1 min-w-0">
          {eyebrow && (
            <span className="text-[10px] sm:text-[11px] font-black text-rojo uppercase tracking-[0.2em] block mb-3">
              {eyebrow}
            </span>
          )}
          
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h1 className={`font-black text-texto tracking-tighter leading-none ${
              isPublic ? 'text-4xl md:text-5xl lg:text-6xl' : 
              isCompact ? 'text-2xl' : 'text-3xl md:text-4xl'
            }`}>
              {title}
            </h1>
            
            {badge && (
              <div className="mt-1">
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                  badge.status === 'success' ? 'bg-green-50 text-green-700 border-green-100' :
                  badge.status === 'warning' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                  badge.status === 'danger' ? 'bg-rojo-suave text-rojo border-red-100' :
                  'bg-gray-100 text-gray-700 border-gray-200'
                }`}>
                  {badge.label}
                </span>
              </div>
            )}
          </div>

          {description && (
            <p className={`text-texto-sec leading-relaxed max-w-3xl ${
              isPublic ? 'text-lg md:text-xl' : 'text-sm md:text-base'
            }`}>
              {description}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {metric && (
            <div className="hidden sm:flex flex-col items-end px-4 py-2 bg-white rounded-xl border border-borde shadow-sm mr-2">
              <span className="text-[9px] font-black text-gris uppercase tracking-widest leading-none mb-1">
                {metric.label}
              </span>
              <span className="text-xl font-black text-texto tracking-tighter leading-none">
                {metric.value}
              </span>
            </div>
          )}

          {secondaryAction && (
            <Button
              variant={secondaryAction.variant || 'outline'}
              size={isCompact ? 'sm' : 'md'}
              onClick={secondaryAction.onClick}
              leftIcon={secondaryAction.icon}
              className="rounded-xl"
            >
              {secondaryAction.label}
            </Button>
          )}

          {primaryAction && (
            <Button
              variant={primaryAction.variant || 'primary'}
              size={isCompact ? 'sm' : 'lg'}
              onClick={primaryAction.onClick}
              leftIcon={primaryAction.icon}
              isLoading={primaryAction.isLoading}
              disabled={primaryAction.disabled}
              className={`rounded-xl shadow-lg ${primaryAction.variant === 'primary' || !primaryAction.variant ? 'shadow-rojo/20' : ''}`}
            >
              {primaryAction.label}
            </Button>
          )}
        </div>
      </div>

      {tabs && (
        <div className="mt-2 border-b border-borde">
          {tabs}
        </div>
      )}
    </div>
  );
};
