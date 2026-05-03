
import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onHomeClick: () => void;
}

export function Breadcrumbs({ items, onHomeClick }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gris/60 mb-8 overflow-x-auto whitespace-nowrap pb-2 md:pb-0 no-scrollbar">
      <button 
        onClick={onHomeClick}
        className="flex items-center gap-1 hover:text-rojo transition-colors cursor-pointer"
      >
        <Home size={14} />
        <span>Inicio</span>
      </button>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={12} className="text-gris/30" />
          {item.current ? (
            <span className="text-rojo">{item.label}</span>
          ) : (
            <button 
              onClick={item.onClick}
              className="hover:text-rojo transition-colors cursor-pointer"
            >
              {item.label}
            </button>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
