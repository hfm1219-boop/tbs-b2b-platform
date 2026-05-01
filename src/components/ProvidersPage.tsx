import { motion } from 'motion/react';
import { 
  ArrowLeft, ArrowRight, BarChart3, Globe, LineChart, ShieldCheck, 
  Store, Truck, Zap, CheckCircle2, MessageSquare
} from 'lucide-react';

interface ProvidersPageProps {
  onBack: () => void;
  onRequestAccess: () => void;
  onLogin: () => void;
}

export function ProvidersPage({ onBack, onRequestAccess, onLogin }: ProvidersPageProps) {
  const models = [
    { title: 'Compra directa', desc: 'TBS compra tu inventario y gestiona la venta y distribución 100%.' },
    { title: 'Consignación', desc: 'Pagamos lo vendido. Tú mantienes la propiedad hasta la transacción final.' },
    { title: 'Marketplace', desc: 'Publica tu stock, nosotros habilitamos el portal y la pasarela de pagos.' },
    { title: 'Despacho directo', desc: 'Tú entregas, nosotros gestionamos la venta y el recaudo B2B.' }
  ];

  const services = [
    { icon: Globe, title: 'Publicación de portafolio', desc: 'Tus productos visibles ante miles de compradores profesionales.' },
    { icon: Truck, title: 'Logística', desc: 'Acceso a rutas compartidas y entregas de última milla eficientes.' },
    { icon: BarChart3, title: 'Reportes', desc: 'Inteligencia de mercado, precios dinámicos y sell-out en tiempo real.' },
    { icon: Zap, title: 'Activaciones', desc: 'Ejecución de marca en el punto de consumo gestionada por expertos.' },
    { icon: ShieldCheck, title: 'Garantía de pago', desc: 'TBS asume el riesgo crediticio del cliente final en modelos seleccionados.' },
    { icon: LineChart, title: 'Visibilidad comercial', desc: 'Posicionamiento privilegiado en el catálogo y comunicaciones.' }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-texto">
      {/* Hero */}
      <section className="relative py-20 lg:py-32 overflow-hidden border-b border-borde bg-[#F8FAFC]">
        <div className="max-w-[1480px] mx-auto px-8">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 mb-12 text-[13px] font-black uppercase tracking-widest text-gris hover:text-rojo transition-colors outline-none cursor-pointer"
          >
            <ArrowLeft size={18} /> Volver
          </button>

          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[#334155] text-[11px] font-black uppercase tracking-[0.2em] mb-4"
            >
              Crecimiento para Marcas
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl lg:text-8xl font-black tracking-tighter leading-[0.85] mb-8"
            >
              Escala tu distribución con el aliado experto en <span className="text-rojo">B2B.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl lg:text-2xl text-texto-sec font-medium leading-relaxed max-w-2xl"
            >
              Conectamos a fabricantes, importadores y marcas con el ecosistema de consumo más grande de la región.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-12"
            >
              <button 
                onClick={onRequestAccess}
                className="px-10 py-6 bg-texto text-white rounded-xl font-black text-xl transition-all flex items-center gap-3 cursor-pointer hover:bg-rojo hover:scale-[1.02] shadow-xl"
              >
                Quiero vender con TBS <ArrowRight size={22} />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Models */}
      <section className="py-24 border-b border-borde relative overflow-hidden">
        <div className="max-w-[1480px] mx-auto px-8">
          <div className="mb-20">
            <h2 className="text-4xl lg:text-6xl font-black tracking-tighter leading-tight mb-6">Modelos de colaboración flexibles.</h2>
            <p className="text-lg text-texto-sec font-medium max-w-2xl">Nos adaptamos a tu estructura logística y financiera para facilitar tu entrada al canal B2B.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {models.map((model, i) => (
              <div key={i} className="p-10 border border-borde rounded-3xl hover:bg-rojo-suave/30 transition-all border-dashed">
                <h3 className="text-2xl font-black mb-4">{model.title}</h3>
                <p className="text-texto-sec font-medium leading-relaxed">{model.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 bg-white border-b border-borde">
        <div className="max-w-[1480px] mx-auto px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl lg:text-6xl font-black tracking-tighter mb-6">Mucho más que ventas: Valor para tu marca</h2>
            <p className="text-lg text-texto-sec font-medium">Ofrecemos un ecosistema de servicios diseñados para que tu marca destaque y crezca de forma sostenible.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
            {services.map((svc, i) => (
              <div key={i} className="flex gap-8 group">
                <div className="shrink-0 w-14 h-14 bg-gray-50 border border-borde rounded-2xl flex items-center justify-center group-hover:bg-rojo group-hover:text-white transition-all transform group-hover:-rotate-6">
                  <svc.icon size={28} />
                </div>
                <div>
                  <h4 className="text-2xl font-black mb-3">{svc.title}</h4>
                  <p className="text-texto-sec font-medium leading-relaxed text-lg">{svc.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why TBS */}
      <section className="py-24 bg-[#0F172A] text-white">
        <div className="max-w-[1480px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative aspect-square">
            <img 
              src="https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=1000" 
              alt="Logistics" 
              className="w-full h-full object-cover rounded-3xl opacity-60"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent"></div>
          </div>
          <div>
            <h2 className="text-4xl lg:text-7xl font-black tracking-tighter leading-tight mb-10">¿Por qué vender con TBS?</h2>
            <div className="space-y-10">
              {[
                { title: 'Control de precios', desc: 'Mantén la consistencia de tu marca con nuestras herramientas de control dinámico.' },
                { title: 'Acceso a datos', desc: 'No más adivinanzas. Conoce quién compra tu marca, dónde y cuánto.' },
                { title: 'Logística integrada', desc: 'Optimiza tus entregas utilizando nuestra infraestructura de última milla.' },
                { title: 'Crecimiento geográfico', desc: 'Expande tu presencia a nuevas regiones sin necesidad de estructura propia.' }
              ].map((item, i) => (
                <div key={i} className="flex gap-6">
                  <div className="w-8 h-8 bg-rojo rounded-full flex items-center justify-center shrink-0 mt-1">
                    <CheckCircle2 size={18} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black mb-2">{item.title}</h4>
                    <p className="text-white/70 font-medium text-lg leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 relative text-center">
        <div className="absolute inset-0 bg-rojo-suave opacity-10 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-8 relative z-10">
          <h2 className="text-5xl lg:text-8xl font-black tracking-tighter mb-10">Hagamos crecer tu marca juntos.</h2>
          <p className="text-xl lg:text-2xl text-texto-sec font-medium mb-12">Agenda una reunión comercial hoy y descubre cómo TBS puede potenciar tu canal B2B.</p>
          <div className="flex flex-wrap justify-center gap-6">
            <button 
              onClick={onRequestAccess}
              className="px-14 py-7 bg-rojo text-white rounded-2xl font-black text-xl hover:scale-105 transition-all cursor-pointer shadow-2xl flex items-center gap-3"
            >
              Comenzar ahora <ArrowRight size={24} />
            </button>
            <button 
              className="px-14 py-7 border-2 border-borde text-texto rounded-2xl font-black text-xl hover:bg-gray-50 transition-all cursor-pointer flex items-center gap-3"
            >
              <MessageSquare size={24} /> Contactar ventas
            </button>
          </div>
        </div>
      </section>
      
      <footer className="py-12 border-t border-borde text-center">
        <p className="text-[13px] font-black uppercase tracking-widest text-gris">TBS Supply Chain · Operador Logístico Especializado · 2024</p>
      </footer>
    </div>
  );
}
