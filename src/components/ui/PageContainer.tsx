import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  variant?: 'public' | 'dashboard' | 'narrow' | 'wide' | 'full';
  className?: string;
  id?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  variant = 'dashboard',
  className = '',
  id
}) => {
  const maxWidthClass = {
    public: 'max-w-7xl',
    dashboard: 'max-w-[1400px]',
    narrow: 'max-w-4xl',
    wide: 'max-w-[1600px]',
    full: 'max-w-full'
  }[variant];

  return (
    <div 
      id={id}
      className={`w-full mx-auto px-4 sm:px-6 lg:px-8 ${maxWidthClass} ${className}`}
    >
      {children}
    </div>
  );
};
