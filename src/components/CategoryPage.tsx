import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Info, 
  Plus, 
  ShoppingCart, 
  Package, 
  Filter, 
  ChevronRight, 
  Check, 
  Star, 
  Tag, 
  X, 
  Search, 
  ShoppingBag,
  History,
  TrendingUp,
  Zap,
  Info as InfoIcon
} from 'lucide-react';
import { 
  Button,
  StatusBadge,
  AlertBox,
  EmptyState,
  ActionCard,
  SectionHeader,
  ModalShell,
  Tooltip,
  PageContainer,
  PageHeader
} from './ui';
import { useToasts } from './ToastContext';
import { Product, ShoppingList, B2BPromotion, User, BrandAdCampaign, ManagedClient, ManagedEvent, ManagedClientBillingType } from '../types';
import { BRAND_AD_CAMPAIGNS } from '../data';
import { AdSlot } from './advertising/AdSlot';
import { ProductModal } from './ProductModal';
import { SaveToListModal } from './SaveToListModal';
import { Breadcrumbs } from './Breadcrumbs';
import { ProductCarousel } from './ProductCarousel';
import { useAnalytics } from '../hooks/useAnalytics';

interface CategoryPageProps {
  category: string | null;
  products: Product[];
  onBack: () => void;
  isCliente: boolean;
  currentUser?: User | null;
  onAddToCart: (product: Product, source?: string | any) => void;
  onCategorySelect: (category: string | null) => void;
  onRequestAccess: () => void;
  onLogin: () => void;
  shoppingLists?: ShoppingList[];
  onAddToList?: (listId: string, product: Product, quantity: number) => void;
  onCreateList?: (name: string, description: string) => void;
  onGoPromotions?: () => void;
  promotions?: B2BPromotion[];
  searchQuery?: string;
  onClearSearch?: () => void;
  onAdClick?: (campaign: BrandAdCampaign) => void;
  hospitalityContext?: {
    partnerId: string;
    managedClientId: string;
    managedEventId?: string;
    billingType: ManagedClientBillingType;
  } | null;
  managedClients?: ManagedClient[];
  managedEvents?: ManagedEvent[];
  onClearHospitalityContext?: () => void;
  onGoHospitalityDashboard?: () => void;
}

