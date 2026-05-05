import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Search, 
  ShoppingCart, 
  RefreshCw, 
  ChevronRight, 
  CheckSquare, 
  Square, 
  Plus, 
  Minus, 
  Info, 
  X, 
  Phone,
  Package,
  Star,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare
} from 'lucide-react';
import { User, ReorderProduct, ReorderGroup, Product } from '../types';
import { useAnalytics } from '../hooks/useAnalytics';

interface ReorderPageProps {
  currentUser: User | null;
  onBackToAccount: () => void;
  onGoHome: () => void;
  onGoCatalog: () => void;
  onAddToCart: (product: Product, source?: string | any) => void;
  onOpenCart: () => void;
  onGoAdvisorChat: (topic?: any, context?: any) => void;
  onGoShoppingLists: () => void;
}

const formatCOP = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value).replace('COP', '$');
};

const DUMMY_REORDER_DATA: ReorderGroup[] = [
  {
    id: "group-001",
    title: "Último pedido",
    description: "Productos comprados en tu pedido más reciente.",
    type: "pedido_anterior",
    lastOrderDate: "2026-05-01",
    orderNumber: "TBS-10245",
    products: [
      {
        id: "rp-001",
        productId: 1,
        name: "Whisky Premium 750 ml",
        category: "Whisky",
        specs: "Botella individual",
        image: "https://images.unsplash.com/photo-1527045980461-84bc131f13b6?q=80&w=200&auto=format&fit=crop",
        lastPrice: 95000,
        suggestedQuantity: 6,
        available: true,
        stockLabel: "Disponible"
      },
      {
        id: "rp-002",
        productId: 2,
        name: "Ron Añejo 750 ml",
        category: "Ron",
        specs: "Botella individual",
        image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=200&auto=format&fit=crop",
        lastPrice: 62000,
        suggestedQuantity: 12,
        available: true,
        stockLabel: "Disponible"
      },
      {
        id: "rp-003",
        productId: 3,
        name: "Ginebra London Dry 750 ml",
        category: "Ginebra",
        specs: "Botella individual",
        image: "https://images.unsplash.com/photo-1551538597-15828bb41103?q=80&w=200&auto=format&fit=crop",
        lastPrice: 54000,
        suggestedQuantity: 4,
        available: true,
        stockLabel: "Disponible"
      }
    ]
  },
  {
    id: "group-002",
    title: "Lista frecuente: Fin de semana",
    description: "Productos que normalmente compras para preparar el fin de semana.",
    type: "lista_frecuente",
    products: [
      {
        id: "rp-004",
        productId: 4,
        name: "Vodka Premium 750 ml",
        category: "Vodka",
        specs: "Botella individual",
        image: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=200&auto=format&fit=crop",
        lastPrice: 61000,
        suggestedQuantity: 6,
        available: true,
        stockLabel: "Disponible"
      },
      {
        id: "rp-005",
        productId: 5,
        name: "Tequila Reposado 750 ml",
        category: "Tequila",
        specs: "Botella individual",
        image: "https://images.unsplash.com/photo-1610450507204-1f19616d2460?q=80&w=200&auto=format&fit=crop",
        lastPrice: 74000,
        suggestedQuantity: 6,
        available: true,
        stockLabel: "Disponible"
      },
      {
        id: "rp-006",
        productId: 6,
        name: "Aguardiente 750 ml",
        category: "Aguardiente",
        specs: "Botella individual",
        image: "https://images.unsplash.com/photo-1544145945-f904253db0ad?q=80&w=200&auto=format&fit=crop",
        lastPrice: 38000,
        suggestedQuantity: 12,
        available: false,
        stockLabel: "Consultar disponibilidad"
      }
    ]
  },
  {
    id: "group-003",
    title: "Recomendados para recompra",
    description: "Sugerencias basadas en tu historial de consumo.",
    type: "recomendado",
    products: [
      {
        id: "rp-007",
        productId: 7,
        name: "Vino Tinto Reserva 750 ml",
        category: "Vinos",
        specs: "Botella individual",
        image: "https://images.unsplash.com/photo-1553390882-026330441a1c?q=80&w=200&auto=format&fit=crop",
        lastPrice: 82000,
        suggestedQuantity: 6,
        available: true,
        stockLabel: "Disponible"
      },
      {
        id: "rp-008",
        productId: 8,
        name: "Espumante Brut 750 ml",
        category: "Espumantes",
        specs: "Botella individual",
        image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=200&auto=format&fit=crop",
        lastPrice: 69000,
        suggestedQuantity: 6,
        available: true,
        stockLabel: "Disponible"
      },
      {
        id: "rp-009",
        productId: 9,
        name: "Gin Premium Botánico 750 ml",
        category: "Ginebra",
        specs: "Botella individual",
        image: "https://images.unsplash.com/photo-1551538597-15828bb41103?q=80&w=200&auto=format&fit=crop",
        lastPrice: 88000,
        suggestedQuantity: 6,
        available: true,
        stockLabel: "Disponible"
      }
    ]
  }
];

