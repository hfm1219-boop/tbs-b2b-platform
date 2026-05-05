import React from 'react';
import { motion } from 'motion/react';

interface SkeletonProps {
  className?: string;
  variant?: 'product' | 'dashboard' | 'invoice' | 'order' | 'table-row' | 'profile' | 'campaign';
}

export const SkeletonCard: React.FC<SkeletonProps> = ({ className = '', variant = 'product' }) => {
  const shimmer = {
    initial: { x: '-100%' },
    animate: { x: '100%' },
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: 'linear',
    },
  };

  const baseClass = "bg-gray-100 relative overflow-hidden";

  if (variant === 'product') {
    return (
      <div className={`bg-white rounded-3xl border border-gray-100 p-4 shadow-sm h-full ${className}`}>
        <div className={`aspect-square rounded-2xl w-full mb-4 ${baseClass}`}>
          <motion.div {...shimmer} className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>
        <div className={`h-4 w-3/4 rounded-md mb-2 ${baseClass}`}>
           <motion.div {...shimmer} className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>
        <div className={`h-3 w-1/2 rounded-md mb-4 ${baseClass}`}>
           <motion.div {...shimmer} className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>
        <div className="flex justify-between items-center mt-auto">
          <div className={`h-6 w-24 rounded-md ${baseClass}`}>
             <motion.div {...shimmer} className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </div>
          <div className={`h-10 w-10 rounded-xl ${baseClass}`}>
             <motion.div {...shimmer} className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'order' || variant === 'invoice') {
    return (
      <div className={`bg-white rounded-2xl border border-gray-100 p-6 shadow-sm ${className}`}>
        <div className="flex justify-between items-start mb-6">
          <div className="flex gap-4">
            <div className={`w-12 h-12 rounded-xl ${baseClass}`}>
               <motion.div {...shimmer} className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            </div>
            <div>
              <div className={`h-5 w-32 rounded-md mb-2 ${baseClass}`}>
                 <motion.div {...shimmer} className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              </div>
              <div className={`h-3 w-48 rounded-md ${baseClass}`}>
                 <motion.div {...shimmer} className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              </div>
            </div>
          </div>
          <div className={`h-8 w-24 rounded-full ${baseClass}`}>
             <motion.div {...shimmer} className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </div>
        </div>
        <div className="flex justify-between items-center border-t border-gray-50 pt-4">
          <div className={`h-4 w-20 rounded-md ${baseClass}`}>
             <motion.div {...shimmer} className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </div>
          <div className={`h-6 w-32 rounded-md ${baseClass}`}>
             <motion.div {...shimmer} className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'table-row') {
    return (
      <div className={`flex items-center gap-4 py-4 px-6 border-b border-gray-50 ${className}`}>
        <div className={`w-6 h-6 rounded-md ${baseClass} shrink-0`}>
           <motion.div {...shimmer} className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>
        <div className={`h-4 w-1/4 rounded-md ${baseClass}`}>
           <motion.div {...shimmer} className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>
        <div className={`h-4 w-1/6 rounded-md ${baseClass}`}>
           <motion.div {...shimmer} className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>
        <div className={`h-4 w-1/6 rounded-md ${baseClass}`}>
           <motion.div {...shimmer} className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>
        <div className={`h-4 w-1/12 rounded-md ${baseClass} ml-auto`}>
           <motion.div {...shimmer} className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-50 rounded-2xl p-6 ${baseClass} ${className}`}>
      <motion.div {...shimmer} className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
    </div>
  );
};
