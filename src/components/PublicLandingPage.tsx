
import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Star, MapPin, Truck, Zap, ShoppingCart, MessageSquare, ChevronRight } from 'lucide-react';
import { Breadcrumbs } from './Breadcrumbs';
import { BrandAdCampaign, User } from '../types';
import { BRAND_AD_CAMPAIGNS } from '../data';
import { AdSlot } from './advertising/AdSlot';

interface LandingData {
  key: string;
  cityName: string;
  heroTitle: string;
  heroSubtitle: string;
  stats: { label: string; value: string }[];
  featuredProducts: any[];
  benefits: { icon: any; title: string; desc: string }[];
}

interface PublicLandingPageProps {
  data: LandingData;
  onGoHome: () => void;
  onGoCatalog: () => void;
  onGoAccessRequest: () => void;
  onGoAdvisorChat: () => void;
  onAdClick?: (campaign: BrandAdCampaign) => void;
  currentUser?: User | null;
}

export function PublicLandingPage({ data, onGoHome, onGoCatalog, onGoAccessRequest, onGoAdvisorChat, onAdClick, currentUser }: PublicLandingPageProps) {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* City Hero */}
      <section className="relative pt-10 pb-24 lg:pt-10 lg:pb-32 overflow-hidden bg-[#F9FAFB] border-b border-borde">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-rojo/5 to-transparent pointer-events-none" />
        
        <div className="max-w-[1480px] mx-auto px-8 relative z-10">
          <Breadcrumbs 
            onHomeClick={onGoHome}
            items={[{ label: `TBS en ${data.cityName}`, current: true }]}
          />

          <div className="mt-12 max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-rojo/10 text-rojo rounded-full text-[10px] font-black uppercase tracking-widest mb-6"
            >
              <MapPin size={12} /> Exclusivo para negocios en {data.cityName}
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl lg:text-9xl font-black tracking-tighter leading-[0.85] text-texto mb-8"
            >
              {data.heroTitle}
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl lg:text-2xl text-gris font-medium leading-relaxed max-w-2xl mb-12"
            >
              {data.heroSubtitle}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <button 
                onClick={onGoAccessRequest}
                className="px-10 py-5 bg-rojo text-white rounded-2xl font-black text-lg tbs-shadow hover:scale-105 transition-all flex items-center gap-3 cursor-pointer"
              >
                Registrar mi Negocio <ArrowRight size={22} />
              </button>
              <button 
                onClick={onGoCatalog}
                className="px-10 py-5 bg-white border-2 border-borde text-texto rounded-2xl font-black text-lg hover:border-rojo transition-all cursor-pointer"
              >
                Ver Catálogo en {data.cityName}
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-texto text-white">
        <div className="max-w-[1480px] mx-auto px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {data.stats.map((stat, i) => (
              <div key={i} className="text-center lg:text-left">
                <div className="text-4xl lg:text-6xl font-black text-rojo tracking-tighter mb-2">{stat.value}</div>
                <div className="text-xs font-black uppercase tracking-widest text-white/50">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24">
        <div className="max-w-[1480px] mx-auto px-8">
          <div className="mb-16">
            <h2 className="text-3xl font-black tracking-tight mb-2">Marcas destacadas en {data.cityName}</h2>
            <p className="text-gris font-medium">Marcas premium con las que trabajamos para llevar calidad a tu negocio.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AdSlot 
              placement="catalog_top_banner"
              campaigns={BRAND_AD_CAMPAIGNS}
              currentUser={currentUser}
              city={data.cityName}
              onAdClick={onAdClick || (() => {})}
              maxItems={3}
            />
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-[1480px] mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {data.benefits.map((benefit, i) => (
              <div key={i} className="group">
                <div className="w-16 h-16 bg-rojo-suave rounded-3xl flex items-center justify-center text-rojo mb-8 group-hover:bg-rojo group-hover:text-white transition-all duration-300">
                  <benefit.icon size={32} />
                </div>
                <h3 className="text-2xl font-black text-texto mb-4">{benefit.title}</h3>
                <p className="text-gris font-medium leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Local Focus */}
      <section className="py-24 bg-gray-50 overflow-hidden">
        {/* Visibility for Brands Section */}
        <div className="max-w-[1480px] mx-auto px-8 mb-24">
          <div className="bg-white rounded-[40px] border border-borde p-12 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-rojo/5 rounded-full -mr-32 -mt-32 transition-transform group-hover:scale-110 duration-700" />
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
                <div className="lg:w-1/2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-rojo/10 text-rojo rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                    Para Marcas e Importadoras
                  </div>
                  <h2 className="text-4xl lg:text-5xl font-black tracking-tighter mb-6 underline decoration-rojo decoration-4 underline-offset-8">
                    Visibilidad para marcas dentro del canal B2B
                  </h2>
                  <p className="text-lg text-gris font-medium mb-8 leading-relaxed">
                    TBS permite que marcas e importadoras activen productos y campañas dentro del portal con formatos de visibilidad comercial diseñados para no interrumpir la compra del cliente.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-6 mb-10">
                    {[
                      { label: 'Banners Premium', desc: 'Home y catálogo' },
                      { label: 'Producto Patrocinado', desc: 'Ranking prioritario' },
                      { label: 'Campaña de Marca', desc: 'Landings dedicadas' },
                      { label: 'Cupones B2B', desc: 'Incentivos de compra' },
                    ].map((item, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="w-5 h-5 rounded-full bg-rojo flex items-center justify-center text-white mt-0.5 shrink-0">
                          <Star size={10} fill="currentColor" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-texto">{item.label}</p>
                          <p className="text-xs text-gris">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={onGoAdvisorChat}
                    className="px-8 py-4 bg-texto text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-rojo transition-all tbs-shadow flex items-center gap-2 cursor-pointer"
                  >
                    Quiero activar mi marca en TBS <ChevronRight size={16} />
                  </button>
                </div>
                <div className="lg:w-5/12 grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                      <img src="https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&q=80&w=400" alt="Visibility 1" className="w-full h-full object-cover" />
                    </div>
                    <div className="aspect-[1/1] bg-rojo rounded-2xl flex items-center justify-center p-6 text-center">
                      <p className="text-white font-black text-lg leading-tight italic">Tu marca donde los negocios compran.</p>
                    </div>
                  </div>
                  <div className="space-y-4 pt-8">
                     <div className="aspect-[1/1] bg-[#303844] rounded-2xl flex items-center justify-center p-6 text-center">
                      <p className="text-white font-black text-3xl tracking-tighter">+5k</p>
                      <p className="text-white/50 font-bold text-[10px] uppercase tracking-widest absolute bottom-4">Puntos de venta</p>
                    </div>
                    <div className="aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 delay-100">
                      <img src="https://images.unsplash.com/photo-1541532713292-0c2a8093de2a?auto=format&fit=crop&q=80&w=400" alt="Visibility 2" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1480px] mx-auto px-8">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2">
              <h2 className="text-4xl lg:text-6xl font-black tracking-tighter mb-8 italic">
                Abastecemos los mejores bares de {data.cityName}.
              </h2>
              <p className="text-lg text-gris font-medium mb-10 leading-relaxed">
                Nuestra red logística local garantiza que tu pedido llegue fresco y a tiempo, 
                sin importar el volumen. Conocemos las zonas de entrega y tus horarios operativos.
              </p>
              <div className="space-y-4">
                {[
                  'Despacho inmediato desde bodegas locales',
                  'Soporte comercial presencial en tu zona',
                  'Crédito B2B para impulsar tu rotación',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 text-texto font-black">
                    <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center">
                      <Star size={14} fill="currentColor" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 relative">
               <img 
                 src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800"
                 alt={`Operación TBS ${data.cityName}`}
                 className="rounded-[40px] shadow-2xl relative z-10 grayscale hover:grayscale-0 transition-all duration-700"
               />
               <div className="absolute -top-10 -right-10 w-64 h-64 bg-rojo/10 rounded-full blur-3xl" />
               <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-[#303844]/10 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* City CTA */}
      <section className="py-32 bg-rojo text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-8 relative z-10">
          <h2 className="text-5xl lg:text-[100px] font-black tracking-tighter leading-[0.8] mb-12 strike-through">
            Empieza hoy mismo en {data.cityName}.
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
             <button 
               onClick={onGoAccessRequest}
               className="px-12 py-6 bg-white text-rojo rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-2xl cursor-pointer"
             >
               Solicitar Acceso B2B
             </button>
             <button 
               onClick={onGoAdvisorChat}
               className="px-12 py-6 bg-texto text-white rounded-2xl font-black text-xl hover:bg-black transition-all cursor-pointer flex items-center gap-3"
             >
               Hablar con Asesor <MessageSquare size={24} />
             </button>
          </div>
        </div>
      </section>
    </div>
  );
}
