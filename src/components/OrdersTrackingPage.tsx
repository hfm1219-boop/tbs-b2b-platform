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
  ShieldCheck,
  TrendingDown,
  User as UserIcon
} from 'lucide-react';
import { 
  Button,
  StatusBadge,
  MetricCard,
  TableShell,
  AlertBox,
  EmptyState,
  SectionHeader,
  ActionCard,
  ModalShell,
  Tooltip,
  ConfirmDialog,
  ProgressStep,
  PageContainer,
  PageHeader,
  ModuleTabs
} from './ui';
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
import { useToasts } from './ToastContext';

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
    status: "programado_hoy",
    total: 1850000,
    units: 24,
    deliveryCity: "Cartagena",
    deliveryAddress: "Bocagrande, Carrera 3 #8-45",
    deliveryWindow: "Hoy, 2:00 p.m. - 6:00 p.m.",
    estimatedDelivery: "2026-05-01",
    paymentMethod: "Crédito B2B",
    advisorName: "Laura Gómez",
    advisorPhone: "317 123 4567",
    transporter: "Operación propia TBS",
    trackingCode: "TRK-10245",
    documentNumber: "FV-88321",
    invoiceNumber: "INV-9921",
    deliveryDocumentNumber: "REM-10245",
    nextStep: "Salida a ruta de distribución",
    orderType: "programado",
    siteName: "Restaurante El Faro - Bocagrande",
    receivingContact: "Carlos Pérez",
    requiresCustomerAction: false,
    products: [
      {
        id: "p-001",
        name: "Whisky Premium 750 ml",
        category: "Whisky",
        presentation: "Caja x 6",
        quantity: 12,
        dispatchedQty: 12,
        deliveredQty: 0,
        pendingQty: 0,
        lineStatus: "pendiente",
        unitPrice: 95000,
        image: "https://images.unsplash.com/photo-1527045980461-84bc131f13b6?q=80&w=200&auto=format&fit=crop"
      },
      {
        id: "p-002",
        name: "Ron Añejo 750 ml",
        category: "Ron",
        presentation: "Caja x 6",
        quantity: 8,
        dispatchedQty: 8,
        deliveredQty: 0,
        pendingQty: 0,
        lineStatus: "pendiente",
        unitPrice: 62000,
        image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=200&auto=format&fit=crop"
      }
    ],
    timeline: [
      { id: "st-1", title: "Pedido recibido", description: "Tu pedido fue recibido satisfactoriamente por TBS.", date: "2026-05-01", time: "08:15 AM", completed: true },
      { id: "st-2", title: "Validación de cartera", description: "Validamos cupo, cartera y condición comercial.", date: "2026-05-01", time: "09:30 AM", completed: true },
      { id: "st-3", title: "En preparación", description: "Nuestro equipo de bodega está alistando tus productos.", date: "2026-05-01", time: "11:45 AM", completed: true },
      { id: "st-4", title: "Facturado", description: "El pedido ha sido facturado y está listo para despacho.", date: "2026-05-01", time: "12:15 PM", completed: true },
      { id: "st-5", title: "Programado", description: "Entrega asignada para hoy en la ventana logística confirmada.", date: "2026-05-01", time: "01:00 PM", completed: true },
      { id: "st-6", title: "En ruta", description: "El vehículo está próximo a salir de centro de distribución.", date: "-", time: "-", completed: false },
      { id: "st-7", title: "Entregado", description: "Confirmación final de entrega.", date: "-", time: "-", completed: false }
    ],
    issues: []
  },
  {
    id: "ord-002",
    number: "TBS-10251",
    date: "2026-05-03",
    status: "validacion_cartera",
    total: 3200000,
    units: 42,
    deliveryCity: "Cartagena",
    deliveryAddress: "Centro, Calle del Landrinal #32-11",
    deliveryWindow: "Mañana, 8:00 a.m. - 12:00 p.m.",
    estimatedDelivery: "2026-05-04",
    paymentMethod: "Crédito B2B",
    advisorName: "Andrés Rico",
    advisorPhone: "300 987 6543",
    nextStep: "Liberación de cartera pendiente",
    orderType: "normal",
    siteName: "Hotel Charleston Santa Teresa",
    receivingContact: "Marta Rodríguez",
    requiresCustomerAction: true,
    products: [
      {
        id: "p-004",
        name: "Vodka Premium 1L",
        category: "Vodka",
        presentation: "Caja x 12",
        quantity: 24,
        unitPrice: 85000,
        image: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=200&auto=format&fit=crop"
      }
    ],
    timeline: [
      { id: "st-1", title: "Pedido recibido", description: "Tu pedido fue registrado en el sistema.", date: "2026-05-03", time: "10:00 AM", completed: true },
      { id: "st-2", title: "Validación de cartera", description: "Pendiente por liberación de cupo B2B.", date: "En proceso", time: "Ahora", completed: false },
      { id: "st-3", title: "En preparación", description: "Esperando aprobación comercial.", date: "-", time: "-", completed: false }
    ],
    issues: [
      {
        id: "iss-cartera",
        type: "Problema de cartera",
        description: "El pedido requiere validado contable por facturas vencidas o cupo excedido.",
        date: "2026-05-03",
        status: "abierta"
      }
    ]
  },
  {
    id: "ord-003",
    number: "TBS-10238",
    date: "2026-04-30",
    status: "entrega_parcial",
    total: 1250000,
    units: 18,
    deliveryCity: "Cartagena",
    deliveryAddress: "Getsemaní, Calle de la Sierpe #29-10",
    deliveryWindow: "Entregado Parcialmente",
    estimatedDelivery: "2026-05-01",
    paymentMethod: "PSE",
    advisorName: "Laura Gómez",
    documentNumber: "FV-90122",
    nextStep: "Reprogramación de saldo pendiente",
    orderType: "normal",
    siteName: "Demente Bar",
    receivingContact: "Felipe Soto",
    hasPartialDelivery: true,
    products: [
      {
        id: "p-005",
        name: "Ginebra Dry 750ml",
        category: "Ginebra",
        presentation: "Botella",
        quantity: 12,
        dispatchedQty: 12,
        deliveredQty: 12,
        pendingQty: 0,
        lineStatus: "completo",
        unitPrice: 75000,
        image: "https://images.unsplash.com/photo-1551538597-15828bb41103?q=80&w=200&auto=format&fit=crop"
      },
      {
        id: "p-006",
        name: "Tónica Premium Pack x4",
        category: "Mezcladores",
        presentation: "Pack x4",
        quantity: 6,
        dispatchedQty: 6,
        deliveredQty: 0,
        pendingQty: 6,
        lineStatus: "no_entregado",
        unitPrice: 28000,
        image: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?q=80&w=200&auto=format&fit=crop",
        notes: "Agotado en vehículo al momento de entrega"
      }
    ],
    timeline: [
      { id: "st-1", title: "Pedido recibido", completed: true, date: "2026-04-30", time: "02:00 PM" },
      { id: "st-2", title: "Validación de cartera", completed: true, date: "2026-04-30", time: "02:30 PM" },
      { id: "st-3", title: "En preparación", completed: true, date: "2026-04-30", time: "05:00 PM" },
      { id: "st-4", title: "Facturado", completed: true, date: "2026-05-01", time: "08:00 AM" },
      { id: "st-5", title: "Programado", completed: true, date: "2026-05-01", time: "09:00 AM" },
      { id: "st-6", title: "En ruta", completed: true, date: "2026-05-01", time: "10:30 AM" },
      { id: "st-7", title: "Entrega Parcial", description: "Se entregaron 12 de 18 unidades por novedad de stock en ruta.", date: "2026-05-01", time: "01:20 PM", completed: true }
    ],
    issues: [
      { id: "iss-parcial", type: "Entrega parcial", status: "resuelta", description: "Faltante de tónicas en despacho. Saldo pendiente para reprogramación.", date: "2026-05-01" }
    ]
  },
  {
    id: "ord-004",
    number: "TBS-10255",
    date: "2026-05-04",
    status: "en_ruta",
    total: 945000,
    units: 12,
    deliveryCity: "Barranquilla",
    deliveryAddress: "Cll 72 #54-15",
    deliveryWindow: "Hoy, Antes de las 4:00 PM",
    estimatedDelivery: "2026-05-04",
    paymentMethod: "Crédito B2B",
    advisorName: "Laura Gómez",
    nextStep: "Descargue y recepción en sede",
    orderType: "urgente",
    siteName: "Discoteca La Troja",
    receivingContact: "Nando J.",
    products: [
      { id: "p-007", name: "Cerveza Artesanal 330ml", category: "Cervezas", quantity: 12, unitPrice: 78750, image: "https://images.unsplash.com/photo-1535958636474-b021ee887b13?q=80&w=200&auto=format&fit=crop" }
    ],
    timeline: [
      { id: "st-1", title: "Pedido recibido", completed: true, date: "2026-05-04", time: "08:00 AM" },
      { id: "st-2", title: "Validación de cartera", completed: true, date: "2026-05-04", time: "08:20 AM" },
      { id: "st-3", title: "En preparación", completed: true, date: "2026-05-04", time: "09:00 AM" },
      { id: "st-4", title: "Facturado", completed: true, date: "2026-05-04", time: "09:30 AM" },
      { id: "st-5", title: "Programado", completed: true, date: "2026-05-04", time: "10:00 AM" },
      { id: "st-6", title: "En ruta", description: "El conductor está en tránsito hacia tu ubicación.", date: "2026-05-04", time: "10:30 AM", completed: true }
    ],
    issues: []
  },
  {
    id: "ord-005",
    number: "TBS-10212",
    date: "2026-04-20",
    status: "con_novedad",
    total: 2150000,
    units: 15,
    deliveryCity: "Cartagena",
    deliveryAddress: "Centro, Calle de Ayos #4-21",
    deliveryWindow: "Sujeto a reprogramación",
    estimatedDelivery: "2026-04-21",
    paymentMethod: "Crédito B2B",
    advisorName: "Andrés Rico",
    nextStep: "Confirmar nueva ventana de entrega",
    orderType: "normal",
    siteName: "Restaurante Alma",
    receivingContact: "Pedro L.",
    requiresCustomerAction: true,
    products: [
      { id: "p-008", name: "Vino Blanco Chardonnay", category: "Vinos", quantity: 15, unitPrice: 143333, image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=200&auto=format&fit=crop" }
    ],
    timeline: [
      { id: "st-1", title: "Pedido recibido", completed: true, date: "2026-04-20", time: "09:00 AM" },
      { id: "st-2", title: "Validación de cartera", completed: true, date: "2026-04-20", time: "09:45 AM" },
      { id: "st-3", title: "En preparación", completed: true, date: "2026-04-20", time: "11:00 AM" },
      { id: "st-4", title: "Facturado", completed: true, date: "2026-04-20", time: "01:00 PM" },
      { id: "st-5", title: "Programado", completed: true, date: "2026-04-21", time: "08:00 AM" },
      { id: "st-6", title: "Con novedad", description: "Cliente no disponible en ventana programada.", date: "2026-04-21", time: "11:20 AM", completed: true }
    ],
    issues: [
      { id: "iss-cliente-ausente", type: "Cliente no disponible", status: "abierta", description: "No fue posible realizar la entrega por ausencia de receptor autorizado.", date: "2026-04-21" }
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
  const toasts = useToasts();
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
      const searchLower = search.toLowerCase();
      const matchesSearch = 
        order.number.toLowerCase().includes(searchLower) ||
        (order.trackingCode && order.trackingCode.toLowerCase().includes(searchLower)) ||
        (order.siteName && order.siteName.toLowerCase().includes(searchLower)) ||
        (order.receivingContact && order.receivingContact.toLowerCase().includes(searchLower)) ||
        order.deliveryAddress.toLowerCase().includes(searchLower) ||
        (order.documentNumber && order.documentNumber.toLowerCase().includes(searchLower));
      
      let matchesFilter = filter === 'todos' || order.status === filter;

      // Special filters
      if (filter === 'urgente') matchesFilter = order.orderType === 'urgente' || order.isUrgent;
      if (filter === 'parcial') matchesFilter = !!order.hasPartialDelivery;
      if (filter === 'novedad') matchesFilter = order.status === 'con_novedad' || (order.issues && order.issues.length > 0);

      return matchesFilter && matchesSearch;
    });
  }, [filter, search]);

  const stats = useMemo(() => {
    const active = DUMMY_ORDERS.filter(o => o.status !== 'entregado' && o.status !== 'cancelado').length;
    const inTransit = DUMMY_ORDERS.filter(o => o.status === 'en_ruta').length;
    const withIssue = DUMMY_ORDERS.filter(o => o.status === 'con_novedad' || (o.issues && o.issues.length > 0)).length;
    const delivered = DUMMY_ORDERS.filter(o => o.status === 'entregado' || o.status === 'entrega_parcial').length;
    return { active, inTransit, withIssue, delivered };
  }, []);

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case 'recibido': return 'Recibido';
      case 'validacion_cartera': return 'Pendiente Cartera';
      case 'en_preparacion': return 'En preparación';
      case 'facturado': return 'Facturado';
      case 'programado': return 'Programado';
      case 'programado_hoy': return 'Programado para hoy';
      case 'en_ruta': return 'En ruta';
      case 'entregado': return 'Entregado';
      case 'con_novedad': return 'Con novedad';
      case 'reprogramado': return 'Reprogramado';
      case 'entrega_parcial': return 'Entrega parcial';
      case 'rechazado': return 'Rechazado';
      case 'cancelado': return 'Cancelado';
      default: return status;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'recibido': return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'validacion_cartera': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'en_preparacion': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'facturado': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'programado': return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'programado_hoy': return 'bg-texto text-white border-texto';
      case 'en_ruta': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'entregado': return 'bg-green-50 text-green-700 border-green-200';
      case 'con_novedad': return 'bg-rojo-suave text-rojo border-rojo/10';
      case 'reprogramado': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'entrega_parcial': return 'bg-amber-50 text-amber-900 border-amber-300';
      case 'rechazado': return 'bg-red-50 text-red-700 border-red-200';
      case 'cancelado': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const handleReorder = (order: CustomerOrder) => {
    analytics.track('reorder_started', 'checkout', {
      orderId: order.id,
      metadata: { orderNumber: order.number, total: order.total }
    });
    
    if (onAddItemsToCart) {
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
      toasts.success("Cargado al carrito", `Se han agregado ${cartItems.length} productos del pedido ${order.number}.`);
      if (onOpenCart) onOpenCart();
    } else if (onGoReorder) {
      onGoReorder();
    } else {
      setShowReorderConfirm(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <PageHeader
        title="Seguimiento B2B"
        eyebrow="Trazabilidad Logística"
        description="Consulta el estado de tus pedidos, entregas programadas, novedades y trazabilidad de logística inversa (devoluciones)."
        onBack={onBackToAccount}
        metric={{
          label: "Empresa",
          value: currentUser?.businessName || 'Cargando...'
        }}
      />

      <PageContainer variant="dashboard" className="pt-8">
        {/* View Selector Tabs */}
        <div className="mb-8">
          <ModuleTabs 
            tabs={[
              { id: 'pedidos', label: `Mis Pedidos (${DUMMY_ORDERS.length})`, icon: Package },
              { id: 'devoluciones', label: `Mis Devoluciones (${submittedReturns.length})`, icon: Undo2 },
              ...(isHospitalityPartner ? [{ id: 'comisiones', label: `Mis Comisiones (${commissions.length})`, icon: FileText }] : [])
            ]}
            activeTab={activeTab}
            onChange={(id) => setActiveTab(id as any)}
          />
        </div>

        {activeTab === 'pedidos' ? (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <MetricCard 
                label="Pedidos activos" 
                value={stats.active.toString()} 
                icon={<Package size={20} />} 
                color="red"
              />
              <MetricCard 
                label="En tránsito" 
                value={stats.inTransit.toString()} 
                icon={<Truck size={20} />} 
                trend={{ value: 'Operando', isPositive: true }}
              />
              <MetricCard 
                label="Con novedad" 
                value={stats.withIssue.toString()} 
                icon={<AlertCircle size={20} />} 
                color={stats.withIssue > 0 ? "amber" : "gray"}
              />
              <MetricCard 
                label="Entregados" 
                value={stats.delivered.toString()} 
                icon={<CheckCircle2 size={20} />} 
                color="green"
              />
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
            {(['todos', 'urgente', 'parcial', 'en_validacion', 'aprobado', 'preparando', 'en_transito', 'entregado', 'novedad', 'cancelado'] as const).map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  filter === status 
                    ? 'bg-texto text-white shadow-lg' 
                    : 'bg-white text-gris border border-borde hover:border-rojo/30 hover:text-rojo'
                }`}
              >
                {status === 'todos' ? 'Todos' : 
                 status === 'urgente' ? 'Urgentes' :
                 status === 'parcial' ? 'Parciales' :
                 status === 'novedad' ? 'Novedades' :
                 getStatusLabel(status)}
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
        <div className="grid grid-cols-1 gap-6">
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
                isHighlighted={highlightedOrderId === order.number}
              />
            ))
          ) : (
            <EmptyState 
              variant="neutral"
              title="No tienes pedidos activos"
              description="Cuando tengas pedidos en preparación, programación o ruta, aparecerán en esta sección."
              primaryActionLabel="Ir al catálogo"
              onPrimaryAction={() => onGoHome()}
              secondaryActionLabel="Reordenar pedido"
              onSecondaryAction={() => {}}
              className="py-20"
            />
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
                <EmptyState 
                  variant="neutral"
                  title="No tienes devoluciones activas"
                  description="Las solicitudes de devolución que realices desde el seguimiento de pedidos aparecerán aquí para tu control diario."
                  primaryActionLabel="Ir a mis pedidos"
                  onPrimaryAction={() => setActiveTab('pedidos')}
                  className="py-12 border-none shadow-none"
                />
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
                <EmptyState 
                  variant="neutral"
                  title="No hay comisiones registradas"
                  description="Las comisiones se mostrarán cuando los pedidos gestionados cumplan las condiciones definidas por TBS."
                  primaryActionLabel="Ir a mis pedidos"
                  onPrimaryAction={() => setActiveTab('pedidos')}
                  className="py-12 border-none shadow-none"
                />
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
      </PageContainer>
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

interface OrderCardProps {
  key?: React.Key;
  order: CustomerOrder;
  onShowDetail: () => void;
  onReorder: () => void;
  onReturn: () => void;
  onContactAdvisor: () => void;
  statusLabel: string;
  isHighlighted?: boolean;
}

function OrderMiniProgress({ status, hasNovedad }: { status: OrderStatus, hasNovedad?: boolean }) {
  const stages = [
    { key: ['recibido'], label: 'Recibido' },
    { key: ['validacion_cartera'], label: 'Cartera' },
    { key: ['en_preparacion', 'facturado'], label: 'Alisto' },
    { key: ['programado', 'programado_hoy'], label: 'Prog' },
    { key: ['en_ruta'], label: 'Ruta' },
    { key: ['entregado', 'entrega_parcial'], label: 'Entregado' }
  ];

  const getStageIndex = (currentStatus: string) => {
    if (currentStatus === 'con_novedad') return 4; // Mocking it near delivery
    if (currentStatus === 'reprogramado') return 3;
    if (currentStatus === 'rechazado' || currentStatus === 'cancelado') return -1;
    
    return stages.findIndex(s => s.key.includes(currentStatus));
  };

  const currentIndex = getStageIndex(status);

  return (
    <div className="flex items-center gap-1 w-full max-w-[280px]">
      {stages.map((stage, i) => {
        const isCompleted = i < currentIndex || status === 'entregado' || (status === 'entrega_parcial' && i <= 5);
        const isCurrent = i === currentIndex && status !== 'entregado';
        const isBlocked = status === 'validacion_cartera' && i === 1;
        const isWarning = hasNovedad && i === currentIndex;

        return (
          <div key={i} className="flex-1 flex flex-col gap-1.5">
            <div className={`h-1.5 rounded-full transition-colors relative ${
              isWarning ? 'bg-rojo' :
              isBlocked ? 'bg-amber-400' :
              isCurrent ? 'bg-rojo animate-pulse' :
              isCompleted ? 'bg-rojo' : 'bg-gray-100'
            }`}>
              {isCurrent && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-rojo rounded-full border-2 border-white" />
              )}
            </div>
            <span className={`text-[8px] font-black uppercase text-center tracking-tighter ${
              isCurrent || isWarning || isBlocked ? 'text-texto' : 'text-gris'
            }`}>
              {stage.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function OrderCard({ order, onShowDetail, onReorder, onReturn, onContactAdvisor, statusLabel, isHighlighted }: OrderCardProps) {
  const canReturn = ['entregado', 'entrega_parcial', 'con_novedad'].includes(order.status);
  const hasNovedad = order.status === 'con_novedad' || order.issues && order.issues.length > 0;
  const isUrgent = order.orderType === 'urgente' || order.isUrgent;

  return (
    <div className={`group bg-white rounded-[24px] border transition-all hover:panel-shadow overflow-hidden flex flex-col ${isHighlighted ? 'border-rojo ring-2 ring-rojo ring-offset-4' : 'border-borde shadow-sm'}`}>
      <div className="p-5 md:p-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-6 mb-6 lg:mb-8">
          <div className="flex items-center gap-4 lg:gap-6 w-full">
            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gray-50 rounded-[15px] lg:rounded-[20px] flex flex-col items-center justify-center text-gris shrink-0 border border-gray-100 shadow-inner group-hover:bg-rojo group-hover:text-white transition-colors">
              <span className="text-[8px] font-black leading-none">TBS</span>
              <Package size={16} className="mt-1 lg:hidden" />
              <Package size={20} className="mt-1 hidden lg:block" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2 lg:mb-3">
                <h3 className="text-lg lg:text-xl font-black text-texto tracking-tight leading-none truncate">{order.number}</h3>
                <StatusBadge status={order.status} label={statusLabel} />
                {isUrgent && (
                  <span className="px-2 py-0.5 bg-rojo text-white text-[8px] lg:text-[9px] font-black uppercase rounded shadow-sm">Urgente</span>
                )}
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] lg:text-xs font-black text-gris uppercase tracking-wider">
                <span className="flex items-center gap-1.5 font-sans"><Calendar size={12} className="text-rojo" /> {order.date}</span>
                <span className="flex items-center gap-1.5 font-sans truncate max-w-[150px]"><MapPin size={12} className="text-rojo" /> {order.siteName || order.deliveryCity}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between w-full lg:w-auto gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-50">
            <div className="lg:text-right lg:mr-4">
              <div className="text-[10px] font-black text-gris uppercase tracking-widest mb-1 leading-none font-sans">Valor Total</div>
              <div className="text-xl lg:text-2xl font-black text-texto tracking-tighter">{formatCOP(order.total)}</div>
            </div>
            <Button 
              variant="secondary" 
              onClick={onShowDetail} 
              className="h-10 lg:h-12 px-6 lg:px-8 tbs-shadow text-xs font-black uppercase"
            >
              Trazabilidad
            </Button>
          </div>
        </div>

        <div className="mb-8 p-4 md:p-6 bg-gray-50/50 rounded-2xl border border-gray-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
          <div className="w-full md:w-auto">
            <div className="text-[10px] font-black text-gris uppercase tracking-widest mb-3 leading-none font-sans text-center md:text-left">Estado Logístico</div>
            <div className="flex justify-center md:justify-start">
              <OrderMiniProgress status={order.status} hasNovedad={hasNovedad} />
            </div>
          </div>
          <div className="flex-1 md:text-right border-t md:border-t-0 pt-4 md:pt-0 border-gray-100 relative group/next">
             <div className="text-[10px] font-black text-gris uppercase tracking-widest mb-1 leading-none font-sans">Siguiente paso</div>
             <Tooltip title="Próxima tarea logística" description="Esta actividad está siendo ejecutada por nuestro equipo para avanzar en la entrega.">
                <div className="text-sm font-black text-texto">{order.nextStep || 'Cargando...'}</div>
             </Tooltip>
          </div>
          <div className="shrink-0 flex flex-col items-center md:items-end">
             <div className="text-[10px] font-black text-gris uppercase tracking-widest mb-1 leading-none font-sans">Entrega Estimada</div>
             <div className="text-sm font-black text-rojo bg-white px-3 py-1 rounded-lg border border-rojo/10 shadow-sm">{order.estimatedDelivery}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-8 border-t border-gray-100">
          <div className="space-y-4">
            <div className="flex gap-3">
              <MapPin size={18} className="text-rojo shrink-0" />
              <div>
                <div className="text-[10px] font-black uppercase text-gris tracking-widest leading-none mb-1 font-sans">Dirección de entrega</div>
                <div className="text-sm font-bold text-texto leading-snug">{order.deliveryAddress}, {order.deliveryCity}</div>
              </div>
            </div>
            <div className="flex gap-3">
              <UserIcon size={18} className="text-rojo shrink-0" />
              <div>
                <div className="text-[10px] font-black uppercase text-gris tracking-widest leading-none mb-1 font-sans">Receptor Autorizado</div>
                <div className="text-sm font-bold text-texto leading-snug">{order.receivingContact || 'Por confirmar'}</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-3">
              <Clock size={18} className="text-rojo shrink-0" />
              <div>
                <div className="text-[10px] font-black uppercase text-gris tracking-widest leading-none mb-1 font-sans">Ventana Horaria</div>
                <div className="text-sm font-bold text-texto leading-snug">{order.deliveryWindow}</div>
              </div>
            </div>
            {order.documentNumber && (
              <div className="flex gap-3">
                <FileText size={18} className="text-rojo shrink-0" />
                <div>
                  <div className="text-[10px] font-black uppercase text-gris tracking-widest leading-none mb-1 font-sans">Documento Contable</div>
                  <div className="text-sm font-black text-rojo uppercase leading-none">{order.documentNumber}</div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 justify-end items-end">
            <div className="flex flex-wrap gap-2 justify-end w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={onContactAdvisor}
                leftIcon={MessageSquare}
                className="font-black text-[10px] uppercase tracking-widest border-2 h-10 px-4"
              >
                Soporte
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onReorder}
                className="font-black text-[10px] uppercase tracking-widest border-2 h-10 px-4"
              >
                Recomprar
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onReturn}
              disabled={!canReturn}
              leftIcon={Undo2}
              className="font-black text-[10px] uppercase tracking-widest text-gris hover:text-rojo h-8 px-2"
            >
              Solicitar Devolución
            </Button>
          </div>
        </div>

        {order.requiresCustomerAction && (
          <div className="mt-8">
            <AlertBox
              type="warning"
              title="Acción Requerida"
              description="Tu pedido requiere atención comercial para continuar."
              icon={<AlertCircle size={20} />}
              action={{
                label: "Resolver ahora",
                onClick: onContactAdvisor
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function LogisticsSummaryCard({ order }: { order: CustomerOrder }) {
  const isUrgent = order.orderType === 'urgente' || order.isUrgent;
  
  return (
    <div className="bg-texto text-white rounded-[32px] p-8 shadow-xl relative overflow-hidden">
      <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
      <div className="absolute left-0 bottom-0 w-48 h-48 bg-rojo/10 rounded-full -ml-10 -mb-10 blur-2xl" />
      
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-4 md:border-r border-white/10 pr-0 md:pr-8 pb-6 md:pb-0 mb-6 md:mb-0 border-b md:border-b-0">
           <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                <Truck size={24} className={order.status === 'en_ruta' ? 'animate-bounce text-rojo' : 'text-white'} />
              </div>
              <div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 leading-none font-sans">Estado Actual</div>
                <div className="text-xl font-black tracking-tight uppercase leading-tight">{order.status.replace('_', ' ')}</div>
              </div>
           </div>
           <div className="space-y-4">
              <div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 leading-none font-sans">Siguiente Paso</div>
                <div className="text-sm font-bold text-rojo ring-1 ring-rojo/20 bg-rojo/5 px-3 py-1.5 rounded-lg inline-block">{order.nextStep || 'Alisando siguiente fase'}</div>
              </div>
              <div className="flex items-center gap-2">
                {isUrgent && <span className="text-[10px] font-black bg-rojo px-2 py-1 rounded">URGENTE</span>}
                {order.hasPartialDelivery && <span className="text-[10px] font-black bg-amber-500 px-2 py-1 rounded">ENTREGA PARCIAL</span>}
              </div>
           </div>
        </div>

        <div className="md:col-span-8">
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-1">
                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest font-sans">Estimado Entrega</div>
                <div className="text-base font-black flex items-center gap-2"><Calendar size={16} className="text-rojo" /> {order.estimatedDelivery}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest font-sans">Ventana Horaria</div>
                <div className="text-base font-black flex items-center gap-2"><Clock size={16} className="text-rojo" /> {order.deliveryWindow}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest font-sans">Sede / Punto</div>
                <div className="text-base font-black truncate">{order.siteName || order.deliveryCity}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest font-sans">Receptor</div>
                <div className="text-base font-black truncate">{order.receivingContact || 'P. Confirmar'}</div>
              </div>
           </div>
           
           <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-x-8 gap-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
                <MapPin size={14} className="text-rojo" /> {order.deliveryAddress}
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
                <ShieldCheck size={14} className="text-rojo" /> Guía: {order.trackingCode || 'Generando...'}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function LogisticsTimelineItem({ event, isCompleted, isNext, isCash }: any) {
  const eventTitle = isCash && event.title === 'Validación comercial' ? 'Validación de pago' : event.title;
  const eventDesc = isCash && event.title === 'Validación comercial' ? 'Validación de soporte de pago registrado.' : event.description;

  return (
    <div className={`relative group transition-all px-6 py-4 flex items-center justify-between gap-4 ${isCompleted ? 'bg-white' : isNext ? 'bg-rojo/5' : 'opacity-40'}`}>
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border-2 ${
          isCompleted ? 'bg-rojo border-rojo text-white' : 
          isNext ? 'bg-white border-rojo text-rojo animate-pulse' : 'bg-gray-50 border-gray-100 text-gris'
        }`}>
          {isCompleted ? <CheckCircle2 size={18} /> : <Clock size={18} />}
        </div>
        <div>
          <div className={`text-sm font-black uppercase tracking-tight ${isNext ? 'text-rojo' : 'text-texto'}`}>{eventTitle}</div>
          <div className="text-[11px] font-bold text-gris leading-tight mt-1">{eventDesc}</div>
        </div>
      </div>
      {event.date !== '-' && (
        <div className="text-right shrink-0">
          <div className="text-xs font-black text-rojo uppercase">{event.date}</div>
          <div className="text-[10px] font-bold text-gris uppercase">{event.time}</div>
        </div>
      )}
    </div>
  );
}

function OrderDetailModal({ order, onClose, onReorder, onContactAdvisor, getStatusLabel, getStatusColor, isCash }: any) {
  const hasNovedad = order.status === 'con_novedad' || order.issues?.length > 0;
  
  const timelineSteps = order.timeline.map((t: any) => ({
    title: t.title,
    status: t.completed ? 'completed' : (order.status === t.id ? 'current' : 'pending'),
    description: t.description
  }));

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-0 md:p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 40 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-6xl bg-[#FDFDFD] rounded-none md:rounded-[48px] overflow-hidden tbs-shadow h-full md:h-[92vh] flex flex-col"
      >
        <div className="p-8 md:p-10 border-b border-borde flex justify-between items-center shrink-0 bg-white shadow-sm z-10">
          <div className="flex items-center gap-6">
             <div className="bg-rojo text-white p-4 rounded-[22px] shadow-lg shadow-rojo/20">
              <Package size={32} />
             </div>
             <div>
              <div className="flex items-center gap-4 mb-2">
                <h3 className="text-3xl font-black text-texto tracking-tighter">Pedido {order.number}</h3>
                <StatusBadge status={order.status} label={getStatusLabel(order.status)} />
              </div>
              <p className="text-gris font-black text-sm uppercase tracking-widest">
                Registrado el {order.date} · <span className="text-rojo">{order.units} unidades</span>
              </p>
             </div>
          </div>
          <button
            onClick={onClose}
            className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gris hover:bg-rojo hover:text-white transition-all transform hover:rotate-90"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar space-y-10">
          {/* New Logistics Summary Block */}
          <LogisticsSummaryCard order={order} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Traceability */}
            <div className="lg:col-span-4 bg-white rounded-[38px] border border-borde shadow-sm overflow-hidden flex flex-col h-fit">
              <div className="p-8 border-b border-borde bg-gray-50/50">
                <h4 className="text-xl font-black text-texto flex items-center gap-3">
                  <History size={24} className="text-rojo" /> Trazabilidad
                </h4>
              </div>
              <div className="divide-y divide-gray-100">
                {order.timeline.map((event: any, i: number) => {
                  const isCompleted = event.completed;
                  const isNext = !isCompleted && (i === 0 || order.timeline[i-1].completed);
                  return (
                    <LogisticsTimelineItem 
                      key={event.id} 
                      event={event} 
                      isCompleted={isCompleted} 
                      isNext={isNext} 
                      isCash={isCash} 
                    />
                  );
                })}
              </div>
              
              {order.status === 'en_ruta' && (
                <div className="mt-10 p-6 bg-orange-50 border border-orange-100 rounded-3xl">
                   <div className="flex items-center gap-3 mb-3">
                     <div className="p-2 bg-orange-500 text-white rounded-xl">
                        <Truck size={20} className="animate-bounce" />
                     </div>
                     <span className="text-sm font-black text-orange-950 uppercase tracking-widest">Entrega en curso</span>
                   </div>
                   <p className="text-xs font-bold text-orange-800 leading-relaxed mb-4">
                     Tu pedido está en el vehículo de reparto. Nuestro conductor se encuentra realizando entregas en tu zona.
                   </p>
                   <Button variant="outline" size="sm" onClick={onContactAdvisor} className="w-full bg-white border-orange-200 text-orange-900 font-black text-[10px]">
                     Notificar retraso o novedad
                   </Button>
                </div>
              )}
            </div>

            {/* Right Column: Products & Incidents */}
            <div className="lg:col-span-8 space-y-10">
              <section className="bg-white rounded-[38px] border border-borde shadow-sm overflow-hidden">
                <div className="p-8 border-b border-borde flex justify-between items-center">
                  <h4 className="text-xl font-black text-texto flex items-center gap-3">
                    <Layers size={24} className="text-rojo" /> Detalle de Mercancía
                  </h4>
                  {order.hasPartialDelivery && (
                    <span className="text-[10px] font-black bg-amber-100 text-amber-900 px-3 py-1.5 rounded-full border border-amber-200 flex items-center gap-2">
                       <AlertCircle size={14} /> Entrega Parcial Detectada
                    </span>
                  )}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50/50 border-b border-borde">
                      <tr>
                        <th className="px-8 py-4 font-black uppercase text-[10px] text-gris tracking-widest">Producto</th>
                        <th className="px-6 py-4 font-black uppercase text-[10px] text-gris tracking-widest text-center">Pedido</th>
                        <th className="px-6 py-4 font-black uppercase text-[10px] text-gris tracking-widest text-center">Despacho</th>
                        <th className="px-6 py-4 font-black uppercase text-[10px] text-gris tracking-widest text-center">Entrega</th>
                        <th className="px-8 py-4 font-black uppercase text-[10px] text-gris tracking-widest text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {order.products.map((p: OrderProduct) => (
                        <tr key={p.id} className="hover:bg-gray-50/30 transition-colors">
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 bg-white rounded-2xl border border-borde p-1 overflow-hidden shrink-0 group">
                                <img src={p.image} alt={p.name} className="w-full h-full object-contain transition-transform group-hover:scale-110" />
                              </div>
                              <div>
                                <div className="font-black text-texto text-base tracking-tight leading-tight">{p.name}</div>
                                <div className="text-[10px] font-black text-gris uppercase tracking-widest mt-0.5">{p.category} {p.presentation ? `· ${p.presentation}` : ''}</div>
                                {p.notes && <div className="mt-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded inline-block">{p.notes}</div>}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <div className="text-base font-black text-texto">{p.quantity}</div>
                            <div className="text-[9px] font-black text-gris uppercase">Soli</div>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <div className={`text-base font-black ${p.dispatchedQty === p.quantity ? 'text-texto' : 'text-amber-600'}`}>
                              {p.dispatchedQty ?? p.quantity}
                            </div>
                            <div className="text-[9px] font-black text-gris uppercase">Desp</div>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <div className={`text-base font-black ${p.lineStatus === 'completo' ? 'text-green-600' : p.lineStatus === 'no_entregado' ? 'text-rojo' : 'text-gris'}`}>
                              {p.deliveredQty ?? '-'}
                            </div>
                            <div className="text-[9px] font-black text-gris uppercase">Entr</div>
                          </td>
                          <td className="px-8 py-5 text-right font-black text-texto text-base tracking-tight">{formatCOP(p.quantity * p.unitPrice)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-white border-t border-borde">
                      <tr className="bg-gray-50/30">
                        <td colSpan={4} className="px-8 py-6 text-right font-black text-gris uppercase text-xs tracking-widest border-r border-borde">Liquido Totalizado</td>
                        <td className="px-8 py-6 text-right font-black text-3xl text-rojo tracking-tighter">{formatCOP(order.total)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </section>

              <section className="bg-white rounded-[38px] border border-borde shadow-sm p-8">
                <div className="flex justify-between items-center mb-8">
                  <h4 className="text-xl font-black text-texto flex items-center gap-3">
                     <AlertCircle size={24} className="text-rojo" /> Resumen de Novedades
                  </h4>
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-black uppercase text-gris">
                    Log: {order.issues?.length || 0} eventos
                  </span>
                </div>
                
                {order.issues && order.issues.length > 0 ? (
                  <div className="space-y-4">
                    {order.issues.map((issue: any) => (
                      <div key={issue.id} className="p-6 bg-red-50/50 border border-red-100 rounded-[28px] flex items-start gap-6 group hover:bg-red-50 transition-colors">
                         <div className="w-14 h-14 bg-red-500 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-red-200">
                           <AlertCircle size={24} />
                         </div>
                         <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <div className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">{issue.date}</div>
                                <h6 className="font-black text-red-950 text-lg uppercase tracking-tight leading-none">{issue.type}</h6>
                              </div>
                              <div className="text-[10px] font-black uppercase text-white bg-red-600 px-3 py-1 rounded-full tracking-widest shadow-md">
                                {issue.status}
                              </div>
                            </div>
                            <p className="text-sm font-bold text-red-900 leading-relaxed mb-6 opacity-80">{issue.description}</p>
                            <div className="flex items-center gap-4">
                              <Button size="sm" onClick={onContactAdvisor} className="bg-red-900 hover:bg-black text-white border-0 text-[10px] px-6 h-10 rounded-xl">
                                Gestionar ahora
                              </Button>
                              <span className="text-[10px] font-black text-red-800 uppercase tracking-widest">Soporte prioritario habilitado</span>
                            </div>
                         </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-[28px] flex flex-col items-center gap-4 text-center">
                    <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-green-500 border border-green-100 shadow-sm">
                      <ShieldCheck size={32} />
                    </div>
                    <div>
                      <span className="text-lg font-black text-texto block">Operación sin novedad</span>
                      <span className="text-sm font-bold text-gris">El flujo del pedido avanza según los estándares de servicio.</span>
                    </div>
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-10 border-t border-borde bg-white flex flex-col sm:flex-row justify-between items-center gap-6 shrink-0 z-10 box-shadow-up">
          <div className="flex flex-wrap items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gris border border-gray-100">
                <MapPin size={20} />
              </div>
              <div>
                <div className="text-[10px] font-black text-gris uppercase tracking-widest leading-none mb-1 font-sans">Punto de Entrega</div>
                <div className="text-sm font-black text-texto uppercase tracking-tight">{order.deliveryCity}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gris border border-gray-100">
                <FileText size={20} />
              </div>
              <div>
                <div className="text-[10px] font-black text-gris uppercase tracking-widest leading-none mb-1 font-sans">Guía Logística</div>
                <div className="text-sm font-black text-texto uppercase tracking-tight">{order.trackingCode || 'Generando'}</div>
              </div>
            </div>
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              onClick={onContactAdvisor}
              className="flex-1 sm:flex-none border-2 border-gray-100 bg-white min-w-[200px]"
            >
              Contactar Soporte
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={onReorder}
              className="flex-1 sm:flex-none tbs-shadow min-w-[200px]"
            >
              Reactivar pedido
            </Button>
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
          <Button
            variant="ghost"
            size="md"
            onClick={onClose}
            className="rounded-full bg-white transition-colors border border-borde shadow-sm"
            leftIcon={X}
          />
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
