import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  ArrowRight, 
  BookOpen, 
  ChevronRight,
  Target,
  MessageSquare,
  HelpCircle,
  Menu
} from 'lucide-react';
import { BlogArticle, User, BlogCategory } from '../types';
import { Breadcrumbs } from './Breadcrumbs';
import { SEOHead } from './SEOHead';

interface BlogIndexPageProps {
  articles: BlogArticle[];
  currentUser: User | null;
  onGoHome: () => void;
  onGoArticle: (slug: string) => void;
  onGoAccessRequest: (role?: 'client' | 'provider') => void;
  onGoFAQ: () => void;
  onGoCatalog: () => void;
  onGoAdvisorChat: () => void;
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

const AUDIENCE_LABELS: Record<string, string> = {
  publico: 'Público',
  cliente_b2b: 'Cliente B2B',
  proveedor_marca: 'Proveedor / marca',
  todos: 'Todas'
};

export const BlogIndexPage: React.FC<BlogIndexPageProps> = ({
  articles,
  currentUser,
  onGoHome,
  onGoArticle,
  onGoAccessRequest,
  onGoFAQ,
  onGoCatalog,
  onGoAdvisorChat
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [audienceFilter, setAudienceFilter] = useState<string>('all');

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const matchesSearch = 
        article.title.toLowerCase().includes(search.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(search.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
      
      const matchesCategory = categoryFilter === 'all' || article.category === categoryFilter;
      const matchesAudience = audienceFilter === 'all' || article.audience === audienceFilter || article.audience === 'todos';

      return matchesSearch && matchesCategory && matchesAudience;
    });
  }, [search, categoryFilter, audienceFilter, articles]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(articles.map(a => a.category)));
    return cats;
  }, [articles]);

  const audiences = ['publico', 'cliente_b2b', 'proveedor_marca'];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans text-texto">
      <SEOHead 
        title="Guías y recursos B2B | TBS Destilados"
        description="Guías sobre abastecimiento B2B, licores para restaurantes, eventos, regalos empresariales, maridaje, coctelería y marcas."
        canonicalPath="/guias"
      />

      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1440px] mx-auto px-6 pt-10 pb-10">
          <Breadcrumbs 
            onHomeClick={onGoHome}
            items={[{ label: 'Guías y recursos', current: true }]}
          />
          
          <div className="mt-8">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-texto mb-4">
              Guías y recursos para comprar y operar mejor
            </h1>
            <p className="text-xl text-texto-sec font-medium max-w-3xl leading-relaxed">
              Contenido práctico para clientes B2B, marcas, proveedores, bares, restaurantes, hoteles, eventos y clientes especializados.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mt-12 space-y-6">
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gris" size={20} />
              <input 
                type="text"
                placeholder="Buscar guías por tema, categoría o palabra clave"
                className="w-full h-14 pl-12 pr-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-rojo focus:bg-white transition-all font-semibold"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-4">
              {/* Category Filters */}
              <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
                <button 
                  onClick={() => setCategoryFilter('all')}
                  className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${categoryFilter === 'all' ? 'bg-rojo text-white shadow-lg shadow-rojo/20' : 'bg-white text-texto-sec border border-gray-200 hover:border-rojo/30'}`}
                >
                  Todos
                </button>
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${categoryFilter === cat ? 'bg-rojo text-white shadow-lg shadow-rojo/20' : 'bg-white text-texto-sec border border-gray-200 hover:border-rojo/30'}`}
                  >
                    {CATEGORY_LABELS[cat] || cat}
                  </button>
                ))}
              </div>

              {/* Audience Filters */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-gris shrink-0">Dirigido a:</span>
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                  <button 
                    onClick={() => setAudienceFilter('all')}
                    className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap ${audienceFilter === 'all' ? 'bg-texto text-white' : 'bg-gray-100 text-texto-sec hover:bg-gray-200'}`}
                  >
                    Todas
                  </button>
                  {audiences.map(aud => (
                    <button 
                      key={aud}
                      onClick={() => setAudienceFilter(aud)}
                      className={`px-4 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap ${audienceFilter === aud ? 'bg-texto text-white' : 'bg-gray-100 text-texto-sec hover:bg-gray-200'}`}
                    >
                      {AUDIENCE_LABELS[aud] || aud}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
        {/* Article Grid */}
        <div className="space-y-8">
          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredArticles.map((article, idx) => (
                <motion.div 
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-texto/5 transition-all flex flex-col h-full"
                >
                  <div className="p-8 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1.5 rounded-lg bg-rojo-suave/30 text-rojo text-[10px] font-black uppercase tracking-widest">
                        {CATEGORY_LABELS[article.category] || article.category}
                      </span>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-gris uppercase tracking-wider">
                        <Clock size={12} strokeWidth={3} />
                        {article.readingTime}
                      </div>
                    </div>

                    <h3 className="text-2xl font-black text-texto mb-3 leading-tight group-hover:text-rojo transition-colors line-clamp-2">
                      {article.title}
                    </h3>

                    <p className="text-texto-sec text-sm leading-relaxed mb-6 font-medium line-clamp-3">
                      {article.excerpt}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-8">
                      {article.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[10px] font-bold text-gris/60">#{tag}</span>
                      ))}
                    </div>

                    <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-gris uppercase tracking-wider">{article.publishedAt}</span>
                      <button 
                        onClick={() => onGoArticle(article.slug)}
                        className="flex items-center gap-2 text-xs font-black text-rojo group-hover:translate-x-1 transition-transform uppercase tracking-widest"
                      >
                        Leer guía <ArrowRight size={14} strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-gray-100">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={32} className="text-gris" />
              </div>
              <h3 className="text-xl font-black text-texto">No encontramos guías con esos criterios</h3>
              <p className="mt-2 text-texto-sec font-semibold">Intenta con otros términos o filtros.</p>
              <button 
                onClick={() => { setSearch(''); setCategoryFilter('all'); setAudienceFilter('all'); }}
                className="mt-8 px-6 py-3 bg-rojo text-white rounded-xl text-xs font-black uppercase tracking-widest"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="bg-[#111827] rounded-3xl p-8 text-white sticky top-24">
            <h3 className="text-xl font-black mb-4">¿Necesitas una recomendación para tu negocio?</h3>
            <p className="text-sm font-medium text-white/60 mb-8 leading-relaxed">
              Nuestro equipo comercial experto te ayuda a definir el portafolio ideal según tu ubicación y presupuesto.
            </p>
            
            <div className="space-y-4">
              <button 
                onClick={() => onGoAccessRequest('client')}
                className="w-full h-14 bg-rojo hover:bg-rojo-claro text-white rounded-2xl flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest transition-all"
              >
                Solicitar acceso B2B <ArrowRight size={16} strokeWidth={3} />
              </button>
              
              <button 
                onClick={onGoFAQ}
                className="w-full h-14 bg-white/10 hover:bg-white/20 text-white rounded-2xl flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest transition-all"
              >
                Centro de ayuda <HelpCircle size={16} />
              </button>

              {currentUser && (
                <button 
                  onClick={onGoAdvisorChat}
                  className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest transition-all"
                >
                  Hablar con asesor <MessageSquare size={16} />
                </button>
              )}
            </div>

            <div className="mt-10 pt-10 border-t border-white/10">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4">Audiencia</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-xs font-bold">Hostelería y Restauración</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span className="text-xs font-bold">Marcas e Importadoras</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-xs font-bold">Eventos y Bodas</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
