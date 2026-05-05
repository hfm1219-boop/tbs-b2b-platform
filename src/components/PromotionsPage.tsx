import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Button,
  MetricCard,
  AlertBox,
  PageContainer,
  PageHeader,
  ModalShell,
  SectionHeader
} from './ui';
import { User, B2BPromotion, Product, PromotionType, PromotionProduct, BrandAdCampaign } from '../types';
import { BRAND_AD_CAMPAIGNS } from '../data';
import { AdSlot } from './advertising/AdSlot';
import { useAnalytics } from '../hooks/useAnalytics';

interface PromotionsPageProps {
  currentUser: User | null;
  promotions: B2BPromotion[];
  onBackToAccount: () => void;
  onGoCatalog: () => void;
  onAddToCart: (product: Product, source?: string | any) => void;
  onOpenCart: () => void;
  onGoAdvisorChat: (topic?: any, context?: any) => void;
  onCreateNotification?: (notif: any) => void;
}

const formatCOP = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(value);
};

export function PromotionsPage({
  currentUser,
  promotions,
  onBackToAccount,
  onGoCatalog,
  onAddToCart,
  onOpenCart,
  onGoAdvisorChat,
  onCreateNotification
}: PromotionsPageProps) {
  const analytics = useAnalytics(currentUser);
  const isCash = currentUser?.commercialCondition === 'contado';
  const [filterType, setFilterType] = useState<PromotionType | 'todas'>('todas');

  useEffect(() => {
    analytics.trackPageView('/promociones', 'Promociones B2B');
  }, []);
  const [filterCategory, setFilterCategory] = useState<string>('Todas');
  const [search, setSearch] = useState('');
  const [selectedPromo, setSelectedPromo] = useState<B2BPromotion | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState<{
    show: boolean;
    promo?: B2BPromotion;
    results?: any;
  }>({ show: false });

  const categories = ['Todas', ...Array.from(new Set(promotions.map(p => p.category)))];
  
  const promoTypes: { id: PromotionType | 'todas', label: string }[] = [
    { id: 'todas', label: 'Todas' },
    { id: 'descuento_por_volumen', label: 'Descuento por volumen' },
    { id: 'combo', label: 'Combos' },
    { id: 'precio_especial', label: 'Precio especial' },
    { id: 'marca_destacada', label: 'Marca destacada' },
    { id: 'recompra', label: 'Recompra' },
    { id: 'temporada', label: 'Temporada' },
    { id: 'liquidacion', label: 'Liquidación' },
    { id: 'activacion', label: 'Activación' }
  ];

  const filteredPromotions = promotions.filter(promo => {
    const matchesSearch = 
      promo.title.toLowerCase().includes(search.toLowerCase()) ||
      promo.subtitle.toLowerCase().includes(search.toLowerCase()) ||
      promo.description.toLowerCase().includes(search.toLowerCase()) ||
      promo.brand?.toLowerCase().includes(search.toLowerCase()) ||
      promo.category.toLowerCase().includes(search.toLowerCase()) ||
      promo.products.some(p => p.name.toLowerCase().includes(search.toLowerCase()));
    
    const matchesType = filterType === 'todas' || promo.type === filterType;
    const matchesCategory = filterCategory === 'Todas' || promo.category === filterCategory;

    return matchesSearch && matchesType && matchesCategory;
  });

  const canBuy = currentUser?.role === 'cliente_b2b';

  const handleAddPromoToCart = (promo: B2BPromotion) => {
    if (!canBuy) return;
    
    const availableProducts = promo.products.filter(p => p.available);
    
    if (availableProducts.length === 0) {
      // Show error or notify
      return;
    }

    let totalSavings = 0;
    let units = 0;
    let totalPromo = 0;

    availableProducts.forEach(pp => {
      const quantity = pp.requiredQuantity || 1;
      const product: Product = {
        id: pp.productId || Math.floor(Math.random() * 1000000),
        name: pp.name,
        category: pp.category,
        specs: pp.specs,
        price: formatCOP(pp.promoPrice || pp.regularPrice),
        image: pp.image || ''
      };
      
      onAddToCart(product, 'promo_bulk' as any);
      
      analytics.track('product_selected', 'engagement', {
        productId: product.id,
        productName: product.name,
        source: `promotion_${promo.id}`
      });
      
      units += quantity;
      totalPromo += (pp.promoPrice || pp.regularPrice) * quantity;
      if (pp.promoPrice) {
        totalSavings += (pp.regularPrice - pp.promoPrice) * quantity;
      }
    });

    if (onCreateNotification) {
      onCreateNotification({
        type: 'comercial',
        title: 'Promoción agregada',
        message: `Se agregaron productos de "${promo.title}" al carrito.`,
        priority: 'media',
        actionTarget: 'catalog'
      });
    }

    setShowConfirmModal({
      show: true,
      promo,
      results: { units, totalSavings, totalPromo, items: availableProducts.length }
    });

    analytics.track('promotion_added_to_cart', 'engagement', {
      metadata: { 
        promoId: promo.id, 
        promoTitle: promo.title, 
        units, 
        totalPromo, 
        totalSavings 
      }
    });
  };

  return (
    <PageContainer variant="dashboard" className="pb-24">
      <PageHeader
        title="Promociones B2B"
        eyebrow={`${currentUser?.businessName} • ${currentUser?.city}`}
        icon={<Tag className="text-rojo" size={28} />}
        onBack={onBackToAccount}
        description={
          <p className="text-gris font-medium mt-1 max-w-2xl leading-relaxed">
            Consulta descuentos, combos y condiciones comerciales exclusivas para <span className="text-rojo font-bold">{currentUser?.businessName}</span> en <span className="font-bold">{currentUser?.city}</span>.
          </p>
        }
        actions={
          <Button 
            variant="secondary"
            size="sm"
            icon={<Package size={18} />}
            onClick={onGoCatalog}
          >
            Ir al catálogo
          </Button>
        }
      />

      <div className="py-8">
        {/* Brand Coupons Section */}
        <div className="mb-12">
          <SectionHeader
            title="Cupones y beneficios de marcas"
            icon={<Star className="text-rojo" size={20} />}
            className="mb-6"
          />
          <AdSlot 
            placement="coupon_strip"
            campaigns={BRAND_AD_CAMPAIGNS}
            currentUser={currentUser}
            onAdClick={(campaign) => {
              analytics.track('ad_click', 'provider', {
                targetId: campaign.id,
                placement: 'coupon_strip'
              });
            }}
            maxItems={3}
          />
        </div>

        {/* Banner Comercial */}
        <div className="mb-8">
          <AlertBox
            type="info"
            title="Condiciones comerciales"
            description={
              <>
                Las promociones están sujetas a perfil de cliente, ciudad, disponibilidad, inventario, cupo de crédito y vigencia. 
                <span className="font-bold text-rojo"> 
                  {isCash 
                    ? ' Algunas promociones requieren pago anticipado o validación comercial antes de facturación.' 
                    : ' Algunas promociones pueden requerir validación comercial antes de confirmarse.'
                  }
                </span>
              </>
            }
            icon={<Info size={32} />}
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              {[
                { icon: Users, text: isCash ? 'Cliente Contado' : 'Perfil B2B' },
                { icon: TrendingDown, text: 'Venta x volumen' },
                { icon: MapPin, text: 'Stock x ciudad' },
                { icon: Wallet, text: isCash ? 'Pago Anticipado' : 'Cupo de Crédito' }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center justify-center p-3 bg-white border border-borde rounded-xl min-w-[90px]">
                  <item.icon size={18} className="text-rojo mb-1" />
                  <span className="text-[10px] font-bold text-gris text-center leading-tight">{item.text}</span>
                </div>
              ))}
            </div>
          </AlertBox>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard 
            label="Promociones activas" 
            value={promotions.length} 
            icon={<Tag size={20} />} 
            color="red"
          />
          <MetricCard 
            label="Para tu ciudad" 
            value={promotions.filter(p => p.condition.cities?.includes(currentUser?.city || '')).length} 
            icon={<MapPin size={20} />} 
          />
          <MetricCard 
            label="Requieren validación" 
            value={promotions.filter(p => p.condition.requiresApproval).length} 
            icon={<AlertCircle size={20} />} 
            color="amber"
          />
          <MetricCard 
            label="Ahorro potencial" 
            value="Hasta 12%" 
            icon={<TrendingDown size={20} />} 
            color="green"
          />
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl border border-borde shadow-sm p-4 mb-8 relative z-30">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gris" size={20} />
              <input 
                type="text" 
                placeholder="Buscar promoción, marca, categoría o producto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-borde rounded-xl font-bold focus:border-rojo focus:ring-1 focus:ring-rojo outline-none transition-all placeholder:text-gray-400"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-borde rounded-xl font-black text-xs uppercase text-gris">
                <Filter size={16} /> Filtros:
              </div>
              
              <div className="relative group">
                <select 
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as PromotionType | 'todas')}
                  className="appearance-none bg-white border border-borde rounded-xl px-4 py-3 pr-10 font-bold text-sm outline-none focus:border-rojo cursor-pointer hover:border-rojo/30"
                >
                  {promoTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.label}</option>
                  ))}
                </select>
                <ChevronRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gris rotate-90 pointer-events-none" />
              </div>

              <div className="relative group">
                <select 
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="appearance-none bg-white border border-borde rounded-xl px-4 py-3 pr-10 font-bold text-sm outline-none focus:border-rojo cursor-pointer hover:border-rojo/30"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gris rotate-90 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Promotions List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 font-sans">
          {filteredPromotions.length > 0 ? (
            filteredPromotions.map((promo) => (
              <motion.div
                key={promo.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-borde shadow-sm hover:shadow-xl transition-all overflow-hidden group flex flex-col h-full"
              >
                <div className="relative h-20 md:h-24 bg-gray-100 shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-r from-rojo to-rojo-oscuro opacity-90" />
                  <div className="absolute inset-0 p-6 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-white/20 backdrop-blur-md rounded-md text-[10px] font-black text-white uppercase tracking-widest border border-white/20">
                          {promo.badge}
                        </span>
                        {promo.condition.requiresApproval && (
                          <span className="px-2 py-1 bg-amber-500 rounded-md text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-1">
                            <AlertCircle size={10} /> Requiere Aprobación
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-black text-white mt-1">{promo.brand}</h3>
                    </div>
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-rojo font-black text-xl shadow-lg">
                      <Tag size={24} />
                    </div>
                  </div>
                </div>

                <div className="p-6 md:p-8 flex flex-col flex-1">
                  <div className="mb-6 flex-1">
                    <h4 className="text-xl font-black text-texto tracking-tight">{promo.title}</h4>
                    <p className="text-sm font-bold text-rojo mt-1">{promo.subtitle}</p>
                    <p className="text-sm text-gris mt-3 leading-relaxed">{promo.description}</p>
                    
                    <div className="mt-6 flex flex-wrap gap-2">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-borde rounded-lg text-[10px] font-bold text-gris uppercase tracking-wider">
                        <Calendar size={12} className="text-rojo" /> Hasta {promo.condition.validUntil}
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-borde rounded-lg text-[10px] font-bold text-gris uppercase tracking-wider">
                        <TrendingDown size={12} className="text-green-600" /> Min {promo.condition.minUnits} unidades
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-borde rounded-lg text-[10px] font-bold text-gris uppercase tracking-wider">
                        <MapPin size={12} className="text-rojo" /> {promo.condition.cities?.join(', ')}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <p className="text-[10px] font-black text-gris uppercase tracking-widest">Productos incluidos:</p>
                    <div className="space-y-3">
                      {promo.products.slice(0, 2).map((p, pIdx) => (
                        <div key={pIdx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-borde">
                          <div className="w-12 h-12 rounded-lg bg-white border border-borde overflow-hidden shrink-0">
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="text-xs font-black text-texto truncate">{p.name}</h5>
                            <p className="text-[10px] font-bold text-gris truncate">{p.specs}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-[10px] text-gris line-through font-bold">{formatCOP(p.regularPrice)}</p>
                            <p className="text-xs font-black text-rojo">{formatCOP(p.promoPrice || p.regularPrice)}</p>
                          </div>
                        </div>
                      ))}
                      {promo.products.length > 2 && (
                        <div className="text-center">
                          <span className="text-[10px] font-black text-gris">+ {promo.products.length - 2} productos más</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mt-auto pt-6 border-t border-borde">
                    <button 
                      onClick={() => setSelectedPromo(promo)}
                      className="flex-1 h-12 px-4 border border-borde rounded-xl font-black text-xs uppercase tracking-widest text-gris hover:border-rojo hover:text-rojo transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      Ver detalle
                    </button>
                    {canBuy ? (
                      <button 
                        onClick={() => handleAddPromoToCart(promo)}
                        disabled={promo.status !== 'activa' || promo.products.every(p => !p.available)}
                        className="flex-1 h-12 px-4 bg-rojo text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-rojo/20 hover:bg-rojo-oscuro hover:scale-[1.02] active:scale-100 disabled:opacity-50 disabled:scale-100 transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <ShoppingCart size={18} /> Agregar promo
                      </button>
                    ) : (
                      <button 
                        onClick={() => setSelectedPromo(promo)}
                        className="flex-1 h-12 px-4 bg-gray-100 text-gris rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2"
                      >
                        <Tag size={18} /> Ver oferta
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="lg:col-span-2 py-20 text-center bg-white rounded-3xl border border-dashed border-borde">
              <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Tag size={32} />
              </div>
              <h3 className="text-xl font-black text-texto">No hay promociones disponibles</h3>
              <p className="text-gris font-medium mt-2">Prueba cambiando los filtros o consulta con tu asesor TBS.</p>
              <button 
                onClick={() => {
                  setFilterType('todas');
                  setFilterCategory('Todas');
                  setSearch('');
                }}
                className="mt-6 text-rojo font-black text-sm uppercase tracking-widest hover:underline cursor-pointer"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Promotion Detail Modal */}
      <ModalShell
        isOpen={!!selectedPromo}
        onClose={() => setSelectedPromo(null)}
        title={selectedPromo?.title}
        size="lg"
        footer={
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Button 
              variant="secondary"
              fullWidth
              icon={<MessageSquare size={20} />}
              onClick={() => selectedPromo && onGoAdvisorChat('promo', selectedPromo.title)}
            >
              Consultar asesor
            </Button>
            {canBuy ? (
              <Button 
                variant="primary"
                fullWidth
                icon={<ShoppingCart size={20} />}
                onClick={() => {
                  if (selectedPromo) {
                    handleAddPromoToCart(selectedPromo);
                    setSelectedPromo(null);
                  }
                }}
              >
                Agregar promoción
              </Button>
            ) : (
              <div className="flex-1 h-14 bg-gray-100 text-gris rounded-xl font-black text-xs uppercase flex items-center justify-center text-center px-4">
                Compra no disponible para este perfil
              </div>
            )}
          </div>
        }
      >
        {selectedPromo && (
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div>
                <SectionHeader eyebrow="Descripción básica" className="mb-4" title="" />
                <p className="text-sm text-gris leading-relaxed">{selectedPromo.description}</p>
                
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-borde text-xs font-bold text-gris">
                    <Calendar size={16} className="text-rojo shrink-0" />
                    <span>Válido hasta: <span className="text-texto font-black">{selectedPromo.condition.validUntil}</span></span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-borde text-xs font-bold text-gris">
                    <TrendingDown size={16} className="text-green-600 shrink-0" />
                    <span>Mínimo de unidades: <span className="text-texto font-black">{selectedPromo.condition.minUnits}</span></span>
                  </div>
                </div>
              </div>
              <div className="bg-[#F8F9FA] rounded-2xl p-6 border border-borde relative overflow-hidden">
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-rojo-suave/20 -rotate-12 translate-x-8 translate-y-8 blur-3xl pointer-events-none" />
                <SectionHeader icon={<Info size={14} className="text-rojo" />} eyebrow="Condiciones B2B" title="" className="mb-4 relative z-10" />
                <ul className="space-y-3 relative z-10">
                  {[
                    { icon: Users, label: 'Tipo cliente', val: selectedPromo.condition.customerTypes?.join(', ') },
                    { icon: MapPin, label: 'Ciudades', val: selectedPromo.condition.cities?.join(', ') },
                    { icon: AlertCircle, label: 'Validación', val: selectedPromo.condition.requiresApproval ? 'Requerida' : 'Inmediata' }
                  ].map((c, i) => (
                    <li key={i} className="flex gap-3">
                      <c.icon size={16} className="text-rojo shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-black text-gris uppercase">{c.label}</p>
                        <p className="text-xs font-black text-texto">{c.val}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                {selectedPromo.condition.notes && (
                  <p className="mt-4 pt-4 border-t border-borde text-[10px] font-medium text-gris italic relative z-10">
                    Nota: {selectedPromo.condition.notes}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <SectionHeader eyebrow="Productos incluidos en la promoción" title="" className="mb-4" />
              <div className="space-y-3">
                {selectedPromo.products.map((p, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-borde group">
                    <div className="w-16 h-16 rounded-xl bg-white border border-borde overflow-hidden shrink-0">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-black text-texto">{p.name}</h5>
                      <p className="text-xs font-bold text-gris">{p.specs}</p>
                      <p className="text-[10px] font-black text-rojo mt-1 uppercase tracking-widest">Cant. requerida: {p.requiredQuantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gris line-through font-bold">{formatCOP(p.regularPrice)}</p>
                      <p className="text-lg font-black text-rojo">{formatCOP(p.promoPrice || p.regularPrice)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                       {p.available ? (
                          <Button 
                            variant="primary" 
                            size="sm" 
                            icon={<ShoppingCart size={18} />} 
                            onClick={() => onAddToCart({
                                id: p.productId || 0,
                                name: p.name,
                                category: p.category,
                                specs: p.specs,
                                price: formatCOP(p.promoPrice || p.regularPrice),
                                image: p.image || ''
                            }, 'promotion_detail')}
                          />
                       ) : (
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            icon={<MessageSquare size={18} />} 
                            onClick={() => onGoAdvisorChat('disponibilidad', p.name)}
                          />
                       )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 p-6 bg-rojo-suave/30 rounded-2xl border border-rojo/10 border-dashed text-center">
              <p className="text-xs text-gris italic">
                {isCash 
                  ? '"La aplicación final de la promoción queda sujeta a pago anticipado, inventario, condiciones comerciales y facturación al momento de procesar el pedido."'
                  : '"La aplicación final de la promoción queda sujeta a validación comercial, inventario, cupo y facturación al momento de procesar el pedido."'
                }
              </p>
            </div>
          </div>
        )}
      </ModalShell>

      {/* Confirmation Modal */}
      <ModalShell
        isOpen={showConfirmModal.show}
        onClose={() => setShowConfirmModal({ show: false })}
        title="¡Promoción agregada!"
        size="md"
      >
        {showConfirmModal.promo && (
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} strokeWidth={2.5} />
            </div>
            <p className="text-gris font-medium mt-2 leading-relaxed">
              Los productos disponibles de <br />
              <span className="text-rojo font-bold">"{showConfirmModal.promo.title}"</span> <br />
              fueron agregados a tu carrito.
            </p>

            {showConfirmModal.promo.condition.requiresApproval && (
              <div className="mt-4">
                <AlertBox
                  type="warning"
                  title="Atención"
                  description="Esta promoción requiere validación comercial antes de confirmar el pedido final."
                  icon={<AlertCircle size={18} />}
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mt-8 py-4 border-y border-borde">
              <div className="text-left">
                <p className="text-[10px] font-black text-gris uppercase tracking-widest">Unidades</p>
                <p className="text-xl font-black text-texto">{showConfirmModal.results?.units}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-gris uppercase tracking-widest">Ahorro estimado</p>
                <p className="text-xl font-black text-green-600">-{formatCOP(showConfirmModal.results?.totalSavings)}</p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <Button 
                variant="primary"
                fullWidth
                onClick={() => {
                  setShowConfirmModal({ show: false });
                  onOpenCart();
                }}
              >
                Ver carrito
              </Button>
              <Button 
                variant="ghost"
                fullWidth
                onClick={() => setShowConfirmModal({ show: false })}
              >
                Seguir viendo promos
              </Button>
            </div>
          </div>
        )}
      </ModalShell>
    </PageContainer>
  );
}
