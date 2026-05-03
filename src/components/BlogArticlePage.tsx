import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User as UserIcon, 
  Share2, 
  ChevronDown,
  ChevronRight,
  Plus,
  Minus,
  MessageSquare,
  ArrowRight,
  Tag
} from 'lucide-react';
import { BlogArticle, User } from '../types';
import { Breadcrumbs } from './Breadcrumbs';
import { SEOHead } from './SEOHead';
import { 
  buildArticleSchema, 
  buildBlogBreadcrumbSchema, 
  buildBlogFAQSchema 
} from '../data/schemaData';

interface BlogArticlePageProps {
  article: BlogArticle;
  articles: BlogArticle[];
  currentUser: User | null;
  onGoHome: () => void;
  onGoBlog: () => void;
  onGoArticle: (slug: string) => void;
  onGoAccessRequest: (role?: 'client' | 'provider') => void;
  onGoCatalog: () => void;
  onGoFAQ: () => void;
  onGoAdvisorChat: () => void;
  onGoPublicLanding: (key: string) => void;
  onGoProviders: () => void;
  onGoClients: () => void;
  onGoServices: () => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  guias_producto: 'Guías de producto',
  sector_licores: 'Sector licores',
  eventos: 'Eventos',
  regalos_empresariales: 'Regalos empresariales',
  maridaje: 'Maridaje',
  cocteleria: 'Coctelería',
  proveedores_marcas: 'Marcas',
  tendencias: 'Tendencias',
  turismo_premium: 'Turismo premium',
  operacion_b2b: 'Operación B2B'
};

const FAQItem: React.FC<{ faq: { question: string, answer: string } }> = ({ faq }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <h4 className="text-lg font-black text-texto group-hover:text-rojo transition-colors pr-8">
          {faq.question}
        </h4>
        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${isOpen ? 'bg-rojo text-white' : 'bg-gray-50 text-gris'}`}>
          {isOpen ? <Minus size={16} /> : <Plus size={16} />}
        </div>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[500px] pb-8' : 'max-h-0'}`}>
        <p className="text-texto-sec font-medium leading-relaxed">
          {faq.answer}
        </p>
      </div>
    </div>
  );
};

