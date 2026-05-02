import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ShieldCheck, 
  Search, 
  Filter, 
  MapPin, 
  Building2, 
  User as UserIcon, 
  Calendar, 
  CreditCard, 
  Clock, 
  Package, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Undo2, 
  FileText, 
  MoreHorizontal,
  ChevronRight,
  Eye,
  Info,
  History,
  MessageSquare,
  Building,
  Target
} from 'lucide-react';
import { 
  User, 
  PendingApprovalOrder, 
  B2BCompanyAccount, 
  ApprovalStatus, 
  ApprovalReason,
  ApprovalDecision,
  TBSNotification,
  B2BUserActivity,
  ClientAccountRole
} from '../types';

interface OrderApprovalsPageProps {
  currentUser: User;
  approvalOrders: PendingApprovalOrder[];
  companyAccount: B2BCompanyAccount;
  onBackToAccount: () => void;
  onGoOrdersTracking: () => void;
  onGoAdvisorChat: (topic?: string, context?: any) => void;
  onUpdateApprovalOrders: (updated: PendingApprovalOrder[]) => void;
  onCreateNotification: (notif: any) => void;
  onCreateActivity: (activity: any) => void;
}

const OrderApprovalsPage: React.FC<OrderApprovalsPageProps> = ({
  currentUser,
  approvalOrders,
  companyAccount,
  onBackToAccount,
  onGoOrdersTracking,
  onGoAdvisorChat,
  onUpdateApprovalOrders,
  onCreateNotification,
  onCreateActivity
}) => {
  const [filterStatus, setFilterStatus] = useState<ApprovalStatus | 'todos'>('todos');
  const [filterCity, setFilterCity] = useState<string>('todas');
  const [filterUser, setFilterUser] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<PendingApprovalOrder | null>(null);
  
  // Modals
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const [decisionType, setDecisionType] = useState<'aprobado' | 'rechazado' | 'devuelto'>('aprobado');
  const [decisionComment, setDecisionComment] = useState('');

  // Permission check
  const hasApprovalPermission = useMemo(() => {
    if (!currentUser) return false;
    const role = currentUser.accountRole;
    const permissions = currentUser.permissions || [];
    
    return (
      role === 'master' || 
      role === 'aprobador' || 
      role === 'administrador' || 
      permissions.includes('aprobar_pedidos')
    );
  }, [currentUser]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return approvalOrders.filter(order => {
      // If not approver, only see own orders
      if (!hasApprovalPermission && order.createdByUserId !== currentUser.id) {
        return false;
      }

      const matchesStatus = filterStatus === 'todos' || order.status === filterStatus;
      const matchesCity = filterCity === 'todas' || order.cityId === filterCity;
      const matchesUser = filterUser === 'todos' || order.createdByUserId === filterUser;
      
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        order.orderNumber.toLowerCase().includes(searchLower) ||
        order.createdByUserName.toLowerCase().includes(searchLower) ||
        order.branchName.toLowerCase().includes(searchLower) ||
        order.pointOfSaleName?.toLowerCase().includes(searchLower) ||
        order.reasonLabel.toLowerCase().includes(searchLower);

      return matchesStatus && matchesCity && matchesUser && matchesSearch;
    });
  }, [approvalOrders, filterStatus, filterCity, filterUser, searchTerm, hasApprovalPermission, currentUser]);

  const stats = useMemo(() => {
    const relevant = approvalOrders.filter(o => 
      hasApprovalPermission || o.createdByUserId === currentUser.id
    );
    
    return {
      pendientes: relevant.filter(o => o.status === 'pendiente').length,
      aprobados: relevant.filter(o => o.status === 'aprobado').length,
      rechazados: relevant.filter(o => o.status === 'rechazado').length,
      devueltos: relevant.filter(o => o.status === 'devuelto').length,
      totalPendiente: relevant.filter(o => o.status === 'pendiente').reduce((acc, o) => acc + o.total, 0)
    };
  }, [approvalOrders, hasApprovalPermission, currentUser]);

  const handleOpenDecision = (order: PendingApprovalOrder, type: 'aprobado' | 'rechazado' | 'devuelto') => {
    setSelectedOrder(order);
    setDecisionType(type);
    setDecisionComment('');
    setIsDecisionModalOpen(true);
  };

  const handleConfirmDecision = () => {
    if (!selectedOrder || !decisionType) return;
    if ((decisionType === 'rechazado' || decisionType === 'devuelto') && !decisionComment.trim()) {
      return;
    }

    const decision: ApprovalDecision = {
      id: `dec-${Date.now()}`,
      userId: currentUser.id || currentUser.email,
      userName: currentUser.name,
      decision: decisionType,
      comment: decisionComment,
      date: "Hace un momento"
    };

    const updatedOrders = approvalOrders.map(o => {
      if (o.id === selectedOrder.id) {
        return {
          ...o,
          status: decisionType as ApprovalStatus,
          decisions: [...o.decisions, decision]
        };
      }
      return o;
    });

    onUpdateApprovalOrders(updatedOrders);
    
    // Activity
    onCreateActivity({
      userId: currentUser.name,
      userName: currentUser.name,
      action: decisionType === 'aprobado' ? 'Aprobó pedido' : decisionType === 'rechazado' ? 'Rechazó pedido' : 'Devolvió pedido',
      detail: `Se ${decisionType === 'aprobado' ? 'aprobó' : decisionType === 'rechazado' ? 'rechazó' : 'devolvió'} el pedido ${selectedOrder.orderNumber}.`,
      date: 'Hace un momento',
      module: 'pedidos'
    });

    // Notification for creator
    onCreateNotification({
      id: Date.now(),
      type: 'pedido',
      title: decisionType === 'aprobado' ? 'Pedido Aprobado' : decisionType === 'rechazado' ? 'Pedido Rechazado' : 'Pedido Devuelto',
      message: `Tu pedido ${selectedOrder.orderNumber} ha sido ${decisionType === 'aprobado' ? 'aprobado' : decisionType === 'rechazado' ? 'rechazado' : 'devuelto para ajustes'}.`,
      priority: decisionType === 'aprobado' ? 'media' : 'alta',
      createdAt: 'Ahora',
      read: false,
      actionTarget: 'orderApprovals'
    });

    setIsDecisionModalOpen(false);
    setSelectedOrder(null);
  };

  const getStatusColor = (status: ApprovalStatus) => {
    switch (status) {
      case 'pendiente': return 'bg-yellow-50 text-yellow-600 border-yellow-100';
      case 'aprobado': return 'bg-green-50 text-green-600 border-green-100';
      case 'rechazado': return 'bg-red-50 text-red-600 border-red-100';
      case 'devuelto': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'vencido': return 'bg-gray-50 text-gray-600 border-gray-100';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  const getStatusIcon = (status: ApprovalStatus) => {
    switch (status) {
      case 'pendiente': return <Clock size={14} />;
      case 'aprobado': return <CheckCircle2 size={14} />;
      case 'rechazado': return <XCircle size={14} />;
      case 'devuelto': return <Undo2 size={14} />;
      default: return <AlertCircle size={14} />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={onBackToAccount}
              className="w-10 h-10 rounded-full flex items-center justify-center text-gris hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <ChevronLeft size={24} />
            </button>
            <div>
              <h1 className="text-xl font-black text-texto tracking-tight flex items-center gap-3">
                <ShieldCheck className="text-rojo" size={24} />
                Aprobación de pedidos
              </h1>
              <p className="text-xs font-semibold text-gris uppercase tracking-tight hidden md:block">
                {companyAccount.businessName} • {currentUser.accountRole?.toUpperCase()}
              </p>
            </div>
          </div>
          <button 
            onClick={() => onGoAdvisorChat('soporte', { label: 'Aprobaciones', type: 'soporte' })}
            className="hidden sm:flex items-center gap-2 text-xs font-black text-rojo uppercase tracking-widest px-4 py-2 bg-rojo-suave rounded-xl border border-rojo/10 hover:bg-rojo/10 transition-all cursor-pointer"
          >
            <MessageSquare size={16} /> Hablar con asesor TBS
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-10">
        {!hasApprovalPermission && (
          <div className="mb-12 p-10 bg-rojo rounded-[40px] text-white shadow-xl shadow-rojo/30 relative overflow-hidden">
            {/* Watermark icon */}
            <div className="absolute -right-16 -bottom-16 opacity-10 rotate-12 pointer-events-none">
              <ShieldCheck size={280} strokeWidth={1} />
            </div>
            
            <div className="relative z-10 max-w-3xl">
              <h2 className="text-[32px] font-black mb-4 tracking-[-0.02em] leading-tight font-sans">Acceso restringido</h2>
              <p className="text-[17px] font-medium opacity-90 leading-relaxed mb-10 max-w-[85%]">
                No tienes permisos para aprobar pedidos. Puedes consultar únicamente los pedidos creados por ti que estén en proceso de aprobación.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => {
                    const el = document.getElementById('approvals-list');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    setFilterStatus('pendiente');
                  }}
                  className="px-8 py-3.5 bg-white text-rojo rounded-[18px] font-black text-xs uppercase tracking-[0.08em] hover:shadow-lg transition-all flex items-center gap-2.5 cursor-pointer"
                >
                  <Eye size={18} strokeWidth={2.5} /> VER MIS PEDIDOS EN APROBACIÓN
                </button>
                <button 
                  onClick={onBackToAccount} 
                  className="px-8 py-3.5 bg-white/15 text-white rounded-[18px] font-black text-xs uppercase tracking-[0.08em] border border-white/20 hover:bg-white/25 transition-all cursor-pointer"
                >
                  VOLVER A MI CUENTA
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Resumen Stats */}
        <div id="approvals-list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          {[
            { label: 'PENDIENTES', val: stats.pendientes, color: 'bg-yellow-50 text-yellow-600', icon: Clock },
            { label: 'APROBADOS', val: stats.aprobados, color: 'bg-green-50 text-green-600', icon: CheckCircle2 },
            { label: 'RECHAZADOS', val: stats.rechazados, color: 'bg-red-50 text-red-600', icon: XCircle },
            { label: 'DEVUELTOS', val: stats.devueltos, color: 'bg-blue-50 text-blue-600', icon: Undo2 },
            { label: 'TOTAL EN ESPERA', val: formatCurrency(stats.totalPendiente).replace('$', '$ '), color: 'bg-white/5 text-white', icon: Target, isDark: true },
          ].map((item, i) => (
            <div key={i} className={`p-8 rounded-[32px] shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-[180px] relative border ${item.isDark ? 'bg-[#0f172a] border-transparent' : 'bg-white border-[#f1f3f6]'}`}>
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${item.color}`}>
                  <item.icon size={22} strokeWidth={2} />
                </div>
                <div className={`text-[9px] font-black uppercase tracking-[0.2em] opacity-30 mt-1 ${item.isDark ? 'text-white' : 'text-texto'}`}>MÓDULO</div>
              </div>
              <div className="mt-4">
                <div className={`text-[32px] font-black tracking-[-0.04em] mb-0.5 leading-none ${item.isDark ? 'text-white' : 'text-texto'}`}>{item.val}</div>
                <div className={`text-[10px] font-black uppercase tracking-[0.2em] ${item.isDark ? 'text-white/40' : 'text-gris'}`}>{item.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-[40px] border border-borde p-8 tbs-shadow mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Buscador */}
            <div className="lg:col-span-1 space-y-3">
              <label className="text-[11px] font-black uppercase tracking-[0.15em] text-gris px-1">Buscar Pedido</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gris" size={18} />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Nro. pedido, sucursal..."
                  className="w-full h-14 bg-gray-50 border-2 border-transparent focus:border-rojo focus:bg-white rounded-2xl pl-12 pr-6 text-sm font-bold transition-all outline-none"
                />
              </div>
            </div>

            {/* Filtro Estado */}
            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase tracking-[0.15em] text-gris px-1">Estado</label>
              <div className="flex flex-wrap gap-2">
                {['todos', 'pendiente', 'aprobado', 'rechazado', 'devuelto'].map((st) => (
                  <button 
                    key={st}
                    onClick={() => setFilterStatus(st as any)}
                    className={`h-11 px-5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                      filterStatus === st 
                      ? 'bg-rojo text-white shadow-lg shadow-rojo/20' 
                      : 'bg-gray-50 text-gris hover:bg-gray-100 border border-transparent hover:border-gray-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtro Ciudad */}
            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase tracking-[0.15em] text-gris px-1">Ciudad</label>
              <select 
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
                className="w-full h-14 bg-gray-50 border-2 border-transparent focus:border-rojo focus:bg-white rounded-2xl px-6 text-sm font-bold transition-all outline-none appearance-none cursor-pointer"
              >
                <option value="todas">Todas las ciudades</option>
                {companyAccount.cities.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Filtro Usuario */}
            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase tracking-[0.15em] text-gris px-1">Comprador</label>
              <select 
                value={filterUser}
                onChange={(e) => setFilterUser(e.target.value)}
                className="w-full h-14 bg-gray-50 border-2 border-transparent focus:border-rojo focus:bg-white rounded-2xl px-6 text-sm font-bold transition-all outline-none appearance-none cursor-pointer"
              >
                <option value="todos">Todos los usuarios</option>
                {companyAccount.users.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Listado de Pedidos */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-[40px] border border-dashed border-gray-200">
              <div className="w-20 h-20 bg-gray-50 text-gris rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText size={40} />
              </div>
              <h3 className="text-xl font-black text-texto mb-2">No se encontraron pedidos</h3>
              <p className="text-sm font-medium text-gris max-w-xs mx-auto">Ajusta los filtros o términos de búsqueda para encontrar lo que buscas.</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <motion.div 
                layout
                key={order.id}
                className="bg-white rounded-[40px] border border-borde p-8 tbs-shadow group hover:border-rojo/30 transition-all"
              >
                <div className="flex flex-wrap items-start justify-between gap-6 mb-8">
                  <div className="flex gap-6">
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gris group-hover:bg-rojo-suave group-hover:text-rojo transition-colors shrink-0">
                      <Package size={32} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1.5">
                        <h3 className="text-2xl font-black text-texto tracking-tight">{order.orderNumber}</h3>
                        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border ${getStatusColor(order.status)} flex items-center gap-1.5`}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-y-2 gap-x-4">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-gris">
                          <MapPin size={14} className="text-rojo" /> {order.cityName} • {order.branchName}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-gris">
                          <UserIcon size={14} className="text-rojo" /> Por {order.createdByUserName}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-gris">
                          <Calendar size={14} className="text-rojo" /> {order.createdAt}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-3xl font-black text-texto tracking-tighter mb-1">{formatCurrency(order.total)}</div>
                    <div className="text-[10px] font-black text-rojo uppercase tracking-[0.2em]">{order.reasonLabel}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 bg-gray-50 rounded-3xl border border-gray-100 mb-8">
                  <div className="space-y-1">
                    <div className="text-[10px] font-black text-gris uppercase tracking-wider">Límite Comprador</div>
                    <div className="text-sm font-black text-texto">{formatCurrency(order.userPurchaseLimit || 0)}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] font-black text-gris uppercase tracking-wider">Método de Pago</div>
                    <div className="text-sm font-black text-texto flex items-center gap-1.5">
                      <CreditCard size={14} className="text-rojo" /> {order.paymentMethod}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] font-black text-gris uppercase tracking-wider">Ventana de Entrega</div>
                    <div className="text-sm font-black text-texto flex items-center gap-1.5">
                      <Clock size={14} className="text-rojo" /> {order.deliveryWindow}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] font-black text-gris uppercase tracking-wider">Sede / Punto Venta</div>
                    <div className="text-sm font-black text-texto flex items-center gap-1.5">
                      <Building size={14} className="text-rojo" /> {order.pointOfSaleName || 'General'}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <button 
                    onClick={() => setSelectedOrder(order)}
                    className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.15em] hover:bg-gray-800 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Eye size={18} /> Ver detalles
                  </button>

                  <div className="flex items-center gap-3">
                    {hasApprovalPermission && order.status === 'pendiente' && (
                      <>
                        <button 
                          onClick={() => handleOpenDecision(order, 'aprobado')}
                          className="px-6 py-4 bg-green-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.15em] hover:bg-green-700 transition-all flex items-center gap-2 shadow-lg shadow-green-600/20 cursor-pointer"
                        >
                          <CheckCircle2 size={18} /> Aprobar
                        </button>
                        <button 
                          onClick={() => handleOpenDecision(order, 'rechazado')}
                          className="px-6 py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.15em] hover:bg-red-700 transition-all flex items-center gap-2 shadow-lg shadow-red-600/20 cursor-pointer"
                        >
                          <XCircle size={18} /> Rechazar
                        </button>
                        <button 
                          onClick={() => handleOpenDecision(order, 'devuelto')}
                          className="px-6 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.15em] hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20 cursor-pointer"
                        >
                          <Undo2 size={18} /> Devolver
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => onGoAdvisorChat('pedido', { label: 'Aprobación', value: order.orderNumber })}
                      className="p-4 bg-gray-100 text-gris hover:text-rojo hover:bg-rojo-suave rounded-2xl transition-all cursor-pointer"
                    >
                      <MessageSquare size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </main>

      {/* MODAL DETALLE DE PEDIDO */}
      <AnimatePresence>
        {selectedOrder && !isDecisionModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center sm:p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 50 }}
              className="relative w-full max-w-5xl bg-white rounded-t-[40px] sm:rounded-[40px] shadow-2xl z-10 overflow-hidden flex flex-col max-h-[95vh]"
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${getStatusColor(selectedOrder.status)}`}>
                    <Package size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-texto tracking-tight flex items-center gap-3">
                      Detalle de Pedido {selectedOrder.orderNumber}
                    </h2>
                    <div className="flex items-center gap-2 text-xs font-bold text-gris uppercase tracking-tight">
                       {selectedOrder.status} • Creado el {selectedOrder.createdAt}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="w-12 h-12 bg-white text-gris hover:text-rojo rounded-xl flex items-center justify-center transition-all border border-borde shadow-sm cursor-pointer"
                >
                  <XCircle size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-12">
                {/* Summary Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                   {/* Col 1: Emisor */}
                   <div className="space-y-6">
                      <div className="flex items-center gap-3 text-rojo">
                         <UserIcon size={20} />
                         <span className="text-sm font-black uppercase tracking-widest text-texto">Información del Emisor</span>
                      </div>
                      <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-4">
                         <div>
                            <div className="text-[10px] font-black text-gris uppercase mb-1">Nombre Completo</div>
                            <div className="text-sm font-black text-texto">{selectedOrder.createdByUserName}</div>
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                               <div className="text-[10px] font-black text-gris uppercase mb-1">Ciudad</div>
                               <div className="text-xs font-bold text-texto">{selectedOrder.cityName}</div>
                            </div>
                            <div>
                               <div className="text-[10px] font-black text-gris uppercase mb-1">Motivo</div>
                               <div className="text-xs font-black text-rojo uppercase">{selectedOrder.reasonLabel}</div>
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* Col 2: Logistica */}
                   <div className="space-y-6">
                      <div className="flex items-center gap-3 text-rojo">
                         <Building2 size={20} />
                         <span className="text-sm font-black uppercase tracking-widest text-texto">Logística y Entrega</span>
                      </div>
                      <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-4">
                         <div>
                            <div className="text-[10px] font-black text-gris uppercase mb-1">Sucursal / Punto de Venta</div>
                            <div className="text-sm font-black text-texto">{selectedOrder.branchName} • {selectedOrder.pointOfSaleName || 'General'}</div>
                         </div>
                         <div>
                            <div className="text-[10px] font-black text-gris uppercase mb-1">Dirección</div>
                            <div className="text-xs font-medium text-texto leading-tight">{selectedOrder.deliveryAddress}</div>
                         </div>
                         <div>
                            <div className="text-[10px] font-black text-gris uppercase mb-1">Ventana</div>
                            <div className="text-xs font-bold text-texto">{selectedOrder.deliveryWindow}</div>
                         </div>
                      </div>
                   </div>

                   {/* Col 3: Financiero */}
                   <div className="space-y-6">
                      <div className="flex items-center gap-3 text-rojo">
                         <CreditCard size={20} />
                         <span className="text-sm font-black uppercase tracking-widest text-texto">Resumen Financiero</span>
                      </div>
                      <div className="p-6 bg-gray-900 rounded-3xl text-white space-y-4 shadow-xl">
                         <div className="flex justify-between border-b border-white/10 pb-4">
                            <div>
                               <div className="text-[10px] font-bold text-white/60 uppercase">Total Pedido</div>
                               <div className="text-2xl font-black">{formatCurrency(selectedOrder.total)}</div>
                            </div>
                            <div className="text-right">
                               <div className="text-[10px] font-bold text-white/60 uppercase">Método</div>
                               <div className="text-sm font-black">{selectedOrder.paymentMethod}</div>
                            </div>
                         </div>
                         <div className="pt-2">
                            <div className="text-[10px] font-bold text-white/60 uppercase mb-2">Límite de Compra Usuario</div>
                            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
                               <div 
                                 className="h-full bg-rojo transition-all" 
                                 style={{ width: `${Math.min((selectedOrder.total / (selectedOrder.userPurchaseLimit || 1)) * 100, 100)}%` }}
                               />
                            </div>
                            <div className="flex justify-between text-[10px] font-bold">
                               <span className="text-white/60">Utilizado: {formatCurrency(selectedOrder.total)}</span>
                               <span className={selectedOrder.total > (selectedOrder.userPurchaseLimit || 0) ? 'text-rojo' : 'text-green-400'}>
                                  Límite: {formatCurrency(selectedOrder.userPurchaseLimit || 0)}
                               </span>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Validation Info */}
                <div className="bg-rojo-suave/30 rounded-3xl p-8 border border-rojo/10">
                   <div className="flex items-center gap-3 mb-6">
                      <ShieldCheck className="text-rojo" size={24} />
                      <h3 className="text-xl font-black text-texto tracking-tight">Validación de Aprobación</h3>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                      <div className="space-y-4">
                         <div className="text-[11px] font-black text-gris uppercase tracking-widest">Regla Activada</div>
                         <div className="text-sm font-black text-texto">{selectedOrder.reasonLabel}</div>
                      </div>
                      <div className="space-y-4">
                         <div className="text-[11px] font-black text-gris uppercase tracking-widest">Umbral Regla</div>
                         <div className="text-sm font-black text-texto">{formatCurrency(selectedOrder.approvalThreshold || 0)}</div>
                      </div>
                      <div className="space-y-4">
                         <div className="text-[11px] font-black text-gris uppercase tracking-widest">Aprobadores Requeridos</div>
                         <div className="flex -space-x-3">
                            {selectedOrder.approverUserIds.map((id, i) => {
                               const user = companyAccount.users.find(u => u.id === id);
                               return (
                                 <div key={i} className="w-10 h-10 rounded-full bg-white border-2 border-rojo-suave flex items-center justify-center text-xs font-black text-rojo shadow-sm">
                                    {user?.name.charAt(0)}
                                 </div>
                               );
                            })}
                         </div>
                      </div>
                      <div className="space-y-4">
                         <div className="text-[11px] font-black text-gris uppercase tracking-widest">Fecha Estimada Validación</div>
                         <div className="text-sm font-black text-texto">Próximas 2 horas</div>
                      </div>
                   </div>
                </div>

                {/* Products Table */}
                <div className="space-y-6">
                   <div className="flex items-center gap-3 text-rojo">
                      <Package size={20} />
                      <span className="text-sm font-black uppercase tracking-widest text-texto">Detalle de Productos</span>
                   </div>
                   <div className="border border-gray-100 rounded-[32px] overflow-hidden">
                      <table className="w-full text-left">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-8 py-5 text-[10px] font-black text-gris uppercase tracking-wider">Producto</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gris uppercase tracking-wider">Cantidad</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gris uppercase tracking-wider text-right">Unitario</th>
                            <th className="px-8 py-5 text-[10px] font-black text-gris uppercase tracking-wider text-right">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {selectedOrder.lines.map((line) => (
                            <tr key={line.id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="px-8 py-5">
                                <div className="flex items-center gap-4">
                                  <div className="w-14 h-14 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                                    <img src={line.image} alt={line.name} className="w-full h-full object-contain" />
                                  </div>
                                  <div>
                                    <div className="text-sm font-black text-texto leading-none mb-1">{line.name}</div>
                                    <div className="text-xs font-semibold text-gris">{line.specs} • {line.category}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-8 py-5">
                                <div className="text-sm font-black text-texto">{line.quantity} unidades</div>
                              </td>
                              <td className="px-8 py-5 text-right font-bold text-sm text-gris">
                                {formatCurrency(line.unitPrice)}
                              </td>
                              <td className="px-8 py-5 text-right font-black text-sm text-texto">
                                {formatCurrency(line.subtotal)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-gray-50/50 font-black">
                           <tr>
                              <td colSpan={3} className="px-8 py-6 text-right text-gris uppercase tracking-widest text-xs">Total Pedido Pendiente</td>
                              <td className="px-8 py-6 text-right text-texto text-xl tracking-tighter">{formatCurrency(selectedOrder.total)}</td>
                           </tr>
                        </tfoot>
                      </table>
                   </div>
                </div>

                {/* History */}
                <div className="space-y-6">
                   <div className="flex items-center gap-3 text-rojo">
                      <History size={20} />
                      <span className="text-sm font-black uppercase tracking-widest text-texto">Historial de Decisiones</span>
                   </div>
                   {selectedOrder.decisions.length === 0 ? (
                     <div className="p-10 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                        <MessageSquare size={32} className="mx-auto text-gris mb-3 opacity-30" />
                        <p className="text-xs font-bold text-gris uppercase">Este pedido aún no tiene decisiones registradas.</p>
                     </div>
                   ) : (
                     <div className="space-y-4">
                        {selectedOrder.decisions.map((dec) => (
                          <div key={dec.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex gap-6">
                             <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                               dec.decision === 'aprobado' ? 'bg-green-100 text-green-600' : 
                               dec.decision === 'rechazado' ? 'bg-red-100 text-red-600' : 
                               'bg-blue-100 text-blue-600'
                             }`}>
                                {dec.decision === 'aprobado' ? <CheckCircle2 size={24} /> : 
                                 dec.decision === 'rechazado' ? <XCircle size={24} /> : 
                                 <Undo2 size={24} />}
                             </div>
                             <div>
                                <div className="flex items-center gap-3 mb-2">
                                   <div className="text-sm font-black text-texto">{dec.userName}</div>
                                   <div className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                                     dec.decision === 'aprobado' ? 'bg-green-600 text-white' : 
                                     dec.decision === 'rechazado' ? 'bg-red-600 text-white' : 
                                     'bg-blue-600 text-white'
                                   }`}>
                                      {dec.decision}
                                   </div>
                                   <div className="text-[10px] font-bold text-gris tracking-tight">{dec.date}</div>
                                </div>
                                <p className="text-sm font-medium text-gris italic leading-relaxed">
                                   "{dec.comment || 'Sin comentarios.'}"
                                </p>
                             </div>
                          </div>
                        ))}
                     </div>
                   )}
                </div>
              </div>

              {/* Botones de acción fija al final del modal */}
              <div className="p-8 border-t border-gray-100 bg-white flex flex-wrap items-center justify-between gap-6">
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="px-8 py-4 text-sm font-black text-gris uppercase tracking-widest hover:text-texto transition-all"
                >
                  Cerrar Vista
                </button>
                <div className="flex items-center gap-4">
                   <button 
                     onClick={() => {
                        onGoAdvisorChat('pedido', { label: 'Revisión Detalle', value: selectedOrder.orderNumber });
                        setSelectedOrder(null);
                     }}
                     className="px-6 py-4 bg-gray-100 text-gris rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center gap-2 cursor-pointer"
                   >
                     Solicitar ayuda TBS
                   </button>
                   {hasApprovalPermission && selectedOrder.status === 'pendiente' && (
                     <>
                        <button 
                          onClick={() => handleOpenDecision(selectedOrder, 'devuelto')}
                          className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                        >
                          <Undo2 size={18} /> Devolver
                        </button>
                        <button 
                          onClick={() => handleOpenDecision(selectedOrder, 'rechazado')}
                          className="px-8 py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                        >
                          <XCircle size={18} /> Rechazar
                        </button>
                        <button 
                          onClick={() => handleOpenDecision(selectedOrder, 'aprobado')}
                          className="px-8 py-4 bg-green-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-green-700 transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                        >
                          <CheckCircle2 size={18} /> Aprobar Pedido
                        </button>
                     </>
                   )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL DECISION (APROBAR/RECHAZAR/DEVOLVER) */}
      <AnimatePresence>
        {isDecisionModalOpen && selectedOrder && (
          <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDecisionModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl z-10 overflow-hidden"
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    decisionType === 'aprobado' ? 'bg-green-100 text-green-600' : 
                    decisionType === 'rechazado' ? 'bg-red-100 text-red-600' : 
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {decisionType === 'aprobado' ? <CheckCircle2 size={24} /> : 
                     decisionType === 'rechazado' ? <XCircle size={24} /> : 
                     <Undo2 size={24} />}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-texto tracking-tight uppercase">
                      {decisionType === 'aprobado' ? 'Aprobar Pedido' : 
                       decisionType === 'rechazado' ? 'Rechazar Pedido' : 
                       'Devolver Pedido'}
                    </h3>
                    <p className="text-xs font-bold text-gris tracking-tight">{selectedOrder.orderNumber}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsDecisionModalOpen(false)}
                  className="w-10 h-10 bg-gray-50 text-gris hover:text-rojo rounded-xl flex items-center justify-center transition-all cursor-pointer"
                >
                  <XCircle size={20} />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <p className="text-sm font-medium text-gris leading-relaxed">
                  {decisionType === 'aprobado' 
                    ? "Al aprobar este pedido, quedará listo para validación comercial, inventario y preparación logística."
                    : decisionType === 'rechazado'
                    ? "Al rechazar este pedido, el comprador será notificado y el pedido quedará cancelado definitivamente."
                    : "Devuelve este pedido al comprador para que realice ajustes en cantidades, productos o información."
                  }
                </p>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gris uppercase tracking-widest px-1">
                    {decisionType === 'aprobado' ? 'Comentario (Opcional)' : 'Comentario / Motivo (Obligatorio)'}
                  </label>
                  <textarea 
                    value={decisionComment}
                    onChange={(e) => setDecisionComment(e.target.value)}
                    placeholder="Escribe aquí tus observaciones..."
                    className="w-full h-32 bg-gray-50 border-2 border-transparent focus:border-rojo focus:bg-white rounded-2xl p-6 text-sm font-medium transition-all outline-none resize-none"
                  />
                  {(decisionType === 'rechazado' || decisionType === 'devuelto') && !decisionComment.trim() && (
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-rojo uppercase tracking-tight px-1">
                      <AlertCircle size={12} /> Se requiere un comentario para esta acción
                    </div>
                  )}
                </div>
              </div>

              <div className="p-8 bg-gray-50/50 flex items-center justify-end gap-4 shadow-inner">
                <button 
                  onClick={() => setIsDecisionModalOpen(false)}
                  className="px-6 py-4 text-xs font-black text-gris uppercase tracking-widest hover:text-texto transition-all"
                >
                  Cancelar
                </button>
                <button 
                  disabled={(decisionType === 'rechazado' || decisionType === 'devuelto') && !decisionComment.trim()}
                  onClick={handleConfirmDecision}
                  className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.15em] transition-all flex items-center gap-2 tbs-shadow ${
                    (decisionType === 'rechazado' || decisionType === 'devuelto') && !decisionComment.trim()
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-60'
                    : decisionType === 'aprobado' ? 'bg-green-600 text-white hover:bg-green-700' :
                      decisionType === 'rechazado' ? 'bg-red-600 text-white hover:bg-red-700' :
                      'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {decisionType === 'aprobado' && <CheckCircle2 size={18} />}
                  {decisionType === 'rechazado' && <XCircle size={18} />}
                  {decisionType === 'devuelto' && <Undo2 size={18} />}
                  Confirmar {decisionType}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderApprovalsPage;
