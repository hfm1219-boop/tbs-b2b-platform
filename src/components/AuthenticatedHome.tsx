
import React from 'react';
import { 
  ShoppingBag, 
  CreditCard, 
  Clock, 
  Zap, 
  MessageSquare, 
  Package, 
  ArrowRight, 
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  FileText,
  BarChart3,
  Calendar,
  History,
  Tag,
  Star,
  Users,
  Truck
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  Button,
  StatusBadge,
  MetricCard,
  ActionCard,
  AlertBox,
  SectionHeader,
  PageContainer,
  PageHeader
} from './ui';
import { 
  User, 
  B2BCompanyAccount, 
  TBSNotification, 
  PendingApprovalOrder,
  Product,
  ShoppingList,
  B2BPromotion
} from '../types';

interface AuthenticatedHomeProps {
  currentUser: User;
  companyAccount: B2BCompanyAccount;
  notifications: TBSNotification[];
  approvalOrders: PendingApprovalOrder[];
  frequentProducts: Product[];
  promotions: B2BPromotion[];
  onGoCatalog: (category?: string | null) => void;
  onGoReorder: () => void;
  onGoPayments: () => void;
  onGoOrdersTracking: () => void;
  onGoUrgentOrder: () => void;
  onGoAdvisorChat: () => void;
  onGoPromotions: () => void;
  onGoOrderApprovals: () => void;
  onGoIntelligence: () => void;
  onAddToCart: (product: Product, quantity?: number) => void;
}

