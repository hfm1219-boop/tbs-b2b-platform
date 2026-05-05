import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Package, 
  Tag, 
  TrendingUp, 
  MessageSquare, 
  Plus, 
  ChevronRight, 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownRight, 
  ArrowRight,
  Users,
  Calendar,
  Building2,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  PieChart,
  LayoutDashboard,
  X,
  Activity,
  Award,
  Zap,
  Layout,
  MousePointer2,
  ListTodo,
  History,
  ShieldCheck,
  TrendingDown,
  HelpCircle
} from 'lucide-react';
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
  User, 
  ProviderProduct, 
  ProviderSalesMetric, 
  ProviderChannelMetric, 
  ProviderCityMetric, 
  ProviderCampaign, 
  ProviderSettlement, 
  ProviderInsight,
  ProviderPriceImportBatch
} from '../types';
import { useAnalytics } from '../hooks/useAnalytics';
import { ProviderPriceImportPage } from './provider/ProviderPriceImportPage';
import { PROVIDER_PRICE_IMPORT_BATCHES } from '../data';

// --- New Executive Components for Supplier/Brand Panel ---

function RelationshipStatusCard({ brandData }: { brandData: any }) {
  return (
    <div className="bg-white rounded-[32px] border border-borde p-8 tbs-shadow relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-rojo/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-texto text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-texto/20">
              {brandData.brandName[0]}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-2xl font-black text-texto tracking-tight">{brandData.brandName}</h3>
                <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${
                  brandData.relationshipStatus === 'activa' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'
                }`}>
                  {brandData.relationshipStatus}
                </span>
              </div>
              <p className="text-xs font-bold text-gris uppercase tracking-wider">{brandData.serviceModel}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <div className="text-[9px] font-black text-gris uppercase tracking-widest mb-1">Ejecutivo TBS</div>
              <div className="text-xs font-black text-texto flex items-center gap-1.5">
                <Users size={12} className="text-rojo" /> {brandData.assignedExecutive}
              </div>
            </div>
            <div>
              <div className="text-[9px] font-black text-gris uppercase tracking-widest mb-1">Próxima Revisión</div>
              <div className="text-xs font-black text-texto flex items-center gap-1.5">
                <Calendar size={12} className="text-rojo" /> {brandData.nextReviewDate}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-50 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gris"><Building2 size={16} /></div>
             <div>
               <div className="text-[9px] font-black text-gris uppercase">Sede principal</div>
               <div className="text-[11px] font-bold text-texto">Cartagena, CO</div>
             </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gris"><FileText size={16} /></div>
             <div>
               <div className="text-[9px] font-black text-gris uppercase">Doc. Contractual</div>
               <div className="text-[11px] font-bold text-texto">Vigente 2026</div>
             </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gris"><Activity size={16} /></div>
             <div>
               <div className="text-[9px] font-black text-gris uppercase">SLA fulfillment</div>
               <div className="text-[11px] font-bold text-green-600">98.4%</div>
             </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gris"><ShieldCheck size={16} /></div>
             <div>
               <div className="text-[9px] font-black text-gris uppercase">Nivel riesgo</div>
               <div className="text-[11px] font-bold text-texto">Bajo</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RecommendedActionsPanel({ actions }: { actions: any[] }) {
  return (
    <div className="bg-white rounded-[32px] border border-borde p-8 tbs-shadow">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h4 className="text-xl font-black text-texto tracking-tight flex items-center gap-2">
            <ListTodo size={20} className="text-rojo" /> Próximas acciones recomendadas
          </h4>
          <p className="text-sm font-medium text-gris">Tareas prioritarias para optimizar tu presencia comercial.</p>
        </div>
      </div>
      <div className="space-y-4">
        {actions.map((action, i) => (
          <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-gray-50 hover:border-rojo/20 bg-gray-50/30 transition-all group">
            <div className="flex items-start gap-4">
              <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                action.priority === 'alta' ? 'bg-rojo animate-pulse' : 
                action.priority === 'media' ? 'bg-orange-500' : 'bg-gris'
              }`} />
              <div>
                <h5 className="text-sm font-black text-texto mb-1">{action.title}</h5>
                <p className="text-xs font-medium text-gris leading-relaxed">{action.description}</p>
                {action.deadline && (
                  <div className="mt-2 text-[10px] font-black text-rojo-oscuro uppercase tracking-widest flex items-center gap-1.5">
                    <Clock size={10} /> Límite: {action.deadline}
                  </div>
                )}
              </div>
            </div>
            <button className="px-6 py-2.5 bg-texto text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rojo transition-all opacity-0 group-hover:opacity-100 whitespace-nowrap">
              {action.ctaLabel}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function BrandCommercialHealthScore({ data }: { data: any }) {
  const scoreMap: any = {
    'excelente': { label: 'Excelente', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100', icon: Award },
    'saludable': { label: 'Saludable', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', icon: CheckCircle2 },
    'atencion': { label: 'Requiere atención', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100', icon: AlertCircle },
    'critico': { label: 'Crítico', color: 'text-rojo', bg: 'bg-rojo/5', border: 'border-rojo/10', icon: X },
  };
  
  const status = scoreMap[data.commercialHealth] || scoreMap['saludable'];
  
  return (
    <div className={`p-6 rounded-[28px] border ${status.bg} ${status.border} flex items-center justify-between gap-6`}>
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center ${status.color}`}>
          <status.icon size={28} />
        </div>
        <div>
          <div className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-0.5">Salud comercial de marca</div>
          <div className={`text-xl font-black ${status.color} tracking-tight leading-none`}>{status.label}</div>
        </div>
      </div>
      <div className="hidden lg:block">
        <p className={`text-xs font-bold leading-snug max-w-[240px] text-right ${status.color} opacity-80`}>
          {data.healthReason}
        </p>
      </div>
    </div>
  );
}

function TBSPendingItemsPanel({ pendings }: { pendings: any[] }) {
  return (
    <div className="bg-white rounded-[32px] border border-borde p-8 tbs-shadow">
      <h4 className="text-xl font-black text-texto tracking-tight mb-6 flex items-center gap-2">
        <History size={20} className="text-rojo" /> Pendientes con TBS
      </h4>
      <div className="space-y-4">
        {pendings.map((item, i) => (
          <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-gray-50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gris">
                <FileText size={18} />
              </div>
              <div>
                <div className="text-sm font-black text-texto leading-none mb-1">{item.title}</div>
                <div className="text-[10px] font-bold text-gris uppercase tracking-wider">Responsable: {item.responsible}</div>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-[10px] font-black uppercase tracking-widest mb-1 ${item.status === 'En revisión' ? 'text-blue-600' : 'text-orange-600'}`}>
                {item.status}
              </div>
              <div className="text-[9px] font-medium text-gris">{item.lastUpdate}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PortfolioHealthCard({ portfolio }: { portfolio: any }) {
  return (
    <div className="bg-white rounded-[32px] border border-borde p-8 tbs-shadow">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h4 className="text-xl font-black text-texto tracking-tight">Estado de Portafolio</h4>
          <p className="text-sm font-medium text-gris">Visibilidad y salud de tus referencias en catálogo.</p>
        </div>
        <div className="text-3xl font-black text-rojo">{portfolio.totalProducts}</div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-8">
        <HealthMetricItem label="Activos" value={portfolio.activeProducts} color="text-green-600" />
        <HealthMetricItem label="Pendientes" value={portfolio.pendingProducts} color="text-orange-500" />
        <HealthMetricItem label="Sin precio" value={portfolio.productsWithoutPrice} color="text-rojo" />
        <HealthMetricItem label="Baja rotación" value={portfolio.lowRotationProducts} color="text-gris" />
      </div>

      <button className="w-full py-4 bg-gray-50 border border-borde rounded-2xl font-black text-[10px] uppercase tracking-widest text-gris hover:border-rojo hover:text-rojo transition-all">
        Ver portafolio completo
      </button>
    </div>
  );
}

function HealthMetricItem({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
      <div className="text-[9px] font-black text-gris uppercase tracking-widest mb-1">{label}</div>
      <div className={`text-xl font-black ${color} tracking-tighter leading-none`}>{value}</div>
    </div>
  );
}

function PriceUpdateStatusCard({ priceData }: { priceData: any }) {
  return (
    <div className="bg-texto text-white rounded-[32px] p-8 tbs-shadow relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
      <h4 className="text-xl font-black mb-6 tracking-tight flex items-center gap-2">
        <Tag size={20} className="text-rojo" /> Actualización de precios
      </h4>
      
      <div className="space-y-4 mb-8">
        <div className="flex justify-between items-end border-b border-white/10 pb-3">
          <div className="text-[10px] font-black uppercase text-white/50 tracking-widest">Última carga</div>
          <div className="text-sm font-black">{priceData.lastPriceUpload}</div>
        </div>
        <div className="flex justify-between items-end border-b border-white/10 pb-3">
          <div className="text-[10px] font-black uppercase text-white/50 tracking-widest">Vigencia hasta</div>
          <div className="text-sm font-black text-rojo">{priceData.priceValidUntil}</div>
        </div>
      </div>

      {priceData.productsWithExpiredPrice > 0 && (
        <div className="p-4 bg-rojo/10 border border-rojo/20 rounded-2xl mb-8 flex gap-3">
          <AlertCircle size={16} className="text-rojo shrink-0" />
          <p className="text-[10px] font-bold text-white/80 leading-normal">
            Tienes {priceData.productsWithExpiredPrice} productos con precio por vencer. Actualiza hoy para evitar pausas en catálogo.
          </p>
        </div>
      )}

      <button className="w-full py-4 bg-white text-texto rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rojo hover:text-white transition-all">
        Cargar nueva lista
      </button>
    </div>
  );
}

function ChannelOpportunitiesPanel({ opportunities }: { opportunities: any[] }) {
  return (
    <div className="bg-white rounded-[32px] border border-borde p-8 tbs-shadow h-full">
      <h4 className="text-xl font-black text-texto tracking-tight mb-8 flex items-center gap-2">
        <Building2 size={20} className="text-rojo" /> Oportunidades por canal
      </h4>
      <div className="space-y-6">
        {opportunities.map((op, i) => (
          <div key={i} className="group cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="px-2 py-0.5 bg-gray-100 text-gris text-[8px] font-black uppercase tracking-widest rounded">
                  {op.channel}
                </div>
                <h5 className="text-[13px] font-black text-texto group-hover:text-rojo transition-colors">{op.productName}</h5>
              </div>
              <div className="text-[10px] font-black text-green-600">+{op.estimatedPotential} Est.</div>
            </div>
            <p className="text-[10px] font-medium text-gris leading-relaxed mb-4">{op.reason}</p>
            <div className="flex items-center justify-between">
               <span className="text-[9px] font-black text-rojo uppercase tracking-widest">Sugerencia: {op.suggestedAction}</span>
               <ChevronRight size={14} className="text-gris group-hover:text-rojo group-hover:translate-x-1 transition-all" />
            </div>
            <div className="h-px bg-gray-50 mt-6" />
          </div>
        ))}
      </div>
    </div>
  );
}

function VisibilityOpportunitiesPanel({ visibilityOptions, onGoAdvertising }: { visibilityOptions: any[], onGoAdvertising?: () => void }) {
  return (
    <div className="bg-white rounded-[32px] border border-borde p-8 tbs-shadow h-full">
      <div className="flex items-center justify-between mb-8">
        <h4 className="text-xl font-black text-texto tracking-tight flex items-center gap-2">
          <MousePointer2 size={20} className="text-rojo" /> Oportunidades de visibilidad
        </h4>
        <button 
          onClick={onGoAdvertising}
          className="text-[10px] font-black text-rojo hover:underline uppercase tracking-widest"
        >
          Ver catálogo publicitario →
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visibilityOptions.map((opt, i) => (
          <div 
            key={i} 
            onClick={onGoAdvertising}
            className="p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-rojo/30 transition-all cursor-pointer group"
          >
            <div className="text-[9px] font-black text-rojo uppercase tracking-widest mb-1">{opt.objective}</div>
            <h5 className="text-sm font-black text-texto mb-2">{opt.adFormat}</h5>
            <p className="text-[10px] font-medium text-gris leading-snug mb-4">{opt.placement}</p>
            <div className="flex items-center gap-2 text-[9px] font-black text-texto uppercase tracking-[0.15em]">
              Solicitar espacio <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TBSRecommendationsPanel({ recommendations }: { recommendations: any[] }) {
  return (
    <div className="bg-[#303844] text-white rounded-[32px] p-8 tbs-shadow-lg overflow-hidden relative">
      <div className="absolute top-0 right-0 p-12 opacity-5">
        <Zap size={140} />
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-rojo text-white rounded-xl flex items-center justify-center">
            <Zap size={20} />
          </div>
          <h4 className="text-xl font-black tracking-tight">Recomendaciones TBS</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendations.map((rec, i) => (
            <div key={i} className="flex flex-col h-full">
              <div className={`text-[10px] font-black uppercase tracking-widest mb-2 ${
                rec.priority === 'alta' ? 'text-rojo' : 'text-white/50'
              }`}>Impacto {rec.priority}</div>
              <h5 className="text-base font-black mb-2 tracking-tight">{rec.title}</h5>
              <p className="text-xs text-white/60 font-medium mb-6 leading-relaxed flex-grow">{rec.reason}</p>
              <button className="w-full py-3 bg-white/10 hover:bg-rojo border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                {rec.ctaLabel}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const MOCK_EXECUTIVE_DATA = {
  brand: {
    brandName: 'Diageo Colombia',
    relationshipStatus: 'activa',
    serviceModel: 'Portafolio publicado + campañas',
    assignedExecutive: 'Laura Gómez',
    lastReviewDate: '15 Abr 2026',
    nextReviewDate: '28 May 2026',
    commercialHealth: 'atencion',
    healthReason: 'Precios próximos a vencer y baja rotación detectada en whisky.'
  },
  actions: [
    { title: 'Actualizar lista de precios', description: '12 productos vencen el 31 de mayo.', priority: 'alta', deadline: '24 May', ctaLabel: 'Actualizar' },
    { title: 'Revisar baja rotación', description: 'Ginebra Premium muestra caída del 15% en bares.', priority: 'media', ctaLabel: 'Ver reporte' },
    { title: 'Campaña Hoteles Cartagena', description: 'Aprobar piezas gráficas para banner de junio.', priority: 'alta', deadline: '20 May', ctaLabel: 'Revisar banner' },
    { title: 'Cargar stock nuevo SKU', description: 'Lanzamiento Baileys Almande está pendiente.', priority: 'media', ctaLabel: 'Cargar stock' }
  ],
  pendings: [
    { title: 'Lista de Precios Junio', status: 'En revisión', responsible: 'TBS', lastUpdate: 'Hace 2h' },
    { title: 'Cupón "Cata Premium"', status: 'Pendiente marca', responsible: 'Marca', lastUpdate: 'Ayer' },
    { title: 'Certificación Sanitaria', status: 'Vencido', responsible: 'Marca', lastUpdate: 'Hoy' }
  ],
  portfolio: {
    totalProducts: 142,
    activeProducts: 128,
    pendingProducts: 8,
    productsWithoutPrice: 12,
    lowRotationProducts: 5
  },
  price: {
    lastPriceUpload: '10 Mayo 2026',
    priceValidUntil: '31 Mayo 2026',
    productsWithExpiredPrice: 12,
    pendingApproval: 4
  },
  settlements: {
    nextSettlementDate: '31 Mayo 2026',
    amount: 18400000,
    status: 'Programada'
  },
  opportunities: [
    { productName: 'Buchanan\'s 12 Años', channel: 'Hoteles', estimatedPotential: '25%', reason: 'Alta demanda en eventos corporativos y bodas en Cartagena.', suggestedAction: 'Campaña Visibilidad' },
    { productName: 'Tanqueray London Dry', channel: 'Bares', estimatedPotential: '15%', reason: 'Crecimiento de consumo de coctelería premium en zonas turísticas.', suggestedAction: 'Promoción Volumen' }
  ],
  visibility: [
    { adFormat: 'Banner Home Catálogo', objective: 'Lanzamientos', placement: 'Sección Destacados - Todas las ciudades' },
    { adFormat: 'Producto Patrocinado', objective: 'Conversión', placement: 'Búsqueda "Whisky" - Posición #1' }
  ],
  recommendations: [
    { title: 'Activar promoción en bares', reason: 'Tus ventas en bares nocturnos han bajado un 5% mientras la categoría crece.', priority: 'alta', ctaLabel: 'Crear Promo' },
    { title: 'Actualizar imágenes SKU', reason: '3 productos tienen imágenes de baja resolución, afectando el CTR.', priority: 'media', ctaLabel: 'Subir Fotos' },
    { title: 'Destacar en Hoteles', reason: 'El canal hospitality muestra alta demanda de espirituosos para miniservicio.', priority: 'media', ctaLabel: 'Ver Espacios' }
  ]
};

function SupplierExecutiveSummary({ onGoPricing, onGoPortfolio, onGoCampaigns, onGoAdvisorChat, onGoAdvertising }: any) {
  return (
    <div className="space-y-10">
      {/* Top Section: Relationship & Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RelationshipStatusCard brandData={MOCK_EXECUTIVE_DATA.brand} />
        </div>
        <div className="flex flex-col gap-6">
          <BrandCommercialHealthScore data={MOCK_EXECUTIVE_DATA.brand} />
          <div className="bg-white rounded-[28px] border border-borde p-6 flex flex-col justify-between h-full tbs-shadow">
             <div>
               <div className="text-[10px] font-black uppercase text-gris tracking-widest mb-1">Próxima liquidación</div>
               <div className="text-2xl font-black text-texto tracking-tight leading-none mb-1">
                 {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(MOCK_EXECUTIVE_DATA.settlements.amount)}
               </div>
               <div className="text-[10px] font-bold text-texto bg-gray-100 inline-block px-3 py-1 rounded-full">{MOCK_EXECUTIVE_DATA.settlements.nextSettlementDate}</div>
             </div>
             <button className="mt-6 text-[10px] font-black text-rojo uppercase tracking-widest flex items-center justify-between hover:translate-x-1 transition-all">
                Ver detalle de cierre <ArrowRight size={14} />
             </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recommended Actions */}
        <div className="lg:col-span-2">
          <RecommendedActionsPanel actions={MOCK_EXECUTIVE_DATA.actions} />
        </div>
        
        {/* Pending with TBS */}
        <TBSPendingItemsPanel pendings={MOCK_EXECUTIVE_DATA.pendings} />
      </div>

      {/* Portfolio & Pricing Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-2">
          <PortfolioHealthCard portfolio={MOCK_EXECUTIVE_DATA.portfolio} />
        </div>
        <div className="lg:col-span-2">
          <PriceUpdateStatusCard priceData={MOCK_EXECUTIVE_DATA.price} />
        </div>
      </div>

      <TBSRecommendationsPanel recommendations={MOCK_EXECUTIVE_DATA.recommendations} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChannelOpportunitiesPanel opportunities={MOCK_EXECUTIVE_DATA.opportunities} />
        <VisibilityOpportunitiesPanel visibilityOptions={MOCK_EXECUTIVE_DATA.visibility} onGoAdvertising={onGoAdvertising} />
      </div>
      
      {/* Alert Banner */}
      <div className="bg-rojo text-white p-8 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden tbs-shadow-lg">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <Award size={140} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h3 className="text-2xl font-black mb-2 tracking-tight">Potencia tu marca en el próximo ciclo HORECA</h3>
          <p className="text-white/80 font-medium">Activa espacios de visibilidad premium hoy y destaca en el catálogo de los mejores restaurantes y hoteles de la costa.</p>
        </div>
        <button 
          onClick={onGoAdvertising}
          className="relative z-10 bg-white text-rojo px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-texto hover:text-white transition-all whitespace-nowrap"
        >
          Solicitar plan de visibilidad
        </button>
      </div>
    </div>
  );
}

// --- End of Executive Components ---

interface ProviderDashboardPageProps {
  currentUser: User | null;
  products: ProviderProduct[];
  salesMetrics: ProviderSalesMetric[];
  channelMetrics: ProviderChannelMetric[];
  cityMetrics: ProviderCityMetric[];
  campaigns: ProviderCampaign[];
  settlements: ProviderSettlement[];
  insights: ProviderInsight[];
  priceImportBatches: ProviderPriceImportBatch[];
  onGoHome: () => void;
  onGoAdvisorChat: (topic?: any, context?: any) => void;
  onGoProviderProducts: () => void;
  onGoProviderCampaigns: () => void;
  onGoProviderSettlements: () => void;
  onGoProviderReports: () => void;
  onGoAdvertising?: () => void;
  onCreateNotification: (notif: any) => void;
  onGoFAQ: () => void;
  activeTab?: 'overview' | 'products' | 'campaigns' | 'settlements' | 'reports';
  onTabChange?: (tab: 'overview' | 'products' | 'campaigns' | 'settlements' | 'reports') => void;
}

export function ProviderDashboardPage({
  currentUser,
  products,
  salesMetrics,
  channelMetrics,
  cityMetrics,
  campaigns,
  settlements,
  insights,
  priceImportBatches: initialPriceImportBatches,
  onGoHome,
  onGoAdvisorChat,
  onGoProviderProducts,
  onGoProviderCampaigns,
  onGoProviderSettlements,
  onGoProviderReports,
  onGoAdvertising,
  onCreateNotification,
  onGoFAQ,
  activeTab: externalActiveTab,
  onTabChange
}: ProviderDashboardPageProps) {
  const analytics = useAnalytics(currentUser);
  const [internalActiveTab, setInternalActiveTab] = useState<'overview' | 'products' | 'campaigns' | 'settlements' | 'reports'>('overview');

  const activeTab = externalActiveTab || internalActiveTab;
  const setActiveTab = (tab: 'overview' | 'products' | 'campaigns' | 'settlements' | 'reports') => {
    if (onTabChange) {
      onTabChange(tab);
    } else {
      setInternalActiveTab(tab);
    }
  };

  useEffect(() => {
    analytics.trackPageView(`/provider/${activeTab}`, `Provider Dashboard - ${activeTab}`);
  }, [activeTab]);

  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [salesMetricType, setSalesMetricType] = useState<'revenue' | 'units'>('revenue');
  const [productSearch, setProductSearch] = useState('');
  const [portfolioView, setPortfolioView] = useState<'list' | 'import'>('list');
  const [priceImportBatches, setPriceImportBatches] = useState<ProviderPriceImportBatch[]>(initialPriceImportBatches);

  const formatCOP = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const activeProductsCount = products.filter(p => p.status === 'activo').length;
  
  const filteredProducts = products.filter(p => {
    if (!productSearch) return true;
    const q = productSearch.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
  });
  const activeCampaignsCount = campaigns.filter(c => c.status === 'activa').length;
  const pendingSettlementTotal = settlements
    .filter(s => s.status === 'pendiente')
    .reduce((sum, s) => sum + s.netPayable, 0);

  // Tabs navigation
  const tabs = [
    { id: 'overview', label: 'Resumen', icon: LayoutDashboard },
    { id: 'products', label: 'Portafolio', icon: Package },
    { id: 'campaigns', label: 'Campañas', icon: Tag },
    { id: 'settlements', label: 'Liquidaciones', icon: CreditCard },
    { id: 'reports', label: 'Reportes', icon: PieChart }
  ];

  function CreditCard({ size, className }: { size?: number, className?: string }) {
    return <FileText size={size} className={className} />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header Panel */}
      <div className="bg-white border-b border-borde pt-12 pb-2">
        <PageContainer variant="dashboard">
          <PageHeader
            eyebrow="Panel de Marcas"
            title="Gestión de Proveedor"
            description="Gestiona desempeño comercial, portafolio, campañas, liquidaciones y oportunidades dentro de TBS."
            metric={{
              label: "Sesión Activa",
              value: currentUser?.businessName || 'Cargando...'
            }}
            primaryAction={{
              label: "Hablar con ejecutivo TBS",
              onClick: () => onGoAdvisorChat('activacion', { label: 'Consulta de marca', type: 'soporte' }),
              icon: MessageSquare
            }}
            secondaryAction={{
              label: "Centro de ayuda",
              onClick: onGoFAQ,
              icon: HelpCircle,
              variant: 'ghost'
            }}
            variant="dashboard"
          />
        </PageContainer>
      </div>

      <PageContainer variant="dashboard" className="mt-8">
        <div className="mb-8">
          <ModuleTabs 
            tabs={tabs}
            activeTab={activeTab}
            onChange={(id) => setActiveTab(id as any)}
            variant="dashboard"
          />
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-12"
            >
              {/* Executive Alerts */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 p-5 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-between group cursor-pointer hover:bg-orange-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-orange-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                      <Clock size={20} />
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-orange-600 mb-0.5">Alerta Prioritaria</div>
                      <div className="text-sm font-black text-texto">Tu lista de precios vence en 7 días.</div>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-orange-500 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="flex-1 p-5 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-between group cursor-pointer hover:bg-blue-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <Tag size={20} />
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-0.5">Campaña en revisión</div>
                      <div className="text-sm font-black text-texto">Tienes 3 campañas esperando aprobación.</div>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-blue-500 group-hover:translate-x-1 transition-transform" />
                </div>
                <div 
                  onClick={onGoAdvertising}
                  className="flex-1 p-5 rounded-2xl bg-texto text-white flex items-center justify-between group cursor-pointer hover:bg-rojo transition-colors tbs-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-rojo text-white rounded-xl flex items-center justify-center shadow-lg shadow-rojo/20">
                      <Zap size={20} />
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-0.5">Oportunidad TBS</div>
                      <div className="text-sm font-black">TBS recomienda activar campaña para hoteles.</div>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-white group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* New Executive Summary Layer */}
              <SupplierExecutiveSummary 
                onGoPricing={() => {
                  setPortfolioView('import');
                  setActiveTab('products');
                  analytics.trackCta('go_to_pricing_from_executive', 'provider_dashboard');
                }}
                onGoPortfolio={() => {
                  setPortfolioView('list');
                  setActiveTab('products');
                  analytics.trackCta('go_to_portfolio_from_executive', 'provider_dashboard');
                }}
                onGoCampaigns={() => {
                  setActiveTab('campaigns');
                  analytics.trackCta('go_to_campaigns_from_executive', 'provider_dashboard');
                }}
                onGoAdvisorChat={onGoAdvisorChat}
                onGoAdvertising={onGoAdvertising}
              />

              <div className="pt-10 border-t border-borde">
                 <h3 className="text-2xl font-black text-texto mb-8 tracking-tight">Análisis detallado de operación</h3>
                 
                 {/* Existing Metrics Grid */}
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
                   {[
                     { label: 'Ventas del mes', value: formatCOP(29834000), trend: '+14%', color: 'text-texto', sub: '352 unidades', icon: TrendingUp },
                     { label: 'Productos activos', value: activeProductsCount, trend: 'Ok', color: 'text-texto', sub: 'En portafolio', icon: Package },
                     { label: 'Campañas activas', value: activeCampaignsCount, trend: '2 prog.', color: 'text-rojo', sub: 'En curso', icon: Tag },
                     { label: 'Liquidación pendiente', value: formatCOP(pendingSettlementTotal), trend: 'Próxima', color: 'text-texto', sub: 'Corte mayo', icon: FileText },
                     { label: 'Cumplimiento log.', value: '94%', trend: 'SLA OK', color: 'text-green-600', sub: 'Entregas a tiempo', icon: Clock }
                   ].map((card, i) => (
                     <MetricCard
                       key={i}
                       title={card.label}
                       value={card.value.toString()}
                       icon={card.icon}
                       trend={{ value: 0, isUp: true, label: card.trend }}
                     />
                   ))}
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                   <div className="lg:col-span-2 bg-white rounded-[32px] border border-borde p-8 flex flex-col h-[400px]">
                     <div className="flex items-center justify-between mb-8">
                       <div>
                         <h3 className="text-xl font-black text-texto">Evolución de ventas</h3>
                         <p className="text-sm font-medium text-gris">Basado en datos históricos del último semestre.</p>
                       </div>
                       <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
                          <button onClick={() => setSalesMetricType('revenue')} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase ${salesMetricType === 'revenue' ? 'bg-white text-texto' : 'text-gris'}`}>Ingresos</button>
                          <button onClick={() => setSalesMetricType('units')} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase ${salesMetricType === 'units' ? 'bg-white text-texto' : 'text-gris'}`}>Unidades</button>
                       </div>
                     </div>
                     <div className="flex-1 flex flex-col pt-8 relative">
                        {/* Grid lines */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-12">
                          {[1, 2, 3, 4].map((_, i) => (
                            <div key={i} className="w-full border-t border-gray-100" />
                          ))}
                        </div>
                        <div className="flex-1 flex items-end justify-between gap-4 px-2 relative z-10">
                          {salesMetrics.map((m, i) => {
                            const maxValue = Math.max(...salesMetrics.map(sm => salesMetricType === 'revenue' ? sm.revenue : sm.units));
                            const currentVal = salesMetricType === 'revenue' ? m.revenue : m.units;
                            const height = (currentVal / maxValue) * 100;
                            return (
                              <div key={i} className="flex-1 flex flex-col items-center group relative h-full justify-end pb-8">
                                <motion.div initial={{ height: 0 }} animate={{ height: `${height}%` }} className={`w-full max-w-[40px] rounded-t-xl ${i === salesMetrics.length - 1 ? 'bg-rojo' : 'bg-gray-200'}`} />
                                <div className="absolute bottom-0 text-[10px] font-black uppercase text-gris tracking-tighter">{m.month}</div>
                              </div>
                            );
                          })}
                        </div>
                     </div>
                   </div>

                   <div className="bg-white rounded-[32px] border border-borde p-8 flex flex-col h-[400px]">
                      <h3 className="text-xl font-black text-texto mb-6">Métricas por Canal</h3>
                      <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                        {channelMetrics.map((c, i) => (
                          <div key={i}>
                            <div className="flex justify-between items-end mb-2">
                              <span className="text-xs font-black text-texto uppercase tracking-wider">{c.channel}</span>
                              <span className="text-xs font-black text-rojo">{c.percentage}%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${c.percentage}%` }} className="h-full bg-rojo" />
                            </div>
                          </div>
                        ))}
                      </div>
                   </div>
                 </div>

                 {/* Sales by city */}
                 <div className="bg-white rounded-[32px] border border-borde p-8">
                    <h3 className="text-xl font-black text-texto mb-8">Venta geográfica por ciudad</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                      {cityMetrics.map((c, i) => (
                        <div key={i} className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                          <div className="text-[10px] font-black text-gris uppercase tracking-widest mb-1">{c.city}</div>
                          <div className="text-2xl font-black text-texto tracking-tight mb-3">{formatCOP(c.revenue)}</div>
                          <div className="flex items-center justify-between text-[10px] font-bold text-gris">
                            <span>Participación</span>
                            <span className="text-rojo">{c.percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                 </div>
              </div>

              {/* Quick Access */}
              <div className="pt-10 border-t border-borde">
                <h3 className="text-xl font-black text-texto mb-8">Accesos rápidos de gestión</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {[
                    { title: 'Portafolio', desc: 'Gestiona productos y stocks.', icon: Package, tab: 'products' },
                    { title: 'Campañas', desc: 'Activaciones comerciales.', icon: Tag, tab: 'campaigns' },
                    { title: 'Reportes', desc: 'Análisis detallado de ventas.', icon: PieChart, tab: 'reports' },
                    { title: 'Liquidaciones', desc: 'Cierres, pagos y comisiones.', icon: CreditCard, tab: 'settlements' },
                    { title: 'Ejecutivo TBS', desc: 'Chat de soporte directo.', icon: MessageSquare, action: () => onGoAdvisorChat('activacion') },
                    { title: 'Solicitar Campaña', desc: 'Propón nuevas activaciones.', icon: Plus, action: () => setIsCampaignModalOpen(true) }
                  ].map((item, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        analytics.trackCta(`provider_quick_access_${item.title.toLowerCase().replace(/\s/g, '_')}`, 'provider_dashboard');
                        if (item.tab) setActiveTab(item.tab as any);
                        if (item.action) item.action();
                      }}
                      className="p-5 bg-white border border-borde rounded-2xl hover:border-rojo/30 hover:shadow-lg transition-all group flex flex-col items-center text-center cursor-pointer"
                    >
                      <div className="w-10 h-10 bg-gray-50 text-gris group-hover:bg-rojo group-hover:text-white rounded-xl flex items-center justify-center mb-3 transition-colors">
                        <item.icon size={20} />
                      </div>
                      <h4 className="text-[13px] font-black text-texto group-hover:text-rojo transition-colors">{item.title}</h4>
                      <p className="text-[10px] font-medium text-gris mt-1 leading-tight">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'products' && (
            <motion.div
               key="products"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="space-y-8"
            >
              {/* Portfolio View Switcher */}
              <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-borde inline-flex">
                <button 
                  onClick={() => setPortfolioView('list')}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    portfolioView === 'list' 
                      ? 'bg-rojo text-white tbs-shadow' 
                      : 'text-gris hover:text-texto'
                  }`}
                >
                  Lista de productos
                </button>
                <button 
                  onClick={() => setPortfolioView('import')}
                  className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    portfolioView === 'import' 
                      ? 'bg-rojo text-white tbs-shadow' 
                      : 'text-gris hover:text-texto'
                  }`}
                >
                  Importar precios / Historial
                </button>
              </div>

              {portfolioView === 'list' ? (
                <div className="bg-white rounded-[32px] border border-borde overflow-hidden">
                  <div className="p-8 border-b border-borde flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <h3 className="text-2xl font-black text-texto">Portafolio de productos</h3>
                      <p className="text-sm font-medium text-gris">Estado, inventario y desempeño de tus referencias.</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gris" size={16} />
                        <input 
                          type="text" 
                          value={productSearch}
                          onChange={(e) => setProductSearch(e.target.value)}
                          placeholder="Buscar SKU o nombre..." 
                          className="pl-10 pr-4 py-2.5 bg-gray-50 border border-borde rounded-xl text-xs font-semibold focus:border-rojo outline-none min-w-[240px]"
                        />
                      </div>
                      <button className="p-2.5 border border-borde rounded-xl hover:bg-gray-50 transition-colors">
                        <Filter size={18} className="text-gris" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gris">Producto</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gris">SKU</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gris text-center">Estado</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gris text-center">Stock</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gris text-center">Ventas (und)</th>
                          <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gris text-right">Revenue</th>
                          <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gris text-center">Rotación</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {filteredProducts.length > 0 ? filteredProducts.map((p) => (
                          <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-4">
                                <img src={p.image} alt={p.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100 border border-borde" />
                                <div>
                                  <div className="text-[13px] font-black text-texto group-hover:text-rojo transition-colors">{p.name}</div>
                                  <div className="text-[10px] font-bold text-gris uppercase">{p.category} · {p.inventoryModel}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5 text-xs font-mono text-gris-oscuro">{p.sku}</td>
                            <td className="px-6 py-5 text-center">
                              <StatusBadge status={p.status === 'activo' ? 'entregado' : 'cancelado'} label={p.status} />
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex flex-col items-center">
                                <div className={`text-sm font-black ${p.stock < 50 ? 'text-rojo' : 'text-texto'}`}>{p.stock}</div>
                                <div className="text-[9px] font-bold text-gris uppercase">und</div>
                              </div>
                            </td>
                            <td className="px-6 py-5 text-center text-sm font-black text-texto">{p.unitsSold}</td>
                            <td className="px-6 py-5 text-right font-black text-sm text-texto">{formatCOP(p.revenue)}</td>
                            <td className="px-8 py-5">
                               <div className="flex flex-col items-center">
                                 <div className={`text-[10px] font-black uppercase tracking-tighter flex items-center gap-1 ${
                                   p.rotation === 'alta' ? 'text-green-600' : p.rotation === 'media' ? 'text-orange-500' : 'text-gris'
                                 }`}>
                                   {p.rotation === 'alta' ? <ArrowUpRight size={14} /> : p.rotation === 'media' ? <TrendingUp size={14} /> : <ArrowDownRight size={14} />}
                                   {p.rotation}
                                 </div>
                               </div>
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan={7} className="px-8 py-20">
                              <EmptyState 
                                compact
                                variant="warning"
                                title="No se encontraron productos"
                                description={productSearch ? `No hay resultados para "${productSearch}" en tu portafolio.` : "Tu portafolio está vacío actualmente."}
                                primaryActionLabel={productSearch ? "Limpiar filtros" : "Importar productos"}
                                onPrimaryAction={() => productSearch ? setProductSearch('') : setPortfolioView('import')}
                              />
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <ProviderPriceImportPage 
                  currentUser={currentUser}
                  existingBatches={priceImportBatches}
                  onBackToProviderDashboard={() => setPortfolioView('list')}
                  onSubmitPriceImport={(batch) => setPriceImportBatches(prev => [batch, ...prev])}
                  onGoAdvisorChat={onGoAdvisorChat}
                  onCreateNotification={onCreateNotification}
                />
              )}
            </motion.div>
          )}

          {activeTab === 'campaigns' && (
            <motion.div
               key="campaigns"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="space-y-8"
            >
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-black text-texto">Gestión de campañas</h3>
                  <p className="text-sm font-medium text-gris">Monitorea activaciones, presupuestos y retorno de inversión.</p>
                </div>
                <button 
                  onClick={() => setIsCampaignModalOpen(true)}
                  className="bg-rojo text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3 tbs-shadow"
                >
                  <Plus size={20} /> Solicitar nueva campaña
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {campaigns.map((c) => (
                  <div key={c.id} className="bg-white rounded-[32px] border border-borde p-8 flex flex-col space-y-6 relative overflow-hidden group">
                    <div className="flex justify-between items-start">
                      <StatusBadge status={c.status === 'activa' ? 'entregado' : c.status === 'programada' ? 'en_transito' : 'cancelado'} label={c.status} />
                      <div className="text-[10px] font-black text-gris uppercase tracking-widest">{c.type}</div>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-black text-texto mb-2 group-hover:text-rojo transition-colors">{c.name}</h4>
                      <div className="flex items-center gap-2 text-xs font-bold text-gris">
                        <Calendar size={14} /> 
                        <span>{c.startDate} — {c.endDate}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                      <div>
                        <div className="text-[10px] font-black text-gris uppercase mb-1">Presupuesto</div>
                        <div className="text-sm font-black text-texto">{formatCOP(c.budget || 0)}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-gris uppercase mb-1">Revenue</div>
                        <div className="text-sm font-black text-green-600">+{formatCOP(c.revenueGenerated || 0)}</div>
                      </div>
                    </div>

                    <div className="pt-2">
                       <div className="text-[10px] font-black text-gris uppercase mb-2">Productos ({c.products.length})</div>
                       <div className="flex flex-wrap gap-1.5">
                         {c.products.map((p, idx) => (
                           <span key={idx} className="text-[9px] font-black bg-gray-50 text-gris px-2 py-1 rounded uppercase">{p}</span>
                         ))}
                       </div>
                    </div>

                    <button className="w-full py-4 border-2 border-borde rounded-2xl font-black text-xs uppercase tracking-widest text-gris hover:border-rojo hover:text-rojo transition-all mt-auto flex items-center justify-center gap-2">
                      Ver desempeño <ArrowRight size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Advertising and Visibility Section */}
              <div className="pt-16 border-t border-borde">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                  <div>
                    <h3 className="text-xl font-black text-texto">Publicidad y visibilidad en TBS</h3>
                    <p className="text-sm font-medium text-gris">Las marcas pueden contratar espacios de visibilidad dentro del portal para destacar productos, campañas, cupones o contenido editorial.</p>
                  </div>
                  <button 
                    onClick={() => onGoAdvisorChat('publicidad', { label: 'Solicitud Visibilidad', type: 'marketing' })}
                    className="bg-rojo text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-[1.02] transition-all tbs-shadow shrink-0"
                  >
                    Solicitar plan de pauta
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { 
                      title: 'Banners Premium', 
                      icon: LayoutDashboard, 
                      benefit: 'Máximo Alcance',
                      desc: 'Espacios de alto impacto en el Home y cabeceras de categorías. Ideal para lanzamientos nacionales o regionales.'
                    },
                    { 
                      title: 'Productos Patrocinados', 
                      icon: Package, 
                      benefit: 'Venta Directa',
                      desc: 'Tus productos aparecerán en las primeras posiciones del catálogo y resultados de búsqueda, con etiqueta de "Patrocinado".'
                    },
                    { 
                      title: 'Marca Destacada', 
                      icon: Building2, 
                      benefit: 'Branding',
                      desc: 'Presencia prioritaria en la sección de marcas y filtros destacados. Refuerza el posicionamiento b2b de tu portafolio.'
                    },
                    { 
                      title: 'Páginas de Campaña', 
                      icon: FileText, 
                      benefit: 'Especializado',
                      desc: 'Landing pages exclusivas (ej: tbs.com/campaña/tu-marca) con diseño personalizado y carruseles de productos curados.'
                    },
                    { 
                      title: 'Cupones de Marca', 
                      icon: Tag, 
                      benefit: 'Conversión',
                      desc: 'Activa códigos de descuento exclusivos para clientes premium o segmentos específicos (Bares, Hoteles etc).'
                    },
                    { 
                      title: 'Contenido Editorial', 
                      icon: MessageSquare, 
                      benefit: 'Educación',
                      desc: 'Publicación de guías de coctelera, notas de cata o artículos en el Blog TBS impulsados por tu marca.'
                    }
                  ].map((service, i) => (
                    <div key={i} className="bg-white p-8 rounded-[32px] border border-borde hover:border-rojo/30 transition-all group flex flex-col h-full shadow-sm hover:shadow-md">
                      <div className="flex items-start justify-between mb-6">
                        <div className="w-14 h-14 bg-gray-50 text-gris group-hover:bg-rojo group-hover:text-white rounded-2xl flex items-center justify-center transition-all duration-300">
                          <service.icon size={24} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-gray-100 text-gris rounded-full group-hover:bg-rojo/10 group-hover:text-rojo transition-colors">
                          {service.benefit}
                        </span>
                      </div>
                      <h4 className="text-base font-black text-texto mb-3">{service.title}</h4>
                      <p className="text-xs font-medium text-gris leading-relaxed flex-grow">
                        {service.desc}
                      </p>
                      <div className="mt-6 pt-6 border-t border-borde flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] font-black uppercase tracking-widest text-rojo">Saber más</span>
                        <ChevronRight size={14} className="text-rojo" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'settlements' && (
            <motion.div
               key="settlements"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
            >
              <div className="bg-white rounded-[32px] border border-borde overflow-hidden">
                <div className="p-8 border-b border-borde flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h3 className="text-2xl font-black text-texto">Liquidaciones y pagos</h3>
                    <p className="text-sm font-medium text-gris">Consulta tus cierres, comisiones de plataforma y servicios logísticos.</p>
                  </div>
                  <div className="bg-rojo/5 border border-rojo/10 px-6 py-4 rounded-2xl">
                    <div className="text-[10px] font-black uppercase tracking-widest text-rojo mb-1 text-center">Neto pendiente por cobrar</div>
                    <div className="text-xl font-black text-texto text-center">{formatCOP(pendingSettlementTotal)}</div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                   <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gris">Periodo</th>
                          <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gris text-right">Venta Bruta</th>
                          <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gris text-right">Comisión</th>
                          <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gris text-right">Serv. Logísticos</th>
                          <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gris text-right">Neto a Pagar</th>
                          <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gris text-center">Estado</th>
                          <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gris text-right">Acción</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {settlements.map((s) => (
                          <tr key={s.id} className="hover:bg-gray-50/50 transition-colors group">
                            <td className="px-8 py-6">
                               <div className="text-sm font-black text-texto group-hover:text-rojo transition-colors">{s.period}</div>
                               <div className="text-[10px] font-bold text-gris uppercase">ID: {s.id}</div>
                            </td>
                            <td className="px-6 py-6 text-right text-xs font-bold text-texto">{formatCOP(s.grossSales)}</td>
                            <td className="px-6 py-6 text-right text-xs font-bold text-rojo">-{formatCOP(s.commissions)}</td>
                            <td className="px-6 py-6 text-right text-xs font-bold text-gris">-{formatCOP(s.logisticsFees)}</td>
                            <td className="px-6 py-6 text-right text-sm font-black text-texto">{formatCOP(s.netPayable)}</td>
                            <td className="px-6 py-6 text-center">
                              <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full ${
                                s.status === 'pagada' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                              }`}>
                                {s.status === 'pagada' ? 'Pagada' : 'Pendiente'}
                              </span>
                              {s.paymentDate && <p className="text-[9px] font-bold text-gris mt-1">{s.paymentDate}</p>}
                            </td>
                            <td className="px-8 py-6 text-right">
                              <button className="text-[10px] font-black text-rojo uppercase tracking-widest hover:underline whitespace-nowrap">Ver detalle</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                   </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'reports' && (
            <motion.div
               key="reports"
               initial={{ opacity: 0, scale: 0.98 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.98 }}
               className="flex flex-col items-center justify-center py-20 text-center"
            >
               <EmptyState
                 variant="blocked"
                 title="Análisis avanzado de ventas"
                 description="Módulo exclusivo para marcas premium con insights de rotación por ciudad y canal."
                 icon={PieChart}
                 primaryActionLabel="Exportar reporte completo (PDF)"
                 onPrimaryAction={() => analytics.trackCta('provider_export_report', 'provider_dashboard')}
                 roleExplanation="Contacta a tu ejecutivo TBS para habilitar este módulo"
               />
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl px-4 mt-12">
                  <div className="p-6 bg-white border border-borde rounded-[24px] text-left">
                     <Clock size={20} className="text-rojo mb-3" />
                     <h4 className="text-sm font-black text-texto mb-2">Tendencias de rotación</h4>
                     <p className="text-xs font-medium text-gris">Descubre qué categorías crecen más en tu portafolio semana a semana.</p>
                  </div>
                  <div className="p-6 bg-white border border-borde rounded-[24px] text-left">
                     <Users size={20} className="text-rojo mb-3" />
                     <h4 className="text-sm font-black text-texto mb-2">Comportamiento del cliente</h4>
                     <p className="text-xs font-medium text-gris">Perfil de los clientes compradores (restaurantes vs bares) y ticket promedio.</p>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </PageContainer>

      {/* Campaign Request Modal */}
      <AnimatePresence>
        {isCampaignModalOpen && (
          <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCampaignModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-borde flex items-center justify-between bg-white sticky top-0 z-20">
                <div>
                  <h3 className="text-2xl font-black text-texto">Solicitar activación</h3>
                  <p className="text-sm font-medium text-gris">Propón nuevas campañas para impulsar tu portafolio.</p>
                </div>
                <button 
                  onClick={() => setIsCampaignModalOpen(false)}
                  className="w-10 h-10 bg-gray-50 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                <CampaignForm 
                  analytics={analytics}
                  onComplete={() => {
                  setIsCampaignModalOpen(false);
                  onCreateNotification({
                    type: 'comercial',
                    title: 'Solicitud enviada',
                    message: 'Tu propuesta de campaña fue recibida. Te responderemos por chat.',
                    priority: 'media'
                  });
                }} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CampaignForm({ onComplete, analytics }: { onComplete: () => void, analytics?: any }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    products: '',
    city: 'Cartagena',
    channel: '',
    budget: '',
    startDate: '',
    comments: ''
  });

  useEffect(() => {
    if (analytics) {
      analytics.trackFormStart('provider_campaign_request');
    }
  }, []);

  const isComplete = formData.name && formData.type && formData.channel && formData.comments;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isComplete) {
      if (analytics) {
        analytics.trackFormSubmit('provider_campaign_request', true, {
          campaignType: formData.type,
          city: formData.city
        });
      }
      setStep(2);
    }
  };

  if (step === 2) {
    return (
      <div className="py-10 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={40} />
        </div>
        <h4 className="text-2xl font-black text-texto mb-2">¡Propuesta recibida!</h4>
        <p className="text-sm font-medium text-gris max-w-xs mb-10">
          El equipo TBS revisará tu propuesta de activación y te responderá por el chat interno en las próximas 24 horas.
        </p>
        <button 
          onClick={onComplete}
          className="w-full bg-rojo text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          Entendido, gracias
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-rojo ml-1">Nombre de la campaña *</label>
          <input 
            required
            type="text" 
            placeholder="Ej: Lanzamiento Verano 2026"
            className="w-full bg-[#F9FAFB] border border-borde focus:border-rojo rounded-xl px-5 py-4 text-sm font-semibold outline-none"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-rojo ml-1">Tipo de activación *</label>
          <select 
            required
            className="w-full bg-[#F9FAFB] border border-borde focus:border-rojo rounded-xl px-5 py-4 text-sm font-semibold outline-none appearance-none"
            value={formData.type}
            onChange={e => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="">Seleccionar tipo</option>
            <option value="promocion">Promoción de precio</option>
            <option value="activacion">Activación de campo</option>
            <option value="visibilidad">Visibilidad en app</option>
            <option value="lanzamiento">Lanzamiento de producto</option>
            <option value="trade">Trade Marketing</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-rojo ml-1">Canal objetivo *</label>
          <select 
            required
            className="w-full bg-[#F9FAFB] border border-borde focus:border-rojo rounded-xl px-5 py-4 text-sm font-semibold outline-none appearance-none"
            value={formData.channel}
            onChange={e => setFormData({ ...formData, channel: e.target.value })}
          >
            <option value="">Seleccionar canal</option>
            <option value="restaurantes">Restaurantes</option>
            <option value="bares">Bares / Discotecas</option>
            <option value="hoteles">Hoteles</option>
            <option value="licoreras">Licoreras</option>
            <option value="eventos">Eventos</option>
            <option value="multicanal">Multicanal</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-rojo ml-1">Presupuesto estimado</label>
          <input 
            type="text" 
            placeholder="Ej: $ 5.000.000"
            className="w-full bg-[#F9FAFB] border border-borde focus:border-rojo rounded-xl px-5 py-4 text-sm font-semibold outline-none"
            value={formData.budget}
            onChange={e => setFormData({ ...formData, budget: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-rojo ml-1">Productos involucrados</label>
        <input 
          type="text" 
          placeholder="Ej: Whisky Premium, Ron Añejo..."
          className="w-full bg-[#F9FAFB] border border-borde focus:border-rojo rounded-xl px-5 py-4 text-sm font-semibold outline-none"
          value={formData.products}
          onChange={e => setFormData({ ...formData, products: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-rojo ml-1">Descripción y comentarios *</label>
        <textarea 
          required
          rows={4}
          placeholder="Explica el objetivo de la campaña, la mecánica y qué esperas lograr..."
          className="w-full bg-[#F9FAFB] border border-borde focus:border-rojo rounded-xl px-5 py-4 text-sm font-semibold outline-none resize-none"
          value={formData.comments}
          onChange={e => setFormData({ ...formData, comments: e.target.value })}
        />
      </div>

      <button 
        type="submit"
        disabled={!isComplete}
        className={`w-full py-5 rounded-2xl font-black text-lg uppercase tracking-widest transition-all ${
          isComplete 
            ? 'bg-rojo text-white shadow-xl hover:scale-[1.02]' 
            : 'bg-gray-100 text-gris cursor-not-allowed'
        }`}
      >
        Enviar solicitud a TBS
      </button>
    </form>
  );
}

function CreditCard({ size, className }: { size?: number, className?: string }) {
  return <FileText size={size} className={className} />;
}

