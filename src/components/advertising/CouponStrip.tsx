import React from 'react';
import { motion } from 'motion/react';
import { BrandAdCampaign } from '../../types';
import { Tag, Scissors, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface CouponStripProps {
  campaign: BrandAdCampaign;
  onClick: () => void;
}

export function CouponStrip({ campaign, onClick }: CouponStripProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (campaign.couponCode) {
      navigator.clipboard.writeText(campaign.couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="relative bg-white border-2 border-dashed border-rojo/30 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 group cursor-pointer hover:border-rojo transition-all overflow-hidden"
      onClick={onClick}
    >
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none translate-x-1/4 -translate-y-1/4">
        <Tag size={120} className="text-rojo -rotate-12" />
      </div>

      <div className="w-16 h-16 bg-rojo/10 rounded-2xl flex items-center justify-center text-rojo group-hover:bg-rojo group-hover:text-white transition-all shrink-0">
        <Scissors size={32} />
      </div>

      <div className="flex-1 text-center md:text-left">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
          <span className="px-2 py-0.5 bg-rojo text-[10px] font-black uppercase tracking-widest rounded text-white shadow-sm">
            {campaign.sponsoredLabel || 'Cupón patrocinado'}
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest text-rojo">
            {campaign.brandName}
          </span>
        </div>
        <h3 className="text-xl font-black text-texto mb-1">{campaign.title}</h3>
        <p className="text-xs font-bold text-gris uppercase tracking-tight">{campaign.subtitle}</p>
        <p className="text-[10px] font-medium text-gris/60 mt-3 italic max-w-md">
          * {campaign.description || 'Condición sujeta a validación comercial, disponibilidad y perfil del cliente.'}
        </p>
      </div>

      <div className="flex flex-col items-center gap-3 shrink-0">
        <div className="text-center">
          <div className="text-[10px] font-black text-gris uppercase tracking-widest mb-1">Código</div>
          <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl group-hover:bg-rojo/5 transition-colors border border-borde border-dashed">
            <span className="text-lg font-black text-texto font-mono">{campaign.couponCode || 'TBS2026'}</span>
            {campaign.couponCode && (
              <button 
                onClick={handleCopy}
                className="p-1.5 hover:bg-white rounded-lg text-gris hover:text-rojo transition-all cursor-pointer"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            )}
          </div>
        </div>
        
        <button className="bg-texto text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rojo transition-all tbs-shadow">
          {campaign.ctaLabel}
        </button>
      </div>
    </motion.div>
  );
}
