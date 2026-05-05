import React from 'react';
import { Search, Filter, Download } from 'lucide-react';
import { EmptyState } from './EmptyState';

interface TableShellProps {
  title?: string;
  description?: string;
  search?: {
    placeholder: string;
    value: string;
    onChange: (val: string) => void;
  };
  actions?: React.ReactNode;
  children: React.ReactNode;
  isEmpty?: boolean;
  emptyProps?: Parameters<typeof EmptyState>[0];
  isLoading?: boolean;
  className?: string;
}

export const TableShell: React.FC<TableShellProps> = ({
  title,
  description,
  search,
  actions,
  children,
  isEmpty,
  emptyProps,
  isLoading,
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-[32px] border border-borde panel-shadow overflow-hidden ${className}`}>
      {(title || description || search || actions) && (
        <div className="p-8 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              {title && <h3 className="text-xl font-black text-texto tracking-tight">{title}</h3>}
              {description && <p className="text-sm text-texto-sec mt-1">{description}</p>}
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {search && (
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gris" size={18} />
                  <input
                    type="text"
                    placeholder={search.placeholder}
                    value={search.value}
                    onChange={(e) => search.onChange(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:border-rojo/20 focus:bg-white rounded-xl text-sm transition-all focus:outline-none"
                  />
                </div>
              )}
              {actions && <div className="flex items-center gap-2 w-full sm:w-auto">{actions}</div>}
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        {isEmpty ? (
          <div className="p-12">
            <EmptyState 
              variant="noResults" 
              title="No se encontraron resultados" 
              description="Intenta ajustar los filtros de búsqueda para encontrar lo que necesitas."
              {...emptyProps} 
            />
          </div>
        ) : (
          <div className={isLoading ? 'opacity-50 pointer-events-none' : ''}>
            {children}
          </div>
        )}
      </div>
    </div>
  );
};