export function CategoryPage({ 
  category, 
  products, 
  onBack, 
  isCliente, 
  currentUser,
  onAddToCart, 
  onCategorySelect,
  onRequestAccess,
  onLogin,
  shoppingLists = [],
  onAddToList,
  onCreateList,
  onGoPromotions,
  promotions = [],
  searchQuery = '',
  onClearSearch,
  onAdClick,
  hospitalityContext,
  managedClients = [],
  managedEvents = [],
  onClearHospitalityContext,
  onGoHospitalityDashboard
}: CategoryPageProps) {
  const analytics = useAnalytics(currentUser || null);
  const toasts = useToasts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [saveToListProduct, setSaveToListProduct] = useState<Product | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null);

  const handleAddToCart = async (product: Product, source: string) => {
    setAddingToCartId(product.id);
    // Simulate brief processing
    await new Promise(resolve => setTimeout(resolve, 600));
    onAddToCart(product, source as any);
    setAddingToCartId(null);
    
    toasts.success(
      "Producto agregado", 
      `${product.name} se agregó al carrito correctamente.`
    );
  };
  
  // Track catalog view
  useEffect(() => {
    analytics.track('catalog_viewed', 'catalog', { 
      productCategory: category || 'all',
      searchTerm: searchQuery || undefined
    });
  }, [category, searchQuery, analytics]);

  // Track search
  useEffect(() => {
    if (searchQuery) {
      analytics.trackSearch('catalog', searchQuery);
    }
  }, [searchQuery, analytics]);
  
  // Filter states
  const [selectedOrigin, setSelectedOrigin] = useState<string | null>(null);
  const [selectedSubcat, setSelectedSubcat] = useState<string | null>(null);

  // Track filters
  const handleOriginFilter = (origin: string | null) => {
    setSelectedOrigin(origin);
    if (origin) analytics.trackFilter('catalog', 'origin', origin);
  };

  const handleSubcatFilter = (sub: string | null) => {
    setSelectedSubcat(sub);
    if (sub) analytics.trackFilter('catalog', 'subcategory', sub);
  };
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Extract filter options based on current category products
  const filterOptions = useMemo(() => {
    const origins = new Set<string>();
    const subcats = new Set<string>();
    
    products.forEach(p => {
      if (p.origin) origins.add(p.origin);
      if (p.subcategory) subcats.add(p.subcategory);
    });
    
    return {
      origins: Array.from(origins).sort(),
      subcategories: Array.from(subcats).sort()
    };
  }, [products]);

  // Apply filters
  const filteredList = useMemo(() => {
    return products.filter(p => {
      const matchOrigin = !selectedOrigin || p.origin === selectedOrigin;
      const matchSubcat = !selectedSubcat || p.subcategory === selectedSubcat;
      return matchOrigin && matchSubcat;
    });
  }, [products, selectedOrigin, selectedSubcat]);

  // Pagination logic
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const paginatedList = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredList.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredList, currentPage]);

  const clearFilters = () => {
    analytics.trackCta('catalog_clear_filters', 'catalog');
    setSelectedOrigin(null);
    setSelectedSubcat(null);
    onCategorySelect(null);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    analytics.track('pagination_clicked', 'engagement', { page, source: 'catalog' });
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset page when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [selectedOrigin, selectedSubcat]);

  const canBuy = isCliente && (currentUser?.role === 'cliente_b2b' || currentUser?.role === 'hospitality_partner' || !currentUser);

  const managedClient = managedClients.find(c => c.id === hospitalityContext?.managedClientId);
  const managedEvent = managedEvents.find(e => e.id === hospitalityContext?.managedEventId);

  return (
    <PageContainer variant="dashboard" className="py-10">
      <AnimatePresence>
        {hospitalityContext && managedClient && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-10 bg-texto text-white p-6 rounded-[32px] shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6 border border-white/10"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-inner">
                <ShoppingBag size={32} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <StatusBadge status="aprobado" label="Modo Gestión" className="bg-rojo text-primary border-none py-0.5" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Abastecimiento Delegado</span>
                </div>
                <h3 className="text-2xl font-black tracking-tight leading-none mb-1">{managedClient.businessName}</h3>
                <div className="text-[11px] font-bold text-white/60 flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                   {managedEvent ? `Evento: ${managedEvent.eventName} • ${managedEvent.eventDate}` : 'Compra directa para cliente'}
                   {hospitalityContext.billingType && ` • Facturación: ${hospitalityContext.billingType === 'facturar_cliente_final' ? 'Cliente Final' : 'Gestor'}`}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <Button 
                variant="ghost"
                size="sm"
                onClick={onGoHospitalityDashboard}
                className="text-white hover:bg-white/10 flex-1 lg:flex-none border border-white/20"
              >
                Cambiar destino
              </Button>
              <Button 
                variant="primary"
                size="sm"
                onClick={onClearHospitalityContext}
                leftIcon={X}
                className="flex-1 lg:flex-none"
              >
                Cancelar Gestión
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Breadcrumbs 
        onHomeClick={onBack}
        items={[
          { label: 'Catálogo', onClick: () => { onCategorySelect(null); window.scrollTo(0,0); }, current: !category },
          ...(category ? [{ label: category, current: true }] : [])
        ]}
      />

      <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-12">
        <div className="flex-1">
          <PageHeader
            eyebrow="Abastecimiento B2B"
            title={category ? `Catálogo: ${category}` : 'Catálogo B2B de Licores'}
            description="Consulta productos, precios según tu perfil, disponibilidad y condiciones comerciales."
            variant="dashboard"
          />
          {searchQuery && (
            <div className="mt-[-1rem] mb-6 flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-texto text-white rounded-xl shadow-lg">
                <Search size={16} className="text-rojo" strokeWidth={3} />
                <span className="text-xs font-black uppercase tracking-widest leading-none">{searchQuery}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClearSearch}
                leftIcon={X}
                className="h-10 w-10 p-0 rounded-xl"
              />
            </div>
          )}
        </div>
        {!isCliente && (
          <AlertBox 
            variant="warning"
            className="max-w-md w-full mb-8 shadow-sm"
            description="Estás viendo precios públicos sugeridos. Accede para ver condiciones de canal."
            cta={{
              label: "Inicia sesión",
              onClick: onLogin
            }}
          />
        )}
      </div>
      
      {onGoPromotions && (
        <div className="mb-12">
          <AdSlot 
            placement="catalog_top_banner"
            campaigns={BRAND_AD_CAMPAIGNS}
            currentUser={currentUser}
            category={category || undefined}
            onAdClick={onAdClick || (() => {})}
            compact={false}
          />
        </div>
      )}

      {onGoPromotions && !BRAND_AD_CAMPAIGNS.some(c => c.active && c.placement === 'catalog_top_banner' && (!category || c.category === category)) && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 bg-gradient-to-r from-rojo to-black rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative group"
        >
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 pointer-events-none">
            <Tag size={200} className="text-white -rotate-12 translate-x-1/4 translate-y-1/4" />
          </div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur rounded-full text-[10px] font-black text-white uppercase tracking-widest mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Exclusivo TBS
            </div>
            <h3 className="text-2xl font-black text-white">Promociones y activaciones activas</h3>
            <p className="text-white/80 font-bold mt-1 uppercase tracking-widest text-[10px]">Aprovecha combos y descuentos por volumen disponibles hoy</p>
          </div>
          <button 
            onClick={() => {
              analytics.trackCta('catalog_promo_banner', 'catalog');
              onGoPromotions();
            }}
            className="relative z-10 px-8 py-3.5 bg-white text-rojo rounded-xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl cursor-pointer"
          >
            Ver promociones TBS
          </button>
        </motion.div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Mobile Filter Toggle & Chips */}
        <div className="lg:hidden flex flex-col gap-4 mb-6">
          <Button 
            variant="secondary" 
            onClick={() => setIsFiltersOpen(true)}
            leftIcon={Filter}
            className="w-full h-14 rounded-2xl font-black text-sm uppercase tracking-widest border-2"
          >
            Filtros {(selectedOrigin || selectedSubcat || category) ? '(Activos)' : ''}
          </Button>

          {(selectedOrigin || selectedSubcat || category) && (
            <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 no-scrollbar">
              {category && (
                <div className="flex items-center gap-2 px-4 py-2 bg-rojo-suave text-rojo rounded-xl text-xs font-bold border border-rojo/10 whitespace-nowrap">
                  {category}
                  <X size={14} onClick={() => onCategorySelect(null)} className="cursor-pointer" />
                </div>
              )}
              {selectedOrigin && (
                <div className="flex items-center gap-2 px-4 py-2 bg-rojo-suave text-rojo rounded-xl text-xs font-bold border border-rojo/10 whitespace-nowrap">
                  {selectedOrigin}
                  <X size={14} onClick={() => setSelectedOrigin(null)} className="cursor-pointer" />
                </div>
              )}
              {selectedSubcat && (
                <div className="flex items-center gap-2 px-4 py-2 bg-rojo-suave text-rojo rounded-xl text-xs font-bold border border-rojo/10 whitespace-nowrap">
                  {selectedSubcat}
                  <X size={14} onClick={() => setSelectedSubcat(null)} className="cursor-pointer" />
                </div>
              )}
              <button 
                onClick={clearFilters}
                className="text-xs font-black text-rojo uppercase tracking-widest px-2 py-2"
              >
                Limpiar Todo
              </button>
            </div>
          )}
        </div>

        {/* Sidebar Filters (Desktop) / Drawer (Mobile) */}
        <AnimatePresence>
          {(isFiltersOpen || window.innerWidth >= 1024) && (
            <>
              {/* Mobile Overlay */}
              {isFiltersOpen && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsFiltersOpen(false)}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden"
                />
              )}

              <motion.aside 
                initial={isFiltersOpen ? { x: '100%' } : {}}
                animate={isFiltersOpen ? { x: 0 } : {}}
                exit={isFiltersOpen ? { x: '100%' } : {}}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className={`w-full lg:w-64 shrink-0 ${
                  isFiltersOpen 
                    ? 'fixed inset-y-0 right-0 z-[101] bg-white p-8 shadow-2xl overflow-y-auto w-[85%] max-w-sm lg:relative lg:inset-auto lg:p-0 lg:shadow-none lg:bg-transparent lg:w-64' 
                    : 'hidden lg:block'
                }`}
              >
                <div className={`${isFiltersOpen ? '' : 'sticky top-24'} space-y-8 pb-20 lg:pb-0`}>
                  <div className="flex items-center justify-between">
                    <h3 className="flex items-center gap-2 font-black text-texto">
                      <Filter size={18} /> Filtros
                    </h3>
                    <div className="flex items-center gap-4">
                      {(selectedOrigin || selectedSubcat || category) && (
                        <button 
                          onClick={clearFilters}
                          className="text-xs font-bold text-rojo hover:underline cursor-pointer"
                        >
                          Limpiar
                        </button>
                      )}
                      {isFiltersOpen && (
                        <button onClick={() => setIsFiltersOpen(false)} className="lg:hidden text-gris">
                          <X size={20} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Filter Group: Category */}
                  <div>
                    <h4 className="text-xs font-black text-gris uppercase tracking-widest mb-4">Categoría</h4>
                    <div className="space-y-2">
                      {[
                        'Whisky', 'Ron', 'Ginebra', 'Vodka', 'Tequila y mezcal', 'Aguardiente', 'Vinos y espumantes'
                      ].map(cat => (
                        <button
                          key={cat}
                          onClick={() => {
                            onCategorySelect(cat === category ? null : cat);
                            if (isFiltersOpen) setIsFiltersOpen(false);
                          }}
                          className={`flex items-center justify-between w-full text-sm font-bold p-2.5 rounded-lg transition-all cursor-pointer ${
                            category === cat 
                              ? 'bg-rojo/5 text-rojo border border-rojo/20' 
                              : 'text-texto-sec hover:bg-gray-100'
                          }`}
                        >
                          {cat}
                          {category === cat && <Check size={14} strokeWidth={3} />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Filter Group: Origin */}
                  {filterOptions.origins.length > 0 && (
                    <div>
                      <h4 className="text-xs font-black text-gris uppercase tracking-widest mb-4">Origen</h4>
                      <div className="space-y-2">
                        {filterOptions.origins.map(origin => (
                          <button
                            key={origin}
                            onClick={() => {
                              handleOriginFilter(origin === selectedOrigin ? null : origin);
                              if (isFiltersOpen) setIsFiltersOpen(false);
                            }}
                            className={`flex items-center justify-between w-full text-sm font-bold p-2.5 rounded-lg transition-all cursor-pointer ${
                              selectedOrigin === origin 
                                ? 'bg-rojo/5 text-rojo border border-rojo/20' 
                                : 'text-texto-sec hover:bg-gray-100'
                            }`}
                          >
                            {origin}
                            {selectedOrigin === origin && <Check size={14} strokeWidth={3} />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Filter Group: Subcategory */}
                  {filterOptions.subcategories.length > 0 && (
                    <div>
                      <h4 className="text-xs font-black text-gris uppercase tracking-widest mb-4">Tipo de destilado</h4>
                      <div className="space-y-2">
                        {filterOptions.subcategories.map(sub => (
                          <button
                            key={sub}
                            onClick={() => {
                              handleSubcatFilter(sub === selectedSubcat ? null : sub);
                              if (isFiltersOpen) setIsFiltersOpen(false);
                            }}
                            className={`flex items-center justify-between w-full text-sm font-bold p-2.5 rounded-lg transition-all cursor-pointer ${
                              selectedSubcat === sub 
                                ? 'bg-rojo/5 text-rojo border border-rojo/20' 
                                : 'text-texto-sec hover:bg-gray-100'
                            }`}
                          >
                            {sub}
                            {selectedSubcat === sub && <Check size={14} strokeWidth={3} />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile Bottom Action */}
                {isFiltersOpen && (
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 lg:hidden">
                    <Button 
                      variant="primary" 
                      onClick={() => setIsFiltersOpen(false)}
                      className="w-full"
                    >
                      Aplicar Filtros
                    </Button>
                  </div>
                )}
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Product Grid */}
        <div className="flex-1">
          {searchQuery && (
            <div className="mb-8">
              <AdSlot 
                placement="search_sponsored_result"
                campaigns={BRAND_AD_CAMPAIGNS}
                currentUser={currentUser}
                onAdClick={onAdClick || (() => {})}
                products={products}
                onAddToCart={onAddToCart}
                maxItems={2}
                compact={true}
              />
            </div>
          )}

          {paginatedList.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {paginatedList.map((product) => {
                  const productPromo = promotions.find(p => p.products.some(pp => pp.productId === product.id));
                  
                  return (
                    <motion.article 
                      key={product.id}
                      whileHover={{ y: -5 }}
                      onClick={() => setSelectedProduct(product)}
                      className="bg-white border border-borde rounded-[24px] overflow-hidden panel-shadow flex flex-col h-full cursor-pointer relative group transition-all hover:border-rojo/10"
                    >
                      {/* Badge Stack Top Left */}
                      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                        {product.originalPrice && (
                          <StatusBadge status="pendiente" label="Oferta TBS" className="bg-amber-400 text-black border-none py-1.5 font-sans shadow-lg" />
                        )}
                        {product.isUrgent && (
                          <div className="bg-yellow-500 text-white rounded-full px-3 py-1 flex items-center gap-1 text-[9px] font-black uppercase tracking-widest shadow-lg">
                            <Zap size={10} fill="currentColor" /> Entrega Urgente
                          </div>
                        )}
                      </div>

                      {/* Badge Stack Top Right */}
                      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 items-end">
                        {product.isSponsored && (
                          <Tooltip content="Este producto tiene visibilidad contratada por la marca.">
                            <div className="bg-white/90 backdrop-blur text-texto rounded-full px-3 py-1 flex items-center gap-1 text-[9px] font-black uppercase tracking-widest border border-borde shadow-sm cursor-help">
                              <Star size={10} className="text-amber-500" fill="currentColor" /> Patrocinado
                            </div>
                          </Tooltip>
                        )}
                        {product.hasPromotion && (
                          <div className="bg-rojo text-white rounded-full px-3 py-1 flex items-center gap-1 text-[9px] font-black uppercase tracking-widest shadow-lg">
                            <Tag size={10} /> Promoción Activa
                          </div>
                        )}
                        {product.previouslyPurchased && (
                          <div className="bg-texto text-white rounded-full px-3 py-1 flex items-center gap-1 text-[9px] font-black uppercase tracking-widest shadow-lg">
                            <History size={10} /> Comprado Antes
                          </div>
                        )}
                      </div>

                      <div className="relative aspect-square overflow-hidden bg-gray-50 border-b border-gray-50">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="bg-white/90 backdrop-blur px-6 py-2.5 rounded-2xl text-xs font-black text-texto shadow-xl uppercase tracking-widest">
                            Detalles
                          </div>
                        </div>
                      </div>
                      <div className="p-8 flex flex-col flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-[10px] font-black text-gris-oscuro uppercase tracking-[0.2em] font-sans">{product.category}</div>
                          {product.origin && (
                            <StatusBadge status="info" label={product.origin} className="bg-gray-100 text-gris-oscuro border-none text-[9px] py-0.5 font-sans" />
                          )}
                        </div>
                        <h3 className="text-xl font-black text-texto leading-none tracking-tight mb-3 group-hover:text-rojo transition-colors">{product.name}</h3>
                        <p className="text-sm text-texto-sec font-medium mb-4 leading-relaxed line-clamp-2">{product.specs}</p>
                        
                        {/* Availability Status */}
                        <div className="mb-6 pt-4 border-t border-dashed border-gray-100">
                          <div className="flex items-center justify-between gap-2">
                             <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${
                                  product.stockStatus === 'out_of_stock' ? 'bg-red-500' : 
                                  product.stockStatus === 'low_stock' ? 'bg-orange-500 animate-pulse' : 
                                  'bg-green-500'
                                }`} />
                                <span className={`text-[10px] font-black uppercase tracking-widest ${
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
                               <div className="text-[10px] font-bold text-gris uppercase tracking-tight">
                                  Despacho en 24h
                               </div>
                             )}
                          </div>
                        </div>
                        
                        <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between gap-4">
                          <div className="min-w-0">
                            <div className="text-[10px] text-gris font-black uppercase tracking-widest mb-1 leading-none">Precio {isCliente ? 'B2B' : 'Sugerido'}</div>
                            {isCliente ? (
                              <div className="flex flex-col">
                                {product.originalPrice && (
                                  <span className="text-xs text-gris line-through font-bold leading-none mb-1 opacity-50">
                                    {product.originalPrice}
                                  </span>
                                )}
                                <div className={`text-2xl font-black tracking-tight leading-none ${product.originalPrice ? 'text-rojo' : 'text-texto'}`}>
                                  {product.price}
                                </div>
                              </div>
                            ) : currentUser && (currentUser.role === 'marca' || currentUser.role === 'proveedor') ? (
                              <div className="flex flex-col">
                                {product.originalPrice && (
                                  <span className="text-xs text-gris line-through font-bold leading-none mb-1 opacity-50">
                                    {product.originalPrice}
                                  </span>
                                )}
                                <div className={`text-2xl font-black tracking-tight leading-none ${product.originalPrice ? 'text-rojo' : 'text-texto'}`}>
                                  {product.price}
                                </div>
                              </div>
                            ) : (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={(e) => { e.stopPropagation(); onRequestAccess(); }}
                                className="h-auto p-0 text-rojo font-black"
                              >
                                Consultar
                              </Button>
                            )}
                          </div>
                          {canBuy && (
                            <div className="flex gap-2">
                              {onAddToList && (
                                <Button
                                  variant="ghost"
                                  size="md"
                                  onClick={(e) => { e.stopPropagation(); setSaveToListProduct(product); }}
                                  className="rounded-[18px] border border-borde bg-white"
                                  leftIcon={Star}
                                />
                              )}
                              <Button
                                variant="primary"
                                size="md"
                                isLoading={addingToCartId === product.id}
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  handleAddToCart(product, 'catalog_grid'); 
                                }}
                                className="rounded-[18px] tbs-shadow shrink-0"
                                leftIcon={Plus}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </div>

              {/* Bottom Carousel Ad Slot */}
              <div className="mt-16">
                <AdSlot 
                  placement="catalog_bottom_carousel"
                  campaigns={BRAND_AD_CAMPAIGNS}
                  currentUser={currentUser}
                  onAdClick={onAdClick || (() => {})}
                  products={products}
                  onAddToCart={onAddToCart}
                  maxItems={4}
                />
              </div>

              {/* Pagination UI */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="p-2.5 border border-borde rounded-lg hover:border-rojo hover:text-rojo disabled:opacity-30 disabled:hover:border-borde disabled:hover:text-inherit transition-all cursor-pointer outline-none"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-lg text-sm font-black transition-all cursor-pointer outline-none ${
                        currentPage === page 
                          ? 'bg-rojo text-white tbs-shadow' 
                          : 'border border-borde hover:border-rojo hover:text-rojo'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="p-2.5 border border-borde rounded-lg hover:border-rojo hover:text-rojo disabled:opacity-30 disabled:hover:border-borde disabled:hover:text-inherit transition-all cursor-pointer outline-none rotate-180"
                  >
                    <ArrowLeft size={18} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <EmptyState 
              variant="noResults"
              title="No se encontraron productos"
              description="Prueba ajustando los filtros seleccionados o busca con otros términos."
              primaryActionLabel="Limpiar filtros"
              onPrimaryAction={clearFilters}
              className="py-32"
            />
          )}
        </div>
      </div>

      {/* Modal de Detalle de Producto */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductModal 
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
            onAddToCart={onAddToCart}
            isCliente={isCliente}
            currentUser={currentUser}
            shoppingLists={shoppingLists}
            onAddToList={onAddToList}
            onCreateList={onCreateList}
            promotions={promotions}
            onGoPromotions={onGoPromotions}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {saveToListProduct && onAddToList && onCreateList && (
          <SaveToListModal 
            product={saveToListProduct}
            isOpen={!!saveToListProduct}
            onClose={() => setSaveToListProduct(null)}
            shoppingLists={shoppingLists}
            onAddToList={onAddToList}
            onCreateList={onCreateList}
          />
        )}
      </AnimatePresence>
      
      {/* Carrusel de Productos Destacados */}
      <ProductCarousel 
        products={products.slice(0, 10)}
        onProductClick={(product) => {
          analytics.track('product_viewed', 'catalog', {
            source: 'catalog_carousel',
            productId: product.id,
            productCategory: product.category
          });
          setSelectedProduct(product);
        }}
        onAddToCart={(product, source) => {
          onAddToCart(product, source || 'catalog_carousel');
        }}
        isCliente={isCliente}
      />
    </PageContainer>
  );
}
