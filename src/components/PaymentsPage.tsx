import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  CreditCard, 
  Wallet, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  FileText,
  Info,
  ExternalLink,
  ChevronDown,
  X,
  CreditCard as CreditCardIcon,
  MessageSquare,
  TrendingUp,
  Upload,
  Calendar as CalendarIcon,
  DollarSign,
  Hash,
  WalletCards
} from 'lucide-react';
import { User, Invoice, InvoiceStatus, PaymentRecord } from '../types';
import { useAnalytics } from '../hooks/useAnalytics';

interface PaymentsPageProps {
  currentUser: User | null;
  onBackToAccount: () => void;
  onGoHome: () => void;
  onGoAccount: () => void;
  onGoAdvisorChat: (topic?: any, context?: any) => void;
  onGoCreditRequest?: () => void;
  highlightedInvoiceId?: string | null;
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

const DUMMY_INVOICES: Invoice[] = [
  {
    id: "inv-001",
    number: "FV-88321",
    issueDate: "2026-04-18",
    dueDate: "2026-05-08",
    value: 1250000,
    balance: 1250000,
    status: "por_vencer",
    orderNumber: "TBS-10245",
    description: "Pedido de whisky, ron y ginebra"
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
    description: "Pedido de vodka y tequila"
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
    description: "Pedido de aguardiente y ron"
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
    description: "Pedido surtido para evento"
  },
  {
    id: "inv-005",
    number: "FV-87992",
    issueDate: "2026-03-20",
    dueDate: "2026-04-10",
    value: 980000,
    balance: 0,
    status: "pagada",
    orderNumber: "TBS-10172",
    description: "Pedido de vinos y espumantes"
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
  onClearHighlight
}: PaymentsPageProps) {
  const analytics = useAnalytics(currentUser);
  const isCash = currentUser?.commercialCondition === 'contado';
  const [filter, setFilter] = useState<InvoiceStatus | 'todos'>('todos');
  const [search, setSearch] = useState('');
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [franchise, setFranchise] = useState<string>('Visa');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [detailInvoice, setDetailInvoice] = useState<Invoice | null>(null);
  const [showRegistrationMode, setShowRegistrationMode] = useState(false);

  const filteredInvoices = useMemo(() => {
    return DUMMY_INVOICES.filter(inv => {
      const matchesFilter = filter === 'todos' || inv.status === filter;
      const matchesSearch = inv.number.toLowerCase().includes(search.toLowerCase()) || 
                           (inv.orderNumber && inv.orderNumber.toLowerCase().includes(search.toLowerCase()));
      return matchesFilter && matchesSearch;
    });
  }, [filter, search]);

  const stats = useMemo(() => {
    const pendingBalance = DUMMY_INVOICES.reduce((sum, inv) => sum + inv.balance, 0);
    const overdueCount = DUMMY_INVOICES.filter(inv => inv.status === 'vencida').length;
    return {
      limit: currentUser?.creditLimit || (isCash ? 0 : 5000000),
      available: currentUser?.availableCredit || (isCash ? 0 : 3250000),
      pending: pendingBalance,
      overdue: overdueCount
    };
  }, [currentUser, isCash]);

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
    const inv = DUMMY_INVOICES.find(i => i.id === id);
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
      const inv = DUMMY_INVOICES.find(i => i.id === id);
      analytics.track('invoice_selected', 'payments', {
        productId: inv?.id,
        metadata: { invoiceNumber: inv?.number, balance: inv?.balance }
      });
    }
  };

  const handleSimulatePayment = () => {
    if (selectedInvoices.length === 0 || !paymentMethod) return;
    setIsProcessing(true);

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
    }, 1500);
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
                  const inv = DUMMY_INVOICES.find(i => i.id === id);
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
              <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-texto mb-2">
                {isCash ? 'Pagos y comprobantes' : 'Cartera y pagos'}
              </h1>
              <p className="text-gris font-medium text-lg leading-relaxed max-w-2xl">
                {isCash 
                  ? 'Gestiona tus pagos de contado, registra nuevos soportes y consulta tus comprobantes confirmados.'
                  : 'Consulta tus facturas, vencimientos, cupo disponible y realiza pagos de forma centralizada.'
                }
              </p>
            </div>
            <div className="bg-gray-50 px-6 py-4 rounded-2xl border border-borde">
              <div className="text-[10px] font-black uppercase tracking-widest text-rojo mb-1 tracking-tighter">Negocio Registrado</div>
              <div className="text-lg font-black text-texto">{currentUser?.businessName || 'Cargando...'}</div>
              <div className="text-xs font-extrabold text-gris mt-1 uppercase tracking-tight">
                {currentUser?.city} · {isCash ? 'Cliente Contado' : (currentUser?.customerType || 'Cliente B2B')}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1480px] mx-auto px-8 mt-10">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {!isCash && <StatCard title="Cupo asignado" value={formatCOP(stats.limit)} icon={Wallet} />}
          {!isCash && <StatCard title="Cupo disponible" value={formatCOP(stats.available)} icon={CheckCircle2} color="text-green-600" />}
          <StatCard title={isCash ? "Facturas pendientes" : "Saldo pendiente"} value={formatCOP(stats.pending)} icon={Clock} color="text-yellow-600" />
          {!isCash && <StatCard title="Facturas vencidas" value={stats.overdue.toString()} icon={AlertCircle} color="text-red-600" />}
          {isCash && <StatCard title="Pagos en validación" value="2" icon={Clock} color="text-orange-500" />}
          {isCash && <StatCard title="Comprobantes" value="12" icon={FileText} color="text-blue-500" />}
        </div>

        {/* Credit Usage Bar - Only for Credit Customers */}
        {!isCash && (
          <div className="bg-white p-8 rounded-3xl border border-borde tbs-shadow mb-10">
            <div className="flex justify-between items-end mb-4">
              <div>
                <h3 className="text-sm font-black text-texto uppercase tracking-widest mb-1">Uso del cupo</h3>
                <p className="text-gris-oscuro font-bold">Has usado <span className="text-texto font-black">{formatCOP(usedCredit)}</span> de {formatCOP(stats.limit)}</p>
              </div>
              <span className={`text-sm font-black ${usedPercentage > 80 ? 'text-rojo' : 'text-texto'}`}>{usedPercentage.toFixed(0)}%</span>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${usedPercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full ${progressColor()}`}
              />
            </div>
          </div>
        )}

        {/* Banner Solicitud Crédito - Adapted for Cash */}
        <div className={`rounded-3xl p-8 border mb-10 flex flex-col md:flex-row items-center justify-between gap-6 ${isCash ? 'bg-orange-50 border-orange-100' : 'bg-gradient-to-r from-rojo/10 to-rojo-suave/30 border-rojo/20'}`}>
          <div className="flex items-center gap-6">
            <div className={`w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm ${isCash ? 'text-orange-500' : 'text-rojo'}`}>
              <TrendingUp size={32} />
            </div>
            <div>
              <h3 className="text-xl font-black text-texto mb-1">
                {isCash ? '¿Deseas comprar a crédito con TBS?' : '¿Necesitas un cupo de crédito mayor?'}
              </h3>
              <p className="text-gris-oscuro font-medium">
                {isCash 
                  ? 'Como cliente contado pagas antes de recibir. Solicita un análisis de crédito para obtener cupo y plazos de pago.'
                  : 'Incrementa tu capacidad de compra o solicita un nuevo crédito 100% digital.'
                }
              </p>
            </div>
          </div>
          <button 
            onClick={onGoCreditRequest}
            className={`px-8 py-4 text-white rounded-xl font-black transition-all shadow-lg whitespace-nowrap cursor-pointer ${isCash ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20' : 'bg-rojo hover:bg-rojo-oscuro shadow-rojo/20'}`}
          >
            {isCash ? 'Solicitar estudio de crédito' : 'Solicitar aumento de cupo'}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main List Area */}
          <div className="flex-1 min-w-0">
            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <div className="flex flex-nowrap overflow-x-auto gap-2 pb-2 md:pb-0 scrollbar-hide flex-1">
                {(['todos', 'pendiente', 'por_vencer', 'vencida', 'pagada'] as const).map(status => (
                  <button
                    key={status}
                    onClick={() => {
                      setFilter(status);
                      setShowRegistrationMode(false);
                    }}
                    className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                      filter === status && !showRegistrationMode
                        ? 'bg-texto text-white shadow-lg' 
                        : 'bg-white text-gris border border-borde hover:border-rojo/30 hover:text-rojo'
                    }`}
                  >
                    {status === 'por_vencer' ? 'Por vencer' : status.replace('_', ' ')}
                  </button>
                ))}
                {isCash && (
                  <button
                    onClick={() => setShowRegistrationMode(true)}
                    className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                      showRegistrationMode 
                        ? 'bg-orange-500 text-white shadow-lg' 
                        : 'bg-white text-orange-500 border border-orange-200 hover:bg-orange-50'
                    }`}
                  >
                    Registrar soporte de pago
                  </button>
                )}
              </div>
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gris" size={20} />
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por número de factura o pedido"
                  className="w-full h-12 bg-white border border-borde rounded-xl pl-12 pr-6 font-semibold outline-none focus:border-rojo transition-colors"
                />
              </div>
            </div>

            {/* Invoices List or Registration Mode */}
            {showRegistrationMode ? (
              <PaymentRegistrationForm onCancel={() => setShowRegistrationMode(false)} onFinish={handleSimulatePayment} />
            ) : (
              <div className="space-y-4">
                {filteredInvoices.length > 0 ? (
                  filteredInvoices.map(inv => (
                    <InvoiceRow 
                      key={inv.id} 
                      invoice={inv} 
                      selected={selectedInvoices.includes(inv.id)}
                      onToggle={() => handleToggleInvoice(inv.id)}
                      statusColor={getStatusColor(inv.status)}
                      onShowDetail={() => setDetailInvoice(inv)}
                      isHighlighted={highlightedInvoiceId === inv.number}
                    />
                  ))
                ) : (
                  <div className="bg-white rounded-3xl p-20 border border-dash border-borde text-center">
                    <div className="w-16 h-16 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText size={32} />
                    </div>
                    <h3 className="text-xl font-black text-texto mb-2">No encontramos resultados</h3>
                    <p className="text-gris font-medium">Intenta con otros filtros o términos de búsqueda.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Payment Panel (Sticky Sidebar) */}
          <div className="lg:w-[400px] shrink-0">
            <div className="sticky top-10">
              <div className="bg-white rounded-3xl border border-borde tbs-shadow overflow-hidden">
                <div className="p-8 bg-gray-50 border-b border-borde">
                  <h2 className="text-2xl font-black tracking-tighter text-texto mb-2">Resumen de pago</h2>
                  <p className="text-xs font-bold text-gris uppercase tracking-widest leading-relaxed">
                    Selecciona facturas de la lista para gestionar tus pagos pendientes.
                  </p>
                </div>
                
                <div className="p-8 space-y-8">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gris font-bold">Facturas seleccionadas</span>
                      <span className="text-texto font-black">{selectedInvoices.length}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-t border-borde pt-4">
                      <span className="text-gris font-bold">Subtotal</span>
                      <span className="text-texto font-black">{formatCOP(totalToPay)}</span>
                    </div>
                    {paymentMethod === 'card' && totalToPay > 0 && (
                      <div className="flex justify-between items-center text-sm text-rojo">
                        <span className="font-bold uppercase tracking-tight text-[10px]">Comisión {franchise} ({commissionRate * 100}%)</span>
                        <span className="font-black">{formatCOP(commissionValue)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center border-t border-borde pt-4">
                      <span className="text-gris font-black uppercase tracking-widest text-xs">Total a pagar</span>
                      <span className="text-3xl font-black text-rojo">{formatCOP(finalTotal)}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-gris border-b pb-2">Selecciona método de pago</h3>
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
                          label="Crédito B2B" 
                          active={false} 
                          onClick={() => {}} 
                          disabled 
                        />
                      </div>
                    </div>
                    
                    {paymentMethod === 'card' && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-borde animate-in fade-in slide-in-from-top-2">
                        <label className="block text-[10px] font-black text-gris uppercase tracking-[0.1em] mb-3">Selecciona Franquicia</label>
                        <div className="flex flex-wrap gap-2">
                          {['Visa', 'MasterCard', 'American Express'].map(f => (
                            <button
                              key={f}
                              onClick={() => setFranchise(f)}
                              className={`flex-1 min-w-[80px] py-2 rounded-lg text-[10px] font-black border transition-all cursor-pointer ${
                                franchise === f 
                                  ? 'bg-rojo text-white border-rojo' 
                                  : 'bg-white text-gris border-borde hover:border-rojo/30'
                              }`}
                            >
                              {f}
                            </button>
                          ))}
                        </div>
                        <p className="text-[10px] font-bold text-gris mt-3 italic leading-tight">
                          * {franchise === 'American Express' ? 'Amex tiene un recargo del 3%' : 'Visa/MC tienen un recargo del 2%'} por gestión administrativa.
                        </p>
                      </div>
                    )}
                  </div>

                  <button 
                    disabled={selectedInvoices.length === 0 || !paymentMethod || isProcessing}
                    onClick={handleSimulatePayment}
                    className="w-full py-6 rounded-[24px] bg-texto text-white font-black text-xl tbs-shadow hover:bg-rojo hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-3 cursor-pointer"
                  >
                    {isProcessing ? (
                      <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Pagar ahora <ArrowLeft className="rotate-180" size={22} />
                      </>
                    )}
                  </button>

                  <div className="flex gap-4 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                    <Info size={20} className="text-blue-600 shrink-0" />
                    <p className="text-[11px] font-bold text-blue-800 leading-normal">
                      Tu pago será procesado y validado por nuestro equipo contable en un plazo de 24 a 48 horas hábiles.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Detail Modal */}
      <AnimatePresence>
        {detailInvoice && (
          <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDetailInvoice(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[32px] overflow-hidden tbs-shadow"
            >
              <div className="p-8 border-b border-borde flex justify-between items-start">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-rojo mb-1">Detalle de documento</div>
                  <h3 className="text-3xl font-black text-texto tracking-tighter">Factura {detailInvoice.number}</h3>
                </div>
                <button onClick={() => setDetailInvoice(null)} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer">
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <div className="text-[10px] font-black uppercase text-gris tracking-widest leading-none">Pedido Relacionado</div>
                    <div className="text-sm font-black text-texto">{detailInvoice.orderNumber}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] font-black uppercase text-gris tracking-widest leading-none">Estado</div>
                    <div className={`text-[10px] font-black px-2 py-0.5 rounded-full border inline-block uppercase tracking-wider ${getStatusColor(detailInvoice.status)}`}>
                      {detailInvoice.status.replace('_', ' ')}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] font-black uppercase text-gris tracking-widest leading-none">Emisión</div>
                    <div className="text-sm font-black text-texto">{detailInvoice.issueDate}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] font-black uppercase text-gris tracking-widest leading-none">Vencimiento</div>
                    <div className="text-sm font-black text-texto">{detailInvoice.dueDate}</div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl space-y-1">
                  <div className="text-[10px] font-black uppercase text-gris tracking-widest leading-none">Descripción del pedido</div>
                  <div className="text-sm font-bold text-texto-sec leading-relaxed">{detailInvoice.description}</div>
                </div>

                <div className="pt-6 border-t border-borde space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gris">Valor Total</span>
                    <span className="text-lg font-black text-texto">{formatCOP(detailInvoice.value)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm font-bold text-gris">Saldo Pendiente</span>
                    <span className="text-2xl font-black text-rojo">{formatCOP(detailInvoice.balance)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 border border-[#F0D3D3] bg-rojo-suave rounded-2xl">
                  <Info size={18} className="text-rojo shrink-0" />
                  <p className="text-[11px] font-bold text-rojo-oscuro">
                    Documento sujeto a validación contable y condiciones comerciales según contrato B2B.
                  </p>
                </div>
              </div>
              <div className="px-8 pb-3">
                <button 
                  onClick={() => {
                  onGoAdvisorChat('cartera', { label: `Factura ${detailInvoice.number}`, type: 'factura' });
                    setDetailInvoice(null);
                  }}
                  className="w-full py-4 border-2 border-rojo text-rojo bg-white rounded-xl font-black hover:bg-rojo-suave transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare size={18} /> Consultar asesor por esta factura
                </button>
              </div>
              <div className="px-8 pb-8">
                <button 
                  onClick={() => setDetailInvoice(null)}
                  className="w-full py-4 bg-texto text-white rounded-xl font-black hover:bg-rojo transition-all cursor-pointer"
                >
                  Entendido
                </button>
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

interface InvoiceRowProps {
  key?: React.Key;
  invoice: Invoice;
  selected: boolean;
  onToggle: () => void;
  statusColor: string;
  onShowDetail: () => void;
  isHighlighted?: boolean;
}

function InvoiceRow({ invoice, selected, onToggle, statusColor, onShowDetail, isHighlighted }: InvoiceRowProps) {
  const isSelectable = invoice.balance > 0;

  return (
    <div className={`relative group bg-white rounded-2xl border transition-all p-5 hover:tbs-shadow flex flex-col md:flex-row items-start md:items-center gap-6 ${isHighlighted ? 'border-rojo ring-2 ring-rojo ring-offset-4 animate-pulse' : selected ? 'border-rojo ring-1 ring-rojo/20' : 'border-borde'}`}>
      {isHighlighted && (
        <div className="absolute -top-3 left-6 px-2 py-0.5 bg-rojo text-white text-[9px] font-black rounded-lg uppercase tracking-widest shadow-lg z-10">
          Factura Notificada
        </div>
      )}
      <div className="flex items-center gap-4 w-full md:w-auto">
        <button 
          disabled={!isSelectable}
          onClick={onToggle}
          className={`w-6 h-6 rounded-md border-2 transition-all flex items-center justify-center cursor-pointer disabled:cursor-not-allowed ${
            selected 
              ? 'bg-rojo border-rojo text-white' 
              : 'border-borde bg-white hover:border-rojo/50'
          } ${!isSelectable ? 'opacity-20 bg-gray-50' : ''}`}
        >
          {selected && <CheckCircle2 size={16} />}
        </button>
        
        <div className="flex-1 md:w-32">
          <div className="text-[10px] font-black uppercase text-gris leading-none mb-1">Factura</div>
          <div className="text-sm font-black text-texto">{invoice.number}</div>
        </div>
      </div>

      <div className="flex-1 min-w-0 grid grid-cols-2 lg:grid-cols-4 gap-6 w-full md:w-auto">
        <div>
          <div className="text-[10px] font-black uppercase text-gris leading-none mb-1">Pedido</div>
          <div className="text-sm font-bold text-texto-sec truncate">{invoice.orderNumber}</div>
        </div>
        <div className="hidden lg:block">
          <div className="text-[10px] font-black uppercase text-gris leading-none mb-1">Vencimiento</div>
          <div className="text-sm font-bold text-texto-sec">{invoice.dueDate}</div>
        </div>
        <div>
          <div className="text-[10px] font-black uppercase text-gris leading-none mb-1">Estado</div>
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border inline-block uppercase tracking-wider ${statusColor}`}>
            {invoice.status.replace('_', ' ')}
          </span>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-black uppercase text-gris leading-none mb-1">Saldo</div>
          <div className={`text-sm font-black ${invoice.balance > 0 ? 'text-rojo' : 'text-texto'}`}>{formatCOP(invoice.balance)}</div>
        </div>
      </div>

      <div className="flex items-center gap-4 w-full md:w-auto justify-end border-t md:border-t-0 pt-4 md:pt-0">
        <div className="text-right hidden sm:block">
          <div className="text-[10px] font-black uppercase text-gris leading-none mb-1">Valor Total</div>
          <div className="text-xs font-black text-texto">{formatCOP(invoice.value)}</div>
        </div>
        <button 
          onClick={onShowDetail}
          className="p-3 bg-gray-50 text-gris hover:bg-rojo-suave hover:text-rojo rounded-xl transition-all cursor-pointer"
        >
          <ExternalLink size={18} />
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
