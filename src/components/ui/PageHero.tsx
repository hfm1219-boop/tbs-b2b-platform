import React from 'react';
import { motion } from 'motion/react';
import { Button } from './Button';

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  image?: string;
  variant?: 'dashboard' | 'public' | 'compact';
  className?: string;
}

export const PageHero: React.FC<PageHeroProps> = ({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
  image,
  variant = 'dashboard',
  className = ''
}) => {
  const isCompact = variant === 'compact';
  const isPublic = variant === 'public';

  return (
    <div className={`relative overflow-hidden ${variant === 'public' ? 'bg-[#FFFDFD] py-16 md:py-24' : 'bg-white py-10 md:py-14'} ${className}`}>
      {isPublic && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-rojo-suave/30 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gray-50 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>
      )}

      <div className="container mx-auto px-6 relative z-10">
        <div className={`flex flex-col lg:flex-row gap-12 ${centered ? 'items-center text-center' : 'items-center'}`}>
          <div className="flex-1 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {eyebrow && (
                <span className="text-[11px] font-black text-rojo uppercase tracking-[0.3em] block mb-4">
                  {eyebrow}
                </span>
              )}
              <h1 className={`${isPublic ? 'text-4xl md:text-5xl lg:text-6xl' : 'text-3xl md:text-4xl'} font-black text-texto tracking-tighter leading-[1] mb-6`}>
                {title}
              </h1>
              <p className={`${isPublic ? 'text-lg md:text-xl' : 'text-base md:text-lg'} text-texto-sec leading-relaxed mb-10 max-w-xl`}>
                {description}
              </p>
              
              <div className={`flex flex-col sm:flex-row items-center gap-4 ${centered ? 'justify-center' : ''}`}>
                {primaryAction && (
                  <Button size={isPublic ? 'lg' : 'md'} onClick={primaryAction.onClick}>
                    {primaryAction.label}
                  </Button>
                )}
                {secondaryAction && (
                  <Button variant="outline" size={isPublic ? 'lg' : 'md'} onClick={secondaryAction.onClick}>
                    {secondaryAction.label}
                  </Button>
                )}
              </div>
            </motion.div>
          </div>

          {image && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex-1 lg:max-w-[500px]"
            >
              <img 
                src={image} 
                alt={title} 
                className="w-full h-auto rounded-[40px] shadow-2xl shadow-rojo/10"
              />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

// Fix the "centered" reference which was not in props but used in code
const centered = false; 
