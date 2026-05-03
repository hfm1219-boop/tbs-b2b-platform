import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Globe, 
  ChevronRight, 
  MessageSquare, 
  UserPlus, 
  Building2, 
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import { SEOHead } from './SEOHead';
import { buildLocalBusinessSchema, buildBreadcrumbSchema } from '../data/schemaData';
import { Breadcrumbs } from './Breadcrumbs';
import { BusinessContactInfo, ContactChannel, User } from '../types';

interface ContactPageProps {
  currentUser: User | null;
  contactInfo: BusinessContactInfo;
  contactChannels: ContactChannel[];
  onGoHome: () => void;
  onGoAccessRequest: (type: 'client' | 'provider') => void;
  onGoFAQ: () => void;
  onGoCatalog: () => void;
  onGoAdvisorChat: () => void;
  onGoLegalPage: (key: any) => void;
}

const ContactPage: React.FC<ContactPageProps> = ({
  currentUser,
  contactInfo,
  contactChannels,
  onGoHome,
  onGoAccessRequest,
  onGoFAQ,
  onGoCatalog,
  onGoAdvisorChat,
  onGoLegalPage
}) => {
  const schemas = useMemo(() => [
    buildLocalBusinessSchema(),
    buildBreadcrumbSchema([{ label: 'Contacto y ubicación', url: '/contacto' }])
  ], []);

  const handleChannelAction = (channel: ContactChannel) => {
    switch (channel.actionTarget) {
      case 'accessRequestClient':
        onGoAccessRequest('client');
        break;
      case 'accessRequestProvider':
        onGoAccessRequest('provider');
        break;
      case 'faq':
        onGoFAQ();
        break;
      case 'call':
        window.location.href = `tel:${contactInfo.phone.replace(/\s+/g, '')}`;
        break;
      case 'advisorChat':
        if (currentUser) {
          onGoAdvisorChat();
        } else {
          onGoAccessRequest('client');
        }
        break;
      case 'catalog':
        onGoCatalog();
        break;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
      <SEOHead 
        title="Contacto y ubicación | TBS Destilados Cartagena"
        description="Contacta a TBS Destilados en Cartagena. Información para clientes B2B, marcas, soporte y solicitudes de acceso."
        canonicalPath="/contacto"
        jsonLd={schemas}
      />

      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1440px] mx-auto px-6 py-6 md:py-10">
          <Breadcrumbs 
            onHomeClick={onGoHome}
            items={[{ label: 'Contacto y ubicación', current: true }]}
          />
          <h1 className="text-4xl md:text-5xl font-black text-[#303844] mt-4 mb-2">
            Contacto y ubicación
          </h1>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-12">
            {/* Hero Section */}
            <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm mb-12">
              <div className="max-w-3xl">
                <span className="inline-block px-4 py-1.5 bg-rojo/5 text-rojo text-sm font-black rounded-full mb-6 uppercase tracking-wider">
                  TBS Destilados · Cartagena
                </span>
                <h2 className="text-3xl md:text-5xl font-black text-[#303844] mb-6 leading-tight">
                  Conecta con TBS para comprar, vender o recibir soporte.
                </h2>
                <p className="text-lg md:text-xl text-gray-500 font-bold leading-relaxed mb-10">
                  Atendemos clientes B2B, marcas y aliados que necesitan soluciones de abastecimiento, portafolio, logística, pagos, seguimiento y acompañamiento comercial.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => onGoAccessRequest('client')}
                    className="px-8 py-4 bg-rojo text-white font-black rounded-xl shadow-lg shadow-rojo/20 hover:scale-[1.02] transition-all"
                  >
                    Solicitar acceso B2B
                  </button>
                  <button 
                    onClick={() => onGoAccessRequest('provider')}
                    className="px-8 py-4 bg-[#303844] text-white font-black rounded-xl hover:scale-[1.02] transition-all"
                  >
                    Marcas
                  </button>
                  <button 
                    onClick={onGoFAQ}
                    className="px-8 py-4 bg-white border border-gray-200 text-[#303844] font-black rounded-xl hover:bg-gray-50 transition-all"
                  >
                    Centro de ayuda
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* NAP Card */}
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm h-full">
                <h3 className="text-2xl font-black text-[#303844] mb-8 flex items-center gap-3">
                  <MapPin className="text-rojo" />
                  Presencia Local
                </h3>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                      <Building2 className="text-gray-400" size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Empresa</p>
                      <p className="text-lg font-black text-[#303844]">{contactInfo.businessName}</p>
                      <p className="text-sm text-gray-500 font-bold">{contactInfo.legalName}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                      <MapPin className="text-gray-400" size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Ubicación</p>
                      <p className="text-lg font-black text-[#303844]">{contactInfo.address}</p>
                      <p className="text-sm text-gray-500 font-bold">{contactInfo.city}, {contactInfo.region}, {contactInfo.country}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                      <Phone className="text-gray-400" size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Teléfono</p>
                      <a href={`tel:${contactInfo.phone.replace(/\s+/g, '')}`} className="text-lg font-black text-[#303844] hover:text-rojo transition-colors underline decoration-2 underline-offset-4 decoration-rojo/20">
                        {contactInfo.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                      <Globe className="text-gray-400" size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Sitio Web</p>
                      <p className="text-lg font-black text-[#303844]">tbsdestilados.com</p>
                    </div>
                  </div>
                </div>

                <div className="mt-10 p-5 bg-blue-50 rounded-2xl border border-blue-100 flex gap-4">
                  <AlertCircle className="text-blue-500 shrink-0" size={20} />
                  <p className="text-sm text-blue-700 font-bold">
                    La información de horarios, cobertura, crédito, disponibilidad y entregas está sujeta a validación comercial y operativa.
                  </p>
                </div>
              </div>

              {/* Contact Channels */}
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-[#303844] mb-4">Canales de atención</h3>
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm mb-6 flex gap-4 items-start">
                  <ShieldCheck className="text-rojo shrink-0 mt-1" size={24} />
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-widest text-[#303844] mb-1">Protección de datos</h4>
                    <p className="text-xs text-gray-500 font-bold leading-relaxed">
                      Al contactarte por cualquier canal, tus datos serán tratados para fines comerciales y de soporte según nuestra <button onClick={() => {}} className="text-rojo underline hover:no-underline font-black outline-none">Política de privacidad</button>. No compartimos datos con terceros sin autorización.
                    </p>
                  </div>
                </div>
                {contactChannels.map((channel) => (
                  <div key={channel.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:border-rojo/30 transition-all group">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 group-hover:bg-rojo/5 transition-colors">
                          {channel.type === 'telefono' && <Phone className="text-gray-400 group-hover:text-rojo" size={20} />}
                          {channel.type === 'formulario' && <UserPlus className="text-gray-400 group-hover:text-rojo" size={20} />}
                          {channel.type === 'proveedor' && <Building2 className="text-gray-400 group-hover:text-rojo" size={20} />}
                          {channel.type === 'soporte' && <HelpCircle className="text-gray-400 group-hover:text-rojo" size={20} />}
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-[#303844] mb-1">{channel.title}</h4>
                          <p className="text-sm text-gray-500 font-bold leading-relaxed pr-8">
                            {channel.description}
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleChannelAction(channel)}
                        className="p-3 rounded-full bg-gray-50 text-gray-400 hover:bg-rojo hover:text-white transition-all shrink-0"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-50 flex justify-end">
                      <button 
                        onClick={() => handleChannelAction(channel)}
                        className="text-sm font-black text-rojo flex items-center gap-2 group-hover:gap-3 transition-all"
                      >
                        {channel.actionLabel}
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Why Contact Section */}
            <div className="mb-20">
              <h3 className="text-2xl font-black text-[#303844] mb-8 text-center">Para qué contactarnos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  "Solicitar acceso como cliente B2B.",
                  "Publicar portafolio como marca.",
                  "Validar pedidos, seguimiento o novedades.",
                  "Consultar cartera y pagos.",
                  "Solicitar apoyo para eventos o pedidos especiales.",
                  "Resolver dudas sobre la plataforma."
                ].map((item, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex gap-4 items-center">
                    <CheckCircle2 className="text-green-500 shrink-0" size={24} />
                    <p className="text-[#303844] font-bold">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Coverage Section */}
            <div className="bg-[#303844] rounded-3xl p-10 md:p-16 text-white mb-20 relative overflow-hidden">
              <div className="relative z-10 max-w-3xl">
                <h3 className="text-3xl md:text-4xl font-black mb-6">Cobertura y atención</h3>
                <p className="text-lg md:text-xl text-gray-300 font-bold leading-relaxed mb-0">
                  TBS opera desde Cartagena y desarrolla soluciones B2B para clientes del canal HORECA, licoreras, eventos y marcas. La cobertura, ventanas de entrega y condiciones comerciales dependen de ciudad, disponibilidad, operación logística y validación comercial.
                </p>
              </div>
              <MapPin className="absolute -right-20 -bottom-20 text-white/5" size={400} />
            </div>

            {/* Google Business Profile Information Bloque */}
            <div className="bg-white rounded-3xl p-8 border-2 border-dashed border-gray-200 mb-20">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-black text-[#303844] mb-4">Información para ficha local</h3>
                  <p className="text-sm text-gray-500 font-bold mb-6 italic">
                    Estos datos deben mantenerse consistentes en Google Business Profile, redes sociales, directorios y página web para reforzar la confianza local y la visibilidad en búsquedas.
                  </p>
                  <div className="space-y-3">
                    <p className="text-sm font-bold text-[#303844] flex gap-2">
                      <span className="text-gray-400 min-w-[80px]">Nombre:</span> TBS Destilados
                    </p>
                    <p className="text-sm font-bold text-[#303844] flex gap-2">
                      <span className="text-gray-400 min-w-[80px]">Dirección:</span> Carrera 2 No. 7-17 Local 1, Bocagrande, Cartagena
                    </p>
                    <p className="text-sm font-bold text-[#303844] flex gap-2">
                      <span className="text-gray-400 min-w-[80px]">Teléfono:</span> +57 314 581 3569
                    </p>
                    <p className="text-sm font-bold text-[#303844] flex gap-2">
                      <span className="text-gray-400 min-w-[80px]">Sitio web:</span> tbsdestilados.com
                    </p>
                    <div className="mt-4 pt-4 border-t border-gray-50">
                      <p className="text-xs font-black text-rojo uppercase tracking-widest mb-2">Categoría sugerida</p>
                      <p className="text-sm font-bold text-[#303844]">Distribuidor de licores / Tienda de licores / Servicio B2B de abastecimiento</p>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-64 aspect-square bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 italic text-gray-400 text-sm text-center px-6">
                  Espacio para pre-visualización de ubicación (Google Maps no activo)
                </div>
              </div>
            </div>

            {/* Simple FAQ section */}
            <div className="max-w-3xl mx-auto mb-20">
              <h3 className="text-2xl font-black text-[#303844] mb-10 text-center">Preguntas sobre contacto</h3>
              <div className="space-y-4">
                {[
                  {
                    q: "¿Dónde está ubicado TBS Destilados?",
                    a: "Nuestras oficinas y centro de operación se encuentran en Cartagena, específicamente en Bocagrande: Carrera 2 No. 7-17 Local 1."
                  },
                  {
                    q: "¿Puedo solicitar acceso B2B desde esta página?",
                    a: "Sí, puedes usar el botón 'Solicitar acceso B2B' en la parte superior o en los canales de atención para iniciar tu proceso."
                  },
                  {
                    q: "¿Las marcas pueden contactar a TBS?",
                    a: "Totalmente. Tenemos un canal dedicado para marcas que buscan escala en el canal B2B profesional."
                  },
                  {
                    q: "¿El teléfono reemplaza el portal?",
                    a: "No. El portal TBS es la herramienta principal para pedidos, facturación y catálogo. El teléfono es un soporte complementario."
                  },
                  {
                    q: "¿La cobertura depende de la ciudad?",
                    a: "Sí. Operamos con foco en Cartagena y la costa norte, y la cobertura nacional depende de la categoría de producto y validación comercial."
                  }
                ].map((faq, i) => (
                  <details key={i} className="group bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <summary className="list-none p-6 cursor-pointer flex items-center justify-between">
                      <span className="font-black text-[#303844] pr-4">{faq.q}</span>
                      <ChevronRight className="text-rojo group-open:rotate-90 transition-transform" size={20} />
                    </summary>
                    <div className="px-6 pb-6 pt-0">
                      <p className="text-gray-500 font-bold leading-relaxed">{faq.a}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>

            {/* Final CTA */}
            <div className="bg-white rounded-[40px] p-10 md:p-20 border border-gray-100 shadow-xl shadow-gray-200/50 text-center relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-black text-[#303844] mb-6">¿Quieres empezar con TBS?</h2>
                <p className="text-lg md:text-xl text-gray-500 font-bold mb-10 max-w-2xl mx-auto">
                  Solicita acceso como cliente B2B o proveedor y el equipo TBS revisará tu información para continuar el proceso.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button 
                    onClick={() => onGoAccessRequest('client')}
                    className="w-full sm:w-auto px-10 py-5 bg-rojo text-white font-black rounded-2xl shadow-lg shadow-rojo/20 hover:scale-[1.02] transition-all"
                  >
                    Solicitar acceso B2B
                  </button>
                  <button 
                    onClick={() => onGoAccessRequest('provider')}
                    className="w-full sm:w-auto px-10 py-5 bg-[#303844] text-white font-black rounded-2xl hover:scale-[1.02] transition-all"
                  >
                    Quiero vender con TBS
                  </button>
                  <button 
                    onClick={onGoFAQ}
                    className="w-full sm:w-auto px-10 py-5 bg-white border border-gray-200 text-[#303844] font-black rounded-2xl hover:bg-gray-50 transition-all font-black"
                  >
                    Ver centro de ayuda
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
