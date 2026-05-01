import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Search, 
  Package, 
  Truck, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ChevronRight, 
  Info, 
  X, 
  Phone,
  MessageSquare,
  RefreshCw,
  MapPin,
  Calendar,
  Layers,
  History
} from 'lucide-react';
import { User, CustomerOrder, OrderStatus, OrderProduct } from '../types';

interface OrdersTrackingPageProps {
  currentUser: User | null;
  onBackToAccount: () => void;
  onGoHome: () => void;
  onGoCatalog: () => void;
  onAddItemsToCart?: (items: { product: any, quantity: number }[]) => void;
  onOpenCart?: () => void;
  onGoReorder?: () => void;
  onGoAdvisorChat?: (topic?: any, context?: any) => void;
  highlightedOrderId?: string | null;
  onClearHighlight?: () => void;
}

const formatCOP = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value).replace('COP', '$');
};

const DUMMY_ORDERS: CustomerOrder[] = [
  {
    id: "ord-001",
    number: "TBS-10245",
    date: "2026-05-01",
    status: "en_transito",
    total: 1850000,
    units: 24,
    deliveryCity: "Cartagena",
    deliveryAddress: "Bocagrande, Carrera 3 #8-45",
    deliveryWindow: "Hoy, 2:00 p.m. - 5:00 p.m.",
    estimatedDelivery: "2026-05-01",
    paymentMethod: "Crédito B2B",
    advisorName: "Laura Gómez",
    advisorPhone: "317 123 4567",
    transporter: "Operación propia TBS",
    trackingCode: "TRK-10245",
    products: [
      {
        id: "p-001",
        name: "Whisky Premium 750 ml",
        category: "Whisky",
        quantity: 12,
        unitPrice: 95000,
        image: "https://images.unsplash.com/photo-1527045980461-84bc131f13b6?q=80&w=200&auto=format&fit=crop"
      },
      {
        id: "p-002",
        name: "Ron Añejo 750 ml",
        category: "Ron",
        quantity: 8,
        unitPrice: 62000,
        image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=200&auto=format&fit=crop"
      },
      {
        id: "p-003",
        name: "Ginebra London Dry 750 ml",
        category: "Ginebra",
        quantity: 4,
        unitPrice: 54000,
        image: "https://images.unsplash.com/photo-1551538597-15828bb41103?q=80&w=200&auto=format&fit=crop"
      }
    ],
    timeline: [
      {
        id: "t-001",
        title: "Pedido recibido",
        description: "Tu pedido fue registrado en la plataforma TBS.",
        date: "2026-05-01",
        time: "8:15 a.m.",
        completed: true
      },
      {
        id: "t-002",
        title: "Validación comercial",
        description: "Se validaron condiciones comerciales, cupo y disponibilidad.",
        date: "2026-05-01",
        time: "8:42 a.m.",
        completed: true
      },
      {
        id: "t-003",
        title: "Preparación en bodega",
        description: "El pedido fue preparado para despacho.",
        date: "2026-05-01",
        time: "10:20 a.m.",
        completed: true
      },
      {
        id: "t-004",
        title: "En tránsito",
        description: "El pedido salió a ruta con operación propia TBS.",
        date: "2026-05-01",
        time: "1:10 p.m.",
        completed: true
      },
      {
        id: "t-005",
        title: "Entrega final",
        description: "Entrega pendiente dentro de la ventana programada.",
        date: "2026-05-01",
        time: "2:00 p.m. - 5:00 p.m.",
        completed: false
      }
    ],
    issues: []
  },
  {
    id: "ord-002",
    number: "TBS-10231",
    date: "2026-04-28",
    status: "entregado",
    total: 2430000,
    units: 36,
    deliveryCity: "Cartagena",
    deliveryAddress: "Centro Histórico, Calle del Arsenal #10-20",
    deliveryWindow: "Entregado",
    estimatedDelivery: "2026-04-28",
    paymentMethod: "PSE",
    advisorName: "Laura Gómez",
    advisorPhone: "317 123 4567",
    transporter: "Operación propia TBS",
    trackingCode: "TRK-10231",
    products: [
      {
        id: "p-004",
        name: "Vodka Premium 750 ml",
        category: "Vodka",
        quantity: 18,
        unitPrice: 61000,
        image: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=200&auto=format&fit=crop"
      },
      {
        id: "p-005",
        name: "Tequila Reposado 750 ml",
        category: "Tequila",
        quantity: 18,
        unitPrice: 74000,
        image: "https://images.unsplash.com/photo-1610450507204-1f19616d2460?q=80&w=200&auto=format&fit=crop"
      }
    ],
    timeline: [
      {
        id: "t-006",
        title: "Pedido recibido",
        description: "Pedido registrado correctamente.",
        date: "2026-04-28",
        time: "9:05 a.m.",
        completed: true
      },
      {
        id: "t-007",
        title: "Validación comercial",
        description: "Pedido aprobado.",
        date: "2026-04-28",
        time: "9:30 a.m.",
        completed: true
      },
      {
        id: "t-008",
        title: "Preparación en bodega",
        description: "Pedido preparado para entrega.",
        date: "2026-04-28",
        time: "11:00 a.m.",
        completed: true
      },
      {
        id: "t-009",
        title: "En tránsito",
        description: "Pedido enviado a ruta.",
        date: "2026-04-28",
        time: "1:30 p.m.",
        completed: true
      },
      {
        id: "t-010",
        title: "Entregado",
        description: "Pedido entregado satisfactoriamente.",
        date: "2026-04-28",
        time: "3:45 p.m.",
        completed: true
      }
    ],
    issues: []
  },
  {
    id: "ord-003",
    number: "TBS-10218",
    date: "2026-04-24",
    status: "en_validacion",
    total: 980000,
    units: 12,
    deliveryCity: "Cartagena",
    deliveryAddress: "Manga, Avenida Jiménez #22-11",
    deliveryWindow: "Pendiente de confirmación",
    estimatedDelivery: "2026-04-25",
    paymentMethod: "Crédito B2B",
    advisorName: "Laura Gómez",
    advisorPhone: "317 123 4567",
    transporter: "Pendiente",
    trackingCode: "TRK-10218",
    products: [
      {
        id: "p-006",
        name: "Aguardiente 750 ml",
        category: "Aguardiente",
        quantity: 12,
        unitPrice: 81666,
        image: "https://images.unsplash.com/photo-1544145945-f904253db0ad?q=80&w=200&auto=format&fit=crop"
      }
    ],
    timeline: [
      {
        id: "t-011",
        title: "Pedido recibido",
        description: "Pedido registrado en la plataforma.",
        date: "2026-04-24",
        time: "4:15 p.m.",
        completed: true
      },
      {
        id: "t-012",
        title: "Validación comercial",
        description: "Pedido en revisión por condiciones comerciales y disponibilidad.",
        date: "2026-04-24",
        time: "4:30 p.m.",
        completed: false
      },
      {
        id: "t-013",
        title: "Preparación en bodega",
        description: "Pendiente de aprobación.",
        date: "Pendiente",
        time: "Pendiente",
        completed: false
      }
    ],
    issues: []
  },
  {
    id: "ord-004",
    number: "TBS-10198",
    date: "2026-04-20",
    status: "novedad",
    total: 1640000,
    units: 20,
    deliveryCity: "Cartagena",
    deliveryAddress: "Getsemaní, Calle Larga #9-30",
    deliveryWindow: "Reprogramar entrega",
    estimatedDelivery: "2026-04-21",
    paymentMethod: "PSE",
    advisorName: "Laura Gómez",
    advisorPhone: "317 123 4567",
    transporter: "Aliado logístico",
    trackingCode: "TRK-10198",
    products: [
      {
        id: "p-007",
        name: "Vino Tinto Reserva 750 ml",
        category: "Vinos",
        quantity: 20,
        unitPrice: 82000,
        image: "https://images.unsplash.com/photo-1553390882-026330441a1c?q=80&w=200&auto=format&fit=crop"
      }
    ],
    timeline: [
      {
        id: "t-014",
        title: "Pedido recibido",
        description: "Pedido registrado correctamente.",
        date: "2026-04-20",
        time: "10:10 a.m.",
        completed: true
      },
      {
        id: "t-015",
        title: "Preparación en bodega",
        description: "Pedido preparado.",
        date: "2026-04-20",
        time: "12:30 p.m.",
        completed: true
      },
      {
        id: "t-016",
        title: "Novedad logística",
        description: "No fue posible realizar la entrega por ausencia de receptor.",
        date: "2026-04-20",
        time: "4:20 p.m.",
        completed: true
      }
    ],
    issues: [
      {
        id: "iss-001",
        type: "Cliente ausente",
        description: "El transportador reportó ausencia de receptor autorizado en el punto de entrega.",
        date: "2026-04-20",
        status: "abierta"
      }
    ]
  }
];

