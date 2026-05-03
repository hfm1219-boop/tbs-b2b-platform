
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Beer, ChevronRight, X, AlertTriangle } from 'lucide-react';

interface AgeGateNoticeProps {
  onGoLegalPage: (key: any) => void;
}

export function AgeGateNotice({ onGoLegalPage }: AgeGateNoticeProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const acknowledged = localStorage.getItem('tbs_age_notice_acknowledged');
    if (!acknowledged) {
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcknowledge = () => {
    localStorage.setItem('tbs_age_notice_acknowledged', 'true');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-[100] p-4 flex justify-center"
        >
          <div className="max-w-[900px] w-full bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-100 flex flex-col sm:flex-row items-center gap-4 p-4 md:p-6">
            <div className="w-12 h-12 bg-rojo/10 rounded-2xl flex items-center justify-center shrink-0">
              <Beer className="text-rojo" size={24} />
            </div>
            
            <div className="flex-grow text-center sm:text-left">
              <h4 className="text-sm font-black uppercase tracking-tight text-gray-900 mb-1">Consumo responsable y mayoría de edad</h4>
              <p className="text-xs text-gray-500 font-bold leading-relaxed">
                TBS promueve el consumo responsable de licores. El acceso a información de este portal está dirigido exclusivamente a mayores de edad legales.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
              <button
                onClick={() => onGoLegalPage('ageNotice')}
                className="flex-grow sm:flex-grow-0 px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-rojo hover:bg-rojo/5 transition-all flex items-center justify-center gap-2"
              >
                Ver política
                <ChevronRight size={14} />
              </button>
              <button
                onClick={handleAcknowledge}
                className="flex-grow sm:flex-grow-0 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest bg-rojo text-white hover:bg-rojo/80 transition-all font-bold"
              >
                Entendido
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
