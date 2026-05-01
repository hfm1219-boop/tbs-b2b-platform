import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Search, 
  Zap, 
  ChevronRight, 
  Clock, 
  MapPin, 
  Phone, 
  User as UserIcon, 
  Package, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  X,
  Truck,
  Plus,
  Minus,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { User, UrgentProduct, UrgentReason, UrgentOrderRequest } from '../types';

interface UrgentOrderPageProps {
  currentUser: User | null;
  onBackToAccount: () => void;
  onGoHome: () => void;
  onGoTracking: () => void;
  onGoCatalog: () => void;
  onGoAdvisorChat: (topic?: any, context?: any) => void;
  onCreateNotification?: (notification: any) => void;
}

const formatCOP = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value).replace('COP', '$');
};

const URGENT_PRODUCTS_DATA: UrgentProduct[] = [
  {
    id: "up-001",
    productId: 1,
    name: "Whisky Premium 750 ml",
    category: "Whisky",
    specs: "Botella individual",
    image: "https://images.unsplash.com/photo-1527045980461-84bc131f13b6?q=80&w=200&auto=format&fit=crop",
    estimatedPrice: 95000,
    availableForUrgent: true,
    stockLabel: "Disponible para urgente",
    suggestedQuantity: 6
  },
  {
    id: "up-002",
    productId: 2,
    name: "Ron Añejo 750 ml",
    category: "Ron",
    specs: "Botella individual",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=200&auto=format&fit=crop",
    estimatedPrice: 62000,
    availableForUrgent: true,
    stockLabel: "Disponible para urgente",
    suggestedQuantity: 6
  },
  {
    id: "up-003",
    productId: 4,
    name: "Vodka Premium 750 ml",
    category: "Vodka",
    specs: "Botella individual",
    image: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=200&auto=format&fit=crop",
    estimatedPrice: 61000,
    availableForUrgent: true,
    stockLabel: "Disponible para urgente",
    suggestedQuantity: 6
  },
  {
    id: "up-004",
    productId: 5,
    name: "Tequila Reposado 750 ml",
    category: "Tequila",
    specs: "Botella individual",
    image: "https://images.unsplash.com/photo-1610450507204-1f19616d2460?q=80&w=200&auto=format&fit=crop",
    estimatedPrice: 74000,
    availableForUrgent: true,
    stockLabel: "Disponible para urgente",
    suggestedQuantity: 4
  },
  {
    id: "up-005",
    productId: 6,
    name: "Aguardiente 750 ml",
    category: "Aguardiente",
    specs: "Botella individual",
    image: "https://images.unsplash.com/photo-1544145945-f904253db0ad?q=80&w=200&auto=format&fit=crop",
    estimatedPrice: 38000,
    availableForUrgent: false,
    stockLabel: "Validar disponibilidad",
    suggestedQuantity: 12
  },
  {
    id: "up-006",
    productId: 9,
    name: "Gin Premium Botánico 750 ml",
    category: "Ginebra",
    specs: "Botella individual",
    image: "https://images.unsplash.com/photo-1551538597-15828bb41103?q=80&w=200&auto=format&fit=crop",
    estimatedPrice: 88000,
    availableForUrgent: true,
    stockLabel: "Disponible para urgente",
    suggestedQuantity: 3
  }
];

const REASONS: { id: UrgentReason; label: string; icon: any }[] = [
  { id: 'ruptura_inventario', label: 'Ruptura de inventario', icon: AlertTriangle },
  { id: 'evento', label: 'Evento', icon: CheckCircle2 },
  { id: 'alta_demanda', label: 'Alta demanda', icon: Zap },
  { id: 'cliente_vip', label: 'Cliente VIP', icon: UserIcon },
  { id: 'reposición_fin_semana', label: 'Reposición fin de semana', icon: Clock },
  { id: 'otro', label: 'Otro', icon: MessageSquare },
];

const DELIVERY_WINDOWS = [
  { id: 'asap', label: 'Lo antes posible', fee: 35000 },
  { id: 'next_2_4', label: 'Próximas 2 a 4 horas', fee: 35000 },
  { id: 'today_afternoon', label: 'Hoy en la tarde', fee: 20000 },
  { id: 'today_night', label: 'Hoy en la noche', fee: 20000 },
  { id: 'tomorrow_morning', label: 'Mañana temprano', fee: 20000 },
];

