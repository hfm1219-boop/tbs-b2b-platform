import React from 'react';
import { motion } from 'motion/react';
import { BrandAdCampaign } from '../../types';
import { ArrowRight, Tag } from 'lucide-react';

interface SponsoredBannerProps {
  campaign: BrandAdCampaign;
  onClick: () => void;
  compact?: boolean;
}

export function SponsoredBanner({ campaign, onClick, compact = false }: SponsoredBannerProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-2xl group cursor-pointer border border-borde ${
        compact ? 'min-h-[140px]' : 'min-h-[200px] md:min-h-[240px]'
      }`}
      onClick={onClick}
    >
      {/* Background Image */}
      {campaign.image && (
        <div className="absolute inset-0">
          <img 
            src={campaign.image} 
            alt={campaign.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="relative h-full flex flex-col justify-center p-6 md:p-10 text-white max-w-2xl select-none">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-2 py-1 bg-rojo text-[10px] font-black uppercase tracking-widest rounded-sm">
            {campaign.sponsoredLabel || 'Patrocinado'}
          </span>
          {campaign.brandName && (
            <span className="text-[10px] font-black uppercase tracking-widest text-white/80">
              {campaign.brandName}
            </span>
          )}
        </div>

        <h3 className={`font-black tracking-tighter leading-[0.95] mb-3 drop-shadow-sm ${
          compact ? 'text-2xl md:text-3xl' : 'text-3xl md:text-[48px]'
        }`}>
          {campaign.title}
        </h3>

        {campaign.subtitle && (
          <p className={`font-bold text-white mb-2 max-w-lg ${
            compact ? 'text-xs md:text-sm' : 'text-base md:text-lg'
          }`}>
            {campaign.subtitle}
          </p>
        )}

        {campaign.description && (
          <p className="text-[10px] font-medium text-white/60 mb-6 max-w-md leading-relaxed hidden md:block">
            {campaign.description}
          </p>
        )}

        <div className="flex items-center gap-6">
          <button className="px-8 py-3 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-rojo hover:text-white transition-all transform active:scale-95 tbs-shadow">
            {campaign.ctaLabel} <ArrowRight size={14} strokeWidth={3} />
          </button>
          
          {campaign.logo && (
            <div className="flex items-center gap-3">
              <img 
                src={campaign.logo} 
                alt={campaign.brandName} 
                className="h-8 md:h-10 w-auto object-contain brightness-0 invert opacity-100"
                referrerPolicy="no-referrer"
              />
              <span className="text-[11px] font-black uppercase tracking-widest text-white/60">{campaign.brandName}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
