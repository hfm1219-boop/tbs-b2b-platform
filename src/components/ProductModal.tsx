import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus, ShoppingCart, Star, Tag, Zap, History } from 'lucide-react';
import { Product, ShoppingList, B2BPromotion, User, BrandAdCampaign } from '../types';
import { BRAND_AD_CAMPAIGNS } from '../data';
import { AdSlot } from './advertising/AdSlot';
import { useState, useEffect } from 'react';
import { SaveToListModal } from './SaveToListModal';
import { useAnalytics } from '../hooks/useAnalytics';
import { Button, Tooltip } from './ui';
import { useToasts } from './ToastContext';

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
  onAddToListSuccess,
  promotions = [],
  onGoPromotions
}: ProductModalProps & { onAddToListSuccess?: () => void }) {
  const [quantity, setQuantity] = useState(1);
  const analytics = useAnalytics(currentUser || null);
  const toasts = useToasts();
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  
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

  const handleAddToCart = async () => {
    setIsAdding(true);
    // Simulate brief processing
    await new Promise(resolve => setTimeout(resolve, 800));
    onAddToCart(product, quantity as any);
    setIsAdding(false);
    
    toasts.success(
      "Producto agregado", 
      `${quantity} unidades de ${product.name} se agregaron correctamente.`
    );
    onClose();
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
            <div className="flex items-center justify-between mb-2">
              <div className="text-[11px] font-black text-rojo uppercase tracking-widest">{product.category}</div>
              <div className="flex gap-2">
                {product.isSponsored && (
                   <Tooltip content="Este producto tiene visibilidad contratada por la marca.">
                     <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 cursor-help">
                       <Star size={10} fill="currentColor" /> Patrocinado
                     </div>
                   </Tooltip>
                )}
                {product.previouslyPurchased && (
                   <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-texto-sec bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
                     <History size={10} /> Comprado antes
                   </div>
                )}
              </div>
            </div>
            
            <h2 className="text-3xl font-black text-texto tracking-tight mb-3">{product.name}</h2>
            
            <div className="flex flex-wrap gap-2 mb-6">
              <div className="inline-block px-3 py-1 bg-rojo-suave text-rojo rounded-full text-xs font-black">
                {product.specs}
              </div>
              {product.isUrgent && (
                <div className="inline-block px-3 py-1 bg-yellow-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                  <Zap size={10} fill="currentColor" /> Entrega Urgente
                </div>
              )}
              {product.hasPromotion && (
                <div className="inline-block px-3 py-1 bg-rojo text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                  <Tag size={10} /> Promoción Activa
                </div>
              )}
            </div>
            
            {/* Availability Status */}
            <div className="mb-6 flex items-center gap-4 py-3 border-y border-gray-100 border-dashed">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  product.stockStatus === 'out_of_stock' ? 'bg-red-500' : 
                  product.stockStatus === 'low_stock' ? 'bg-orange-500 animate-pulse' : 
                  'bg-green-500'
                }`} />
                <span className={`text-xs font-black uppercase tracking-widest ${
                  product.stockStatus === 'out_of_stock' ? 'text-red-600' : 
                  product.stockStatus === 'low_stock' ? 'text-orange-600' : 
                  'text-green-600'
                }`}>
                  {product.stockStatus === 'out_of_stock' ? 'Sin Stock' : 
                   product.stockStatus === 'low_stock' ? 'Últimas Unidades' : 
                   'Disponible'}
                </span>
              </div>
              {product.stockStatus !== 'out_of_stock' && (
                <div className="text-[10px] font-bold text-gris uppercase tracking-tight flex items-center gap-1">
                  <Zap size={10} className="text-rojo" /> Despacho prioritario en 24h
                </div>
              )}
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
                <Button 
                  onClick={handleAddToCart}
                  isLoading={isAdding}
                  className="flex-1 h-14 rounded-xl text-lg gap-3"
                  leftIcon={ShoppingCart}
                >
                  Agregar al pedido
                </Button>
              ) : currentUser && (currentUser.role === 'marca' || currentUser.role === 'proveedor') ? (
                <div className="flex-1 h-14 bg-gray-100 text-gris rounded-xl font-black text-sm flex items-center justify-center text-center px-4">
                  Compra no disponible para perfiles de marca/proveedor
                </div>
              ) : (
                <Button 
                  onClick={() => {
                    onClose();
                  }}
                  className="flex-1 h-14 rounded-xl text-lg"
                >
                  Solicitar acceso
                </Button>
              )}
              
              {canBuy && onAddToList && (
                <button 
                  onClick={() => setIsSaveModalOpen(true)}
                  className="w-14 h-14 border border-borde rounded-xl flex items-center justify-center text-gris hover:text-rojo hover:border-rojo transition-all cursor-pointer bg-white"
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
