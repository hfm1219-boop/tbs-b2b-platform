import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart3, 
  Building2,
  CheckCircle2, 
  ChevronDown, 
  HelpCircle, 
  Layout, 
  MessageSquare, 
  MousePointer2, 
  PieChart, 
  Plus, 
  Search, 
  ShieldCheck, 
  Target, 
  TrendingUp, 
  Users, 
  Zap,
  Tag,
  MapPin,
  ClipboardList,
  Eye,
  ShoppingCart,
  ZapOff,
  Bell,
  Mail,
  Smartphone,
  Globe,
  ArrowRight
} from 'lucide-react';
import { 
  BrandAdCampaign, 
  User, 
  Product, 
  AdFormat 
} from '../types';
import { AdSlot } from './advertising/AdSlot';
import { SponsoredBanner } from './advertising/SponsoredBanner';
import { FeaturedBrandCard } from './advertising/FeaturedBrandCard';
import { SponsoredProductCard } from './advertising/SponsoredProductCard';
import { CouponStrip } from './advertising/CouponStrip';
import { EditorialAdCard } from './advertising/EditorialAdCard';
import { Breadcrumbs } from './Breadcrumbs';
import { 
  Button,
  PageContainer,
  PageHeader
} from './ui';

interface AdvertisingPageProps {
  onBack: () => void;
  onRequestAccess: (role: 'client' | 'provider') => void;
  onGoAdvisorChat: (topic?: string, context?: any) => void;
  currentUser?: User | null;
  products: Product[];
  campaigns: BrandAdCampaign[];
}