export function OrdersTrackingPage({ 
  currentUser, 
  onBackToAccount, 
  onGoHome, 
  onGoCatalog,
  onAddItemsToCart,
  onOpenCart,
  onGoReorder,
  onGoAdvisorChat,
  highlightedOrderId,
  onClearHighlight
}: OrdersTrackingPageProps) {
  const [filter, setFilter] = useState<OrderStatus | 'todos'>('todos');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null);
  const [showReorderConfirm, setShowReorderConfirm] = useState(false);
  const [showAdvisorModal, setShowAdvisorModal] = useState<CustomerOrder | null>(null);

  const filteredOrders = useMemo(() => {
    return DUMMY_ORDERS.filter(order => {
      const matchesFilter = filter === 'todos' || order.status === filter;
      const matchesSearch = order.number.toLowerCase().includes(search.toLowerCase()) || 
                           (order.trackingCode && order.trackingCode.toLowerCase().includes(search.toLowerCase()));
      return matchesFilter && matchesSearch;
    });
  }, [filter, search]);

  const stats = useMemo(() => {
    const active = DUMMY_ORDERS.filter(o => o.status !== 'entregado' && o.status !== 'cancelado').length;
    const inTransit = DUMMY_ORDERS.filter(o => o.status === 'en_transito').length;
    const withIssue = DUMMY_ORDERS.filter(o => o.status === 'novedad').length;
    const delivered = DUMMY_ORDERS.filter(o => o.status === 'entregado').length;
    return { active, inTransit, withIssue, delivered };
  }, []);

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case 'en_validacion': return 'En validación';
      case 'aprobado': return 'Aprobado';
      case 'preparando': return 'Preparando';
      case 'en_transito': return 'En tránsito';
      case 'entregado': return 'Entregado';
      case 'novedad': return 'Con novedad';
      case 'cancelado': return 'Cancelado';
      default: return status;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'en_validacion': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'aprobado': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'preparando': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'en_transito': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'entregado': return 'bg-green-50 text-green-700 border-green-200';
      case 'novedad': return 'bg-red-50 text-red-700 border-red-200';
      case 'cancelado': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const handleReorder = (order: CustomerOrder) => {
    if (onGoReorder) {
      onGoReorder();
    } else if (onAddItemsToCart) {
      const cartItems = order.products.map(p => ({
        product: {
          id: parseInt(p.id.split('-')[1]) || 0,
          name: p.name,
          category: p.category,
          specs: "750ml",
          price: formatCOP(p.unitPrice),
          image: p.image || ""
        },
        quantity: p.quantity
      }));
      onAddItemsToCart(cartItems);
      if (onOpenCart) onOpenCart();
    } else {
      setShowReorderConfirm(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
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
              <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-texto mb-2">Seguimiento de pedidos</h1>
              <p className="text-gris font-medium text-lg leading-relaxed max-w-2xl">
                Consulta el estado de tus pedidos, entregas programadas, novedades y trazabilidad logística.
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
          <StatCard title="Pedidos activos" value={stats.active.toString()} icon={Package} />
          <StatCard title="En tránsito" value={stats.inTransit.toString()} icon={Truck} color="text-orange-600" />
          <StatCard title="Con novedad" value={stats.withIssue.toString()} icon={AlertCircle} color="text-red-600" />
          <StatCard title="Entregados" value={stats.delivered.toString()} icon={CheckCircle2} color="text-green-600" />
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="flex flex-nowrap overflow-x-auto gap-2 pb-2 lg:pb-0 scrollbar-hide">
            {(['todos', 'en_validacion', 'aprobado', 'preparando', 'en_transito', 'entregado', 'novedad', 'cancelado'] as const).map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  filter === status 
                    ? 'bg-texto text-white shadow-lg' 
                    : 'bg-white text-gris border border-borde hover:border-rojo/30 hover:text-rojo'
                }`}
              >
                {status === 'todos' ? 'Todos' : getStatusLabel(status)}
              </button>
            ))}
          </div>
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gris" size={20} />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por número de pedido o código de seguimiento"
              className="w-full h-12 bg-white border border-borde rounded-xl pl-12 pr-6 font-semibold outline-none focus:border-rojo transition-colors"
            />
          </div>
        </div>

        {/* Orders List */}
        <div className="grid grid-cols-1 gap-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map(order => (
              <OrderCard 
                key={order.id} 
                order={order} 
                onShowDetail={() => setSelectedOrder(order)}
                onReorder={() => handleReorder(order)}
                onContactAdvisor={() => {
                  if (onGoAdvisorChat) {
                    onGoAdvisorChat('pedido', { label: `Pedido ${order.number}`, type: 'pedido' });
                  } else {
                    setShowAdvisorModal(order);
                  }
                }}
                statusLabel={getStatusLabel(order.status)}
                statusColor={getStatusColor(order.status)}
                isHighlighted={highlightedOrderId === order.number}
              />
            ))
          ) : (
            <div className="bg-white rounded-3xl p-20 border border-dash border-borde text-center">
              <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package size={32} />
              </div>
              <h3 className="text-xl font-black text-texto mb-2">No encontramos resultados</h3>
              <p className="text-gris font-medium">Intenta con otros filtros o términos de búsqueda.</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
            <OrderDetailModal 
              order={selectedOrder} 
              onClose={() => setSelectedOrder(null)} 
              onReorder={() => handleReorder(selectedOrder)}
              onContactAdvisor={() => {
                if (onGoAdvisorChat) {
                  onGoAdvisorChat('pedido', { label: `Pedido ${selectedOrder.number}`, type: 'pedido' });
                  setSelectedOrder(null);
                } else {
                  setShowAdvisorModal(selectedOrder);
                  setSelectedOrder(null);
                }
              }}
              getStatusLabel={getStatusLabel}
              getStatusColor={getStatusColor}
            />
        )}
      </AnimatePresence>

      {/* Reorder Confirmation Modal (Fallback) */}
      <AnimatePresence>
        {showReorderConfirm && (
          <div className="fixed inset-0 z-[1500] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowReorderConfirm(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative bg-white p-8 rounded-[32px] max-w-sm w-full text-center tbs-shadow">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-2xl font-black text-texto mb-2">Pedido agregado</h3>
              <p className="text-gris font-medium mb-8">Los productos de este pedido fueron agregados al carrito para recompra.</p>
              <button 
                onClick={() => setShowReorderConfirm(false)}
                className="w-full py-4 bg-texto text-white rounded-xl font-black hover:bg-rojo transition-all cursor-pointer"
              >
                Continuar
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Advisor Modal */}
      <AnimatePresence>
        {showAdvisorModal && (
          <div className="fixed inset-0 z-[1500] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAdvisorModal(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative bg-white p-8 rounded-[32px] max-w-sm w-full tbs-shadow">
              <button onClick={() => setShowAdvisorModal(null)} className="absolute top-6 right-6 text-gris hover:text-texto transition-colors cursor-pointer">
                <X size={24} />
              </button>
              <div className="text-center">
                <div className="w-20 h-20 bg-rojo-suave text-rojo rounded-full flex items-center justify-center mx-auto mb-6">
                  <Phone size={32} />
                </div>
                <h3 className="text-2xl font-black text-texto mb-1">Contactar Asesor</h3>
                <p className="text-sm font-bold text-rojo uppercase tracking-widest mb-6">Soporte logístico TBS</p>
                
                <div className="bg-gray-50 rounded-2xl p-6 text-left space-y-4 mb-8">
                  <div>
                    <div className="text-[10px] font-black uppercase text-gris tracking-widest mb-1">Nombre del Asesor</div>
                    <div className="text-sm font-black text-texto">{showAdvisorModal.advisorName}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase text-gris tracking-widest mb-1">Celular / WhatsApp</div>
                    <div className="text-sm font-black text-texto">{showAdvisorModal.advisorPhone}</div>
                  </div>
                  <div className="pt-2 italic text-[11px] text-gris font-medium">
                    "Hola, necesito ayuda con el pedido {showAdvisorModal.number}"
                  </div>
                </div>

                <div className="space-y-3">
                  <button className="w-full py-4 bg-green-600 text-white rounded-xl font-black flex items-center justify-center gap-2 hover:bg-green-700 transition-all cursor-pointer">
                    <MessageSquare size={20} /> Escribir por WhatsApp
                  </button>
                  <button onClick={() => setShowAdvisorModal(null)} className="w-full py-4 border border-borde text-texto rounded-xl font-black hover:bg-gray-50 transition-all cursor-pointer">
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

function StatCard({ title, value, icon: Icon, color = 'text-texto' }: { title: string, value: string, icon: any, color?: string }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-borde tbs-shadow flex items-start gap-4 hover:scale-[1.02] transition-transform">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${color.replace('text-', 'bg-').replace('600', '100')} ${color}`}>
        <Icon size={24} />
      </div>
      <div>
        <h3 className="text-[11px] font-black text-gris uppercase tracking-widest mb-1">{title}</h3>
        <p className={`text-2xl font-black ${color}`}>{value}</p>
      </div>
    </div>
  );
}

