import React, { useState, useMemo } from 'react';
import { 
  Search, 
  HelpCircle, 
  ChevronDown, 
  ThumbsUp, 
  ThumbsDown, 
  ArrowLeft, 
  UserPlus, 
  ShieldCheck, 
  MessageSquare, 
  Eye, 
  Target, 
  ShoppingCart, 
  CreditCard, 
  Truck, 
  RotateCcw, 
  List, 
  Zap, 
  Users, 
  BarChart3, 
  Tag, 
  CheckCircle2,
  Clock,
  Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FAQItem, FAQAudience, FAQCategory, User } from '../types';

interface FAQPageProps {
  currentUser: User | null;
  faqItems: FAQItem[];
  onGoHome: () => void;
  onGoAccessRequest: (role?: 'client' | 'provider') => void;
  onGoLogin: () => void;
  onGoCatalog: () => void;
  onGoAccount: () => void;
  onGoPayments: () => void;
  onGoOrdersTracking: () => void;
  onGoUrgentOrder: () => void;
  onGoReorder: () => void;
  onGoShoppingLists: () => void;
  onGoPromotions: () => void;
  onGoIntelligence: () => void;
  onGoAdvisorChat: (topic?: any, context?: any) => void;
  onGoProviderDashboard: () => void;
  onGoB2BAccountAdmin: () => void;
  onGoOrderApprovals: () => void;
}

const CATEGORY_LABELS: Record<FAQCategory, string> = {
  general: 'General',
  acceso: 'Acceso',
  catalogo: 'Catálogo',
  pedidos: 'Pedidos',
  cartera_pagos: 'Cartera y Pagos',
  seguimiento: 'Seguimiento',
  pedido_urgente: 'Pedido Urgente',
  cuenta_usuarios: 'Cuenta y Usuarios',
  aprobaciones: 'Aprobaciones',
  promociones: 'Promociones',
  listas_reordenar: 'Listas y Reordenar',
  inteligencia: 'Inteligencia',
  asesor_chat: 'Asesor y Chat',
  proveedores_marcas: 'Proveedores y Marcas',
  seguridad: 'Seguridad',
  soporte: 'Soporte'
};

