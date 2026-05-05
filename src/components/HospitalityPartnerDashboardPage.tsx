import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Button,
  StatusBadge,
  MetricCard,
  AlertBox,
  EmptyState,
  SectionHeader,
  ActionCard,
  ModalShell,
  TableShell,
  PageHero,
  PageContainer,
  PageHeader,
  ModuleTabs
} from './ui';
import { 
  Users, 
  Calendar, 
  ShoppingBag, 
  DollarSign, 
  FileText, 
  Plus, 
  ChevronLeft,
  ChevronRight, 
  MoreHorizontal, 
  Building2, 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  Tag as TagIcon,
  MessageSquare,
  Search,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertCircle,
  Truck as TruckIcon
} from 'lucide-react';
import { 
  User, 
  HospitalityPartnerProfile, 
  ManagedClient, 
  ManagedEvent, 
  HospitalityCommission, 
  HospitalityCommissionRule,
  ManagedClientBillingType
} from '../types';

interface HospitalityPartnerDashboardPageProps {
  currentUser: User | null;
  partnerProfile: HospitalityPartnerProfile | null;
  managedClients: ManagedClient[];
  managedEvents: ManagedEvent[];
  commissions: HospitalityCommission[];
  commissionRules: HospitalityCommissionRule[];
  onGoCatalog: () => void;
  onGoAdvisorChat: (topic?: any, context?: any) => void;
  onGoOrdersTracking: () => void;
  onGoAccount: () => void;
  onCreateManagedClient: (client: any) => void;
  onCreateManagedEvent: (event: any) => void;
  onStartPurchaseForClient: (clientId: string, eventId?: string, billingType?: ManagedClientBillingType) => void;
  onSettleCommission: (commissionId: string, documentUrl: string) => void;
}

