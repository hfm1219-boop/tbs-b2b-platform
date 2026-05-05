import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3,
  MessageSquare,
  ShoppingCart,
  Package,
  TrendingUp,
  Tag,
  Calendar,
  Clock,
  AlertCircle,
  PieChart,
  Zap,
  Star,
  Info,
  ArrowRight,
  TrendingDown,
  ChevronRight
} from 'lucide-react';
import { 
  Button,
  MetricCard,
  AlertBox,
  SectionHeader,
  PageContainer,
  PageHeader
} from './ui';
import { 
  User, 
  CustomerIntelligenceSummary, 
  MonthlyPurchaseMetric, 
  CategoryConsumption, 
  TopPurchasedProduct, 
  CustomerInsight,
  Product
} from '../types';
import { useAnalytics } from '../hooks/useAnalytics';

interface IntelligencePageProps {
  currentUser: User | null;
  summary: CustomerIntelligenceSummary;
  monthlyMetrics: MonthlyPurchaseMetric[];
  categoryConsumption: CategoryConsumption[];
  topProducts: TopPurchasedProduct[];
  insights: CustomerInsight[];
  onBackToAccount: () => void;
  onGoReorder: () => void;
  onGoPayments: () => void;
  onGoPromotions: () => void;
  onGoAdvisorChat: (topic?: any, context?: any) => void;
  onGoUrgentOrder: () => void;
  onGoShoppingLists: () => void;
  onGoCatalog: (category?: string | null) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onOpenCart: () => void;
  onCreateNotification?: (notif: any) => void;
}

