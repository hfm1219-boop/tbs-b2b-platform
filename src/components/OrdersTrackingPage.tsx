import React, { useState, useMemo, useEffect } from 'react';
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
  History,
  Undo2,
  FileText,
  ClipboardCheck,
  SearchCode,
  ChevronDown,
  ShieldCheck
} from 'lucide-react';
import { 
  User, 
  CustomerOrder, 
  OrderStatus, 
  OrderProduct, 
  ReturnReason, 
  ReturnRequestStatus, 
  ReturnRequestLine, 
  ReturnRequest, 
  ProductOrderMatch 
} from '../types';
import { useAnalytics } from '../hooks/useAnalytics';

interface OrdersTrackingPageProps {
  currentUser: User | null;
  onBackToAccount: () => void;
  onGoHome: () => void;
  onGoCatalog: (category?: string | null) => void;
  onAddItemsToCart?: (items: { product: any, quantity: number }[]) => void;
  onOpenCart?: () => void;
  onGoReorder?: () => void;
  onGoAdvisorChat?: (topic?: any, context?: any) => void;
  highlightedOrderId?: string | null;
  onClearHighlight?: () => void;
  onCreateNotification?: (notif: any) => void;
  commissions?: any[];
  commissionRules?: any[];
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
    documentNumber: "FV-88321",
    deliveryDocumentNumber: "REM-10245",
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
    documentNumber: "FV-88290",
    deliveryDocumentNumber: "REM-10231",
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
    documentNumber: "FV-88174",
    deliveryDocumentNumber: "REM-10218",
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
  onCreateNotification,
  highlightedOrderId,
  onClearHighlight,
  commissions = [],
  commissionRules = []
}: OrdersTrackingPageProps) {
  const analytics = useAnalytics(currentUser);
  const isHospitalityPartner = currentUser?.role === 'hospitality_partner';
  const isCash = currentUser?.commercialCondition === 'contado';
  const [activeTab, setActiveTab] = useState<'pedidos' | 'devoluciones' | 'comisiones'>(isHospitalityPartner ? 'comisiones' : 'pedidos');
  const [submittedReturns, setSubmittedReturns] = useState<ReturnRequest[]>([]);
  const [filter, setFilter] = useState<OrderStatus | 'todos'>('todos');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null);
  const [showReorderConfirm, setShowReorderConfirm] = useState(false);
  const [showAdvisorModal, setShowAdvisorModal] = useState<CustomerOrder | null>(null);

  // Return Logistics State
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [selectedReturnOrder, setSelectedReturnOrder] = useState<CustomerOrder | null>(null);
  const [preselectedProductId, setPreselectedProductId] = useState<string | null>(null);
  const [returnConfirmation, setReturnConfirmation] = useState<ReturnRequest | null>(null);
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [productMatches, setProductMatches] = useState<ProductOrderMatch[]>([]);
  const [isSearchingProduct, setIsSearchingProduct] = useState(false);
  const [showProductSearch, setShowProductSearch] = useState(false);

  const findProductOrderMatches = (term: string, orders: CustomerOrder[]): ProductOrderMatch[] => {
    if (term.length < 2) return [];
    
    const matches: ProductOrderMatch[] = [];
    const normalizedTerm = term.toLowerCase();

    orders.forEach(order => {
      order.products.forEach(product => {
        if (
          product.name.toLowerCase().includes(normalizedTerm) || 
          product.category.toLowerCase().includes(normalizedTerm)
        ) {
          matches.push({
            orderId: order.id,
            orderNumber: order.number,
            documentNumber: order.documentNumber,
            orderDate: order.date,
            deliveryCity: order.deliveryCity,
            deliveryAddress: order.deliveryAddress,
            productId: parseInt(product.id.split('-')[1]) || 0,
            productName: product.name,
            category: product.category,
            quantity: product.quantity,
            unitPrice: product.unitPrice,
            isLatest: false // Will be set after sorting
          });
        }
      });
    });

    // Sort by date descending (latest first)
    const sorted = [...matches].sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
    
    // Group by product and mark latest
    const seenProducts = new Set();
    return sorted.map(match => {
      const key = `${match.productId}-${match.productName}`;
      if (!seenProducts.has(key)) {
        seenProducts.add(key);
        return { ...match, isLatest: true };
      }
      return match;
    });
  };

  useEffect(() => {
    if (productSearchTerm.length >= 2) {
      const results = findProductOrderMatches(productSearchTerm, DUMMY_ORDERS);
      setProductMatches(results);
    } else {
      setProductMatches([]);
    }
  }, [productSearchTerm]);

  const handleOpenReturnRequest = (order: CustomerOrder, productId?: string) => {
    setSelectedReturnOrder(order);
    setPreselectedProductId(productId || null);
    setIsReturnModalOpen(true);
    analytics.track('return_request_started', 'orders', {
      source: 'orders_tracking',
      metadata: {
        orderStatus: order.status,
        productCount: order.products.length
      }
    });
  };

  useEffect(() => {
    analytics.track('orders_tracking_viewed', 'orders', {
      orderCount: filteredOrders.length,
      activeCount: stats.active,
      issueCount: stats.withIssue
    });
  }, []);

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
      case 'en_validacion': return isCash ? 'Pendiente de pago' : 'En validación';
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
    analytics.track('reorder_started', 'checkout', {
      orderId: order.id,
      metadata: { orderNumber: order.number, total: order.total }
    });
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
        {/* View Selector Tabs */}
        <div className="flex gap-4 mb-10 overflow-x-auto pb-2 scrollbar-hide">
          <button 
            onClick={() => setActiveTab('pedidos')}
            className={`flex items-center gap-3 px-8 py-5 rounded-[24px] font-black text-sm transition-all cursor-pointer whitespace-nowrap shadow-sm border ${
              activeTab === 'pedidos' 
              ? 'bg-rojo text-white border-rojo shadow-rojo/20' 
              : 'bg-white text-gris border-borde hover:border-rojo/30 hover:text-rojo'
            }`}
          >
            <Package size={20} />
            Mis Pedidos ({DUMMY_ORDERS.length})
          </button>
          <button 
            onClick={() => setActiveTab('devoluciones')}
            className={`flex items-center gap-3 px-8 py-5 rounded-[24px] font-black text-sm transition-all cursor-pointer whitespace-nowrap shadow-sm border ${
              activeTab === 'devoluciones' 
              ? 'bg-rojo text-white border-rojo shadow-rojo/20' 
              : 'bg-white text-gris border-borde hover:border-rojo/30 hover:text-rojo'
            }`}
          >
            <Undo2 size={20} />
            Mis Devoluciones ({submittedReturns.length})
          </button>
          
          {isHospitalityPartner && (
            <button 
              onClick={() => setActiveTab('comisiones')}
              className={`flex items-center gap-3 px-8 py-5 rounded-[24px] font-black text-sm transition-all cursor-pointer whitespace-nowrap shadow-sm border ${
                activeTab === 'comisiones' 
                ? 'bg-rojo text-white border-rojo shadow-rojo/20' 
                : 'bg-white text-gris border-borde hover:border-rojo/30 hover:text-rojo'
              }`}
            >
              <FileText size={20} />
              Mis Comisiones ({commissions.length})
            </button>
          )}
        </div>

        {activeTab === 'pedidos' ? (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="Pedidos activos" value={stats.active.toString()} icon={Package} />
          <StatCard title="En tránsito" value={stats.inTransit.toString()} icon={Truck} color="text-orange-600" />
          <StatCard title="Con novedad" value={stats.withIssue.toString()} icon={AlertCircle} color="text-red-600" />
          <StatCard title="Entregados" value={stats.delivered.toString()} icon={CheckCircle2} color="text-green-600" />
        </div>

        {/* Global Product Search for Return */}
        <div className="bg-white rounded-[32px] border border-borde p-8 mb-10 tbs-shadow overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-2 h-full bg-rojo opacity-20 group-hover:opacity-100 transition-opacity" />
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gris shrink-0">
                <SearchCode size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-texto tracking-tighter mb-1">Buscar producto para devolución</h3>
                <p className="text-gris font-medium text-sm max-w-md">
                  Busca un producto en tus pedidos anteriores para identificar el último documento en el que fue comprado.
                </p>
              </div>
            </div>
            <div className="w-full lg:w-96 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gris" size={20} />
              <input 
                type="text" 
                value={productSearchTerm}
                onChange={(e) => {
                  setProductSearchTerm(e.target.value);
                  if (e.target.value.length === 2 && !isSearchingProduct) {
                    analytics.track('return_product_search', 'orders', { searchTerm: e.target.value });
                  }
                }}
                placeholder="Buscar producto por nombre o categoría"
                className="w-full h-14 bg-gray-50 border border-borde rounded-xl pl-12 pr-6 font-semibold outline-none focus:border-rojo focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Search Results */}
          <AnimatePresence>
            {productMatches.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-8 pt-8 border-t border-gray-100 space-y-4"
              >
                {productMatches.map((match, idx) => (
                  <div key={`${match.orderId}-${match.productId}-${idx}`} className="flex flex-col sm:flex-row justify-between items-center bg-gray-50 rounded-2xl p-5 border border-transparent hover:border-rojo/30 transition-all gap-4">
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-rojo font-black text-xs shrink-0 border border-borde">
                        {match.quantity}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-black text-texto">{match.productName}</span>
                          {match.isLatest && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[9px] font-black uppercase rounded shadow-sm">
                              Último documento encontrado
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-gris">
                          <span className="flex items-center gap-1"><Package size={12} /> {match.orderNumber}</span>
                          <span className="flex items-center gap-1"><FileText size={12} /> {match.documentNumber || 'Sin factura'}</span>
                          <span className="flex items-center gap-1"><Calendar size={12} /> {match.orderDate}</span>
                          <span className="flex items-center gap-1"><MapPin size={12} /> {match.deliveryCity}</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        const order = DUMMY_ORDERS.find(o => o.id === match.orderId);
                        if (order) handleOpenReturnRequest(order, `p-${match.productId}`);
                      }}
                      className="w-full sm:w-auto px-6 py-3 bg-white border border-borde text-texto rounded-xl font-black text-sm hover:border-rojo hover:text-rojo transition-all whitespace-nowrap cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Undo2 size={16} /> Solicitar devolución
                    </button>
                  </div>
                ))}
                {productSearchTerm.length >= 2 && productMatches.length === 0 && (
                  <div className="text-center py-6 text-gris font-medium italic">
                    No se encontraron coincidencias en tus pedidos anteriores.
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
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
                onShowDetail={() => {
                  setSelectedOrder(order);
                  analytics.track('order_detail_viewed', 'orders', {
                    orderId: order.id,
                    metadata: { orderNumber: order.number, total: order.total }
                  });
                }}
                onReorder={() => handleReorder(order)}
                onReturn={() => handleOpenReturnRequest(order)}
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
          </>
        ) : activeTab === 'devoluciones' ? (
          <div className="space-y-8">
            <div className="bg-white rounded-[32px] border border-borde p-8 tbs-shadow">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-rojo-suave text-rojo rounded-2xl flex items-center justify-center">
                  <ClipboardCheck size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-texto text-2xl tracking-tighter">Estado de Devoluciones</h3>
                  <p className="text-sm font-medium text-gris">Gestiona y consulta el progreso de tus solicitudes de logística inversa.</p>
                </div>
              </div>

              {submittedReturns.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {submittedReturns.map((ret) => (
                    <ReturnRequestCard 
                      key={ret.id} 
                      request={ret} 
                      onContactAdvisor={() => {
                        if (onGoAdvisorChat) {
                          onGoAdvisorChat('pedido', { 
                            label: `Devolución ${ret.requestNumber} - Pedido ${ret.orderNumber}`, 
                            type: 'pedido' 
                          });
                        }
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center border-2 border-dashed border-borde rounded-[32px]">
                  <div className="w-20 h-20 bg-gray-50 text-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Undo2 size={40} />
                  </div>
                  <h4 className="text-2xl font-black text-texto mb-2">No tienes devoluciones activas</h4>
                  <p className="text-gris font-medium max-w-md mx-auto mb-8">
                    Las solicitudes de devolución que realices desde el seguimiento de pedidos aparecerán aquí para tu control diario.
                  </p>
                  <button 
                    onClick={() => setActiveTab('pedidos')}
                    className="px-8 py-4 bg-texto text-white rounded-xl font-black hover:bg-rojo transition-all cursor-pointer"
                  >
                    Ir a mis pedidos
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-white rounded-[40px] border border-borde p-10 tbs-shadow">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center">
                    <FileText size={32} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-texto tracking-tighter">Control de Comisiones</h3>
                    <p className="text-gris font-medium">Tracking detallado de ventas gestionadas y el estado de tus comisiones causadas.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-2xl border border-borde">
                   <div className="px-5 py-3 text-center">
                      <div className="text-[10px] font-black text-gris uppercase tracking-widest mb-1">Causadas</div>
                      <div className="text-xl font-black text-texto">
                        {formatCOP(commissions.reduce((s, c) => c.status === 'causada' ? s + c.commissionAmount : s, 0))}
                      </div>
                   </div>
                   <div className="w-px h-10 bg-borde" />
                   <div className="px-5 py-3 text-center">
                      <div className="text-[10px] font-black text-rojo uppercase tracking-widest mb-1">Pagadas</div>
                      <div className="text-xl font-black text-rojo">
                        {formatCOP(commissions.reduce((s, c) => c.status === 'pagada' ? s + c.commissionAmount : s, 0))}
                      </div>
                   </div>
                </div>
              </div>

              {commissions.length > 0 ? (
                <div className="overflow-x-auto -mx-10 px-10">
                  <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="py-5 text-[11px] font-black text-gris uppercase tracking-widest">Pedido / Fecha</th>
                        <th className="py-5 text-[11px] font-black text-gris uppercase tracking-widest">Cliente / Evento</th>
                        <th className="py-5 text-[11px] font-black text-gris uppercase tracking-widest text-right">Venta Base</th>
                        <th className="py-5 text-[11px] font-black text-gris uppercase tracking-widest text-right">Comisión (%)</th>
                        <th className="py-5 text-[11px] font-black text-gris uppercase tracking-widest text-right">Monto</th>
                        <th className="py-5 text-[11px] font-black text-gris uppercase tracking-widest text-center">Estatus</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {commissions.map((comm) => (
                        <tr key={comm.id} className="group hover:bg-gray-50/50 transition-colors">
                          <td className="py-5">
                            <div className="font-black text-texto">{comm.orderNumber}</div>
                            <div className="text-xs text-gris font-medium tracking-tight">{comm.orderDate}</div>
                          </td>
                          <td className="py-5">
                            <div className="font-black text-texto">{comm.managedClientName}</div>
                            <div className="text-xs font-bold text-rojo uppercase tracking-widest tracking-tight">{comm.eventName || 'Compra Directa'}</div>
                          </td>
                          <td className="py-5 text-right font-bold text-texto-sec">
                            {formatCOP(comm.commissionBase)}
                          </td>
                          <td className="py-5 text-right font-black text-texto">
                            {comm.commissionPercent}%
                          </td>
                          <td className="py-5 text-right">
                             <div className="text-lg font-black text-rojo">{formatCOP(comm.commissionAmount)}</div>
                          </td>
                          <td className="py-5">
                            <div className="flex justify-center">
                              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                comm.status === 'pagada' 
                                ? 'bg-green-50 text-green-700 border-green-200' 
                                : comm.status === 'causada'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-gray-50 text-gray-500 border-gray-200'
                              }`}>
                                {comm.status}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-20 text-center border-2 border-dashed border-borde rounded-[32px]">
                   <FileText size={40} className="mx-auto text-gray-200 mb-6" />
                   <h4 className="text-2xl font-black text-texto mb-2">Aún no tienes ventas comisionables</h4>
                   <p className="text-gris font-medium max-w-sm mx-auto">
                     Tus ventas aparecerán aquí una vez que gestiones compras para tus clientes y eventos.
                   </p>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-texto text-white p-10 rounded-[40px] shadow-2xl relative overflow-hidden group">
                <div className="absolute right-[-20px] top-[-20px] opacity-10 group-hover:scale-110 transition-transform duration-700">
                  <ShieldCheck size={200} />
                </div>
                <div className="relative z-10">
                  <h4 className="text-2xl font-black tracking-tighter mb-4">Reglas de Pago</h4>
                  <div className="space-y-6">
                    {commissionRules.map((rule, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                          <CheckCircle2 size={20} />
                        </div>
                        <div>
                          <div className="font-black text-white/90 mb-1">{rule.name}</div>
                          <p className="text-sm font-medium text-white/60 leading-relaxed">{rule.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-10 rounded-[40px] border border-borde tbs-shadow">
                 <h4 className="text-2xl font-black text-texto tracking-tighter mb-6">¿Alguna duda con tus comisiones?</h4>
                 <p className="text-gris font-medium mb-8 leading-relaxed">
                   Si tienes inquietudes sobre un monto, el estado del pago o una venta que no aparece, contacta a tu asesor comercial TBS.
                 </p>
                 <button 
                   onClick={() => onGoAdvisorChat?.('soporte_hospitality', { label: 'Dudas Comisiones', type: 'soporte' })}
                   className="px-10 py-5 bg-rojo text-white rounded-[20px] font-black uppercase tracking-widest text-sm shadow-xl hover:scale-105 transition-all cursor-pointer inline-flex items-center gap-3"
                 >
                   <MessageSquare size={20} /> Hablar con soporte TBS
                 </button>
              </div>
            </div>
          </div>
        )}
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
              isCash={isCash}
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

      {/* Return Request Modal */}
      <AnimatePresence>
        {isReturnModalOpen && selectedReturnOrder && (
          <ReturnRequestModal 
            order={selectedReturnOrder}
            preselectedProductId={preselectedProductId}
            onClose={() => {
              setIsReturnModalOpen(false);
              setSelectedReturnOrder(null);
              setPreselectedProductId(null);
            }}
            onSubmit={(request) => {
              setIsReturnModalOpen(false);
              setReturnConfirmation(request);
              setSubmittedReturns(prev => [request, ...prev]);
              if (onCreateNotification) {
                onCreateNotification({
                  type: "pedido",
                  title: "Solicitud de devolución enviada",
                  message: "Tu solicitud de devolución fue recibida y está en revisión.",
                  priority: "media",
                  actionTarget: "ordersTracking"
                });
              }
              analytics.track('return_request_submitted', 'orders', {
                success: true,
                productCount: request.lines.length,
                units: request.lines.reduce((s, l) => s + l.returnQuantity, 0),
                metadata: {
                  reasonCount: new Set(request.lines.map(l => l.reason)).size,
                  pickupPreference: request.pickupPreference
                }
              });
            }}
            onGoAdvisor={onGoAdvisorChat}
          />
        )}
      </AnimatePresence>

      {/* Return Confirmation Modal */}
      <AnimatePresence>
        {returnConfirmation && (
          <ReturnConfirmationModal 
            request={returnConfirmation}
            onClose={() => setReturnConfirmation(null)}
            onGoAdvisor={() => {
              if (onGoAdvisorChat) {
                onGoAdvisorChat('pedido', { 
                  label: `Devolución ${returnConfirmation.requestNumber} - Pedido ${returnConfirmation.orderNumber}`, 
                  type: 'pedido' 
                });
              }
              setReturnConfirmation(null);
            }}
          />
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

function OrderCard({ order, onShowDetail, onReorder, onReturn, onContactAdvisor, statusLabel, statusColor, isHighlighted }: any) {
  const canReturn = ['entregado', 'en_transito', 'novedad'].includes(order.status);

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
          {order.documentNumber && (
            <div className="hidden md:block">
              <div className="text-[10px] font-black uppercase text-gris tracking-widest mb-1 leading-none">Factura</div>
              <div className="text-sm font-black text-rojo uppercase">{order.documentNumber}</div>
            </div>
          )}
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

        <div className="flex flex-col gap-3 justify-end items-end">
          <div className="flex gap-3 w-full lg:w-full">
            <button 
              onClick={onShowDetail}
              className="flex-1 py-3 px-4 bg-texto text-white rounded-xl font-black text-xs hover:bg-rojo transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Detalle <ChevronRight size={14} />
            </button>
            <button 
              onClick={onReturn}
              disabled={!canReturn}
              title={!canReturn ? "Disponible después de entrega o novedad logística." : ""}
              className={`flex-1 py-3 px-4 bg-white border-2 border-borde text-texto rounded-xl font-black text-xs hover:border-rojo/30 hover:text-rojo transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-borde disabled:hover:text-texto`}
            >
              <Undo2 size={14} /> Devolución
            </button>
          </div>
          <div className="flex gap-3 w-full lg:w-full">
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

function OrderDetailModal({ order, onClose, onReorder, onContactAdvisor, getStatusLabel, getStatusColor, isCash }: any) {
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
                    {order.timeline.map((event: any, i: number) => {
                      const eventTitle = isCash && event.title === 'Validación comercial' ? 'Validación de pago' : event.title;
                      const eventDesc = isCash && event.title === 'Validación comercial' ? 'Pendiente de confirmación de pago o soporte registrado.' : event.description;
                      
                      return (
                        <div key={event.id} className="relative pl-10">
                          <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-white shadow-sm z-10 transition-colors ${event.completed ? 'bg-rojo' : 'bg-gray-200'}`}>
                            {event.completed && <CheckCircle2 size={12} className="text-white absolute inset-0 m-auto" />}
                          </div>
                          <div className={event.completed ? 'opacity-100' : 'opacity-40'}>
                            <div className="text-sm font-black text-texto leading-none mb-1">{eventTitle}</div>
                            <p className="text-xs font-medium text-gris leading-relaxed mb-1">{eventDesc}</p>
                            <div className="text-[10px] font-black text-rojo-oscuro">{event.date} · {event.time}</div>
                          </div>
                        </div>
                      );
                    })}
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

function InfoChip({ label, val }: any) {
  return (
    <div className="bg-gray-50 rounded-2xl px-4 py-3 border border-borde">
      <div className="text-[9px] font-black uppercase text-gris tracking-widest leading-none mb-1">{label}</div>
      <div className="text-xs font-black text-texto truncate">{val || 'N/A'}</div>
    </div>
  );
}

function ReturnRequestModal({ order, preselectedProductId, onClose, onSubmit, onGoAdvisor }: any) {
  const [selectedLines, setSelectedLines] = useState<Record<string, boolean>>(
    preselectedProductId ? { [preselectedProductId]: true } : {}
  );
  const [returnQuantities, setReturnQuantities] = useState<Record<string, number>>(
    order.products.reduce((acc: any, p: any) => {
      acc[p.id] = p.id === preselectedProductId ? 1 : 0;
      return acc;
    }, {})
  );
  const [reasons, setReasons] = useState<Record<string, ReturnReason>>(
    {} as any
  );
  const [reasonDetails, setReasonDetails] = useState<Record<string, string>>({});
  const [pickupPreference, setPickupPreference] = useState('');
  const [otherPickup, setOtherPickup] = useState('');
  const [generalNotes, setGeneralNotes] = useState('');

  const toggleLine = (id: string) => {
    setSelectedLines(prev => {
      const next = { ...prev, [id]: !prev[id] };
      if (next[id] && returnQuantities[id] === 0) {
        setReturnQuantities(q => ({ ...q, [id]: 1 }));
      }
      return next;
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    const product = order.products.find((p: any) => p.id === id);
    if (!product) return;
    
    setReturnQuantities(prev => {
      const newVal = Math.max(0, Math.min(product.quantity, (prev[id] || 0) + delta));
      if (newVal > 0 && !selectedLines[id]) {
        setSelectedLines(s => ({ ...s, [id]: true }));
      } else if (newVal === 0 && selectedLines[id]) {
        setSelectedLines(s => ({ ...s, [id]: false }));
      }
      return { ...prev, [id]: newVal };
    });
  };

  const isFormValid = () => {
    const activeSelectedIds = Object.keys(selectedLines).filter(id => selectedLines[id]);
    if (activeSelectedIds.length === 0) return false;
    
    const allLinesValid = activeSelectedIds.every(id => {
      const qty = returnQuantities[id];
      const product = order.products.find((p: any) => p.id === id);
      const reason = reasons[id];
      const detail = reasonDetails[id];
      
      const hasQty = qty >= 1 && qty <= product.quantity;
      const hasReason = !!reason;
      const hasDetailIfOther = reason !== 'otro' || (detail && detail.trim().length > 0);
      
      return hasQty && hasReason && hasDetailIfOther;
    });

    return allLinesValid && pickupPreference;
  };

  const handleSubmit = () => {
    if (!isFormValid()) return;

    const request: ReturnRequest = {
      id: `DEV-${Date.now()}`,
      requestNumber: `DEV-${Math.floor(Math.random() * 9000) + 1000}`,
      orderId: order.id,
      orderNumber: order.number,
      documentNumber: order.documentNumber,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'enviada',
      customerName: 'Humberto Demo',
      businessName: 'Grupo Restaurante Demo',
      city: order.deliveryCity,
      deliveryAddress: order.deliveryAddress,
      pickupPreference: pickupPreference === 'other' ? otherPickup : pickupPreference,
      lines: Object.keys(selectedLines)
        .filter(id => selectedLines[id])
        .map(id => {
          const product = order.products.find((p: any) => p.id === id);
          return {
            id: `line-${id}`,
            productId: parseInt(id.split('-')[1]) || 0,
            productName: product.name,
            category: product.category,
            orderedQuantity: product.quantity,
            returnQuantity: returnQuantities[id],
            unitPrice: product.unitPrice,
            reason: reasons[id],
            reasonDetail: reasonDetails[id]
          };
        }),
      notes: generalNotes
    };

    onSubmit(request);
  };

  return (
    <div className="fixed inset-0 z-[1400] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div 
        initial={{ opacity: 0, y: 100 }} 
        animate={{ opacity: 1, y: 0 }} 
        exit={{ opacity: 0, y: 100 }}
        className="relative w-full max-w-5xl bg-white rounded-[40px] overflow-hidden tbs-shadow h-[90vh] flex flex-col"
      >
        <div className="p-8 border-b border-borde flex justify-between items-center bg-[#F8FAFC]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-rojo rounded-2xl flex items-center justify-center text-white">
              <Undo2 size={32} />
            </div>
            <div>
              <h3 className="text-3xl font-black text-texto tracking-tighter">Solicitar devolución</h3>
              <p className="text-gris font-bold text-sm">Pedido {order.number} · Factura {order.documentNumber || 'N/A'}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer border border-borde shadow-sm">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-10">
            {/* Context Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 flex items-start gap-4">
              <div className="bg-yellow-100 p-2 rounded-xl text-yellow-700">
                <Info size={24} />
              </div>
              <p className="text-sm font-semibold text-yellow-800 leading-relaxed">
                Las devoluciones deben asociarse al documento de compra correspondiente. Selecciona los productos y cantidades que quieres devolver de este pedido.
              </p>
            </div>

            {/* Document Info Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <InfoChip label="Pedido" val={order.number} />
              <InfoChip label="Factura / Remisión" val={order.documentNumber || order.deliveryDocumentNumber} />
              <InfoChip label="Fecha Pedido" val={order.date} />
              <InfoChip label="Ciudad / Sede" val={order.deliveryCity} />
            </div>

            {/* Products Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-black text-texto flex items-center gap-2">
                  <Package size={20} className="text-rojo" /> Productos del pedido
                </h4>
                <span className="text-xs font-bold text-gris uppercase tracking-wider">{order.products.length} productos disponibles</span>
              </div>
              
              <div className="space-y-4">
                {order.products.map((product: any) => {
                  const isSelected = selectedLines[product.id];
                  return (
                    <div 
                      key={product.id} 
                      className={`rounded-3xl border-2 transition-all p-5 flex flex-col gap-6 ${isSelected ? 'border-rojo bg-rojo-suave/30' : 'border-gray-100 hover:border-gray-200'}`}
                    >
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => toggleLine(product.id)}
                          className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer ${isSelected ? 'bg-rojo text-white' : 'bg-gray-100 text-transparent border-2 border-gray-200'}`}
                        >
                          <CheckCircle2 size={20} />
                        </button>
                        <div className="w-12 h-12 bg-white rounded-xl overflow-hidden border border-borde shrink-0">
                          {product.image && <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-black text-texto">{product.name}</div>
                          <div className="text-[10px] font-black text-gris uppercase">{product.category} · Compra: {product.quantity} uds</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-black text-texto">{formatCOP(product.unitPrice)}</div>
                          <div className="text-[10px] font-bold text-gris uppercase">Unitario</div>
                        </div>
                      </div>

                      {isSelected && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }} 
                          animate={{ opacity: 1, y: 0 }}
                          className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-6 border-t border-rojo/10"
                        >
                          {/* Quantity Selector */}
                          <div className="md:col-span-3">
                            <label className="text-[10px] font-black uppercase text-gris tracking-widest block mb-2">Cant. Devolución</label>
                            <div className="flex items-center gap-1 bg-white rounded-xl border border-borde p-1 overflow-hidden">
                              <button 
                                onClick={() => updateQuantity(product.id, -1)}
                                className="w-8 h-8 flex items-center justify-center text-gris hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                              >
                                <ChevronRight className="rotate-180" size={16} />
                              </button>
                              <input 
                                type="number" 
                                value={returnQuantities[product.id] || 0}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value) || 0;
                                  updateQuantity(product.id, val - (returnQuantities[product.id] || 0));
                                }}
                                className="flex-1 text-center font-black text-sm outline-none"
                              />
                              <button 
                                onClick={() => updateQuantity(product.id, 1)}
                                className="w-8 h-8 flex items-center justify-center text-gris hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                              >
                                <ChevronRight size={16} />
                              </button>
                            </div>
                            <div className="text-[9px] font-bold text-rojo mt-1">Máx: {product.quantity} uds</div>
                          </div>

                          {/* Reason Selector */}
                          <div className="md:col-span-4">
                            <label className="text-[10px] font-black uppercase text-gris tracking-widest block mb-2">Motivo</label>
                            <div className="relative">
                              <select 
                                value={reasons[product.id] || ''}
                                onChange={(e) => setReasons(prev => ({ ...prev, [product.id]: e.target.value as ReturnReason }))}
                                className="w-full h-10 bg-white border border-borde rounded-xl px-4 text-xs font-bold outline-none appearance-none focus:border-rojo"
                              >
                                <option value="">Seleccionar motivo...</option>
                                <option value="producto_no_solicitado">Producto no solicitado</option>
                                <option value="producto_averiado">Producto averiado</option>
                                <option value="producto_vencido">Producto vencido</option>
                                <option value="cantidad_incorrecta">Cantidad incorrecta</option>
                                <option value="error_en_facturacion">Error en facturación</option>
                                <option value="pedido_duplicado">Pedido duplicado</option>
                                <option value="calidad_no_conforme">Calidad no conforme</option>
                                <option value="otro">Otro</option>
                              </select>
                              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gris pointer-events-none" size={14} />
                            </div>
                          </div>

                          {/* Detail Field */}
                          <div className="md:col-span-5">
                            <label className="text-[10px] font-black uppercase text-gris tracking-widest block mb-2">Detalle adicional {reasons[product.id] === 'otro' ? '*' : ''}</label>
                            <input 
                              type="text"
                              value={reasonDetails[product.id] || ''}
                              onChange={(e) => setReasonDetails(prev => ({ ...prev, [product.id]: e.target.value }))}
                              placeholder={reasons[product.id] === 'otro' ? "Explica el motivo (obligatorio)" : "Opcional: detalles adicionales"}
                              className="w-full h-10 bg-white border border-borde rounded-xl px-4 text-xs font-semibold outline-none focus:border-rojo"
                            />
                          </div>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Logistics Preferences */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <section>
                <h4 className="text-lg font-black text-texto mb-6 flex items-center gap-2">
                  <Truck size={20} className="text-rojo" /> Preferencia de recogida
                </h4>
                <div className="space-y-2">
                  {[
                    { id: 'same', label: 'Recoger en la misma dirección de entrega', desc: order.deliveryAddress },
                    { id: 'advisor', label: 'Coordinar con asesor', desc: 'TBS se comunicará para definir fecha y lugar' },
                    { id: 'point', label: 'Entregar en punto TBS', desc: 'El cliente lleva el producto a bodega central' },
                    { id: 'other', label: 'Otra dirección', desc: 'Indicar nueva dirección de recogida' }
                  ].map(opt => (
                    <label 
                      key={opt.id}
                      className={`flex items-start gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer ${pickupPreference === opt.id ? 'border-rojo bg-rojo-suave/20' : 'border-gray-50 hover:bg-gray-50'}`}
                    >
                      <input 
                        type="radio" 
                        name="pickup"
                        checked={pickupPreference === opt.id}
                        onChange={() => setPickupPreference(opt.id)}
                        className="mt-1 accent-rojo"
                      />
                      <div>
                        <div className="text-sm font-black text-texto">{opt.label}</div>
                        <div className="text-xs font-medium text-gris">{opt.desc}</div>
                        {opt.id === 'other' && pickupPreference === 'other' && (
                          <input 
                            type="text"
                            value={otherPickup}
                            onChange={(e) => setOtherPickup(e.target.value)}
                            placeholder="Ej: Carrera 15 # 90-10, Oficina 502"
                            className="w-full mt-3 h-10 bg-white border border-borde rounded-xl px-4 text-xs font-semibold outline-none focus:border-rojo"
                          />
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </section>

              <section>
                <h4 className="text-lg font-black text-texto mb-6 flex items-center gap-2">
                  <ClipboardCheck size={20} className="text-rojo" /> Observaciones generales
                </h4>
                <textarea 
                  value={generalNotes}
                  onChange={(e) => setGeneralNotes(e.target.value)}
                  placeholder="Agrega información adicional para que el equipo TBS revise la solicitud. Ej: horarios de atención preferidos, estado del empaque, etc."
                  className="w-full h-[220px] bg-gray-50 border border-borde rounded-[24px] p-6 text-sm font-semibold outline-none focus:border-rojo focus:bg-white transition-all resize-none shadow-inner"
                />
              </section>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-borde bg-[#F8FAFC] flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-[10px] font-black uppercase text-gris tracking-widest leading-none mb-1">Productos sel.</div>
              <div className="text-xl font-black text-rojo">{Object.values(selectedLines).filter(Boolean).length}</div>
            </div>
            <div className="w-px h-10 bg-gray-200" />
            <div className="text-center">
              <div className="text-[10px] font-black uppercase text-gris tracking-widest leading-none mb-1">Total unidades</div>
              <div className="text-xl font-black text-texto">
                {Object.keys(selectedLines).filter(id => selectedLines[id]).reduce((s, id) => s + (returnQuantities[id] || 0), 0)}
              </div>
            </div>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <button 
              onClick={onClose}
              className="px-8 py-4 border-2 border-borde text-texto rounded-2xl font-black hover:bg-white hover:border-rojo/30 transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSubmit}
              disabled={!isFormValid()}
              className="flex-1 md:flex-none px-12 py-4 bg-texto text-white rounded-2xl font-black hover:bg-rojo transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg"
            >
              Enviar solicitud de devolución
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ReturnConfirmationModal({ request, onClose, onGoAdvisor }: any) {
  return (
    <div className="fixed inset-0 z-[1600] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative bg-white rounded-[40px] max-w-2xl w-full tbs-shadow overflow-hidden"
      >
        <div className="bg-green-600 p-12 text-center text-white relative">
          <div className="absolute top-8 right-8">
            <button onClick={onClose} className="text-white/60 hover:text-white transition-colors cursor-pointer">
              <X size={24} />
            </button>
          </div>
          <div className="w-20 h-20 bg-white text-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl rotate-3">
            <ClipboardCheck size={40} />
          </div>
          <h3 className="text-4xl font-black tracking-tighter mb-2">Solicitud de devolución enviada</h3>
          <p className="text-green-50/80 font-medium max-w-md mx-auto leading-relaxed">
            El equipo TBS revisará la solicitud, validará el documento asociado y se comunicará contigo para coordinar la logística inversa.
          </p>
        </div>

        <div className="p-10 space-y-8">
          {/* Summary Card */}
          <div className="bg-gray-50 rounded-3xl p-8 border border-borde space-y-6">
            <div className="flex justify-between items-center border-b border-gray-200 pb-4">
              <div>
                <div className="text-[10px] font-black uppercase text-gris tracking-widest mb-1">Número de solicitud</div>
                <div className="text-xl font-black text-texto">{request.requestNumber}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-black uppercase text-gris tracking-widest mb-1">Estado</div>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-[10px] font-black uppercase rounded-full border border-yellow-200 uppercase tracking-wider">
                  En revisión
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-[10px] font-black uppercase text-gris tracking-widest mb-1">Pedido base</div>
                <div className="text-sm font-black text-texto">{request.orderNumber}</div>
              </div>
              <div>
                <div className="text-[10px] font-black uppercase text-gris tracking-widest mb-1">Factura vinculada</div>
                <div className="text-sm font-black text-rojo">{request.documentNumber || 'Por validar'}</div>
              </div>
            </div>

            <div>
              <div className="text-[10px] font-black uppercase text-gris tracking-widest mb-3">Productos solicitados</div>
              <div className="space-y-3">
                {request.lines.map((line: any) => (
                  <div key={line.id} className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center bg-gray-50 text-rojo font-black text-xs rounded-lg border border-borde">
                        {line.returnQuantity}
                      </div>
                      <div className="text-xs font-black text-texto">{line.productName}</div>
                    </div>
                    <div className="text-[9px] font-black text-gris uppercase bg-gray-100 px-2 py-1 rounded">
                      {line.reason.replace('_', ' ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={onClose}
              className="flex-1 py-5 bg-texto text-white rounded-2xl font-black text-lg hover:bg-rojo transition-all cursor-pointer shadow-lg"
            >
              Volver a seguimiento
            </button>
            <button 
              onClick={onGoAdvisor}
              className="flex-1 py-5 border-2 border-borde text-texto rounded-2xl font-black text-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-3 cursor-pointer"
            >
              <MessageSquare size={20} /> Hablar con asesor
            </button>
          </div>
          
          <p className="text-[11px] text-gris font-medium text-center">
            Esta solicitud queda sujeta a validación de TBS según documento, estado del pedido, cantidades, condición del producto y política comercial.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function ReturnRequestCard({ request, onContactAdvisor }: any) {
  return (
    <div className="bg-white rounded-3xl border border-borde p-6 tbs-shadow hover:border-rojo/30 htransition-all group relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-rojo" />
      
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="flex flex-wrap items-center gap-4 lg:gap-8 flex-1">
          <div>
            <div className="text-[10px] font-black uppercase text-gris tracking-widest mb-1 leading-none">Solicitud #</div>
            <div className="text-lg font-black text-rojo tracking-tight">{request.requestNumber}</div>
          </div>
          
          <div className="w-px h-8 bg-gray-100 hidden lg:block" />
          
          <div>
            <div className="text-[10px] font-black uppercase text-gris tracking-widest mb-1 leading-none">Fecha Solicitud</div>
            <div className="text-sm font-black text-texto-sec">{request.createdAt}</div>
          </div>

          <div className="w-px h-8 bg-gray-100 hidden lg:block" />

          <div>
            <div className="text-[10px] font-black uppercase text-gris tracking-widest mb-1 leading-none">Pedido Origen</div>
            <div className="text-sm font-black text-texto">{request.orderNumber}</div>
          </div>

          <div className="w-px h-8 bg-gray-100 hidden lg:block" />

          <div>
            <div className="text-[10px] font-black uppercase text-gris tracking-widest mb-1 leading-none">Productos</div>
            <div className="text-sm font-black text-texto">{request.lines.length} productos</div>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="flex-1 lg:flex-none text-right">
            <span className="inline-flex px-4 py-1.5 bg-yellow-50 text-yellow-700 text-[10px] font-black uppercase rounded-full border border-yellow-200">
              {request.status.replace('_', ' ')}
            </span>
          </div>
          <button 
            onClick={onContactAdvisor}
            className="px-6 py-3 bg-texto text-white rounded-xl font-black text-xs hover:bg-rojo transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <MessageSquare size={16} /> Contactar apoyo
          </button>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-50">
        <div className="flex flex-wrap gap-2">
          {request.lines.map((line, idx) => (
            <div key={idx} className="bg-gray-50 rounded-lg px-3 py-2 border border-borde flex items-center gap-2">
              <span className="text-[10px] font-black text-rojo">{line.returnQuantity}x</span>
              <span className="text-[11px] font-bold text-texto truncate max-w-[120px]">{line.productName}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
