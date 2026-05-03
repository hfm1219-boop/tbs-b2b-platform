import React from 'react';
import { motion } from 'motion/react';
import { BrandAdCampaign } from '../../types';
import { BookOpen, ArrowRight } from 'lucide-react';

interface EditorialAdCardProps {
  campaign: BrandAdCampaign;
  onClick: () => void;
}

export function EditorialAdCard({ campaign, onClick }: EditorialAdCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      className="bg-white border border-borde rounded-2xl overflow-hidden group cursor-pointer flex flex-col md:flex-row h-full md:h-56 shadow-sm hover:shadow-xl transition-all"
      onClick={onClick}
    >
      <div className="w-full md:w-2/5 relative h-48 md:h-full">
        <img 
          src={campaign.image} 
          alt={campaign.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 md:hidden" />
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-rojo text-white text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-widest shadow-lg flex items-center gap-1.5">
            <BookOpen size={10} />
            {campaign.sponsoredLabel || 'Contenido patrocinado'}
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black text-rojo uppercase tracking-widest">
            {campaign.brandName}
          </span>
          <span className="w-1 h-1 rounded-full bg-gris/20" />
          <span className="text-[10px] font-bold text-gris uppercase tracking-widest">
            {campaign.category || 'Guía Especializada'}
          </span>
        </div>

        <h3 className="text-xl font-black text-texto mb-3 leading-tight group-hover:text-rojo transition-colors line-clamp-2">
          {campaign.title}
        </h3>

        {campaign.subtitle && (
          <p className="text-xs font-bold text-gris/80 mb-4 line-clamp-2">
            {campaign.subtitle}
          </p>
        )}

        {campaign.description && (
          <p className="text-[11px] font-medium text-gris/60 mb-6 line-clamp-2 hidden lg:block">
            {campaign.description}
          </p>
        )}

        <div className="mt-auto md:mt-0 flex items-center gap-2 text-rojo font-black text-[11px] uppercase tracking-widest group-hover:gap-4 transition-all">
          {campaign.ctaLabel} <ArrowRight size={14} />
        </div>
      </div>
    </motion.div>
  );
}
