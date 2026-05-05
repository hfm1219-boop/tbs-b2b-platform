import React from 'react';
import { LucideIcon } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon?: LucideIcon;
  badge?: string | number;
}

interface ModuleTabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: 'default' | 'compact' | 'dashboard';
  className?: string;
}

export const ModuleTabs: React.FC<ModuleTabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'default',
  className = ''
}) => {
  const isDashboard = variant === 'dashboard';

  return (
    <div className={`w-full overflow-x-auto no-scrollbar ${className}`}>
      <div className={`flex items-center gap-1 min-w-max ${isDashboard ? 'p-1 bg-gray-100 rounded-xl' : 'border-b border-borde'}`}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`
                relative flex items-center gap-2.5 px-6 py-3.5 text-xs font-black uppercase tracking-widest transition-all cursor-pointer whitespace-nowrap
                ${isDashboard 
                  ? `${isActive ? 'bg-white text-rojo shadow-sm' : 'text-gris hover:text-texto hover:bg-white/50'} rounded-lg` 
                  : `${isActive ? 'text-rojo' : 'text-gris hover:text-texto'}`
                }
              `}
            >
              {Icon && <Icon size={16} className={isActive ? 'text-rojo' : 'text-gris'} />}
              <span>{tab.label}</span>
              
              {tab.badge !== undefined && (
                <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-black tracking-tight ${
                  isActive ? 'bg-rojo text-white' : 'bg-gray-100 text-gris group-hover:bg-gray-200'
                }`}>
                  {tab.badge}
                </span>
              )}

              {!isDashboard && isActive && (
                <div 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-rojo rounded-full" 
                  aria-hidden="true" 
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
