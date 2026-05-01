import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Truck, CreditCard, Headset, Shield, BarChart3, Zap, Building2, Package, Users } from 'lucide-react';

interface AboutPageProps {
  onBack: () => void;
  onGoToCatalog: () => void;
  onGoAdvisorChat: () => void;
}

export function AboutPage({ onBack, onGoToCatalog, onGoAdvisorChat }: AboutPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden border-b border-borde">
        <div className="absolute inset-0 bg-rojo-suave/30 -z-10">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-rojo/5 to-transparent"></div>
        </div>
        
        <div className="max-w-[1480px] mx-auto px-8">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 mb-12 text-sm font-extrabold text-gris hover:text-rojo cursor-pointer transition-colors outline-none"
          >
            <ArrowLeft size={18} /> Volver al inicio
          </button>

          <div className="max-w-3xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-rojo text-sm font-black uppercase tracking-[0.2em] mb-4"
            >
              Nuestra Propuesta
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl lg:text-[88px] font-black tracking-tighter leading-[0.85] mb-8"
            >
              Mucho más que una tienda de licores.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-texto-sec font-semibold leading-relaxed"
            >
              TBS es una plataforma B2B diseñada para negocios que venden, sirven o distribuyen licores. 
              Ayudamos a bares, restaurantes y hoteles a comprar mejor, operar con más control y crecer con el respaldo de un equipo comercial experto.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-12 flex flex-wrap gap-4"
            >
              <button 
                onClick={onGoToCatalog}
                className="px-8 py-4 bg-rojo text-white rounded-xl font-black text-lg tbs-shadow hover:bg-rojo-oscuro hover:scale-[1.02] transition-all flex items-center gap-3 cursor-pointer"
              >
                Explorar Catálogo <ArrowRight size={20} />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Concept Section */}
      <section className="py-24 border-b border-borde">
        <div className="max-w-[1480px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative group">
            <div className="absolute -inset-4 bg-rojo/5 rounded-3xl -rotate-2 group-hover:rotate-0 transition-transform duration-500"></div>
            <img 
              src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800" 
              alt="Operación Logística" 
              className="relative w-full rounded-2xl shadow-2xl z-10 grayscale hover:grayscale-0 transition-all duration-700"
              referrerPolicy="no-referrer"
            />
          </div>
          
          <div>
            <h2 className="text-4xl font-black tracking-tight mb-8">Centralizamos tu abastecimiento en un solo canal.</h2>
            <p className="text-lg text-texto-sec font-medium leading-relaxed mb-10">
              Conectamos catálogo, precios personalizados, crédito, pagos, pedidos recurrentes, trazabilidad logística y soporte comercial experto en un solo lugar. 
              TBS centraliza el abastecimiento B2B para que tu negocio tenga acceso a productos, marcas y condiciones comerciales desde un mismo canal.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-rojo-suave rounded-xl flex items-center justify-center shrink-0">
                  <Shield size={24} className="text-rojo" />
                </div>
                <div>
                  <h4 className="font-black text-texto mb-1">Confianza Total</h4>
                  <p className="text-sm text-gris font-semibold">Transacciones seguras y protección de datos en cada compra.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-rojo-suave rounded-xl flex items-center justify-center shrink-0">
                  <Zap size={24} className="text-rojo" />
                </div>
                <div>
                  <h4 className="font-black text-texto mb-1">Respuesta Rápida</h4>
                  <p className="text-sm text-gris font-semibold">Soporte inmediato para tus urgencias operativas.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-[1480px] mx-auto px-8">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-4xl font-black tracking-tight mb-4">Lo que hacemos por tu negocio</h2>
            <p className="text-gris font-semibold">Nuestra plataforma está diseñada para resolver los dolores del día a día en la operación de licores.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                icon: Package, 
                title: 'Catálogo B2B', 
                desc: 'Explora productos, marcas, categorías y disponibilidad real de inventario en tu zona.' 
              },
              { 
                icon: BarChart3, 
                title: 'Precios Personalizados', 
                desc: 'Condiciones comerciales dinámicas según tu tipo de negocio, volumen y perfil de compra.' 
              },
              { 
                icon: CreditCard, 
                title: 'Crédito y Cartera', 
                desc: 'Consulta tu cupo asignado, facturas electrónicas, vencimientos y realiza pagos centralizados.' 
              },
              { 
                icon: Zap, 
                title: 'Pedidos Recurrentes', 
                desc: 'Repite tus compras más frecuentes sin volver a empezar desde cero, ahorrando tiempo operativo.' 
              },
              { 
                icon: Truck, 
                title: 'Logística de Precisión', 
                desc: 'Recibe tus pedidos con trazabilidad en tiempo real, control de novedades y soporte en la entrega.' 
              },
              { 
                icon: Headset, 
                title: 'Acompañamiento Experto', 
                desc: 'Un asesor comercial asignado te ayuda a comprar mejor, activar marcas y maximizar tus ventas.' 
              }
            ].map((service, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -8 }}
                className="bg-white p-10 rounded-2xl border border-borde shadow-sm hover:shadow-xl transition-all"
              >
                <service.icon size={42} strokeWidth={1.5} className="text-rojo mb-8" />
                <h3 className="text-xl font-black text-texto mb-4">{service.title}</h3>
                <p className="text-texto-sec font-medium leading-relaxed">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="py-24">
        <div className="max-w-[1480px] mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
            <div className="lg:col-span-2">
              <h2 className="text-4xl font-black tracking-tight mb-6">Para quién es TBS</h2>
              <p className="text-lg text-texto-sec font-medium leading-relaxed">
                Entendemos las necesidades específicas de cada segmento del mercado. 
                Nuestra plataforma se adapta a tu modelo operativo para brindar las herramientas que necesitas para crecer.
              </p>
            </div>
            
            <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { icon: Store, text: 'Bares y Restaurantes' },
                { icon: Building2, text: 'Hoteles y Clubes' },
                { icon: Package, text: 'Licoreras y Súper' },
                { icon: Music, text: 'Discotecas y Eventos' },
                { icon: Truck, text: 'Distribuidores' },
                { icon: Users, text: 'Marcas y Proveedores' }
              ].map((target, i) => (
                <div key={i} className="bg-white border border-borde rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-rojo hover:bg-rojo-suave transition-all group cursor-default">
                  <target.icon size={32} className="text-gris group-hover:text-rojo mb-4 transition-colors" />
                  <span className="text-sm font-black text-texto">{target.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 bg-rojo text-white text-center">
        <div className="max-w-4xl mx-auto px-8">
          <h2 className="text-4xl font-black tracking-tight mb-6">¿Listo para transformar tu abastecimiento?</h2>
          <p className="text-xl opacity-80 font-medium mb-10">Únete a cientos de negocios que ya operan con TBS y ahorra tiempo y dinero en cada pedido.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-10 py-5 bg-white text-rojo rounded-xl font-black text-lg hover:bg-rojo-suave transition-all cursor-pointer">
              Solicitar Acceso
            </button>
            <button onClick={onGoAdvisorChat} className="px-10 py-5 border border-white/30 text-white rounded-xl font-black text-lg hover:bg-white/10 transition-all cursor-pointer">
              Hablar con un asesor
            </button>
          </div>
        </div>
      </section>

      <footer className="py-10 text-center text-gris text-sm font-bold border-t border-borde">
         TBS Destilados · Tecnología aplicada al canal de licores · 2024
      </footer>
    </div>
  );
}

// Support icons that were missing in local scope but present in top level
function Store(props: any) {
  return (
    <svg 
      {...props}
      width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
    >
      <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
      <path d="M2 7h20" />
      <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" />
    </svg>
  );
}

function Music(props: any) {
  return (
    <svg 
      {...props}
      width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
    >
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}
