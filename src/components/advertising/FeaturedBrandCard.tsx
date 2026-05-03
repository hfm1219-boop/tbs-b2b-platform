import React from 'react';
import { motion } from 'motion/react';
import { BrandAdCampaign } from '../../types';
import { ArrowRight, Star } from 'lucide-react';

interface FeaturedBrandCardProps {
  campaign: BrandAdCampaign;
  onClick: () => void;
}

export function FeaturedBrandCard({ campaign, onClick }: FeaturedBrandCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      className="bg-white border border-borde rounded-2xl p-6 flex flex-col items-center text-center group cursor-pointer shadow-sm hover:shadow-xl transition-all"
      onClick={onClick}
    >
      <div className="absolute top-4 right-4">
        <div className="px-2 py-0.5 bg-rojo/10 text-rojo text-[8px] font-black uppercase tracking-widest rounded">
          {campaign.sponsoredLabel || 'Marca destacada'}
        </div>
      </div>

      <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center p-3 mb-4 group-hover:bg-rojo/5 transition-colors overflow-hidden border border-borde/50">
        {campaign.logo ? (
          <img 
            src={campaign.logo} 
            alt={campaign.brandName} 
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
        ) : (
          <Star size={32} className="text-rojo" />
        )}
      </div>

      <div className="text-[10px] font-black text-rojo uppercase tracking-[0.2em] mb-2">
        {campaign.category || 'Portfolio Premium'}
      </div>

      <h3 className="text-xl font-black text-texto mb-2 group-hover:text-rojo transition-colors">
        {campaign.brandName}
      </h3>

      <p className="text-xs font-bold text-gris line-clamp-2 mb-6">
        {campaign.title}
      </p>

      <button className="mt-auto w-full py-3 bg-gray-50 text-texto rounded-xl font-black text-[10px] uppercase tracking-widest group-hover:bg-rojo group-hover:text-white transition-all flex items-center justify-center gap-2">
        {campaign.ctaLabel} <ArrowRight size={14} />
      </button>
    </motion.div>
  );
}
