import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck,
  Zap,
  Building2,
  TrendingUp,
  AlertTriangle,
  History,
  ArrowRight,
  ChevronDown,
  LayoutGrid,
  Filter,
  Check,
  Search,
  Download,
  MoreVertical,
  HelpCircle,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowLeft,
  X,
  Info,
  DollarSign,
  ChevronRight,
  MessageSquare,
  MessageSquareText,
  ExternalLink,
  Wallet,
  Calendar as CalendarIcon,
  Hash,
  WalletCards,
  Upload
} from 'lucide-react';
import { 
  Button,
  StatusBadge as GlobalStatusBadge,
  MetricCard,
  TableShell,
  AlertBox,
  ModalShell,
  FormField,
  SectionHeader,
  PageContainer,
  PageHeader,
  ModuleTabs
} from './ui';
import { User, Invoice, InvoiceStatus, PaymentRecord } from '../types';
import { useAnalytics } from '../hooks/useAnalytics';
import { useToasts } from './ToastContext';
import { ConfirmDialog } from './ui';

interface PaymentsPageProps {
  currentUser: User | null;
  onBackToAccount: () => void;
  onGoHome: () => void;
  onGoAccount: () => void;
  onGoAdvisorChat: (topic?: any, context?: any) => void;
  onGoCreditRequest?: () => void;
  highlightedInvoiceId?: string | null;
  onClearHighlight: () => void;
  invoices: Invoice[];
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
}

const formatCOP = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value).replace('COP', '$');
};

export const DUMMY_INVOICES: Invoice[] = [
  {
    id: "inv-001",
    number: "FV-88321",
    issueDate: "2026-04-18",
    dueDate: "2026-05-08",
    value: 1250000,
    balance: 1250000,
    status: "por_vencer",
    orderNumber: "TBS-10245",
    description: "Pedido de whisky, ron y ginebra",
    site: "Bocagrande",
    city: "Cartagena",
    daysUntilDue: 4,
    allowsPartialPayment: true,
    minimumPartialPayment: 500000
  },
  {
    id: "inv-002",
    number: "FV-88290",
    issueDate: "2026-04-21",
    dueDate: "2026-05-12",
    value: 780000,
    balance: 780000,
    status: "pendiente",
    orderNumber: "TBS-10231",
    description: "Pedido de vodka y tequila",
    site: "Centro Histórico",
    city: "Cartagena",
    daysUntilDue: 8
  },
  {
    id: "inv-003",
    number: "FV-88174",
    issueDate: "2026-04-02",
    dueDate: "2026-04-30",
    value: 1120000,
    balance: 1120000,
    status: "vencida",
    orderNumber: "TBS-10218",
    description: "Pedido de aguardiente y ron",
    site: "Bocagrande",
    city: "Cartagena",
    daysOverdue: 4,
    allowsPartialPayment: true,
    minimumPartialPayment: 300000
  },
  {
    id: "inv-003b",
    number: "FV-88150",
    issueDate: "2026-03-28",
    dueDate: "2026-04-20",
    value: 2400000,
    balance: 1280000,
    status: "vencida",
    orderNumber: "TBS-10205",
    description: "Pedido de ron premium y tequila",
    site: "Zona Rosa",
    city: "Bogotá",
    daysOverdue: 14,
    allowsPartialPayment: true,
    minimumPartialPayment: 500000,
    paymentStatus: 'parcial'
  },
  {
    id: "inv-003c",
    number: "FV-88120",
    issueDate: "2026-03-15",
    dueDate: "2026-04-10",
    value: 950000,
    balance: 950000,
    status: "vencida",
    orderNumber: "TBS-10185",
    description: "Pedido de cervezas importadas",
    site: "Bocagrande",
    city: "Cartagena",
    daysOverdue: 24,
    hasDispute: true
  },
  {
    id: "inv-004",
    number: "FV-88041",
    issueDate: "2026-03-25",
    dueDate: "2026-04-15",
    value: 2430000,
    balance: 0,
    status: "pagada",
    orderNumber: "TBS-10190",
    description: "Pedido surtido para evento",
    site: "Centro Histórico",
    city: "Cartagena",
    paymentStatus: 'pagada'
  }
];

const DUMMY_PAYMENTS: PaymentRecord[] = [
  {
    id: "pay-001",
    date: "2026-04-16",
    amount: 2430000,
    method: "PSE",
    reference: "PSE-984512",
    status: "aprobado"
  },
  {
    id: "pay-002",
    date: "2026-04-11",
    amount: 980000,
    method: "Transferencia",
    reference: "TR-772103",
    status: "aprobado"
  }
];

