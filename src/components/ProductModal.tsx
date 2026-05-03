import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus, ShoppingCart, Star, Tag } from 'lucide-react';
import { Product, ShoppingList, B2BPromotion, User, BrandAdCampaign } from '../types';
import { BRAND_AD_CAMPAIGNS } from '../data';
import { AdSlot } from './advertising/AdSlot';
import { useState, useEffect } from 'react';
import { SaveToListModal } from './SaveToListModal';
import { useAnalytics } from '../hooks/useAnalytics';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  isCliente: boolean;
  currentUser?: User | null;
  shoppingLists?: ShoppingList[];
  onAddToList?: (listId: string, product: Product, quantity: number) => void;
  onCreateList?: (name: string, description: string) => void;
  promotions?: B2BPromotion[];
  onGoPromotions?: () => void;
}

export function ProductModal({ 
  product, 
  onClose, 
  onAddToCart,
  isCliente,
  currentUser,
  shoppingLists = [],
  onAddToList,
  onCreateList,
  promotions = [],
  onGoPromotions
}: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const analytics = useAnalytics(currentUser || null);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  
  useEffect(() => {
    analytics.track('product_viewed', 'engagement', {
      productId: product.id,
      productName: product.name,
      category: product.category,
      price: product.price
    });
  }, [product, analytics]);

  const productPromo = promotions.find(p => p.products.some(pp => pp.productId === product.id));

  const canBuy = isCliente && (currentUser?.role === 'cliente_b2b' || !currentUser);

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  const handleIncrease = () => {
    setQuantity(prev => prev + 1);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur border border-borde rounded-full flex items-center justify-center text-texto hover:bg-rojo hover:text-white transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Imagen del Producto */}
        <div className="w-full md:w-1/2 aspect-square md:aspect-auto bg-gray-50 border-r border-borde relative overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Detalles del Producto */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col">
          <div className="mb-6">
            <div className="text-[11px] font-black text-rojo uppercase tracking-widest mb-2">{product.category}</div>
            <h2 className="text-3xl font-black text-texto tracking-tight mb-3">{product.name}</h2>
            <div className="inline-block px-3 py-1 bg-rojo-suave text-rojo rounded-full text-xs font-black mb-6">
              {product.specs}
            </div>
            
            <p className="text-texto-sec leading-relaxed font-medium mb-8">
              {product.description || "Este producto premium forma parte de nuestra selección exclusiva para negocios y licoreras. Consulta disponibilidad para entregas inmediatas a nivel nacional."}
            </p>

            {productPromo && (
              <div className="mb-8 p-5 bg-[#F8F9FA] border border-[#E8EAEE] rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-rojo" />
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-rojo/10 flex items-center justify-center text-rojo shrink-0">
                    <Tag size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-rojo uppercase tracking-widest mb-0.5">{productPromo.badge}</div>
                    <p className="text-sm font-black text-texto leading-snug">{productPromo.title}</p>
                    <p className="text-[11px] font-bold text-gris mt-1 leading-relaxed">{productPromo.description}</p>
                    {onGoPromotions && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onClose();
                          onGoPromotions();
                        }}
                        className="mt-3 text-[10px] font-black text-rojo uppercase tracking-wider hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        Ver detalles de la promoción →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-auto space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] text-gris font-black uppercase mb-1">Precio Unitario</div>
                <div className="flex flex-col">
                  {product.originalPrice && (
                    <span className="text-xs text-gris line-through font-bold leading-none mb-1">
                      {product.originalPrice}
                    </span>
                  )}
                  <div className={`text-3xl font-black ${product.originalPrice ? 'text-rojo' : 'text-texto'}`}>
                    {product.price}
                  </div>
                </div>
              </div>
              
              {canBuy && (
                <div className="flex flex-col items-end">
                  <div className="text-[11px] text-gris font-black uppercase mb-1">Cantidad</div>
                  <div className="flex items-center gap-3 border border-borde rounded-lg p-1.5 bg-gray-50">
                    <button 
                      onClick={handleDecrease}
                      className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white hover:text-rojo transition-all cursor-pointer border border-transparent hover:border-borde disabled:opacity-30"
                      disabled={quantity <= 1}
                    >
                      <Minus size={16} strokeWidth={2.5} />
                    </button>
                    <span className="w-8 text-center text-lg font-black">{quantity}</span>
                    <button 
                      onClick={handleIncrease}
                      className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white hover:text-rojo transition-all cursor-pointer border border-transparent hover:border-borde"
                    >
                      <Plus size={16} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              {canBuy ? (
                <button 
                  onClick={() => {
                    onAddToCart(product, 'product_modal' as any);
                    analytics.track('product_selected', 'engagement', {
                      productId: product.id,
                      productName: product.name,
                      category: product.category,
                      quantity: quantity,
                      price: product.price,
                      source: 'product_modal_add'
                    });
                    onClose();
                  }}
                  className="flex-1 h-14 bg-rojo text-white rounded-xl font-black text-lg flex items-center justify-center gap-3 tbs-shadow hover:bg-rojo-oscuro hover:scale-[1.02] active:scale-100 transition-all cursor-pointer"
                >
                  <ShoppingCart size={22} strokeWidth={2.5} />
                  Agregar
                </button>
              ) : currentUser && (currentUser.role === 'marca' || currentUser.role === 'proveedor') ? (
                <div className="flex-1 h-14 bg-gray-100 text-gris rounded-xl font-black text-sm flex items-center justify-center text-center px-4">
                  Compra no disponible para perfiles de marca/proveedor
                </div>
              ) : (
                <button 
                  onClick={() => {
                    onClose();
                    // In a real app we might trigger a specific event
                  }}
                  className="flex-1 h-14 bg-rojo text-white rounded-xl font-black text-lg flex items-center justify-center gap-3 tbs-shadow hover:bg-rojo-oscuro hover:scale-[1.02] active:scale-100 transition-all cursor-pointer"
                >
                  Solicitar acceso
                </button>
              )}
              
              {canBuy && onAddToList && (
                <button 
                  onClick={() => setIsSaveModalOpen(true)}
                  className="w-14 h-14 border border-borde rounded-xl flex items-center justify-center text-gris hover:text-rojo hover:border-rojo transition-all cursor-pointer"
                  title="Guardar en lista"
                >
                  <Star size={24} />
                </button>
              )}
            </div>

            {/* Recommendation Slot */}
            <div className="mt-8 pt-8 border-t border-borde">
              <h4 className="text-[10px] font-black text-gris uppercase tracking-widest mb-4">También te puede interesar</h4>
              <AdSlot 
                placement="product_detail_premium"
                campaigns={BRAND_AD_CAMPAIGNS}
                currentUser={currentUser}
                category={product.category}
                onAdClick={(campaign) => {
                  analytics.track('ad_click', 'provider', { target: campaign.id, placement: 'product_detail_premium' });
                }}
                maxItems={1}
                compact={true}
              />
            </div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isSaveModalOpen && onAddToList && onCreateList && (
          <SaveToListModal 
            product={product}
            isOpen={isSaveModalOpen}
            onClose={() => setIsSaveModalOpen(false)}
            shoppingLists={shoppingLists}
            onAddToList={onAddToList}
            onCreateList={onCreateList}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
