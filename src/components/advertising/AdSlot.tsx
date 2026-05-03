import React from 'react';
import { motion } from 'motion/react';
import { BrandAdCampaign, AdPlacementType, User, Product } from '../../types';
import { SponsoredBanner } from './SponsoredBanner';
import { FeaturedBrandCard } from './FeaturedBrandCard';
import { SponsoredProductCard } from './SponsoredProductCard';
import { CouponStrip } from './CouponStrip';
import { EditorialAdCard } from './EditorialAdCard';

interface AdSlotProps {
  placement: AdPlacementType;
  campaigns: BrandAdCampaign[];
  currentUser?: User | null;
  city?: string;
  category?: string;
  maxItems?: number;
  compact?: boolean;
  onAdClick: (campaign: BrandAdCampaign) => void;
  products?: Product[]; // For sponsored products
  onAddToCart?: (product: Product, source?: string) => void;
}

export function AdSlot({
  placement,
  campaigns,
  currentUser,
  city,
  category,
  maxItems = 1,
  compact = false,
  onAdClick,
  products = [],
  onAddToCart
}: AdSlotProps) {
  // Filter campaigns
  const activeCampaigns = campaigns.filter(ad => {
    if (!ad.active) return false;
    if (ad.placement !== placement) return false;

    // Filter by city if targets exist
    if (city && ad.cityTargets && ad.cityTargets.length > 0) {
      if (!ad.cityTargets.includes(city)) return false;
    }

    // Filter by category if applicable
    if (category && ad.category) {
      if (ad.category !== category) return false;
    }

    // Filter by audience segment
    if (ad.audienceSegments && ad.audienceSegments.length > 0 && !ad.audienceSegments.includes('todos')) {
      if (!currentUser) {
        // If not logged in, only show if 'todos' is present (already checked above)
        // or potentially some specific 'visitante' segment if we added it.
        // For now, if no currentUser, we don't show segmented ads.
        return false;
      }

      const userSegments: string[] = ['cliente_b2b'];
      if (currentUser.commercialCondition === 'contado') userSegments.push('cliente_contado');
      if (currentUser.commercialCondition === 'credito') userSegments.push('cliente_credito');
      
      // Map customer types or other attributes to segments
      if (currentUser.customerType?.toLowerCase().includes('bar')) userSegments.push('bares');
      if (currentUser.customerType?.toLowerCase().includes('restaurante')) userSegments.push('restaurantes');
      if (currentUser.customerType?.toLowerCase().includes('hotel')) userSegments.push('hoteles');
      if (currentUser.customerType?.toLowerCase().includes('horeca')) userSegments.push('horeca');
      if (currentUser.customerType?.toLowerCase().includes('licorera')) userSegments.push('licoreras');
      if (currentUser.customerType?.toLowerCase().includes('evento')) userSegments.push('eventos');
      if (currentUser.role === 'proveedor' || currentUser.role === 'marca') userSegments.push('proveedor_marca');
      
      // Check intersection
      const hasMatchingSegment = ad.audienceSegments.some(seg => userSegments.includes(seg as any));
      if (!hasMatchingSegment && !ad.audienceSegments.includes('todos' as any)) return false;
    }

    return true;
  });

  // Sort by priority and limit
  const visibleAds = activeCampaigns
    .sort((a, b) => a.priority - b.priority)
    .slice(0, maxItems);

  if (visibleAds.length === 0) return null;

  return (
    <div className={`ad-slot ad-slot-${placement} ${compact ? 'ad-slot-compact' : ''}`}>
      {visibleAds.map(ad => {
        const renderAd = () => {
          switch (ad.format) {
            case 'banner':
              return (
                <SponsoredBanner 
                  campaign={ad} 
                  onClick={() => onAdClick(ad)} 
                  compact={compact}
                />
              );
            case 'featured_brand':
              return (
                <FeaturedBrandCard 
                  campaign={ad} 
                  onClick={() => onAdClick(ad)} 
                />
              );
            case 'sponsored_product':
            case 'premium_product_card':
            case 'sponsored_search':
              const product = products.find(p => p.id === ad.productId);
              return (
                <SponsoredProductCard 
                  campaign={ad} 
                  product={product}
                  onClick={() => onAdClick(ad)}
                  onAddToCart={onAddToCart}
                />
              );
            case 'coupon':
              return (
                <CouponStrip 
                  campaign={ad} 
                  onClick={() => onAdClick(ad)} 
                />
              );
            case 'editorial_content':
              return (
                <EditorialAdCard 
                  campaign={ad} 
                  onClick={() => onAdClick(ad)} 
                />
              );
            default:
              return null;
          }
        };

        return (
          <motion.div 
            key={ad.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {renderAd()}
          </motion.div>
        );
      })}
    </div>
  );
}
