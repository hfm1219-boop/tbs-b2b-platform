import { motion } from 'motion/react';
import { 
  ArrowLeft, ArrowRight, Truck, Zap, CreditCard, Repeat, BarChart3, 
  Headset, MessageSquare, ShieldCheck, ShoppingBag
} from 'lucide-react';
import { Breadcrumbs } from './Breadcrumbs';

interface ServicesPageProps {
  onBack: () => void;
  onRequestAccess: () => void;
  onGoToCatalog: () => void;
  onLogin: () => void;
  onGoAdvisorChat: () => void;
  onGoPage: (page: string) => void;
}

export function ServicesPage({ onBack, onRequestAccess, onGoToCatalog, onLogin, onGoAdvisorChat, onGoPage }: ServicesPageProps) {
  const allServices = [
    {
      category: 'Operación Comercial',
      items: [
        { icon: ShoppingBag, title: 'Abastecimiento B2B', desc: 'Acceso a un catálogo unificado de licores con inventario real y precios competitivos.' },
        { icon: BarChart3, title: 'Precios dinámicos', desc: 'Algoritmos que ajustan tarifas según tu volumen, historial y promociones de marca.' },
        { icon: Zap, title: 'Activaciones comerciales', desc: 'Impulsa tus ventas con apoyo de marca directamente en tu negocio.' }
      ]
    },
    {
      category: 'Logística y Entrega',
      items: [
        { icon: Truck, title: 'Entregas y distribución', desc: 'Rutas optimizadas para asegurar que tus pedidos lleguen siempre a tiempo y en perfecto estado.' },
        { icon: Zap, title: 'Pedido Urgente', desc: 'Servicio express para quiebres de stock en temporadas de alta demanda (disponible segun zona).' },
        { icon: ShieldCheck, title: 'Control de calidad', desc: 'Trazabilidad total para garantizar la originalidad y procedencia de cada botella.' }
      ]
    },
    {
      category: 'Finanzas y Tecnología',
      items: [
        { icon: CreditCard, title: 'Crédito B2B', desc: 'Soluciones de financiamiento flexible diseñadas para el flujo de caja de tu negocio.' },
        { icon: Repeat, title: 'Pedidos recurrentes', desc: 'Automatiza tus compras más frecuentes y olvídate de los quiebres de stock.' },
        { icon: BarChart3, title: 'Inteligencia comercial', desc: 'Tableros de control con tus estadísticas de compra y sugerencias inteligentes.' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-texto">
      {/* Hero */}
      <section className="relative pt-10 pb-20 lg:pt-10 lg:pb-32 overflow-hidden border-b border-borde bg-[#111827] text-white">
        <div className="max-w-[1480px] mx-auto px-8">
          <Breadcrumbs 
            onHomeClick={onBack}
            items={[{ label: 'Servicios TBS', current: true }]}
          />

          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-rojo text-[11px] font-black uppercase tracking-[0.2em] mb-4"
            >
              Potencia tu Negocio
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl lg:text-8xl font-black tracking-tighter leading-[0.85] mb-8"
            >
              Servicios TBS
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl lg:text-2xl text-white/60 font-medium leading-relaxed max-w-2xl"
            >
              De logística avanzada hasta crédito flexible a nivel nacional, TBS te ofrece todo lo que necesitas para operar tu negocio de licores sin fricciones.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24">
        <div className="max-w-[1480px] mx-auto px-8">
          {allServices.map((cat, groupIdx) => (
            <div key={groupIdx} className="mb-24 last:mb-0">
              <h2 className="text-3xl lg:text-5xl font-black tracking-tighter mb-12 flex items-center gap-4">
                <span className="w-12 h-1 px-0 bg-rojo block"></span>
                {cat.category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {cat.items.map((item, itemIdx) => (
                  <motion.div 
                    key={itemIdx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="p-10 border border-borde rounded-3xl group hover:bg-black hover:text-white transition-all duration-500"
                  >
                    <div className="w-16 h-16 bg-rojo-suave rounded-2xl flex items-center justify-center mb-10 group-hover:bg-rojo transition-colors group-hover:scale-110 duration-500">
                      <item.icon size={32} className="text-rojo group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-2xl font-black mb-4">{item.title}</h3>
                    <p className="text-texto-sec group-hover:text-white/70 font-medium leading-relaxed text-lg">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Specialty Services */}
      <section className="py-24 bg-rojo text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[600px] h-full bg-black/10 origin-bottom-left -skew-x-[20deg]"></div>
        <div className="max-w-[1480px] mx-auto px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl lg:text-7xl font-black tracking-tighter leading-tight mb-8">Soporte experto siempre contigo.</h2>
            <p className="text-xl lg:text-2xl text-white/80 font-medium mb-12">No eres un número de pedido más. Tienes un gestor comercial dedicado que conoce tu negocio y te ayuda a crecer.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              <div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                  <Headset size={28} />
                </div>
                <h4 className="text-xl font-black mb-2">Asesoría dedicada</h4>
                <p className="text-white/60 font-medium">Acompañamiento en cada compra y gestión de incidencias.</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                  <MessageSquare size={28} />
                </div>
                <h4 className="text-xl font-black mb-2">Canal directo</h4>
                <p className="text-white/60 font-medium">Comunicación inmediata vía WhatsApp para pedidos urgentes.</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 p-10 backdrop-blur-md rounded-3xl border border-white/20">
            <h3 className="text-3xl font-black mb-8">Solicitar este servicio</h3>
            <div className="space-y-6">
              {[
                { label: 'Servicio de interés', placeholder: 'Ej: Pedido Urgente, Crédito B2B' },
                { label: 'Nombre de tu negocio', placeholder: 'Como aparece en el RUT' },
                { label: 'Celular de contacto', placeholder: 'Tu WhatsApp' }
              ].map((field, i) => (
                <div key={i}>
                  <label className="block text-[11px] font-black uppercase tracking-widest mb-2 opacity-60">{field.label}</label>
                  <input type="text" placeholder={field.placeholder} className="w-full bg-white/5 border border-white/20 rounded-xl px-5 py-4 font-medium outline-none focus:border-white transition-colors" />
                </div>
              ))}
              <button onClick={onRequestAccess} className="w-full py-5 bg-white text-rojo rounded-xl font-black text-lg hover:scale-[1.02] transition-all cursor-pointer">Enviar Solicitud</button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 text-center">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-4xl lg:text-7xl font-black tracking-tighter leading-tight mb-8">Impulsa tu negocio con tecnología B2B.</h2>
          <div className="flex flex-wrap justify-center gap-6">
            <button 
              onClick={onGoToCatalog}
              className="px-12 py-6 bg-texto text-white rounded-2xl font-black text-xl hover:scale-105 transition-all cursor-pointer shadow-2xl flex items-center gap-3"
            >
              Ir al Catálogo <ArrowRight size={24} />
            </button>
            <button 
              onClick={onGoAdvisorChat}
              className="px-12 py-6 border-2 border-borde text-texto rounded-2xl font-black text-xl hover:bg-gray-50 transition-all cursor-pointer"
            >
              Hablemos ahora
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