export function AuthenticatedHome({
  currentUser,
  companyAccount,
  notifications,
  approvalOrders,
  frequentProducts,
  promotions,
  onGoCatalog,
  onGoReorder,
  onGoPayments,
  onGoOrdersTracking,
  onGoUrgentOrder,
  onGoAdvisorChat,
  onGoPromotions,
  onGoOrderApprovals,
  onGoIntelligence,
  onAddToCart
}: AuthenticatedHomeProps) {
  // Mock recent orders for the widget
  const recentOrders = [
    { id: 'TBS-10245', date: 'Hoy', status: 'en_ruta', total: '$ 1.850.000', items: 12, delivery: 'Hoy, 2:00 PM - 5:00 PM' },
    { id: 'TBS-10218', date: '30 Abr', status: 'entregado', total: '$ 2.400.000', items: 24, delivery: 'Entregado' },
  ];

  const pendingInvoicesCount = 4;
  const nextDueDate = '8 de Mayo';
  const usedCreditPercent = Math.round(((currentUser.creditLimit || 0) - (currentUser.availableCredit || 0)) / (currentUser.creditLimit || 1) * 100);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* 1. Saludo y Resumen Operativo */}
      <div className="bg-white border-b border-gray-200 pt-12 pb-2">
        <PageContainer variant="dashboard">
          <PageHeader
            eyebrow={`${currentUser.customerType} • ${currentUser.city}`}
            title={`Hola, ${currentUser.businessName}`}
            description={`Tienes 2 pedidos en proceso, ${pendingInvoicesCount} facturas próximas a vencer y 8 productos frecuentes listos para reordenar.`}
            secondaryAction={{
              label: "Hablar con asesor",
              onClick: onGoAdvisorChat,
              icon: MessageSquare,
              variant: 'outline'
            }}
            variant="dashboard"
          />
        </PageContainer>
      </div>

      <PageContainer variant="dashboard" className="mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Dashboard Column */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* 2. Alertas Prioritarias */}
            <div className="space-y-4">
              <AlertBox 
                variant="danger"
                title="Tienes facturas próximas a vencer."
                description={`La factura FV-88321 vence el ${nextDueDate}. Evita bloqueos en tu cupo.`}
                cta={{ label: "Pagar ahora", onClick: onGoPayments }}
              />

              <AlertBox 
                variant="info"
                icon={Truck}
                title="Tu pedido #TBS-10245 está en ruta."
                description="Programado para entrega hoy entre las 2:00 p.m. y 5:00 p.m."
                cta={{ label: "Seguir pedido", onClick: onGoOrdersTracking }}
              />
            </div>

            {/* 3. Acciones Rápidas */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <ActionCard 
                icon={History} 
                title="Reordenar" 
                description="Tus productos habituales de compra recurrente" 
                onClick={onGoReorder}
                badge="Sugerido"
                variant="highlight"
              />
              <ActionCard 
                icon={CreditCard} 
                title="Pagar Cartera" 
                description="Gestionar facturas y ampliar tu cupo disponible" 
                onClick={onGoPayments}
              />
              <ActionCard 
                icon={Clock} 
                title="Seguimiento" 
                description="Estado en tiempo real de tus envíos y entregas" 
                onClick={onGoOrdersTracking}
              />
              <ActionCard 
                icon={Zap} 
                title="Pedido Urgente" 
                description="Servicio express para agotamientos y emergencias" 
                onClick={onGoUrgentOrder}
                badge="Express"
              />
              <ActionCard 
                icon={Package} 
                title="Ir al Catálogo" 
                description="Explora todo el portafolio de TBS para tu negocio" 
                onClick={() => onGoCatalog()}
              />
              <ActionCard 
                icon={BarChart3} 
                title="Inteligencia B2B" 
                description="Reportes avanzados de compra y comportamientos" 
                onClick={onGoIntelligence}
              />
            </div>

            {/* 4. Pedidos Recientes Widget */}
            <div className="bg-white border border-borde rounded-[32px] overflow-hidden panel-shadow">
              <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
                <h3 className="text-xl font-black tracking-tight flex items-center gap-3 text-texto">
                  <ShoppingBag size={24} className="text-rojo" /> Pedidos Recientes
                </h3>
                <button onClick={onGoOrdersTracking} className="text-[11px] font-black uppercase tracking-widest text-rojo hover:underline">Ver todos</button>
              </div>
              <div className="divide-y divide-gray-50">
                {recentOrders.map((order) => (
                  <div key={order.id} className="p-8 flex items-center justify-between hover:bg-gray-50/50 transition-colors group">
                    <div className="flex gap-6">
                      <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gris group-hover:bg-rojo-suave group-hover:text-rojo transition-colors">
                        <Package size={28} />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1.5">
                          <span className="text-base font-black text-texto tracking-tight">{order.id}</span>
                          <StatusBadge status={order.status} />
                        </div>
                        <div className="text-sm text-gris font-medium flex items-center gap-2">
                          <Calendar size={14} /> {order.date} <span className="w-1 h-1 rounded-full bg-gray-300" /> {order.items} productos <span className="w-1 h-1 rounded-full bg-gray-300" /> <span className="font-black text-texto">{order.total}</span>
                        </div>
                        {order.status === 'en_ruta' && (
                          <div className="mt-3 flex items-center gap-2 text-[10px] font-black text-rojo uppercase tracking-[0.1em] bg-red-50 border border-red-100 w-fit px-3 py-1 rounded-lg">
                            <Truck size={12} /> Llega: {order.delivery}
                          </div>
                        )}
                      </div>
                    </div>
                    <button onClick={onGoOrdersTracking} className="w-12 h-12 rounded-full border border-borde flex items-center justify-center text-gris hover:text-white hover:bg-rojo hover:border-rojo transition-all group-hover:scale-110 shadow-sm">
                      <ChevronRight size={22} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-borde rounded-[32px] overflow-hidden panel-shadow">
              <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
                <h3 className="text-xl font-black tracking-tight flex items-center gap-3">
                  <History size={24} className="text-rojo" /> Reabastecimiento Rápido
                </h3>
                <button onClick={onGoReorder} className="text-[11px] font-black uppercase tracking-widest text-rojo hover:underline">Historial</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2">
                {frequentProducts.slice(0, 4).map((product) => (
                  <div key={product.id} className="p-8 flex gap-5 border-b border-r border-gray-50 last:border-b-0 group hover:bg-rojo-suave/30 transition-all duration-300">
                    <div className="w-24 h-24 bg-white rounded-2xl overflow-hidden panel-shadow group-hover:scale-105 transition-transform">
                      <img src={product.image} alt={product.name} className="w-full h-full object-contain p-3" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-black text-texto truncate mb-1">{product.name}</h4>
                      <p className="text-[10px] font-black text-gris uppercase tracking-widest mb-3">{product.specs}</p>
                      <div className="text-lg font-black text-texto mb-4 tracking-tighter">{product.price}</div>
                      <Button 
                        variant="secondary"
                        size="sm"
                        className="w-full"
                        onClick={() => onAddToCart(product, 1)}
                        rightIcon={ShoppingBag}
                      >
                        Reordenar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-gray-50/50 text-center">
                <button 
                  onClick={onGoReorder}
                  className="text-[11px] font-black text-gris hover:text-rojo uppercase tracking-widest flex items-center justify-center gap-2 mx-auto transition-colors"
                >
                  Repetir pedido completo <ArrowRight size={14} />
                </button>
              </div>
            </div>

          </div>

          {/* Side Column Widgets */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* 6. Cartera B2B Widget */}
            <div className="bg-texto text-white rounded-[32px] overflow-hidden shadow-2xl relative group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-rojo opacity-5 blur-[80px] rounded-full -mr-32 -mt-32 group-hover:opacity-10 transition-all duration-700" />
              <div className="p-10 relative z-10">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/5 rounded-2xl">
                      <CreditCard size={24} className="text-rojo" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black tracking-tighter">Mi Cartera</h3>
                      <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Cupo y facturas</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-10 p-6 bg-white/5 rounded-[24px] border border-white/10">
                  <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1.5 flex justify-between">
                    <span>Cupo Disponible</span>
                    <span className="text-white font-bold">{100 - usedCreditPercent}% disponible</span>
                  </div>
                  <div className="text-4xl font-black tracking-tighter text-white mb-6">
                    {currentUser.availableCredit?.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })}
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${100 - usedCreditPercent}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-rojo shadow-[0_0_15px_rgba(169,0,0,0.5)]" 
                    />
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-[10px] font-bold text-white/30 uppercase">Uso: {usedCreditPercent}%</span>
                    <span className="text-[10px] font-bold text-white/30 uppercase">Total: {currentUser.creditLimit?.toLocaleString('es-CO', { maximumFractionDigits: 0 })}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[9px] font-black text-white/40 uppercase mb-1">Por vencer</p>
                    <p className="text-lg font-black text-white">$ 4.250k</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[9px] font-black text-white/40 uppercase mb-1">Vencido</p>
                    <p className="text-lg font-black text-rojo">--</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    onClick={onGoPayments}
                    className="w-full"
                  >
                    Pagar ahora
                  </Button>
                  <Button 
                    variant="ghost"
                    onClick={onGoPayments}
                    className="w-full bg-white/5 text-white hover:bg-white/10"
                  >
                    Ver detalle
                  </Button>
                </div>
              </div>
            </div>

            {/* 7. Pedido Urgente Card */}
            <div className="bg-gradient-to-br from-texto to-[#242D36] rounded-[32px] p-10 text-white relative overflow-hidden shadow-2xl group cursor-pointer" onClick={onGoUrgentOrder}>
               <div className="absolute -right-12 -bottom-12 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-110 group-hover:rotate-12 transition-all duration-1000">
                 <Zap size={240} fill="currentColor" />
               </div>
               <div className="relative z-10">
                 <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-rojo text-white rounded-full text-[11px] font-black uppercase tracking-widest mb-6 shadow-lg shadow-rojo/20">
                   <Zap size={14} fill="currentColor" className="animate-pulse" /> Solicitud Express
                 </div>
                 <h3 className="text-4xl font-black tracking-tighter leading-[0.9] mb-4">¿Se acabó el stock?</h3>
                 <p className="text-white/60 text-base font-medium mb-10 leading-relaxed max-w-[280px]">
                   Atención prioritaria para <span className="text-white font-bold">{currentUser.city}</span> con entrega el mismo día.
                 </p>
                 <Button 
                   variant="secondary"
                   className="bg-white text-texto hover:bg-gray-100 p-8"
                   rightIcon={ArrowRight}
                 >
                   Crear pedido urgente
                 </Button>
               </div>
            </div>

            {/* 8. Promociones B2B Widget */}
            <div className="bg-white border border-gray-200 rounded-[32px] overflow-hidden shadow-sm">
               <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
                  <Tag size={20} className="text-rojo" /> Beneficios B2B
                </h3>
                <button onClick={onGoPromotions} className="text-xs font-bold text-rojo hover:underline">Explorar</button>
              </div>
              <div className="p-6">
                {promotions.slice(0, 1).map((promo, i) => (
                  <div key={i} className="group cursor-pointer" onClick={onGoPromotions}>
                    <div className="aspect-[16/9] w-full rounded-2xl bg-gray-100 mb-4 overflow-hidden relative">
                       <img src={promo.image} alt={promo.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                       <div className="absolute top-3 left-3 px-2 py-1 bg-rojo text-white text-[9px] font-black uppercase tracking-widest rounded">
                         Condición Comercial Activa
                       </div>
                    </div>
                    <h4 className="text-sm font-black text-texto mb-1">{promo.title}</h4>
                    <p className="text-xs text-gris font-medium line-clamp-2 mb-4 leading-relaxed">{promo.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-rojo uppercase tracking-widest">{promo.type}</span>
                      <button className="text-texto hover:text-rojo transition-colors"><ChevronRight size={18} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 9. Asesor Comercial Card */}
            <div className="bg-white border border-borde rounded-[32px] p-10 panel-shadow relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -mr-16 -mt-16 pointer-events-none" />
               
               <div className="flex items-center gap-6 mb-10 relative z-10">
                 <div className="w-20 h-20 rounded-[28px] bg-white panel-shadow border-2 border-rojo-suave overflow-hidden p-1 group">
                    <img 
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop" 
                      alt="Laura Gómez" 
                      className="w-full h-full object-cover rounded-[22px] group-hover:scale-110 transition-transform duration-500"
                    />
                 </div>
                 <div>
                    <div className="text-[11px] font-black text-gris uppercase tracking-[0.2em] mb-1.5 font-sans">Tu Asesor VIP</div>
                    <div className="text-2xl font-black text-texto leading-none tracking-tighter">Laura Gómez</div>
                    <div className="flex items-center gap-2 mt-2 py-1 px-3 bg-green-50 rounded-full w-fit">
                       <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse outline outline-4 outline-green-500/20" />
                       <span className="text-[10px] font-black text-green-700 uppercase tracking-widest">En línea ahora</span>
                    </div>
                 </div>
               </div>

               <div className="bg-gray-50/80 p-6 rounded-[24px] mb-10 italic text-sm text-texto-sec leading-relaxed relative border border-gray-100">
                 <div className="absolute -top-3 left-8 w-6 h-6 bg-gray-50/80 border-t border-l border-gray-100 rotate-45" />
                 "¡Hola! He priorizado tu solicitud de whisky premium de este mes. Si necesitas algo más, solo escríbeme por el chat o solicita una llamada."
               </div>

               <div className="space-y-4">
                 <Button 
                   onClick={() => onGoAdvisorChat()}
                   className="w-full p-8"
                   rightIcon={MessageSquare}
                 >
                   Chat de soporte
                 </Button>
                 <Button 
                   variant="outline"
                   className="w-full p-8 border-gray-200"
                   rightIcon={Users}
                 >
                   Solicitar llamada
                 </Button>
               </div>
            </div>

          </div>

        </div>
      </PageContainer>
    </div>
  );
}

// QuickActionCard was replaced by ActionCard from UI library, 
// keeping this only if it was used elsewhere (it wasn't shown elsewhere in view_file results, 
// but it's safer to remove it if we integrated fully).