export function AdvertisingPage({ 
  onBack, 
  onRequestAccess, 
  onGoAdvisorChat, 
  currentUser,
  products,
  campaigns
}: AdvertisingPageProps) {
  const [selectedFormat, setSelectedFormat] = useState<AdFormat | 'all'>('all');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  // Mock data for formats
  const adFormats = [
    {
      id: 'banner',
      name: 'Banner Hoja de Inicio / Catálogo',
      format: 'banner' as AdFormat,
      desc: 'Formato de gran impacto visual en las zonas de mayor tráfico.',
      placement: 'Home pública, Dashboard cliente, Parte superior de catálogo.',
      objective: 'Lanzamientos, Temporadas, Posicionamiento.',
      metrics: 'Impresiones, Clics, CTR.',
      color: 'bg-blue-500'
    },
    {
      id: 'sponsored_product',
      name: 'Producto Patrocinado',
      format: 'sponsored_product' as AdFormat,
      desc: 'Destaca SKUs específicos dentro de los resultados de búsqueda y categorías.',
      placement: 'Resultados de búsqueda, Categorías, "Recomendados".',
      objective: 'Ventas directas, Rotación de inventario.',
      metrics: 'Ventas atribuidas, Agregados al carrito, ROI.',
      color: 'bg-orange-500'
    },
    {
      id: 'coupon',
      name: 'Cupón B2B',
      format: 'coupon' as AdFormat,
      desc: 'Incentiva la compra inmediata mediante beneficios comerciales exclusivos.',
      placement: 'Catálogo, Checkout, Email marketing B2B.',
      objective: 'Conversión, Fidelización, Volumen.',
      metrics: 'Redenciones, Ticket promedio, Recompra.',
      color: 'bg-rojo'
    },
    {
      id: 'featured_brand',
      name: 'Marca Destacada',
      format: 'featured_brand' as AdFormat,
      desc: 'Espacio dedicado para comunicar el universo y portafolio de una marca.',
      placement: 'Home sectorizada, Cabeceras de categoría.',
      objective: 'Branding, Storytelling, Cross-selling.',
      metrics: 'Visitas a marca, Interaction rate.',
      color: 'bg-indigo-500'
    },
    {
      id: 'editorial_content',
      name: 'Editorial Patrocinado',
      format: 'editorial_content' as AdFormat,
      desc: 'Contenido educativo o guías de producto con presencia de marca no intrusiva.',
      placement: 'Sección Blog/Guías, Newsletter TBS.',
      objective: 'Educación, Consideración premium, Autoridad.',
      metrics: 'Tiempo de lectura, Clics en productos relacionados.',
      color: 'bg-emerald-500'
    },
    {
      id: 'segmented_campaign',
      name: 'Campaña Segmentada',
      format: 'segmented_campaign' as AdFormat,
      desc: 'Combinación de formatos dirigidos exclusivamente a un grupo de clientes.',
      placement: 'Multicanal dentro de la plataforma.',
      objective: 'Acciones tácticas por canal (ej. Hoteles en Cartagena).',
      metrics: 'Performance por segmento, Penetración de mercado.',
      color: 'bg-purple-500'
    }
  ];

  const filteredFormats = selectedFormat === 'all' 
    ? adFormats 
    : adFormats.filter(f => f.format === selectedFormat);

  // Mock metrics data
  const mockMetrics = [
    { label: 'Impresiones Totales', value: '1.2M+', icon: Eye, color: 'text-blue-600' },
    { label: 'Ventas Atribuidas', value: '$450M+', icon: TrendingUp, color: 'text-green-600' },
    { label: 'CTR Promedio', value: '4.8%', icon: MousePointer2, color: 'text-orange-600' },
    { label: 'ROAS Promedio', value: '12x', icon: BarChart3, color: 'text-purple-600' }
  ];

  const requestFlow = [
    { step: 1, title: 'Define tu Objetivo', icon: Target, desc: 'Lanzamiento, rotación, posicionamiento o canal específico.' },
    { step: 2, title: 'Elige Formatos', icon: Layout, desc: 'Selecciona los espacios que mejor se adapten a tu presupuesto y meta.' },
    { step: 3, title: 'Segmentación B2B', icon: Users, desc: 'Filtra por ciudad, canal (HORECA, Licoreras) o tipo de cliente.' },
    { step: 4, title: 'Carga de Artes', icon: Globe, desc: 'Envía tus materiales o solicita apoyo de nuestro equipo creativo.' },
    { step: 5, title: 'Activación y Seguimiento', icon: Zap, desc: 'Tu campaña sale en vivo y empiezas a recibir datos en tiempo real.' },
    { step: 6, title: 'Reporte Final', icon: PieChart, desc: 'Análisis profundo de resultados y ROAS de tu inversión.' }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-texto">
      {/* Hero Section */}
      <section className="relative bg-[#F8FAFC] pt-12 pb-24 border-b border-borde overflow-hidden">
        <PageContainer variant="public">
          <PageHeader
            eyebrow="Retail Media B2B"
            title="Publicidad B2B para marcas que quieren crecer"
            description="Activa visibilidad en catálogo, home, campañas, cupones y productos patrocinados para llegar a clientes HORECA, licoreras y aliados justo en el momento de compra."
            primaryAction={{
              label: "Solicitar pauta",
              onClick: () => setIsRequestModalOpen(true),
              icon: ArrowRight
            }}
            secondaryAction={{
              label: "Ver formatos",
              onClick: () => document.getElementById('formatos')?.scrollIntoView({ behavior: 'smooth' }),
              variant: 'outline'
            }}
            variant="public"
          />

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 flex flex-wrap gap-8 items-center text-sm font-bold text-gris uppercase tracking-wider"
          >
            <span className="flex items-center gap-2"><CheckCircle2 className="text-rojo" size={18} /> Visibilidad segmentada</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="text-rojo" size={18} /> Campañas por canal</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="text-rojo" size={18} /> Reportes de desempeño</span>
          </motion.div>
        </PageContainer>
      </section>

      {/* Intro Section */}
      <section className="py-24 border-b border-borde">
        <PageContainer variant="public">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl lg:text-6xl font-black tracking-tighter leading-tight mb-8 text-texto">
                Visibilidad comercial dentro del flujo <span className="text-rojo">real</span> de compra B2B.
              </h2>
              <p className="text-xl text-texto-sec leading-relaxed font-medium mb-10">
                La publicidad en TBS no es solo un banner; es una capa de trade marketing digital integrada. Permite destacar productos y marcas en los momentos precisos donde los clientes profesionales están explorando, comparando o reabasteciendo su inventario.
              </p>
              
              <div className="grid grid-cols-2 gap-8">
                {[
                  { title: 'Presencia Nativa', desc: 'Tu marca se siente parte de la experiencia de compra, no como una interrupción.' },
                  { title: 'Segmentación de Canal', desc: 'Llega solo a hoteles, o solo a licoreras, optimizando tu presupuesto.' },
                  { title: 'Medición de Venta', desc: 'Atribuimos ventas reales a tus acciones de visibilidad dentro de la plataforma.' },
                  { title: 'Aliado Operativo', desc: 'Te ayudamos a que la demanda generada se cumpla con nuestra logística.' }
                ].map((item, i) => (
                  <div key={i}>
                    <h4 className="text-lg font-black text-texto mb-2">{item.title}</h4>
                    <p className="text-sm font-medium text-gris leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-[40px] p-12 border border-borde relative overflow-hidden">
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-rojo/10 rounded-full blur-3xl" />
              <div className="relative z-10 space-y-8">
                <div className="p-6 bg-white rounded-3xl tbs-shadow border border-borde flex items-center gap-6">
                  <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center"><TrendingUp size={28} /></div>
                  <div>
                    <div className="text-[10px] font-black uppercase text-gris tracking-widest">Impacto promedio</div>
                    <div className="text-2xl font-black">+24% Rotación</div>
                  </div>
                </div>
                <div className="p-6 bg-white rounded-3xl tbs-shadow border border-borde flex items-center gap-6">
                  <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center"><ShoppingCart size={28} /></div>
                  <div>
                    <div className="text-[10px] font-black uppercase text-gris tracking-widest">Agregados al carrito</div>
                    <div className="text-2xl font-black">4.2x ROAS</div>
                  </div>
                </div>
                <div className="p-6 bg-white rounded-3xl tbs-shadow border border-borde flex items-center gap-6">
                  <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center"><Eye size={28} /></div>
                  <div>
                    <div className="text-[10px] font-black uppercase text-gris tracking-widest">Visibilidad de marca</div>
                    <div className="text-2xl font-black">12k+ Impresiones/semana</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Formats Grid */}
      <section id="formatos" className="py-24 bg-[#F8FAFC]">
        <PageContainer variant="public">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
            <div>
              <h2 className="text-4xl lg:text-6xl font-black tracking-tighter mb-6">Formatos publicitarios disponibles</h2>
              <p className="text-lg text-texto-sec font-medium">Crea una estrategia multicanal combinando estos formatos tácticos.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setSelectedFormat('all')}
                className={`px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest transition-all ${selectedFormat === 'all' ? 'bg-rojo text-white tbs-shadow' : 'bg-white border border-borde text-gris hover:border-rojo hover:text-rojo'}`}
              >
                Todos
              </button>
              {adFormats.map(fb => (
                <button 
                  key={fb.id}
                  onClick={() => setSelectedFormat(fb.format)}
                  className={`px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest transition-all ${selectedFormat === fb.format ? 'bg-rojo text-white tbs-shadow' : 'bg-white border border-borde text-gris hover:border-rojo hover:text-rojo'}`}
                >
                  {fb.format.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredFormats.map((format, i) => (
                <motion.div 
                  key={format.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-[32px] p-8 border border-borde tbs-shadow-sm flex flex-col group hover:shadow-xl transition-all duration-300"
                >
                  <div className={`w-14 h-14 ${format.color} text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-current/20`}>
                    <Tag size={28} />
                  </div>
                  <h3 className="text-2xl font-black mb-4 group-hover:text-rojo transition-colors">{format.name}</h3>
                  <p className="text-sm text-texto-sec font-medium leading-relaxed mb-8 flex-grow">{format.desc}</p>
                  
                  <div className="space-y-4 mb-10 pt-6 border-t border-gray-50">
                    <div className="flex gap-3">
                      <div className="w-5 h-5 rounded bg-gray-50 flex items-center justify-center text-gris mt-0.5"><MapPin size={12} /></div>
                      <div>
                        <div className="text-[9px] font-black uppercase text-gris tracking-widest">Dónde aparece</div>
                        <div className="text-[11px] font-bold text-texto leading-tight">{format.placement}</div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-5 h-5 rounded bg-gray-50 flex items-center justify-center text-gris mt-0.5"><Target size={12} /></div>
                      <div>
                        <div className="text-[9px] font-black uppercase text-gris tracking-widest">Objetivo Clave</div>
                        <div className="text-[11px] font-bold text-texto leading-tight">{format.objective}</div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-5 h-5 rounded bg-gray-50 flex items-center justify-center text-gris mt-0.5"><BarChart3 size={12} /></div>
                      <div>
                        <div className="text-[9px] font-black uppercase text-gris tracking-widest">Métricas</div>
                        <div className="text-[11px] font-bold text-texto leading-tight">{format.metrics}</div>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      document.getElementById('mockups')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full py-4 bg-gray-50 text-texto rounded-2xl font-black text-xs uppercase tracking-widest group-hover:bg-rojo group-hover:text-white transition-all"
                  >
                    Ver ejemplo visual
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </PageContainer>
      </section>

      {/* Mockups Showcase */}
      <section id="mockups" className="py-24 bg-white">
        <PageContainer variant="public">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl lg:text-6xl font-black tracking-tighter mb-6">Así se ve tu marca dentro de TBS</h2>
            <p className="text-lg text-texto-sec font-medium">Integración nativa diseñada para no interrumpir el flujo de abastecimiento.</p>
          </div>

          <div className="space-y-32">
            {/* Example 1: Banners */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1">
                <div className="bg-gray-100 rounded-3xl p-4 overflow-hidden border border-borde">
                   <div className="bg-white p-6 rounded-2xl mb-4 border border-borde flex items-center justify-between">
                      <div className="flex gap-4">
                         <div className="w-8 h-8 rounded-full bg-gray-200" />
                         <div className="space-y-1.5">
                            <div className="w-24 h-3 bg-gray-100 rounded" />
                            <div className="w-16 h-2 bg-gray-50 rounded" />
                         </div>
                      </div>
                   </div>
                   <div className="space-y-6">
                      <div className="p-4 bg-white rounded-2xl border border-borde">
                        <div className="mb-4 px-2 py-1 bg-rojo text-white text-[10px] font-black w-fit rounded">BANNER EXCLUSIVO</div>
                        <SponsoredBanner 
                          campaign={campaigns.find(c => c.format === 'banner' && c.placement === 'home_hero_secondary') || campaigns[0]} 
                          onClick={() => {}}
                          compact={true}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4 pb-12">
                         <div className="h-40 bg-white rounded-2xl border border-borde" />
                         <div className="h-40 bg-white rounded-2xl border border-borde" />
                      </div>
                   </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <span className="px-3 py-1.5 bg-rojo-suave text-rojo rounded-full text-[11px] font-black uppercase tracking-widest mb-6 inline-block">Banner Home / Catálogo</span>
                <h3 className="text-3xl lg:text-5xl font-black tracking-tighter mb-6">Impacto Masivo y Lanzamientos</h3>
                <p className="text-lg text-texto-sec font-medium leading-relaxed mb-8">
                  Ideal para comunicar preventas, lanzamientos de marca o temporadas comerciales (ej: Copa América, Feria de las Flores). Aparece tanto en la home pública como en el dashboard privado del cliente.
                </p>
                <ul className="space-y-4">
                   <li className="flex gap-3 text-sm font-bold text-texto"><CheckCircle2 className="text-rojo" size={18} /> Formato 100% responsive</li>
                   <li className="flex gap-3 text-sm font-bold text-texto"><CheckCircle2 className="text-rojo" size={18} /> CTA directo a categoría o producto</li>
                   <li className="flex gap-3 text-sm font-bold text-texto"><CheckCircle2 className="text-rojo" size={18} /> Ubicación privilegiada (Above the fold)</li>
                </ul>
              </div>
            </div>

            {/* Example 2: Sponsored Products */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded-full text-[11px] font-black uppercase tracking-widest mb-6 inline-block">Producto Patrocinado</span>
                <h3 className="text-3xl lg:text-5xl font-black tracking-tighter mb-6">Visibilidad en el Momento del Pedido</h3>
                <p className="text-lg text-texto-sec font-medium leading-relaxed mb-8">
                  Tus productos aparecen con un badge de "Patrocinado" dentro de la rejilla orgánica de productos. Esto garantiza que tu SKU sea visto justo cuando el cliente está comparando opciones para su pedido mensual o urgente.
                </p>
                <ul className="space-y-4">
                   <li className="flex gap-3 text-sm font-bold text-texto"><CheckCircle2 className="text-orange-600" size={18} /> Identificación clara como patrocinado</li>
                   <li className="flex gap-3 text-sm font-bold text-texto"><CheckCircle2 className="text-orange-600" size={18} /> Impulso de rotación en categorías saturadas</li>
                   <li className="flex gap-3 text-sm font-bold text-texto"><CheckCircle2 className="text-orange-600" size={18} /> Ranking superior en términos de búsqueda</li>
                </ul>
              </div>
              <div className="bg-gray-100 rounded-[40px] p-10 border border-borde">
                 <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-2xl border border-borde h-72 flex flex-col justify-between opacity-50">
                       <div className="w-full h-32 bg-gray-50 rounded-xl mb-4" />
                       <div className="space-y-2">
                          <div className="w-24 h-4 bg-gray-100 rounded" />
                          <div className="w-12 h-3 bg-gray-50 rounded" />
                       </div>
                       <div className="w-full h-8 bg-gray-50 rounded mt-4" />
                    </div>
                    <div className="bg-white p-4 rounded-2xl border-2 border-rojo/20 h-72 flex flex-col justify-between shadow-2xl scale-105 relative">
                       <div className="flex justify-between items-center mb-2">
                          <div className="px-2 py-0.5 bg-rojo text-white text-[8px] font-black rounded uppercase tracking-widest">Patrocinado</div>
                       </div>
                       <SponsoredProductCard 
                         campaign={campaigns.find(c => c.format === 'sponsored_product') || campaigns[0]}
                         product={products[0]}
                         onClick={() => {}}
                         onAddToCart={() => {}}
                       />
                    </div>
                 </div>
              </div>
            </div>

            {/* Example 3: Cupones y Marcas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
               <div className="order-2 lg:order-1 bg-gray-50 rounded-[40px] p-10 border border-borde">
                  <div className="space-y-6">
                     <div className="bg-white rounded-2xl p-6 border border-borde shadow-lg">
                        <h4 className="text-xs font-black uppercase text-gris tracking-widest mb-4">Vitrinas Comerciales</h4>
                        <FeaturedBrandCard 
                          campaign={campaigns.find(c => c.format === 'featured_brand') || campaigns[0]}
                          onClick={() => {}}
                        />
                     </div>
                     <div className="bg-white rounded-2xl p-6 border border-borde shadow-lg">
                        <h4 className="text-xs font-black uppercase text-gris tracking-widest mb-4">Activadores de Conversión</h4>
                        <CouponStrip 
                          campaign={campaigns.find(c => c.format === 'coupon') || campaigns[0]}
                          onClick={() => {}}
                        />
                     </div>
                  </div>
               </div>
               <div className="order-1 lg:order-2">
                <span className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[11px] font-black uppercase tracking-widest mb-6 inline-block">Marca Destacada + Cupones</span>
                <h3 className="text-3xl lg:text-5xl font-black tracking-tighter mb-6">Dominio de Categoría y Fidelización</h3>
                <p className="text-lg text-texto-sec font-medium leading-relaxed mb-8">
                  Usa cupones para incentivar a clientes inactivos o vitrinas de marca para presentar nuevos lanzamientos con sus beneficios exclusivos. Estos formatos ayudan a que el cliente asocie tu marca con un beneficio comercial tangible.
                </p>
                <div className="grid grid-cols-2 gap-6">
                   <div className="p-4 bg-white rounded-2xl border border-borde">
                      <div className="text-2xl font-black text-rojo mb-1">92%</div>
                      <div className="text-[10px] font-black uppercase text-gris tracking-widest">Open Rate en Notif.</div>
                   </div>
                   <div className="p-4 bg-white rounded-2xl border border-borde">
                      <div className="text-2xl font-black text-rojo mb-1">15%</div>
                      <div className="text-[10px] font-black uppercase text-gris tracking-widest">Upselling medio</div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Placement Map */}
      <section className="py-24 bg-[#F8FAFC]">
        <PageContainer variant="public">
          <h2 className="text-4xl lg:text-5xl font-black tracking-tighter mb-12 text-center">Dónde puede aparecer tu marca</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-[32px] overflow-hidden tbs-shadow">
              <thead>
                <tr className="bg-texto text-white">
                  <th className="p-6 text-left text-sm font-black uppercase tracking-widest">Formato</th>
                  <th className="p-6 text-left text-sm font-black uppercase tracking-widest">Ubicación Principal</th>
                  <th className="p-6 text-left text-sm font-black uppercase tracking-widest">Momento de Compra</th>
                  <th className="p-6 text-left text-sm font-black uppercase tracking-widest">Objetivo Primario</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { f: 'Banner Home', u: 'Home y Dashboard Principal', m: 'Descubrimiento / Sesión inicial', o: 'Alcance / Lanzamiento' },
                  { f: 'Banner Catálogo', u: 'Cabecera de Categorías', m: 'Exploración de portafolio', o: 'Consideración por categoría' },
                  { f: 'Producto Patrocinado', u: 'Búsqueda y Rejilla de Productos', m: 'Decisión / Selección de SKU', o: 'Conversión / Market Share' },
                  { f: 'Cupón B2B', u: 'Promociones / Checkout', m: 'Cerrar el pedido', o: 'Fidelización / Recompra' },
                  { f: 'Marca Destacada', u: 'Home Sectorizada', m: 'Inspiración / Nueva Compra', o: 'Branding / Educación' },
                  { f: 'Editorial Patrocinado', u: 'Guías de Producto / Blog', m: 'Educación y Aprendizaje', o: 'Consideración Premium' }
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="p-6 text-sm font-black text-texto">{row.f}</td>
                    <td className="p-6 text-sm font-medium text-texto-sec">{row.u}</td>
                    <td className="p-6 text-sm font-medium text-texto-sec italic">{row.m}</td>
                    <td className="p-6 text-sm font-bold text-rojo uppercase tracking-tighter">{row.o}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PageContainer>
      </section>

      {/* Segmentation B2B */}
      <section className="py-24 border-b border-borde">
        <PageContainer variant="public">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl lg:text-6xl font-black tracking-tighter leading-tight mb-8 text-texto">
                Segmentación <span className="text-rojo">Lógica</span> para negocios reales.
              </h2>
              <p className="text-xl text-texto-sec leading-relaxed font-medium mb-12">
                No disparamos a ciegas. Nuestras campañas te permiten impactar solo a los negocios que realmente pueden y quieren comprar tu producto basándonos en su comportamiento real en TBS.
              </p>
              
              <div className="space-y-8">
                {[
                  { icon: Building2, label: 'Por Canal', tags: ['Bares', 'Hoteles', 'Restaurantes', 'Licoreras', 'Discotecas', 'Eventos'] },
                  { icon: MapPin, label: 'Por Ciudad', tags: ['Cartagena', 'Bogotá', 'Medellín', 'Barranquilla', 'Santa Marta', 'Nacional'] },
                  { icon: Tag, label: 'Por Categoría de Compra', tags: ['Whisky Hunters', 'Premium Lovers', 'Ginebra Trends', 'Alta Rotación'] },
                  { icon: ShieldCheck, label: 'Por Tipo de Cliente', tags: ['Crédito', 'Contado', 'Alto Volumen', 'Nuevo Cliente'] }
                ].map((seg, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-rojo shrink-0"><seg.icon size={20} /></div>
                    <div>
                      <h4 className="text-lg font-black text-texto mb-3">{seg.label}</h4>
                      <div className="flex flex-wrap gap-2">
                        {seg.tags.map(t => (
                          <span key={t} className="px-3 py-1 bg-white border border-borde rounded-md text-[10px] font-black text-gris uppercase tracking-widest">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-rojo/5 rounded-[40px] transform rotate-3"></div>
              <div className="relative bg-texto text-white p-12 rounded-[40px] shadow-2xl">
                 <h3 className="text-2xl font-black mb-8 tracking-tight">Ejemplo de Segmentación Avanzada</h3>
                 <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6">
                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
                       <span className="text-sm text-white/60 font-bold uppercase tracking-widest">Audiencia Objetivo</span>
                       <span className="text-sm font-black text-rojo">Premium Hospitality</span>
                    </div>
                    <div className="space-y-4">
                       <div className="flex items-center gap-3">
                          <CheckCircle2 size={18} className="text-rojo" />
                          <span className="text-[13px] font-medium">Solo Hoteles 4 y 5 Estrellas</span>
                       </div>
                       <div className="flex items-center gap-3">
                          <CheckCircle2 size={18} className="text-rojo" />
                          <span className="text-[13px] font-medium">Ciudad: Cartagena y Barranquilla</span>
                       </div>
                       <div className="flex items-center gap-3">
                          <CheckCircle2 size={18} className="text-rojo" />
                          <span className="text-[13px] font-medium">Clientes con Recompra de Whisky Premium</span>
                       </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-white/10">
                       <div className="text-4xl font-black tracking-tighter">8.4k <span className="text-lg font-bold text-white/40 tracking-normal">Est. Leads Impactados</span></div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Metrics Section */}
      <section className="py-24 bg-[#0F172A] text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rojo/20 filter blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2 opacity-30"></div>
        <PageContainer variant="public" className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-20">
            <div className="max-w-2xl">
              <h2 className="text-4xl lg:text-7xl font-black tracking-tighter mb-6">Métricas para marcas dominantes.</h2>
              <p className="text-xl text-white/70 font-medium">No más cajas negras. Transparencia total en el desempeño de tu inversión comercial.</p>
            </div>
            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4">
               <div className="w-12 h-12 bg-rojo text-white rounded-xl flex items-center justify-center"><ShieldCheck size={24} /></div>
               <div>
                  <div className="text-[10px] font-black uppercase text-rojo tracking-[0.2em]">Data certificada</div>
                  <div className="text-[13px] font-bold">Reportes de Venta Atribuida</div>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {mockMetrics.map((metric, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 p-10 rounded-[32px] hover:bg-white/[0.08] transition-all"
              >
                <metric.icon size={32} className="mb-6 text-rojo opacity-80" />
                <div className="text-5xl lg:text-6xl font-black tracking-tighter mb-2">{metric.value}</div>
                <div className="text-sm font-black text-white/50 uppercase tracking-widest">{metric.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="mt-20 p-12 bg-white rounded-[40px] text-texto border border-white grid grid-cols-1 lg:grid-cols-2 gap-16">
             <div>
                <h4 className="text-2xl font-black mb-6 tracking-tight">Tu reporte ejecutivo incluirá:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                   {[
                     'Impresiones por canal',
                     'CTR según ciudad',
                     'Conversion Rate (CR)',
                     'Ventas atribuidas reales',
                     'Nuevos clientes ganados',
                     'Desempeño por SKU',
                     'Reach por tipo de negocio',
                     'Costo por agregada al carrito'
                   ].map(item => (
                     <div key={item} className="flex items-center gap-3 text-sm font-bold text-texto-sec">
                        <div className="w-1.5 h-1.5 rounded-full bg-rojo" />
                        {item}
                     </div>
                   ))}
                </div>
             </div>
             <div className="bg-gray-50 rounded-3xl p-8 border border-borde">
                <div className="text-[10px] font-black uppercase text-gris tracking-widest mb-6">Dashboard Previsto</div>
                <div className="space-y-4">
                   {[
                     { label: 'Whisky Premium', reach: '85%', conv: '3.2%' },
                     { label: 'Ginebra Artesanal', reach: '62%', conv: '2.8%' },
                     { label: 'Ron Reserva', reach: '45%', conv: '1.9%' }
                   ].map((bar, i) => (
                     <div key={i}>
                        <div className="flex justify-between text-[11px] font-black mb-2">
                           <span>{bar.label}</span>
                           <span className="text-rojo">Reach: {bar.reach}</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                           <motion.div initial={{ width: 0 }} whileInView={{ width: bar.reach }} className="h-full bg-rojo" transition={{ duration: 1, delay: 0.5 }} />
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </PageContainer>
      </section>

      {/* Use Cases Section */}
      <section className="py-24 bg-white">
        <PageContainer variant="public">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl lg:text-6xl font-black tracking-tighter mb-6">Qué formato usar según tu objetivo</h2>
            <p className="text-lg text-texto-sec font-medium leading-relaxed">Estrategias recomendadas por nuestro equipo de Trade Marketing Digital.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Lanzamiento de Producto',
                formats: ['Banner home', 'Landing de campaña', 'Producto patrocinado', 'Editorial patrocinado'],
                desc: 'Maximiza el alcance and educa al cliente sobre el nuevo SKU desde el primer clic.'
              },
              {
                title: 'Aumentar Rotación',
                formats: ['Producto patrocinado', 'Cupón B2B', 'Campaña segmentada'],
                desc: 'Impulsa productos en stock con incentivos de precio y visibilidad táctica en categorías.'
              },
              {
                title: 'Ganar Visibilidad en Hoteles',
                formats: ['Marca destacada', 'Producto patrocinado', 'Segmentación por canal hotelero'],
                desc: 'Posiciona tu portafolio premium exclusivamente en el canal de hospitalidad.'
              },
              {
                title: 'Activar Recompra',
                formats: ['Cupón B2B', 'Reorden con incentivo', 'Promoción por volumen'],
                desc: 'Asegura que el cliente elija tu marca cada vez que necesite reabastecer inventario.'
              },
              {
                title: 'Educar sobre Categoría Premium',
                formats: ['Editorial patrocinado', 'Landing de campaña', 'Marca destacada'],
                desc: 'Vende valor, no solo precio, mediante narrativas y guías especializadas.'
              },
              {
                title: 'Apoyar Temporada o Evento',
                formats: ['Banner catálogo', 'Cupón', 'Campaña segmentada por fecha'],
                desc: 'Captura la demanda efímera de temporadas como Día de la Madre o fin de año.'
              }
            ].map((useCase, i) => (
              <div key={i} className="p-10 border border-borde rounded-[32px] hover:border-rojo/30 transition-all group">
                <h4 className="text-2xl font-black mb-6 group-hover:text-rojo transition-all tracking-tight">{useCase.title}</h4>
                <p className="text-sm text-texto-sec font-medium leading-relaxed mb-8">{useCase.desc}</p>
                <div className="space-y-3">
                   <div className="text-[10px] font-black uppercase text-gris tracking-widest mb-2">Formatos Recomendados</div>
                   <div className="flex flex-wrap gap-2">
                      {useCase.formats.map(f => (
                        <span key={f} className="px-3 py-1.5 bg-gray-100 rounded-lg text-[10px] font-black text-texto uppercase tracking-tighter">{f}</span>
                      ))}
                   </div>
                </div>
              </div>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* Request Flow */}
      <section className="py-24 bg-[#F8FAFC] border-y border-borde">
        <PageContainer variant="public">
          <h2 className="text-4xl lg:text-5xl font-black tracking-tighter mb-20 text-center">Cómo solicitar una pauta</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
            {requestFlow.map((flow, i) => (
              <div key={i} className="relative group">
                <div className="flex gap-6">
                  <div className="shrink-0 w-16 h-16 bg-white border border-borde rounded-2xl flex items-center justify-center text-rojo group-hover:bg-rojo group-hover:text-white transition-all transform group-hover:-rotate-3 shadow-sm">
                    <flow.icon size={28} />
                  </div>
                  <div>
                    <div className="text-[11px] font-black text-rojo uppercase tracking-[0.2em] mb-2">Paso {flow.step}</div>
                    <h4 className="text-xl font-black text-texto mb-3">{flow.title}</h4>
                    <p className="text-sm text-texto-sec font-medium leading-relaxed">{flow.desc}</p>
                  </div>
                </div>
                {i < 5 && ( flow.step < 3 || (flow.step > 3 && flow.step < 6) ) && (
                  <div className="hidden lg:block absolute top-8 -right-8 w-16 h-px bg-gray-200" />
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-20 flex justify-center">
            <button 
              onClick={() => setIsRequestModalOpen(true)}
              className="px-14 py-7 bg-rojo text-white rounded-2xl font-black text-xl hover:scale-105 transition-all cursor-pointer shadow-2xl flex items-center gap-3"
            >
              Comenzar solicitud ahora <ArrowRight size={24} />
            </button>
          </div>
        </PageContainer>
      </section>

      {/* Transparency block */}
      <section className="py-24 bg-white">
        <PageContainer variant="public">
           <div className="max-w-4xl mx-auto p-12 bg-white rounded-[40px] border-2 border-dashed border-borde text-center">
              <div className="w-16 h-16 bg-texto text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                 <ShieldCheck size={32} />
              </div>
              <h3 className="text-3xl font-black mb-6 tracking-tight">Transparencia Comercial</h3>
              <p className="text-xl text-texto-sec leading-relaxed font-medium mb-10">
                Nos importa la confianza del cliente comprador. Todos los productos y contenidos patrocinados en TBS se identifican claramente con la etiqueta <span className="px-2 py-0.5 bg-rojo text-white text-[10px] font-black rounded uppercase">Patrocinado</span>. Las recomendaciones orgánicas de TBS se presentan como sugerencias comerciales curadas y no se mezclan con pauta pagada sin marcar.
              </p>
              <div className="inline-flex items-center gap-2 text-sm font-black text-rojo uppercase tracking-widest cursor-pointer hover:underline">
                 Ver política de transparencia de retail media <ArrowRight size={16} />
              </div>
           </div>
        </PageContainer>
      </section>

      {/* FAQ Preview */}
      <section className="py-24 bg-[#F8FAFC]">
        <PageContainer variant="public">
          <div className="flex flex-col lg:flex-row gap-20">
            <div className="lg:w-1/3">
              <h3 className="text-4xl font-black tracking-tighter mb-6">Preguntas Frecuentes</h3>
              <p className="text-lg text-texto-sec font-medium mb-10">Resolvemos tus dudas sobre inversión, materiales y resultados.</p>
              <button 
                onClick={() => onGoAdvisorChat('activacion')}
                className="w-full py-5 bg-white border border-borde rounded-2xl font-black text-xs uppercase tracking-widest hover:border-rojo hover:text-rojo transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare size={16} /> Hablar con un experto
              </button>
            </div>
            <div className="lg:w-2/3 space-y-4">
              {[
                { q: '¿Cuánto es la inversión mínima?', a: 'La inversión mínima varía según el formato. Los productos patrocinados pueden activarse desde presupuestos tácticos semanales, mientras que los banners de home suelen requerir compromisos por campaña.' },
                { q: '¿Quién diseña los artes?', a: 'El proveedor debe entregar los artes según las especificaciones técnicas que enviamos. Sin embargo, ofrecemos servicios de diseño y copywriting publicitario como opcional si lo requieres.' },
                { q: '¿En cuánto tiempo sale en vivo mi campaña?', a: 'Una vez aprobados los artes y el compromiso comercial, la campaña puede estar activa en un plazo de 48 a 72 horas hábiles.' },
                { q: '¿Puedo segmentar solo para clientes de contado?', a: 'Sí. Nuestra segmentación permite filtrar por condición comercial, canal de venta (bares, licoreras, etc.) y ubicación geográfica específica.' },
                { q: '¿Cómo recibo los reportes?', a: 'Al finalizar la campaña (o semanalmente en campañas largas) recibes un PDF ejecutivo y acceso a un dashboard temporal con el performance detallado.' }
              ].map((faq, i) => (
                <div key={i} className="p-8 bg-white rounded-3xl border border-borde group cursor-pointer">
                   <div className="flex items-center justify-between pointer-events-none">
                      <h4 className="text-lg font-black text-texto">{faq.q}</h4>
                      <ChevronDown size={20} className="text-gris group-hover:text-rojo transition-colors" />
                   </div>
                   <p className="mt-4 text-sm text-texto-sec font-medium leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Final CTA Footer */}
      <section className="py-32 bg-rojo text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-rojo opacity-10 pointer-events-none">
           <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.2)_0%,transparent_70%)]" />
        </div>
        <PageContainer variant="public" className="relative z-10 text-center">
          <h2 className="text-5xl lg:text-8xl font-black tracking-tighter mb-10 leading-tight">Domina el canal profesional con TBS.</h2>
          <p className="text-xl lg:text-2xl text-white/80 font-medium mb-12 capitalize-none">
            Empieza hoy a impactar a miles de negocios listos para comprar. Visibilidad, datos y resultados en una sola plataforma.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <button 
              onClick={() => setIsRequestModalOpen(true)}
              className="px-14 py-7 bg-white text-rojo rounded-2xl font-black text-xl hover:scale-105 transition-all cursor-pointer shadow-2xl flex items-center gap-3"
            >
              Solicitar pauta ahora <ArrowRight size={24} />
            </button>
            <button 
              onClick={() => onGoAdvisorChat('activacion')}
              className="px-14 py-7 border-2 border-white/30 text-white rounded-2xl font-black text-xl hover:bg-white/10 transition-all cursor-pointer flex items-center gap-3"
            >
              <MessageSquare size={24} /> Contactar ventas
            </button>
          </div>
        </PageContainer>
      </section>

      {/* Ad Request Modal */}
      <AnimatePresence>
        {isRequestModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsRequestModalOpen(false)}
              className="absolute inset-0 bg-texto/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row h-full max-h-[800px]"
            >
              {/* Sidebar branding */}
              <div className="md:w-1/3 bg-rojo p-10 text-white flex flex-col justify-between overflow-hidden relative">
                 <div className="absolute top-0 left-0 p-12 opacity-10">
                    <Zap size={240} />
                 </div>
                 <div className="relative z-10">
                    <div className="text-5xl font-black tracking-tighter mb-8">TBS<br/>Advertising</div>
                    <h3 className="text-2xl font-black tracking-tight mb-6">Propuesta de visibilidad personalizada</h3>
                    <p className="text-white/70 font-medium leading-relaxed">
                       Completa los datos de tu marca y nuestro equipo comercial te enviará una propuesta de pauta en menos de 24 horas.
                    </p>
                 </div>
                 <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-3 text-sm font-bold"><CheckCircle2 size={16} /> Retail Media B2B</div>
                    <div className="flex items-center gap-3 text-sm font-bold"><CheckCircle2 size={16} /> Data de venta real</div>
                    <div className="flex items-center gap-3 text-sm font-bold"><CheckCircle2 size={16} /> Segmentación táctica</div>
                 </div>
              </div>

              {/* Form area */}
              <div className="flex-1 p-10 overflow-y-auto bg-gray-50">
                 <div className="flex justify-end mb-4">
                    <button onClick={() => setIsRequestModalOpen(false)} className="w-10 h-10 bg-white border border-borde rounded-full flex items-center justify-center hover:bg-gray-100 transition-all cursor-pointer">
                       <ZapOff size={18} className="text-gris" />
                    </button>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                       <label className="block text-[10px] font-black uppercase text-gris tracking-widest">Nombre de la Marca</label>
                       <input type="text" placeholder="Ej: Diageo, Pernod Ricard..." className="w-full h-12 px-4 rounded-xl border border-borde outline-none focus:border-rojo bg-white font-bold text-sm" />
                    </div>
                    <div className="space-y-4">
                       <label className="block text-[10px] font-black uppercase text-gris tracking-widest">Tu Nombre y Cargo</label>
                       <input type="text" placeholder="Ej: Laura Pérez - Trade Marketing" className="w-full h-12 px-4 rounded-xl border border-borde outline-none focus:border-rojo bg-white font-bold text-sm" />
                    </div>
                    <div className="space-y-4">
                       <label className="block text-[10px] font-black uppercase text-gris tracking-widest">Formato de Interés</label>
                       <select className="w-full h-12 px-4 rounded-xl border border-borde outline-none focus:border-rojo bg-white font-bold text-sm">
                          <option>Banner Home / Catálogo</option>
                          <option>Producto Patrocinado</option>
                          <option>Cupón B2B</option>
                          <option>Marca Destacada</option>
                          <option>Campaña Multicanal</option>
                       </select>
                    </div>
                     <div className="space-y-4">
                       <label className="block text-[10px] font-black uppercase text-gris tracking-widest">Presupuesto Estimado</label>
                       <select className="w-full h-12 px-4 rounded-xl border border-borde outline-none focus:border-rojo bg-white font-bold text-sm">
                          <option>Inicial ($1M - $5M)</option>
                          <option>Medio ($5M - $15M)</option>
                          <option>Plus ($15M - $50M)</option>
                          <option>Enterprise (+$50M)</option>
                       </select>
                    </div>
                    <div className="md:col-span-2 space-y-4">
                       <label className="block text-[10px] font-black uppercase text-gris tracking-widest">Objetivo de la Campaña</label>
                       <div className="flex flex-wrap gap-2">
                          {['Lanzamiento', 'Rotación', 'Branding', 'Canal HORECA', 'Temporada'].map(obj => (
                            <button key={obj} className="px-4 py-2 bg-white border border-borde rounded-lg text-xs font-bold hover:bg-rojo-suave hover:border-rojo transition-all">{obj}</button>
                          ))}
                       </div>
                    </div>
                    <div className="md:col-span-2 space-y-4">
                       <label className="block text-[10px] font-black uppercase text-gris tracking-widest">Comentarios adicionales</label>
                       <textarea placeholder="Cuéntanos más sobre tus necesidades..." className="w-full h-32 px-4 py-3 rounded-xl border border-borde outline-none focus:border-rojo bg-white font-bold text-sm resize-none"></textarea>
                    </div>
                 </div>

                 <div className="mt-10 p-6 bg-white border border-borde rounded-3xl">
                    <div className="flex items-center gap-4 mb-6">
                       <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><CheckCircle2 size={20} /></div>
                       <p className="text-xs font-bold text-texto-sec leading-snug">
                          Al enviar esta solicitud, tu ejecutivo de cuenta TBS recibirá una notificación y preparará una disponibilidad de inventario para tus marcas.
                       </p>
                    </div>
                    <button className="w-full py-5 bg-rojo text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-rojo-oscuro hover:scale-[1.01] transition-all shadow-xl">
                       Enviar Solicitud de Pauta
                    </button>
                    <button onClick={() => setIsRequestModalOpen(false)} className="w-full mt-4 py-3 text-gris hover:text-rojo font-black text-[10px] uppercase tracking-[0.2em] transition-all">
                       Cancelar
                    </button>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