export const BlogArticlePage: React.FC<BlogArticlePageProps> = ({
  article,
  articles,
  currentUser,
  onGoHome,
  onGoBlog,
  onGoArticle,
  onGoAccessRequest,
  onGoCatalog,
  onGoFAQ,
  onGoAdvisorChat,
  onGoProviders,
  onGoClients,
  onGoServices
}) => {
  const relatedArticles = useMemo(() => {
    return articles
      .filter(a => a.id !== article.id && (a.category === article.category || a.audience === article.audience))
      .slice(0, 3);
  }, [article, articles]);

  const handleCta = () => {
    switch (article.primaryCtaTarget) {
      case 'accessRequest': onGoAccessRequest('client'); break;
      case 'catalog': onGoCatalog(); break;
      case 'faq': onGoFAQ(); break;
      case 'advisorChat': 
        if (currentUser) onGoAdvisorChat(); 
        else onGoAccessRequest('client'); 
        break;
      case 'providers': onGoProviders(); break;
      case 'clients': onGoClients(); break;
      case 'services': onGoServices(); break;
      default: onGoBlog();
    }
  };

  const schemas = useMemo(() => {
    const list: any[] = [
      buildArticleSchema(article),
      buildBlogBreadcrumbSchema(article)
    ];
    if (article.faqs && article.faqs.length > 0) {
      list.push(buildBlogFAQSchema(article));
    }
    return list;
  }, [article]);

  return (
    <div className="min-h-screen bg-white font-sans text-texto">
      <SEOHead 
        title={article.seoTitle}
        description={article.seoDescription}
        canonicalPath={article.slug}
        jsonLd={schemas}
      />

      {/* Navigation */}
      <div className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-30">
        <div className="max-w-[1440px] mx-auto px-6 pt-10 pb-4 flex items-center justify-between">
          <Breadcrumbs 
            onHomeClick={onGoHome}
            items={[
              { label: 'Guías y recursos', onClick: onGoBlog },
              { label: article.title, current: true }
            ]}
          />
          <button 
            onClick={onGoBlog}
            className="hidden md:flex items-center gap-2 text-xs font-black text-gris hover:text-rojo transition-colors uppercase tracking-widest"
          >
            <ArrowLeft size={14} strokeWidth={3} /> Volver a guías
          </button>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-20">
        <article>
          {/* Header */}
          <header className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rojo-suave/30 text-rojo text-[10px] font-black uppercase tracking-widest mb-6">
              <Tag size={12} strokeWidth={3} />
              {CATEGORY_LABELS[article.category] || article.category}
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-black tracking-tight text-texto mb-6 leading-[1.1]">
              {article.title}
            </h1>

            <p className="text-xl lg:text-2xl text-texto-sec font-medium leading-relaxed mb-8 max-w-4xl italic">
              {article.excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-8 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <UserIcon size={20} className="text-gris" />
                </div>
                <div>
                  <div className="text-[10px] font-black text-gris uppercase tracking-widest">Escrito por</div>
                  <div className="text-sm font-black text-texto">{article.author}</div>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div>
                  <div className="text-[10px] font-black text-gris uppercase tracking-widest mb-0.5 flex items-center gap-1.5">
                    <Calendar size={12} strokeWidth={3} /> Publicado
                  </div>
                  <div className="text-sm font-bold text-texto">{article.publishedAt}</div>
                </div>
                <div>
                  <div className="text-[10px] font-black text-gris uppercase tracking-widest mb-0.5 flex items-center gap-1.5">
                    <Clock size={12} strokeWidth={3} /> Lectura
                  </div>
                  <div className="text-sm font-bold text-texto">{article.readingTime}</div>
                </div>
              </div>
            </div>
          </header>

          {/* Content Sections */}
          <div className="space-y-12">
            {article.sections.map((section, idx) => (
              <div key={idx} className="prose prose-lg max-w-none">
                <h2 className="text-2xl lg:text-3xl font-black text-texto mb-6 flex items-start gap-4">
                  <span className="shrink-0 w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-sm font-black text-gris">
                    {idx + 1}
                  </span>
                  {section.heading}
                </h2>
                <p className="text-lg text-texto-sec font-medium leading-relaxed mb-6 whitespace-pre-line">
                  {section.body}
                </p>
                {section.bullets && section.bullets.length > 0 && (
                  <ul className="space-y-4 my-8">
                    {section.bullets.map((bullet, i) => (
                      <li key={i} className="flex items-start gap-4 text-base font-bold text-texto-sec">
                        <div className="mt-1.5 w-2 h-2 rounded-full bg-rojo shrink-0"></div>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {/* FAQs */}
          {article.faqs && article.faqs.length > 0 && (
            <div className="mt-20 pt-20 border-t border-gray-100">
              <h3 className="text-3xl font-black text-texto mb-4 tracking-tight">Preguntas frecuentes relacionadas</h3>
              <p className="text-texto-sec font-medium mb-10">Toda la información adicional que recopilamos sobre este tema para facilitar tu operación.</p>
              
              <div className="bg-white rounded-3xl border border-gray-100 px-8">
                {article.faqs.map((faq, i) => (
                  <FAQItem key={i} faq={faq} />
                ))}
              </div>
            </div>
          )}

          {/* Contextual CTA */}
          <div className="mt-20 p-8 lg:p-12 bg-rojo text-white rounded-[40px] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 -skew-x-12 translate-x-1/2 group-hover:translate-x-1/3 transition-transform duration-700"></div>
            <div className="relative z-10 max-w-2xl">
              <h3 className="text-3xl lg:text-4xl font-black mb-6 leading-tight">
                Impulsa la rentabilidad de tu negocio con soporte experto.
              </h3>
              <p className="text-lg lg:text-xl font-medium text-white/80 mb-10 leading-relaxed">
                TBS no es solo una plataforma; somos un aliado que entiende los retos de abastecimiento y operación en el sector de licores.
              </p>
              <button 
                onClick={handleCta}
                className="inline-flex items-center gap-3 px-8 py-5 bg-white text-rojo rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/20"
              >
                {article.primaryCtaLabel || 'Saber más'} <ArrowRight size={18} strokeWidth={3} />
              </button>
            </div>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="space-y-12">
          {/* Related Articles */}
          <div className="sticky top-28 space-y-10">
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gris mb-8">Guías relacionadas</h4>
              <div className="space-y-8">
                {relatedArticles.map(a => (
                  <button 
                    key={a.id}
                    onClick={() => onGoArticle(a.slug)}
                    className="group flex flex-col text-left"
                  >
                    <span className="text-[10px] font-bold text-rojo uppercase tracking-widest mb-2">
                      {CATEGORY_LABELS[a.category] || a.category}
                    </span>
                    <h5 className="text-base font-black text-texto mb-2 group-hover:text-rojo transition-colors line-clamp-2">
                      {a.title}
                    </h5>
                    <div className="flex items-center gap-3 text-[10px] font-bold text-gris uppercase tracking-wider">
                      <Clock size={12} strokeWidth={3} /> {a.readingTime}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100">
              <h4 className="text-lg font-black text-texto mb-4">Newsletter B2B</h4>
              <p className="text-xs font-medium text-texto-sec mb-6 leading-relaxed">
                Recibe guías, tendencias de mercado y avisos de stock exclusivo en tu correo.
              </p>
              <div className="space-y-3">
                <input 
                  type="email" 
                  placeholder="Tu correo corporativo"
                  className="w-full h-12 bg-white border border-gray-200 rounded-xl px-4 text-xs font-bold outline-none focus:border-rojo transition-all"
                />
                <button className="w-full h-12 bg-texto text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-black transition-colors">
                  Suscribirse
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-3xl">
              <span className="text-[10px] font-black text-gris uppercase tracking-widest">Compartir</span>
              <div className="flex gap-4">
                <button className="p-2 text-gris hover:text-rojo transition-colors"><Share2 size={18} /></button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
