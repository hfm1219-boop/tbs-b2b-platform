
import React from 'react';
import { ChevronRight, ExternalLink, Shield, Info, ArrowLeft, Mail, MessageSquare } from 'lucide-react';
import { LegalPageData, LegalPageKey } from '../../types';
import { SEOHead } from '../SEOHead';
import { Breadcrumbs } from '../Breadcrumbs';

interface LegalPageProps {
  pageData: LegalPageData;
  onGoHome: () => void;
  onGoContact: () => void;
  onGoLegalPage: (key: LegalPageKey) => void;
}

export function LegalPage({ pageData, onGoHome, onGoContact, onGoLegalPage }: LegalPageProps) {
  const sections = pageData.sections;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <SEOHead 
        title={pageData.seoTitle}
        description={pageData.seoDescription}
        canonicalPath={pageData.slug}
      />
      
      <main className="flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-2 text-rojo font-black uppercase tracking-widest text-xs mb-6">
              <Shield size={16} />
              <span>Capa Legal y Privacidad</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-6">
              {pageData.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-gray-500 mb-8">
              <div className="flex items-center gap-2">
                <Info size={14} className="text-rojo" />
                <span>Última actualización: {pageData.updatedAt}</span>
              </div>
            </div>

            <div className="bg-rojo/5 border-l-4 border-rojo p-6 rounded-r-xl mb-10">
              <p className="text-rojo font-bold text-sm">
                NOTA IMPORTANTE: Este texto es una base operativa para revisión legal antes de producción.
              </p>
            </div>

            <p className="text-lg text-gray-600 leading-relaxed font-medium">
              {pageData.intro}
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar Navigation (Sticky on desktop) */}
            <aside className="lg:w-1/4">
              <div className="lg:sticky lg:top-36 space-y-2">
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4 px-4">En esta política</h3>
                {sections.map((section) => (
                  <a 
                    key={section.id}
                    href={`#${section.id}`}
                    className="block px-4 py-3 rounded-lg text-sm font-bold text-gray-600 hover:bg-white hover:text-rojo border border-transparent hover:border-gray-100 transition-all"
                  >
                    {section.title}
                  </a>
                ))}
              </div>
            </aside>

            {/* Main Content Sections */}
            <div className="lg:w-3/4 space-y-16">
              {sections.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-36">
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-6 pb-2 border-b-2 border-gray-100 flex items-center gap-3">
                    {section.title}
                  </h2>
                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-600 leading-relaxed font-medium">
                      {section.body}
                    </p>
                    {section.bullets && section.bullets.length > 0 && (
                      <ul className="mt-6 space-y-3">
                        {section.bullets.map((bullet, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-gray-600 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-rojo mt-2.5 shrink-0" />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </section>
              ))}

              {/* Final Footer CTA */}
              <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm mt-20">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="text-center md:text-left">
                    <h3 className="text-xl font-black text-gray-900 tracking-tight mb-2">¿Tienes dudas sobre esta política?</h3>
                    <p className="text-gray-500 font-bold">Nuestro equipo legal y de soporte está listo para apoyarte.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <button 
                      onClick={onGoContact}
                      className="w-full sm:w-auto bg-[#1A1F26] text-white px-8 py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-gray-200"
                    >
                      <Mail size={18} />
                      Contacto
                    </button>
                    <button 
                      onClick={() => onGoLegalPage('ageNotice')}
                      className="w-full sm:w-auto bg-gray-100 text-gray-900 px-8 py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                      Ayuda
                    </button>
                  </div>
                </div>
              </div>

              {/* Related Pages */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-gray-100">
                {(['privacy', 'dataTreatment', 'terms', 'cookies', 'ageNotice'] as LegalPageKey[])
                  .filter(k => k !== pageData.key)
                  .map(key => (
                    <button
                      key={key}
                      onClick={() => {
                        onGoLegalPage(key);
                        window.scrollTo(0, 0);
                      }}
                      className="text-xs font-black text-gray-400 hover:text-rojo uppercase tracking-widest py-2 transition-colors text-left"
                    >
                      {key === 'privacy' && 'Privacidad'}
                      {key === 'dataTreatment' && 'Tratamiento de Datos'}
                      {key === 'terms' && 'Términos y Condiciones'}
                      {key === 'cookies' && 'Cookies'}
                      {key === 'ageNotice' && 'Consumo Responsable'}
                    </button>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
