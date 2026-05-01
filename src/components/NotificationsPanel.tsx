import React from 'react';
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
  Info
} from 'lucide-react';
import { TBSNotification, NotificationType } from '../types';

interface NotificationsPanelProps {
  notifications: TBSNotification[];
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteNotification: (id: string) => void;
  onGoToNotification: (notification: TBSNotification) => void;
  onGoNotificationsPage: () => void;
}

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'pedido': return <Package size={18} />;
    case 'cartera': return <CreditCard size={18} />;
    case 'pago': return <CheckCircle size={18} />;
    case 'chat': return <MessageSquare size={18} />;
    case 'pedido_urgente': return <Zap size={18} />;
    case 'producto': return <ShoppingBag size={18} />;
    case 'comercial': return <Info size={18} />;
    default: return <Bell size={18} />;
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

export function NotificationsPanel({ 
  notifications, 
  onClose, 
  onMarkAsRead, 
  onMarkAllAsRead, 
  onDeleteNotification, 
  onGoToNotification,
  onGoNotificationsPage
}: NotificationsPanelProps) {
  const unreadCount = notifications.filter(n => !n.read).length;
  const recentNotifications = notifications.slice(0, 5);

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop for all devices to allow closing on outside click */}
      <div 
        className="fixed inset-0 bg-black/20 md:bg-transparent" 
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        className="absolute top-20 right-4 left-4 md:left-auto md:right-32 w-auto md:w-[420px] bg-white rounded-2xl md:rounded-[24px] shadow-2xl border border-[#EEF0F3] overflow-hidden flex flex-col max-h-[85vh] md:max-h-[600px] z-50"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#EEF0F3] flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-texto">Notificaciones</h3>
              {unreadCount > 0 && (
                <span className="bg-rojo text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button 
                onClick={onMarkAllAsRead}
                className="text-[11px] font-black text-rojo hover:underline cursor-pointer flex items-center gap-1"
                title="Marcar todas como leídas"
              >
                <CheckCheck size={14} /> Marcar todas
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full text-gris transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto scrollbar-hide py-2">
          {notifications.length > 0 ? (
            <div className="divide-y divide-[#F8F9FA]">
              {recentNotifications.map((notif) => (
                <div 
                  key={notif.id}
                  onClick={() => onMarkAsRead(notif.id)}
                  className={`relative p-4 flex gap-4 transition-colors cursor-pointer group ${notif.read ? 'opacity-70 hover:bg-gray-50' : 'bg-white hover:bg-gray-50'}`}
                >
                  {/* Icon */}
                  <div className={`mt-1 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${getNotificationColor(notif.type)}`}>
                    {getNotificationIcon(notif.type)}
                  </div>

                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className={`text-sm font-black transition-colors ${notif.read ? 'text-texto/60' : 'text-texto'}`}>
                        {notif.title}
                      </h4>
                      {!notif.read && (
                        <div className="w-2 h-2 rounded-full bg-rojo mt-1.5 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-gris font-medium line-clamp-2 mb-2 leading-relaxed">
                      {notif.message}
                    </p>
                    
                    {/* Context & Metadata */}
                    <div className="flex items-center flex-wrap gap-2 text-[10px] font-bold">
                      <span className="text-gris/60">{notif.createdAt}</span>
                      {notif.priority === 'alta' && (
                        <span className="flex items-center gap-0.5 text-rojo bg-rojo/5 px-1.5 py-0.5 rounded">
                          <AlertTriangle size={10} /> Urgente
                        </span>
                      )}
                      {notif.context && (
                        <span className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                          {notif.context.label}: {notif.context.value}
                        </span>
                      )}
                    </div>

                    {/* Action Button */}
                    {notif.actionLabel && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onGoToNotification(notif);
                        }}
                        className="mt-3 px-4 py-2 bg-rojo text-white text-[10px] font-black rounded-lg hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-sm shadow-rojo/10"
                      >
                        {notif.actionLabel}
                      </button>
                    )}
                  </div>

                  {/* Delete Button */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteNotification(notif.id);
                    }}
                    className="absolute top-4 right-4 p-1 rounded-md text-gris/0 group-hover:text-gris/40 hover:text-rojo transition-all cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gris/20">
                <Bell size={32} />
              </div>
              <h4 className="text-sm font-black text-texto mb-1">Sin notificaciones</h4>
              <p className="text-xs text-gris font-medium">Te avisaremos cuando haya novedades en tu cuenta.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#EEF0F3] bg-[#F8F9FA]">
          <button 
            onClick={onGoNotificationsPage}
            className="w-full h-12 bg-white border border-[#EEF0F3] rounded-xl text-[13px] font-black text-texto hover:bg-gray-50 transition-all cursor-pointer flex items-center justify-center gap-2 tbs-shadow"
          >
            Ver todas las notificaciones
          </button>
        </div>
      </motion.div>
    </div>
  );
}