export function PaymentsPage({ 
  currentUser, 
  onBackToAccount, 
  onGoHome, 
  onGoAccount,
  onGoAdvisorChat,
  onGoCreditRequest,
  highlightedInvoiceId,
  onClearHighlight,
  invoices,
  setInvoices
}: PaymentsPageProps) {
  const analytics = useAnalytics(currentUser);
  const toasts = useToasts();
  const isCash = currentUser?.commercialCondition === 'contado';
  const [filter, setFilter] = useState<InvoiceStatus | 'todos' | 'vencimiento' | 'sede'>('todos');
  const [search, setSearch] = useState('');
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [franchise, setFranchise] = useState<string>('Visa');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [detailInvoice, setDetailInvoice] = useState<Invoice | null>(null);
  const [showRegistrationMode, setShowRegistrationMode] = useState(false);
  const [viewBy, setViewBy] = useState<'lista' | 'vencimiento' | 'sede'>('lista');
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [disputeInvoice, setDisputeInvoice] = useState<Invoice | null>(null);
  const [disputeReason, setDisputeReason] = useState('');

  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const matchesSearch = inv.number.toLowerCase().includes(search.toLowerCase()) || 
                           (inv.orderNumber && inv.orderNumber.toLowerCase().includes(search.toLowerCase())) ||
                           (inv.site && inv.site.toLowerCase().includes(search.toLowerCase()));
      return matchesSearch;
    });
  }, [search, invoices]);

  const stats = useMemo(() => {
    const pendingInvoices = invoices.filter(inv => inv.balance > 0);
    const pendingTotal = pendingInvoices.reduce((sum, inv) => sum + inv.balance, 0);
    const overdueInvoices = pendingInvoices.filter(inv => inv.status === 'vencida');
    const overdueTotal = overdueInvoices.reduce((sum, inv) => sum + inv.balance, 0);
    const nextToExpireInvoices = pendingInvoices.filter(inv => inv.status === 'por_vencer');
    const nextToExpireTotal = nextToExpireInvoices.reduce((sum, inv) => sum + inv.balance, 0);
    
    const maxOverdueDays = Math.max(0, ...overdueInvoices.map(inv => inv.daysOverdue || 0));

    // Simple Risk logic
    let risk: 'bajo' | 'atencion' | 'medio' | 'alto' | 'bloqueado' = 'bajo';
    if (overdueInvoices.length > 5 || maxOverdueDays > 30) risk = 'bloqueado';
    else if (overdueInvoices.length > 3 || maxOverdueDays > 15) risk = 'alto';
    else if (overdueInvoices.length > 0) risk = 'medio';
    else if (nextToExpireInvoices.length > 3) risk = 'atencion';

    return {
      limit: currentUser?.creditLimit || (isCash ? 0 : 50000000),
      available: currentUser?.availableCredit || (isCash ? 0 : 12500000),
      pending: pendingTotal,
      overdue: overdueTotal,
      overdueCount: overdueInvoices.length,
      nextToExpire: nextToExpireTotal,
      nextToExpireCount: nextToExpireInvoices.length,
      maxOverdueDays,
      risk
    };
  }, [currentUser, isCash, invoices]);

  const usedCredit = stats.limit - stats.available;
  const usedPercentage = stats.limit > 0 ? (usedCredit / stats.limit) * 100 : 0;

  useEffect(() => {
    analytics.track('payment_page_viewed', 'payments', {
      invoiceCount: filteredInvoices.length,
      pendingBalance: stats.pending,
      overdueCount: stats.overdue
    });
  }, []);

  const totalToPay = selectedInvoices.reduce((sum, id) => {
    const inv = invoices.find(i => i.id === id);
    return sum + (inv?.balance || 0);
  }, 0);

  const commissionRate = useMemo(() => {
    if (paymentMethod === 'card') {
      return franchise === 'American Express' ? 0.03 : 0.02;
    }
    return 0;
  }, [paymentMethod, franchise]);

  const commissionValue = totalToPay * commissionRate;
  const finalTotal = totalToPay + commissionValue;

  const handleToggleInvoice = (id: string) => {
    const isSelecting = !selectedInvoices.includes(id);
    setSelectedInvoices(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );

    if (isSelecting) {
      const inv = invoices.find(i => i.id === id);
      analytics.track('invoice_selected', 'payments', {
        productId: inv?.id,
        metadata: { invoiceNumber: inv?.number, balance: inv?.balance }
      });
    }
  };

  const handleSimulatePayment = () => {
    if (selectedInvoices.length === 0 || !paymentMethod) {
      toasts.error("Selección requerida", "Debes seleccionar al menos una factura y un método de pago.");
      return;
    }
    
    setIsProcessing(true);
    setShowConfirmModal(false);

    analytics.track('payment_simulated', 'payments', {
      paymentValue: finalTotal,
      invoiceCount: selectedInvoices.length,
      metadata: { 
        method: paymentMethod, 
        franchise: paymentMethod === 'card' ? franchise : undefined,
        commission: commissionValue
      }
    });

    setTimeout(() => {
      setIsProcessing(false);
      setShowConfirmation(true);
      toasts.success("Pago registrado", "Hemos recibido tu reporte de pago correctamente.");
    }, 1500);
  };

  const handleReportDispute = (inv: Invoice) => {
    setDisputeInvoice(inv);
    setDisputeReason('');
    setShowDisputeModal(true);
  };

  const submitDispute = () => {
    if (!disputeReason.trim()) {
      toasts.error("Motivo requerido", "Por favor escribe los motivos de la disputa.");
      return;
    }

    toasts.success("Disputa reportada", `Has iniciado una solicitud de disputa para la factura ${disputeInvoice?.number}. Un asesor se contactará contigo.`);
    analytics.track('invoice_dispute_reported', 'payments', {
      invoiceNumber: disputeInvoice?.number,
      invoiceValue: disputeInvoice?.value,
      reason: disputeReason
    });
    
    // Send message to advisor chat
    if (onGoAdvisorChat) {
      onGoAdvisorChat('cartera', `Hola, quiero reportar una disputa para la factura ${disputeInvoice?.number}. Motivo: ${disputeReason}`);
    }

    // Update invoice state to show dispute label
    if (disputeInvoice) {
      // Mock persistent update for the session
      const index = DUMMY_INVOICES.findIndex(i => i.id === disputeInvoice.id);
      if (index !== -1) {
        DUMMY_INVOICES[index].hasDispute = true;
      }

      setInvoices(prev => prev.map(inv => 
        inv.id === disputeInvoice.id ? { ...inv, hasDispute: true } : inv
      ));
    }
    
    setShowDisputeModal(false);
    setDisputeInvoice(null);
    setDisputeReason('');
  };

  const getStatusColor = (status: InvoiceStatus) => {
    switch (status) {
      case 'pendiente': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'por_vencer': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'vencida': return 'bg-red-50 text-red-700 border-red-200';
      case 'pagada': return 'bg-green-50 text-green-700 border-green-200';
    }
  };

  const progressColor = () => {
    if (usedPercentage > 80) return 'bg-rojo';
    if (usedPercentage > 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[32px] p-8 lg:p-12 max-w-2xl w-full tbs-shadow text-center"
        >
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-4xl font-black tracking-tighter mb-4 text-texto">¡Pago registrado!</h2>
          <p className="text-gris-oscuro font-medium text-lg leading-relaxed mb-8">
            Tu pago fue registrado correctamente. El equipo TBS actualizará el estado de cartera según la confirmación del recaudo.
          </p>
          
          <div className="bg-gray-50 rounded-2xl p-6 text-left space-y-4 mb-8">
            <div className="flex justify-between border-b border-gray-200 pb-3">
              <span className="text-gris font-bold text-xs uppercase tracking-wider">Subtotal facturas</span>
              <span className="text-texto font-black">{formatCOP(totalToPay)}</span>
            </div>
            {commissionValue > 0 && (
              <div className="flex justify-between border-b border-gray-200 pb-3">
                <span className="text-gris font-bold text-xs uppercase tracking-wider">Comisión ({franchise} {commissionRate * 100}%)</span>
                <span className="text-rojo font-black">{formatCOP(commissionValue)}</span>
              </div>
            )}
            <div className="flex justify-between border-b border-gray-200 pb-3">
              <span className="text-gris font-bold text-xs uppercase tracking-wider">Total pagado</span>
              <span className="text-texto font-black text-lg">{formatCOP(finalTotal)}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-3">
              <span className="text-gris font-bold text-xs uppercase tracking-wider">Método de pago</span>
              <span className="text-texto font-black">{paymentMethod === 'card' ? `Tarjeta (${franchise})` : paymentMethod?.toUpperCase()}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-3">
              <span className="text-gris font-bold text-xs uppercase tracking-wider">Referencia</span>
              <span className="text-texto font-black">PAY-{new Date().getTime().toString().slice(-8)}</span>
            </div>
            <div>
              <span className="text-gris font-bold text-xs uppercase tracking-wider block mb-2">Facturas pagadas</span>
              <div className="flex flex-wrap gap-2">
                {selectedInvoices.map(id => {
                  const inv = invoices.find(i => i.id === id);
                  return (
                    <span key={id} className="bg-white px-3 py-1 rounded-full border border-borde text-xs font-black text-texto">
                      {inv?.number}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => {
                setShowConfirmation(false);
                setSelectedInvoices([]);
                setPaymentMethod(null);
                setFilter('todos');
              }}
              className="flex-1 py-4 bg-texto text-white rounded-xl font-black hover:bg-rojo transition-all cursor-pointer"
            >
              Volver a Cartera
            </button>
            <button 
              onClick={onGoAccount}
              className="flex-1 py-4 border-2 border-borde text-texto rounded-xl font-black hover:bg-gray-50 transition-all cursor-pointer"
            >
              Ir a mi cuenta
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Executive Financial Header */}
      <div className="bg-white border-b border-borde pt-12 pb-2">
        <PageContainer variant="dashboard">
          <PageHeader
            eyebrow="Resumen Financiero"
            title="Cartera y Pagos"
            description="Consulta facturas, cupo disponible, vencimientos y pagos registrados. Tu salud financiera es nuestra prioridad."
            secondaryAction={{
              label: "Volver a mi cuenta",
              onClick: onBackToAccount,
              icon: ArrowLeft,
              variant: 'ghost'
            }}
            metric={{
              label: "Riesgo Financiero",
              value: stats.risk === 'bajo' ? "Bajo Riesgo" : 
                     stats.risk === 'atencion' ? "Atención" :
                     stats.risk === 'medio' ? "Riesgo Medio" :
                     stats.risk === 'bloqueado' ? "Restringida" : "Riesgo Alto"
            }}
            variant="dashboard"
          />
        </PageContainer>
      </div>

      <PageContainer variant="dashboard" className="mt-8">
        {/* Main Dashboard Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8">
           <div className="space-y-6">
              {/* Urgent Restriction Alert */}
              {stats.overdueCount > 0 && (
                 <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-rojo text-white p-4 rounded-2xl flex items-center justify-between shadow-lg shadow-rojo/10 animate-pulse border-2 border-white/10"
                 >
                    <div className="flex items-center gap-3">
                       <AlertTriangle size={20} />
                       <p className="text-sm font-black tracking-tight flex items-center gap-2">
                          Tu cupo puede ser restringido debido a {stats.overdueCount} facturas en mora.
                       </p>
                    </div>
                    <button className="text-[10px] font-black uppercase bg-white/20 px-3 py-1.5 rounded-lg hover:bg-white/30 transition-all font-sans whitespace-nowrap">Ver ahora</button>
                 </motion.div>
              )}

              {/* Core Metrics Grid */}
              <div className="flex overflow-x-auto lg:grid lg:grid-cols-3 gap-4 pb-4 lg:pb-0 scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
                 {/* Cupo Card */}
                 {!isCash && (
                   <div className="min-w-[280px] lg:min-w-0 bg-white rounded-[32px] p-6 border border-borde shadow-sm relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-full translate-x-12 -translate-y-12 transition-transform group-hover:scale-110" />
                      <div className="relative">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center text-texto">
                            <ShieldCheck size={20} />
                          </div>
                          <span className="text-[11px] font-black text-gris uppercase tracking-[0.1em]">Cupo B2B Aprobado</span>
                        </div>
                        <div className="text-3xl font-black text-texto mb-2">{formatCOP(stats.limit)}</div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                             <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${usedPercentage}%` }}
                                className={`h-full ${usedPercentage > 85 ? 'bg-rojo' : 'bg-texto'}`} 
                             />
                          </div>
                          <span className="text-[10px] font-black text-gris">{usedPercentage.toFixed(0)}%</span>
                        </div>
                      </div>
                   </div>
                 )}

                 {/* Disponible Card */}
                 {!isCash && (
                   <div className="min-w-[280px] lg:min-w-0 bg-white rounded-[32px] p-6 border border-borde shadow-sm relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-full translate-x-12 -translate-y-12" />
                      <div className="relative">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-2xl bg-green-100 flex items-center justify-center text-green-600">
                            <TrendingUp size={20} />
                          </div>
                          <span className="text-[11px] font-black text-gris uppercase tracking-[0.1em]">Cupo Disponible</span>
                        </div>
                        <div className="text-3xl font-black text-green-600 mb-1">{formatCOP(stats.available)}</div>
                        <p className="text-[10px] font-bold text-gris leading-tight">Valor habilitado para nuevos pedidos hoy.</p>
                      </div>
                   </div>
                 )}

                 {/* Pendiente Total */}
                 <div className="min-w-[280px] lg:min-w-0 bg-white rounded-[32px] p-6 border border-borde shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full translate-x-12 -translate-y-12" />
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
                          <History size={20} />
                        </div>
                        <span className="text-[11px] font-black text-gris uppercase tracking-[0.1em]">Cartera Total</span>
                      </div>
                      <div className="text-3xl font-black text-texto mb-1">{formatCOP(stats.pending)}</div>
                      <p className="text-[10px] font-bold text-gris leading-tight">{invoices.filter(i => i.balance > 0).length} documentos pendientes.</p>
                    </div>
                 </div>
              </div>

              {/* Sub Metrics (Overdue, Upcoming) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className={`p-6 rounded-[28px] border transition-all flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 ${stats.overdueCount > 0 ? 'bg-rojo/5 border-rojo/20' : 'bg-gray-50 border-borde'}`}>
                    <div className="flex gap-4">
                       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${stats.overdueCount > 0 ? 'bg-rojo text-white shadow-lg shadow-rojo/20' : 'bg-white text-gris'}`}>
                          <AlertCircle size={24} />
                       </div>
                       <div>
                          <div className="text-[10px] font-black uppercase text-gris tracking-widest mb-1">Mora Activa</div>
                          <div className={`text-2xl font-black ${stats.overdueCount > 0 ? 'text-rojo' : 'text-texto'}`}>{formatCOP(stats.overdue)}</div>
                          <div className="text-xs font-bold text-gris mt-0.5">{stats.overdueCount} facturas presentan vencimiento</div>
                       </div>
                    </div>
                    {stats.overdueCount > 0 && (
                       <Button size="sm" variant="outline" className="w-full sm:w-auto border-rojo text-rojo hover:bg-rojo hover:text-white"
                        onClick={() => {
                          setFilter('vencida');
                          setViewBy('lista');
                        }}>
                          Pagar Mora
                       </Button>
                    )}
                 </div>

                 <div className="p-6 rounded-[28px] border border-amber-200 bg-amber-50/50 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-amber-200">
                       <Zap size={24} fill="white" />
                    </div>
                    <div>
                       <div className="text-[10px] font-black uppercase text-gris tracking-widest mb-1">Próximos Vencimientos</div>
                       <div className="text-2xl font-black text-amber-600">{formatCOP(stats.nextToExpire)}</div>
                       <div className="text-xs font-bold text-gris mt-0.5">{stats.nextToExpireCount} facturas vencen en los próximos 7 días</div>
                    </div>
                 </div>
              </div>

              {/* Secondary Alerts Section */}
              <div className="space-y-3">
                 {stats.pending > 0 && usedPercentage > 80 && (
                    <div className="bg-amber-100 text-amber-800 p-4 rounded-2xl flex items-center justify-between border border-amber-200">
                       <div className="flex items-center gap-3">
                          <Info size={20} />
                          <p className="text-sm font-black tracking-tight">Cupo crítico: Has usado el {usedPercentage.toFixed(0)}% de tu límite de crédito.</p>
                       </div>
                       <Button variant="outline" size="sm" className="bg-white border-amber-200 text-amber-800"
                        onClick={onGoCreditRequest}>
                          Pedir Ampliación
                       </Button>
                    </div>
                 )}
              </div>
           </div>

           <div className="space-y-6">
              {/* Account Profile Card */}
              <div className="bg-texto text-white rounded-[32px] p-8 shadow-xl shadow-texto/20 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
                 <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                       <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                          <Building2 size={28} />
                       </div>
                       <div>
                          <div className="text-[10px] font-black uppercase text-white/50 tracking-widest mb-1">Identidad B2B</div>
                          <div className="text-xl font-black truncate max-w-[200px]">{currentUser?.businessName}</div>
                       </div>
                    </div>

                    <div className="space-y-4 mb-8">
                       <div className="flex justify-between items-center pb-3 border-b border-white/10">
                          <span className="text-xs font-bold text-white/50 uppercase tracking-wider">NIT</span>
                          <span className="text-sm font-black">900.552.124-8</span>
                       </div>
                       <div className="flex justify-between items-center pb-3 border-b border-white/10">
                          <span className="text-xs font-bold text-white/50 uppercase tracking-wider">Condición Comercial</span>
                          <span className="text-sm font-black uppercase tracking-widest">{isCash ? 'Contado' : 'Crédito B2B'}</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-white/50 uppercase tracking-wider">Plazo Pactado</span>
                          <span className="text-sm font-black">15 Días Calendario</span>
                       </div>
                    </div>

                    <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10"
                      onClick={() => onGoAdvisorChat('cartera')}>
                       Hablar con un ejecutivo
                    </Button>
                 </div>
              </div>
           </div>
        </div>

        {/* Control Bar (Extended) */}
        <div className="bg-white rounded-[32px] border border-borde p-3 mt-6 mb-8 shadow-sm">
           <div className="flex flex-col xl:flex-row items-center justify-between gap-4">
              <div className="flex flex-col md:flex-row items-center gap-3 w-full xl:w-auto">
                <ModuleTabs 
                  tabs={[
                    { id: 'lista', label: 'Lista' },
                    { id: 'vencimiento', label: 'Vencimiento' },
                    { id: 'sede', label: 'Sede' }
                  ]}
                  activeTab={viewBy}
                  onChange={(id) => setViewBy(id as any)}
                  variant="dashboard"
                  className="w-full md:w-auto shrink-0"
                />
                <div className="relative w-full md:w-72 shrink-0">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gris" size={16} />
                  <input 
                    type="text" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar factura o sede..."
                    className="w-full h-10 bg-gray-50 border border-transparent rounded-xl pl-10 pr-4 text-xs font-bold outline-none focus:border-rojo focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 w-full xl:w-auto overflow-x-auto scrollbar-hide no-scrollbar">
                {(['todos', 'pendiente', 'vencida', 'pagada'] as const).map(status => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.05em] transition-all whitespace-nowrap border shrink-0 ${
                      filter === status
                        ? 'bg-rojo text-white border-rojo shadow-md shadow-rojo/10' 
                        : 'bg-white text-gris border-borde hover:border-rojo/30'
                    }`}
                  >
                    {status}
                  </button>
                ))}
                {isCash && (
                  <button
                    onClick={() => setShowRegistrationMode(true)}
                    className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.05em] bg-green-600 text-white shadow-lg shadow-green-100 border border-green-600 shrink-0 ml-1"
                  >
                    Reportar Pago
                  </button>
                )}
              </div>
           </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main List Area */}
          <div className="flex-1 min-w-0">

            {/* Invoices Rendering Logic */}
            {showRegistrationMode ? (
              <PaymentRegistrationForm onCancel={() => setShowRegistrationMode(false)} onFinish={handleSimulatePayment} />
            ) : (
              <div className="space-y-10">
                 {viewBy === 'lista' ? (
                    <TableShell
                      isEmpty={filteredInvoices.length === 0}
                      emptyProps={{
                        variant: "success",
                        title: stats.pending === 0 ? "No tienes facturas pendientes" : "Sin documentos",
                        description: stats.pending === 0 
                          ? "Tu cuenta no registra facturas pendientes de pago en este momento." 
                          : "No hay facturas que coincidan con los criterios aplicados.",
                        primaryActionLabel: stats.pending === 0 ? "Ver historial de pagos" : "Limpiar filtros",
                        onPrimaryAction: stats.pending === 0 ? () => {} : () => setSearch(''),
                        secondaryActionLabel: "Ir al catálogo",
                        onSecondaryAction: onGoHome
                      }}
                    >
                      <div className="divide-y divide-gray-100">
                        {filteredInvoices
                          .filter(inv => filter === 'todos' || inv.status === filter)
                          .map(inv => (
                          <InvoiceRow 
                            key={inv.id} 
                            invoice={inv} 
                            selected={selectedInvoices.includes(inv.id)}
                            onToggle={() => handleToggleInvoice(inv.id)}
                            onShowDetail={() => setDetailInvoice(inv)}
                            onReportDispute={handleReportDispute}
                            isHighlighted={highlightedInvoiceId === inv.number}
                          />
                        ))}
                      </div>
                    </TableShell>
                 ) : viewBy === 'vencimiento' ? (
                    <div className="space-y-12">
                       {['vencida', 'por_vencer', 'pendiente', 'pagada'].map(statusGroup => {
                          const groupInvoices = filteredInvoices.filter(inv => inv.status === statusGroup);
                          if (groupInvoices.length === 0) return null;
                          return (
                             <div key={statusGroup} className="space-y-4">
                                <div className="flex items-center gap-4 px-2">
                                   <div className={`w-3 h-10 rounded-full ${
                                      statusGroup === 'vencida' ? 'bg-rojo' :
                                      statusGroup === 'por_vencer' ? 'bg-amber-500' :
                                      statusGroup === 'pendiente' ? 'bg-blue-500' : 'bg-green-500'
                                   }`} />
                                   <div>
                                      <h3 className="text-xl font-black text-texto capitalize tracking-tight">{statusGroup.replace('_', ' ')}</h3>
                                      <p className="text-xs font-bold text-gris uppercase tracking-widest">{groupInvoices.length} {groupInvoices.length === 1 ? 'Factura' : 'Facturas'}</p>
                                   </div>
                                </div>
                                <div className="bg-white rounded-[32px] border border-borde overflow-hidden shadow-sm divide-y divide-gray-50">
                                   {groupInvoices.map(inv => (
                                      <InvoiceRow 
                                         key={inv.id} 
                                         invoice={inv} 
                                         selected={selectedInvoices.includes(inv.id)}
                                         onToggle={() => handleToggleInvoice(inv.id)}
                                         onShowDetail={() => setDetailInvoice(inv)}
                                         onReportDispute={handleReportDispute}
                                      />
                                   ))}
                                </div>
                             </div>
                          )
                       })}
                    </div>
                 ) : (
                    <div className="space-y-12">
                       {Array.from(new Set(filteredInvoices.map(inv => inv.site))).map(site => {
                          const groupInvoices = filteredInvoices.filter(inv => inv.site === site);
                          const siteBalance = groupInvoices.reduce((sum, i) => sum + i.balance, 0);
                          return (
                             <div key={site || 'Sin sede'} className="space-y-4">
                                <div className="flex items-center justify-between px-2">
                                   <div className="flex items-center gap-4">
                                      <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center text-texto">
                                         <Building2 size={20} />
                                      </div>
                                      <div>
                                         <h3 className="text-xl font-black text-texto tracking-tight">{site || 'Sede no especificada'}</h3>
                                         <p className="text-xs font-bold text-gris uppercase tracking-widest">{groupInvoices.length} documentos</p>
                                      </div>
                                   </div>
                                   <div className="text-right">
                                      <div className="text-[10px] font-black uppercase text-gris tracking-widest mb-1">Total Pendiente</div>
                                      <div className="text-lg font-black text-texto">{formatCOP(siteBalance)}</div>
                                   </div>
                                </div>
                                <div className="bg-white rounded-[32px] border border-borde overflow-hidden shadow-sm divide-y divide-gray-50">
                                   {groupInvoices.map(inv => (
                                      <InvoiceRow 
                                         key={inv.id} 
                                         invoice={inv} 
                                         selected={selectedInvoices.includes(inv.id)}
                                         onToggle={() => handleToggleInvoice(inv.id)}
                                         onShowDetail={() => setDetailInvoice(inv)}
                                         onReportDispute={handleReportDispute}
                                      />
                                   ))}
                                </div>
                             </div>
                          )
                       })}
                    </div>
                 )}
              </div>
            )}
          </div>

          <div id="payment-sidebar" className="lg:w-[420px] shrink-0 pt-0 lg:pt-6">
            <div className="sticky top-6 bg-white rounded-[32px] border border-borde shadow-xl overflow-hidden">
               <div className="bg-texto text-white p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
                  <h2 className="text-2xl font-black tracking-tighter mb-2 relative z-10 font-sans">Resumen de liquidación</h2>
                  <p className="text-xs font-bold text-white/50 uppercase tracking-widest leading-relaxed relative z-10">
                    Selecciona facturas para liberar cupo B2B
                  </p>
               </div>
               
               <div className="p-8 space-y-8">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gris font-bold">Facturas seleccionadas</span>
                      <span className="text-texto font-black">{selectedInvoices.length}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-t border-borde pt-4">
                      <span className="text-gris font-bold">Subtotal Cartera</span>
                      <span className="text-texto font-black">{formatCOP(totalToPay)}</span>
                    </div>
                    
                    {selectedInvoices.length > 0 && !isCash && (
                       <div className="bg-green-50 p-4 rounded-2xl border border-green-100 flex items-center justify-between animate-in zoom-in-95 duration-300">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-lg bg-green-500 text-white flex items-center justify-center">
                                <ShieldCheck size={16} />
                             </div>
                             <div>
                                <div className="text-[10px] font-black uppercase text-green-700 leading-none mb-1">Cupo a liberar</div>
                                <div className="text-sm font-black text-green-600">{formatCOP(totalToPay)}</div>
                             </div>
                          </div>
                          <Zap size={20} className="text-green-500 animate-pulse" fill="currentColor" />
                       </div>
                    )}

                    {paymentMethod === 'card' && totalToPay > 0 && (
                      <div className="flex justify-between items-center text-sm text-rojo">
                        <span className="font-bold uppercase tracking-tight text-[10px]">Gestión Administrativa {franchise}</span>
                        <span className="font-black">+{formatCOP(commissionValue)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center border-t border-borde pt-4">
                      <div>
                        <span className="text-gris font-black uppercase tracking-widest text-[10px] block mb-1">Total a debitar</span>
                        <span className="text-3xl font-black text-texto">{formatCOP(finalTotal)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gris border-b border-borde pb-2">Canal de Pago</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <PaymentMethodBtn 
                        id="pse" 
                        label="PSE" 
                        active={paymentMethod === 'pse'} 
                        onClick={() => setPaymentMethod('pse')} 
                      />
                      <PaymentMethodBtn 
                        id="card" 
                        label="Tarjeta" 
                        active={paymentMethod === 'card'} 
                        onClick={() => setPaymentMethod('card')} 
                      />
                      <PaymentMethodBtn 
                        id="qr" 
                        label="Pago QR" 
                        active={paymentMethod === 'qr'} 
                        onClick={() => setPaymentMethod('qr')} 
                      />
                      <div className="opacity-40 cursor-not-allowed">
                        <PaymentMethodBtn 
                          id="credit" 
                          label="B2B Credit" 
                          active={false} 
                          onClick={() => {}} 
                          disabled 
                        />
                      </div>
                    </div>
                    
                    {paymentMethod === 'card' && (
                      <div className="mt-4 p-5 bg-gray-50 rounded-2xl border border-borde animate-in fade-in slide-in-from-top-2">
                        <label className="block text-[10px] font-black text-gris uppercase tracking-[0.1em] mb-3 font-sans">Red de Pago</label>
                        <div className="flex flex-wrap gap-2">
                          {['Visa', 'MasterCard', 'American Express'].map(f => (
                            <button
                              key={f}
                              onClick={() => setFranchise(f)}
                              className={`flex-1 min-w-[80px] py-3 rounded-xl text-[10px] font-black border transition-all cursor-pointer ${
                                franchise === f 
                                  ? 'bg-texto text-white border-texto shadow-md' 
                                  : 'bg-white text-gris border-borde hover:border-texto/30'
                              }`}
                            >
                              {f}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 pt-4">
                    <Button 
                      disabled={selectedInvoices.length === 0 || !paymentMethod}
                      onClick={() => setShowConfirmModal(true)}
                      isLoading={isProcessing}
                      size="lg"
                      className="w-full text-lg py-8 rounded-2xl shadow-xl shadow-rojo/20 uppercase tracking-tighter font-black"
                    >
                      Ejecutar Pago
                    </Button>
                    <div className="flex items-center justify-center gap-2">
                       <ShieldCheck size={12} className="text-green-500" />
                       <p className="text-[10px] font-bold text-gris text-center italic">
                          Procesamiento seguro cifrado SSL 256-bit
                       </p>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </PageContainer>

      <AnimatePresence>
        {showDisputeModal && disputeInvoice && (
          <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDisputeModal(false)}
              className="absolute inset-0 bg-texto/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[40px] overflow-hidden shadow-2xl"
            >
              <div className="p-10 border-b border-borde flex justify-between items-center bg-amber-50/30">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shadow-lg shadow-amber-100/50">
                    <AlertCircle size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-texto tracking-tighter">Reportar Disputa</h3>
                    <p className="text-xs font-bold text-gris uppercase tracking-widest">{disputeInvoice.number} · {disputeInvoice.orderNumber}</p>
                  </div>
                </div>
                <button onClick={() => setShowDisputeModal(false)} className="text-gris hover:text-rojo transition-colors cursor-pointer">
                  <X size={24} />
                </button>
              </div>

              <div className="p-10 space-y-6">
                <div className="bg-gray-50 rounded-2xl p-5 border border-borde">
                  <div className="text-[10px] font-black text-gris uppercase tracking-[0.15em] mb-3">Motivos de la disputa</div>
                  <textarea 
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    placeholder="Describe detalladamente por qué disputas esta factura (ej: productos dañados, valor incorrecto, pedido no entregado...)"
                    className="w-full h-40 bg-white border border-borde rounded-xl p-4 font-semibold text-sm outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all resize-none shadow-inner"
                    autoFocus
                  />
                  <div className="flex items-start gap-2 mt-4 text-amber-700">
                    <Info size={14} className="shrink-0 mt-0.5" />
                    <p className="text-[10px] font-bold leading-normal">
                      Tu mensaje será enviado a tu asesor de cuenta para iniciar una revisión inmediata del caso.
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <Button 
                    onClick={submitDispute}
                    className="w-full h-16 rounded-2xl bg-amber-500 hover:bg-amber-600 shadow-xl shadow-amber-500/20 text-md font-black uppercase tracking-tight"
                    leftIcon={MessageSquareText}
                  >
                    Enviar al asesor
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {detailInvoice && (
          <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDetailInvoice(null)}
              className="absolute inset-0 bg-texto/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[40px] overflow-hidden shadow-2xl"
            >
              <div className="p-10 border-b border-borde flex justify-between items-start bg-gray-50/50">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="px-3 py-1 bg-rojo text-white text-[10px] font-black rounded-full uppercase tracking-widest">Estado: {detailInvoice.status.replace('_', ' ')}</div>
                    {detailInvoice.hasDispute && (
                       <div className="px-3 py-1 bg-amber-500 text-white text-[10px] font-black rounded-full uppercase tracking-widest">En Disputa</div>
                    )}
                  </div>
                  <h3 className="text-4xl font-black text-texto tracking-tighter">Factura {detailInvoice.number}</h3>
                  <div className="flex items-center gap-2 mt-2">
                     <Building2 size={16} className="text-gris" />
                     <span className="text-sm font-bold text-gris">{detailInvoice.site} · {detailInvoice.city}</span>
                  </div>
                </div>
                <button onClick={() => setDetailInvoice(null)} className="w-12 h-12 bg-white border border-borde rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer shadow-sm">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                   <div className="space-y-1">
                      <div className="text-[10px] font-black uppercase text-gris tracking-widest">Pedido Origen</div>
                      <div className="text-lg font-black text-texto flex items-center gap-2">
                         {detailInvoice.orderNumber}
                         <button className="text-rojo hover:underline text-[10px]">Ver Pedido</button>
                      </div>
                   </div>
                   <div className="space-y-1">
                      <div className="text-[10px] font-black uppercase text-gris tracking-widest">Fecha Emisión</div>
                      <div className="text-lg font-black text-texto">{detailInvoice.issueDate}</div>
                   </div>
                   <div className="space-y-1">
                      <div className="text-[10px] font-black uppercase text-gris tracking-widest">Fecha Vencimiento</div>
                      <div className="text-lg font-black text-rojo">{detailInvoice.dueDate}</div>
                   </div>
                </div>

                <div className="bg-[#F8FAFC] rounded-3xl p-6 border border-borde mb-8">
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-gris mb-4">Resumen de liquidación</h4>
                   <div className="space-y-4">
                      <div className="flex justify-between items-center text-sm">
                         <span className="font-bold text-gris">Valor Bruto</span>
                         <span className="font-black text-texto">{formatCOP(detailInvoice.value * 1.15)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                         <span className="font-bold text-gris">Descuentos Aplicados</span>
                         <span className="font-black text-green-600">-{formatCOP(detailInvoice.value * 0.15)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm border-t border-dashed border-borde pt-4">
                         <span className="font-bold text-texto">Valor Neto Fiscal</span>
                         <span className="font-black text-texto">{formatCOP(detailInvoice.value)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                         <div>
                            <span className="font-black text-texto text-xl">Saldo Pendiente</span>
                            <p className="text-[10px] font-bold text-gris uppercase">Liquidación inmediata sugerida</p>
                         </div>
                         <span className="text-3xl font-black text-rojo tracking-tighter">{formatCOP(detailInvoice.balance)}</span>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <button 
                     onClick={() => {
                       onGoAdvisorChat('cartera', { label: `Factura ${detailInvoice.number}`, type: 'factura' });
                       setDetailInvoice(null);
                     }}
                     className="flex items-center justify-center gap-3 py-5 px-6 rounded-2xl border-2 border-rojo text-rojo font-black hover:bg-rojo/5 transition-all text-sm uppercase tracking-tight shadow-md shadow-rojo/5"
                   >
                     <MessageSquare size={18} /> Abrir Ticket Soporte
                   </button>
                   <button 
                     onClick={() => {
                        if (!selectedInvoices.includes(detailInvoice.id)) {
                           handleToggleInvoice(detailInvoice.id);
                        }
                        setDetailInvoice(null);
                     }}
                     className="flex items-center justify-center gap-3 py-5 px-6 rounded-2xl bg-texto text-white font-black hover:bg-rojo transition-all text-sm uppercase tracking-tight shadow-lg shadow-texto/20"
                   >
                     <CheckCircle2 size={18} /> Seleccionar para Pago
                   </button>
                </div>
              </div>

              <div className="px-10 pb-10 flex justify-center">
                 <button onClick={() => setDetailInvoice(null)} className="text-[10px] font-black uppercase text-gris tracking-[0.2em] hover:text-texto transition-colors">
                    Cerrar Vista Detalle
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Sticky Payment CTA */}
      <AnimatePresence>
        {selectedInvoices.length > 0 && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-[90] shadow-[0_-8px_20px_rgba(0,0,0,0.05)]"
          >
            <div className="max-w-xl mx-auto flex items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-gris uppercase tracking-widest leading-none mb-1">{selectedInvoices.length} fact{selectedInvoices.length === 1 ? 'ura' : 'uras'}</span>
                <span className="text-xl font-black text-rojo tracking-tighter">
                  {formatCOP(finalTotal)}
                </span>
              </div>
              <Button
                onClick={() => {
                  const sidebar = document.getElementById('payment-sidebar');
                  if (sidebar) {
                    sidebar.scrollIntoView({ behavior: 'smooth' });
                  }
                  setShowConfirmModal(true);
                }}
                className="flex-1 rounded-xl h-14 px-6 gap-3"
                leftIcon={DollarSign}
              >
                Pagar Ahora
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleSimulatePayment}
        title="¿Confirmar registro de pago?"
        description={`Estás por registrar un pago de ${formatCOP(finalTotal)} para ${selectedInvoices.length} factura(s). Una vez confirmado, TBS validará el recaudo para liberar tu cupo.`}
        confirmLabel="Sí, registrar pago"
        cancelLabel="Revisar selección"
        variant="financial"
        isLoading={isProcessing}
      />
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

interface InvoiceRowProps {
  key?: React.Key;
  invoice: Invoice;
  selected: boolean;
  onToggle: () => void;
  statusColor: string;
  onShowDetail: () => void;
  onReportDispute: (inv: Invoice) => void;
  isHighlighted?: boolean;
}

function InvoiceRow({ invoice, selected, onToggle, onShowDetail, onReportDispute, isHighlighted }: Omit<InvoiceRowProps, 'statusColor'>) {
  const isSelectable = invoice.balance > 0;

  return (
    <div className={`relative transition-all px-6 py-5 flex items-center gap-6 ${isHighlighted ? 'bg-rojo-suave/50 animate-pulse' : selected ? 'bg-rojo/5 shadow-inner' : 'bg-white hover:bg-gray-50/50'}`}>
      {/* Col 1: Action (Selection) */}
      <div className="shrink-0">
        <button 
          disabled={!isSelectable}
          onClick={onToggle}
          className={`w-9 h-9 rounded-xl border-2 transition-all flex items-center justify-center cursor-pointer disabled:cursor-not-allowed ${
            selected 
              ? 'bg-rojo border-rojo text-white shadow-md shadow-rojo/20' 
              : 'border-borde bg-white hover:border-rojo/50'
          } ${!isSelectable ? 'opacity-20 bg-gray-50' : ''}`}
        >
          {selected ? <Check size={18} strokeWidth={4} /> : <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />}
        </button>
      </div>
      
      {/* Col 2: Basic Info (Number/Site) */}
      <div className="w-48 shrink-0">
        <div className="flex items-center gap-2 mb-1">
           <div className={`text-[9px] font-black uppercase tracking-tight leading-none ${invoice.hasDispute ? 'text-amber-600' : 'text-gris'}`}>
              {invoice.hasDispute ? 'Disputa Comercial' : 'Documento'}
           </div>
           {!invoice.hasDispute && (
             <button 
               onClick={(e) => { e.stopPropagation(); onReportDispute(invoice); }}
               className="px-1.5 py-0.5 bg-gray-50 text-gris/60 text-[8px] font-black rounded uppercase flex items-center gap-1 hover:bg-amber-50 hover:text-amber-700 transition-colors border border-transparent hover:border-amber-200"
             >
                <HelpCircle size={10} /> Reportar Disputa
             </button>
           )}
        </div>
        <div className="text-sm font-black text-texto tracking-tight flex items-center gap-1.5">
          {invoice.hasDispute && <span className="text-amber-600 text-[10px] bg-amber-50 px-1 rounded border border-amber-200">DISPUTA</span>} {invoice.number}
          <button onClick={onShowDetail} className="text-gris/40 hover:text-rojo transition-colors cursor-pointer">
             <Info size={12} />
          </button>
        </div>
        <div className="text-[9px] font-bold text-gris truncate mt-0.5">
          {invoice.site} <span className="opacity-30 mx-1">/</span> {invoice.city}
        </div>
      </div>

      {/* Col 3: Grid Data (Fixed width columns for alignment) */}
      <div className="flex-1 grid grid-cols-3 xl:grid-cols-4 gap-4 items-center">
        {/* Vencimiento */}
        <div className="min-w-0">
          <div className="text-[9px] font-black uppercase text-gris tracking-tight mb-1">Vencimiento</div>
          <div className="text-xs font-black text-texto truncate">{invoice.dueDate}</div>
          {invoice.status === 'vencida' ? (
             <div className="text-[9px] font-black text-rojo truncate uppercase flex items-center gap-1">
                <AlertCircle size={8} /> {invoice.daysOverdue} días de mora
             </div>
          ) : (
             <div className={`text-[9px] font-bold uppercase truncate ${invoice.status === 'por_vencer' ? 'text-amber-600' : 'text-gris/60'}`}>
                {invoice.status === 'por_vencer' ? `Vence en ${invoice.daysUntilDue} días` : invoice.status === 'pagada' ? 'Conciliado' : 'Pendiente'}
             </div>
          )}
        </div>

        {/* Pedido */}
        <div className="hidden xl:block min-w-0">
          <div className="text-[9px] font-black uppercase text-gris tracking-tight mb-1">Pedido</div>
          <div className="text-xs font-black text-texto flex items-center gap-1 truncate">
             {invoice.orderNumber}
             <ExternalLink size={10} className="text-gris/20 shrink-0" />
          </div>
        </div>

        {/* Estado Badge */}
        <div className="min-w-0">
           <InvoiceStatusBadge status={invoice.status} hasDispute={invoice.hasDispute} />
        </div>

        {/* Saldo Pendiente */}
        <div className="min-w-0 text-right xl:text-left">
          <div className="text-[9px] font-black uppercase text-gris tracking-tight mb-1">Saldo</div>
          <div className={`text-sm font-black ${invoice.balance > 0 ? 'text-rojo' : 'text-green-600'} tracking-tight`}>
            {formatCOP(invoice.balance)}
          </div>
          <div className="text-[8px] font-bold text-gris opacity-40 uppercase">Total: {formatCOP(invoice.value)}</div>
        </div>
      </div>

      {/* Col 4: Secondary Actions */}
      <div className="shrink-0 flex items-center gap-3">
        {/* We use a fixed width container for the partial payment icon to keep alignment even if hidden */}
        <div className="w-10 flex justify-center">
           {invoice.allowsPartialPayment && invoice.balance > 0 ? (
              <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center cursor-help group/tip relative">
                 <DollarSign size={18} />
                 <div className="absolute bottom-full mb-3 right-0 bg-texto text-white text-[9px] p-3 rounded-xl shadow-xl opacity-0 group-hover/tip:opacity-100 transition-opacity w-48 font-bold pointer-events-none z-20">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap size={10} className="text-blue-400" fill="currentColor" />
                      <span>Pago Parcial Habilitado</span>
                    </div>
                    Esta factura permite abonos desde {formatCOP(invoice.minimumPartialPayment || 0)}. Al pagar liberas cupo proporcional.
                    <div className="absolute top-full right-4 transform translate-y-[-50%] rotate-45 w-2 h-2 bg-texto" />
                 </div>
              </div>
           ) : null}
        </div>
        <button 
          onClick={onShowDetail} 
          className="w-9 h-9 bg-gray-50 text-gris/60 hover:bg-texto hover:text-white rounded-full flex items-center justify-center transition-all cursor-pointer border border-transparent shadow-sm"
        >
           <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

function PaymentMethodBtn({ id, label, active, onClick, disabled = false }: { id: string, label: string, active: boolean, onClick: () => void, disabled?: boolean }) {
  return (
    <button 
      onClick={!disabled ? onClick : undefined}
      className={`relative w-full h-16 rounded-xl border-2 flex items-center justify-center transition-all cursor-pointer ${
        active 
          ? 'border-rojo bg-rojo-suave/30 text-rojo scale-[1.03]' 
          : 'border-borde bg-white text-gris hover:border-gris/30'
      } ${disabled ? 'cursor-not-allowed border-gray-100 text-gray-300' : ''}`}
    >
      <span className="text-xs font-black uppercase tracking-widest">{label}</span>
      {active && (
        <div className="absolute -top-2 -right-2 w-5 h-5 bg-rojo text-white rounded-full flex items-center justify-center">
          <CheckCircle2 size={12} />
        </div>
      )}
    </button>
  );
}

function PaymentRegistrationForm({ onCancel, onFinish }: { onCancel: () => void, onFinish: () => void }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    reference: '',
    bank: 'Bancolombia',
    notes: '',
  });
  const [file, setFile] = useState<File | null>(null);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl border border-borde p-8 tbs-shadow"
    >
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 mb-1">Registro de soporte</div>
          <h3 className="text-3xl font-black text-texto tracking-tighter tracking-tight">Carga tu comprobante</h3>
        </div>
        <button onClick={onCancel} className="text-gris hover:text-rojo transition-colors cursor-pointer p-2">
          <X size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-gris uppercase tracking-widest pl-1">Fecha de pago</label>
          <div className="relative">
            <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gris" size={18} />
            <input 
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full h-12 bg-gray-50 border border-borde rounded-xl pl-12 pr-4 font-semibold outline-none focus:border-orange-500 transition-colors"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-gris uppercase tracking-widest pl-1">Monto pagado</label>
          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gris" size={18} />
            <input 
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              placeholder="0.00"
              className="w-full h-12 bg-gray-50 border border-borde rounded-xl pl-12 pr-4 font-semibold outline-none focus:border-orange-500 transition-colors"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-gris uppercase tracking-widest pl-1">Referencia / CUS</label>
          <div className="relative">
            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gris" size={18} />
            <input 
              type="text"
              value={formData.reference}
              onChange={(e) => setFormData({...formData, reference: e.target.value})}
              placeholder="Ej: 98213456"
              className="w-full h-12 bg-gray-50 border border-borde rounded-xl pl-12 pr-4 font-semibold outline-none focus:border-orange-500 transition-colors"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-gris uppercase tracking-widest pl-1">Banco / Origen</label>
          <div className="relative">
            <WalletCards className="absolute left-4 top-1/2 -translate-y-1/2 text-gris" size={18} />
            <select 
              value={formData.bank}
              onChange={(e) => setFormData({...formData, bank: e.target.value})}
              className="w-full h-12 bg-gray-50 border border-borde rounded-xl pl-12 pr-4 font-semibold outline-none focus:border-orange-500 transition-colors appearance-none"
            >
              <option>Bancolombia</option>
              <option>Davivienda</option>
              <option>PSE / ACH</option>
              <option>Nequi / Daviplata</option>
              <option>Corresponsal Bancario</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gris pointer-events-none" size={18} />
          </div>
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="text-[10px] font-black text-gris uppercase tracking-widest pl-1">Soporte adjunto (Imagen/PDF)</label>
          <div className="border-2 border-dashed border-borde rounded-2xl p-8 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-50 transition-colors group">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-gris group-hover:text-orange-500 shadow-sm transition-colors mb-3">
              <Upload size={24} />
            </div>
            {file ? (
              <div className="text-center font-bold text-texto-sec">
                <p className="text-sm">{file.name}</p>
                <button onClick={() => setFile(null)} className="mt-2 text-xs text-rojo font-black uppercase hover:underline">Quitar archivo</button>
              </div>
            ) : (
              <>
                <p className="text-sm font-bold text-texto text-center">Arrastra aquí tu comprobante o haz clic para buscar</p>
                <p className="text-[10px] font-semibold text-gris mt-1">Formatos: JPG, PNG, PDF (Máx. 5MB)</p>
                <input 
                  type="file" 
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                />
              </>
            )}
          </div>
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="text-[10px] font-black text-gris uppercase tracking-widest pl-1">Notas adicionales (Opcional)</label>
          <textarea 
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            placeholder="Alguna observación sobre tu pago..."
            className="w-full h-24 bg-gray-50 border border-borde rounded-xl p-4 font-semibold outline-none focus:border-orange-500 transition-colors resize-none"
          />
        </div>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <button 
          onClick={onCancel}
          className="flex-1 py-4 border-2 border-borde text-texto rounded-xl font-black hover:bg-gray-50 transition-all cursor-pointer"
        >
          Cancelar
        </button>
        <button 
          onClick={onFinish}
          disabled={!formData.amount || !formData.reference}
          className="flex-[2] py-4 bg-orange-500 text-white rounded-xl font-black hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          Enviar soporte para validación
        </button>
      </div>

      <div className="mt-6 flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
        <Info size={18} className="text-blue-600 shrink-0 mt-0.5" />
        <p className="text-[10px] font-bold text-blue-800 leading-normal">
          Tu soporte será revisado por nuestro equipo de recaudo. Una vez validado, el saldo se aplicará a tus facturas pendientes y se liberará tu pedido para despacho.
        </p>
      </div>
    </motion.div>
  );
}

function InvoiceStatusBadge({ status, hasDispute }: { status: Invoice['status'], hasDispute?: boolean }) {
  const getStatusConfig = (s: Invoice['status'], dispute?: boolean) => {
    if (dispute) {
      return { 
        label: 'En Disputa', 
        class: 'bg-amber-500 text-white border-amber-600 shadow-sm shadow-amber-200', 
        icon: AlertCircle 
      };
    }

    switch(s) {
      case 'pagada': return { label: 'Conciliado', class: 'bg-green-50 text-green-700 border-green-100', icon: CheckCircle2 };
      case 'vencida': return { label: 'Vencido', class: 'bg-rojo-suave text-rojo border-rojo/10', icon: AlertCircle };
      case 'por_vencer': return { label: 'Próximo', class: 'bg-amber-50 text-amber-700 border-amber-100', icon: Clock };
      case 'pendiente': return { label: 'Pendiente', class: 'bg-blue-50 text-blue-700 border-blue-100', icon: Clock };
      default: return { label: s, class: 'bg-gray-50 text-gris border-borde', icon: Info };
    }
  }

  const config = getStatusConfig(status, hasDispute);
  const Icon = config.icon;

  return (
    <div className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 w-fit ${config.class}`}>
      <Icon size={10} strokeWidth={3} />
      {config.label}
    </div>
  );
}

function getStatusColor(status: Invoice['status']) {
  switch(status) {
    case 'pagada': return 'text-green-600 bg-green-50 border-green-100';
    case 'vencida': return 'text-rojo bg-rojo-suave border-rojo/10';
    case 'por_vencer': return 'text-amber-600 bg-amber-50 border-amber-100';
    case 'pendiente': return 'text-blue-600 bg-blue-50 border-blue-100';
    default: return 'text-gris bg-gray-50 border-borde';
  }
}
