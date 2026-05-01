import { motion } from 'motion/react';
import { 
  ArrowLeft, ArrowRight, Building2, Utensils, Store, Music, Package, 
  Truck, CheckCircle2, ChevronRight, BarChart3, CreditCard, Zap, Headset
} from 'lucide-react';

interface ClientsPageProps {
  onBack: () => void;
  onGoToCatalog: () => void;
  onRequestAccess: () => void;
  onLogin: () => void;
  onGoAdvisorChat: () => void;
}

export function ClientsPage({ onBack, onGoToCatalog, onRequestAccess, onLogin, onGoAdvisorChat }: ClientsPageProps) {
  const segments = [
    { 
      icon: Utensils, 
      title: 'Bares y Restaurantes', 
      desc: 'Abastecimiento recurrente, pedidos urgentes, soporte en carta y activaciones de marca.' 
    },
    { 
      icon: Building2, 
      title: 'Hoteles y Clubes', 
      desc: 'Portafolio confiable, entregas programadas, cupos de crédito y trazabilidad completa.' 
    },
    { 
      icon: Store, 
      title: 'Licoreras y Súper', 
      desc: 'Compra por volumen, promociones exclusivas, disponibilidad constante y seguimiento comercial.' 
    },
    { 
      icon: Music, 
      title: 'Discotecas y Eventos', 
      desc: 'Productos de alta rotación, respuesta rápida en temporadas pico y soporte logístico especializado.' 
    },
    { 
      icon: Truck, 
      title: 'Canal Especializado', 
      desc: 'Soluciones para distribuidores y tiendas premium con operaciones de alta frecuencia.' 
    },
    { 
      icon: Package, 
      title: 'Marcas y Maridaje', 
      desc: 'Ecosistema para marcas que buscan ejecución impecable en el punto de consumo.' 
    }
  ];

  const capabilities = [
    { icon: Package, title: 'Comprar catálogo B2B', desc: 'Acceso a inventario real de marcas líderes.' },
    { icon: Zap, title: 'Reordenar pedidos', desc: 'Repite tus compras más frecuentes en segundos.' },
    { icon: BarChart3, title: 'Precios personalizados', desc: 'Tarifas dinámicas según tu perfil y volumen.' },
    { icon: CreditCard, title: 'Consultar cartera', desc: 'Control total de tus facturas y cupos.' },
    { icon: Truck, title: 'Hacer seguimiento', desc: 'Trazabilidad en tiempo real de tus despachos.' },
    { icon: Headset, title: 'Hablar con asesor', desc: 'Acompañamiento comercial experto dedicado.' }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-texto">
      {/* Hero */}
      <section className="relative py-20 lg:py-32 overflow-hidden border-b border-borde bg-rojo-suave/30">
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
              className="text-rojo text-[11px] font-black uppercase tracking-[0.2em] mb-4"
            >
              Soluciones para Negocios
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl lg:text-8xl font-black tracking-tighter leading-[0.85] mb-8"
            >
              Impulsa la operación de tu negocio <span className="text-rojo">B2B.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl lg:text-2xl text-texto-sec font-medium leading-relaxed max-w-2xl"
            >
              Centraliza el abastecimiento de licores, accede a crédito y gestiona tus pedidos con la tecnología de TBS.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-12 flex flex-wrap gap-4"
            >
              <button 
                onClick={onRequestAccess}
                className="px-8 py-5 bg-rojo text-white rounded-xl font-black text-lg transition-all flex items-center gap-3 cursor-pointer hover:bg-rojo-oscuro hover:scale-[1.02]"
              >
                Solicitar Acceso <ArrowRight size={20} />
              </button>
              <button 
                onClick={onGoToCatalog}
                className="px-8 py-5 border-2 border-borde text-texto rounded-xl font-black text-lg transition-all hover:bg-white cursor-pointer"
              >
                Explorar Catálogo
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Segments */}
      <section className="py-24 border-b border-borde">
        <div className="max-w-[1480px] mx-auto px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-20">
            <div className="max-w-2xl">
              <h2 className="text-4xl lg:text-6xl font-black tracking-tighter leading-tight mb-6">Para cada tipo de negocio, una solución TBS.</h2>
              <p className="text-lg text-texto-sec font-medium">Entendemos que un bar no opera igual que un supermercado. Por eso, adaptamos nuestras herramientas a tu flujo de trabajo.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {segments.map((seg, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="p-10 bg-white border border-borde rounded-3xl hover:border-rojo hover:shadow-2xl transition-all group"
              >
                <div className="w-16 h-16 bg-rojo-suave rounded-2xl flex items-center justify-center mb-8 group-hover:bg-rojo group-hover:text-white transition-colors">
                  <seg.icon size={32} />
                </div>
                <h3 className="text-2xl font-black mb-4">{seg.title}</h3>
                <p className="text-texto-sec font-medium leading-relaxed">{seg.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-24 bg-gray-50 border-b border-borde">
        <div className="max-w-[1480px] mx-auto px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl lg:text-6xl font-black tracking-tighter mb-6">Todo lo que puedes hacer en la plataforma</h2>
            <p className="text-lg text-texto-sec font-medium">TBS centraliza tu operación para que tengas el control total desde cualquier dispositivo.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {capabilities.map((cap, i) => (
              <div key={i} className="flex gap-6 p-6">
                <div className="shrink-0 w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center border border-borde">
                  <cap.icon size={24} className="text-rojo" />
                </div>
                <div>
                  <h4 className="text-xl font-black mb-2">{cap.title}</h4>
                  <p className="text-texto-sec font-medium leading-relaxed">{cap.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24">
        <div className="max-w-[1480px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl lg:text-6xl font-black tracking-tighter leading-tight mb-10">Beneficios reales para tu rentabilidad.</h2>
            <div className="space-y-8">
              {[
                { title: 'Menos fricción', desc: 'Gestiona múltiples proveedores en un solo pedido y una sola factura.' },
                { title: 'Más control', desc: 'Visibilidad total de tu cartera, pagos y presupuesto de compras.' },
                { title: 'Mejor disponibilidad', desc: 'Inventario real garantizado para que nunca te quedes sin stock.' },
                { title: 'Crédito centralizado', desc: 'Cupos asignados según tu historial para financiar tu crecimiento.' },
                { title: 'Soporte experto', desc: 'Equipo comercial siempre listo para apoyarte en activaciones y ventas.' }
              ].map((benefit, i) => (
                <div key={i} className="flex gap-5">
                  <CheckCircle2 size={28} className="text-rojo shrink-0 mt-1" />
                  <div>
                    <h4 className="text-xl font-black mb-1">{benefit.title}</h4>
                    <p className="text-texto-sec font-medium">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-10 bg-rojo-suave rounded-full blur-[120px] -z-10 opacity-60"></div>
            <img 
              src="https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&q=80&w=1000" 
              alt="TBS Operation" 
              className="rounded-3xl shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-rojo text-white">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-4xl lg:text-7xl font-black tracking-tighter leading-tight mb-8">¿Listo para transformar tu abastecimiento?</h2>
          <p className="text-xl lg:text-2xl text-white/80 font-medium mb-12">Únete a cientos de negocios que ya operan con TBS y ahorra tiempo y dinero en cada pedido.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={onRequestAccess}
              className="px-12 py-6 bg-white text-rojo rounded-2xl font-black text-xl hover:scale-105 transition-all cursor-pointer shadow-2xl"
            >
              Solicitar Acceso
            </button>
            <button 
              onClick={onGoAdvisorChat}
              className="px-12 py-6 border-2 border-white/30 text-white rounded-2xl font-black text-xl hover:bg-white/10 transition-all cursor-pointer"
            >
              Hablemos ahora
            </button>
          </div>
        </div>
      </section>
      
      <footer className="py-12 border-t border-borde text-center">
        <p className="text-[13px] font-black uppercase tracking-widest text-gris">TBS Destilados · Plataforma B2B para Negocios · 2024</p>
      </footer>
    </div>
  );
}
