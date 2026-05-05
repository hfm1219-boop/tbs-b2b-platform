import React from 'react';
import { LucideIcon, Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className = '', 
    variant = 'primary', 
    size = 'md', 
    isLoading = false, 
    fullWidth = false,
    leftIcon: LeftIcon, 
    rightIcon: RightIcon, 
    children, 
    disabled,
    ...props 
  }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center font-black uppercase tracking-widest transition-all duration-200 rounded-xl cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]";
    
    const widthStyles = fullWidth ? "w-full" : "";
    
    const variants = {
      primary: "bg-rojo text-white hover:bg-rojo-oscuro shadow-sm",
      secondary: "bg-texto text-white hover:bg-texto-sec shadow-sm",
      outline: "bg-transparent border-2 border-borde text-texto hover:border-rojo hover:text-rojo",
      ghost: "bg-transparent text-texto-sec hover:bg-gray-100 hover:text-texto",
      danger: "bg-white border-2 border-red-500 text-red-600 hover:bg-red-50",
      success: "bg-green-600 text-white hover:bg-green-700 shadow-sm"
    };

    const isIconOnly = !children && (!!LeftIcon || !!RightIcon || isLoading);

    const sizes = {
      sm: isIconOnly ? "w-10 h-10" : "px-4 py-2 text-[10px] gap-1.5",
      md: isIconOnly ? "w-12 h-12" : "px-6 py-3 text-[11px] gap-2",
      lg: isIconOnly ? "w-14 h-14" : "px-8 py-4 text-[13px] gap-2.5"
    };

    const iconSizes = {
      sm: 16,
      md: 18,
      lg: 22
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${widthStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="animate-spin shrink-0" size={iconSizes[size]} />
        ) : (
          <>
            {LeftIcon && <LeftIcon size={iconSizes[size]} className="shrink-0" />}
            {children}
            {RightIcon && <RightIcon size={iconSizes[size]} className="shrink-0" />}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
