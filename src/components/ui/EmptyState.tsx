import React from 'react';
import { 
  LucideIcon, 
  Search, 
  Inbox, 
  Lock, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  ShieldAlert,
  AlertTriangle,
  XCircle,
  TimerOff,
  HelpCircle,
  PackageOpen,
  FileSearch,
  FileWarning
} from 'lucide-react';
import { Button } from './Button';
import { motion } from 'motion/react';

export type EmptyStateVariant = 
  | 'neutral' 
  | 'error' 
  | 'pending' 
  | 'success' 
  | 'blocked' 
  | 'noPermission' 
  | 'actionRequired' 
  | 'noResults' 
  | 'warning' 
  | 'expired';

interface EmptyStateProps {
  variant?: EmptyStateVariant;
  icon?: LucideIcon;
  title: string;
  description: string;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  tertiaryActionLabel?: string;
  onTertiaryAction?: () => void;
  children?: React.ReactNode;
  compact?: boolean;
  fullPage?: boolean;
  contextLabel?: string;
  helperText?: string;
  showSupportLink?: boolean;
  roleExplanation?: {
    current: string;
    required: string;
  };
  className?: string;
}

const variantConfig: Record<EmptyStateVariant, { icon: LucideIcon; color: string; bgColor: string }> = {
  neutral: { icon: PackageOpen, color: 'text-gray-400', bgColor: 'bg-gray-50' },
  success: { icon: CheckCircle2, color: 'text-green-500', bgColor: 'bg-green-50' },
  pending: { icon: Clock, color: 'text-amber-500', bgColor: 'bg-amber-50' },
  error: { icon: XCircle, color: 'text-red-500', bgColor: 'bg-red-50' },
  blocked: { icon: Lock, color: 'text-texto', bgColor: 'bg-gray-100' },
  noResults: { icon: FileSearch, color: 'text-gris', bgColor: 'bg-gray-50' },
  noPermission: { icon: ShieldAlert, color: 'text-rojo', bgColor: 'bg-rojo/5' },
  actionRequired: { icon: AlertCircle, color: 'text-rojo', bgColor: 'bg-rojo/5' },
  warning: { icon: AlertTriangle, color: 'text-amber-500', bgColor: 'bg-amber-50' },
  expired: { icon: TimerOff, color: 'text-gris', bgColor: 'bg-gray-50' }
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  variant = 'neutral',
  icon: CustomIcon,
  title,
  description,
  primaryActionLabel,
  onPrimaryAction,
  secondaryActionLabel,
  onSecondaryAction,
  tertiaryActionLabel,
  onTertiaryAction,
  children,
  compact = false,
  fullPage = false,
  contextLabel,
  helperText,
  showSupportLink = false,
  roleExplanation,
  className = ''
}) => {
  const { icon: DefaultIcon, color, bgColor } = variantConfig[variant];
  const Icon = CustomIcon || DefaultIcon;

  const containerClasses = fullPage 
    ? 'min-h-[60vh] flex flex-col items-center justify-center' 
    : `bg-white rounded-[40px] border border-gray-100 shadow-sm p-12 ${compact ? 'py-8 px-8' : 'p-12'}`;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center text-center ${containerClasses} ${className}`}
    >
      {contextLabel && (
        <span className="mb-6 px-3 py-1 bg-gray-100 text-gris text-[10px] font-black uppercase tracking-widest rounded-full">
          {contextLabel}
        </span>
      )}

      <div className={`p-6 ${bgColor} rounded-full mb-8 ${color} transition-colors duration-300`}>
        <Icon size={compact ? 32 : 56} strokeWidth={1.5} />
      </div>

      <h3 className={`${compact ? 'text-lg' : 'text-3xl'} font-black text-texto tracking-tighter mb-4 leading-none`}>
        {title}
      </h3>
      
      <p className={`text-texto-sec max-w-md ${compact ? 'text-xs mb-6' : 'text-base mb-10'} font-medium leading-relaxed`}>
        {description}
      </p>

      {roleExplanation && (
        <div className="mb-8 p-4 bg-gray-50 rounded-2xl w-full max-w-sm text-left border border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-black uppercase text-gris tracking-widest">Rol Actual</span>
            <span className="text-xs font-bold text-texto">{roleExplanation.current}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase text-rojo tracking-widest">Rol Requerido</span>
            <span className="text-xs font-bold text-rojo">{roleExplanation.required}</span>
          </div>
        </div>
      )}

      {children && <div className="mb-8 w-full">{children}</div>}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
        {onPrimaryAction && primaryActionLabel && (
          <button 
            onClick={onPrimaryAction}
            className="w-full sm:w-auto h-14 px-8 bg-rojo text-white rounded-xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-rojo/20 cursor-pointer"
          >
            {primaryActionLabel}
          </button>
        )}
        {onSecondaryAction && secondaryActionLabel && (
          <button 
            onClick={onSecondaryAction}
            className="w-full sm:w-auto h-14 px-8 bg-white border border-gray-200 text-texto rounded-xl font-black text-sm uppercase tracking-widest hover:bg-gray-50 transition-all cursor-pointer"
          >
            {secondaryActionLabel}
          </button>
        )}
        {onTertiaryAction && tertiaryActionLabel && (
          <button 
            onClick={onTertiaryAction}
            className="w-full sm:w-auto h-14 px-8 text-gris hover:text-rojo rounded-xl font-black text-[11px] uppercase tracking-widest transition-all cursor-pointer"
          >
            {tertiaryActionLabel}
          </button>
        )}
      </div>

      {(helperText || showSupportLink) && (
        <div className="mt-10 pt-8 border-t border-gray-50 w-full flex flex-col items-center gap-4">
          {helperText && (
            <p className="text-[11px] text-gris font-bold leading-relaxed max-w-sm italic">
              "{helperText}"
            </p>
          )}
          {showSupportLink && (
            <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-rojo hover:underline cursor-pointer">
              <HelpCircle size={14} /> Contactar Soporte TBS
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
};