export function IntelligencePage({
  currentUser,
  summary,
  monthlyMetrics,
  categoryConsumption,
  topProducts,
  insights,
  onBackToAccount,
  onGoReorder,
  onGoPayments,
  onGoPromotions,
  onGoAdvisorChat,
  onGoUrgentOrder,
  onGoShoppingLists,
  onGoCatalog,
  onAddToCart,
  onOpenCart,
  onCreateNotification
}: IntelligencePageProps) {
  const analytics = useAnalytics(currentUser);
  const isCash = currentUser?.commercialCondition === 'contado';

  useEffect(() => {
    analytics.trackPageView('/intelligence', 'Inteligencia B2B');
  }, []);

  const formatCOP = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(value);
  };

  const calculateGrowth = () => {
    const growth = ((summary.currentMonthTotal - summary.previousMonthTotal) / summary.previousMonthTotal) * 100;
    return growth.toFixed(0);
  };

  const handleReorderProduct = (prod: TopPurchasedProduct) => {
    const productForCart: Product = {
      id: prod.productId || 0,
      name: prod.name,
      category: prod.category,
      specs: "Sugerido por inteligencia",
      price: "$ " + (prod.total / prod.units).toLocaleString(),
      image: prod.image || "https://images.unsplash.com/photo-1527281473222-f9e87be50519?auto=format&fit=crop&q=80&w=400"
    };
    
    onAddToCart(productForCart, 6);
    
    analytics.track('product_selected', 'engagement', {
      productId: prod.productId,
      productName: prod.name,
      source: 'intelligence_page_reorder'
    });

    if (onCreateNotification) {
      onCreateNotification({
        type: "comercial",
        title: "Producto recomendado agregado",
        message: `Agregaste 6 unidades de ${prod.name} sugeridas desde Inteligencia B2B.`,
        priority: "baja",
        actionTarget: "reorder"
      });
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'recompra': return Clock;
      case 'cartera': return AlertCircle;
      case 'promocion': return Tag;
      case 'rotacion': return TrendingUp;
      case 'categoria': return PieChart;
      case 'pedido_urgente': return Zap;
      case 'asesor': return MessageSquare;
      case 'lista': return Star;
      default: return Info;
    }
  };

  const handleInsightAction = (target: string) => {
    analytics.trackCta(`intelligence_insight_${target}`, 'intelligence_page');
    switch (target) {
      case 'reorder': onGoReorder(); break;
      case 'payments': onGoPayments(); break;
      case 'promotions': onGoPromotions(); break;
      case 'advisorChat': onGoAdvisorChat('producto', 'Consulta sobre recomendaciones de Inteligencia B2B'); break;
      case 'urgentOrder': onGoUrgentOrder(); break;
      case 'shoppingLists': onGoShoppingLists(); break;
      case 'catalog': onGoCatalog(null); break;
      default: break;
    }
  };

  return (
    <PageContainer variant="dashboard" className="pb-20">
      <PageHeader
        title="Inteligencia B2B"
        eyebrow={`${currentUser?.businessName} • ${currentUser?.city}`}
        icon={<BarChart3 className="text-rojo" />}
        onBack={onBackToAccount}
        actions={
          <div className="flex items-center gap-3">
            <div className="hidden md:block bg-rojo-suave px-3 py-1.5 rounded-lg border border-rojo/10">
              <span className="text-[10px] font-black text-rojo uppercase tracking-widest">Datos simulados para prototipo</span>
            </div>
            <Button 
              variant="primary"
              size="sm"
              leftIcon={MessageSquare}
              onClick={() => onGoAdvisorChat('producto', 'Consulta sobre inteligencia B2B y recomendaciones de compra.')}
            >
              Hablar con asesor
            </Button>
          </div>
        }
      />

      <div className="py-8">
        <SectionHeader
          title="Resumen de operación"
          description="Analiza tus métricas clave de este mes y compáralas con el periodo anterior."
          className="mb-8"
        />

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <MetricCard 
            label="Compra del mes" 
            value={formatCOP(summary.currentMonthTotal)} 
            subtitle={`${calculateGrowth()}% vs mes anterior`} 
            icon={ShoppingCart} 
            trend={Number(calculateGrowth()) >= 0 ? 'up' : 'down'}
            trendValue={Math.abs(Number(calculateGrowth()))}
            color="red"
          />
          <MetricCard 
            label="Pedidos del mes" 
            value={summary.currentMonthOrders} 
            subtitle={`${summary.currentMonthUnits} unidades compradas`} 
            icon={Package} 
          />
          <MetricCard 
            label="Ticket promedio" 
            value={formatCOP(summary.averageOrderValue)} 
            subtitle="Por cada pedido realizado" 
            icon={TrendingUp} 
            trend="up"
            trendValue={5.2}
            color="green"
          />
          <MetricCard 
            label="Ahorro estimado" 
            value={formatCOP(summary.estimatedSavings)} 
            subtitle="Por promociones aplicadas" 
            icon={Tag} 
            trend="up"
            trendValue={12.5}
            color="amber"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Evolución de Compras - Bar Chart con CSS */}
          <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-2xl border border-borde shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-black text-texto">Evolución de compras</h3>
                <p className="text-xs font-bold text-gris uppercase tracking-widest mt-0.5">Historial últimos 5 meses</p>
              </div>
              <Calendar size={20} className="text-gris" />
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 mt-4">
              {/* Y-Axis Labels - Made darker for visibility */}
              <div className="hidden md:flex flex-col justify-between h-64 pb-12 text-[10px] font-black text-texto/40 uppercase tracking-tighter text-right w-20">
                <span>{formatCOP(Math.max(...monthlyMetrics.map(m => m.total)))}</span>
                <span>{formatCOP(Math.max(...monthlyMetrics.map(m => m.total)) * 0.75)}</span>
                <span>{formatCOP(Math.max(...monthlyMetrics.map(m => m.total)) * 0.5)}</span>
                <span>{formatCOP(Math.max(...monthlyMetrics.map(m => m.total)) * 0.25)}</span>
                <span>$ 0</span>
              </div>

              <div className="flex-1 relative h-64 flex items-end justify-between gap-4 md:gap-8 px-2">
                {/* Custom Grid lines - Subtle but visible */}
                <div className="absolute inset-x-0 top-0 bottom-12 flex flex-col justify-between pointer-events-none">
                  <div className="w-full border-t border-gray-100" />
                  <div className="w-full border-t border-gray-100" />
                  <div className="w-full border-t border-gray-100" />
                  <div className="w-full border-t border-gray-100" />
                  <div className="w-full border-t-2 border-texto/10" />
                </div>

                {monthlyMetrics.map((metric, idx) => {
                  const maxTotal = Math.max(...monthlyMetrics.map(m => m.total));
                  const height = (metric.total / maxTotal) * 100;
                  const isCurrent = idx === monthlyMetrics.length - 1;
                  
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center group relative z-10 h-full">
                      {/* Tooltip */}
                      <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-texto text-white p-3 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none shadow-xl scale-90 group-hover:scale-100 origin-bottom z-30">
                        <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">{metric.month}</p>
                        <p className="text-sm font-black mt-1 text-white">{formatCOP(metric.total)}</p>
                        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-texto rotate-45" />
                      </div>

                      <div className="w-full h-full flex flex-col justify-end pb-12">
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ duration: 0.8, ease: "circOut", delay: idx * 0.05 }}
                          className={`w-full max-w-[56px] mx-auto rounded-t-lg transition-all relative ${
                            isCurrent 
                              ? 'bg-rojo shadow-[0_10px_20px_rgba(230,0,32,0.2)]' 
                              : 'bg-gray-300 hover:bg-texto group-hover:shadow-[0_10px_20px_rgba(0,0,0,0.1)]'
                          }`}
                        >
                          {/* Top indicator line for non-current bars */}
                          {!isCurrent && (
                            <div className="absolute top-0 left-0 right-0 h-1 bg-texto/10 rounded-t-lg" />
                          )}
                        </motion.div>
                      </div>

                      {/* X-Axis Labels */}
                      <div className="absolute bottom-0 left-0 right-0 h-10 flex flex-col items-center justify-start pt-2">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${isCurrent ? 'text-rojo' : 'text-texto'}`}>{metric.month}</span>
                        <span className="text-[8px] font-bold text-gris/60 mt-0.5">{metric.orders} pedidos</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Consumo por Categoría */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-borde shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-black text-texto">Consumo por categoría</h3>
                <p className="text-xs font-bold text-gris uppercase tracking-widest mt-0.5">Distribución de gasto</p>
              </div>
              <PieChart size={20} className="text-gris" />
            </div>

            <div className="space-y-6">
              {categoryConsumption.map((cat, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <span className="text-texto">{cat.category}</span>
                    <span className="text-gris">{cat.percentage}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${cat.percentage}%` }}
                      transition={{ duration: 1, delay: idx * 0.1 }}
                      className={`h-full rounded-full ${idx === 0 ? 'bg-rojo' : 'bg-texto/70'}`}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[9px] font-bold text-gris/60">{cat.units} unidades</span>
                    <button 
                      onClick={() => onGoCatalog(cat.category)}
                      className="text-[9px] font-black text-rojo uppercase hover:underline cursor-pointer"
                    >
                      Ver productos
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recomendaciones e Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Insights List */}
          <div className="lg:col-span-2">
            <SectionHeader
              title="Recomendaciones para tu negocio"
              description="Identificamos estas oportunidades basadas en tu comportamiento de compra."
              className="mb-6"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights.sort((a, b) => {
                const prio = { alta: 0, media: 1, baja: 2 };
                return prio[a.priority as keyof typeof prio] - prio[b.priority as keyof typeof prio];
              }).map((insight) => {
                const Icon = getInsightIcon(insight.type);
                return (
                  <motion.div 
                    key={insight.id}
                    whileHover={{ y: -3 }}
                    className={`p-5 rounded-2xl border flex flex-col h-full bg-white transition-all ${
                      insight.priority === 'alta' ? 'border-rojo/20 shadow-md ring-1 ring-rojo/5' : 'border-borde shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-2.5 rounded-xl ${
                        insight.priority === 'alta' ? 'bg-rojo-suave text-rojo' : 'bg-gray-100 text-gris'
                      }`}>
                        <Icon size={20} />
                      </div>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${
                        insight.priority === 'alta' ? 'bg-rojo text-white' : 'bg-gray-200 text-gris'
                      }`}>
                        Prioridad {insight.priority}
                      </span>
                    </div>

                    <h4 className="text-base font-black text-texto">{insight.title}</h4>
                    <p className="text-xs font-medium text-gris mt-2 leading-relaxed flex-1">
                      {insight.description}
                    </p>
                    
                    {insight.context && (
                      <div className="mt-3 flex items-center gap-1.5 text-[10px] font-bold text-gris uppercase tracking-wider">
                        <Info size={12} className="text-rojo" /> {insight.context}
                      </div>
                    )}

                    <Button 
                      variant="secondary"
                      size="sm"
                      fullWidth
                      className="mt-5"
                      icon={<ArrowRight size={14} />}
                      onClick={() => handleInsightAction(insight.actionTarget)}
                    >
                      {insight.actionLabel}
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Alertas Operativas */}
          <div className="space-y-6">
            <SectionHeader
              title="Alertas operativas"
              description="Situaciones que requieren tu atención inmediata."
              className="mb-6"
            />

            <div className="space-y-4">
              <AlertBox
                variant="info"
                title="Alta dependencia de whisky"
                description={`El whisky representa el ${categoryConsumption.find(c => c.category === 'Whisky')?.percentage}% de tus compras. Revisa promociones por volumen para optimizar margen.`}
                icon={TrendingUp}
                actions={
                  <Button variant="ghost" size="sm" onClick={onGoPromotions} rightIcon={ChevronRight}>
                    Ver promociones
                  </Button>
                }
              />

              <AlertBox
                variant="warning"
                title={isCash ? 'Facturas por pagar' : 'Facturas por vencer'}
                description={isCash 
                  ? `Tienes ${summary.pendingInvoices} facturas pendientes de pago. Realiza tus pagos para liberar pedidos y mantener tu operación.`
                  : `Tienes ${summary.pendingInvoices} facturas pendientes de pago. Realiza tus abonos para desbloquear cupo adicional de crédito.`
                }
                icon={AlertCircle}
                actions={
                  <Button variant="ghost" size="sm" onClick={onGoPayments} rightIcon={ChevronRight}>
                    {isCash ? 'Ver facturas por pagar' : 'Ir a cartera'}
                  </Button>
                }
              />

              <AlertBox
                variant="info"
                title="Uso de pedidos urgentes"
                description={`Has solicitado ${summary.urgentOrdersUsed} pedidos urgentes este mes. Programar tus compras recurrentes te ahorrará costos logísticos.`}
                icon={Zap}
                actions={
                  <Button variant="ghost" size="sm" onClick={onGoReorder} rightIcon={ChevronRight}>
                    Planear recompra
                  </Button>
                }
              />
            </div>
          </div>
        </div>

        {/* Productos Más Comprados */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black text-texto">Productos con mayor rotación</h3>
              <p className="text-sm font-medium text-gris mt-1">Los favoritos de tu negocio que deberías monitorear siempre.</p>
            </div>
            <button 
              onClick={() => onGoCatalog(null)}
              className="text-xs font-black text-rojo uppercase tracking-widest hover:underline cursor-pointer"
            >
              Ver todo el catálogo
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {topProducts.map((prod, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl border border-borde p-4 shadow-sm flex flex-col"
              >
                <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 mb-3">
                  <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2">
                    {prod.trend === 'sube' ? (
                      <div className="bg-green-100 text-green-700 p-1.5 rounded-lg border border-green-200">
                        <TrendingUp size={14} />
                      </div>
                    ) : prod.trend === 'baja' ? (
                      <div className="bg-rojo-suave text-rojo p-1.5 rounded-lg border border-rojo/10">
                        <TrendingDown size={14} />
                      </div>
                    ) : (
                      <div className="bg-gray-100 text-gris p-1.5 rounded-lg border border-borde">
                        <Clock size={14} />
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-2 left-2 bg-texto/90 text-white text-[9px] font-black px-2 py-1 rounded uppercase tracking-wider">
                    {prod.category}
                  </div>
                </div>

                <h4 className="text-sm font-black text-texto truncate">{prod.name}</h4>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gris uppercase">{prod.units} unidades</span>
                  <span className="text-xs font-black text-rojo">{formatCOP(prod.total)}</span>
                </div>

                <div className="mt-4 pt-4 border-t border-borde space-y-2">
                  <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider text-gris">
                    <span>Última compra:</span>
                    <span className="text-texto">{prod.lastPurchaseDate}</span>
                  </div>
                  <div className="flex justify-between text-[9px] font-black uppercase tracking-wider">
                    <span className="text-rojo">Recompra sugerida:</span>
                    <span className="text-rojo">{prod.suggestedReorderDate}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <button 
                    onClick={() => handleReorderProduct(prod)}
                    className="w-full py-2 bg-rojo hover:bg-black text-white rounded-lg font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer"
                  >
                    Reordenar ahora
                  </button>
                  <button 
                    onClick={() => onGoShoppingLists()}
                    className="w-full py-2 border border-borde hover:bg-gray-50 text-texto rounded-lg font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer"
                  >
                    Guardar en lista
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="bg-texto rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-rojo -rotate-12 translate-x-1/3 translate-y-1/4 opacity-20 pointer-events-none" />
          
          <div className="relative z-10">
            <h3 className="text-2xl font-black mb-2 italic">Acciones rápidas inteligentes</h3>
            <p className="text-white/70 font-medium mb-8 max-w-xl">Optimiza tu tiempo gestionando tu abastecimiento de forma directa.</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { label: 'Reordenar frecuentes', icon: Package, onClick: onGoReorder },
                { label: 'Ver promociones B2B', icon: Tag, onClick: onGoPromotions },
                { label: 'Crear lista de compra', icon: Star, onClick: onGoShoppingLists },
                { label: 'Hablar con asesor', icon: MessageSquare, onClick: () => onGoAdvisorChat('producto') },
                { label: 'Pedido urgente', icon: Zap, onClick: onGoUrgentOrder },
                { label: 'Ir al catálogo', icon: ShoppingCart, onClick: () => onGoCatalog(null) },
              ].map((action, i) => (
                <button 
                  key={i}
                  onClick={action.onClick}
                  className="bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 transition-all group cursor-pointer"
                >
                  <div className="p-2.5 rounded-xl bg-white/10 group-hover:bg-rojo transition-colors">
                    <action.icon size={20} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-center leading-tight">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
