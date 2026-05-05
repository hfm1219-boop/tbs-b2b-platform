import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  MapPin,
  CalendarDays,
  Clock,
  MessageSquareText,
  PackageCheck,
  ShoppingCart,
  Truck,
  WalletCards,
  Tag,
  AlertCircle,
  ShieldCheck,
  Zap,
  Building2,
  Info,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  History,
  X
} from 'lucide-react';
import { 
  CartItem, 
  User, 
  PendingApprovalOrder, 
  B2BCompanyAccount, 
  ApprovalStatus, 
  ApprovalReason,
  ApprovalOrderLine,
  ManagedClient,
  ManagedEvent,
  ManagedClientBillingType
} from '../types';
import { useAnalytics } from '../hooks/useAnalytics';
import { Button, ConfirmDialog, ProgressStep, Tooltip } from './ui';
import { useToasts } from './ToastContext';

interface CheckoutPageProps {
  items: CartItem[];
  currentUser: User | null;
  companyAccount: B2BCompanyAccount;
  onBack: () => void;
  onFinish: () => void;
  onCreatePendingApprovalOrder: (order: PendingApprovalOrder) => void;
  onGoOrderApprovals: () => void;
  hospitalityContext?: {
    partnerId: string;
    managedClientId: string;
    managedEventId?: string;
    billingType: ManagedClientBillingType;
  } | null;
  managedClients?: ManagedClient[];
  managedEvents?: ManagedEvent[];
}

function parsePrice(price: string) {
  return Number(price.replace(/[^0-9]/g, '')) || 0;
}

function formatCOP(value: number) {
  return value.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  });
}