const CITIES = ['Cartagena', 'Barranquilla', 'Santa Marta', 'Montería', 'Sincelejo', 'Valledupar', 'Otra ciudad'];

export function UrgentOrderPage({ 
  currentUser, 
  onBackToAccount, 
  onGoHome, 
  onGoTracking,
  onGoCatalog,
  onGoAdvisorChat,
  onCreateNotification
}: UrgentOrderPageProps) {
  // Form State
  const [reason, setReason] = useState<UrgentReason | null>(null);
  const city = currentUser?.city || 'Cartagena';
  const address = currentUser?.address || 'Dirección registrada en contrato B2B';
  const [deliveryWindow, setDeliveryWindow] = useState('asap');
  const [contactName, setContactName] = useState(currentUser?.name || '');
  const [contactPhone, setContactPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    const q: Record<string, number> = {};
    URGENT_PRODUCTS_DATA.forEach(p => {
      q[p.id] = p.suggestedQuantity;
    });
    return q;
  });
  const [selectedProducts, setSelectedProducts] = useState<Record<string, { product: UrgentProduct; quantity: number }>>({});
  
  // UI State
  const [showConfirmModal, setShowConfirmModal] = useState<UrgentOrderRequest | null>(null);
  const [showAdvisorModal, setShowAdvisorModal] = useState<UrgentProduct | null>(null);

  // Derived Values
  const filteredProducts = useMemo(() => {
    return URGENT_PRODUCTS_DATA.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                             p.category.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === 'Todos' || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(URGENT_PRODUCTS_DATA.map(p => p.category)));
    return ['Todos', ...cats];
  }, []);

  const logisticFee = useMemo(() => {
    const window = DELIVERY_WINDOWS.find(w => w.label === deliveryWindow) || DELIVERY_WINDOWS.find(w => w.id === deliveryWindow);
    return window?.fee || 20000;
  }, [deliveryWindow]);

  const totals = useMemo(() => {
    const productsArray = Object.values(selectedProducts) as { product: UrgentProduct; quantity: number }[];
    const subtotal = productsArray.reduce((sum, item) => sum + (item.product.estimatedPrice * item.quantity), 0);
    const units = productsArray.reduce((sum, item) => sum + item.quantity, 0);
    return { subtotal, units, total: subtotal + logisticFee };
  }, [selectedProducts, logisticFee]);

  const isFormValid = useMemo(() => {
    return (
      reason !== null &&
      contactName.length > 3 &&
      contactPhone.length >= 7 &&
      Object.keys(selectedProducts).length > 0
    );
  }, [reason, contactName, contactPhone, selectedProducts]);

  // Handlers
  const handleToggleProduct = (product: UrgentProduct) => {
    if (selectedProducts[product.id]) {
      const newSelected = { ...selectedProducts };
      delete newSelected[product.id];
      setSelectedProducts(newSelected);
    } else {
      setSelectedProducts({
        ...selectedProducts,
        [product.id]: { product, quantity: quantities[product.id] || product.suggestedQuantity }
      });
    }
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    const newQty = Math.max(1, (quantities[id] || 1) + delta);
    setQuantities(prev => ({ ...prev, [id]: newQty }));
    
    if (selectedProducts[id]) {
      setSelectedProducts(prev => ({
        ...prev,
        [id]: { ...prev[id], quantity: newQty }
      }));
    }
  };

  const handleSubmit = () => {
    if (!isFormValid) return;

    const request: UrgentOrderRequest = {
      id: `URG-${Math.floor(1000 + Math.random() * 9000)}`,
      reason: reason!,
      city,
      address,
      deliveryWindow: DELIVERY_WINDOWS.find(w => w.id === deliveryWindow)?.label || deliveryWindow,
      contactName,
      contactPhone,
      notes,
      products: (Object.values(selectedProducts) as { product: UrgentProduct; quantity: number }[]).map(item => ({ product: item.product, quantity: item.quantity })),
      estimatedTotal: totals.total,
      status: 'en_validacion'
    };

    setShowConfirmModal(request);

    // Notify internal if enabled
    if (onCreateNotification) {
      onCreateNotification({
        id: `notif-urgent-${Date.now()}`,
        type: 'pedido_urgente',
        title: "Solicitud urgente recibida",
        message: "Tu solicitud urgente está en validación logística.",
        read: false,
        priority: 'alta',
        actionTarget: 'ordersTracking',
        context: {
          label: "Id Solicitud",
          value: request.id,
          entityType: 'solicitud_urgente'
        }
      });
    }
  };

  const resetForm = () => {
    setReason(null);
    setDeliveryWindow('asap');
    setContactPhone('');
    setNotes('');
    setSelectedProducts({});
    setShowConfirmModal(null);
  };

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
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-texto">Pedido urgente</h1>
                <span className="bg-rojo text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">Servicio Premium</span>
              </div>
              <p className="text-gris font-medium text-lg leading-relaxed max-w-2xl">
                Solicita abastecimiento para operación inmediata. El servicio está sujeto a ciudad, inventario, horario y ventana logística.
              </p>
            </div>
            <div className="bg-gray-50 px-6 py-4 rounded-2xl border border-borde">
              <div className="text-[10px] font-black uppercase tracking-widest text-rojo mb-1">Operación B2B</div>
              <div className="text-lg font-black text-texto">{currentUser?.businessName || 'Cargando...'}</div>
              <div className="text-xs font-extrabold text-gris mt-1 uppercase tracking-tight">{currentUser?.city}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1480px] mx-auto px-8 mt-10">
        {/* Warning Card */}
        <div className="bg-texto text-white rounded-3xl p-8 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <Zap size={140} />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
              <Info size={32} className="text-rojo" />
            </div>
            <div>
              <h2 className="text-2xl font-black mb-2 tracking-tight">Antes de enviar un pedido urgente</h2>
              <p className="text-white/70 font-medium mb-4 max-w-3xl">Un asesor TBS validará disponibilidad, ruta, horario, condiciones comerciales y tarifa logística antes de confirmar la entrega.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-bold">
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                  <CheckCircle2 size={14} className="text-rojo" /> Operación activa por ciudad
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                  <CheckCircle2 size={14} className="text-rojo" /> Tarifa logística adicional
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                  <CheckCircle2 size={14} className="text-rojo" /> No reemplaza el programado
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                  <CheckCircle2 size={14} className="text-rojo" /> Sujeto a capacidad de ruta
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <UrgentStatCard title="Ciudad actual" value={city} icon={MapPin} />
          <UrgentStatCard title="Ventanas disponibles" value="3" icon={Clock} color="text-rojo" />
          <UrgentStatCard title="Abastecimiento urgente" value={URGENT_PRODUCTS_DATA.filter(p => p.availableForUrgent).length.toString()} icon={Zap} color="text-yellow-600" />
          <UrgentStatCard title="Tiempo estimado" value="2 a 5 horas" icon={Truck} color="text-blue-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Section 1: Reason */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-texto text-white flex items-center justify-center font-black text-xs">1</div>
                <h3 className="text-xl font-black text-texto uppercase tracking-tight">Motivo de urgencia</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {REASONS.map((r) => {
                  const Icon = r.icon;
                  const isSelected = reason === r.id;
                  return (
                    <button
                      key={r.id}
                      onClick={() => setReason(r.id)}
                      className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-3 cursor-pointer ${
                        isSelected 
                          ? 'border-rojo bg-rojo/5' 
                          : 'border-borde bg-white hover:border-rojo/30'
                      }`}
                    >
                      <div className={`${isSelected ? 'text-rojo' : 'text-gris'} transition-colors`}>
                        <Icon size={28} />
                      </div>
                      <span className={`text-xs font-black uppercase tracking-wider leading-tight ${isSelected ? 'text-rojo' : 'text-gris'}`}>
                        {r.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Section 2: Delivery */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-texto text-white flex items-center justify-center font-black text-xs">2</div>
                <h3 className="text-xl font-black text-texto uppercase tracking-tight">Datos de entrega</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 rounded-3xl border border-borde tbs-shadow">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gris">Ciudad de urgencia</label>
                  <div className="w-full h-12 bg-gray-100 border border-borde rounded-xl px-4 flex items-center gap-2">
                    <MapPin size={16} className="text-gris/40" />
                    <span className="font-black text-texto opacity-60">{city}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gris">Dirección de entrega</label>
                  <div className="w-full h-12 bg-gray-100 border border-borde rounded-xl px-4 flex items-center gap-2">
                    <MapPin size={16} className="text-gris/40" />
                    <span className="font-black text-texto opacity-60 truncate">{address}</span>
                  </div>
                </div>
                <div className="md:col-span-2 py-2 px-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-3">
                  <Info size={14} className="text-blue-600" />
                  <span className="text-[10px] font-bold text-blue-700">Los datos de entrega están vinculados a tu cuenta B2B y no pueden ser modificados para pedidos urgentes.</span>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gris">Ventana de entrega</label>
                  <select 
                    value={deliveryWindow}
                    onChange={(e) => setDeliveryWindow(e.target.value)}
                    className="w-full h-12 bg-gray-50 border border-borde rounded-xl px-4 font-black text-texto outline-none focus:border-rojo appearance-none"
                  >
                    {DELIVERY_WINDOWS.map(w => <option key={w.id} value={w.id}>{w.label}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gris">Persona de contacto</label>
                  <input 
                    type="text" 
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Nombre completo"
                    className="w-full h-12 bg-gray-50 border border-borde rounded-xl px-4 font-black text-texto outline-none focus:border-rojo"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gris">Celular de contacto</label>
                  <input 
                    type="tel" 
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="Ej: 317 123 4567"
                    className="w-full h-12 bg-gray-50 border border-borde rounded-xl px-4 font-black text-texto outline-none focus:border-rojo"
                  />
                </div>
              </div>
            </section>

            {/* Section 3: Products */}
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-texto text-white flex items-center justify-center font-black text-xs">3</div>
                  <h3 className="text-xl font-black text-texto uppercase tracking-tight">Productos urgentes</h3>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-borde tbs-shadow space-y-6">
                {/* Search & Categories */}
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gris" size={20} />
                    <input 
                      type="text" 
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Buscar producto urgente por nombre o categoría"
                      className="w-full h-12 bg-gray-50 border border-borde rounded-xl pl-12 pr-6 font-semibold outline-none focus:border-rojo transition-colors"
                    />
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap cursor-pointer ${
                          activeCategory === cat ? 'bg-rojo text-white' : 'bg-gray-50 text-gris hover:bg-gray-100'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredProducts.map(p => (
                    <UrgentProductCard 
                      key={p.id}
                      product={p}
                      isSelected={!!selectedProducts[p.id]}
                      onToggle={() => handleToggleProduct(p)}
                      quantity={quantities[p.id] || p.suggestedQuantity}
                      onUpdateQuantity={(delta) => handleUpdateQuantity(p.id, delta)}
                      onConsultAdvisor={() => setShowAdvisorModal(p)}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Section 4: Notes */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-texto text-white flex items-center justify-center font-black text-xs">4</div>
                <h3 className="text-xl font-black text-texto uppercase tracking-tight">Observaciones operativas</h3>
              </div>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej: pedido para evento esta noche, entregar por recepción, llamar antes de llegar, acceso por parqueadero, productos sustitutos permitidos, etc."
                className="w-full h-32 bg-white border border-borde rounded-3xl p-6 font-semibold text-texto outline-none focus:border-rojo resize-none tbs-shadow"
              />
            </section>
          </div>

          {/* Lateral Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[32px] border border-borde tbs-shadow p-8 sticky top-24">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-rojo text-white rounded-xl flex items-center justify-center shadow-lg shadow-rojo/20">
                  <Zap size={20} />
                </div>
                <h4 className="text-xl font-black text-texto tracking-tight leading-none">Solicitud urgente</h4>
              </div>

              <div className="space-y-6 mb-8">
                {Object.keys(selectedProducts).length > 0 ? (
                  <div className="max-h-[300px] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                    {(Object.values(selectedProducts) as { product: UrgentProduct; quantity: number }[]).map((item) => (
                      <div key={item.product.id} className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="text-xs font-black text-texto line-clamp-1">{item.product.name}</div>
                          <div className="text-[10px] font-bold text-gris uppercase tracking-wider">{item.quantity} x {item.product.specs}</div>
                        </div>
                        <div className="text-sm font-black text-texto shrink-0">{formatCOP(item.product.estimatedPrice * item.quantity)}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-10 text-center border-2 border-dashed border-borde rounded-2xl bg-gray-50">
                    <Package className="mx-auto mb-3 text-gris opacity-30" size={32} />
                    <p className="text-xs font-black text-gris uppercase tracking-widest px-4">Selecciona productos urgentes para continuar</p>
                  </div>
                )}
              </div>

              <div className="space-y-4 pt-6 border-t border-gray-100">
                <div className="flex justify-between items-center text-xs font-black text-gris uppercase tracking-widest">
                  <span>Productos</span>
                  <span className="text-texto">{totals.units} unidades</span>
                </div>
                <div className="flex justify-between items-center text-xs font-black text-gris uppercase tracking-widest">
                  <span>Subtotal estimado</span>
                  <span className="text-texto">{formatCOP(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-black text-rojo uppercase tracking-widest">
                  <span>Tarifa logística</span>
                  <span>{formatCOP(logisticFee)}</span>
                </div>
                <div className="pt-4 flex justify-between items-end">
                  <div className="text-[10px] font-black uppercase text-gris tracking-widest leading-none mb-1">Total Proyecto</div>
                  <div className="text-3xl font-black text-texto tracking-tighter leading-none">{formatCOP(totals.total)}</div>
                </div>
              </div>

              <div className="mt-8 bg-yellow-50 border border-yellow-100 rounded-2xl p-4 flex gap-3">
                <Info size={16} className="text-yellow-600 shrink-0 mt-0.5" />
                <p className="text-[10px] font-bold text-yellow-800 leading-normal">
                  El total y la tarifa pueden cambiar después de validación logística y comercial por parte de TBS.
                </p>
              </div>

              <button 
                onClick={handleSubmit}
                disabled={!isFormValid}
                className="w-full mt-8 py-5 bg-texto text-white rounded-2xl font-black hover:bg-rojo transition-all disabled:opacity-30 disabled:cursor-not-allowed tbs-shadow flex items-center justify-center gap-3 cursor-pointer group"
              >
                <div className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                  <Zap size={20} className="text-rojo" />
                </div>
                Enviar solicitud urgente
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={resetForm} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative bg-white rounded-[40px] max-w-2xl w-full tbs-shadow border-4 border-white overflow-hidden">
              <div className="p-10 text-center">
                <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-3xl font-black text-texto mb-2 tracking-tight">Solicitud urgente recibida</h3>
                <p className="text-gris font-medium text-lg leading-snug mb-8">
                  El equipo TBS validará inventario, ruta y condiciones comerciales para confirmar la entrega.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 rounded-[32px] p-8 text-left mb-8">
                  <div className="space-y-4">
                    <div>
                      <div className="text-[10px] font-black uppercase text-gris tracking-widest mb-1">Número de solicitud</div>
                      <div className="text-lg font-black text-rojo">{showConfirmModal.id}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase text-gris tracking-widest mb-1">Motivo</div>
                      <div className="text-sm font-black text-texto uppercase">{REASONS.find(r => r.id === showConfirmModal.reason)?.label}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase text-gris tracking-widest mb-1">Ciudad y dirección</div>
                      <div className="text-sm font-black text-texto leading-snug">{showConfirmModal.city}, {showConfirmModal.address}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase text-gris tracking-widest mb-1">Ventana de entrega</div>
                      <div className="text-sm font-black text-texto">{showConfirmModal.deliveryWindow}</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="text-[10px] font-black uppercase text-gris tracking-widest mb-1">Contacto</div>
                      <div className="text-sm font-black text-texto">{showConfirmModal.contactName}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase text-gris tracking-widest mb-1">Celular</div>
                      <div className="text-sm font-black text-texto">{showConfirmModal.contactPhone}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase text-gris tracking-widest mb-1">Resumen selección</div>
                      <div className="text-sm font-black text-texto">{showConfirmModal.products.length} productos ({showConfirmModal.products.reduce((s,i) => s+i.quantity, 0)} uds)</div>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                      <div className="flex justify-between items-end">
                        <div className="text-[10px] font-black uppercase text-gris tracking-widest">Estado</div>
                        <span className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-[10px] font-black uppercase border border-yellow-100">En validación</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={onBackToAccount}
                    className="flex-1 py-4 border-2 border-borde text-gris rounded-xl font-black hover:border-rojo/30 hover:text-rojo transition-all cursor-pointer"
                  >
                    Volver a mi cuenta
                  </button>
                  <button 
                    onClick={resetForm}
                    className="flex-1 py-4 bg-gray-100 text-texto rounded-xl font-black hover:bg-gray-200 transition-all cursor-pointer"
                  >
                    Hacer otra solicitud
                  </button>
                  <button 
                    onClick={() => {
                      onGoTracking();
                      setShowConfirmModal(null);
                    }}
                    className="flex-1 py-4 bg-texto text-white rounded-xl font-black hover:bg-rojo transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Truck size={18} /> Ver seguimiento
                  </button>
                </div>
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
                <div className="w-16 h-16 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle size={32} />
                </div>
                <h3 className="text-2xl font-black text-texto mb-1 leading-tight">Consultar disponibilidad urgente</h3>
                <p className="text-sm font-medium text-gris mb-8 leading-relaxed">
                  Tu asesor TBS puede validar inventario, sustitutos o próxima disponibilidad para este producto.
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
                    <div className="text-[10px] font-black uppercase text-gris tracking-widest mb-1">Asesor asignado</div>
                    <div className="text-sm font-black text-texto">Laura Gómez</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase text-gris tracking-widest mb-1">WhatsApp de urgencias</div>
                    <div className="text-sm font-black text-texto">317 123 4567</div>
                  </div>
                </div>

                <div className="bg-white border border-borde rounded-xl p-4 mb-8 text-left italic text-xs text-gris">
                  "Hola, necesito validar disponibilidad urgente de {showAdvisorModal.name}."
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

function UrgentStatCard({ title, value, icon: Icon, color = 'text-texto' }: { title: string, value: string, icon: any, color?: string }) {
  return (
    <div className="bg-white p-6 rounded-[24px] border border-borde tbs-shadow flex items-start gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color.replace('text-', 'bg-').replace('600', '100')} ${color}`}>
        <Icon size={24} />
      </div>
      <div>
        <h3 className="text-[10px] font-black text-gris uppercase tracking-widest mb-1">{title}</h3>
        <p className={`text-xl font-black ${color} tracking-tight`}>{value}</p>
      </div>
    </div>
  );
}

function UrgentProductCard({ 
  product, 
  isSelected, 
  onToggle, 
  quantity, 
  onUpdateQuantity,
  onConsultAdvisor 
}: { 
  key?: any;
  product: UrgentProduct; 
  isSelected: boolean; 
  onToggle: () => void;
  quantity: number;
  onUpdateQuantity: (delta: number) => void;
  onConsultAdvisor: () => void;
}) {
  return (
    <div className={`bg-gray-50 rounded-2xl border transition-all p-4 relative flex flex-col ${isSelected ? 'border-rojo bg-rojo/5 shadow-lg shadow-rojo/5' : 'border-borde hover:border-rojo/20'}`}>
      <div className="flex gap-4 mb-4">
        <div className="w-16 h-20 bg-white rounded-xl p-2 flex items-center justify-center shrink-0 border border-borde">
          <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
        </div>
        <div className="flex-1">
          <div className="text-[9px] font-black uppercase text-gris tracking-widest mb-0.5">{product.category}</div>
          <h4 className="text-xs font-black text-texto leading-tight mb-1 line-clamp-2">{product.name}</h4>
          <div className="text-sm font-black text-rojo-oscuro">{formatCOP(product.estimatedPrice)}</div>
          <span className={`inline-block px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider mt-2 ${
            product.availableForUrgent ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
          }`}>
            {product.stockLabel}
          </span>
        </div>
      </div>

      {product.availableForUrgent ? (
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-borde/50">
          <div className="flex items-center gap-1">
            <button 
              onClick={() => onUpdateQuantity(-1)}
              className="w-8 h-8 rounded-lg border border-borde flex items-center justify-center text-gris hover:border-rojo hover:text-rojo transition-colors cursor-pointer"
            >
              <Minus size={14} />
            </button>
            <div className="w-10 text-center text-xs font-black text-texto">{quantity}</div>
            <button 
              onClick={() => onUpdateQuantity(1)}
              className="w-8 h-8 rounded-lg border border-borde flex items-center justify-center text-gris hover:border-rojo hover:text-rojo transition-colors cursor-pointer"
            >
              <Plus size={14} />
            </button>
          </div>
          <button 
            onClick={onToggle}
            className={`flex-1 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
              isSelected 
                ? 'bg-rojo text-white shadow-lg shadow-rojo/20' 
                : 'bg-white border-2 border-borde text-gris hover:border-rojo hover:text-rojo'
            }`}
          >
            {isSelected ? 'Agregado' : 'Agregar'}
          </button>
        </div>
      ) : (
        <div className="pt-4 border-t border-borde/50">
          <button 
            onClick={onConsultAdvisor}
            className="w-full py-2.5 bg-white border border-yellow-200 rounded-xl font-black text-[10px] text-yellow-700 uppercase tracking-widest hover:bg-yellow-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Info size={12} /> Consultar disponibilidad
          </button>
        </div>
      )}
    </div>
  );
}
