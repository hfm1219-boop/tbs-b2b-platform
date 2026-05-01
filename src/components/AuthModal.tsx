import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, CheckCircle2, User, Building2, Phone, Mail, FileText, MapPin, ChevronDown } from 'lucide-react';
import React, { useState } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'login' | 'request';
  initialRole?: 'client' | 'provider';
}

export function AuthModal({ isOpen, onClose, type: initialType, initialRole = 'client' }: AuthModalProps) {
  const [type, setType] = useState(initialType);
  const [userRole, setUserRole] = useState<'client' | 'provider'>(initialRole);
  const [step, setStep] = useState(1); // 1: Form, 2: Success

  // Sync role if prop changes while modal is closed or reopening
  React.useEffect(() => {
    if (isOpen) {
      setUserRole(initialRole);
      setType(initialType);
      setStep(1);
    }
  }, [isOpen, initialRole, initialType]);

  const handleRequestAccess = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-10">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          className="relative w-full max-w-4xl bg-white rounded-[40px] overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] z-10 flex flex-col lg:flex-row max-h-[90vh]"
        >
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 w-12 h-12 bg-gray-50 text-texto rounded-full flex items-center justify-center hover:bg-gray-100 transition-all cursor-pointer z-50 outline-none hover:rotate-90"
          >
            <X size={22} />
          </button>

          {/* Left Side: Info (Hidden on very small mobile if necessary, but here preserved with flex) */}
          <div className="lg:w-[38%] bg-rojo p-10 lg:p-14 text-white flex flex-col justify-between shrink-0">
            <div>
              <div className="text-[28px] font-black tracking-tighter mb-10">TBS.</div>
              <h3 className="text-3xl lg:text-[40px] font-black tracking-tighter leading-[1.1] mb-10">
                {type === 'login' 
                  ? (userRole === 'client' ? 'Tu portal de compras B2B.' : 'Gestión de portafolio y ventas.') 
                  : (userRole === 'client' ? 'Solicita tu cupo de crédito TBS.' : 'Lleva tu marca al siguiente nivel.')}
              </h3>
              <div className="space-y-6">
                {(type === 'login' ? [
                  userRole === 'client' ? 'Precios personalizados por negocio' : 'Reportes de sell-out en tiempo real',
                  userRole === 'client' ? 'Gestión de cartera y pagos centralizados' : 'Control total de inventario y rotación',
                  userRole === 'client' ? 'Seguimiento de pedidos en tiempo real' : 'Liquidaciones y pagos automatizados'
                ] : [
                  userRole === 'client' ? 'Acceso a portafolio exclusivo de marcas' : 'Visibilidad ante miles de negocios regionales',
                  userRole === 'client' ? 'Cupo de crédito directo TBS Pay' : 'Operativa logística de última milla',
                  userRole === 'client' ? 'Logística prioritaria y pedidos urgentes' : 'Inteligencia de mercado y analítica'
                ]).map((text, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={i} 
                    className="flex gap-4 text-white/90 text-[15px] font-medium leading-tight"
                  >
                    <CheckCircle2 size={20} className="text-white shrink-0" />
                    {text}
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="mt-16 pt-10 border-t border-white/20">
              <p className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em] mb-3">
                {type === 'login' ? '¿Aún no eres aliado comercial?' : '¿Ya tienes acceso al portal?'}
              </p>
              <button 
                onClick={() => setType(type === 'login' ? 'request' : 'login')}
                className="text-white text-lg font-black hover:text-white/80 transition-colors flex items-center gap-2 cursor-pointer outline-none group"
              >
                {type === 'login' ? 'Registrarme ahora' : 'Iniciar sesión aquí'}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Side: Form (Scrollable) */}
          <div className="flex-1 overflow-y-auto bg-white custom-scrollbar">
            {step === 1 ? (
              <div className="p-10 lg:p-14 lg:pt-20">
                <div className="mb-10">
                  <motion.div 
                    key={type}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h2 className="text-4xl font-black tracking-tighter mb-4">
                      {type === 'login' ? 'Iniciar Sesión' : 'Solicitud Profesional'}
                    </h2>
                    <p className="text-gris font-medium text-lg max-w-md leading-relaxed">
                      {type === 'login' 
                        ? 'Ingresa tus credenciales autorizadas para acceder a tu panel personalizado.' 
                        : 'Completa los datos de tu empresa para que un gestor especializado evalúe tu perfil.'}
                    </p>
                  </motion.div>
                </div>

                {/* Role Switcher */}
                <div className="flex p-1.5 bg-gray-100 rounded-2xl mb-10 w-fit min-w-[320px]">
                  <button 
                    onClick={() => setUserRole('client')}
                    className={`flex-1 px-6 py-4 text-[11px] font-black uppercase tracking-[0.15em] rounded-xl transition-all cursor-pointer ${userRole === 'client' ? 'bg-white shadow-md text-rojo' : 'text-gris hover:text-texto'}`}
                  >
                    Cliente
                  </button>
                  <button 
                    onClick={() => setUserRole('provider')}
                    className={`flex-1 px-6 py-4 text-[11px] font-black uppercase tracking-[0.15em] rounded-xl transition-all cursor-pointer ${userRole === 'provider' ? 'bg-white shadow-md text-rojo' : 'text-gris hover:text-texto'}`}
                  >
                    Proveedor / Marca
                  </button>
                </div>

                <form onSubmit={type === 'request' ? handleRequestAccess : (e) => e.preventDefault()} className="space-y-6">
                  {type === 'request' ? (
                    <motion.div 
                      key="request-fields"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-[11px] font-black uppercase tracking-widest text-gris-oscuro px-1 ml-1 border-l-2 border-rojo">
                            {userRole === 'client' ? 'Nombre del Negocio' : 'Nombre de la Marca'}
                          </label>
                          <div className="relative group">
                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gris/40 group-focus-within:text-rojo transition-colors" size={20} />
                            <input required type="text" placeholder={userRole === 'client' ? "Ej: Restaurante El Faro" : "Ej: Diageo, Pernod Ricard"} className="w-full bg-[#F9FAFB] border-2 border-[#F1F3F5] focus:border-rojo focus:bg-white rounded-2xl pl-12 pr-6 py-5 font-semibold transition-all outline-none placeholder:text-gris/40" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[11px] font-black uppercase tracking-widest text-gris-oscuro px-1 ml-1 border-l-2 border-rojo">NIT / ID Fiscal</label>
                          <div className="relative group">
                            <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gris/40 group-focus-within:text-rojo transition-colors" size={20} />
                            <input required type="text" placeholder="900.123.456-7" className="w-full bg-[#F9FAFB] border-2 border-[#F1F3F5] focus:border-rojo focus:bg-white rounded-2xl pl-12 pr-6 py-5 font-semibold transition-all outline-none placeholder:text-gris/40" />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-[11px] font-black uppercase tracking-widest text-gris-oscuro px-1 ml-1 border-l-2 border-rojo">Ciudad de Operación</label>
                          <div className="relative group">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gris/40 group-focus-within:text-rojo transition-colors" size={20} />
                            <input required type="text" placeholder="Ej: Cartagena, Bolívar" className="w-full bg-[#F9FAFB] border-2 border-[#F1F3F5] focus:border-rojo focus:bg-white rounded-2xl pl-12 pr-6 py-5 font-semibold transition-all outline-none placeholder:text-gris/40" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[11px] font-black uppercase tracking-widest text-gris-oscuro px-1 ml-1 border-l-2 border-rojo">Tipo de Negocio</label>
                          <div className="relative group">
                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gris/40 group-focus-within:text-rojo transition-colors" size={20} />
                            <select required className="w-full bg-[#F9FAFB] border-2 border-[#F1F3F5] focus:border-rojo focus:bg-white rounded-2xl pl-12 pr-6 py-5 font-semibold transition-all outline-none appearance-none cursor-pointer">
                              <option value="">Selecciona...</option>
                              <option>Bar / Discoteca</option>
                              <option>Restaurante</option>
                              <option>Hotel / Club</option>
                              <option>Licorera / Tienda</option>
                              <option>Supermercado</option>
                              <option>Organizador de Eventos</option>
                              <option>Otro</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gris/40 pointer-events-none" size={18} />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-widest text-gris-oscuro px-1 ml-1 border-l-2 border-rojo">Responsable de Cuenta</label>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gris/40 group-focus-within:text-rojo transition-colors" size={20} />
                          <input required type="text" placeholder="Nombre completo del contacto" className="w-full bg-[#F9FAFB] border-2 border-[#F1F3F5] focus:border-rojo focus:bg-white rounded-2xl pl-12 pr-6 py-5 font-semibold transition-all outline-none placeholder:text-gris/40" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-[11px] font-black uppercase tracking-widest text-gris-oscuro px-1 ml-1 border-l-2 border-rojo">WhatsApp / Celular</label>
                          <div className="relative group">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gris/40 group-focus-within:text-rojo transition-colors" size={20} />
                            <input required type="tel" placeholder="+57 300 000 0000" className="w-full bg-[#F9FAFB] border-2 border-[#F1F3F5] focus:border-rojo focus:bg-white rounded-2xl pl-12 pr-6 py-5 font-semibold transition-all outline-none placeholder:text-gris/40" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[11px] font-black uppercase tracking-widest text-gris-oscuro px-1 ml-1 border-l-2 border-rojo">Email Corporativo</label>
                          <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gris/40 group-focus-within:text-rojo transition-colors" size={20} />
                            <input required type="email" placeholder="contacto@empresa.com" className="w-full bg-[#F9FAFB] border-2 border-[#F1F3F5] focus:border-rojo focus:bg-white rounded-2xl pl-12 pr-6 py-5 font-semibold transition-all outline-none placeholder:text-gris/40" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-widest text-gris-oscuro px-1 ml-1 border-l-2 border-rojo">Mensaje / Necesidad especial</label>
                        <textarea placeholder="Cuéntanos un poco más sobre tu necesidad o los productos que te interesan..." className="w-full bg-[#F9FAFB] border-2 border-[#F1F3F5] focus:border-rojo focus:bg-white rounded-2xl px-6 py-5 font-semibold transition-all outline-none placeholder:text-gris/40 min-h-[120px] resize-none" />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="login-fields"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6"
                    >
                      <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-widest text-gris-oscuro px-1 ml-1 border-l-2 border-rojo">Correo Electrónico</label>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gris/40 group-focus-within:text-rojo transition-colors" size={20} />
                          <input required type="email" placeholder="tu@empresa.com" className="w-full bg-[#F9FAFB] border-2 border-[#F1F3F5] focus:border-rojo focus:bg-white rounded-2xl pl-12 pr-6 py-5 font-semibold transition-all outline-none placeholder:text-gris/40" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center px-1">
                          <label className="text-[11px] font-black uppercase tracking-widest text-gris-oscuro ml-1 border-l-2 border-rojo">Contraseña</label>
                          <button type="button" className="text-[10px] font-black uppercase text-rojo hover:underline cursor-pointer">Olvidé mi clave</button>
                        </div>
                        <div className="relative group">
                          <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gris/40 group-focus-within:text-rojo transition-colors" size={20} />
                          <input required type="password" placeholder="••••••••" className="w-full bg-[#F9FAFB] border-2 border-[#F1F3F5] focus:border-rojo focus:bg-white rounded-2xl pl-12 pr-6 py-5 font-semibold transition-all outline-none placeholder:text-gris/40" />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <button 
                    type="submit"
                    className="w-full bg-texto text-white py-6 rounded-[24px] font-black text-xl mt-10 shadow-2xl hover:bg-rojo hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 cursor-pointer"
                  >
                    {type === 'login' ? 'Acceder al Portal' : 'Enviar Solicitud'} <ArrowRight size={22} />
                  </button>
                  
                  <p className="text-center text-[11px] text-gris font-medium mt-10 px-14 leading-relaxed">
                    Al proceder, confirmas que estás solicitando acceso para una entidad comercial de tipo <span className="font-bold text-texto">{userRole === 'client' ? 'Cliente' : 'Proveedor / Marca'}</span> de licores y destilados.
                  </p>
                </form>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-14 lg:p-20 text-center">
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-32 h-32 bg-rojo text-white rounded-[40px] flex items-center justify-center mb-10 shadow-[0_20px_40px_-10px_rgba(169,0,0,0.4)]"
                >
                  <CheckCircle2 size={64} />
                </motion.div>
                <h2 className="text-4xl lg:text-5xl font-black tracking-tighter mb-6 leading-tight">
                  Solicitud Recibida
                </h2>
                <p className="text-xl text-texto-sec font-medium max-w-md mb-12 leading-relaxed">
                  Un asesor <span className="text-rojo font-bold">TBS</span> revisará la información y se comunicará contigo lo antes posible para finalizar el registro.
                </p>
                <button 
                  onClick={onClose}
                  className="px-14 py-6 bg-texto text-white rounded-2xl font-black text-xl hover:bg-rojo hover:scale-105 transition-all cursor-pointer shadow-xl flex items-center gap-3"
                >
                  Volver al Inicio
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>

    </AnimatePresence>
  );
}
