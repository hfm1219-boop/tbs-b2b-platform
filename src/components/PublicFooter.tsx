
import React from 'react';
import { Phone, Mail, MapPin, Instagram, Facebook, Linkedin } from 'lucide-react';

interface PublicFooterProps {
  onGoPage: (page: any) => void;
}

export function PublicFooter({ onGoPage }: PublicFooterProps) {
  return (
    <footer className="bg-[#1A1F26] text-white pt-20 pb-10 font-sans border-t-4 border-rojo">
      <div className="max-w-[1480px] mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand Column */}
          <div className="space-y-6">
            <h2 className="text-3xl font-black tracking-tighter">TBS<span className="text-rojo">.</span></h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              TBS Destilados SAS es la plataforma tecnológica líder en abastecimiento inteligente para negocios que venden y sirven licores.
            </p>
            <div className="flex items-center gap-4">
              <a href="javascript:void(0)" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-rojo transition-colors cursor-default">
                <Instagram size={18} />
              </a>
              <a href="javascript:void(0)" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-rojo transition-colors cursor-default">
                <Facebook size={18} />
              </a>
              <a href="javascript:void(0)" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-rojo transition-colors cursor-default">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-rojo mb-8">Compañía</h3>
            <ul className="space-y-4">
              <li><button onClick={() => onGoPage('about')} className="text-gray-400 hover:text-white transition-colors text-sm font-bold">Qué es TBS</button></li>
              <li><button onClick={() => onGoPage('clients')} className="text-gray-400 hover:text-white transition-colors text-sm font-bold">Clientes B2B</button></li>
              <li><button onClick={() => onGoPage('providers')} className="text-gray-400 hover:text-white transition-colors text-sm font-bold">Marcas</button></li>
              <li><button onClick={() => onGoPage('services')} className="text-gray-400 hover:text-white transition-colors text-sm font-bold">Servicios TBS</button></li>
              <li><button onClick={() => onGoPage('contact')} className="text-gray-400 hover:text-white transition-colors text-sm font-bold">Contacto y ubicación</button></li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-rojo mb-8">Soporte</h3>
            <ul className="space-y-4">
              <li><button onClick={() => onGoPage('faq')} className="text-gray-400 hover:text-white transition-colors text-sm font-bold">Centro de ayuda</button></li>
              <li><button onClick={() => onGoPage('blogIndex')} className="text-gray-400 hover:text-white transition-colors text-sm font-bold">Guías y recursos</button></li>
              <li><button onClick={() => onGoPage('contact')} className="text-gray-400 hover:text-white transition-colors text-sm font-bold">Contacto comercial</button></li>
              <li><button onClick={() => onGoPage('request-access')} className="text-gray-400 hover:text-white transition-colors text-sm font-bold">Solicitar acceso</button></li>
              <li><button onClick={() => onGoPage('legalIndex')} className="text-gray-400 hover:text-white transition-colors text-sm font-bold">Legal y privacidad</button></li>
              <li><button onClick={() => onGoPage('trust')} className="text-gray-400 hover:text-white transition-colors text-sm font-bold">Centro de Confianza</button></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-rojo mb-8">Contacto</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-rojo shrink-0 mt-1" />
                <span className="text-gray-400 text-sm font-medium">Carrera 2 No. 7-17 Local 1, Bocagrande, Cartagena</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-rojo shrink-0" />
                <span className="text-gray-400 text-sm font-medium">+57 314 581 3569</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-rojo shrink-0" />
                <span className="text-gray-400 text-sm font-medium">contacto@tbsdestilados.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
            © {new Date().getFullYear()} TBS Destilados SAS. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6">
             <img src="https://ais-pre-xcfhfeamajttu5exq3snpz-701464380427.us-east1.run.app/placeholder-payment.png" alt="Métodos de pago" className="h-6 opacity-30 grayscale" />
          </div>
        </div>
      </div>
    </footer>
  );
}
