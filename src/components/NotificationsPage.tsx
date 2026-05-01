import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  Package, 
  Truck, 
  CreditCard, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle, 
  X, 
  Trash2, 
  CheckCheck, 
  Zap,
  ShoppingBag,
  Info,
  Search,
  ChevronRight,
  ArrowLeft,
  Filter,
  Eye,
  EyeOff
} from 'lucide-react';
import { TBSNotification, NotificationType, User } from '../types';

interface NotificationsPageProps {
  currentUser: User | null;
  notifications: TBSNotification[];
  onBackToAccount: () => void;
  onGoHome: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteNotification: (id: string) => void;
  onDeleteReadNotifications: () => void;
  onGoToNotification: (notification: TBSNotification) => void;
}

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'pedido': return <Package size={24} />;
    case 'cartera': return <CreditCard size={24} />;
    case 'pago': return <CheckCircle size={24} />;
    case 'chat': return <MessageSquare size={24} />;
    case 'pedido_urgente': return <Zap size={24} />;
    case 'producto': return <ShoppingBag size={24} />;
    case 'comercial': return <Info size={24} />;
    default: return <Bell size={24} />;
  }
};

const getNotificationColor = (type: NotificationType) => {
  switch (type) {
    case 'pedido': return 'text-blue-500 bg-blue-50';
    case 'cartera': return 'text-orange-500 bg-orange-50';
    case 'pago': return 'text-green-500 bg-green-50';
    case 'chat': return 'text-rojo bg-rojo/5';
    case 'pedido_urgente': return 'text-yellow-500 bg-yellow-50';
    case 'producto': return 'text-purple-500 bg-purple-50';
    case 'comercial': return 'text-rojo bg-rojo/5';
    default: return 'text-gris bg-gray-50';
  }
};

