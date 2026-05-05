import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FormFieldProps {
  label?: string;
  id?: string;
  error?: string;
  helpText?: string;
  required?: boolean;
  disabled?: boolean;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  error,
  helpText,
  required,
  disabled,
  icon: Icon,
  children,
  className = ''
}) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label 
          htmlFor={id} 
          className="text-xs font-black text-texto-sec uppercase tracking-widest flex items-center gap-1"
        >
          {label}
          {required && <span className="text-rojo">*</span>}
        </label>
      )}
      
      <div className="relative group">
        {Icon && (
          <Icon 
            size={18} 
            className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${error ? 'text-red-500' : 'text-gris group-focus-within:text-rojo'}`} 
          />
        )}
        
        {/* We expect the children to be an input/select/textarea with appropriate styling classes */}
        <div className={Icon ? 'has-icon' : ''}>
          {children}
        </div>
      </div>

      {error ? (
        <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider">{error}</p>
      ) : helpText ? (
        <p className="text-xs text-gris">{helpText}</p>
      ) : null}

      <style dangerouslySetInnerHTML={{ __html: `
        .has-icon input, .has-icon select, .has-icon textarea {
          padding-left: 2.75rem !important;
        }
        
        input, select, textarea {
          width: 100%;
          padding: 0.875rem 1rem;
          background: #F9FAFB;
          border: 2px solid transparent;
          border-radius: 0.75rem;
          font-size: 0.875rem;
          color: #1F2933;
          transition: all 0.2s ease;
        }
        
        input:focus, select:focus, textarea:focus {
          outline: none;
          background: white;
          border-color: rgba(169, 0, 0, 0.2);
          box-shadow: 0 0 0 4px rgba(169, 0, 0, 0.04);
        }
        
        input:disabled, select:disabled, textarea:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        input.error, select.error, textarea.error {
          border-color: #EF4444;
          background-color: #FEF2F2;
        }
      `}} />
    </div>
  );
};