function OrderCard({ order, onShowDetail, onReorder, onContactAdvisor, statusLabel, statusColor, isHighlighted }: any) {
  return (
    <div className={`relative bg-white rounded-3xl border p-6 lg:p-8 tbs-shadow transition-all group ${isHighlighted ? 'border-rojo ring-2 ring-rojo ring-offset-4 animate-pulse' : 'border-borde hover:border-rojo/30'}`}>
      {isHighlighted && (
        <div className="absolute -top-3 left-8 px-3 py-1 bg-rojo text-white text-[10px] font-black rounded-lg uppercase tracking-widest shadow-lg z-10">
          Pedido Notificado
        </div>
      )}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-6 border-b border-gray-100 pb-6 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gris group-hover:bg-rojo-suave group-hover:text-rojo transition-all">
            <Package size={24} />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase text-gris tracking-widest mb-1 leading-none">Pedido</div>
            <h3 className="text-xl font-black text-texto">{order.number}</h3>
          </div>
          <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-wider ${statusColor}`}>
            {statusLabel}
          </div>
          <div className="hidden sm:block">
            <div className="text-[10px] font-black uppercase text-gris tracking-widest mb-1 leading-none">Fecha de solicitud</div>
            <div className="text-sm font-black text-texto-sec">{order.date}</div>
          </div>
        </div>
        <div className="text-right w-full lg:w-auto">
          <div className="text-[10px] font-black uppercase text-gris tracking-widest mb-1 leading-none">Total del pedido</div>
          <div className="text-2xl font-black text-texto">{formatCOP(order.total)}</div>
          <div className="text-xs font-bold text-gris">{order.units} unidades</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="space-y-4">
          <div className="flex gap-3">
            <MapPin size={18} className="text-gris shrink-0" />
            <div>
              <div className="text-[10px] font-black uppercase text-gris tracking-widest leading-none mb-1">Destino</div>
              <div className="text-sm font-bold text-texto leading-snug">{order.deliveryAddress}, {order.deliveryCity}</div>
            </div>
          </div>
          <div className="flex gap-3">
            <Clock size={18} className="text-gris shrink-0" />
            <div>
              <div className="text-[10px] font-black uppercase text-gris tracking-widest leading-none mb-1">Ventana de entrega</div>
              <div className="text-sm font-bold text-texto leading-snug">{order.deliveryWindow}</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex gap-3">
            <Truck size={18} className="text-gris shrink-0" />
            <div>
              <div className="text-[10px] font-black uppercase text-gris tracking-widest leading-none mb-1">Transportadora</div>
              <div className="text-sm font-bold text-texto leading-snug">{order.transporter}</div>
            </div>
          </div>
          <div className="flex gap-3">
            <Layers size={18} className="text-gris shrink-0" />
            <div>
              <div className="text-[10px] font-black uppercase text-gris tracking-widest leading-none mb-1">Guía / Seguimiento</div>
              <div className="text-sm font-bold text-texto leading-snug">{order.trackingCode}</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col gap-3 justify-end items-end">
          <button 
            onClick={onShowDetail}
            className="w-full sm:w-auto lg:w-full py-3 px-6 bg-texto text-white rounded-xl font-black text-sm hover:bg-rojo transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            Ver detalle <ChevronRight size={18} />
          </button>
          <div className="flex gap-3 w-full sm:w-auto lg:w-full">
            <button 
              onClick={onReorder}
              className="flex-1 py-3 px-4 border-2 border-borde text-texto rounded-xl font-black text-xs hover:border-rojo/30 hover:text-rojo transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw size={14} /> Reordenar
            </button>
            <button 
              onClick={onContactAdvisor}
              className="flex-1 py-3 px-4 border-2 border-borde text-texto rounded-xl font-black text-xs hover:border-rojo/30 hover:text-rojo transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare size={14} /> Asesor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderDetailModal({ order, onClose, onReorder, onContactAdvisor, getStatusLabel, getStatusColor }: any) {
  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div 
        initial={{ opacity: 0, x: 100 }} 
        animate={{ opacity: 1, x: 0 }} 
        exit={{ opacity: 0, x: 100 }}
        className="relative w-full max-w-4xl bg-white rounded-[40px] overflow-hidden tbs-shadow h-[90vh] flex flex-col"
      >
        <div className="p-8 border-b border-borde flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
             <div className="bg-rojo-suave p-3 rounded-2xl text-rojo">
              <Package size={28} />
             </div>
             <div>
              <div className="flex items-center gap-3">
                <h3 className="text-3xl font-black text-texto tracking-tighter">Pedido {order.number}</h3>
                <span className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider ${getStatusColor(order.status)}`}>
                  {getStatusLabel(order.status)}
                </span>
              </div>
              <p className="text-gris font-bold text-sm">Registrado el {order.date} · {order.units} unidades</p>
             </div>
          </div>
          <button onClick={onClose} className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Info & Products */}
            <div className="lg:col-span-12 space-y-10">
              {/* Delivery info summary cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <InfoChip label="Ciudad" val={order.deliveryCity} />
                <InfoChip label="Fecha estimada" val={order.estimatedDelivery} />
                <InfoChip label="Transportador" val={order.transporter} />
                <InfoChip label="Método pago" val={order.paymentMethod} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-4">
                  <h4 className="text-lg font-black text-texto mb-6 flex items-center gap-2">
                    <History size={20} className="text-rojo" /> Trazabilidad
                  </h4>
                  <div className="relative space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
                    {order.timeline.map((event: any, i: number) => (
                      <div key={event.id} className="relative pl-10">
                        <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-white shadow-sm z-10 transition-colors ${event.completed ? 'bg-rojo' : 'bg-gray-200'}`}>
                          {event.completed && <CheckCircle2 size={12} className="text-white absolute inset-0 m-auto" />}
                        </div>
                        <div className={event.completed ? 'opacity-100' : 'opacity-40'}>
                          <div className="text-sm font-black text-texto leading-none mb-1">{event.title}</div>
                          <p className="text-xs font-medium text-gris leading-relaxed mb-1">{event.description}</p>
                          <div className="text-[10px] font-black text-rojo-oscuro">{event.date} · {event.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-8 flex flex-col gap-10">
                  <section>
                    <h4 className="text-lg font-black text-texto mb-6 flex items-center gap-2">
                      <Layers size={20} className="text-rojo" /> Productos incluidos
                    </h4>
                    <div className="bg-gray-50 rounded-3xl overflow-hidden border border-borde">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-white border-b border-borde">
                          <tr>
                            <th className="px-6 py-4 font-black uppercase text-[10px] text-gris tracking-widest">Producto</th>
                            <th className="px-6 py-4 font-black uppercase text-[10px] text-gris tracking-widest text-center">Cant.</th>
                            <th className="px-6 py-4 font-black uppercase text-[10px] text-gris tracking-widest text-right">Unitario</th>
                            <th className="px-6 py-4 font-black uppercase text-[10px] text-gris tracking-widest text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {order.products.map((p: OrderProduct) => (
                            <tr key={p.id}>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-white rounded-lg border border-borde p-1 flex-shrink-0">
                                    <img src={p.image} alt={p.name} className="w-full h-full object-contain" onError={(e) => { (e.target as any).src = "https://placehold.co/100x100?text=Licores"; }} />
                                  </div>
                                  <div>
                                    <div className="font-black text-texto leading-tight">{p.name}</div>
                                    <div className="text-[10px] font-bold text-gris uppercase">{p.category}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-center font-black text-texto">{p.quantity}</td>
                              <td className="px-6 py-4 text-right font-medium text-gris">{formatCOP(p.unitPrice)}</td>
                              <td className="px-6 py-4 text-right font-black text-texto">{formatCOP(p.quantity * p.unitPrice)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-white border-t border-borde">
                          <tr>
                            <td colSpan={3} className="px-6 py-5 text-right font-black text-gris uppercase text-[10px] tracking-widest">Total Pedido</td>
                            <td className="px-6 py-5 text-right font-black text-2xl text-rojo tracking-tighter">{formatCOP(order.total)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </section>

                  <section>
                    <h4 className="text-lg font-black text-texto mb-4 flex items-center gap-2">
                       <AlertCircle size={20} className="text-rojo" /> Novedades logísticas
                    </h4>
                    {order.issues && order.issues.length > 0 ? (
                      <div className="space-y-3">
                        {order.issues.map((issue: any) => (
                          <div key={issue.id} className="p-6 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-4">
                             <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center shrink-0">
                               <AlertCircle size={20} />
                             </div>
                             <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                  <div className="font-black text-red-900">{issue.type}</div>
                                  <div className="text-[10px] font-black uppercase text-red-800 bg-red-200 px-2 py-0.5 rounded-full tracking-wider">{issue.status}</div>
                                </div>
                                <p className="text-sm font-medium text-red-800 leading-relaxed mb-4">{issue.description}</p>
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-black text-red-700 uppercase">{issue.date}</span>
                                  <button onClick={onContactAdvisor} className="text-xs font-black text-red-900 border-b-2 border-red-900 hover:text-rojo hover:border-rojo pb-0.5 transition-all cursor-pointer">
                                    Contactar asesor ahora
                                  </button>
                                </div>
                             </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 bg-gray-50 border border-gray-200 rounded-2xl flex items-center gap-3 text-gris">
                        <CheckCircle2 size={18} />
                        <span className="text-sm font-bold">Este pedido no tiene novedades reportadas.</span>
                      </div>
                    )}
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-borde bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
          <div className="flex items-center gap-6">
            <div>
              <div className="text-[10px] font-black text-gris uppercase tracking-widest leading-none mb-1">Dirección entrega</div>
              <div className="text-sm font-black text-texto">{order.deliveryAddress}</div>
            </div>
            <div>
              <div className="text-[10px] font-black text-gris uppercase tracking-widest leading-none mb-1">Guía Transporte</div>
              <div className="text-sm font-black text-texto">{order.trackingCode}</div>
            </div>
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
            <button 
              onClick={onContactAdvisor}
              className="flex-1 sm:flex-none py-4 px-8 border-2 border-borde bg-white text-texto rounded-xl font-black hover:border-rojo/30 transition-all cursor-pointer"
            >
              Contactar Asesor
            </button>
            <button 
              onClick={onReorder}
              className="flex-1 sm:flex-none py-4 px-10 bg-texto text-white rounded-xl font-black hover:bg-rojo transition-all tbs-shadow cursor-pointer"
            >
              Reordenar pedido
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function InfoChip({ label, val }: { label: string, val: string }) {
  return (
    <div className="bg-white border border-borde p-4 rounded-2xl">
      <div className="text-[10px] font-black uppercase text-gris tracking-widest leading-none mb-1">{label}</div>
      <div className="text-sm font-black text-texto truncate">{val}</div>
    </div>
  );
}
