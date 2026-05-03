import React from 'react';
import { motion } from 'motion/react';
import { CampaignPageData, Product, User } from '../../types';
import { SEOHead } from '../SEOHead';
import { ArrowLeft, MessageSquare, Briefcase, CheckCircle2, ShieldCheck, Tag, ShoppingCart, Info } from 'lucide-react';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useEffect } from 'react';

interface CampaignPageProps {
  campaignPage: CampaignPageData;
  products: Product[];
  currentUser: User | null;
  onGoCatalog: () => void;
  onGoAdvisorChat: (topic?: any, context?: any) => void;
  onGoAccessRequest: (role?: 'client' | 'provider') => void;
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product, source?: string) => void;
}

export function CampaignPage({
  campaignPage,
  products,
  currentUser,
  onGoCatalog,
  onGoAdvisorChat,
  onGoAccessRequest,
  onProductClick,
  onAddToCart
}: CampaignPageProps) {
  const analytics = useAnalytics(currentUser);

  useEffect(() => {
    analytics.track('campaign_page_viewed', 'advertising', {
      metadata: {
        campaignId: campaignPage.id,
        campaignSlug: campaignPage.slug,
        brandName: campaignPage.brandName
      }
    });
    window.scrollTo(0,0);
  }, [campaignPage, analytics]);

  const featuredProducts = products.filter(p => campaignPage.featuredProductIds.includes(p.id));

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <SEOHead 
        title={`${campaignPage.title} | TBS Destilados`}
        description={campaignPage.description}
        canonicalPath={`/campanas/${campaignPage.slug}`}
      />

      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px] overflow-hidden bg-black">
        {campaignPage.heroImage && (
          <img 
            src={campaignPage.heroImage} 
            alt={campaignPage.title} 
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#F8FAFC] via-transparent to-transparent" />
        
        <div className="absolute inset-0">
          <div className="max-w-[1480px] mx-auto px-8 h-full flex flex-col justify-end pb-20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              <div className="flex items-center gap-4 mb-6">
                <button 
                  onClick={onGoCatalog}
                  className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-rojo transition-all"
                >
                  <ArrowLeft size={20} />
                </button>
                <span className="px-3 py-1 bg-rojo text-[10px] font-black uppercase tracking-[0.2em] rounded text-white shadow-xl">
                  Campaña Destacada
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-[72px] font-black text-white tracking-tighter leading-tight mb-6">
                {campaignPage.title}
              </h1>
              
              <p className="text-lg md:text-xl font-bold text-white/90 max-w-2xl leading-relaxed">
                {campaignPage.subtitle}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="max-w-[1480px] mx-auto px-8 -mt-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Description Card */}
            <div className="bg-white rounded-[40px] p-10 md:p-12 shadow-xl shadow-black/5 border border-borde">
              <div className="flex flex-col md:flex-row gap-10">
                {campaignPage.logo && (
                  <div className="w-32 h-32 bg-gray-50 rounded-3xl p-6 border border-borde flex items-center justify-center shrink-0">
                    <img 
                      src={campaignPage.logo} 
                      alt={campaignPage.brandName} 
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
                <div>
                  <h2 className="text-[13px] font-black text-rojo uppercase tracking-widest mb-4">Sobre la campaña</h2>
                  <p className="text-lg font-medium text-texto leading-relaxed">
                    {campaignPage.description}
                  </p>
                  
                  <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {campaignPage.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-3 bg-gray-50 p-4 rounded-2xl border border-borde/50">
                        <div className="w-6 h-6 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle2 size={14} />
                        </div>
                        <span className="text-[13px] font-bold text-texto-sec">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Products */}
            {featuredProducts.length > 0 && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-texto">Portafolio destacado</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featuredProducts.map(product => (
                    <div 
                      key={product.id}
                      onClick={() => onProductClick(product)}
                      className="bg-white p-6 rounded-3xl border border-borde group cursor-pointer hover:border-rojo transition-all relative flex flex-col h-full"
                    >
                      <div className="flex gap-6">
                        <div className="w-24 h-24 bg-gray-50 rounded-2xl overflow-hidden shrink-0">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="text-[10px] font-black text-rojo uppercase tracking-widest mb-1">{product.category}</div>
                          <h4 className="text-lg font-black text-texto group-hover:text-rojo transition-colors">{product.name}</h4>
                          <p className="text-xs font-bold text-gris">{product.specs}</p>
                          <div className="mt-4 flex items-center justify-between">
                            <span className="text-lg font-black text-texto">{product.price}</span>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                onAddToCart(product, 'campaign_page');
                              }}
                              className="w-10 h-10 bg-texto text-white rounded-lg flex items-center justify-center hover:bg-rojo transition-colors"
                            >
                              <ShoppingCart size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Terms */}
            {campaignPage.terms && campaignPage.terms.length > 0 && (
              <div className="p-8 bg-gray-100/50 rounded-[32px] border border-borde/40">
                <h4 className="text-[11px] font-black text-gris uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Info size={14} /> Términos y condiciones de la campaña
                </h4>
                <ul className="space-y-3">
                  {campaignPage.terms.map((term, idx) => (
                    <li key={idx} className="text-[11px] font-bold text-gris/60 flex items-start gap-2">
                      <span className="w-1 h-1 rounded-full bg-gris/40 mt-1.5 shrink-0" />
                      {term}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar Sidebar CTA */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-[#303844] rounded-[40px] p-10 text-white shadow-2xl shadow-black/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rojo/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                
                <h3 className="text-2xl font-black mb-4 relative z-10">Activa esta oportunidad comercial</h3>
                <p className="text-white/70 text-sm font-medium mb-8 leading-relaxed relative z-10">
                  {currentUser ? 'Habla con tu asesor para validar condiciones y disponibilidad para tu negocio.' : 'Regístrate como cliente B2B o solicita acceso para conocer los beneficios de esta marca.'}
                </p>
                
                <div className="space-y-4 mb-8 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-rojo">
                      <ShieldCheck size={18} />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-widest">Validación TBS</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-rojo">
                      <Briefcase size={18} />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-widest">Soporte Ejecutivo</span>
                  </div>
                </div>

                {currentUser ? (
                  <button 
                    onClick={() => {
                      analytics.trackCta('campaign_advisor_chat', 'campaign_page');
                      onGoAdvisorChat('activacion', { label: 'Campaña: ' + campaignPage.campaignName, type: 'comercial' });
                    }}
                    className="w-full h-14 bg-rojo text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-rojo-oscuro hover:scale-[1.02] active:scale-100 transition-all shadow-xl shadow-rojo/20"
                  >
                    <MessageSquare size={20} />
                    {campaignPage.ctaLabel || 'Consultar con asesor'}
                  </button>
                ) : (
                  <button 
                    onClick={() => onGoAccessRequest('client')}
                    className="w-full h-14 bg-white text-[#303844] rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-rojo hover:text-white hover:scale-[1.02] active:scale-100 transition-all shadow-xl"
                  >
                    <Briefcase size={20} />
                    Solicitar acceso B2B
                  </button>
                )}
                
                <p className="mt-6 text-[10px] font-bold text-white/40 text-center uppercase tracking-widest">
                  Operación disponible en: Cartagena, Barranquilla y Santa Marta.
                </p>
              </div>

              <div className="bg-white border border-borde rounded-[32px] p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Tag size={18} className="text-rojo" />
                  <h4 className="text-sm font-black text-texto">Otras campañas activas</h4>
                </div>
                <div className="space-y-4">
                  {/* Small placeholders for other campaigns */}
                  <div className="flex items-center gap-4 group cursor-pointer" onClick={onGoCatalog}>
                    <div className="w-12 h-12 rounded-xl bg-gray-100 border border-borde overflow-hidden group-hover:border-rojo transition-all">
                      <div className="w-full h-full bg-rojo/5" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-texto uppercase tracking-widest group-hover:text-rojo transition-colors">Portafolio Gin 2026</div>
                      <div className="text-[9px] font-bold text-gris">Explorar ahora →</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="h-24" />
    </div>
  );
}
