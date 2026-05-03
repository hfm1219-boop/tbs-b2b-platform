import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, X, ChevronUp, ChevronDown, Activity } from 'lucide-react';
import { ANALYTICS_CONFIG } from '../../data/analyticsConfig';

const AnalyticsDebugPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    if (ANALYTICS_CONFIG.mode !== 'debug') return;

    const originalPush = window.dataLayer?.push;
    
    // Create dataLayer if it doesn't exist
    if (!window.dataLayer) {
      window.dataLayer = [];
    }

    // Set up a listener by wrapping push
    const wrapPush = () => {
      const dataLayer = window.dataLayer!;
      const oldPush = dataLayer.push.bind(dataLayer);
      
      dataLayer.push = (...args: any[]) => {
        setEvents(prev => [args[0], ...prev].slice(0, 50));
        return oldPush(...args);
      };
    };

    wrapPush();

    return () => {
      // We can't easily unwrap without keeping a reference to the original,
      // but for a debug panel in a dev environment this is generally fine.
    };
  }, []);

  if (ANALYTICS_CONFIG.mode !== 'debug') return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] font-mono text-[10px]">
      <div className="bg-[#303844] text-white rounded-xl shadow-2xl overflow-hidden border border-white/10 w-80">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-3 flex items-center justify-between hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Activity size={14} className={events.length > 0 ? "text-green-400" : "text-gray-400"} />
            <span className="font-bold uppercase tracking-widest">Analytics Debug</span>
            {events.length > 0 && (
              <span className="bg-rojo text-white px-1.5 py-0.5 rounded-full text-[9px]">
                {events.length}
              </span>
            )}
          </div>
          {isOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ height: 0 }}
              animate={{ height: 300 }}
              exit={{ height: 0 }}
              className="overflow-y-auto border-t border-white/10 bg-black/50"
            >
              {events.length === 0 ? (
                <div className="p-10 text-center text-gray-500 italic">
                  No hay eventos capturados aún...
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {events.map((event, idx) => (
                    <div key={idx} className="p-3 hover:bg-white/5 transition-colors">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-rojo font-black">{event.event}</span>
                        <span className="text-gray-500 text-[8px]">{new Date().toLocaleTimeString()}</span>
                      </div>
                      <div className="text-gray-400 bg-black/30 p-2 rounded text-[9px] overflow-x-auto">
                        <pre>{JSON.stringify(event, null, 2)}</pre>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AnalyticsDebugPanel;
