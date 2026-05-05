import React, { useState } from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  Calendar, 
  ShoppingCart, 
  Truck, 
  DollarSign, 
  Building2, 
  MapPin, 
  Briefcase, 
  GlassWater, 
  Crown, 
  Music, 
  History, 
  ShieldCheck, 
  MessageSquare, 
  ChevronDown,
  Globe,
  Star,
  Zap,
  BarChart3,
  Search,
  Plus,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Breadcrumbs } from './Breadcrumbs';

interface HospitalityPartnersPageProps {
  currentUser: any;
  onGoAccessRequest: (role: 'client' | 'provider') => void;
  onGoHospitalityDashboard: () => void;
  onGoAdvisorChat: (topic?: any, context?: any) => void;
  onBack: () => void;
}

export const HospitalityPartnersPage: React.FC<HospitalityPartnersPageProps> = ({
  currentUser,
  onGoAccessRequest,
  onGoHospitalityDashboard,
  onGoAdvisorChat,
  onBack
}) => {
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  const isHospitalityPartner = currentUser?.role === 'hospitality_partner';
  const isLoggedIn = !!currentUser;

  const steps = [
    {
      title: "Registra tu perfil",
      desc: "Solicita tu acceso como hospitality partner y TBS validará tu perfil profesional.",
      icon: Users
    },
    {
      title: "Crea o solicita clientes",
      desc: "Registra clientes finales o solicita validación para gestionar sus compras.",
      icon: Search
    },
    {
      title: "Programa eventos",
      desc: "Asocia pedidos a bodas, fiestas privadas, villas o experiencias premium.",
      icon: Calendar
    },
    {
      title: "Compra para el cliente",
      desc: "Arma pedidos con productos seleccionados y define ventanas de entrega.",
      icon: ShoppingCart
    },
    {
      title: "TBS entrega y factura",
      desc: "Validamos inventario, logística y facturamos según el modelo acordado.",
      icon: Truck
    },
    {
      title: "Recibes comisión",
      desc: "Tu gestión genera una comisión que se registra para liquidación periódica.",
      icon: DollarSign
    }
  ];

  const partners = [
    {
      title: "Wedding Planners",
      desc: "Gestiona los licores para bodas de destino en Cartagena.",
      useCase: "Abastecimiento para eventos masivos y coordinación en sitio.",
      icon: Star
    },
    {
      title: "Administradores de Villas",
      desc: "Surtido recurrente para huéspedes de casas privadas.",
      useCase: "Pedidos de reposición y entregas programadas antes del check-in.",
      icon: Building2
    },
    {
      title: "Concierges Premium",
      desc: "Servicio exclusivo para peticiones especiales de clientes VIP.",
      useCase: "Búsqueda de etiquetas de lujo y entregas urgentes.",
      icon: Crown
    },
    {
      title: "Agencias de Eventos",
      desc: "Operación logística para lanzamientos y fiestas corporativas.",
      useCase: "Centralización de facturación y trazabilidad de consumo.",
      icon: Music
    }
  ];

  const billingScenarios = [
    {
      type: "Escenario A",
      title: "Factura al Cliente Final",
      whoPays: "Cliente Final",
      invoiceTo: "Cliente Final",
      commission: "Aplica comisión para el Partner",
      desc: "TBS factura directamente al cliente final. El partner recibe comisión por la gestión comercial y operativa."
    },
    {
      type: "Escenario B",
      title: "Partner Compra Directo",
      whoPays: "Partner",
      invoiceTo: "Partner",
      commission: "El margen es manejado por el Partner",
      desc: "El partner compra a precios B2B y maneja su propia relación de cobro con el cliente final."
    },
    {
      type: "Escenario C",
      title: "Crédito B2B Corporativo",
      whoPays: "Empresa con crédito",
      invoiceTo: "Empresa / Cliente B2B",
      commission: "Depende del acuerdo específico",
      desc: "Si el cliente final ya tiene cuenta con cupo en TBS, el partner gestiona la compra bajo ese cupo."
    }
  ];

  const faqs = [
    {
      q: "¿Quién puede ser Hospitality Partner?",
      a: "Wedding planners, administradores de villas, concierges, agencias de eventos y profesionales que gestionen recurrentemente compras para terceros en el sector lujo y eventos."
    },
    {
      q: "¿Cómo se calcula la comisión?",
      a: "La comisión se basa en un porcentaje de la venta neta (antes de impuestos y logística) y depende del tipo de producto y el acuerdo comercial vigente."
    },
    {
      q: "¿TBS factura de forma legal a mi cliente?",
      a: "Sí, TBS es el emisor de la factura legal (FE) ya sea al cliente final o al partner, asegurando trazabilidad y cumplimiento tributario."
    },
    {
      q: "¿Puedo programar entregas en fin de semana?",
      a: "TBS ofrece ventanas de entrega especiales para eventos coordinadas con el partner, incluso en horarios tácticos si se programa con antelación."
    },
    {
      q: "¿El partner es responsable por el pago del cliente?",
      a: "Si el modelo es 'Factura al Cliente Final', el partner ayuda en la gestión pero TBS valida el pago o crédito antes del despacho."
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-10 pb-40 overflow-hidden bg-white border-b border-gray-100">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gray-50 -skew-x-12 transform translate-x-1/4 opacity-50 z-0"></div>
        <div className="max-w-[1440px] mx-auto px-8 relative z-10">
          <Breadcrumbs 
            onHomeClick={onBack}
            items={[{ label: 'Hospitality', current: true }]}
          />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center mt-12">
            <div className="lg:col-span-12">
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="flex items-center gap-2 mb-8"
               >
                 <span className="px-3 py-1.5 bg-rojo/10 text-rojo rounded-full text-[11px] font-black uppercase tracking-widest">Modelo Hospitality</span>
                 <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                 <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Para Wedding Planners & Aliados</span>
               </motion.div>
               <motion.h1 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.1 }}
                 className="text-6xl md:text-8xl lg:text-9xl font-black text-texto leading-[0.85] tracking-tighter mb-12"
               >
                 Gestiona las compras de licores para tus <span className="text-rojo">eventos</span> de forma profesional.
               </motion.h1>
               
               <motion.p 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.2 }}
                 className="text-2xl text-texto-sec font-medium max-w-4xl leading-relaxed mb-16"
               >
                 Wedding planners, concierges y administradores de villas ahora pueden centralizar pedidos, programar entregas programadas y recibir comisión por su gestión comercial a través de TBS.
               </motion.p>

                 <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.3 }}
                   className="flex flex-wrap gap-6"
                 >
                   {isHospitalityPartner ? (
                     <button 
                       onClick={onGoHospitalityDashboard}
                       className="px-12 py-7 bg-rojo text-white rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-2xl shadow-rojo/20 flex items-center gap-4 cursor-pointer"
                     >
                       Ir a mi Dashboard <ArrowRight size={24} />
                     </button>
                   ) : (
                     <button 
                       onClick={() => onGoAccessRequest('client')}
                       className="px-12 py-7 bg-rojo text-white rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-2xl shadow-rojo/20 flex items-center gap-4 cursor-pointer"
                     >
                       Solicitar acceso como partner <ArrowRight size={24} />
                     </button>
                   )}
                   <button 
                     onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                     className="px-12 py-7 bg-white border-2 border-texto text-texto rounded-2xl font-black text-xl hover:bg-gray-50 transition-all cursor-pointer"
                   >
                     Ver cómo funciona
                   </button>
                 </motion.div>

               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 0.5 }}
                 className="mt-20 pt-10 border-t border-gray-100 flex flex-wrap gap-x-12 gap-y-6"
               >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="text-rojo" size={20} />
                    <span className="text-sm font-black uppercase tracking-widest text-gris">Clientes Gestionados</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="text-rojo" size={20} />
                    <span className="text-sm font-black uppercase tracking-widest text-gris">Eventos Programados</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="text-rojo" size={20} />
                    <span className="text-sm font-black uppercase tracking-widest text-gris">Facturación TBS</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="text-rojo" size={20} />
                    <span className="text-sm font-black uppercase tracking-widest text-gris">Comisión por Gestión</span>
                  </div>
               </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="py-24 bg-white">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="max-w-3xl mb-20 text-center mx-auto">
            <h2 className="text-4xl lg:text-7xl font-black tracking-tighter mb-8">Para quién es este modelo</h2>
            <p className="text-xl text-texto-sec font-medium leading-relaxed">
              Diseñado para profesionales que necesitan asegurar el abastecimiento de sus clientes finales con respaldo B2B institucional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {partners.map((p, i) => (
              <div key={i} className="p-10 bg-gray-50 rounded-[40px] border border-transparent hover:border-rojo/20 hover:bg-white hover:shadow-2xl transition-all group">
                <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-10 text-rojo shadow-sm group-hover:bg-rojo group-hover:text-white transition-colors">
                  <p.icon size={32} />
                </div>
                <h3 className="text-2xl font-black mb-4 tracking-tight">{p.title}</h3>
                <p className="text-sm text-texto-sec font-medium mb-6 leading-relaxed">{p.desc}</p>
                <div className="pt-6 border-t border-gray-200">
                  <span className="text-[10px] font-black uppercase text-gris tracking-widest mb-2 block">Caso de uso</span>
                  <p className="text-xs font-bold text-texto leading-relaxed">{p.useCase}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What is Hospitality Partner */}
      <section className="py-24 bg-[#0F172A] text-white">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl lg:text-7xl font-black tracking-tighter mb-8 leading-none">
                Un aliado que compra en nombre de sus <span className="text-rojo">clientes</span>.
              </h2>
              <p className="text-xl text-white/70 font-medium leading-relaxed mb-12">
                Un hospitality partner es un aliado autorizado por TBS que tiene la facultad de registrar clientes, programar eventos y crear pedidos en su nombre. Centralizas la operación logística y aseguras que tus clientes reciban lo que necesitan, cuando lo necesitan.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { label: "Partner Gestiona", desc: "Crea el pedido y programa el evento." },
                  { label: "TBS Valida", desc: "Aprobamos inventario y condiciones." },
                  { label: "TBS Factura", desc: "Emitimos facturación legal según modelo." },
                  { label: "Cliente Gana", desc: "Recibe productos premium con trazabilidad." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-rojo flex items-center justify-center shrink-0 mt-1">
                      <CheckCircle2 size={14} className="text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black tracking-tight">{item.label}</h4>
                      <p className="text-sm text-white/50">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-[40px] p-12 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                 <ShieldCheck size={200} />
               </div>
               <div className="relative z-10">
                 <h3 className="text-2xl font-black mb-8">El Invariante TBS Hospitality</h3>
                 <p className="text-lg text-white/80 leading-relaxed font-medium mb-10">
                    "El partner gestiona la oportunidad y la logística fina en sitio; TBS valida la operación comercial y asegura el cumplimiento logístico masivo."
                 </p>
                 <div className="p-8 bg-rojo rounded-3xl">
                    <div className="text-xs font-black uppercase tracking-widest mb-4 opacity-70">Resultado Directo</div>
                    <div className="text-3xl font-black leading-tight">Eliminación de fricción operativa y errores de abastecimiento en eventos críticos.</div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Flow */}
      <section id="how-it-works" className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="max-w-3xl mb-20">
            <h2 className="text-4xl lg:text-7xl font-black tracking-tighter mb-8 leading-none">Cómo funciona el modelo</h2>
            <p className="text-xl text-texto-sec font-medium">Un flujo diseñado para darte control total sin la carga operativa del recaudo y la logística pesada.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 relative">
            <div className="hidden lg:block absolute top-[138px] left-[10%] right-[10%] h-px bg-gray-200 z-0"></div>
            {steps.map((step, i) => (
              <div key={i} className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-white border border-gray-200 flex items-center justify-center mb-8 shadow-sm group hover:bg-rojo transition-all">
                  <span className="text-2xl font-black text-rojo group-hover:text-white transition-colors">{i + 1}</span>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gray-100 text-rojo">
                      <step.icon size={20} />
                    </div>
                    <h3 className="text-2xl font-black tracking-tight">{step.title}</h3>
                  </div>
                  <p className="text-base text-texto-sec leading-relaxed font-medium">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Billing Scenarios */}
      <section className="py-24 bg-white">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="flex flex-col lg:flex-row items-end justify-between gap-12 mb-20">
            <div className="max-w-3xl">
              <h2 className="text-4xl lg:text-7xl font-black tracking-tighter mb-8 leading-none">Quién paga y cómo se factura</h2>
              <p className="text-xl text-texto-sec font-medium leading-relaxed">
                Flexibilidad absoluta para adaptarse a la estructura de tu negocio o la de tu cliente.
              </p>
            </div>
            <div className="p-8 bg-gray-50 border border-gray-100 rounded-3xl flex items-center gap-6">
              <div className="w-12 h-12 rounded-xl bg-rojo text-white flex items-center justify-center font-black">?</div>
              <div>
                <p className="text-xs font-black uppercase text-gris tracking-widest mb-1">Duda principal</p>
                <p className="text-sm font-bold">¿A quién le cobran el licor?</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {billingScenarios.map((s, i) => (
              <div key={i} className="flex flex-col h-full rounded-[40px] bg-white border border-gray-100 shadow-sm overflow-hidden hover:shadow-2xl transition-all group">
                <div className="p-10 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-black uppercase text-rojo tracking-[0.2em] mb-2 block">{s.type}</span>
                    <h3 className="text-2xl font-black tracking-tight">{s.title}</h3>
                  </div>
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-rojo shadow-sm">
                    <Briefcase size={20} />
                  </div>
                </div>
                <div className="p-10 flex-1 space-y-8">
                  <p className="text-texto-sec leading-relaxed font-medium">{s.desc}</p>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                      <span className="text-xs text-gris font-bold uppercase tracking-widest">Quién Paga</span>
                      <span className="text-sm font-black">{s.whoPays}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                      <span className="text-xs text-gris font-bold uppercase tracking-widest">Factura a</span>
                      <span className="text-sm font-black">{s.invoiceTo}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gris font-bold uppercase tracking-widest">Comisión</span>
                      <span className="text-sm font-black text-rojo">{s.commission}</span>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-gray-50 border-t border-gray-100 mt-auto">
                   <button className="w-full h-14 bg-white border border-gray-200 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:border-rojo hover:text-rojo transition-all">Ver ejemplo práctico</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Control & TBS Validation */}
      <section className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="max-w-[1440px] mx-auto px-8">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              <div className="p-12 bg-white rounded-[40px] border border-gray-100 shadow-sm h-full">
                 <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><Zap size={24} /></div>
                    <h3 className="text-3xl font-black tracking-tight">Qué controla el Partner</h3>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                      { l: 'Clientes Gestionados', d: 'Crea y consulta solicitudes de nuevos clientes.' },
                      { l: 'Detalle del Evento', d: 'Nombre, fecha, lugar y responsable en sitio.' },
                      { l: 'Mix de Productos', d: 'Arma el pedido según las necesidades del evento.' },
                      { l: 'Logística de Entrega', d: 'Define dirección y ventana de recepción.' },
                      { l: 'Estado de Pedido', d: 'Trazabilidad en tiempo real desde despacho.' },
                      { l: 'Historial de Comisiones', d: 'Consulta acumulado y estado de liquidación.' }
                    ].map((item, i) => (
                      <div key={i} className="space-y-2">
                        <h4 className="text-sm font-black uppercase text-texto leading-none">{item.l}</h4>
                        <p className="text-xs text-texto-sec leading-relaxed">{item.d}</p>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="p-12 bg-[#0F172A] text-white rounded-[40px] shadow-2xl h-full">
                 <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 rounded-xl bg-rojo text-white flex items-center justify-center"><ShieldCheck size={24} /></div>
                    <h3 className="text-3xl font-black tracking-tight">Qué valida TBS</h3>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                      { l: 'Perfil del Partner', d: 'Validamos que seas un profesional activo del sector.' },
                      { l: 'Cliente Final', d: 'Requisitos legales o de creación institucional.' },
                      { l: 'Disponibilidad', d: 'Inventario real según fecha y ciudad.' },
                      { l: 'Condición Comercial', d: 'Precios, descuentos y cupo disponible.' },
                      { l: 'Validación Logística', d: 'Cobertura en el punto de entrega solicitado.' },
                      { l: 'Aprobación de Comisión', d: 'Cumplimiento de reglas según canal y marca.' }
                    ].map((item, i) => (
                      <div key={i} className="space-y-2">
                        <h4 className="text-sm font-black uppercase text-white leading-none">{item.l}</h4>
                        <p className="text-xs text-white/50 leading-relaxed">{item.d}</p>
                      </div>
                    ))}
                 </div>
                 <div className="mt-12 p-6 bg-white/5 border border-white/10 rounded-2xl">
                    <p className="text-sm italic text-white/70">"Aseguramos que cada compromiso que hagas con tu cliente tenga el respaldo logístico y comercial de TBS."</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Case Study / Example Mockup */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <span className="px-3 py-1.5 bg-gray-100 rounded-full text-[10px] font-black uppercase tracking-widest text-gris mb-6 inline-block">Ejemplo de Operación</span>
              <h2 className="text-4xl lg:text-7xl font-black tracking-tighter mb-10 leading-none">Wedding Planner en Cartagena</h2>
              <p className="text-xl text-texto-sec leading-relaxed font-medium mb-12">
                Una wedding planner necesita abastecer una boda de 150 invitados en una casa privada del centro histórico.
              </p>
              
              <div className="space-y-6">
                {[
                  { step: "1", label: "Registro de Evento", detail: "Boda Ana & Juan - June 14, 2026" },
                  { step: "2", label: "Selección de Portafolio", detail: "18 Botellas Whisky Premium, 12 Ron, 24 Ginebra." },
                  { step: "3", label: "Programación de Entrega", detail: "Ventana: 10:00 AM - 1:00 PM con responsable local." },
                  { step: "4", label: "Liquidación", detail: "TBS cobra al cliente, despacha y asigna comisión." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-5 items-start">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-black text-gris shrink-0 mt-1">{item.step}</div>
                    <div>
                      <h4 className="text-lg font-black tracking-tight leading-none mb-1">{item.label}</h4>
                      <p className="text-sm text-texto-sec">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-rojo/5 rounded-[40px] transform rotate-2"></div>
              <div className="relative bg-[#0F172A] p-10 rounded-[40px] text-white shadow-2xl border border-white/10">
                 <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-rojo rounded-xl flex items-center justify-center"><Calendar size={20} /></div>
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-0.5">Operación Activa</p>
                          <p className="text-base font-black uppercase tracking-tighter">Boda Ana & Juan</p>
                       </div>
                    </div>
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-[10px] font-black uppercase tracking-widest">Pedido Entregado</span>
                 </div>
                 
                 <div className="space-y-6 mb-10">
                    <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                       <div className="flex justify-between text-xs font-black uppercase tracking-widest text-white/40 mb-4">
                          <span>Detalles de Cierre</span>
                          <span>ID #29482</span>
                       </div>
                       <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                          <div>
                             <p className="text-white/40 mb-1">Monto Pedido</p>
                             <p className="font-black">$9.450.000</p>
                          </div>
                          <div>
                             <p className="text-white/40 mb-1">Facturado a</p>
                             <p className="font-black">Cliente Final</p>
                          </div>
                          <div>
                             <p className="text-white/40 mb-1">Items</p>
                             <p className="font-black">54 unidades</p>
                          </div>
                          <div>
                             <p className="text-white/40 mb-1">Lugar</p>
                             <p className="font-black">C. Histórico</p>
                          </div>
                       </div>
                    </div>

                    <div className="p-6 bg-rojo rounded-2xl">
                       <div className="flex justify-between items-center mb-2">
                          <p className="text-xs font-black uppercase tracking-widest opacity-70">Tu Comisión</p>
                          <CheckCircle2 size={16} className="opacity-70" />
                       </div>
                       <p className="text-4xl font-black mt-2 tracking-tighter">$472.500</p>
                       <p className="text-[11px] font-bold mt-2 opacity-80 uppercase tracking-widest">Estado: Liquidada en Abril</p>
                    </div>
                 </div>

                 <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-white/50">
                    <History size={14} />
                    <span>Último pedido hace 2 días</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="max-w-[1440px] mx-auto px-8">
           <div className="max-w-3xl mb-20">
              <h2 className="text-4xl lg:text-7xl font-black tracking-tighter mb-8 leading-none">Tu centro de control</h2>
              <p className="text-xl text-texto-sec font-medium">Herramientas diseñadas para la precisión que exige el sector eventos.</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Card Cliente Gestionado */}
              <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm relative group overflow-hidden">
                 <div className="absolute top-0 right-0 p-6 text-gray-100 -mr-4 -mt-4"><Users size={80} /></div>
                 <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                       <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">AC</div>
                       <div>
                          <p className="text-sm font-black tracking-tight leading-none">Andrés Calle</p>
                          <p className="text-[10px] font-bold text-gris uppercase tracking-widest mt-1">Cliente B2C Validado</p>
                       </div>
                    </div>
                    <div className="space-y-4">
                       <div className="flex justify-between text-xs font-bold">
                          <span className="text-gris uppercase tracking-widest">E-mail</span>
                          <span>andres@calle.com</span>
                       </div>
                       <div className="flex justify-between text-xs font-bold">
                          <span className="text-gris uppercase tracking-widest">Eventos</span>
                          <span className="text-rojo">2 Activos</span>
                       </div>
                    </div>
                    <button className="w-full mt-8 py-3 border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-colors">Ver Perfil Cliente</button>
                 </div>
              </div>

              {/* Card Evento */}
              <div className="bg-[#0F172A] p-8 rounded-[32px] text-white shadow-xl relative overflow-hidden">
                 <div className="flex justify-between items-start mb-8">
                    <div>
                        <h4 className="text-xl font-black tracking-tight leading-none">Lanzamiento Porsche 2026</h4>
                        <div className="flex items-center gap-2 mt-2 text-white/50 text-[10px] font-bold uppercase tracking-widest">
                           <MapPin size={10} /> Hotel Santa Clara
                        </div>
                    </div>
                    <div className="px-2 py-1 bg-rojo text-white rounded text-[8px] font-black uppercase tracking-widest">Mañana</div>
                 </div>
                 <div className="p-4 bg-white/5 rounded-2xl mb-6">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">
                       <span>Logística de Entrega</span>
                       <span>Confirmed</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <Truck size={18} className="text-rojo" />
                       <span className="text-sm font-bold italic">Ventana: 09:00 - 11:00</span>
                    </div>
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                       {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0F172A] bg-gray-700"></div>)}
                    </div>
                    <span className="text-[10px] font-black uppercase text-white/50">3 Responsables</span>
                 </div>
              </div>

              {/* Status Comisión/Liquidación */}
              <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                 <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center"><Briefcase size={20} /></div>
                    <h4 className="text-lg font-black tracking-tight">Liquidación Abril</h4>
                 </div>
                 <div className="space-y-6">
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-gris mb-1">Monto Acumulado</p>
                       <p className="text-4xl font-black tracking-tight text-texto">$1.248.500</p>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                       <div className="w-3/4 h-full bg-rojo"></div>
                    </div>
                    <div className="flex justify-between items-center">
                       <div className="flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-green-500" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Validada</span>
                       </div>
                       <span className="text-xs text-gris">Pago: Mayo 05</span>
                    </div>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mt-24">
              <div>
                 <h3 className="text-3xl lg:text-5xl font-black tracking-tighter mb-12">Beneficios para el Partner</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                    {[
                      { icon: Briefcase, title: "Centralización", desc: "Toda la compra del evento en un solo lugar." },
                      { icon: BarChart3, title: "Comisión Directa", desc: "Gana comisión por cada peso gestionado." },
                      { icon: Zap, title: "Agilidad B2B", desc: "No más compras en retail o licoreras locales." },
                      { icon: Globe, title: "Trazabilidad", desc: "Tú sabes dónde está el pedido en todo momento." }
                    ].map((item, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="text-rojo shrink-0 mt-1"><item.icon size={22} /></div>
                        <div>
                          <h4 className="text-lg font-black tracking-tight mb-1 leading-none">{item.title}</h4>
                          <p className="text-sm text-texto-sec leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
              <div className="border-l border-gray-200 pl-0 lg:pl-20">
                 <h3 className="text-3xl lg:text-5xl font-black tracking-tighter mb-12 text-texto/60">Beneficios para el Cliente</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                    {[
                      { icon: ShieldCheck, title: "Respaldo TBS", desc: "Certificación de orginalidad y factura legal." },
                      { icon: Truck, title: "Entrega Exacta", desc: "Cumplimiento en fecha y hora acordada." },
                      { icon: DollarSign, title: "Precios B2B", desc: "Optimización de presupuesto para su evento." },
                      { icon: HelpCircle, title: "Soporte Operativo", desc: "No tiene que lidiar con logística pesada." }
                    ].map((item, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="text-gris shrink-0 mt-1"><item.icon size={22} /></div>
                        <div>
                          <h4 className="text-lg font-black tracking-tight mb-1 leading-none">{item.title}</h4>
                          <p className="text-sm text-texto-sec leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="max-w-[1440px] mx-auto px-8">
           <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl lg:text-7xl font-black tracking-tighter mb-16 text-center">Preguntas Frecuentes</h2>
              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <div key={i} className="border border-gray-100 rounded-3xl overflow-hidden bg-gray-50">
                    <button 
                      onClick={() => setActiveFAQ(activeFAQ === i ? null : i)}
                      className="w-full p-8 flex items-center justify-between text-left hover:bg-white transition-all cursor-pointer"
                    >
                      <h4 className="text-lg font-black text-texto">{faq.q}</h4>
                      <ChevronDown className={`text-gris transition-transform duration-300 ${activeFAQ === i ? 'rotate-180 text-rojo' : ''}`} size={20} />
                    </button>
                    <AnimatePresence>
                      {activeFAQ === i && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          className="overflow-hidden bg-white"
                        >
                          <div className="p-8 pt-0 text-texto-sec leading-relaxed font-medium border-t border-gray-50">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-rojo text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1)_0%,transparent_70%)] pointer-events-none" />
        <div className="max-w-[1440px] mx-auto px-8 relative z-10">
          <div className="max-w-5xl">
            <h2 className="text-5xl lg:text-8xl font-black tracking-tighter mb-12 leading-tight">Convierte tus eventos en una operación premium.</h2>
            <p className="text-2xl text-white/80 font-medium mb-16 max-w-3xl leading-relaxed capitalize-none">
              Solicita acceso como partner, gestiona clientes finales, programa entregas inteligentes y consulta tus comisiones desde el centro operativo de TBS.
            </p>
            <div className="flex flex-wrap gap-8">
              {isHospitalityPartner ? (
                <button 
                  onClick={onGoHospitalityDashboard}
                  className="px-14 py-8 bg-white text-rojo rounded-3xl font-black text-2xl hover:scale-105 transition-all shadow-2xl cursor-pointer flex items-center gap-3"
                >
                  Ir a mi Dashboard <ArrowRight size={28} />
                </button>
              ) : (
                <button 
                  onClick={() => onGoAccessRequest('client')}
                  className="px-14 py-8 bg-white text-rojo rounded-3xl font-black text-2xl hover:scale-105 transition-all shadow-2xl cursor-pointer flex items-center gap-3"
                >
                  Solicitar acceso ahora <ArrowRight size={28} />
                </button>
              )}
              <button 
                onClick={() => onGoAdvisorChat('comercial')}
                className="px-14 py-8 border-2 border-white/30 text-white rounded-3xl font-black text-2xl hover:bg-white/10 transition-all cursor-pointer flex items-center gap-3"
              >
                <MessageSquare size={28} /> Hablar con TBS
              </button>
            </div>
            {isHospitalityPartner && (
              <div className="mt-16 pt-12 border-t border-white/10">
                <button 
                  onClick={onGoHospitalityDashboard}
                  className="flex items-center gap-3 text-white font-black uppercase tracking-widest hover:underline cursor-pointer"
                >
                  Ya eres partner. Ir a mi dashboard <ArrowRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
