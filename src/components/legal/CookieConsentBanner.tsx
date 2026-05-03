
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cookie, X, Check, Settings, Shield, Info } from 'lucide-react';
import { CookiePreference, CookieCategory } from '../../types';
import { COOKIE_PREFERENCES_DEFAULT } from '../../data/legalData';

interface CookieConsentBannerProps {
  onGoCookiePolicy: () => void;
  onConsentChange?: (preferences: CookiePreference[]) => void;
}

export function CookieConsentBanner({ onGoCookiePolicy, onConsentChange }: CookieConsentBannerProps) {
  const [show, setShow] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreference[]>(COOKIE_PREFERENCES_DEFAULT);

  useEffect(() => {
    const consentSet = localStorage.getItem('tbs_cookie_consent_set');
    const savedPreferences = localStorage.getItem('tbs_cookie_preferences');
    
    if (!consentSet) {
      // Small delay to make it appear smoothly after initial load
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    } else if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        setPreferences(parsed);
      } catch (e) {
        console.error('Error parsing saved cookie preferences', e);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const allEnabled = preferences.map(p => ({ ...p, enabled: true }));
    saveConsent(allEnabled);
  };

  const handleRejectNonEssential = () => {
    const onlyEssential = preferences.map(p => ({ 
      ...p, 
      enabled: p.required || false 
    }));
    saveConsent(onlyEssential);
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
  };

  const saveConsent = (updatedPreferences: CookiePreference[]) => {
    localStorage.setItem('tbs_cookie_consent_set', 'true');
    localStorage.setItem('tbs_cookie_preferences', JSON.stringify(updatedPreferences));
    setPreferences(updatedPreferences);
    setShow(false);
    setShowPreferences(false);
    if (onConsentChange) {
      onConsentChange(updatedPreferences);
    }
  };

  const togglePreference = (category: CookieCategory) => {
    setPreferences(prev => prev.map(p => {
      if (p.category === category && !p.required) {
        return { ...p, enabled: !p.enabled };
      }
      return p;
    }));
  };

  return (
    <>
      <AnimatePresence>
        {show && !showPreferences && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
          >
            <div className="max-w-[1280px] mx-auto bg-[#1A1F26] text-white rounded-[32px] p-6 md:p-8 shadow-2xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-start gap-4 flex-grow">
                <div className="w-12 h-12 bg-rojo/20 rounded-2xl flex items-center justify-center shrink-0">
                  <Cookie className="text-rojo" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight mb-2">Preferencias de cookies y medición</h3>
                  <p className="text-gray-400 text-sm font-bold leading-relaxed max-w-2xl">
                    Utilizamos cookies esenciales y tecnologías de medición para mejorar el portal. Algunas cookies son necesarias para operaciones básicas, mientras que otras nos ayudan a entender el uso del sitio.
                  </p>
                  <button 
                    onClick={onGoCookiePolicy}
                    className="text-rojo text-xs font-black uppercase tracking-widest mt-2 hover:underline decoration-2 underline-offset-4"
                  >
                    Ver política de cookies
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center justify-center gap-3 w-full md:w-auto">
                <button
                  onClick={() => setShowPreferences(true)}
                  className="px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2"
                >
                  <Settings size={16} />
                  Configurar
                </button>
                <button
                  onClick={handleRejectNonEssential}
                  className="px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest bg-white/5 text-white hover:bg-white/10 transition-all"
                >
                  Solo básicas
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest bg-rojo text-white hover:bg-rojo/80 transition-all shadow-lg shadow-rojo/20"
                >
                  Aceptar todas
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPreferences && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPreferences(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden font-sans"
            >
              <div className="p-8 md:p-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-rojo/10 rounded-xl flex items-center justify-center">
                      <Settings className="text-rojo" size={20} />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">Panel de configuración</h2>
                  </div>
                  <button 
                    onClick={() => setShowPreferences(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={20} className="text-gray-400" />
                  </button>
                </div>

                <div className="space-y-4 mb-10 h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {preferences.map((pref) => (
                    <div 
                      key={pref.category}
                      className={`p-6 rounded-3xl border-2 transition-all ${pref.enabled ? 'border-rojo/10 bg-rojo/5' : 'border-gray-100 bg-gray-50'}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-grow">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-black uppercase tracking-widest text-xs text-gray-900">{pref.label}</h4>
                            {pref.required && (
                              <span className="text-[10px] font-black uppercase tracking-widest bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">Obligatoria</span>
                            )}
                          </div>
                          <p className="text-gray-500 text-sm font-medium leading-relaxed">
                            {pref.description}
                          </p>
                        </div>
                        <button
                          disabled={pref.required}
                          onClick={() => togglePreference(pref.category)}
                          className={`relative w-12 h-6 rounded-full transition-colors ${pref.enabled ? 'bg-rojo' : 'bg-gray-300'} ${pref.required ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${pref.enabled ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-6 border-t border-gray-100">
                  <button
                    onClick={handleAcceptAll}
                    className="w-full sm:w-auto px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest bg-gray-100 text-gray-900 hover:bg-gray-200 transition-all font-bold"
                  >
                    Aceptar todas
                  </button>
                  <div className="flex-grow" />
                  <button
                    onClick={handleSavePreferences}
                    className="w-full sm:w-auto px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest bg-rojo text-white hover:bg-rojo/80 transition-all shadow-lg shadow-rojo/20 font-bold"
                  >
                    Guardar preferencias
                  </button>
                </div>
                
                <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-6">
                  TBS Destilados • Capa de privacidad V1.0
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
