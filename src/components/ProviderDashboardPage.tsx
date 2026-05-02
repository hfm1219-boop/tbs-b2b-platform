import React, { useState } from 'react';
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
  LogOut,
  X,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  ProviderProduct, 
  ProviderSalesMetric, 
  ProviderChannelMetric, 
  ProviderCityMetric, 
  ProviderCampaign, 
  ProviderSettlement, 
  ProviderInsight 
} from '../types';

interface ProviderDashboardPageProps {
  currentUser: User | null;
  products: ProviderProduct[];
  salesMetrics: ProviderSalesMetric[];
  channelMetrics: ProviderChannelMetric[];
  cityMetrics: ProviderCityMetric[];
  campaigns: ProviderCampaign[];
  settlements: ProviderSettlement[];
  insights: ProviderInsight[];
  onGoHome: () => void;
  onLogout: () => void;
  onGoAdvisorChat: (topic?: any, context?: any) => void;
  onGoProviderProducts: () => void;
  onGoProviderCampaigns: () => void;
  onGoProviderSettlements: () => void;
  onGoProviderReports: () => void;
  onCreateNotification: (notif: any) => void;
  onGoFAQ: () => void;
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
  onGoHome,
  onLogout,
  onGoAdvisorChat,
  onGoProviderProducts,
  onGoProviderCampaigns,
  onGoProviderSettlements,
  onGoProviderReports,
  onCreateNotification,
  onGoFAQ
}: ProviderDashboardPageProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'campaigns' | 'settlements' | 'reports'>('overview');
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [salesMetricType, setSalesMetricType] = useState<'revenue' | 'units'>('revenue');
  const [productSearch, setProductSearch] = useState('');

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
      <div className="bg-white border-b border-borde pt-12 pb-8">
        <div className="max-w-[1480px] mx-auto px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2 text-rojo">
                <BarChart3 size={24} />
                <h1 className="text-3xl font-black tracking-tighter text-texto">Panel de marcas y proveedores</h1>
              </div>
              <p className="text-gris font-medium max-w-2xl">
                Gestiona desempeño comercial, portafolio, campañas, liquidaciones y oportunidades dentro de TBS.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <div className="bg-gray-50 border border-borde rounded-2xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-rojo/10 text-rojo rounded-xl flex items-center justify-center font-black text-xl">
                  {currentUser?.name?.[0]}
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-rojo mb-0.5">Sesión Activa</div>
                  <div className="text-sm font-black text-texto">{currentUser?.businessName}</div>
                  <div className="text-[11px] font-bold text-gris flex items-center gap-1.5 mt-0.5 uppercase tracking-tighter">
                    <MapPin size={10} /> {currentUser?.city} · {currentUser?.providerType}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => onGoAdvisorChat('activacion', { label: 'Consulta de marca', type: 'soporte' })}
                  className="bg-texto text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-rojo transition-all flex items-center gap-2 tbs-shadow"
                >
                  <MessageSquare size={16} /> Hablar con ejecutivo TBS
                </button>
                <button 
                  onClick={onGoFAQ}
                  className="bg-white border border-borde text-gris px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:text-rojo transition-all flex items-center gap-2"
                >
                  <HelpCircle size={16} /> Centro de ayuda
                </button>
                <button 
                  onClick={onLogout}
                  className="text-gris hover:text-rojo font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 justify-center transition-colors"
                >
                  <LogOut size={12} /> Cerrar sesión
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-10 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-rojo text-white tbs-shadow shadow-rojo/20' 
                    : 'text-gris hover:bg-gray-100 hover:text-texto'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1480px] mx-auto px-8 py-10 pb-24">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-10"
            >
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {[
                  { label: 'Ventas del mes', value: formatCOP(29834000), trend: '+14%', color: 'text-texto', sub: '352 unidades' },
                  { label: 'Productos activos', value: activeProductsCount, trend: 'Ok', color: 'text-texto', sub: 'En portafolio' },
                  { label: 'Campañas activas', value: activeCampaignsCount, trend: '2 prog.', color: 'text-rojo', sub: 'En curso' },
                  { label: 'Liquidación pendiente', value: formatCOP(pendingSettlementTotal), trend: 'Próxima', color: 'text-texto', sub: 'Corte mayo' },
                  { label: 'Cumplimiento log.', value: '94%', trend: 'SLA OK', color: 'text-green-600', sub: 'Entregas a tiempo' }
                ].map((card, i) => (
                  <div key={i} className="bg-white p-6 rounded-[24px] border border-borde shadow-sm">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gris mb-3">{card.label}</p>
                    <div className="flex items-end justify-between gap-2">
                      <div className={`text-2xl font-black tracking-tighter ${card.color}`}>{card.value}</div>
                      <div className="text-[10px] font-extrabold bg-gray-50 px-2 py-1 rounded-md text-gris border border-borde">
                        {card.trend}
                      </div>
                    </div>
                    <p className="text-[11px] font-bold text-gris/60 mt-2">{card.sub}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sales Chart Placeholder */}
                <div className="lg:col-span-2 bg-white rounded-[32px] border border-borde p-8 flex flex-col h-[400px]">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-xl font-black text-texto">Evolución de ventas</h3>
                      <p className="text-sm font-medium text-gris">Comparativo de {salesMetricType === 'revenue' ? 'ingresos' : 'unidades'} por mes (Mayo 2026)</p>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
                      <button 
                        onClick={() => setSalesMetricType('revenue')}
                        className={`px-3 py-1.5 shadow-sm rounded-lg text-[10px] font-black uppercase transition-all ${salesMetricType === 'revenue' ? 'bg-white text-texto' : 'text-gris hover:text-texto'}`}
                      >
                        Ingresos
                      </button>
                      <button 
                        onClick={() => setSalesMetricType('units')}
                        className={`px-3 py-1.5 shadow-sm rounded-lg text-[10px] font-black uppercase transition-all ${salesMetricType === 'units' ? 'bg-white text-texto' : 'text-gris hover:text-texto'}`}
                      >
                        Unidades
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col pt-8 relative">
                    {/* Grid lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-12">
                      {[1, 2, 3, 4].map((_, i) => (
                        <div key={i} className="w-full border-t border-gray-100 flex items-center">
                          <span className="text-[9px] font-bold text-gris/30 pr-2 bg-white translate-y-[-50%]"></span>
                        </div>
                      ))}
                    </div>

                    <div className="flex-1 flex items-end justify-between gap-4 px-2 relative z-10">
                      {salesMetrics.map((m, i) => {
                        const maxValue = Math.max(...salesMetrics.map(sm => salesMetricType === 'revenue' ? sm.revenue : sm.units));
                        const currentVal = salesMetricType === 'revenue' ? m.revenue : m.units;
                        const height = (currentVal / maxValue) * 100;
                        const isCurrent = i === salesMetrics.length - 1;

                        return (
                          <div key={i} className="flex-1 flex flex-col items-center group relative h-full justify-end pb-8">
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#303844] text-white p-3 rounded-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none shadow-xl scale-90 group-hover:scale-100 origin-bottom z-20 whitespace-nowrap">
                               <p className="text-[10px] font-black opacity-60 uppercase tracking-widest">{m.month}</p>
                               <p className="text-sm font-black">{salesMetricType === 'revenue' ? formatCOP(m.revenue) : `${m.units} unidades`}</p>
                               <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#303844] rotate-45" />
                            </div>
                            <motion.div 
                              initial={{ height: 0 }}
                              animate={{ height: `${height}%` }}
                              transition={{ duration: 1, ease: 'easeOut', delay: i * 0.1 }}
                              className={`w-full max-w-[50px] rounded-t-xl transition-all ${
                                isCurrent 
                                  ? 'bg-rojo shadow-[0_10px_25px_rgba(230,0,32,0.3)]' 
                                  : 'bg-[#EBEDF0] group-hover:bg-[#303844] group-hover:shadow-[0_10px_25px_rgba(48,56,68,0.2)]'
                              }`}
                            />
                            <div className="absolute bottom-0 w-full text-center">
                              <p className={`text-[10px] font-black uppercase tracking-tighter ${isCurrent ? 'text-rojo' : 'text-[#303844]'}`}>{m.month}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Growth Opportunities */}
                <div className="bg-white rounded-[32px] border border-borde p-8 flex flex-col h-[400px]">
                  <h3 className="text-xl font-black text-texto mb-2">Oportunidades</h3>
                  <p className="text-sm font-medium text-gris mb-6 leading-tight">Acciones recomendadas para impulsar tu marca hoy.</p>
                  
                  <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar">
                    {insights.map((insight, i) => (
                      <div key={i} className="group p-4 bg-[#F9FAFB] rounded-2xl border border-transparent hover:border-rojo/20 hover:bg-white transition-all cursor-pointer">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                            insight.priority === 'alta' ? 'bg-rojo/10 text-rojo' : 'bg-orange-100 text-orange-600'
                          }`}>
                            Prioridad {insight.priority}
                          </span>
                          <TrendingUp size={14} className="text-gris/40 group-hover:text-rojo transition-colors" />
                        </div>
                        <h4 className="text-sm font-black text-texto mb-1">{insight.title}</h4>
                        <p className="text-[12px] font-medium text-gris leading-tight mb-4">{insight.description}</p>
                        <button 
                          onClick={() => {
                            if (insight.actionTarget === 'providerProducts') setActiveTab('products');
                            else if (insight.actionTarget === 'providerCampaigns') setActiveTab('campaigns');
                            else if (insight.actionTarget === 'providerSettlements') setActiveTab('settlements');
                            else if (insight.actionTarget === 'advisorChat') onGoAdvisorChat('activacion');
                          }}
                          className="text-[10px] font-black text-rojo uppercase tracking-widest flex items-center gap-1 hover:underline underline-offset-4"
                        >
                          {insight.actionLabel} <ChevronRight size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Sections: Channels & Cities */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-[32px] border border-borde p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-xl font-black text-texto">Ventas por canal</h3>
                      <p className="text-sm font-medium text-gris">Participación de mercado por vertical.</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    {channelMetrics.map((c, i) => (
                      <div key={i}>
                        <div className="flex justify-between items-end mb-2">
                          <div>
                            <span className="text-sm font-black text-texto">{c.channel}</span>
                            <span className="text-[11px] font-medium text-gris ml-3">{c.units} unidades</span>
                          </div>
                          <span className="text-sm font-black text-rojo">{c.percentage}%</span>
                        </div>
                        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${c.percentage}%` }}
                            transition={{ duration: 1, delay: i * 0.1 }}
                            className="h-full bg-rojo rounded-full shadow-[0_0_10px_rgba(230,0,32,0.2)]"
                          />
                        </div>
                        <div className="mt-1.5 text-[10px] font-bold text-gris/60 text-right">{formatCOP(c.revenue)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-[32px] border border-borde p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-xl font-black text-texto">Ventas por ciudad</h3>
                      <p className="text-sm font-medium text-gris">Distribución geográfica de tu portafolio.</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    {cityMetrics.map((c, i) => (
                      <div key={i}>
                        <div className="flex justify-between items-end mb-2">
                          <div>
                            <span className="text-sm font-black text-texto">{c.city}</span>
                            <span className="text-[11px] font-medium text-gris ml-3">{c.units} unidades</span>
                          </div>
                          <span className="text-sm font-black text-texto">{c.percentage}%</span>
                        </div>
                        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${c.percentage}%` }}
                            transition={{ duration: 1, delay: i * 0.1 }}
                            className="h-full bg-texto/80 rounded-full"
                          />
                        </div>
                        <div className="mt-1.5 text-[10px] font-bold text-gris/60 text-right">{formatCOP(c.revenue)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Quick Access */}
              <div className="pt-10">
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
            >
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
                      {filteredProducts.map((p) => (
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
                            <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                              p.status === 'activo' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gris'
                            }`}>
                              {p.status}
                            </span>
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
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
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
                      <div className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                        c.status === 'activa' ? 'bg-green-50 text-green-600' : c.status === 'programada' ? 'bg-orange-50 text-orange-600' : 'bg-gray-100 text-gris'
                      }`}>
                        {c.status}
                      </div>
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
               <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gris mb-6">
                  <PieChart size={32} />
               </div>
               <h3 className="text-2xl font-black text-texto mb-2">Análisis avanzado de ventas</h3>
               <p className="text-sm font-medium text-gris max-w-sm mb-10">Módulo exclusivo para proveedores premium con insights de rotación por ciudad y canal.</p>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl px-4">
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
               <button className="mt-10 bg-texto text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-rojo transition-all tbs-shadow">
                  Exportar reporte completo (PDF)
               </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

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
                <CampaignForm onComplete={() => {
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

function CampaignForm({ onComplete }: { onComplete: () => void }) {
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

  const isComplete = formData.name && formData.type && formData.channel && formData.comments;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isComplete) {
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