export function CheckoutPage({ 
  items, 
  currentUser, 
  companyAccount,
  onBack, 
  onFinish,
  onCreatePendingApprovalOrder,
  onGoOrderApprovals,
  hospitalityContext,
  managedClients = [],
  managedEvents = []
}: CheckoutPageProps) {
  const analytics = useAnalytics(currentUser);
  const toasts = useToasts();
  const isCash = currentUser?.commercialCondition === 'contado';
  const [confirmed, setConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [needsApproval, setNeedsApproval] = useState(false);
  const [approvalReason, setApprovalReason] = useState<{key: ApprovalReason, label: string} | null>(null);
  const [validationMessage, setValidationMessage] = useState<{type: 'info' | 'warning', text: string} | null>(null);
  const [orderType, setOrderType] = useState<'normal' | 'urgente'>('normal');
  const [selectedBranchId, setSelectedBranchId] = useState<string>(currentUser?.assignedBranchIds?.[0] || 'sucursal-001');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    context: true,
    validations: false,
    shipping: true,
    payment: true
  });

  const [simulatedValidations, setSimulatedValidations] = useState({
    stock: 'validating',
    credit: 'validating',
    logistics: 'validating',
    commercial: 'validating'
  });

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const pkgPrice = item.packaging?.packagePrice || (parsePrice(item.product.price) * (item.packaging?.unitsPerPackage || 1));
      const qty = item.packageQuantity || 1;
      return sum + (pkgPrice * qty);
    }, 0);
  }, [items]);

  useEffect(() => {
    // Simulate initial validations
    const timer = setTimeout(() => {
      setSimulatedValidations({
        stock: 'passed',
        credit: subtotal > (currentUser?.availableCredit || 0) ? 'warning' : 'passed',
        logistics: 'passed',
        commercial: 'passed'
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, [subtotal, currentUser?.availableCredit]);

  const [form, setForm] = useState({
    contactName: currentUser?.name || 'Humberto',
    phone: '',
    city: currentUser?.city || 'Bogotá',
    address: '',
    deliveryDate: '',
    deliveryWindow: 'Mañana: 8:00 a.m. - 12:00 p.m.',
    paymentMethod: isCash ? 'PSE' : 'Crédito B2B',
    cardFranchise: 'Visa', // New field
    notes: '',
  });

  const totalUnits = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.totalUnits || item.quantity), 0);
  }, [items]);

  const ivaEstimado = Math.round(subtotal * 0.19);
  const totalConIva = subtotal + ivaEstimado;

  const cardCommissionPercent = useMemo(() => {
    if (form.paymentMethod === 'Tarjeta de crédito') {
      if (form.cardFranchise === 'American Express') return 0.03;
      return 0.02; // Visa / Mastercard
    }
    return 0;
  }, [form.paymentMethod, form.cardFranchise]);

  const commissionValue = Math.round(totalConIva * cardCommissionPercent);
  const totalEstimado = totalConIva + commissionValue;

  const managedClient = managedClients.find(c => c.id === hospitalityContext?.managedClientId);
  const managedEvent = managedEvents.find(e => e.id === hospitalityContext?.managedEventId);

  // Track checkout view and form start
  useEffect(() => {
    analytics.track('checkout_viewed', 'checkout', {
      productCount: items.length,
      units: totalUnits,
      cartValue: totalEstimado
    });
    analytics.trackFormStart('checkout', 'checkout_page');
  }, [analytics, items.length, totalUnits, totalEstimado]);

  const isValid =
    form.contactName.trim() &&
    form.phone.trim() &&
    form.city.trim() &&
    form.address.trim() &&
    form.deliveryDate.trim() &&
    form.deliveryWindow.trim() &&
    form.paymentMethod.trim() &&
    !(isCash && form.paymentMethod === 'Crédito B2B');

  const handleChange = (
    field: keyof typeof form,
    value: string
  ) => {
    // Reset message on change
    setValidationMessage(null);

    if (field === 'paymentMethod') {
      if (value === 'Tarjeta de crédito') {
        setValidationMessage({
          type: 'info',
          text: "Atención: Los pagos con tarjeta de crédito tienen una comisión administrativa (Visa/Mastercard 2%, Amex 3%) que se sumará al total."
        });
      }
      
      if (isCash && value === 'Crédito B2B') {
        setValidationMessage({
          type: 'warning',
          text: "Tu cuenta está configurada como cliente contado. Para usar crédito B2B debes solicitar análisis y aprobación de cupo."
        });
      }
    }

    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleConfirm = async () => {
    if (!isValid) {
      analytics.trackFormSubmit('checkout', false, {
        reason: 'missing_required_fields_or_blocked_credit',
        productCount: items.length,
        totalValue: totalEstimado
      });
      return;
    }
    
    setIsSubmitting(true);

    // Logic for B2B Approvals and Limits
    let reqApproval = false;
    let reason: {key: ApprovalReason, label: string} | null = null;

    // 1. User individual limits (Not applicable for cash if we consider they pay first, but let's keep logic for safety)
    if (currentUser?.requiresApprovalAbove && currentUser.requiresApprovalAbove > 0 && totalEstimado > currentUser.requiresApprovalAbove) {
      reqApproval = true;
      reason = { key: 'supera_limite_usuario', label: 'Supera límite autorizado por pedido' };
    } else if (currentUser?.purchaseLimit && currentUser.purchaseLimit > 0 && totalEstimado > currentUser.purchaseLimit) {
      reqApproval = true;
      reason = { key: 'supera_limite_usuario', label: 'Supera límite de compra mensual' };
    }

    // 2. Company level approval rules
    if (!reqApproval && companyAccount?.approvalRules) {
      const activeRules = companyAccount.approvalRules.filter(r => r.active);
      for (const rule of activeRules) {
        // Check if rule applies to user role
        const roleMatch = !rule.appliesToRole || rule.appliesToRole === currentUser?.accountRole;
        // Check amount
        if (roleMatch && totalEstimado >= rule.minAmount) {
          reqApproval = true;
          reason = { key: 'manual', label: rule.name };
          break;
        }
      }
    }

    // 3. Urgent orders setting
    if (!reqApproval && form.deliveryWindow.includes('urgente') && companyAccount?.settings?.notifyUrgentOrders) {
      reqApproval = true;
      reason = { key: 'pedido_urgente', label: 'Pedido urgente requiere revisión' };
    }

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const orderPayload = {
        paymentMethod: form.paymentMethod,
        productCount: items.length,
        totalValue: totalEstimado,
        needsApproval: reqApproval,
        approvalReason: reason?.key,
        metadata: {
          commercialCondition: isCash ? "contado" : "credito",
          paymentPolicy: isCash ? "pago_anticipado" : "credito_aprobado"
        }
      };

      if (reqApproval) {
        // ... (existing logic)
        const newApprovalOrder: PendingApprovalOrder = {
          id: `appr-${Date.now()}`,
          orderNumber: `TBS-AP-${Math.floor(1000 + Math.random() * 9000)}`,
          createdAt: "Hoy, " + new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
          createdByUserId: (currentUser as any)?.id || 'user-001',
          createdByUserName: currentUser?.name || 'Usuario',
          cityId: companyAccount.cities.find(c => c.name === form.city)?.id || 'city-CTG',
          cityName: form.city,
          branchId: companyAccount.branches[0]?.id || 'branch-001',
          branchName: companyAccount.branches[0]?.name || 'Sucursal Principal',
          status: 'pendiente',
          reason: reason?.key || 'manual',
          reasonLabel: reason?.label || 'Revisión manual requerida',
          total: totalEstimado,
          userPurchaseLimit: currentUser?.purchaseLimit,
          approvalThreshold: currentUser?.requiresApprovalAbove,
          paymentMethod: form.paymentMethod,
          deliveryWindow: form.deliveryWindow,
          deliveryAddress: form.address,
          notes: form.notes,
          lines: items.map(item => ({
            id: `line-${item.product.id}-${Date.now()}`,
            productId: item.product.id,
            name: item.product.name,
            category: item.product.category,
            specs: item.product.specs,
            image: item.product.image,
            quantity: item.totalUnits || item.quantity,
            unitPrice: parsePrice(item.product.price),
            subtotal: (item.packaging?.packagePrice || parsePrice(item.product.price)) * (item.packageQuantity || 1),
            packagingLabel: item.packaging?.label,
            packageQuantity: item.packageQuantity
          })),
          approverUserIds: companyAccount.users.filter(u => u.role === 'master' || u.role === 'aprobador').map(u => u.id),
          decisions: []
        };
        
        onCreatePendingApprovalOrder(newApprovalOrder);
        toasts.warning("Revisión requerida", "Tu pedido ha sido enviado a aprobación según las reglas de tu cuenta.");
        analytics.track('order_approval_requested', 'checkout', orderPayload);
      } else {
        toasts.success("¡Pedido exitoso!", "Hemos recibido tu pedido correctamente.");
        analytics.track('order_completed', 'checkout', orderPayload);
      }

      analytics.trackFormSubmit('checkout', true, orderPayload);
      setNeedsApproval(reqApproval);
      setApprovalReason(reason);
      setConfirmed(true);
      setIsConfirmModalOpen(false);
    } catch (error) {
      console.error("Order error:", error);
      analytics.trackError('checkout_confirmation_failed', 'checkout', { error: error instanceof Error ? error.message : 'Unknown error' });
      alert("Error de conexión.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && !confirmed) {
    return (
      <main className="min-h-screen bg-[#FCFCFC] flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white rounded-2xl border border-[#F1F3F5] p-8 text-center shadow-sm">
          <div className="w-20 h-20 mx-auto rounded-full bg-rojo/10 flex items-center justify-center text-rojo">
            <ShoppingCart size={36} />
          </div>

          <h1 className="mt-5 text-2xl font-black text-texto">
            No tienes productos en el carrito
          </h1>

          <p className="mt-3 text-sm font-semibold text-gris leading-relaxed">
            Agrega productos desde el catálogo para poder continuar con el checkout.
          </p>

          <button
            onClick={onBack}
            className="mt-6 bg-rojo text-white rounded-lg px-6 py-3 font-black hover:bg-rojo-oscuro transition-colors cursor-pointer"
          >
            Volver al catálogo
          </button>
        </div>
      </main>
    );
  }

  if (confirmed) {
    return (
      <main className="min-h-screen bg-[#FCFCFC] flex items-center justify-center px-6">
        <div className="max-w-2xl w-full bg-white rounded-[40px] border border-[#F1F3F5] p-12 text-center tbs-shadow">
          <div className={`w-28 h-28 mx-auto rounded-full flex items-center justify-center shadow-xl mb-8 ${needsApproval ? 'bg-orange-50 text-orange-500' : 'bg-green-50 text-green-600'}`}>
            {needsApproval ? <Clock size={56} /> : <CheckCircle2 size={56} />}
          </div>

          <div className={`text-xs font-black uppercase tracking-[0.2em] mb-4 ${needsApproval ? 'text-orange-500' : (isCash ? 'text-orange-500' : 'text-rojo')}`}>
            {needsApproval ? 'Estatus: En aprobación' : (isCash ? 'Estatus: Pendiente de pago' : 'Estatus: Pedido recibido')}
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-texto tracking-tighter leading-none mb-6">
            {needsApproval 
              ? 'Tu pedido fue enviado a aprobación'
              : (isCash ? 'Pedido recibido - Pendiente de pago' : '¡Pedido enviado correctamente!')
            }
          </h1>

          <p className="text-lg font-medium text-gris leading-relaxed mb-10">
            {needsApproval 
              ? 'Tu pedido supera el límite autorizado o una regla de aprobación de tu cuenta. Un aprobador revisará el pedido antes de continuar con la validación comercial y logística.'
              : (isCash 
                  ? 'Tu pedido fue registrado. Continuará su proceso cuando el pago sea confirmado según el método seleccionado (Pago anticipado o confirmación de pago).' 
                  : 'Hemos recibido tu solicitud. El equipo TBS revisará disponibilidad, condiciones comerciales, cupo y ventana logística para confirmar tu entrega.')
            }
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
             <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 flex flex-col items-center">
                <span className="text-[10px] font-black text-gris uppercase tracking-widest mb-1">Total del pedido</span>
                <span className="text-2xl font-black text-texto tracking-tight">{formatCOP(totalEstimado)}</span>
             </div>
             {needsApproval && (
               <div className="p-6 bg-rojo-suave/50 rounded-3xl border border-rojo/10 flex flex-col items-center">
                  <span className="text-[10px] font-black text-rojo uppercase tracking-widest mb-1">Motivo de revisión</span>
                  <span className="text-sm font-black text-texto text-center leading-tight">{approvalReason?.label || 'Regla de aprobación activa'}</span>
               </div>
             )}
             {!needsApproval && (
               <div className="p-6 bg-green-50 rounded-3xl border border-green-100 flex flex-col items-center">
                  <span className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1">Fecha estimada</span>
                  <span className="text-lg font-black text-texto">Mañana</span>
               </div>
             )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {needsApproval ? (
              <Button
                onClick={onGoOrderApprovals}
                className="px-8 py-5 h-auto rounded-2xl text-sm uppercase tracking-widest gap-2"
                leftIcon={ShieldCheck}
              >
                Ver pedidos en aprobación
              </Button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                <Button
                  onClick={onFinish}
                  className="px-8 py-5 h-auto rounded-2xl text-sm uppercase tracking-widest gap-2"
                >
                  Ir a mis pedidos
                </Button>
                {isCash && (
                  <Button
                    onClick={() => { onFinish(); }}
                    variant="secondary"
                    className="px-8 py-5 h-auto bg-texto hover:bg-black text-white rounded-2xl text-sm uppercase tracking-widest gap-2"
                    leftIcon={CreditCard}
                  >
                    Ir a pagos
                  </Button>
                )}
              </div>
            )}
            <Button
              variant="ghost"
              onClick={onFinish}
              className="px-8 py-5 h-auto border-2 border-borde rounded-2xl text-sm uppercase tracking-widest"
            >
              Volver al inicio
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FCFCFC]">
      <div className="max-w-[1380px] mx-auto px-8 py-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-black text-gris hover:text-rojo transition-colors cursor-pointer"
        >
          <ArrowLeft size={18} />
          Volver al carrito
        </button>

        <div className="mt-6">
          <div className="text-[12px] font-black uppercase tracking-[0.18em] text-rojo">
            Checkout B2B
          </div>

          <h1 className="mt-2 text-4xl font-black tracking-[-0.04em] text-texto">
            Confirmar pedido
          </h1>

          <p className="mt-3 text-base font-semibold text-gris max-w-2xl leading-relaxed">
            Completa la información de entrega y pago. El pedido quedará sujeto a validación
            de inventario, condiciones comerciales, cupo y disponibilidad logística.
          </p>

          <div className="mt-8 max-w-3xl">
            <ProgressStep
              steps={[
                { title: 'Sucursal', status: 'completed' },
                { title: 'Validación', status: 'completed' },
                { title: 'Entrega', status: 'current' },
                { title: 'Pago', status: 'pending' },
              ]}
              orientation="horizontal"
            />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 pb-32 lg:pb-0">
          <section className="space-y-6">
            {/* Contexto de Compra / Sucursal */}
            <div className="bg-white rounded-3xl border border-[#F1F3F5] shadow-sm overflow-hidden relative transition-all">
              <button 
                onClick={() => setExpandedSections(prev => ({ ...prev, context: !prev.context }))}
                className="w-full flex items-center justify-between p-6 cursor-pointer lg:cursor-default"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-rojo text-white flex items-center justify-center shadow-lg shadow-rojo/20">
                    <Building2 size={24} />
                  </div>
                  <div className="text-left">
                    <h2 className="text-xl font-black text-texto leading-none">Contexto de Compra</h2>
                    <p className="text-[11px] font-bold text-gris uppercase tracking-widest mt-1">Sede y Punto de Venta</p>
                  </div>
                </div>
                <div className="lg:hidden text-gris">
                  {expandedSections.context ? <X size={20}/> : <ChevronRight size={20}/>}
                </div>
              </button>
              
              <AnimatePresence>
                {(expandedSections.context || window.innerWidth >= 1024) && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-6 lg:block border-t border-gray-50 border-dashed"
                  >
                    <div className="pt-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div className="flex gap-2">
                          <div className={`px-4 py-2 rounded-xl flex-1 sm:flex-none flex items-center justify-center gap-2 border transition-all cursor-pointer ${orderType === 'normal' ? 'bg-rojo text-white border-rojo shadow-md' : 'bg-gray-100 text-gris border-gray-200'}`}
                            onClick={() => setOrderType('normal')}>
                            <CalendarDays size={16} />
                            <span className="text-xs font-black uppercase tracking-widest">Normal</span>
                          </div>
                          <div className={`px-4 py-2 rounded-xl flex-1 sm:flex-none flex items-center justify-center gap-2 border transition-all cursor-pointer ${orderType === 'urgente' ? 'bg-amber-50 text-amber-600 border-amber-200 shadow-md shadow-amber-100' : 'bg-gray-100 text-gris border-gray-200'}`}
                            onClick={() => setOrderType('urgente')}>
                            <Zap size={16} fill={orderType === 'urgente' ? "currentColor" : "none"} />
                            <span className="text-xs font-black uppercase tracking-widest">Urgente</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-gris uppercase tracking-widest block ml-1">Seleccionar Sucursal</label>
                          <div className="relative">
                            <select 
                              value={selectedBranchId}
                              onChange={(e) => setSelectedBranchId(e.target.value)}
                              className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl px-5 text-sm font-black text-texto appearance-none outline-none focus:border-rojo focus:bg-white transition-all cursor-pointer"
                            >
                              {companyAccount.branches.map(branch => (
                                <option key={branch.id} value={branch.id}>{branch.name}</option>
                              ))}
                            </select>
                            <ChevronRight size={18} className="absolute right-5 top-1/2 -translate-y-1/2 text-gris rotate-90" />
                          </div>
                          <p className="text-[10px] font-bold text-gris px-1 mt-1">La disponibilidad de stock se validará para esta sede.</p>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-rojo shadow-sm">
                            <Info size={20} />
                          </div>
                          <div>
                            <div className="text-[10px] font-black text-gris uppercase tracking-widest">Estado de Cuenta</div>
                            <div className="text-sm font-black text-texto">Vigente / Operativo</div>
                            <div className="text-[10px] font-bold text-green-600 uppercase mt-0.5">Sujeto a facturación electrónica</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Validación de Cupo / Crédito */}
            {!isCash && (
              <div className="bg-white rounded-3xl border border-[#F1F3F5] p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-texto text-white flex items-center justify-center shadow-lg">
                      <CreditCard size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-texto leading-none">Cupo B2B Aprobado</h2>
                      <p className="text-[11px] font-bold text-gris uppercase tracking-widest mt-1">Control de Cartera en Tiempo Real</p>
                    </div>
                  </div>
                  <TrendingUp size={24} className="text-green-500" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gris uppercase tracking-widest mb-1">Cupo Total</span>
                    <span className="text-lg font-black text-texto">{formatCOP(currentUser?.creditLimit || 5000000)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-rojo uppercase tracking-widest mb-1">Usado / Pendiente</span>
                    <span className="text-lg font-black text-rojo-oscuro">{formatCOP((currentUser?.creditLimit || 0) - (currentUser?.availableCredit || 0))}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1">Disponible</span>
                    <span className="text-lg font-black text-green-600">{formatCOP(currentUser?.availableCredit || 0)}</span>
                  </div>
                </div>

                <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden mb-2">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (totalEstimado / (currentUser?.availableCredit || 1)) * 100)}%` }}
                    className={`h-full transition-colors ${subtotal > (currentUser?.availableCredit || 0) ? 'bg-rojo shadow-[0_0_10px_rgba(217,0,0,0.4)]' : 'bg-texto'}`}
                  />
                  <div className="absolute inset-0 flex items-center px-4 mix-blend-difference text-[9px] font-black text-white uppercase tracking-widest">
                    Impacto de este pedido: {Math.round((totalEstimado / (currentUser?.availableCredit || 1)) * 100)}% del cupo disponible
                  </div>
                </div>

                {totalEstimado > (currentUser?.availableCredit || 0) ? (
                  <div className="mt-4 p-4 bg-rojo/5 border border-rojo/10 rounded-2xl flex items-center gap-4">
                    <AlertTriangle size={24} className="text-rojo shrink-0" />
                    <div>
                      <p className="text-sm font-black text-rojo">El pedido supera tu cupo disponible.</p>
                      <p className="text-[11px] font-bold text-rojo/70 leading-tight">Este pedido pasará a revisión manual por el equipo de finanzas TBS o requerirá abono a facturas vencidas.</p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-4">
                    <ShieldCheck size={24} className="text-green-600 shrink-0" />
                    <p className="text-xs font-bold text-green-700 leading-tight">Tienes cupo suficiente para procesar este pedido bajo tus condiciones comerciales pactadas.</p>
                  </div>
                )}
              </div>
            )}

            {/* Validaciones del Pedido */}
            <div className="bg-white rounded-3xl border border-[#F1F3F5] shadow-sm overflow-hidden">
               <button 
                onClick={() => setExpandedSections(prev => ({ ...prev, validations: !prev.validations }))}
                className="w-full flex items-center justify-between p-6 cursor-pointer lg:cursor-default"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-200">
                    <PackageCheck size={24} />
                  </div>
                  <div className="text-left">
                    <h2 className="text-xl font-black text-texto leading-none">Validaciones TBS</h2>
                    <p className="text-[11px] font-bold text-gris uppercase tracking-widest mt-1">Simulación de Reglas de Negocio</p>
                  </div>
                </div>
                <div className="lg:hidden text-gris">
                  {expandedSections.validations ? <X size={20}/> : <ChevronRight size={20}/>}
                </div>
              </button>

              <AnimatePresence>
                {(expandedSections.validations || window.innerWidth >= 1024) && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-6 lg:block border-t border-gray-50 border-dashed"
                  >
                    <div className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          { label: 'Disponibilidad de Inventario', status: simulatedValidations.stock, desc: 'Stock validado en bodega central.' },
                          { label: 'Condiciones Comerciales', status: simulatedValidations.commercial, desc: 'Precios y descuentos vigentes aplicados.' },
                          { label: 'Ruta y Ventana Logística', status: simulatedValidations.logistics, desc: 'Capacidad de entrega confirmada para la zona.' },
                          { label: 'Validación de Cartera', status: simulatedValidations.credit, desc: 'Estado de facturas y cupo verificado.' }
                        ].map((val, idx) => (
                          <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-3">
                            <div className="mt-0.5">
                              {val.status === 'validating' ? (
                                <div className="w-5 h-5 rounded-full border-2 border-gris/30 border-t-rojo animate-spin" />
                              ) : val.status === 'warning' ? (
                                <AlertTriangle className="text-amber-500" size={20} />
                              ) : (
                                <CheckCircle2 className="text-green-500" size={20} />
                              )}
                            </div>
                            <div>
                              <div className="text-xs font-black text-texto leading-none mb-1">{val.label}</div>
                              <p className="text-[10px] font-bold text-gris leading-tight">{val.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 flex flex-wrap gap-2">
                        {items.some(i => i.product.stockStatus === 'low_stock') && (
                            <div className="px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                              <AlertTriangle size={12} /> Stock Crítico en Línea
                            </div>
                        )}
                        {orderType === 'urgente' && (
                            <div className="px-3 py-1.5 bg-rojo text-white rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm">
                              <Zap size={12} fill="white" /> Recargo Operativo Urgente
                            </div>
                        )}
                        <div className="px-3 py-1.5 bg-gray-100 text-gris rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                            <History size={12} /> Historial validado
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="bg-white rounded-2xl border border-[#F1F3F5] shadow-sm overflow-hidden">
              <button 
                onClick={() => setExpandedSections(prev => ({ ...prev, shipping: !prev.shipping }))}
                className="w-full flex items-center justify-between p-6 cursor-pointer lg:cursor-default"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-rojo/10 flex items-center justify-center text-rojo">
                    <Truck size={23} />
                  </div>

                  <div className="text-left">
                    <h2 className="text-xl font-black text-texto">
                      Información de entrega
                    </h2>
                    <p className="text-sm font-semibold text-gris">
                      Datos necesarios para coordinar la entrega.
                    </p>
                  </div>
                </div>
                <div className="lg:hidden text-gris">
                  {expandedSections.shipping ? <X size={20}/> : <ChevronRight size={20}/>}
                </div>
              </button>

              <AnimatePresence>
                {(expandedSections.shipping || window.innerWidth >= 1024) && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-6 lg:block border-t border-gray-50 border-dashed"
                  >
                    <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-black text-texto mb-2">
                          Nombre de contacto
                        </label>
                        <input
                          value={form.contactName}
                          onChange={(e) => handleChange('contactName', e.target.value)}
                          className="w-full h-12 rounded-lg border border-[#F1F3F5] px-4 outline-none focus:border-rojo"
                          placeholder="Nombre del responsable"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-black text-texto mb-2">
                          Celular de contacto
                        </label>
                        <input
                          value={form.phone}
                          onChange={(e) => handleChange('phone', e.target.value)}
                          className="w-full h-12 rounded-lg border border-[#F1F3F5] px-4 outline-none focus:border-rojo"
                          placeholder="Ej: 300 123 4567"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-black text-texto mb-2">
                          Ciudad
                        </label>
                        <div className="relative">
                          <select
                            value={form.city}
                            onChange={(e) => handleChange('city', e.target.value)}
                            className="w-full h-12 rounded-lg border border-[#F1F3F5] px-4 outline-none focus:border-rojo appearance-none bg-white cursor-pointer"
                          >
                            <option>Bogotá</option>
                            <option>Medellín</option>
                            <option>Cali</option>
                            <option>Barranquilla</option>
                            <option>Barranquilla</option>
                            <option>Santa Marta</option>
                            <option>Montería</option>
                            <option>Sincelejo</option>
                            <option>Valledupar</option>
                            <option>Otra ciudad</option>
                          </select>
                          <MapPin
                            size={18}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gris pointer-events-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-black text-texto mb-2">
                          Fecha deseada de entrega
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            value={form.deliveryDate}
                            onChange={(e) => handleChange('deliveryDate', e.target.value)}
                            className="w-full h-12 rounded-lg border border-[#F1F3F5] px-4 outline-none focus:border-rojo cursor-pointer"
                          />
                          <CalendarDays
                            size={18}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gris pointer-events-none"
                          />
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-black text-texto mb-2">
                          Dirección de entrega
                        </label>
                        <input
                          value={form.address}
                          onChange={(e) => handleChange('address', e.target.value)}
                          className="w-full h-12 rounded-lg border border-[#F1F3F5] px-4 outline-none focus:border-rojo"
                          placeholder="Dirección completa, barrio, punto de referencia"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-black text-texto mb-2">
                          Ventana de entrega
                        </label>
                        <div className="relative">
                          <select
                            value={form.deliveryWindow}
                            onChange={(e) => handleChange('deliveryWindow', e.target.value)}
                            className="w-full h-12 rounded-lg border border-[#F1F3F5] px-4 outline-none focus:border-rojo appearance-none bg-white cursor-pointer"
                          >
                            <option>Mañana: 8:00 a.m. - 12:00 p.m.</option>
                            <option>Tarde: 12:00 p.m. - 5:00 p.m.</option>
                            <option>Noche: 5:00 p.m. - 9:00 p.m.</option>
                            <option>Pedido urgente sujeto a disponibilidad</option>
                          </select>
                          <Clock
                            size={18}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gris pointer-events-none"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="bg-white rounded-2xl border border-[#F1F3F5] p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-rojo/10 flex items-center justify-center text-rojo">
                  <WalletCards size={23} />
                </div>

                <div>
                  <h2 className="text-xl font-black text-texto">
                    Método de pago
                  </h2>
                  <p className="text-sm font-semibold text-gris">
                    Selecciona cómo deseas pagar este pedido.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  'Crédito B2B',
                  'PSE',
                  'Tarjeta de crédito',
                  'QR / pago en línea',
                ]
                .filter(method => !(isCash && method === 'Crédito B2B'))
                .map((method) => (
                  <button
                    key={method}
                    onClick={() => handleChange('paymentMethod', method)}
                    className={`text-left rounded-xl border p-4 transition-colors cursor-pointer ${
                      form.paymentMethod === method
                        ? 'border-rojo bg-rojo/5'
                        : 'border-[#F1F3F5] bg-white hover:border-rojo'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard size={20} className="text-rojo" />
                      <span className="font-black text-texto">{method}</span>
                    </div>

                    <p className="mt-2 text-xs font-semibold text-gris leading-relaxed">
                      {method === 'Crédito B2B'
                        ? 'Sujeto a cupo disponible y política comercial.'
                        : 'Pago digital desde la plataforma.'}
                    </p>

                    {method === 'Tarjeta de crédito' && form.paymentMethod === 'Tarjeta de crédito' && (
                      <div className="mt-3 pt-3 border-t border-rojo/10">
                        <label className="block text-[10px] font-black text-rojo uppercase mb-2">Franquicia</label>
                        <div className="flex flex-wrap gap-2">
                          {['Visa', 'MasterCard', 'American Express'].map(franchise => (
                            <button
                              key={franchise}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleChange('cardFranchise', franchise);
                              }}
                              className={`px-2 py-1 rounded text-[10px] font-black border transition-all ${
                                form.cardFranchise === franchise
                                  ? 'bg-rojo text-white border-rojo'
                                  : 'bg-white text-gris border-borde hover:border-rojo'
                              }`}
                            >
                              {franchise}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {validationMessage && (
                <div className={`mt-6 p-4 rounded-xl flex items-start gap-3 border shadow-sm ${
                  validationMessage.type === 'warning' 
                    ? 'bg-amber-50 border-amber-200 text-amber-800' 
                    : 'bg-blue-50 border-blue-200 text-blue-800'
                }`}>
                  <AlertCircle size={20} className="shrink-0" />
                  <p className="text-sm font-semibold">{validationMessage.text}</p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-[#F1F3F5] p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-rojo/10 flex items-center justify-center text-rojo">
                  <MessageSquareText size={23} />
                </div>

                <div>
                  <h2 className="text-xl font-black text-texto">
                    Observaciones
                  </h2>
                  <p className="text-sm font-semibold text-gris">
                    Agrega instrucciones especiales para el pedido o la entrega.
                  </p>
                </div>
              </div>

              <textarea
                value={form.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                className="mt-6 w-full min-h-[120px] rounded-lg border border-[#F1F3F5] px-4 py-3 outline-none focus:border-rojo"
                placeholder="Ej: entregar en recepción, llamar antes de llegar, separar por sede, pedido para evento, etc."
              />
            </div>
          </section>

          <aside className="lg:sticky lg:top-6 h-fit bg-white rounded-2xl border border-[#F1F3F5] p-6 shadow-sm">
            {hospitalityContext && managedClient && (
              <div className="mb-6 bg-texto text-white p-5 rounded-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
                    <ShoppingCart size={18} />
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-white/70 italic">Modo Gestión</div>
                </div>
                <h3 className="text-sm font-black mb-1">{managedClient.businessName}</h3>
                <div className="text-[10px] font-bold text-white/50">
                  {managedEvent ? `Evento: ${managedEvent.eventName}` : 'Compra directa'}
                  <br />
                  Facturación: {hospitalityContext.billingType === 'facturar_cliente_final' ? 'Cliente Final' : 'Mi Cuenta (Gestor)'}
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-rojo/10 flex items-center justify-center text-rojo">
                <PackageCheck size={23} />
              </div>

              <div>
                <h2 className="text-xl font-black text-texto">
                  Resumen del pedido
                </h2>
                <p className="text-sm font-semibold text-gris">
                  {totalUnits} unidades agregadas
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4 max-h-[360px] overflow-y-auto pr-1 custom-scrollbar">
              {items.map((item) => (
                <article key={item.product.id} className="flex gap-3 border-b border-[#F1F3F5] pb-4 last:border-0 last:pb-0">
                  <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-black text-rojo uppercase tracking-widest">
                      {item.product.category}
                    </div>

                    <h3 className="mt-1 text-sm font-black text-texto leading-tight">
                      {item.product.name}
                    </h3>
                    
                    <div className="flex flex-wrap gap-1 mt-1">
                      {item.product.stockStatus === 'low_stock' && (
                        <div className="px-1.5 py-0.5 bg-amber-50 text-amber-700 font-black text-[8px] rounded uppercase border border-amber-200 flex items-center gap-1">
                          <AlertTriangle size={8} /> Stock bajo
                        </div>
                      )}
                      {orderType === 'urgente' && (
                        <div className="px-1.5 py-0.5 bg-rojo text-white font-black text-[8px] rounded uppercase flex items-center gap-1 shadow-sm">
                          <Zap size={8} fill="white" /> Urgente
                        </div>
                      )}
                    </div>
                    
                    {item.packaging && (
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 bg-gray-100 text-gris font-black text-[9px] rounded uppercase border border-borde">
                          {item.packaging.label}
                        </span>
                        <span className="text-[9px] font-black text-rojo">
                          x{item.packaging.unitsPerPackage} und.
                        </span>
                      </div>
                    )}

                    <div className="mt-1 text-xs font-semibold text-gris">
                      {item.packageQuantity || item.quantity} x {item.packaging && item.packaging.unitsPerPackage > 1 ? 'Caja' : 'Und.'} $ {(item.packaging?.packagePrice || parsePrice(item.product.price)).toLocaleString('es-CO')}
                    </div>
                  </div>

                  <div className="text-sm font-black text-texto">
                    {formatCOP((item.packaging?.packagePrice || parsePrice(item.product.price)) * (item.packageQuantity || 1))}
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between font-semibold text-texto-sec">
                <span>Subtotal estimado</span>
                <span>{formatCOP(subtotal)}</span>
              </div>

              <div className="flex justify-between font-semibold text-texto-sec">
                <span>IVA estimado (19%)</span>
                <span>{formatCOP(ivaEstimado)}</span>
              </div>

              {orderType === 'urgente' && (
                <div className="flex justify-between font-black text-amber-600 bg-amber-50 p-2 rounded-md">
                   <span>Recargo logístico urgente</span>
                   <span>{formatCOP(75000)}</span>
                </div>
              )}

              {commissionValue > 0 && (
                <div className="flex justify-between font-black text-rojo italic bg-rojo/5 p-2 rounded-md">
                  <span>Recargo tarjeta ({cardCommissionPercent * 100}%)</span>
                  <span>{formatCOP(commissionValue)}</span>
                </div>
              )}

              <div className="pt-3 border-t border-[#F1F3F5] flex justify-between items-center">
                <span className="text-base font-black text-texto">
                  Total estimado
                </span>
                <span className="text-2xl font-black text-rojo tracking-tighter">
                  {formatCOP(totalEstimado + (orderType === 'urgente' ? 75000 : 0))}
                </span>
              </div>
            </div>

            <div className="mt-6 p-5 bg-texto text-white rounded-3xl space-y-3">
               <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Post-Confirmación</div>
               <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                     <TrendingUp size={16} />
                  </div>
                  <p className="text-xs font-bold leading-relaxed">
                     Al confirmar, el pedido entrará en <span className="text-rojo font-black">Estado: Validación Operativa</span>. 
                     Recibirás la confirmación final de bodega y transporte en máximo 4 horas.
                  </p>
               </div>
            </div>

            <div className="mt-5 space-y-3">
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
                <Tag size={18} className="text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-black text-blue-900">Promociones B2B</p>
                  <p className="text-[10px] font-bold text-blue-700 mt-1 leading-tight">
                    Los descuentos por volumen y combos se validarán comercialmente ante inventario real.
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-rojo/5 border border-rojo/10 p-4">
                <div className="text-sm font-black text-texto flex items-center gap-2">
                  <AlertCircle size={16} /> Validación comercial
                </div>
                <p className="mt-1 text-xs font-semibold text-texto-sec leading-relaxed">
                  El total puede variar según disponibilidad, descuentos aplicados en promociones, impuestos,
                  acuerdos comerciales y condiciones finales del cliente.
                </p>
              </div>

              {isCash && (
                <div className="rounded-xl bg-orange-50 border border-orange-100 p-4">
                  <div className="text-sm font-black text-orange-600 flex items-center gap-2">
                    <WalletCards size={16} /> Pedido contado
                  </div>
                  <p className="mt-1 text-xs font-semibold text-orange-700 leading-relaxed">
                    Este pedido requiere pago anticipado o confirmación de pago para continuar con validación comercial, inventario y logística.
                  </p>
                </div>
              )}
            </div>

            <Button
              onClick={() => setIsConfirmModalOpen(true)}
              disabled={!isValid}
              isLoading={isSubmitting}
              className="mt-5 w-full h-14 rounded-xl text-base gap-3"
            >
              <PackageCheck size={20} />
              {needsApproval ? 'Enviar a aprobación' : 'Confirmar pedido'}
            </Button>

            {!isValid && (
              <p className="mt-3 text-xs font-semibold text-rojo leading-relaxed text-center">
                Completa todos los campos obligatorios para continuar.
              </p>
            )}
          </aside>
        </div>

        {/* Mobile Sticky CTA */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-[90] shadow-[0_-8px_20px_rgba(0,0,0,0.05)]">
          <div className="max-w-xl mx-auto flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-gris uppercase tracking-widest">Total Estimado</span>
              <span className="text-xl font-black text-rojo tracking-tighter">
                {formatCOP(totalEstimado + (orderType === 'urgente' ? 75000 : 0))}
              </span>
            </div>
            <Button
              onClick={() => setIsConfirmModalOpen(true)}
              disabled={!isValid}
              isLoading={isSubmitting}
              className="flex-1 h-14 rounded-xl px-6"
              leftIcon={CheckCircle2}
            >
              {needsApproval ? 'Solicitar Aprobación' : 'Confirmar'}
            </Button>
          </div>
        </div>
      </div>

      {isConfirmModalOpen && (
        <ConfirmDialog 
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={handleConfirm}
          title={needsApproval ? 'Confirmar envío para aprobación' : '¿Confirmar pedido B2B?'}
          description={needsApproval 
            ? "Tu pedido requiere revisión manual. Al confirmar, se enviará a tus supervisores para aprobación e ingreso al ciclo operativo." 
            : "Al confirmar, TBS validará stock y logística para programar tu entrega. Recibirás una notificación en breve."
          }
          confirmLabel={needsApproval ? "Enviar a aprobación" : "Sí, confirmar pedido"}
          cancelLabel="Revisar de nuevo"
          variant={needsApproval ? "warning" : "financial"}
          isLoading={isSubmitting}
        />
      )}
    </main>
  );
}
