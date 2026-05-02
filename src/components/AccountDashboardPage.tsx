import React from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Package, 
  Wallet, 
  Truck, 
  MapPin, 
  ChevronRight, 
  LogOut, 
  ShieldCheck, 
  ArrowLeft,
  ShoppingCart,
  Zap,
  Headset,
  Star,
  Tag,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import { User as UserType } from '../types';

interface AccountDashboardPageProps {
  user: UserType;
  onGoBack: () => void;
  onGoCatalog: () => void;
  onGoPayments: () => void;
  onGoOrders: () => void;
  onGoReorder: () => void;
  onGoUrgentOrder: () => void;
  onLogout: () => void;
  onGoAdvisorChat: (topic?: any, context?: any) => void;
  onGoShoppingLists: () => void;
  onGoPromotions: () => void;
  onGoIntelligence: () => void;
  onGoB2BAccountAdmin?: () => void;
  onGoOrderApprovals: () => void;
  onGoFAQ: () => void;
}

export function AccountDashboardPage({ 
  user, 
  onGoBack, 
  onGoCatalog, 
  onGoPayments, 
  onGoOrders,
  onGoReorder,
  onGoUrgentOrder,
  onLogout,
  onGoAdvisorChat,
  onGoShoppingLists,
  onGoPromotions,
  onGoIntelligence,
  onGoB2BAccountAdmin,
  onGoOrderApprovals,
  onGoFAQ
}: AccountDashboardPageProps) {
  
  const canAdmin = user.accountRole === 'master' || 
                  user.permissions?.includes('gestionar_usuarios') || 
                  user.permissions?.includes('gestionar_sucursales') || 
                  user.permissions?.includes('configurar_aprobaciones');

  const canApprove = user.accountRole === 'master' || 
                    user.accountRole === 'aprobador' || 
                    user.accountRole === 'administrador' || 
                    user.permissions?.includes('aprobar_pedidos');

  const menuItems = [
    { 
      id: 'admin', 
      title: 'Administración de cuenta B2B', 
      desc: 'Gestiona usuarios, sucursales, permisos y reglas de aprobación de tu empresa.', 
      icon: ShieldCheck, 
      onClick: onGoB2BAccountAdmin,
      highlight: true,
      hidden: !canAdmin
    },
    { 
      id: 'approvals', 
      title: canApprove ? 'Aprobación de pedidos' : 'Mis pedidos en aprobación', 
      desc: canApprove 
        ? 'Revisa y aprueba pedidos creados por compradores de tu cuenta.' 
        : 'Consulta el estado de pedidos enviados a aprobación.', 
      icon: ShieldCheck, 
      onClick: onGoOrderApprovals,
      highlight: true
    },
    { 
      id: 'payments', 
      title: 'Cartera y pagos', 
      desc: 'Consulta facturas, cupo de crédito y realiza pagos.', 
      icon: Wallet, 
      onClick: onGoPayments,
      highlight: true
    },
    { 
      id: 'intelligence', 
      title: 'Inteligencia B2B', 
      desc: 'Consulta consumo, recompra sugerida y oportunidades para tu negocio.', 
      icon: BarChart3, 
      onClick: onGoIntelligence,
      highlight: true
    },
    { 
      id: 'orders', 
      title: 'Mis Pedidos / Seguimiento', 
      desc: 'Consulta el estado de tus pedidos y trazabilidad logística.', 
      icon: Package, 
      onClick: onGoOrders 
    },
    { 
      id: 'reorder', 
      title: 'Reordenar pedido', 
      desc: 'Repite tus pedidos frecuentes aprovechando tu historial.', 
      icon: ShoppingCart, 
      onClick: onGoReorder 
    },
    { 
      id: 'shoppingLists', 
      title: 'Listas de compra', 
      desc: 'Organiza productos frecuentes y agrega listas al carrito en segundos.', 
      icon: Star, 
      onClick: onGoShoppingLists,
      highlight: false
    },
    { 
      id: 'promotions', 
      title: 'Promociones B2B', 
      desc: 'Consulta descuentos, combos y condiciones comerciales para tu negocio.', 
      icon: Tag, 
      onClick: onGoPromotions,
      highlight: true
    },
    { 
      id: 'urgent', 
      title: 'Pedido urgente', 
      desc: 'Abastecimiento para operación inmediata y eventos.', 
      icon: Zap, 
      onClick: onGoUrgentOrder,
      highlight: true
    },
    { 
      id: 'advisor', 
      title: 'Mi Asesor / Soporte', 
      desc: 'Chatea con tu asesor asignado para dudas o requerimientos.', 
      icon: Headset, 
      onClick: () => onGoAdvisorChat()
    },
    { 
      id: 'faq', 
      title: 'Centro de Ayuda / FAQ', 
      desc: 'Preguntas frecuentes sobre precios, pedidos, entregas y cuenta.', 
      icon: Headset, 
      onClick: onGoFAQ,
      highlight: true
    },
    { 
      id: 'addresses', 
      title: 'Direcciones', 
      desc: 'Gestiona tus puntos de entrega registrados.', 
      icon: MapPin, 
      onClick: () => {} 
    },
    { 
      id: 'profile', 
      title: 'Mi Perfil', 
      desc: 'Información del negocio y datos de contacto.', 
      icon: User, 
      onClick: () => {} 
    },
    { 
      id: 'security', 
      title: 'Seguridad', 
      desc: 'Cambiar contraseña y gestión de acceso.', 
      icon: ShieldCheck, 
      onClick: () => {} 
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Header Contextual */}
      <div className="bg-white border-b border-borde">
        <div className="max-w-[1280px] mx-auto px-6 py-4 flex items-center justify-between">
          <button 
            onClick={onGoBack}
            className="flex items-center gap-2 text-gris hover:text-texto font-black text-sm uppercase tracking-wider transition-colors cursor-pointer"
          >
           <ArrowLeft size={18} /> Volver
          </button>
          <div className="flex items-center gap-3">
            <span className="text-[12px] font-black text-rojo uppercase tracking-widest bg-rojo/5 px-3 py-1 rounded-full">Dashboard B2B</span>
          </div>
        </div>
      </div>

      <main className="max-w-[1280px] mx-auto px-6 mt-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar - Profile Card */}
          <aside className="lg:w-[320px] shrink-0">
            <div className="bg-white rounded-3xl border border-borde p-8 tbs-shadow text-center">
              <div className="w-24 h-24 bg-rojo-suave border-4 border-white rounded-full flex items-center justify-center text-rojo mx-auto mb-6 shadow-xl shadow-rojo/5">
                <User size={48} strokeWidth={2.5} />
              </div>
              <h1 className="text-2xl font-black text-texto tracking-tight mb-1">{user.name}</h1>
              <p className="text-rojo font-black text-xs uppercase tracking-widest mb-4">{user.businessName}</p>
              
              <div className="flex flex-col gap-2 mt-6">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-[11px] font-black text-gris uppercase tracking-tight">Ciudad</span>
                  <span className="text-sm font-black text-texto">{user.city}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-[11px] font-black text-gris uppercase tracking-tight">Tipo de negocio</span>
                  <span className="text-sm font-black text-texto">{user.customerType}</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 italic text-[11px] text-gris font-medium">
                Cliente TBS desde 2024
              </div>
            </div>

            <button 
              onClick={onLogout}
              className="w-full mt-6 flex items-center justify-center gap-3 p-5 bg-white border border-rojo/20 text-rojo rounded-2xl font-black hover:bg-rojo hover:text-white transition-all tbs-shadow-sm cursor-pointer"
            >
              <LogOut size={20} /> Cerrar sesión segura
            </button>
          </aside>

          {/* Main Grid */}
          <div className="flex-1">
            <div className="mb-8">
              <h2 className="text-3xl font-black tracking-tighter text-texto">Mi Cuenta</h2>
              <p className="text-gris font-medium mt-1">Gestiona tu operación B2B, revisa tu cartera y solicita soporte.</p>
            </div>

            {/* Quick Stats Banner */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-rojo to-rojo-oscuro rounded-3xl p-8 text-white tbs-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Wallet size={20} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest opacity-80">Cupo de crédito disponible</span>
                  </div>
                  <div className="text-4xl font-black tracking-tighter mb-2">
                    $ {user.availableCredit?.toLocaleString('es-CO')}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold opacity-90">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /> 
                    Operando con normalidad
                  </div>
                  <button 
                    onClick={onGoPayments}
                    className="mt-6 px-6 py-3 bg-white text-rojo rounded-xl font-black text-sm hover:scale-105 transition-transform cursor-pointer"
                  >
                    Ver detalles de cartera
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-borde p-8 tbs-shadow flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-6 text-gris">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Package size={20} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest">Último pedido</span>
                  </div>
                  <div className="text-2xl font-black tracking-tight text-texto mb-1">
                    TBS-2024-8542
                  </div>
                  <p className="text-sm font-medium text-gris">Entregado el 15 Abr, 2024</p>
                </div>
                <button 
                  onClick={onGoReorder}
                  className="mt-6 px-6 py-3 border border-rojo text-rojo rounded-xl font-black text-sm hover:bg-rojo-suave transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingCart size={18} /> Reordenar ahora
                </button>
              </div>
            </div>

            {/* Recommendations Section */}
            <div className="mt-12 mb-8 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-texto">Recomendaciones para hoy</h3>
                <p className="text-sm font-medium text-gris">Basado en tu comportamiento de compra y tendencias de mercado.</p>
              </div>
              <button 
                onClick={onGoIntelligence}
                className="text-xs font-black text-rojo uppercase tracking-widest hover:underline flex items-center gap-1 cursor-pointer"
              >
                Ver inteligencia completa <ChevronRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
              {[
                { title: 'Recompra sugerida', desc: 'Sugerimos reponer Whisky antes del 13 de Mayo.', icon: TrendingUp },
                { title: 'Promoción activa', desc: 'Combo coctelería con 7% de ahorro este mes.', icon: Tag },
                { title: 'Alerta cartera', desc: 'Paga tus facturas para mantener tu cupo.', icon: ShieldCheck }
              ].map((rec, i) => (
                <div key={i} className="p-5 bg-white border border-borde rounded-2xl shadow-sm flex flex-col">
                  <div className="p-2 bg-rojo-suave text-rojo rounded-lg w-fit mb-4">
                    <rec.icon size={20} />
                  </div>
                  <h4 className="text-sm font-black text-texto">{rec.title}</h4>
                  <p className="text-[12px] font-medium text-gris mt-1 leading-tight flex-1">{rec.desc}</p>
                  <button 
                    onClick={onGoIntelligence}
                    className="mt-4 text-[10px] font-black text-rojo uppercase tracking-widest hover:underline text-left cursor-pointer"
                  >
                    Ver detalle
                  </button>
                </div>
              ))}
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {menuItems.filter(item => !item.hidden).map((item) => (
                <button
                  key={item.id}
                  onClick={item.onClick}
                  className={`flex items-start gap-4 p-6 bg-white border border-borde rounded-2xl hover:border-rojo/50 transition-all text-left group cursor-pointer ${item.highlight ? 'ring-2 ring-rojo/10 border-rojo/30' : ''}`}
                >
                  <div className={`p-4 rounded-xl flex-shrink-0 transition-colors ${item.highlight ? 'bg-rojo text-white' : 'bg-gray-50 text-gris group-hover:bg-rojo-suave group-hover:text-rojo'}`}>
                    <item.icon size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-base font-black text-texto tracking-tight group-hover:text-rojo transition-colors">{item.title}</strong>
                      <ChevronRight size={18} className="text-gris group-hover:text-rojo group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-[13px] font-medium text-gris mt-1 leading-tight">{item.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
