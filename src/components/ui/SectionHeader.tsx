import React from 'react';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  centered?: boolean;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  description,
  action,
  centered = false,
  className = ''
}) => {
  return (
    <div className={`flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 ${centered ? 'text-center items-center' : ''} ${className}`}>
      <div className={centered ? 'max-w-2xl' : 'max-w-3xl'}>
        {eyebrow && (
          <span className="text-[10px] font-black text-rojo uppercase tracking-[0.2em] block mb-2">
            {eyebrow}
          </span>
        )}
        <h2 className="text-2xl md:text-3xl font-black text-texto tracking-tighter leading-[1.1] mb-2">
          {title}
        </h2>
        {description && (
          <p className="text-sm md:text-base text-texto-sec leading-relaxed">
            {description}
          </p>
        )}
      </div>
      
      {action && (
        <button 
          onClick={action.onClick}
          className="shrink-0 text-[11px] font-black text-rojo hover:text-rojo-oscuro uppercase tracking-widest border-b-2 border-rojo/20 hover:border-rojo transition-all pb-0.5 w-fit"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
