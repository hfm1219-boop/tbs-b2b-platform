import React from 'react';
import { LucideIcon, Info, CheckCircle2, AlertTriangle, AlertCircle, X } from 'lucide-react';

type AlertVariant = 'info' | 'success' | 'warning' | 'danger' | 'neutral';

interface AlertBoxProps {
  variant?: AlertVariant;
  type?: AlertVariant; // Alias for variant
  title?: string;
  description: string;
  icon?: any; // Can be LucideIcon or ReactNode
  onClose?: () => void;
  cta?: {
    label: string;
    onClick: () => void;
  };
  actions?: React.ReactNode; // New prop for additional actions
  className?: string;
}

const variantConfig: Record<AlertVariant, { icon: LucideIcon; bg: string; border: string; text: string; iconColor: string }> = {
  info: { 
    icon: Info, 
    bg: 'bg-blue-50', 
    border: 'border-blue-100', 
    text: 'text-blue-900', 
    iconColor: 'text-blue-600' 
  },
  success: { 
    icon: CheckCircle2, 
    bg: 'bg-green-50', 
    border: 'border-green-100', 
    text: 'text-green-900', 
    iconColor: 'text-green-600' 
  },
  warning: { 
    icon: AlertTriangle, 
    bg: 'bg-amber-50', 
    border: 'border-amber-100', 
    text: 'text-amber-900', 
    iconColor: 'text-amber-600' 
  },
  danger: { 
    icon: AlertCircle, 
    bg: 'bg-red-50', 
    border: 'border-red-100', 
    text: 'text-red-900', 
    iconColor: 'text-red-600' 
  },
  neutral: { 
    icon: Info, 
    bg: 'bg-gray-50', 
    border: 'border-gray-200', 
    text: 'text-gray-900', 
    iconColor: 'text-gray-600' 
  }
};

export const AlertBox: React.FC<AlertBoxProps> = ({
  variant,
  type,
  title,
  description,
  icon: CustomIcon,
  onClose,
  cta,
  actions,
  className = ''
}) => {
  const activeVariant = variant || type || 'info';
  const config = variantConfig[activeVariant];
  
  const renderIcon = () => {
    const Icon = CustomIcon || config.icon;
    if (!Icon) return null;
    if (React.isValidElement(Icon)) return Icon;
    
    const IconComp = Icon as any;
    return <IconComp size={20} className={`${config.iconColor} shrink-0 mt-0.5`} />;
  };

  return (
    <div className={`flex gap-3 p-4 rounded-2xl border ${config.bg} ${config.border} ${config.text} ${className}`}>
      {renderIcon()}
      
      <div className="flex-1">
        {title && <h4 className="text-sm font-black mb-1">{title}</h4>}
        <p className="text-xs leading-relaxed opacity-90">{description}</p>
        
        {(cta || actions) && (
          <div className="mt-3 flex items-center gap-3">
            {cta && (
              <button 
                onClick={cta.onClick}
                className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1 hover:underline underline-offset-4"
              >
                {cta.label}
              </button>
            )}
            {actions}
          </div>
        )}
      </div>

      {onClose && (
        <button 
          onClick={onClose}
          className="p-1 hover:bg-black/5 rounded-lg transition-colors h-fit"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};
