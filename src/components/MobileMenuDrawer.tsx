import React from 'react';
import { 
  X, 
  Home, 
  Grid, 
  RefreshCcw, 
  CreditCard, 
  Truck, 
  Zap, 
  Tag, 
  MessageSquare, 
  User as UserIcon, 
  LogOut,
  ChevronRight,
  Info,
  Users,
  Briefcase,
  HelpCircle,
  Phone,
  BarChart3,
  Package,
  ShieldCheck,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, ActivePage, PermissionKey } from '../types';

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  onLogout: () => void;
  onLogin: () => void;
  onRequestAccess: () => void;
  hasPermission: (key: PermissionKey) => boolean;
}

export const MobileMenuDrawer: React.FC<MobileMenuDrawerProps> = ({
  isOpen,
  onClose,
  currentUser,
  activePage,
  onNavigate,
  onLogout,
  onLogin,
  onRequestAccess,
  hasPermission
}) => {
  const isCliente = !!currentUser;

  const menuItems = isCliente ? [
    { id: 'home', label: 'Inicio', icon: Home, show: currentUser.role === 'cliente_b2b' },
    { id: 'providerDashboard', label: 'Dashboard', icon: BarChart3, show: currentUser.role === 'marca' || currentUser.role === 'proveedor' },
    { id: 'hospitalityPartnerDashboard', label: 'Panel Gestión', icon: BarChart3, show: currentUser.role === 'hospitality_partner' },
    { id: 'catalog', label: 'Catálogo', icon: Grid, show: true },
    { id: 'reorder', label: 'Reordenar', icon: RefreshCcw, show: currentUser.role === 'cliente_b2b' },
    { id: 'payments', label: 'Cartera y Pagos', icon: CreditCard, show: currentUser.role === 'cliente_b2b' && currentUser.commercialCondition !== 'contado' },
    { id: 'ordersTracking', label: 'Seguimiento', icon: Truck, show: true },
    { id: 'urgentOrder', label: 'Pedido Urgente', icon: Zap, show: currentUser.role === 'cliente_b2b' },
    { id: 'promotions', label: 'Promociones', icon: Tag, show: currentUser.role === 'cliente_b2b' },
    { id: 'intelligence', label: 'Inteligencia', icon: Star, show: currentUser.role === 'cliente_b2b' },
    { id: 'advisorChat', label: 'Mi Asesor', icon: MessageSquare, show: true },
    { id: 'account', label: 'Mi Cuenta', icon: UserIcon, show: true },
  ].filter(item => item.show) : [
    { id: 'home', label: 'Inicio', icon: Home },
    { id: 'about', label: 'Qué es TBS', icon: Info },
    { id: 'clients', label: 'Clientes B2B', icon: Users },
    { id: 'providers', label: 'Proveedores y Marcas', icon: Briefcase },
    { id: 'services', label: 'Servicios TBS', icon: Grid },
    { id: 'hospitalityPartners', label: 'Hospitality', icon: Users },
    { id: 'faq', label: 'Ayuda / FAQ', icon: HelpCircle },
    { id: 'contact', label: 'Contacto', icon: Phone },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white z-[101] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-rojo rounded-xl flex items-center justify-center text-white font-black text-xl">T</div>
                <div>
                  <h3 className="font-black text-texto leading-none">TBS Destilados</h3>
                  <p className="text-[10px] font-bold text-gris uppercase tracking-widest mt-1">Plataforma B2B</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                id="close-mobile-menu"
              >
                <X size={20} className="text-gris" />
              </button>
            </div>

            {/* Profile Section (Logged In) */}
            {isCliente && (
              <div className="p-6 bg-gray-50/50 border-b border-gray-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white border border-rojo/20 rounded-2xl flex items-center justify-center text-rojo font-black text-xl shadow-sm">
                    {currentUser.businessName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-black text-rojo uppercase tracking-widest leading-none mb-1">
                      {currentUser.role === 'cliente_b2b' ? 'Negocio Registrado' : 'Aliado TBS'}
                    </div>
                    <div className="text-base font-black text-texto truncate">{currentUser.businessName}</div>
                    <div className="text-[11px] font-bold text-gris uppercase tracking-tight truncate">
                      {currentUser.city} · {currentUser.customerType || currentUser.providerType}
                    </div>
                  </div>
                </div>
                
                {currentUser.role === 'cliente_b2b' && hasPermission('gestionar_usuarios') && (
                  <button
                    onClick={() => { onNavigate('b2bAccountAdmin'); onClose(); }}
                    className="w-full py-2.5 px-4 bg-white border border-borde rounded-xl text-xs font-black text-texto flex items-center justify-center gap-2 hover:bg-rojo/5 hover:text-rojo hover:border-rojo/20 transition-all"
                  >
                    <ShieldCheck size={14} />
                    Administrar Cuenta B2B
                  </button>
                )}
              </div>
            )}

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto py-4 px-3">
              <div className="space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { onNavigate(item.id as ActivePage); onClose(); }}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all group ${
                      activePage === item.id 
                        ? 'bg-rojo/5 text-rojo' 
                        : 'text-texto hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg transition-colors ${
                        activePage === item.id ? 'bg-rojo/10' : 'bg-gray-100 group-hover:bg-white'
                      }`}>
                        <item.icon size={20} />
                      </div>
                      <span className="font-bold text-[15px]">{item.label}</span>
                    </div>
                    <ChevronRight size={16} className={`opacity-30 ${activePage === item.id ? 'opacity-100 translate-x-1' : ''}`} />
                  </button>
                ))}
              </div>

              {!isCliente && (
                <div className="mt-8 px-3">
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-rojo to-rojo-oscuro text-white shadow-xl shadow-rojo/20">
                    <h4 className="font-black text-lg leading-tight mb-2">¿Tu negocio aún no tiene acceso?</h4>
                    <p className="text-xs font-medium text-white/80 mb-5 leading-relaxed">
                      Únete a la red de abastecimiento B2B más eficiente de la región.
                    </p>
                    <button
                      onClick={() => { onRequestAccess(); onClose(); }}
                      className="w-full py-3 bg-white text-rojo rounded-xl font-black text-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                    >
                      <Zap size={16} fill="currentColor" />
                      Solicitar acceso B2B
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 space-y-3">
              {isCliente ? (
                <button
                  onClick={onLogout}
                  className="w-full py-4 px-4 bg-rojo-suave/30 text-rojo rounded-xl font-black text-sm flex items-center justify-center gap-3 transition-colors active:bg-rojo-suave"
                >
                  <LogOut size={18} />
                  Cerrar sesión
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => { onLogin(); onClose(); }}
                    className="py-4 bg-white border border-borde text-texto rounded-xl font-black text-sm hover:bg-gray-50 transition-all"
                  >
                    Ingresar
                  </button>
                  <button
                    onClick={() => { onRequestAccess(); onClose(); }}
                    className="py-4 bg-rojo text-white rounded-xl font-black text-sm hover:bg-rojo-oscuro transition-all"
                  >
                    Registrarme
                  </button>
                </div>
              )}
              <div className="text-center pt-2">
                <p className="text-[10px] text-gris font-bold uppercase tracking-widest">TBS Destilados © 2024</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
