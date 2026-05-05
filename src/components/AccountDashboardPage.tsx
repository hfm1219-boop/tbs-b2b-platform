import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  Wallet,
  CreditCard,
  Package,
  Tag,
  BarChart3,
  ShoppingCart,
  Star,
  Zap,
  Headset,
  MapPin,
  User,
  LogOut,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { 
  Button,
  MetricCard,
  PageContainer,
  PageHeader,
  SectionHeader,
  AlertBox
} from './ui';
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
    <PageContainer variant="dashboard" className="pb-24">
      <PageHeader
        title="Mi Cuenta"
        eyebrow={user.businessName}
        onBack={onGoBack}
        actions={
          <Button 
            variant="secondary"
            size="sm"
            icon={<LogOut size={18} />}
            onClick={onLogout}
          >
            Cerrar sesión
          </Button>
        }
      />

      <div className="py-8 flex flex-col lg:flex-row gap-10">
        
        {/* Sidebar - Profile Card */}
        <aside className="lg:w-[320px] shrink-0">
          <div className="bg-white rounded-3xl border border-borde p-8 tbs-shadow text-center">
            <div className="flex lg:flex-col items-center gap-4 lg:gap-6 lg:text-center text-left">
              <div className="w-20 h-20 lg:w-28 lg:h-28 bg-rojo-suave rounded-3xl flex items-center justify-center text-rojo shrink-0 shadow-xl shadow-rojo/5 group overflow-hidden relative">
                <div className="absolute inset-0 bg-rojo opacity-0 group-hover:opacity-10 transition-opacity" />
                <User className="w-10 h-10 lg:w-14 lg:h-14" strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <h1 className="text-xl lg:text-3xl font-black text-texto tracking-tight mb-1">{user.name}</h1>
                <p className="text-rojo font-black text-[10px] lg:text-xs uppercase tracking-widest mb-4">{user.businessName}</p>
                {isCash && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-full border border-amber-200 text-[10px] font-black text-amber-600 uppercase tracking-wider">
                    <Zap size={12} strokeWidth={3} /> Cliente Contado
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-8 space-y-3">
              <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-borde">
                <span className="text-[11px] font-black text-gris uppercase tracking-tight">Ciudad</span>
                <span className="text-sm font-black text-texto">{user.city}</span>
              </div>
              <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-borde">
                <span className="text-[11px] font-black text-gris uppercase tracking-tight">
                  {isProvider ? 'Tipo Proveedor' : 'Tipo Negocio'}
                </span>
                <span className="text-sm font-black text-texto">
                  {isProvider ? user.providerType : user.customerType}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Button
              variant="ghost"
              fullWidth
              size="lg"
              className="text-rojo hover:bg-rojo-suave"
              icon={<LogOut size={20} />}
              onClick={onLogout}
            >
              Cerrar sesión segura
            </Button>
          </div>
        </aside>

        {/* Main Section */}
        <div className="flex-1 min-w-0">
          <SectionHeader
            title="Resumen de Operación"
            eyebrow="Panel de control B2B"
            className="mb-8"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <MetricCard 
              label={isCash ? 'Condición Comercial' : 'Cupo de Crédito'}
              value={isCash ? 'CONTADO' : `$ ${user.availableCredit?.toLocaleString('es-CO')}`}
              icon={Wallet}
              color={isCash ? 'gray' : 'red'}
              size="lg"
              trend={isCash ? undefined : { value: 'Operativo', isPositive: true }}
              onClick={onGoPayments}
              className={isCash ? 'bg-gradient-to-br from-gray-700 to-black text-white border-0' : 'bg-gradient-to-br from-rojo to-rojo-oscuro text-white border-0'}
            />

            <div className="bg-white rounded-3xl border border-borde p-6 lg:p-8 tbs-shadow flex flex-col justify-between group hover:border-rojo/30 transition-all overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Package size={80} />
              </div>
              <div>
                <SectionHeader 
                  eyebrow="Último pedido" 
                  title="TBS-2024-8542" 
                  className="mb-2"
                />
                <p className="text-sm font-medium text-gris">Entregado el 15 Abr, 2024</p>
              </div>
              <div className="mt-8">
                <Button 
                  variant="secondary"
                  fullWidth
                  icon={<ShoppingCart size={18} />}
                  onClick={onGoReorder}
                >
                  Repetir pedido
                </Button>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <SectionHeader
              title="Recomendaciones sugeridas"
              eyebrow="Asistente TBS Smart"
              className="mb-6"
              actions={
                <Button variant="ghost" size="sm" onClick={onGoIntelligence}>
                  Ver inteligencia completa
                </Button>
              }
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(isCash ? [
                { title: 'Solicita crédito comercial', desc: 'Sube tus documentos para evaluar cupo.', icon: CreditCard },
                { title: 'Confirma pagos a tiempo', desc: 'Validación rápida para tus facturas.', icon: Zap },
                { title: 'Programa tus pedidos', desc: 'Evita quiebre de stock en temporada.', icon: Package }
              ] : [
                { title: 'Recompra sugerida', desc: ' Whisky antes del 13 de Mayo.', icon: TrendingUp },
                { title: 'Promoción activa', desc: 'Combo coctelería con 7% de ahorro.', icon: Tag },
                { title: 'Alerta cartera', desc: 'Paga a tiempo para mantener cupo.', icon: ShieldCheck }
              ]).map((rec, i) => (
                <div key={i} className="p-6 bg-white border border-borde rounded-2xl hover:shadow-md transition-all group">
                  <div className="p-2.5 bg-rojo-suave text-rojo rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                    <rec.icon size={20} />
                  </div>
                  <h4 className="text-sm font-black text-texto">{rec.title}</h4>
                  <p className="text-[12px] font-medium text-gris mt-2 leading-relaxed flex-1">{rec.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <SectionHeader
            title="Gestión y Servicios"
            eyebrow="Navegación personalizada"
            className="mb-8"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <AdSlot 
                placement="home_mid_banner"
                campaigns={BRAND_AD_CAMPAIGNS}
                currentUser={user}
                onAdClick={onAdClick || (() => {})}
                compact={true}
              />
            </div>

            {isProvider && (
              <div className="md:col-span-2">
                <div 
                  onClick={() => onGoAdvisorChat('publicidad', { label: 'Solicitud Visibilidad', type: 'marketing' })}
                  className="bg-gradient-to-r from-rojo to-black text-white p-8 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-8 cursor-pointer group relative overflow-hidden ring-4 ring-white shadow-xl shadow-rojo/10"
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                  <div className="relative z-10 flex items-center gap-6">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <Tag size={32} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black mb-1">Potencia tu visibilidad</h3>
                      <p className="text-white/70 font-bold uppercase tracking-widest text-[10px]">Estrategias de pauta y productos destacados</p>
                    </div>
                  </div>
                  <Button variant="primary" size="lg" className="bg-white text-rojo hover:bg-gray-100 relative z-10">
                    Solicitar Plan de Pauta
                  </Button>
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
                className={`flex items-start gap-4 p-6 bg-white border border-borde rounded-3xl hover:border-rojo/40 hover:shadow-lg transition-all text-left group cursor-pointer ${item.highlight ? 'ring-1 ring-rojo/10 bg-rojo-suave/5' : ''}`}
              >
                <div className={`p-4 rounded-2xl flex-shrink-0 transition-all group-hover:scale-110 ${item.highlight ? 'bg-rojo text-white' : 'bg-gray-50 text-gris group-hover:bg-rojo group-hover:text-white'}`}>
                  <item.icon size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-black text-texto tracking-tight group-hover:text-rojo transition-colors">{item.title}</span>
                    <ChevronRight size={18} className="text-gris group-hover:text-rojo group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-[13px] font-medium text-gris mt-1.5 leading-tight">{item.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