export function NotificationsPage({ 
  currentUser,
  notifications, 
  onBackToAccount,
  onGoHome,
  onMarkAsRead, 
  onMarkAllAsRead, 
  onDeleteNotification, 
  onDeleteReadNotifications,
  onGoToNotification 
}: NotificationsPageProps) {
  const [filter, setFilter] = useState<NotificationType | 'todos' | 'unread'>('todos');
  const [search, setSearch] = useState('');

  const stats = {
    total: notifications.length,
    unread: notifications.filter(n => !n.read).length,
    high: notifications.filter(n => n.priority === 'alta').length,
    chat: notifications.filter(n => n.type === 'chat').length
  };

  const filteredNotifications = notifications.filter(n => {
    const matchesFilter = 
      filter === 'todos' ? true : 
      filter === 'unread' ? !n.read : 
      n.type === filter;
    
    const searchText = search.toLowerCase();
    const matchesSearch = 
      n.title.toLowerCase().includes(searchText) || 
      n.message.toLowerCase().includes(searchText) || 
      n.context?.value?.toLowerCase().includes(searchText) || 
      n.context?.label?.toLowerCase().includes(searchText);

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
      {/* Header Section */}
      <div className="bg-white border-b border-[#EEF0F3]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <button 
            onClick={onBackToAccount}
            className="flex items-center gap-2 text-gris hover:text-rojo font-black text-xs uppercase tracking-widest transition-colors mb-6 cursor-pointer"
          >
            <ArrowLeft size={16} /> Volver a mi cuenta
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-[42px] font-black text-texto mb-2 leading-tight">
                Notificaciones
              </h1>
              <p className="text-gris font-medium max-w-2xl">
                Consulta alertas de pedidos, cartera, pagos, mensajes y novedades de tu operación.
              </p>
            </div>
            {currentUser && (
              <div className="flex items-center gap-4 bg-gray-50 px-5 py-3 rounded-2xl border border-gray-100">
                <div className="w-10 h-10 rounded-full bg-rojo/10 flex items-center justify-center text-rojo font-black text-lg">
                  {currentUser.businessName.charAt(0)}
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase text-gris tracking-widest leading-none mb-1">Tu Negocio</div>
                  <div className="text-sm font-black text-texto leading-none">{currentUser.businessName}</div>
                  <div className="text-[11px] font-medium text-gris">{currentUser.city}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total" value={stats.total} icon={Bell} color="blue" />
          <StatCard title="No leídas" value={stats.unread} icon={EyeOff} color="rojo" />
          <StatCard title="Prioridad Alta" value={stats.high} icon={AlertTriangle} color="orange" />
          <StatCard title="Mensajes Chat" value={stats.chat} icon={MessageSquare} color="purple" />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-64 shrink-0 space-y-6">
            <div className="bg-white p-6 rounded-3xl tbs-shadow border border-[#EEF0F3]">
              <div className="flex items-center gap-2 mb-4">
                <Filter size={16} className="text-rojo" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-gris">Filtrar por</h3>
              </div>
              <div className="flex flex-wrap lg:flex-col gap-2">
                <FilterButton label="Todas" active={filter === 'todos'} onClick={() => setFilter('todos')} count={stats.total} />
                <FilterButton label="No leídas" active={filter === 'unread'} onClick={() => setFilter('unread')} count={stats.unread} />
                <div className="h-px bg-gray-100 my-2 hidden lg:block" />
                <FilterButton label="Pedidos" active={filter === 'pedido'} onClick={() => setFilter('pedido')} type="pedido" />
                <FilterButton label="Cartera / Pagos" active={filter === 'cartera'} onClick={() => setFilter('cartera')} type="cartera" />
                <FilterButton label="Chat Asesor" active={filter === 'chat'} onClick={() => setFilter('chat')} type="chat" />
                <FilterButton label="Pedidos Urgentes" active={filter === 'pedido_urgente'} onClick={() => setFilter('pedido_urgente')} type="pedido_urgente" />
                <FilterButton label="Novedades Productos" active={filter === 'producto'} onClick={() => setFilter('producto')} type="producto" />
                <FilterButton label="Alertas Comerciales" active={filter === 'comercial'} onClick={() => setFilter('comercial')} type="comercial" />
              </div>
            </div>

            <div className="bg-rojo/5 p-6 rounded-3xl border border-rojo/10">
              <h4 className="text-sm font-black text-rojo mb-2 flex items-center gap-2">
                <Info size={16} /> ¿Necesitas ayuda?
              </h4>
              <p className="text-[11px] font-medium text-rojo/70 leading-relaxed">
                Si alguna notificación requiere soporte inmediato, recuerda que puedes chatear directamente con tu asesor asignado.
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* Search & Actions Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-[24px] border border-[#EEF0F3] tbs-shadow">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gris" size={18} />
                <input 
                  type="text" 
                  placeholder="Buscar notificación, pedido, factura o producto..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 bg-gray-50 rounded-xl text-sm font-bold text-texto border-transparent focus:border-rojo/20 focus:bg-white transition-all outline-none"
                />
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <button 
                  onClick={onMarkAllAsRead}
                  className="flex-1 md:flex-none h-12 px-6 bg-white border border-gray-200 rounded-xl text-xs font-black text-texto hover:bg-gray-50 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <CheckCheck size={16} /> Marcar todas
                </button>
                <button 
                  onClick={onDeleteReadNotifications}
                  className="flex-1 md:flex-none h-12 px-6 bg-white border border-gray-200 rounded-xl text-xs font-black text-rojo hover:bg-rojo/5 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Trash2 size={16} /> Eliminar leídas
                </button>
              </div>
            </div>

            {/* List */}
            <div className="space-y-3">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notif) => (
                  <motion.div 
                    layout
                    key={notif.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-white rounded-[24px] overflow-hidden tbs-shadow border border-[#EEF0F3] group transition-all ${!notif.read ? 'ring-1 ring-rojo/20' : ''}`}
                  >
                    <div className="md:flex items-stretch min-h-[120px]">
                      {/* Left Strip & Icon */}
                      <div className={`w-2 md:w-16 flex items-center justify-center ${getNotificationColor(notif.type)} h-16 md:h-auto`}>
                        <div className="hidden md:block">
                          {getNotificationIcon(notif.type)}
                        </div>
                        <div className="md:hidden font-black text-[10px] uppercase rotate-90 whitespace-nowrap">
                          {notif.type}
                        </div>
                      </div>

                      <div className="flex-1 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h3 className={`text-lg font-black leading-tight ${!notif.read ? 'text-texto' : 'text-texto/60'}`}>
                              {notif.title}
                            </h3>
                            {notif.priority === 'alta' && (
                              <span className="px-2 py-0.5 bg-rojo text-white text-[10px] font-black rounded-lg uppercase tracking-wider">
                                Urgente
                              </span>
                            )}
                            <span className="text-[11px] font-black text-gris/40 uppercase tracking-widest">{notif.createdAt}</span>
                          </div>
                          
                          <p className="text-sm font-medium text-gris leading-relaxed mb-4 md:mb-0 max-w-2xl">
                            {notif.message}
                          </p>

                          {notif.context && (
                            <div className="mt-4 flex items-center gap-2">
                              <div className="text-[10px] font-black uppercase text-gris/40 tracking-widest">Contexto:</div>
                              <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[11px] font-black">
                                {notif.context.label} {notif.context.value}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          {notif.actionLabel && (
                            <button 
                              onClick={() => onGoToNotification(notif)}
                              className="h-12 px-6 bg-rojo text-white rounded-xl text-xs font-black hover:scale-[1.03] active:scale-[0.98] transition-all tbs-shadow shadow-rojo/20 cursor-pointer flex items-center gap-2"
                            >
                              {notif.actionLabel} <ChevronRight size={14} />
                            </button>
                          )}
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => onMarkAsRead(notif.id)}
                              className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                                notif.read 
                                  ? 'border-gray-200 text-gris hover:bg-gray-50' 
                                  : 'border-rojo text-rojo bg-rojo/5 hover:bg-rojo/10'
                              }`}
                              title={notif.read ? "Marcar como no leída" : "Marcar como leída"}
                            >
                              {notif.read ? <Eye size={18} /> : <EyeOff size={18} />}
                            </button>
                            <button 
                              onClick={() => onDeleteNotification(notif.id)}
                              className="w-10 h-10 rounded-xl border border-gray-200 text-gris hover:text-rojo hover:bg-rojo/5 transition-all cursor-pointer"
                              title="Eliminar notificación"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              )) : (
                <div className="bg-white rounded-[32px] p-20 flex flex-col items-center justify-center text-center tbs-shadow border border-[#EEF0F3]">
                  <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gris/20">
                    <Bell size={48} />
                  </div>
                  <h3 className="text-xl font-black text-texto mb-2">No hay notificaciones</h3>
                  <p className="text-gris font-medium max-w-sm">
                    {search ? `No encontramos resultados para "${search}" con los filtros aplicados.` : "Cuando tengas novedades de pedidos, cartera, chat o productos, aparecerán aquí."}
                  </p>
                  {filter !== 'todos' || search ? (
                    <button 
                      onClick={() => { setFilter('todos'); setSearch(''); }}
                      className="mt-6 text-rojo font-black text-sm uppercase tracking-widest hover:underline cursor-pointer"
                    >
                      Limpiar filtros y búsqueda
                    </button>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: { title: string; value: number; icon: any; color: string }) {
  const colors: Record<string, string> = {
    blue: 'text-blue-500 bg-blue-50',
    rojo: 'text-rojo bg-rojo/5 border-rojo/10',
    orange: 'text-orange-500 bg-orange-50',
    purple: 'text-purple-500 bg-purple-50'
  };

  return (
    <div className={`p-4 md:p-6 bg-white rounded-3xl tbs-shadow border border-[#EEF0F3] flex items-center justify-between`}>
      <div>
        <div className="text-[10px] font-black uppercase text-gris tracking-widest leading-none mb-2">{title}</div>
        <div className="text-2xl md:text-3xl font-black text-texto leading-none">{value}</div>
      </div>
      <div className={`w-10 h-10 md:w-14 md:h-14 rounded-2xl flex items-center justify-center ${colors[color] || 'text-gris bg-gray-50'}`}>
        <Icon className="w-5 h-5 md:w-7 md:h-7" />
      </div>
    </div>
  );
}

function FilterButton({ label, active, onClick, count, type }: { label: string; active: boolean; onClick: () => void; count?: number; type?: NotificationType }) {
  return (
    <button 
      onClick={onClick}
      className={`px-4 py-2.5 rounded-xl text-left text-xs font-black transition-all cursor-pointer flex items-center justify-between gap-3 ${
        active 
          ? 'bg-rojo text-white tbs-shadow shadow-rojo/30' 
          : 'bg-white text-gris hover:bg-gray-50 hover:text-texto'
      }`}
    >
      <div className="flex items-center gap-2">
        {type && <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-white' : 'bg-rojo'}`} />}
        {label}
      </div>
      {count !== undefined && (
        <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${active ? 'bg-white/20' : 'bg-gray-100'}`}>
          {count}
        </span>
      )}
    </button>
  );
}
