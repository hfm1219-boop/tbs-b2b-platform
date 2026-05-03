import React, { useEffect } from 'react';
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
  TrendingUp,
  CreditCard
} from 'lucide-react';
import { User as UserType, BrandAdCampaign } from '../types';
import { useAnalytics } from '../hooks/useAnalytics';
import { AdSlot } from './advertising/AdSlot';
import { BRAND_AD_CAMPAIGNS } from '../data';

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
  onGoCreditRequest: () => void;
  onGoProviderProducts?: () => void;
  onGoProviderCampaigns?: () => void;
  onGoProviderSettlements?: () => void;
  onGoProviderReports?: () => void;
  onAdClick?: (campaign: BrandAdCampaign) => void;
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
  onGoFAQ,
  onGoCreditRequest,
  onGoProviderProducts,
  onGoProviderCampaigns,
  onGoProviderSettlements,
  onGoProviderReports,
  onAdClick
}: AccountDashboardPageProps) {
  const analytics = useAnalytics(user);
  
  useEffect(() => {
    analytics.trackPageView('/account', 'Mi Cuenta B2B');
  }, []);

  const canAdmin = user.accountRole === 'master' || 
                  user.permissions?.includes('gestionar_usuarios') || 
                  user.permissions?.includes('gestionar_sucursales') || 
                  user.permissions?.includes('configurar_aprobaciones');

  const canApprove = user.accountRole === 'master' || 
                    user.accountRole === 'aprobador' || 
                    user.accountRole === 'administrador' || 
                    user.permissions?.includes('aprobar_pedidos');

  const isClient = user.role === 'cliente_b2b';
  const isProvider = user.role === 'marca' || user.role === 'proveedor';
  const isCash = user.commercialCondition === 'contado';

  const menuItems = [
    { 
      id: 'admin', 
      title: 'Administración de cuenta B2B', 
      desc: 'Gestiona usuarios, sucursales, permisos y reglas de aprobación de tu empresa.', 
      icon: ShieldCheck, 
      onClick: onGoB2BAccountAdmin,
      highlight: true,
      hidden: !canAdmin || !isClient
    },
    { 
      id: 'approvals', 
      title: canApprove ? 'Aprobación de pedidos' : 'Mis pedidos en aprobación', 
      desc: canApprove 
        ? 'Revisa y aprueba pedidos creados por compradores de tu cuenta.' 
        : 'Consulta el estado de pedidos enviados a aprobación.', 
      icon: ShieldCheck, 
      onClick: onGoOrderApprovals,
      highlight: true,
      hidden: !isClient
    },
    { 
      id: 'payments', 
      title: isCash ? 'Pagos y comprobantes' : 'Cartera y pagos', 
      desc: isCash 
        ? 'Consulta pagos pendientes, comprobantes y estado de confirmación.'
        : 'Consulta facturas, cupo de crédito y realiza pagos.', 
      icon: Wallet, 
      onClick: onGoPayments,
      highlight: true,
      hidden: !isClient
    },
    { 
      id: 'creditRequest', 
      title: 'Solicitud de crédito B2B', 
      desc: 'Solicita nuevo crédito, aumento de cupo o actualiza tus datos financieros.', 
      icon: CreditCard, 
      onClick: onGoCreditRequest,
      highlight: true,
      hidden: !isClient
    },
    { 
      id: 'providerProducts', 
      title: 'Mi Portafolio / Productos', 
      desc: 'Gestiona tus productos, precios, stock y fichas técnicas.', 
      icon: Package, 
      onClick: onGoProviderProducts,
      highlight: true,
      hidden: !isProvider
    },
    { 
      id: 'providerCampaigns', 
      title: 'Mis Campañas / Pauta', 
      desc: 'Crea y gestiona campañas de visibilidad y promociones para tus marcas.', 
      icon: Tag, 
      onClick: onGoProviderCampaigns,
      highlight: true,
      hidden: !isProvider
    },
    { 
      id: 'providerSettlements', 
      title: 'Liquidaciones de Pago', 
      desc: 'Consulta tus estados de cuenta, facturación y pagos pendientes de TBS.', 
      icon: Wallet, 
      onClick: onGoProviderSettlements,
      highlight: true,
      hidden: !isProvider
    },
    { 
      id: 'providerReports', 
      title: 'Reportes de Marca', 
      desc: 'Análisis de ventas, participación de mercado y sell-out de tus categorías.', 
      icon: BarChart3, 
      onClick: onGoProviderReports,
      highlight: true,
      hidden: !isProvider
    },
    { 
      id: 'intelligence', 
      title: 'Inteligencia B2B', 
      desc: 'Consulta consumo, recompra sugerida y oportunidades para tu negocio.', 
      icon: BarChart3, 
      onClick: onGoIntelligence,
      highlight: true,
      hidden: !isClient
    },
    { 
      id: 'orders', 
      title: isProvider ? 'Pedidos de Marca' : 'Mis Pedidos / Seguimiento', 
      desc: isProvider 
        ? 'Consulta los pedidos recibidos de tus productos en el portal.'
        : 'Consulta el estado de tus pedidos y trazabilidad logística.', 
      icon: Package, 
      onClick: onGoOrders,
      hidden: false // Visible for both (different context)
    },
    { 
      id: 'reorder', 
      title: 'Reordenar pedido', 
      desc: 'Repite tus pedidos frecuentes aprovechando tu historial.', 
      icon: ShoppingCart, 
      onClick: onGoReorder,
      hidden: !isClient
    },
    { 
      id: 'shoppingLists', 
      title: 'Listas de compra', 
      desc: 'Organiza productos frecuentes y agrega listas al carrito en segundos.', 
      icon: Star, 
      onClick: onGoShoppingLists,
      highlight: false,
      hidden: !isClient
    },
    { 
      id: 'promotions', 
      title: 'Promociones B2B', 
      desc: 'Consulta descuentos, combos y condiciones comerciales para tu negocio.', 
      icon: Tag, 
      onClick: onGoPromotions,
      highlight: true,
      hidden: !isClient
    },
    { 
      id: 'urgent', 
      title: 'Pedido urgente', 
      desc: 'Abastecimiento para operación inmediata y eventos.', 
      icon: Zap, 
      onClick: onGoUrgentOrder,
      highlight: true,
      hidden: !isClient
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
            <span className="text-[12px] font-black text-rojo uppercase tracking-widest bg-rojo/5 px-3 py-1 rounded-full">
              {isProvider ? 'Panel de Marca' : 'Dashboard B2B'}
            </span>
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
              
              {isCash && (
                <div className="mb-4">
                  <span className="bg-orange-500/10 text-orange-600 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border border-orange-500/20">
                    Cliente contado
                  </span>
                </div>
              )}

              <div className="flex flex-col gap-2 mt-6">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-[11px] font-black text-gris uppercase tracking-tight">Ciudad</span>
                  <span className="text-sm font-black text-texto">{user.city}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-[11px] font-black text-gris uppercase tracking-tight">
                    {isProvider ? 'Tipo de proveedor' : 'Tipo de negocio'}
                  </span>
                  <span className="text-sm font-black text-texto">
                    {isProvider ? user.providerType : user.customerType}
                  </span>
                </div>
                {!isProvider && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-[11px] font-black text-gris uppercase tracking-tight">Condición</span>
                    <span className="text-sm font-black text-texto capitalize">
                      {user.commercialCondition || 'Crédito'}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 italic text-[11px] text-gris font-medium">
                {isProvider ? 'Marca aliada TBS' : 'Cliente TBS desde 2024'}
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
              <div className={`rounded-3xl p-8 text-white tbs-shadow relative overflow-hidden group ${isCash ? 'bg-gradient-to-br from-[#303844] to-black' : 'bg-gradient-to-br from-rojo to-rojo-oscuro'}`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Wallet size={20} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest opacity-80">
                      {isCash ? 'Condición Comercial' : 'Cupo de crédito disponible'}
                    </span>
                  </div>
                  <div className="text-4xl font-black tracking-tighter mb-2">
                    {isCash ? (
                      'Contado'
                    ) : (
                      `$ ${user.availableCredit?.toLocaleString('es-CO')}`
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold opacity-90">
                    <span className={`w-2 h-2 rounded-full animate-pulse ${isCash ? 'bg-orange-400' : 'bg-green-400'}`} /> 
                    {isCash ? 'Pago anticipado o contra entrega' : 'Operando con normalidad'}
                  </div>
                  <button 
                    onClick={onGoPayments}
                    className={`mt-6 px-6 py-3 bg-white rounded-xl font-black text-sm hover:scale-105 transition-transform cursor-pointer ${isCash ? 'text-black' : 'text-rojo'}`}
                  >
                    {isCash ? 'Ver Pagos y Comprobantes' : 'Ver detalles de cartera'}
                  </button>
                  {isCash && (
                    <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-white/50">
                      Cupo de crédito: $0
                    </p>
                  )}
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
              {(isCash ? [
                { title: 'Solicita crédito comercial', desc: 'Puedes enviar documentos para que TBS evalúe un cupo de crédito.', icon: CreditCard },
                { title: 'Confirma pagos a tiempo', desc: 'Los pedidos contado avanzan más rápido cuando el pago queda validado.', icon: Zap },
                { title: 'Programa tus pedidos', desc: 'Planificar recompra evita pedidos urgentes y validaciones de última hora.', icon: Package }
              ] : [
                { title: 'Recompra sugerida', desc: 'Sugerimos reponer Whisky antes del 13 de Mayo.', icon: TrendingUp },
                { title: 'Promoción activa', desc: 'Combo coctelería con 7% de ahorro este mes.', icon: Tag },
                { title: 'Alerta cartera', desc: 'Paga tus facturas para mantener tu cupo.', icon: ShieldCheck }
              ]).map((rec, i) => (
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
              {/* Ad Slot for dashboard */}
              <div className="md:col-span-2 mb-4">
                <AdSlot 
                  placement="home_mid_banner"
                  campaigns={BRAND_AD_CAMPAIGNS}
                  currentUser={user}
                  onAdClick={onAdClick || (() => {})}
                  compact={true}
                />
              </div>

              {isProvider && (
                <div className="md:col-span-2 mb-4">
                  <div 
                    onClick={() => onGoAdvisorChat('publicidad', { label: 'Solicitud Visibilidad', type: 'marketing' })}
                    className="bg-gradient-to-r from-rojo to-black text-white p-8 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-6 cursor-pointer hover:scale-[1.01] transition-all group overflow-hidden relative"
                  >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10 flex items-center gap-6">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center shrink-0">
                        <Tag size={32} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black mb-1">Potencia la visibilidad de tu marca</h3>
                        <p className="text-white/70 font-bold uppercase tracking-widest text-[10px]">Pauta en banners, productos patrocinados y campañas segmentadas</p>
                      </div>
                    </div>
                    <button className="relative z-10 px-8 py-4 bg-white text-rojo rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white group-hover:bg-rojo group-hover:text-white transition-all shadow-xl">
                      Solicitar Plan de Pauta
                    </button>
                  </div>
                </div>
              )}

              {menuItems.filter(item => !item.hidden).map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    analytics.trackCta(`account_menu_${item.id}`, 'account_dashboard');
                    item.onClick && item.onClick();
                  }}
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