export function ReorderPage({ 
  currentUser, 
  onBackToAccount, 
  onGoHome, 
  onGoCatalog,
  onAddToCart,
  onOpenCart,
  onGoAdvisorChat,
  onGoShoppingLists
}: ReorderPageProps) {
  const analytics = useAnalytics(currentUser);
  const [activeTab, setActiveTab] = useState<'todos' | 'pedido_anterior' | 'lista_frecuente' | 'recomendado'>('todos');
  const [search, setSearch] = useState('');

  useEffect(() => {
    analytics.trackPageView('/reorder', 'Reordenar pedido');
  }, []);

  useEffect(() => {
    if (search.length >= 3) {
      const handler = setTimeout(() => {
        analytics.trackSearch('reorder', search);
      }, 1000);
      return () => clearTimeout(handler);
    }
  }, [search]);

  useEffect(() => {
    analytics.trackFilter('reorder', 'type', activeTab);
  }, [activeTab]);

  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());
  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    DUMMY_REORDER_DATA.forEach(group => {
      group.products.forEach(p => {
        initial[p.id] = p.suggestedQuantity;
      });
    });
    return initial;
  });
  const [showAdvisorModal, setShowAdvisorModal] = useState<ReorderProduct | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState<{ count: number, units: number, total: number } | null>(null);

  const filteredGroups = useMemo(() => {
    return DUMMY_REORDER_DATA.filter(group => {
      const matchesTab = activeTab === 'todos' || group.type === activeTab;
      const productsMatchSearch = group.products.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) || 
        p.category.toLowerCase().includes(search.toLowerCase())
      );
      const groupMatchesSearch = group.title.toLowerCase().includes(search.toLowerCase()) || 
                                (group.orderNumber && group.orderNumber.toLowerCase().includes(search.toLowerCase()));

      if (!matchesTab) return false;
      if (search === '') return true;
      return groupMatchesSearch || productsMatchSearch.length > 0;
    }).map(group => {
      if (search === '') return group;
      const filteredProducts = group.products.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) || 
        p.category.toLowerCase().includes(search.toLowerCase())
      );
      return filteredProducts.length > 0 ? { ...group, products: filteredProducts } : (group.title.toLowerCase().includes(search.toLowerCase()) ? group : null);
    }).filter(g => g !== null) as ReorderGroup[];
  }, [activeTab, search]);

  const selectedProducts = useMemo(() => {
    const products: { p: ReorderProduct; q: number }[] = [];
    DUMMY_REORDER_DATA.forEach(g => {
      g.products.forEach(p => {
        if (selectedProductIds.has(p.id) && p.available) {
          products.push({ p, q: quantities[p.id] });
        }
      });
    });
    return products;
  }, [selectedProductIds, quantities]);

  const totals = useMemo(() => {
    const units = selectedProducts.reduce((sum, item) => sum + item.q, 0);
    const total = selectedProducts.reduce((sum, item) => sum + (item.p.lastPrice * item.q), 0);
    return { count: selectedProducts.length, units, total };
  }, [selectedProducts]);

  const handleToggleProduct = (id: string) => {
    const newSelected = new Set(selectedProductIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedProductIds(newSelected);
  };

  const handleToggleGroup = (group: ReorderGroup) => {
    const newSelected = new Set(selectedProductIds);
    const availableProducts = group.products.filter(p => p.available);
    const allSelected = availableProducts.every(p => newSelected.has(p.id));

    if (allSelected) {
      availableProducts.forEach(p => newSelected.delete(p.id));
    } else {
      availableProducts.forEach(p => newSelected.add(p.id));
    }
    setSelectedProductIds(newSelected);
  };

  const handleQuantity = (id: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta)
    }));
  };

  const handleAddSelectionToCart = () => {
    if (selectedProducts.length === 0) return;
    
    selectedProducts.forEach(({ p, q }) => {
      const product: Product = {
        id: p.productId || Math.floor(Math.random() * 100000),
        name: p.name,
        category: p.category,
        specs: p.specs,
        price: formatCOP(p.lastPrice),
        image: p.image || ""
      };
      onAddToCart(product, 'reorder_bulk' as any);
    });

    analytics.track('selection_reordered', 'engagement', {
      productCount: selectedProducts.length,
      totalValue: totals.total,
      units: totals.units
    });

    setShowConfirmModal({ ...totals });
    setSelectedProductIds(new Set());
  };

  const handleAddAllInGroup = (group: ReorderGroup) => {
    const availableProducts = group.products.filter(p => p.available);
    if (availableProducts.length === 0) return;

    let groupUnits = 0;
    let groupTotal = 0;

    availableProducts.forEach(p => {
      const q = quantities[p.id];
      groupUnits += q;
      groupTotal += p.lastPrice * q;
      
      const product: Product = {
        id: p.productId || Math.floor(Math.random() * 100000),
        name: p.name,
        category: p.category,
        specs: p.specs,
        price: formatCOP(p.lastPrice),
        image: p.image || ""
      };
      onAddToCart(product, 'reorder_bulk' as any);
    });

    analytics.track('group_reordered', 'engagement', {
      groupId: group.id,
      groupTitle: group.title,
      productCount: availableProducts.length,
      totalValue: groupTotal,
      units: groupUnits
    });

    setShowConfirmModal({ count: availableProducts.length, units: groupUnits, total: groupTotal });
  };

  const stats = useMemo(() => {
    const lastOrder = DUMMY_REORDER_DATA.find(g => g.type === 'pedido_anterior')?.orderNumber || 'TBS-10245';
    const frequentCount = DUMMY_REORDER_DATA.filter(g => g.type === 'lista_frecuente').reduce((sum, g) => sum + g.products.filter(p => p.available).length, 0);
    const recommendedCount = DUMMY_REORDER_DATA.filter(g => g.type === 'recomendado').reduce((sum, g) => sum + g.products.length, 0);
    return { lastOrder, frequentCount, recommendedCount };
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32">
      {/* Header section */}
      <div className="bg-white border-b border-borde pt-8 pb-10">
        <div className="max-w-[1480px] mx-auto px-8">
          <button 
            onClick={onBackToAccount}
            className="flex items-center gap-2 text-gris hover:text-rojo font-black text-xs uppercase tracking-wider mb-6 group transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Volver a mi cuenta
          </button>
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
            <div>
              <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-texto mb-2">Reordenar pedido</h1>
              <p className="text-gris font-medium text-lg leading-relaxed max-w-2xl">
                Repite pedidos anteriores, listas frecuentes o productos recomendados para abastecer tu negocio más rápido.
              </p>
            </div>
            <div className="bg-gray-50 px-6 py-4 rounded-2xl border border-borde">
              <div className="text-[10px] font-black uppercase tracking-widest text-rojo mb-1 tracking-tighter">Operación B2B</div>
              <div className="text-lg font-black text-texto">{currentUser?.businessName || 'Cargando...'}</div>
              <div className="text-xs font-extrabold text-gris mt-1 uppercase tracking-tight">{currentUser?.city}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1480px] mx-auto px-8 mt-10">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="Último pedido" value={stats.lastOrder} icon={Package} color="text-slate-600" />
          <StatCard title="Productos frecuentes" value={stats.frequentCount.toString()} icon={RefreshCw} color="text-rojo" bgColor="bg-rojo-suave" />
          <StatCard title="Recompra sugerida" value={stats.recommendedCount.toString()} icon={Star} color="text-yellow-600" />
          <StatCard title="Seleccionados" value={totals.count.toString()} icon={CheckSquare} color="text-blue-600" />
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="flex flex-nowrap overflow-x-auto gap-2 pb-2 lg:pb-0 scrollbar-hide">
            {(['todos', 'pedido_anterior', 'lista_frecuente', 'recomendado'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab 
                    ? 'bg-texto text-white shadow-lg' 
                    : 'bg-white text-gris border border-borde hover:border-rojo/30 hover:text-rojo'
                }`}
              >
                {tab === 'todos' ? 'Todos' : tab.replace('_', ' ')}
              </button>
            ))}
          </div>
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gris" size={20} />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar producto, categoría o pedido"
              className="w-full h-12 bg-white border border-borde rounded-xl pl-12 pr-6 font-semibold outline-none focus:border-rojo transition-colors"
            />
          </div>
        </div>

        {/* Groups List */}
        <div className="space-y-12">
          {filteredGroups.length > 0 ? (
            filteredGroups.map(group => (
              <div key={group.id} className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-2xl font-black text-texto tracking-tight">{group.title}</h2>
                      <span className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        group.type === 'pedido_anterior' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                        group.type === 'lista_frecuente' ? 'bg-purple-50 text-purple-600 border border-purple-100' :
                        'bg-yellow-50 text-yellow-600 border border-yellow-100'
                      }`}>
                        {group.type.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-gris font-medium text-sm">{group.description}</p>
                    {group.lastOrderDate && (
                      <div className="text-[10px] font-black text-rojo uppercase tracking-widest mt-2">
                        Fecha: {group.lastOrderDate} · N° {group.orderNumber}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={onGoShoppingLists}
                      className="px-4 py-2 border border-rojo/30 bg-rojo-suave text-rojo rounded-lg text-xs font-black hover:bg-rojo/10 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Star size={16} className="fill-rojo" /> Ver mis listas
                    </button>
                    <button 
                      onClick={() => handleToggleGroup(group)}
                      className="px-4 py-2 border border-borde rounded-lg text-xs font-black text-gris hover:border-rojo/30 hover:text-rojo transition-all flex items-center gap-2 cursor-pointer bg-white"
                    >
                      <CheckSquare size={16} /> Seleccionar todo
                    </button>
                    <button 
                      onClick={() => handleAddAllInGroup(group)}
                      className="px-4 py-2 bg-texto text-white rounded-lg text-xs font-black hover:bg-rojo transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <ShoppingCart size={16} /> Agregar todo
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {group.products.map(product => (
                    <ReorderProductCard 
                      key={product.id}
                      product={product}
                      isSelected={selectedProductIds.has(product.id)}
                      onToggle={() => handleToggleProduct(product.id)}
                      quantity={quantities[product.id] || 1}
                      onUpdateQuantity={(delta) => handleQuantity(product.id, delta)}
                      onAddToCart={() => {
                        const p: Product = {
                          id: product.productId || Math.floor(Math.random() * 100000),
                          name: product.name,
                          category: product.category,
                          specs: product.specs,
                          price: formatCOP(product.lastPrice),
                          image: product.image || ""
                        };
                        onAddToCart(p, 'reorder');
                        setShowConfirmModal({ count: 1, units: quantities[product.id] || 1, total: product.lastPrice * (quantities[product.id] || 1) });
                      }}
                      onConsultAdvisor={() => setShowAdvisorModal(product)}
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-3xl p-20 border border-dash border-borde text-center">
              <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw size={32} />
              </div>
              <h3 className="text-xl font-black text-texto mb-2">No encontramos resultados</h3>
              <p className="text-gris font-medium">Intenta con otros filtros o términos de búsqueda.</p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Selection Panel */}
      <AnimatePresence>
        {totals.count > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t border-borde tbs-shadow-up z-[1000] p-6"
          >
            <div className="max-w-[1480px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl">
                    <CheckSquare size={24} />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase text-gris tracking-widest leading-none mb-1">Selección actual</div>
                    <div className="text-lg font-black text-texto">{totals.count} productos</div>
                  </div>
                </div>
                <div className="h-10 w-px bg-gray-100 hidden md:block" />
                <div className="text-center md:text-left">
                  <div className="text-[10px] font-black uppercase text-gris tracking-widest leading-none mb-1">Unidades totales</div>
                  <div className="text-lg font-black text-texto">{totals.units} unidades</div>
                </div>
                <div className="h-10 w-px bg-gray-100 hidden md:block" />
                <div className="text-center md:text-left">
                  <div className="text-[10px] font-black uppercase text-gris tracking-widest leading-none mb-1">Total estimado</div>
                  <div className="text-2xl font-black text-rojo tracking-tighter">{formatCOP(totals.total)}</div>
                </div>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                <button 
                  onClick={() => setSelectedProductIds(new Set())}
                  className="flex-1 md:flex-none py-4 px-8 border-2 border-borde text-gris rounded-xl font-black hover:border-rojo/30 hover:text-rojo transition-all cursor-pointer"
                >
                  Limpiar selección
                </button>
                <button 
                  onClick={handleAddSelectionToCart}
                  className="flex-1 md:flex-none py-4 px-12 bg-texto text-white rounded-xl font-black hover:bg-rojo transition-all tbs-shadow cursor-pointer flex items-center justify-center gap-3"
                >
                  <ShoppingCart size={20} /> Agregar al carrito
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowConfirmModal(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative bg-white p-10 rounded-[40px] max-w-md w-full text-center tbs-shadow border-4 border-white">
              <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-3xl font-black text-texto mb-2 tracking-tight">Productos agregados</h3>
              <p className="text-gris font-medium text-lg leading-snug mb-8">
                La selección fue agregada correctamente para construir tu pedido.
              </p>
              
              <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-[10px] font-black uppercase text-gris tracking-widest">Productos</span>
                  <span className="font-black text-texto">{showConfirmModal.count}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-[10px] font-black uppercase text-gris tracking-widest">Unidades</span>
                  <span className="font-black text-texto">{showConfirmModal.units}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-gris tracking-widest">Total Estimado</span>
                  <span className="font-black text-rojo text-lg">{formatCOP(showConfirmModal.total)}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => {
                    setShowConfirmModal(null);
                    onOpenCart();
                  }}
                  className="w-full py-4 bg-texto text-white rounded-xl font-black hover:bg-rojo transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={20} /> Ver carrito
                </button>
                <button 
                  onClick={() => setShowConfirmModal(null)}
                  className="w-full py-4 border-2 border-borde text-gris rounded-xl font-black hover:bg-gray-50 transition-all cursor-pointer"
                >
                  Seguir reordenando
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Advisor Modal */}
      <AnimatePresence>
        {showAdvisorModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAdvisorModal(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative bg-white p-8 rounded-[32px] max-w-sm w-full tbs-shadow">
              <button onClick={() => setShowAdvisorModal(null)} className="absolute top-6 right-6 text-gris hover:text-texto transition-colors cursor-pointer">
                <X size={24} />
              </button>
              <div className="text-center">
                <div className="w-20 h-20 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle size={32} />
                </div>
                <h3 className="text-2xl font-black text-texto mb-1">Consultar disponibilidad</h3>
                <p className="text-sm font-medium text-gris mb-8 leading-relaxed">
                  Tu asesor TBS puede ayudarte a validar inventario, sustitutos o próxima disponibilidad.
                </p>
                
                <div className="bg-gray-50 rounded-2xl p-6 text-left space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <img src={showAdvisorModal.image} alt="" className="w-10 h-10 object-contain bg-white rounded-lg border border-borde p-1" />
                    <div>
                      <div className="text-[10px] font-black uppercase text-gris tracking-widest mb-0.5">Producto</div>
                      <div className="text-xs font-black text-texto leading-tight">{showAdvisorModal.name}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase text-gris tracking-widest mb-1">Asesor</div>
                    <div className="text-sm font-black text-texto">Laura Gómez</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase text-gris tracking-widest mb-1">Celular / WhatsApp</div>
                    <div className="text-sm font-black text-texto">317 123 4567</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={() => {
                      onGoAdvisorChat('producto', { label: showAdvisorModal.name, type: 'producto' });
                      setShowAdvisorModal(null);
                    }}
                    className="w-full py-4 bg-rojo text-white rounded-xl font-black flex items-center justify-center gap-2 hover:bg-texto transition-all cursor-pointer"
                  >
                    <MessageSquare size={18} /> Chatear con mi asesor
                  </button>
                  <button onClick={() => setShowAdvisorModal(null)} className="w-full py-4 border border-borde text-gris rounded-xl font-black hover:bg-gray-50 transition-all cursor-pointer">
                    Cerrar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color = 'text-texto', bgColor }: { title: string, value: string, icon: any, color?: string, bgColor?: string }) {
  const finalBgColor = bgColor || color.replace('text-', 'bg-').replace('600', '100');
  return (
    <div className="bg-white p-6 rounded-3xl border border-borde tbs-shadow flex items-start gap-4 hover:scale-[1.02] transition-transform">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${finalBgColor} ${color}`}>
        <Icon size={24} />
      </div>
      <div>
        <h3 className="text-[11px] font-black text-gris uppercase tracking-widest mb-1">{title}</h3>
        <p className={`text-2xl font-black ${color}`}>{value}</p>
      </div>
    </div>
  );
}

interface ReorderProductCardProps {
  key?: any;
  product: ReorderProduct; 
  isSelected: boolean; 
  onToggle: () => void; 
  quantity: number; 
  onUpdateQuantity: (delta: number) => void; 
  onAddToCart: () => void;
  onConsultAdvisor: () => void;
}

function ReorderProductCard({ 
  product, 
  isSelected, 
  onToggle, 
  quantity, 
  onUpdateQuantity, 
  onAddToCart,
  onConsultAdvisor 
}: ReorderProductCardProps) {
  return (
    <div className={`bg-white rounded-3xl border transition-all p-5 relative flex flex-col ${isSelected ? 'border-rojo ring-1 ring-rojo/20' : 'border-borde hover:border-rojo/30'}`}>
      <div className="flex justify-between items-start mb-4">
        <button 
          onClick={product.available ? onToggle : undefined}
          className={`shrink-0 transition-colors cursor-pointer ${!product.available ? 'opacity-30 cursor-not-allowed' : ''}`}
        >
          {isSelected ? (
            <div className="bg-rojo text-white rounded-lg p-0.5"><CheckSquare size={24} /></div>
          ) : (
            <div className="text-gray-200 border-2 border-gray-100 rounded-lg"><Square size={20} /></div>
          )}
        </button>
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
          product.available ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700 border border-yellow-100'
        }`}>
          {product.stockLabel}
        </span>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="w-20 h-24 bg-gray-50 rounded-2xl p-2 flex items-center justify-center shrink-0">
          <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
        </div>
        <div className="flex-1">
          <div className="text-[10px] font-black uppercase text-gris tracking-widest truncate">{product.category}</div>
          <h4 className="text-sm font-black text-texto leading-tight mb-1 line-clamp-2">{product.name}</h4>
          <p className="text-xs font-bold text-gris mb-2">{product.specs}</p>
          <div className="text-lg font-black text-rojo-oscuro">{formatCOP(product.lastPrice)}</div>
          <div className="text-[10px] font-black text-gris uppercase tracking-wider">Último precio pagado</div>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="text-[10px] font-black uppercase text-gris tracking-widest">Cantidad</div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => onUpdateQuantity(-1)}
              disabled={!product.available}
              className="w-8 h-8 rounded-lg border border-borde flex items-center justify-center text-gris hover:border-rojo hover:text-rojo disabled:opacity-30 disabled:hover:border-borde disabled:hover:text-gris transition-colors cursor-pointer"
            >
              <Minus size={14} />
            </button>
            <div className="w-10 text-center font-black text-texto">{quantity}</div>
            <button 
              onClick={() => onUpdateQuantity(1)}
              disabled={!product.available}
              className="w-8 h-8 rounded-lg border border-borde flex items-center justify-center text-gris hover:border-rojo hover:text-rojo disabled:opacity-30 disabled:hover:border-borde disabled:hover:text-gris transition-colors cursor-pointer"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {product.available ? (
          <button 
            onClick={onAddToCart}
            className="w-full py-3 bg-texto text-white rounded-xl font-black text-xs hover:bg-rojo transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShoppingCart size={16} /> Agregar al carrito
          </button>
        ) : (
          <button 
            onClick={onConsultAdvisor}
            className="w-full py-3 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-xl font-black text-xs hover:bg-white transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Info size={16} /> Consultar con asesor
          </button>
        )}
      </div>
    </div>
  );
}