export const FAQPage: React.FC<FAQPageProps> = ({ 
  currentUser, 
  faqItems, 
  onGoHome,
  onGoAccessRequest,
  onGoLogin,
  onGoCatalog,
  onGoAccount,
  onGoPayments,
  onGoOrdersTracking,
  onGoUrgentOrder,
  onGoReorder,
  onGoShoppingLists,
  onGoPromotions,
  onGoIntelligence,
  onGoAdvisorChat,
  onGoProviderDashboard,
  onGoB2BAccountAdmin,
  onGoOrderApprovals
}) => {
  const [search, setSearch] = useState('');
  const [audienceFilter, setAudienceFilter] = useState<'todas' | FAQAudience>('todas');
  const [categoryFilter, setCategoryFilter] = useState<'todas' | FAQCategory>('todas');
  const [openId, setOpenId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, 'helpful' | 'not_helpful' | undefined>>({});

  const filteredItems = useMemo(() => {
    return faqItems.filter(item => {
      const matchesSearch = 
        item.question.toLowerCase().includes(search.toLowerCase()) || 
        item.answer.toLowerCase().includes(search.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase())) ||
        CATEGORY_LABELS[item.category].toLowerCase().includes(search.toLowerCase());

      const matchesAudience = audienceFilter === 'todas' || 
        item.audience === audienceFilter || 
        item.audience === 'todos';

      const matchesCategory = categoryFilter === 'todas' || item.category === categoryFilter;

      return matchesSearch && matchesAudience && matchesCategory;
    });
  }, [faqItems, search, audienceFilter, categoryFilter]);

  const handleFAQAction = (item: FAQItem) => {
    if (!item.relatedActionTarget) return;

    switch (item.relatedActionTarget) {
      case 'accessRequest':
        onGoAccessRequest(item.audience === 'proveedor_marca' ? 'provider' : 'client');
        break;
      case 'login':
        onGoLogin();
        break;
      case 'catalog':
        onGoCatalog();
        break;
      case 'account':
        currentUser ? onGoAccount() : onGoLogin();
        break;
      case 'payments':
        currentUser ? onGoPayments() : onGoLogin();
        break;
      case 'ordersTracking':
        currentUser ? onGoOrdersTracking() : onGoLogin();
        break;
      case 'urgentOrder':
        currentUser ? onGoUrgentOrder() : onGoLogin();
        break;
      case 'reorder':
        currentUser ? onGoReorder() : onGoLogin();
        break;
      case 'shoppingLists':
        currentUser ? onGoShoppingLists() : onGoLogin();
        break;
      case 'promotions':
        currentUser ? onGoPromotions() : onGoLogin();
        break;
      case 'intelligence':
        currentUser ? onGoIntelligence() : onGoLogin();
        break;
      case 'advisorChat':
        currentUser 
          ? onGoAdvisorChat('soporte', { label: 'FAQ', value: item.question }) 
          : onGoAccessRequest('client');
        break;
      case 'providerDashboard':
        if (currentUser?.role === 'marca' || currentUser?.role === 'proveedor') {
          onGoProviderDashboard();
        } else {
          onGoAccessRequest('provider');
        }
        break;
      case 'b2bAccountAdmin':
        currentUser ? onGoB2BAccountAdmin() : onGoLogin();
        break;
      case 'orderApprovals':
        currentUser ? onGoOrderApprovals() : onGoLogin();
        break;
      default:
        break;
    }
  };

  const handleFeedback = (id: string, type: 'helpful' | 'not_helpful') => {
    setFeedback(prev => ({ ...prev, [id]: type }));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      {/* Header section */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <button 
            onClick={onGoHome}
            className="flex items-center gap-2 text-gris hover:text-rojo transition-colors font-bold text-sm uppercase tracking-wider"
          >
            <ArrowLeft size={18} /> Volver al Inicio
          </button>
          <div className="flex items-center gap-2 text-rojo font-black text-xl tracking-tighter">
            TBS Help Center
          </div>
        </div>
      </div>

      {/* Hero / Search section */}
      <div className="bg-rojo py-16 px-4 md:px-8 text-white relative overflow-hidden">
        <HelpCircle className="absolute -right-12 -bottom-12 w-96 h-96 text-white/5 rotate-12" />
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Centro de ayuda</h1>
          <p className="text-lg opacity-90 mb-10 max-w-2xl mx-auto">
            Encuentra respuestas sobre acceso B2B, catálogo, pedidos, pagos, seguimiento, usuarios, proveedores y soporte.
          </p>

          <div className="relative max-w-2xl mx-auto group">
            <input 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por palabra clave, pedidos, pagos, usuarios, promociones..."
              className="w-full bg-white text-texto h-16 pl-14 pr-6 rounded-2xl shadow-2xl focus:outline-none focus:ring-4 focus:ring-white/20 transition-all font-medium text-lg"
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gris group-focus-within:text-rojo transition-colors" size={24} />
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-8 -mt-8 relative z-20">
        {/* Quick access cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <button 
            onClick={() => {
              setAudienceFilter('cliente_b2b');
              setCategoryFilter('todas');
              const el = document.getElementById('faq-content');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
          >
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Building2 size={28} />
            </div>
            <h3 className="font-black text-sm uppercase tracking-wider mb-1">Soy cliente B2B</h3>
            <p className="text-xs text-gris font-medium">Pedidos, pagos y equipo</p>
          </button>

          <button 
            onClick={() => {
              setAudienceFilter('proveedor_marca');
              setCategoryFilter('todas');
              const el = document.getElementById('faq-content');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
          >
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Zap size={28} />
            </div>
            <h3 className="font-black text-sm uppercase tracking-wider mb-1">Soy proveedor o marca</h3>
            <h3 className="text-xs text-gris font-medium">Ventas y rotación</h3>
          </button>

          <button 
            onClick={() => onGoAccessRequest('client')}
            className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
          >
            <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <UserPlus size={28} />
            </div>
            <h3 className="font-black text-sm uppercase tracking-wider mb-1">Quiero solicitar acceso</h3>
            <p className="text-xs text-gris font-medium">Unirse a la red TBS</p>
          </button>

          <button 
            onClick={() => currentUser ? onGoAdvisorChat('soporte', { label: 'FAQ', value: 'Centro de ayuda' }) : onGoAccessRequest('client')}
            className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
          >
            <div className="w-14 h-14 bg-rojo/5 text-rojo rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MessageSquare size={28} />
            </div>
            <h3 className="font-black text-sm uppercase tracking-wider mb-1">Necesito soporte</h3>
            <p className="text-xs text-gris font-medium">Hablar con un experto</p>
          </button>
        </div>

        <div id="faq-content" className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar filters */}
          <aside className="w-full lg:w-72 shrink-0 space-y-8 sticky top-8">
            {/* Audience filter */}
            <div>
              <h4 className="font-black text-xs uppercase tracking-widest text-gris mb-4 flex items-center gap-2">
                <Users size={14} /> Audiencia
              </h4>
              <div className="flex flex-col gap-2">
                {[
                  { value: 'todas', label: 'Todas' },
                  { value: 'publico', label: 'Público' },
                  { value: 'cliente_b2b', label: 'Cliente B2B' },
                  { value: 'proveedor_marca', label: 'Proveedor / Marca' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setAudienceFilter(opt.value as any)}
                    className={`text-left px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                      audienceFilter === opt.value 
                        ? 'bg-rojo text-white shadow-lg' 
                        : 'text-gris hover:bg-gray-100'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category filter */}
            <div>
              <h4 className="font-black text-xs uppercase tracking-widest text-gris mb-4 flex items-center gap-2">
                <List size={14} /> Categoría
              </h4>
              <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                <button
                  onClick={() => setCategoryFilter('todas')}
                  className={`text-left px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    categoryFilter === 'todas' 
                      ? 'bg-rojo text-white shadow-lg' 
                      : 'text-gris hover:bg-gray-100'
                  }`}
                >
                  Todas las categorías
                </button>
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setCategoryFilter(key as FAQCategory)}
                    className={`text-left px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                      categoryFilter === key 
                        ? 'bg-rojo text-white shadow-lg' 
                        : 'text-gris hover:bg-gray-100'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* FAQ Accordion list */}
          <div className="flex-1 w-full space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredItems.length > 0 ? (
                filteredItems.map(item => (
                  <motion.div
                    layout
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all ${openId === item.id ? 'ring-2 ring-rojo/20' : ''}`}
                  >
                    <button 
                      onClick={() => setOpenId(openId === item.id ? null : item.id)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left group"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${openId === item.id ? 'bg-rojo text-white' : 'bg-gray-50 text-gris group-hover:bg-rojo/5 group-hover:text-rojo'}`}>
                          <HelpCircle size={20} />
                        </div>
                        <div>
                          <h3 className="font-bold text-texto transition-colors">{item.question}</h3>
                          <div className="flex flex-wrap items-center gap-3 mt-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-rojo">
                              {CATEGORY_LABELS[item.category]}
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gris opacity-60">
                              {item.audience === 'todos' ? 'Todos' : item.audience.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <ChevronDown 
                        size={20} 
                        className={`text-gris transition-transform duration-300 ${openId === item.id ? 'rotate-180 text-rojo' : ''}`} 
                      />
                    </button>

                    <AnimatePresence>
                      {openId === item.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="px-6 pb-6 pt-2 border-t border-gray-50">
                            <div className="text-gris font-medium leading-relaxed mb-6 whitespace-pre-wrap">
                              {item.answer}
                            </div>

                            <div className="flex flex-wrap items-center gap-2 mb-8">
                              {item.tags.map(tag => (
                                <span key={tag} className="px-2.5 py-1 bg-gray-50 text-[10px] font-bold text-gris rounded-lg">
                                  #{tag}
                                </span>
                              ))}
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 bg-gray-50 rounded-2xl">
                              {item.relatedActionTarget && (
                                <button 
                                  onClick={() => handleFAQAction(item)}
                                  className="w-full sm:w-auto px-6 py-3 bg-rojo text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                                >
                                  {item.relatedActionLabel || 'Ver más'}
                                </button>
                              )}

                              <div className="flex flex-col sm:items-end gap-2 text-center sm:text-right">
                                <span className="text-[10px] font-black text-gris uppercase tracking-widest">¿Te fue útil esta respuesta?</span>
                                {feedback[item.id] ? (
                                  <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center sm:items-end gap-1"
                                  >
                                    <div className="flex items-center gap-2 text-green-600 font-bold text-xs">
                                      <CheckCircle2 size={16} /> Gracias por tu respuesta.
                                    </div>
                                    {feedback[item.id] === 'not_helpful' && (
                                      <div className="flex flex-col items-center sm:items-end gap-2 mt-2">
                                        <p className="text-[10px] font-medium text-gris italic">Puedes contactar a TBS para recibir ayuda personalizada.</p>
                                        <button 
                                          onClick={() => currentUser ? onGoAdvisorChat('soporte', { label: 'FAQ', value: item.question }) : onGoAccessRequest('client')}
                                          className="text-[10px] font-black text-rojo uppercase tracking-wider hover:underline"
                                        >
                                          {currentUser ? 'Abrir chat interno' : 'Solicitar acceso'}
                                        </button>
                                      </div>
                                    )}
                                  </motion.div>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <button 
                                      onClick={() => handleFeedback(item.id, 'helpful')}
                                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gris hover:text-green-600 hover:border-green-200 transition-all"
                                    >
                                      <ThumbsUp size={14} /> <span className="text-[10px] font-bold">Sí</span>
                                    </button>
                                    <button 
                                      onClick={() => handleFeedback(item.id, 'not_helpful')}
                                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gris hover:text-red-600 hover:border-red-200 transition-all"
                                    >
                                      <ThumbsDown size={14} /> <span className="text-[10px] font-bold">No</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white p-12 rounded-[40px] text-center border border-gray-100 shadow-sm"
                >
                  <div className="w-20 h-20 bg-gray-50 text-gris/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search size={40} />
                  </div>
                  <h3 className="text-2xl font-black mb-2">No encontramos resultados</h3>
                  <p className="text-gris font-medium mb-8 max-w-sm mx-auto">Prueba con otra palabra clave o contacta a TBS para recibir ayuda.</p>
                  
                  <div className="flex flex-wrap justify-center gap-4">
                    <button 
                      onClick={() => { setSearch(''); setCategoryFilter('todas'); setAudienceFilter('todas'); }}
                      className="px-8 py-3.5 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all active:scale-95"
                    >
                      Limpiar búsqueda
                    </button>
                    <button 
                      onClick={() => currentUser ? onGoAdvisorChat('soporte', { label: 'FAQ', value: 'Búsqueda sin éxito' }) : onGoAccessRequest('client')}
                      className="px-8 py-3.5 bg-rojo text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg active:scale-95"
                    >
                      {currentUser ? 'Abrir chat interno' : 'Solicitar acceso'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Final CTA section */}
        <div className="mt-20 p-12 bg-white rounded-[40px] border border-gray-100 shadow-xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-rojo/5 rounded-full -mr-32 -mt-32 transition-transform group-hover:scale-110 duration-700" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div className="max-w-xl">
              <h2 className="text-3xl font-black mb-4 tracking-tight">¿Necesitas ayuda personalizada?</h2>
              {currentUser ? (
                <p className="text-gris font-medium text-lg leading-relaxed">
                  Comunícate con tu asesor o ejecutivo TBS desde el chat interno sin salir de la plataforma.
                </p>
              ) : (
                <p className="text-gris font-medium text-lg leading-relaxed">
                  Solicita acceso B2B y un asesor TBS revisará tu información para brindarte atención directa.
                </p>
              )}
            </div>
            
            <button 
              onClick={() => currentUser ? onGoAdvisorChat('soporte', { label: 'FAQ', value: 'Ayuda personalizada' }) : onGoAccessRequest('client')}
              className="px-10 py-5 bg-rojo text-white rounded-[20px] font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl hover:shadow-rojo/20 active:scale-95 flex items-center gap-3 shrink-0"
            >
              {currentUser ? <><MessageSquare size={18} /> Abrir chat interno</> : <><UserPlus size={18} /> Solicitar acceso B2B</>}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
