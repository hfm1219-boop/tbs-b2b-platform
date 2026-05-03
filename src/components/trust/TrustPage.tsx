
import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Lock, Eye, CheckCircle2, ArrowLeft, ArrowRight, MessageSquare, ShieldAlert } from 'lucide-react';
import { Breadcrumbs } from '../Breadcrumbs';

interface TrustPageProps {
  onBack: () => void;
  onGoContact: () => void;
  onGoAccessRequest: () => void;
  onGoLegalPage: (key: any) => void;
}

export function TrustPage({ onBack, onGoContact, onGoAccessRequest, onGoLegalPage }: TrustPageProps) {
  const securityFeatures = [
    {
      icon: ShieldCheck,
      title: 'Seguridad de la información',
      description: 'Implementamos protocolos de cifrado y seguridad para proteger tus datos de compra y operación B2B.'
    },
    {
      icon: Lock,
      title: 'Privacidad garantizada',
      description: 'Tus datos comerciales son privados y solo se utilizan para la gestión de tus pedidos y soporte TBS.'
    },
    {
      icon: Eye,
      title: 'Transparencia comercial',
      description: 'Accede a tus precios B2B reales, facturación electrónica y trazabilidad de cada centavo invertido.'
    },
    {
      icon: CheckCircle2,
      title: 'Validación de identidad',
      description: 'Verificamos cada cuenta B2B para asegurar un entorno de negocios seguro y confiable.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gray-50 pt-10 pb-20 border-b border-borde">
        <div className="max-w-[1480px] mx-auto px-8">
          <Breadcrumbs 
            onHomeClick={onBack}
            items={[{ label: 'Centro de Confianza', current: true }]}
          />

          <div className="max-w-3xl mt-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-rojo text-xs font-black uppercase tracking-[0.2em] mb-4"
            >
              Compromiso TBS
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl lg:text-7xl font-black tracking-tighter leading-[0.9] mb-8"
            >
              Seguridad y Confianza en TBS
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gris font-medium leading-relaxed"
            >
              En TBS nos tomamos en serio la integridad de tu negocio. Descubre cómo protegemos tu información, garantizamos transacciones seguras y mantenemos los más altos estándares de privacidad.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-24">
        <div className="max-w-[1480px] mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {securityFeatures.map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl border border-borde hover:border-rojo/20 bg-white hover:shadow-xl transition-all"
              >
                <div className="w-14 h-14 bg-rojo/10 rounded-2xl flex items-center justify-center text-rojo mb-6">
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-black text-texto mb-4">{feature.title}</h3>
                <p className="text-gris font-medium leading-relaxed text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="py-24 bg-[#1A1F26] text-white">
        <div className="max-w-[1480px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-4xl font-black tracking-tight mb-8">Nuestros pilares de privacidad</h2>
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                  <Lock className="text-rojo" />
                </div>
                <div>
                  <h4 className="text-lg font-black mb-2">Tratamiento ético de datos</h4>
                  <p className="text-white/60 font-medium">Cumplimos con la Ley 1581 de Protección de Datos Personales en Colombia (Habeas Data). Tus datos solo se usan para lo que autorizas.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                  <ShieldAlert className="text-rojo" />
                </div>
                <div>
                  <h4 className="text-lg font-black mb-2">Prevención de fraude</h4>
                  <p className="text-white/60 font-medium">Monitoreamos patrones inusuales para proteger tu cuenta y tus transacciones de accesos no autorizados.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                  <Eye className="text-rojo" />
                </div>
                <div>
                  <h4 className="text-lg font-black mb-2">Auditoría constante</h4>
                  <p className="text-white/60 font-medium">Revisamos periódicamente nuestros procesos para asegurar que la plataforma TBS siga siendo el lugar más seguro para comprar.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white/5 p-10 rounded-[40px] border border-white/10">
            <h3 className="text-2xl font-black mb-6">¿Tienes alguna duda de seguridad?</h3>
            <p className="text-white/70 font-medium mb-8">Si detectas algo inusual o quieres conocer más sobre cómo protegemos tu plataforma, contáctanos de inmediato.</p>
            <div className="space-y-4">
              <button 
                onClick={onGoContact}
                className="w-full bg-rojo text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-rojo-oscuro transition-colors flex items-center justify-center gap-2"
              >
                <MessageSquare size={18} /> Contactar a soporte
              </button>
              <button 
                onClick={() => onGoLegalPage('privacidad')}
                className="w-full bg-white/10 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-white/20 transition-colors"
              >
                Ver política de privacidad
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 text-center">
        <div className="max-w-2xl mx-auto px-8">
          <ShieldCheck size={64} className="mx-auto text-rojo mb-8" />
          <h2 className="text-4xl font-black tracking-tight mb-6">Tu negocio está en buenas manos</h2>
          <p className="text-lg text-gris font-medium mb-10">Únete a la red de abastecimiento inteligente más confiable de Colombia.</p>
          <button 
            onClick={onGoAccessRequest}
            className="bg-texto text-white px-10 py-5 rounded-2xl font-black text-lg tbs-shadow hover:bg-rojo transition-all flex items-center gap-3 mx-auto"
          >
            Solicitar Acceso B2B <ArrowRight size={22} />
          </button>
        </div>
      </section>

      <footer className="py-10 text-center text-gris text-xs font-bold border-t border-borde uppercase tracking-widest">
        TBS Destilados · Tu socio de confianza en licores B2B · 2024
      </footer>
    </div>
  );
}
