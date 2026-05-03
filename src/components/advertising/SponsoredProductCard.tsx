import React from 'react';
import { motion } from 'motion/react';
import { BrandAdCampaign, Product } from '../../types';
import { ShoppingCart, Tag, Plus } from 'lucide-react';

interface SponsoredProductCardProps {
  campaign: BrandAdCampaign;
  product?: Product;
  onClick: () => void;
  onAddToCart?: (product: Product, source?: string) => void;
}

export function SponsoredProductCard({ campaign, product, onClick, onAddToCart }: SponsoredProductCardProps) {
  if (!product) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-[#303844]/5 border border-dashed border-rojo/30 rounded-2xl overflow-hidden group cursor-pointer relative flex flex-col h-full bg-white hover:border-rojo/60 transition-all shadow-sm"
      onClick={onClick}
    >
      {/* Sponsored Label */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
        <div className="px-2 py-1 bg-[#303844] text-white text-[9px] font-black uppercase tracking-widest rounded shadow-lg flex items-center gap-1.5">
          <Tag size={10} className="text-rojo" />
          {campaign.sponsoredLabel || 'Patrocinado'}
        </div>
      </div>

      {/* Brand Watermark */}
      <div className="absolute top-3 right-3 z-10">
        {campaign.logo && (
          <img 
            src={campaign.logo} 
            alt={campaign.brandName} 
            className="h-6 w-auto object-contain opacity-40 group-hover:opacity-100 transition-opacity"
            referrerPolicy="no-referrer"
          />
        )}
      </div>

      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 border-b border-borde">
        <img 
          src={product.image || campaign.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
      </div>

      {/* Product Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[10px] font-black text-rojo uppercase tracking-widest">
            {product.category}
          </div>
          {product.origin && (
            <div className="text-[9px] font-bold text-gris bg-gray-100 px-2 py-0.5 rounded uppercase">
              {product.origin}
            </div>
          )}
        </div>

        <h3 className="text-base font-black text-texto mb-1 leading-snug group-hover:text-rojo transition-colors">
          {product.name}
        </h3>
        
        <p className="text-xs font-bold text-gris mb-4">
          {campaign.subtitle || product.specs}
        </p>

        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-gris font-bold mb-0.5 uppercase tracking-tighter">Precio</div>
            <div className="text-lg font-black text-texto">{product.price}</div>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if (onAddToCart) onAddToCart(product, 'sponsored_card');
              }}
              className="w-10 h-10 bg-rojo text-white rounded-xl flex items-center justify-center hover:bg-rojo-oscuro tbs-shadow transition-colors group/btn"
              title="Agregar al carrito"
            >
              <Plus size={20} strokeWidth={2.5} className="group-active/btn:scale-90 transition-transform" />
            </button>
          </div>
        </div>
        
        {/* Ad Description */}
        <div className="mt-4 p-2 bg-rojo/5 rounded-lg border border-rojo/10">
          <p className="text-[9px] font-bold text-rojo leading-tight text-center">
            {campaign.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