export function HospitalityPartnerDashboardPage({
  currentUser,
  partnerProfile,
  managedClients,
  managedEvents,
  commissions,
  commissionRules,
  onGoCatalog,
  onGoAdvisorChat,
  onGoOrdersTracking,
  onGoAccount,
  onCreateManagedClient,
  onCreateManagedEvent,
  onStartPurchaseForClient,
  onSettleCommission
}: HospitalityPartnerDashboardPageProps) {
  const [activeTab, setActiveTab] = useState<'resumen' | 'clientes' | 'eventos' | 'comisiones' | 'documentos'>('resumen');
  const [showCreateClientModal, setShowCreateClientModal] = useState(false);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  
  // Liquidation state
  const [selectedCommission, setSelectedCommission] = useState<HospitalityCommission | null>(null);
  const [showLiquidationModal, setShowLiquidationModal] = useState(false);
  const [isSubmittingLiquidation, setIsSubmittingLiquidation] = useState(false);

  // commission summary dynamic calculations
  const commissionSummary = [
    { label: 'Estimada', value: commissions.filter(c => c.status === 'estimada').reduce((sum, c) => sum + c.commissionAmount, 0) },
    { label: 'Por Liquidar', value: commissions.filter(c => c.status === 'pendiente_liquidacion').reduce((sum, c) => sum + c.commissionAmount, 0) },
    { label: 'En Revisión', value: commissions.filter(c => c.status === 'en_revision').reduce((sum, c) => sum + c.commissionAmount, 0) },
    { label: 'Aprobada', value: commissions.filter(c => c.status === 'aprobada').reduce((sum, c) => sum + c.commissionAmount, 0) },
    { label: 'Pagada', value: commissions.filter(c => c.status === 'pagada').reduce((sum, c) => sum + c.commissionAmount, 0) },
  ];

  const handleSettleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCommission) return;
    
    setIsSubmittingLiquidation(true);
    // Simulate upload delay
    setTimeout(() => {
      onSettleCommission(selectedCommission.id, 'doc-dummy-url.pdf');
      setIsSubmittingLiquidation(false);
      setShowLiquidationModal(false);
      setSelectedCommission(null);
    }, 1500);
  };
  
  // Create client form state
  const [clientForm, setClientForm] = useState({
    businessName: '',
    legalName: '',
    nit: '',
    clientType: 'evento' as any,
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    city: 'Cartagena',
    address: '',
    billingType: 'facturar_cliente_final' as ManagedClientBillingType,
    notes: ''
  });

  // Create event form state
  const [eventForm, setEventForm] = useState({
    eventName: '',
    managedClientId: '',
    eventType: 'boda' as any,
    eventDate: '',
    city: 'Cartagena',
    venueName: '',
    deliveryAddress: '',
    estimatedGuests: 0,
    deliveryWindow: '',
    notes: ''
  });

  const handleClientFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateManagedClient({
      ...clientForm,
      id: `mc-${Math.random().toString(36).substr(2, 9)}`,
      status: 'pendiente_validacion',
      createdAt: new Date().toISOString().split('T')[0],
      assignedPartnerId: partnerProfile?.id || '',
      assignedPartnerName: partnerProfile?.name || ''
    });
    setShowCreateClientModal(false);
    // Reset form
    setClientForm({
      businessName: '',
      legalName: '',
      nit: '',
      clientType: 'evento',
      contactName: '',
      contactPhone: '',
      contactEmail: '',
      city: 'Cartagena',
      address: '',
      billingType: 'facturar_cliente_final',
      notes: ''
    });
  };

  const handleEventFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedClient = managedClients.find(c => c.id === eventForm.managedClientId);
    onCreateManagedEvent({
      ...eventForm,
      id: `event-${Math.random().toString(36).substr(2, 9)}`,
      managedClientName: selectedClient?.businessName || '',
      status: 'planeado',
    });
    setShowCreateEventModal(false);
    // Reset form
    setEventForm({
      eventName: '',
      managedClientId: '',
      eventType: 'boda',
      eventDate: '',
      city: 'Cartagena',
      venueName: '',
      deliveryAddress: '',
      estimatedGuests: 0,
      deliveryWindow: '',
      notes: ''
    });
  };

  const stats = [
    { label: 'Clientes Activos', value: managedClients.filter(c => c.status === 'activo').length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Eventos Programados', value: managedEvents.filter(e => e.status !== 'cerrado' && e.status !== 'cancelado').length, icon: Calendar, color: 'text-rojo', bg: 'bg-rojo/5' },
    { label: 'Comisión Estimada', value: `$${commissions.reduce((sum, c) => sum + c.commissionAmount, 0).toLocaleString('es-CO')}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Pendiente Validación', value: managedClients.filter(c => c.status === 'pendiente_validacion').length, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'activo':
      case 'entregado':
        return <span className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-black uppercase rounded-md flex items-center gap-1 w-fit"><CheckCircle2 size={10} /> Activo</span>;
      case 'pagada':
        return <span className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-black uppercase rounded-md flex items-center gap-1 w-fit"><CheckCircle2 size={10} /> Pagada</span>;
      case 'aprobada':
        return <span className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-black uppercase rounded-md flex items-center gap-1 w-fit"><CheckCircle2 size={10} /> Aprobada</span>;
      case 'pendiente_validacion':
      case 'estimada':
        return <span className="px-2 py-1 bg-orange-50 text-orange-700 text-[10px] font-black uppercase rounded-md flex items-center gap-1 w-fit"><Clock size={10} /> Estimada</span>;
      case 'pendiente_liquidacion':
        return <span className="px-2 py-1 bg-amber-50 text-amber-700 text-[10px] font-black uppercase rounded-md flex items-center gap-1 w-fit"><DollarSign size={10} /> Por Liquidar</span>;
      case 'en_revision':
        return <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase rounded-md flex items-center gap-1 w-fit"><Search size={10} /> En Revisión</span>;
      case 'planeado':
        return <span className="px-2 py-1 bg-orange-50 text-orange-700 text-[10px] font-black uppercase rounded-md flex items-center gap-1 w-fit"><Clock size={10} /> Pendiente</span>;
      case 'entrega_programada':
        return <span className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-black uppercase rounded-md flex items-center gap-1 w-fit"><Calendar size={10} /> Programado</span>;
      default:
        return <span className="px-2 py-1 bg-gray-50 text-gray-700 text-[10px] font-black uppercase rounded-md w-fit">{status}</span>;
    }
  };

  const getPartnerTypeLabel = (type?: string) => {
    const types: Record<string, string> = {
      wedding_planner: 'Wedding Planner',
      event_planner: 'Event Planner',
      catering: 'Catering',
      hotel_concierge: 'Concierge Hotel',
      bar_consultant: 'Consultor de Bar',
      hospitality_consultant: 'Consultor de Hospitalidad',
      agency: 'Agencia',
      other: 'Otros'
    };
    return type ? types[type] || type : 'Gestor';
  };

  const MonthlyCalendar = ({ events }: { events: ManagedEvent[] }) => {
    const [viewDate, setViewDate] = useState(new Date());
    
    // Get calendar info
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0(Sun) - 6(Sat)
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
    const nextMonth = () => setViewDate(new Date(year, month + 1, 1));
    const isToday = (day: number) => {
      const today = new Date();
      return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
    };

    const getEventsForDay = (day: number) => {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      return events.filter(e => e.eventDate === dateStr);
    };

    // Calendar grid
    const calendarDays = [];
    // Padding for first week
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push(<div key={`pad-${i}`} className="h-14" />);
    }
    // Days in month
    for (let d = 1; d <= daysInMonth; d++) {
      const dayEvents = getEventsForDay(d);
      const hasEvents = dayEvents.length > 0;
      
      calendarDays.push(
        <div key={d} className="relative group h-14 border border-[#F1F3F5] hover:bg-rojo/5 transition-colors cursor-default">
          <div className={`absolute top-1 left-1.5 text-[10px] font-black ${isToday(d) ? 'bg-rojo text-white w-5 h-5 flex items-center justify-center rounded-full' : 'text-gris-oscuro'}`}>
            {d}
          </div>
          {hasEvents && (
            <div className="absolute inset-0 flex items-center justify-center pt-2">
              <div className="w-1.5 h-1.5 rounded-full bg-rojo shadow-sm shadow-rojo/50" />
            </div>
          )}
          {hasEvents && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block z-20">
              <div className="bg-texto text-white text-[9px] font-bold px-2 py-1 rounded shadow-xl whitespace-nowrap">
                {dayEvents.map(e => e.eventName).join(', ')}
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-[#F1F3F5]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-rojo/10 rounded-xl flex items-center justify-center text-rojo">
              <Calendar size={18} />
            </div>
            <h4 className="text-xl font-black tracking-tight text-texto">
              {monthNames[month]} {year}
            </h4>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><ChevronLeft size={18} /></button>
            <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><ChevronRight size={18} /></button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-px mb-2 text-center">
          {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map(d => (
            <div key={d} className="text-[10px] font-black text-gris uppercase tracking-widest py-2">
              {d}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 border-t border-l border-[#F1F3F5]">
          {calendarDays}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20 pt-12">
      <PageContainer variant="dashboard">
        <PageHeader
          eyebrow="Perfil Gestión TBS"
          title={partnerProfile?.name || currentUser?.name || 'Gestor Hospitality'}
          description={`${getPartnerTypeLabel(partnerProfile?.partnerType)} • ${partnerProfile?.city || 'Colombia'}. Gestiona tus clientes y comisiones.`}
          metric={{
            label: "Operación Hospitality",
            value: partnerProfile?.city || 'Cartagena, CO'
          }}
          primaryAction={{
            label: "Crear Cliente",
            onClick: () => setShowCreateClientModal(true),
            icon: Plus
          }}
          secondaryAction={{
            label: "Crear Evento",
            onClick: () => setShowCreateEventModal(true),
            icon: Calendar,
            variant: 'outline'
          }}
          variant="dashboard"
        />

        {/* Navigation Tabs */}
        <div className="mb-10">
          <ModuleTabs 
            tabs={[
              { id: 'resumen', label: 'Resumen', icon: Building2 },
              { id: 'clientes', label: 'Clientes Gestionados', icon: Users },
              { id: 'eventos', label: 'Eventos', icon: Calendar },
              { id: 'comisiones', label: 'Comisiones', icon: DollarSign },
              { id: 'documentos', label: 'Documentos y Reglas', icon: FileText }
            ]}
            activeTab={activeTab}
            onChange={(id) => setActiveTab(id as any)}
            variant="dashboard"
          />
        </div>

        {/* Content Tabs */}
        <div className="space-y-8">
          {activeTab === 'resumen' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Activity Column */}
              <div className="lg:col-span-2 space-y-8">
                {/* Visual Calendar */}
                <MonthlyCalendar events={managedEvents} />

                {/* Recent Managed Clients */}
                <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                   <SectionHeader
                     title="Próximos Eventos"
                     actionLabel="Ver todos"
                     onAction={() => setActiveTab('eventos')}
                   />
                   <div className="space-y-4 mt-8">
                      {managedEvents.map((event) => (
                        <div key={event.id} className="flex items-center justify-between p-5 bg-[#F9FAFB] rounded-2xl border border-[#F1F3F5] group hover:border-rojo transition-all">
                           <div className="flex items-center gap-4">
                              <div className="bg-white p-3 rounded-xl border border-borde text-rojo">
                                 <Calendar size={20} />
                              </div>
                              <div>
                                 <div className="font-black text-texto text-base">{event.eventName}</div>
                                 <div className="text-xs text-gris font-bold">{event.managedClientName} • {event.eventDate}</div>
                              </div>
                           </div>
                           <div className="flex items-center gap-4">
                              {getStatusBadge(event.status)}
                              <button 
                                onClick={() => onStartPurchaseForClient(event.managedClientId, event.id)}
                                className="bg-texto text-white px-5 py-2 rounded-xl text-xs font-black shadow-lg hover:bg-rojo transition-all"
                              >
                                Comprar
                              </button>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                {/* Account Settings / Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center">
                      <div className="bg-blue-50 p-5 rounded-2xl text-blue-600 mb-4">
                         <Users size={32} />
                      </div>
                      <h4 className="text-xl font-black text-texto mb-2">Solicitar Cliente</h4>
                      <p className="text-sm text-gris font-medium mb-6">Inicia el proceso de creación de un nuevo cliente para facturación directa.</p>
                      <button 
                        onClick={() => setShowCreateClientModal(true)}
                        className="mt-auto w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-sm shadow-xl hover:bg-blue-700 transition-all"
                      >
                        Crear nuevo cliente
                      </button>
                   </div>
                   <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center">
                      <div className="bg-rojo/5 p-5 rounded-2xl text-rojo mb-4">
                         <MessageSquare size={32} />
                      </div>
                      <h4 className="text-xl font-black text-texto mb-2">Hablar con Asesor</h4>
                      <p className="text-sm text-gris font-medium mb-6">Consulta condiciones, inventarios especiales para eventos o soportes de pago.</p>
                      <button 
                        onClick={() => onGoAdvisorChat('otro', 'Gestión Hospitality')}
                        className="mt-auto w-full bg-texto text-white py-4 rounded-2xl font-black text-sm shadow-xl hover:bg-rojo transition-all"
                      >
                        Iniciar Chat TBS
                      </button>
                   </div>
                </div>
              </div>

              {/* Sidebar Column */}
              <div className="space-y-8">
                {/* Commission Summary */}
                <div className="bg-texto text-white rounded-[32px] p-8 shadow-xl relative overflow-hidden">
                   <div className="absolute -bottom-6 -right-6 opacity-10 rotate-12">
                      <DollarSign size={160} />
                   </div>
                   <div className="relative z-10">
                      <div className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Comisión Mes</div>
                      <div className="text-4xl font-black tracking-tighter mb-8">
                        ${commissions.reduce((sum, c) => sum + c.commissionAmount, 0).toLocaleString('es-CO')}
                      </div>
                      
                      <div className="space-y-4 mb-8">
                         <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                            <span className="text-xs font-bold text-white/70">Estimadas</span>
                            <span className="font-black">${commissions.filter(c => c.status === 'estimada').reduce((sum, c) => sum + c.commissionAmount, 0).toLocaleString('es-CO')}</span>
                         </div>
                         <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                            <span className="text-xs font-bold text-white/70">Liquidadas / Pagadas</span>
                            <span className="font-black">${commissions.filter(c => c.status === 'pagada').reduce((sum, c) => sum + c.commissionAmount, 0).toLocaleString('es-CO')}</span>
                         </div>
                      </div>

                      <button onClick={() => setActiveTab('comisiones')} className="w-full bg-white text-texto py-4 rounded-2xl font-black text-sm hover:bg-gray-100 transition-all flex items-center justify-center gap-2 group">
                        Ver detalles
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                   </div>
                </div>

                {/* News / Rules Tip */}
                <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                   <div className="flex gap-4 items-start mb-6">
                      <div className="bg-orange-50 p-3 rounded-xl text-orange-600 shrink-0">
                         <Info size={20} />
                      </div>
                      <div>
                         <h4 className="font-black text-texto text-lg tracking-tight leading-tight">Estado de clientes</h4>
                         <p className="text-xs text-gris font-medium mt-1">Recuerda que solo puedes comprar para clientes con estado 'Activo'.</p>
                      </div>
                   </div>
                   <div className="space-y-3">
                      <div className="flex items-start gap-3">
                         <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5" />
                         <span className="text-[11px] text-gris font-bold uppercase">Facturación habilitada</span>
                      </div>
                      <div className="flex items-start gap-3">
                         <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5" />
                         <span className="text-[11px] text-gris font-bold uppercase">Pendiente validación TBS</span>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'clientes' && (
            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
               <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h3 className="text-2xl font-black tracking-tighter text-texto">Clientes Gestionados</h3>
                    <p className="text-sm text-gris font-medium">Administra las cuentas y razones sociales de tus clientes finales.</p>
                  </div>
                  <button 
                    onClick={() => setShowCreateClientModal(true)}
                    className="flex items-center gap-2 bg-rojo text-white px-6 py-4 rounded-2xl font-black text-sm shadow-xl hover:scale-105 transition-all"
                  >
                    <Plus size={18} />
                    Crear nuevo cliente
                  </button>
               </div>
               
               <div className="overflow-x-auto">
                 <table className="w-full">
                    <thead className="bg-[#F9FAFB] border-b border-gray-100">
                       <tr>
                          <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-gris">Estado</th>
                          <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-gris">Razón Social / NIT</th>
                          <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-gris">Contacto</th>
                          <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-gris">Facturación</th>
                          <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-gris">Acciones</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {managedClients.length > 0 ? managedClients.map((client) => (
                          <tr key={client.id} className="hover:bg-gray-50 transition-all cursor-pointer">
                             <td className="px-8 py-6">
                                {getStatusBadge(client.status)}
                             </td>
                             <td className="px-8 py-6">
                                <div className="font-black text-texto text-base">{client.businessName}</div>
                                <div className="text-xs text-gris font-bold">{client.nit || 'NIT no registrado'}</div>
                             </td>
                             <td className="px-8 py-6">
                                <div className="text-sm font-bold text-texto">{client.contactName}</div>
                                <div className="text-[11px] text-gris font-medium uppercase tracking-tight">{client.contactPhone}</div>
                             </td>
                             <td className="px-8 py-6 text-sm font-bold text-texto">
                                {client.billingType === 'facturar_cliente_final' ? 'Factura Cliente' : 'Factura Gestor'}
                             </td>
                             <td className="px-8 py-6">
                                <div className="flex items-center gap-2">
                                   <button 
                                     onClick={() => onStartPurchaseForClient(client.id)}
                                     disabled={client.status === 'inactivo' || client.status === 'rechazado'}
                                     className="p-3 bg-white border border-borde rounded-xl text-rojo hover:bg-rojo hover:text-white transition-all disabled:opacity-30 disabled:pointer-events-none"
                                     title="Comprar para este cliente"
                                   >
                                     <ShoppingBag size={18} />
                                   </button>
                                   <button 
                                     onClick={() => onGoAdvisorChat('otro', `Cliente: ${client.businessName}`)}
                                     className="p-3 bg-white border border-borde rounded-xl text-gris hover:border-texto hover:text-texto transition-all"
                                     title="Hablar con asesor"
                                   >
                                     <MessageSquare size={18} />
                                   </button>
                                </div>
                             </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan={5} className="px-8 py-20 text-center">
                              <EmptyState 
                                compact
                                title="No tienes clientes registrados"
                                description="Comienza a gestionar tus aliados para poder realizar compras a su nombre y ganar comisiones."
                                primaryActionLabel="Registrar primer cliente"
                                onPrimaryAction={() => setShowCreateClientModal(true)}
                              />
                            </td>
                          </tr>
                        )}
                      </tbody>
                 </table>
               </div>
            </div>
          )}

          {activeTab === 'eventos' && (
            <div className="space-y-8">
               <MonthlyCalendar events={managedEvents} />
               
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {managedEvents.length > 0 ? managedEvents.map((event) => (
                 <div key={event.id} className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 flex flex-col h-full tarjeta-hover">
                    <div className="flex items-center justify-between mb-6">
                       <div className="p-4 bg-rojo/5 rounded-2xl text-rojo">
                          <Calendar size={28} />
                       </div>
                       {getStatusBadge(event.status)}
                    </div>
                    
                    <h4 className="text-2xl font-black tracking-tighter text-texto mb-2">{event.eventName}</h4>
                    <p className="text-sm text-gris font-black uppercase tracking-widest mb-6">{event.managedClientName}</p>
                    
                    <div className="space-y-4 mb-8">
                       <div className="flex items-center gap-3 text-sm text-gris-oscuro font-bold">
                          <Clock size={16} className="text-rojo" />
                          {event.eventDate}
                       </div>
                       <div className="flex items-center gap-3 text-sm text-gris-oscuro font-bold">
                          <MapPin size={16} className="text-rojo" />
                          {event.venueName}, {event.city}
                       </div>
                       <div className="flex items-center gap-3 text-sm text-gris-oscuro font-bold">
                          <TruckIllustration size={16} className="text-rojo" />
                          {event.deliveryWindow}
                       </div>
                    </div>

                    <div className="mt-auto pt-6 border-t border-gray-50 grid grid-cols-2 gap-3">
                       <button 
                         onClick={() => onStartPurchaseForClient(event.managedClientId, event.id)}
                         className="bg-texto text-white py-4 rounded-2xl font-black text-sm shadow-xl hover:bg-rojo transition-all"
                       >
                         Comprar
                       </button>
                       <button 
                         onClick={() => onGoAdvisorChat('pedido', `Evento: ${event.eventName}`)}
                         className="bg-white border border-borde text-texto py-4 rounded-2xl font-black text-sm hover:border-rojo hover:text-rojo transition-all"
                       >
                         Detalles
                       </button>
                    </div>
                 </div>
               )) : (
                 <div className="lg:col-span-2">
                   <EmptyState 
                    title="No hay eventos programados"
                    description="Crea tu primer evento para organizar la logística y los pedidos de tus clientes finales."
                    primaryActionLabel="Programar primer evento"
                    onPrimaryAction={() => setShowCreateEventModal(true)}
                    compact
                   />
                 </div>
               )}

               <button 
                 onClick={() => setShowCreateEventModal(true)}
                 className="bg-white border-2 border-dashed border-gray-200 rounded-[32px] p-8 flex flex-col items-center justify-center text-center group hover:border-rojo transition-all min-h-[300px]"
               >
                 <div className="bg-gray-50 p-6 rounded-2xl text-gris group-hover:bg-rojo/5 group-hover:text-rojo transition-all mb-4">
                    <Plus size={40} />
                 </div>
                 <h4 className="text-xl font-black text-texto mb-2">Crear Nuevo Evento</h4>
                 <p className="text-sm text-gris font-medium max-w-[200px]">Define logística y asocia un cliente para realizar compras.</p>
               </button>
            </div>
          </div>
        )}

          {activeTab === 'comisiones' && (
            <div className="space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {commissionSummary.map((com, i) => (
                    <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                       <div className="text-[10px] text-gris font-black uppercase tracking-widest mb-1">{com.label}</div>
                       <div className="text-xl font-black text-texto">${com.value.toLocaleString('es-CO')}</div>
                    </div>
                  ))}
               </div>

               <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-8 border-b border-gray-100">
                    <h3 className="text-2xl font-black tracking-tighter text-texto">Historial de Comisiones</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                       <thead className="bg-[#F9FAFB] border-b border-gray-100">
                          <tr>
                             <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-gris">Pedido</th>
                             <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-gris">Cliente / Evento</th>
                             <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-gris">Total Pedido</th>
                             <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-gris">Comisión (%)</th>
                             <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-gris">Estado</th>
                             <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-gris">Acciones</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-100">
                          {commissions.length > 0 ? commissions.map((comm) => (
                            <tr key={comm.id} className="hover:bg-gray-50 transition-all">
                               <td className="px-8 py-6">
                                  <div className="font-black text-texto text-base">{comm.orderNumber}</div>
                                  <div className="text-[11px] text-gris font-bold uppercase">{comm.orderDate}</div>
                               </td>
                               <td className="px-8 py-6">
                                  <div className="text-sm font-bold text-texto">{comm.managedClientName}</div>
                                  <div className="text-[11px] text-gris font-medium uppercase tracking-tight">{comm.eventName || 'Compra directa'}</div>
                               </td>
                               <td className="px-8 py-6">
                                  <div className="text-sm font-bold text-texto">${comm.orderTotal.toLocaleString('es-CO')}</div>
                               </td>
                               <td className="px-8 py-6">
                                  <div className="text-sm font-black text-rojo">${comm.commissionAmount.toLocaleString('es-CO')}</div>
                                  <div className="text-[10px] text-gris font-black uppercase">({comm.commissionPercent}%)</div>
                               </td>
                               <td className="px-8 py-6">
                                  {getStatusBadge(comm.status)}
                                </td>
                                <td className="px-8 py-6 text-right">
                                   {comm.status === 'pendiente_liquidacion' && (
                                     <button 
                                       onClick={() => {
                                         setSelectedCommission(comm);
                                         setShowLiquidationModal(true);
                                       }}
                                       className="bg-rojo text-white text-[10px] font-black px-4 py-2 rounded-xl hover:bg-rojo/90 transition-all shadow-sm shadow-rojo/20 uppercase tracking-widest"
                                     >
                                       Solicitar Liquidación
                                     </button>
                                   )}
                                   {comm.status === 'pagada' && comm.tbsProofOfPaymentUrl && (
                                     <button className="text-rojo hover:underline text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ml-auto">
                                       <FileText size={12} /> Ver Comprobante
                                     </button>
                                   )}
                                </td>
                            </tr>
                          )) : (
                            <tr>
                              <td colSpan={6} className="px-8 py-20">
                                <EmptyState 
                                  compact
                                  title="No hay comisiones generadas aún"
                                  description="Las comisiones aparecerán aquí una vez que tus clientes gestionados realicen pedidos efectivos."
                                  contextLabel="Hospitality Partners"
                                />
                              </td>
                            </tr>
                          )}
                       </tbody>
                    </table>
                  </div>
               </div>
               
               <div className="bg-orange-50 rounded-[32px] p-8 border border-orange-100 flex gap-6 items-start">
                  <div className="bg-white p-3 rounded-2xl text-orange-600 shadow-sm shrink-0">
                     <AlertCircle size={24} />
                  </div>
                  <div>
                     <h4 className="font-black text-orange-800 text-lg mb-2 underline underline-offset-4 decoration-orange-200">Nota Legal sobre Comisiones</h4>
                     <p className="text-sm text-orange-700/80 font-medium leading-relaxed">
                        Las comisiones se causan sobre pedidos efectivamente pagados y entregados. El cálculo mostrado es estimado y está sujeto a validación comercial por parte de TBS, considerando descuentos, devoluciones, anulaciones y el perfil tributario del gestor. Las comisiones aprobadas se liquidan mensualmente.
                     </p>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'documentos' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Commission Rules */}
               <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100">
                  <h3 className="text-2xl font-black tracking-tighter text-texto mb-8">Reglas de Comisión</h3>
                  <div className="space-y-6">
                     {commissionRules.map((rule) => (
                       <div key={rule.id} className="p-8 bg-[#F9FAFB] rounded-[32px] border border-[#F1F3F5] border-l-8 border-l-rojo">
                          <div className="flex items-center justify-between mb-6">
                             <div className="text-[10px] font-black uppercase tracking-widest text-rojo bg-rojo/5 px-4 py-1.5 rounded-full">Activa</div>
                             <div className="text-3xl font-black text-texto">{rule.commissionPercent}%</div>
                          </div>
                          <h4 className="text-lg font-black text-texto mb-3">{rule.description}</h4>
                          <div className="space-y-3 pt-6 border-t border-gray-100">
                             <div className="text-[11px] font-black uppercase tracking-widest text-gris mb-3">Aplica a categorías:</div>
                             <div className="flex flex-wrap gap-2">
                                {rule.appliesToCategories?.map((cat, i) => (
                                  <span key={i} className="bg-white border border-borde px-4 py-2 rounded-full text-xs font-bold text-gris-oscuro">{cat}</span>
                                ))}
                             </div>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>

               {/* Guidelines */}
               <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100">
                  <h3 className="text-2xl font-black tracking-tighter text-texto mb-8">Políticas de Gestión</h3>
                  <div className="space-y-8">
                     {[
                       { title: 'Validación de Clientes', desc: 'TBS validará la información de contacto y NIT de cada cliente final antes de habilitar su compra directa con facturación.' },
                       { title: 'Gestión de Entregas', desc: 'Como gestor, puedes definir la ventana de entrega de cada evento. La logística se coordinará según la dirección registrada para el lugar.' },
                       { title: 'Confirmación de Pedidos', desc: 'Los pedidos realizados para clientes nuevos en estado "Pendiente" quedarán en revisión por el equipo comercial de TBS.' },
                       { title: 'Anulaciones y Devoluciones', desc: 'Si un pedido es anulado o se realiza una devolución total/parcial, la comisión se recalculará o anulará según corresponda.' }
                     ].map((item, i) => (
                       <div key={i} className="flex gap-6 items-start">
                          <div className="w-8 h-8 rounded-full bg-gray-100 text-texto flex items-center justify-center font-black text-xs shrink-0">{i+1}</div>
                          <div>
                             <h4 className="font-black text-texto text-lg tracking-tight mb-2">{item.title}</h4>
                             <p className="text-sm text-gris font-medium leading-relaxed">{item.desc}</p>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          )}
        </div>

      {/* Modals */}
      <AnimatePresence>
        {showCreateClientModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }}
               onClick={() => setShowCreateClientModal(false)}
               className="fixed inset-0 bg-black/60 backdrop-blur-sm"
             />
             <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 30 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 30 }}
               className="relative w-full max-w-2xl bg-white rounded-[40px] overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh]"
             >
                <div className="p-10 border-b border-gray-100 flex items-center justify-between">
                   <div>
                      <h3 className="text-3xl font-black tracking-tighter text-texto">Solicitar creación de cliente</h3>
                      <p className="text-sm text-gris font-bold uppercase tracking-widest mt-1">Perfil Hospitality & Eventos</p>
                   </div>
                   <button onClick={() => setShowCreateClientModal(false)} className="bg-gray-50 text-texto p-4 rounded-full hover:bg-gray-100 transition-all outline-none">
                      <Plus size={24} className="rotate-45" />
                   </button>
                </div>

                <div className="p-10 overflow-y-auto bg-gray-50/50 custom-scrollbar">
                   <form onSubmit={handleClientFormSubmit} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gris px-1">Nombre Comercial / Evento</label>
                            <input 
                              required
                              type="text" 
                              value={clientForm.businessName}
                              onChange={(e) => setClientForm({...clientForm, businessName: e.target.value})}
                              placeholder="Ej: Boda Martínez & Pérez" 
                              className="w-full bg-white border border-borde rounded-2xl px-5 py-4 font-bold text-sm outline-none focus:border-rojo transition-all"
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gris px-1">Tipo de Cliente</label>
                            <select 
                              value={clientForm.clientType}
                              onChange={(e) => setClientForm({...clientForm, clientType: e.target.value as any})}
                              className="w-full bg-white border border-borde rounded-2xl px-5 py-4 font-bold text-sm outline-none focus:border-rojo appearance-none transition-all cursor-pointer"
                            >
                               <option value="persona_natural">Persona Natural</option>
                               <option value="empresa">Empresa</option>
                               <option value="hotel">Hotel</option>
                               <option value="restaurante">Restaurante</option>
                               <option value="evento">Evento / Boda</option>
                               <option value="otro">Otro</option>
                            </select>
                         </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gris px-1">Razón Social Legal (ID Cliente)</label>
                            <input 
                              type="text" 
                              value={clientForm.legalName}
                              onChange={(e) => setClientForm({...clientForm, legalName: e.target.value})}
                              placeholder="Nombre legal para factura" 
                              className="w-full bg-white border border-borde rounded-2xl px-5 py-4 font-bold text-sm outline-none focus:border-rojo transition-all"
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gris px-1">NIT / CC</label>
                            <input 
                              type="text" 
                              value={clientForm.nit}
                              onChange={(e) => setClientForm({...clientForm, nit: e.target.value})}
                              placeholder="000.000.000-0" 
                              className="w-full bg-white border border-borde rounded-2xl px-5 py-4 font-bold text-sm outline-none focus:border-rojo transition-all"
                            />
                         </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gris px-1">Nombre Contacto</label>
                            <input 
                              required
                              type="text" 
                              value={clientForm.contactName}
                              onChange={(e) => setClientForm({...clientForm, contactName: e.target.value})}
                              placeholder="Nombre del cliente final" 
                              className="w-full bg-white border border-borde rounded-2xl px-5 py-4 font-bold text-sm outline-none focus:border-rojo transition-all"
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gris px-1">Teléfono</label>
                            <input 
                              required
                              type="tel" 
                              value={clientForm.contactPhone}
                              onChange={(e) => setClientForm({...clientForm, contactPhone: e.target.value})}
                              placeholder="300 000 0000" 
                              className="w-full bg-white border border-borde rounded-2xl px-5 py-4 font-bold text-sm outline-none focus:border-rojo transition-all"
                            />
                         </div>
                      </div>

                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-gris px-1">Tipo de Facturación</label>
                         <div className="grid grid-cols-2 gap-4">
                            {[
                              { id: 'facturar_cliente_final', label: 'Facturar Cliente Final' },
                              { id: 'facturar_gestor', label: 'Facturar al Gestor' }
                            ].map((type) => (
                              <button
                                key={type.id}
                                type="button"
                                onClick={() => setClientForm({...clientForm, billingType: type.id as any})}
                                className={`px-5 py-4 rounded-2xl font-black text-xs border transition-all ${
                                  clientForm.billingType === type.id 
                                    ? 'bg-rojo text-white border-rojo shadow-lg' 
                                    : 'bg-white text-gris border-borde hover:border-rojo hover:text-rojo'
                                }`}
                              >
                                {type.label}
                              </button>
                            ))}
                         </div>
                      </div>

                      <div className="pt-6">
                         <button 
                            type="submit"
                            className="w-full bg-texto text-white py-6 rounded-2xl font-black text-xl shadow-2xl hover:bg-rojo transition-all flex items-center justify-center gap-4"
                         >
                            Enviar solicitud a TBS
                            <ArrowRight size={22} />
                         </button>
                      </div>
                   </form>
                </div>
             </motion.div>
          </div>
        )}

        {showCreateEventModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }}
               onClick={() => setShowCreateEventModal(false)}
               className="fixed inset-0 bg-black/60 backdrop-blur-sm"
             />
             <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 30 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 30 }}
               className="relative w-full max-w-2xl bg-white rounded-[40px] overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh]"
             >
                <div className="p-10 border-b border-gray-100 flex items-center justify-between">
                   <div>
                      <h3 className="text-3xl font-black tracking-tighter text-texto">Programar Nuevo Evento</h3>
                      <p className="text-sm text-gris font-bold uppercase tracking-widest mt-1">Logística y Entregas Especiales</p>
                   </div>
                   <button onClick={() => setShowCreateEventModal(false)} className="bg-gray-50 text-texto p-4 rounded-full hover:bg-gray-100 transition-all outline-none">
                      <Plus size={24} className="rotate-45" />
                   </button>
                </div>

                <div className="p-10 overflow-y-auto bg-gray-50/50 custom-scrollbar">
                   <form onSubmit={handleEventFormSubmit} className="space-y-8">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-gris px-1">Nombre del Evento</label>
                         <input 
                           required
                           type="text" 
                           value={eventForm.eventName}
                           onChange={(e) => setEventForm({...eventForm, eventName: e.target.value})}
                           placeholder="Ej: Boda García - Hacienda Real" 
                           className="w-full bg-white border border-borde rounded-2xl px-5 py-4 font-bold text-sm outline-none focus:border-rojo transition-all"
                         />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gris px-1">Cliente Asociado</label>
                            <select 
                              required
                              value={eventForm.managedClientId}
                              onChange={(e) => setEventForm({...eventForm, managedClientId: e.target.value})}
                              className="w-full bg-white border border-borde rounded-2xl px-5 py-4 font-bold text-sm outline-none focus:border-rojo appearance-none transition-all cursor-pointer"
                            >
                               <option value="">Selecciona un cliente</option>
                               {managedClients.map(c => (
                                 <option key={c.id} value={c.id}>{c.businessName}</option>
                               ))}
                            </select>
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gris px-1">Tipo de Evento</label>
                            <select 
                              value={eventForm.eventType}
                              onChange={(e) => setEventForm({...eventForm, eventType: e.target.value as any})}
                              className="w-full bg-white border border-borde rounded-2xl px-5 py-4 font-bold text-sm outline-none focus:border-rojo appearance-none transition-all cursor-pointer"
                            >
                               <option value="boda">Boda</option>
                               <option value="evento_corporativo">Evento Corporativo</option>
                               <option value="banquete">Banquete</option>
                               <option value="fiesta_privada">Fiesta Privada</option>
                               <option value="evento_hotel">Evento en Hotel</option>
                               <option value="activacion_marca">Activación de Marca</option>
                               <option value="otro">Otro</option>
                            </select>
                         </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gris px-1">Fecha del Evento</label>
                            <input 
                              required
                              type="date" 
                              value={eventForm.eventDate}
                              onChange={(e) => setEventForm({...eventForm, eventDate: e.target.value})}
                              className="w-full bg-white border border-borde rounded-2xl px-5 py-4 font-bold text-sm outline-none focus:border-rojo transition-all"
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gris px-1">Lugar del Evento (Venue)</label>
                            <input 
                              type="text" 
                              value={eventForm.venueName}
                              onChange={(e) => setEventForm({...eventForm, venueName: e.target.value})}
                              placeholder="Nombre del salón, hacienda, etc." 
                              className="w-full bg-white border border-borde rounded-2xl px-5 py-4 font-bold text-sm outline-none focus:border-rojo transition-all"
                            />
                         </div>
                      </div>

                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-gris px-1">Dirección de Entrega</label>
                         <input 
                           required
                           type="text" 
                           value={eventForm.deliveryAddress}
                           onChange={(e) => setEventForm({...eventForm, deliveryAddress: e.target.value})}
                           placeholder="Dirección exacta para el despacho" 
                           className="w-full bg-white border border-borde rounded-2xl px-5 py-4 font-bold text-sm outline-none focus:border-rojo transition-all"
                         />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gris px-1">Invvitados Estimados</label>
                            <input 
                              type="number" 
                              value={eventForm.estimatedGuests}
                              onChange={(e) => setEventForm({...eventForm, estimatedGuests: parseInt(e.target.value)})}
                              className="w-full bg-white border border-borde rounded-2xl px-5 py-4 font-bold text-sm outline-none focus:border-rojo transition-all"
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gris px-1">Ventana de Entrega Deseada</label>
                            <input 
                              required
                              type="text" 
                              value={eventForm.deliveryWindow}
                              onChange={(e) => setEventForm({...eventForm, deliveryWindow: e.target.value})}
                              placeholder="Ej: Día del evento, 8am a 12pm" 
                              className="w-full bg-white border border-borde rounded-2xl px-5 py-4 font-bold text-sm outline-none focus:border-rojo transition-all"
                            />
                         </div>
                      </div>

                      <div className="pt-6">
                         <button 
                            type="submit"
                            className="w-full bg-texto text-white py-6 rounded-2xl font-black text-xl shadow-2xl hover:bg-rojo transition-all flex items-center justify-center gap-4"
                         >
                            Crear Evento Programado
                            <ArrowRight size={22} />
                         </button>
                      </div>
                   </form>
                </div>
             </motion.div>
          </div>
        )}
        {showLiquidationModal && selectedCommission && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }}
               onClick={() => !isSubmittingLiquidation && setShowLiquidationModal(false)}
               className="fixed inset-0 bg-black/60 backdrop-blur-sm"
             />
             <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 30 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 30 }}
               className="relative w-full max-w-xl bg-white rounded-[40px] overflow-hidden shadow-2xl z-10 p-10"
             >
                <div className="flex items-center justify-between mb-8">
                   <div>
                      <h3 className="text-2xl font-black tracking-tighter text-texto">Solicitar Liquidación</h3>
                      <p className="text-xs text-gris font-bold uppercase tracking-widest mt-1">Pedido {selectedCommission.orderNumber}</p>
                   </div>
                   <button 
                    disabled={isSubmittingLiquidation}
                    onClick={() => setShowLiquidationModal(false)} 
                    className="bg-gray-50 text-texto p-3 rounded-full hover:bg-gray-100 transition-all outline-none disabled:opacity-50"
                   >
                      <Plus size={20} className="rotate-45" />
                   </button>
                </div>

                <div className="bg-rojo/5 rounded-3xl p-6 border border-rojo/10 mb-8 flex items-center justify-between">
                   <div>
                      <div className="text-[10px] font-black uppercase text-rojo/60 mb-1">Monto de Comisión</div>
                      <div className="text-2xl font-black text-rojo">${selectedCommission.commissionAmount.toLocaleString('es-CO')}</div>
                   </div>
                   <div className="text-right">
                      <div className="text-[10px] font-black uppercase text-gris mb-1">Total Pedido</div>
                      <div className="text-sm font-bold text-texto text-gris-oscuro">${selectedCommission.orderTotal.toLocaleString('es-CO')}</div>
                   </div>
                </div>

                <form onSubmit={handleSettleSubmit} className="space-y-6">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gris px-1 flex items-center gap-2">
                        <FileText size={12} className="text-rojo" /> Adjuntar Cuenta de Cobro / Factura
                      </label>
                      <div className="relative group">
                         <input 
                           required
                           type="file" 
                           accept=".pdf,.jpg,.png"
                           className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                         />
                         <div className="border-2 border-dashed border-gray-200 rounded-3xl p-10 flex flex-col items-center justify-center text-center group-hover:border-rojo transition-all bg-gray-50/50">
                            <Plus size={32} className="text-gris group-hover:text-rojo transition-all mb-3" />
                            <p className="text-sm font-bold text-texto">Haz clic o arrastra el archivo aquí</p>
                            <p className="text-xs text-gris font-medium mt-1">Formato PDF, JPG o PNG (Max. 5MB)</p>
                         </div>
                      </div>
                   </div>

                   <p className="text-xs text-gris font-medium leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100 italic">
                      Al solicitar la liquidación, certificas que la información y el documento adjunto son verídicos. TBS revisará la documentación y procederá con el pago en un plazo de 3-5 días hábiles si todo es correcto.
                   </p>

                   <button 
                     type="submit" 
                     disabled={isSubmittingLiquidation}
                     className="w-full bg-texto text-white py-5 rounded-2xl font-black text-base shadow-xl hover:bg-rojo transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                   >
                      {isSubmittingLiquidation ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          PROCESANDO SOLICITUD...
                        </>
                      ) : (
                        <>
                          CONFIRMAR Y ENVIAR SOLICITUD
                        </>
                      )}
                   </button>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
      </PageContainer>
    </div>
  );
}

function TruckIllustration(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-5h-7v7" />
      <path d="M13 9h4" />
      <path d="M13 6h1" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </svg>
  );
}
