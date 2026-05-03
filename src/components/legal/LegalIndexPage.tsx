
import React from 'react';
import { Shield, Lock, FileText, Cookie, Beer, ChevronRight, Mail, Phone, Info } from 'lucide-react';
import { LegalPageData, LegalPageKey } from '../../types';
import { SEOHead } from '../SEOHead';

interface LegalIndexPageProps {
  legalPages: LegalPageData[];
  onGoHome: () => void;
  onGoLegalPage: (key: LegalPageKey) => void;
  onGoContact: () => void;
}

export function LegalIndexPage({ legalPages, onGoHome, onGoLegalPage, onGoContact }: LegalIndexPageProps) {
  const getIcon = (key: LegalPageKey) => {
    switch (key) {
      case 'privacy': return <Lock className="text-rojo" size={24} />;
      case 'dataTreatment': return <Shield className="text-rojo" size={24} />;
      case 'terms': return <FileText className="text-rojo" size={24} />;
      case 'cookies': return <Cookie className="text-rojo" size={24} />;
      case 'ageNotice': return <Beer className="text-rojo" size={24} />;
      default: return <Info className="text-rojo" size={24} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <SEOHead 
        title="Legal y privacidad | TBS Destilados"
        description="Consulta las políticas legales, privacidad, tratamiento de datos, cookies, términos y consumo responsable de TBS Destilados."
        canonicalPath="/legal"
      />
      
      <main className="flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1280px] mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter mb-6">
              Legal y privacidad
            </h1>
            <p className="text-lg text-gray-500 font-bold max-w-2xl mx-auto uppercase tracking-wide">
              Documentación normativa y transparencia en el tratamiento de datos para el ecosistema TBS.
            </p>
          </div>

          <div className="bg-rojo/5 border border-rojo/20 p-6 rounded-2xl mb-12 flex items-start gap-4 max-w-3xl mx-auto">
            <Info className="text-rojo shrink-0 mt-1" size={20} />
            <p className="text-rojo font-bold text-sm leading-relaxed">
              Base operativa para revisión legal antes de producción. Los documentos aquí expuestos son prototipos de texto legal que deben ser validados por la asesoría jurídica antes del lanzamiento definitivo del portal TBS.
            </p>
          </div>

          {/* Grid of Legal Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {legalPages.map((page) => (
              <button
                key={page.key}
                onClick={() => onGoLegalPage(page.key)}
                className="group relative bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:border-rojo/50 transition-all duration-300 text-left flex flex-col h-full"
              >
                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-rojo/10 transition-colors">
                  {getIcon(page.key)}
                </div>
                
                <h3 className="text-xl font-black text-gray-900 tracking-tight mb-4 group-hover:text-rojo transition-colors uppercase">
                  {page.title}
                </h3>
                
                <p className="text-gray-500 text-sm font-bold leading-relaxed mb-8 flex-grow">
                  {page.seoDescription}
                </p>
                
                <div className="flex items-center gap-2 text-rojo font-black text-xs uppercase tracking-widest">
                  <span>Ver política</span>
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>

          {/* Support Section */}
          <div className="bg-[#1A1F26] rounded-[40px] p-10 md:p-16 text-white relative overflow-hidden">
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-6">
                  ¿Necesitas mayor claridad <br/><span className="text-rojo">sobre nuestro marco legal?</span>
                </h2>
                <p className="text-gray-400 text-lg font-bold mb-10 max-w-md">
                  Si tienes dudas sobre cómo tratamos tus datos o los términos de operación B2B, nuestro canal comercial está disponible.
                </p>
                <button 
                  onClick={onGoContact}
                  className="bg-rojo text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white hover:text-rojo transition-all transform hover:scale-105 shadow-xl shadow-rojo/20"
                >
                  Contactar Soporte Legal
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-colors">
                  <Mail className="text-rojo mb-4" size={24} />
                  <h4 className="font-black uppercase tracking-widest text-xs mb-2">Canal por correo</h4>
                  <p className="text-gray-400 text-sm font-bold">atencion.legal@tbsdestilados.com</p>
                </div>
                <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-colors">
                  <Phone className="text-rojo mb-4" size={24} />
                  <h4 className="font-black uppercase tracking-widest text-xs mb-2">Línea comercial</h4>
                  <p className="text-gray-400 text-sm font-bold">+57 314 581 3569</p>
                </div>
              </div>
            </div>
            {/* Abstract Background Element */}
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-rojo/10 rounded-full blur-3xl" />
          </div>
        </div>
      </main>
    </div>
  );
}
