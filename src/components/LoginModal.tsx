import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, CheckCircle2, Mail, FileText, UserPlus } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { useAnalytics } from '../hooks/useAnalytics';
import { getAnalyticsUserRole } from '../services/analytics';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
  onRequestAccess: () => void;
  onGoFAQ: () => void;
  onGoLegalPage: (key: any) => void;
  companyAccount?: any;
}

export function LoginModal({ isOpen, onClose, onLogin, onRequestAccess, onGoFAQ, onGoLegalPage, companyAccount }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loginRole, setLoginRole] = useState<'cliente_b2b' | 'marca' | 'hospitality_partner'>('cliente_b2b');
  const analytics = useAnalytics(null);

  useEffect(() => {
    if (isOpen) {
      analytics.track('login_modal_opened', 'authentication');
    }
  }, [isOpen, analytics]);

  const handleLogin = (user: User) => {
    analytics.track('login_success', 'authentication', {
      userRole: getAnalyticsUserRole(user),
      customerType: user.customerType,
      providerType: user.providerType,
      accountRole: user.accountRole
    });
    onLogin(user);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && password.trim()) {
      // Simulated Login based on selected role
          if (loginRole === 'cliente_b2b') {
        const simulatedUser: User = {
          id: "user-001",
          name: "Humberto",
          email: email,
          businessName: "Restaurante Demo",
          role: "cliente_b2b",
          city: "Nacional",
          address: "Cobertura Nacional",
          customerType: "Restaurante",
          creditLimit: 5000000,
          availableCredit: 3250000
        };
        handleLogin(simulatedUser);
      } else {
        const simulatedUser: User = {
          id: "user-valentina",
          name: "Valentina",
          email: email,
          businessName: "Marca Premium Demo",
          role: "marca",
          city: "Nacional",
          address: "Cobertura Nacional",
          providerType: "importadora"
        };
        handleLogin(simulatedUser);
      }
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 md:p-10">
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

          {/* Left Side: Info */}
          <div className="lg:w-[38%] bg-rojo p-10 lg:p-14 text-white flex flex-col justify-between shrink-0">
            <div>
              <div className="text-[28px] font-black tracking-tighter mb-10">TBS.</div>
              <h3 className="text-3xl lg:text-[40px] font-black tracking-tighter leading-[1.1] mb-10">
                Tu portal de compras B2B.
              </h3>
              <div className="space-y-6">
                {[
                  'Accede a tu catálogo B2B',
                  'Precios personalizados',
                  'Gestión de cartera y pagos',
                  'Seguimiento de pedidos'
                ].map((text, i) => (
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
                ¿Aún no tienes acceso?
              </p>
              <button 
                onClick={() => {
                  onRequestAccess();
                  onClose();
                }}
                className="text-white text-lg font-black hover:text-white/80 transition-colors flex items-center gap-2 cursor-pointer outline-none group"
              >
                Solicitar acceso ahora
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="flex-1 overflow-y-auto bg-white custom-scrollbar">
            <div className="p-10 lg:p-14 lg:pt-20">
              <div className="mb-10">
                <h2 className="text-4xl font-black tracking-tighter mb-4 text-texto">
                  Iniciar sesión en TBS
                </h2>
                <p className="text-gris font-medium text-lg max-w-md leading-relaxed">
                  Accede a tu cuenta según tu perfil corporativo.
                </p>
              </div>

              {/* Role Switcher for Demo */}
              <div className="flex p-1 bg-gray-100 rounded-2xl mb-8">
                <button
                  type="button"
                  onClick={() => setLoginRole('cliente_b2b')}
                  className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${loginRole === 'cliente_b2b' ? 'bg-white text-rojo shadow-sm' : 'text-gris hover:text-texto'}`}
                >
                  Entrar como cliente B2B
                </button>
                <button
                  type="button"
                  onClick={() => setLoginRole('hospitality_partner')}
                  className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${loginRole === 'hospitality_partner' ? 'bg-white text-rojo shadow-sm' : 'text-gris hover:text-texto'}`}
                >
                  Hospitalidad / Eventos
                </button>
                <button
                  type="button"
                  onClick={() => setLoginRole('marca')}
                  className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${loginRole === 'marca' ? 'bg-white text-rojo shadow-sm' : 'text-gris hover:text-texto'}`}
                >
                  Entrar como marca / proveedor
                </button>
              </div>

              {/* Demo Login Options */}
              <div className="mb-10 space-y-3 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gris mb-4 text-center">Acceso rápido Demo B2B</p>
                {loginRole === 'cliente_b2b' ? (
                  <>
                    <button 
                      type="button"
                      onClick={() => onLogin({
                        id: "user-001",
                        name: "Humberto",
                        email: "humberto@demo.com",
                        businessName: "Grupo Restaurante Demo",
                        role: "cliente_b2b",
                        city: "Nacional",
                        address: "Cobertura Nacional",
                        customerType: "Restaurante",
                        accountRole: 'master'
                      })}
                      className="w-full bg-white border border-borde text-texto py-4 rounded-xl font-black shadow-sm hover:border-rojo hover:text-rojo transition-all flex items-center justify-center gap-3 group"
                    >
                      <div className="w-8 h-8 rounded-full bg-rojo/10 text-rojo flex items-center justify-center text-xs font-black">H</div>
                      Entrar como Master (Humberto)
                    </button>
                    <button 
                      type="button"
                      onClick={() => onLogin({
                        id: "user-002",
                        name: "María Compras",
                        email: "maria.compras@demo.com",
                        businessName: "Grupo Restaurante Demo",
                        role: "cliente_b2b",
                        city: "Nacional",
                        address: "Cobertura Nacional",
                        customerType: "Restaurante",
                        accountRole: 'comprador'
                      })}
                      className="w-full bg-white border border-borde text-texto py-4 rounded-xl font-black shadow-sm hover:border-rojo hover:text-rojo transition-all flex items-center justify-center gap-3 group"
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center text-xs font-black">M</div>
                      Entrar como Comprador (María)
                    </button>
                    <button 
                      type="button"
                      onClick={() => onLogin({
                        id: "user-003",
                        name: "Carlos Finanzas",
                        email: "carlos.finanzas@demo.com",
                        businessName: "Grupo Restaurante Demo",
                        role: "cliente_b2b",
                        city: "Nacional",
                        address: "Cobertura Nacional",
                        customerType: "Restaurante",
                        accountRole: 'finanzas'
                      })}
                      className="w-full bg-white border border-borde text-texto py-4 rounded-xl font-black shadow-sm hover:border-rojo hover:text-rojo transition-all flex items-center justify-center gap-3 group"
                    >
                      <div className="w-8 h-8 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center text-xs font-black">C</div>
                      Entrar como Finanzas (Carlos)
                    </button>
                    <button 
                      type="button"
                      onClick={() => onLogin({
                        id: "user-004",
                        name: "Sofía Contado",
                        email: "sofia.contado@demo.com",
                        businessName: "Licorera Contado Demo",
                        role: "cliente_b2b",
                        city: "Cartagena",
                        address: "Calle de la Moneda, Cartagena",
                        customerType: "Licorera",
                        commercialCondition: "contado",
                        paymentPolicy: "pago_anticipado",
                        creditStatus: "sin_credito",
                        creditLimit: 0,
                        availableCredit: 0,
                        accountRole: "master",
                        companyAccountId: "acct-001",
                        assignedCityIds: ["city-ctg"],
                        assignedBranchIds: ["branch-ctg-001"],
                        assignedPointOfSaleIds: ["pos-001"],
                        permissions: [
                          "ver_catalogo",
                          "crear_pedidos",
                          "ver_pedidos",
                          "ver_cartera",
                          "ver_pagos",
                          "pedido_urgente",
                          "reordenar",
                          "gestionar_listas",
                          "ver_promociones",
                          "hablar_asesor",
                          "solicitar_credito"
                        ]
                      })}
                      className="w-full bg-white border border-borde text-texto py-4 rounded-xl font-black shadow-sm hover:border-rojo hover:text-rojo transition-all flex items-center justify-center gap-3 group"
                    >
                      <div className="w-8 h-8 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center text-xs font-black">S</div>
                      Entrar como Cliente Contado (Sofía)
                    </button>
                  </>
                ) : loginRole === 'hospitality_partner' ? (
                  <button 
                    type="button"
                    onClick={() => onLogin({
                      id: "user-hosp-001",
                      name: "Laura Eventos",
                      businessName: "Laura Eventos & Hospitality",
                      role: "hospitality_partner",
                      city: "Cartagena",
                      customerType: "Gestor de eventos",
                      partnerType: "wedding_planner",
                      hospitalityPartnerId: "partner-001",
                      commissionRuleId: "comm-rule-001",
                      creditLimit: 0,
                      availableCredit: 0,
                      canCreateManagedClients: true,
                      canBuyForManagedClients: true,
                      canScheduleManagedDeliveries: true,
                      canViewCommissions: true,
                      permissions: [
                        "ver_catalogo",
                        "crear_pedidos",
                        "ver_pedidos",
                        "reordenar",
                        "pedido_urgente",
                        "hablar_asesor",
                        "crear_clientes_gestionados",
                        "comprar_para_clientes",
                        "programar_entregas_eventos",
                        "ver_comisiones",
                        "gestionar_eventos"
                      ],
                      address: "Getsemaní, Cartagena",
                      email: "laura.eventos@demo.com"
                    })}
                    className="w-full bg-white border border-borde text-texto py-4 rounded-xl font-black shadow-sm hover:border-rojo hover:text-rojo transition-all flex items-center justify-center gap-3 group"
                  >
                    <div className="w-8 h-8 rounded-full bg-rojo/10 text-rojo flex items-center justify-center text-xs font-black">L</div>
                    Entrar como Gestor (Laura Eventos)
                  </button>
                ) : (
                  <button 
                    type="button"
                    onClick={() => onLogin({
                      id: "user-valentina",
                      name: "Valentina",
                      email: "valentina@example.com",
                      businessName: "Marca Premium Demo",
                      role: "marca",
                      city: "Nacional",
                      address: "Cobertura Nacional",
                      providerType: "importadora"
                    })}
                    className="w-full bg-white border border-borde text-texto py-4 rounded-xl font-black shadow-sm hover:border-indigo-500 hover:text-indigo-500 transition-all flex items-center justify-center gap-3 group"
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-xs font-black">V</div>
                    Entrar como Marca (Valentina)
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-gris-oscuro px-1 ml-1 border-l-2 border-rojo">Correo Electrónico</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gris/40 group-focus-within:text-rojo transition-colors" size={20} />
                      <input 
                        required 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@empresa.com" 
                        className="w-full bg-[#F9FAFB] border-2 border-[#F1F3F5] focus:border-rojo focus:bg-white rounded-2xl pl-12 pr-6 py-5 font-semibold transition-all outline-none placeholder:text-gris/40" 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[11px] font-black uppercase tracking-widest text-gris-oscuro ml-1 border-l-2 border-rojo">Contraseña</label>
                      <div className="flex items-center gap-4">
                        <button 
                          type="button" 
                          onClick={() => { onGoFAQ(); onClose(); }}
                          className="text-[10px] font-black uppercase text-gris hover:text-rojo cursor-pointer"
                        >
                          ¿Necesitas ayuda?
                        </button>
                        <button type="button" className="text-[10px] font-black uppercase text-rojo hover:underline cursor-pointer">Olvidé mi contraseña</button>
                      </div>
                    </div>
                    <div className="relative group">
                      <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gris/40 group-focus-within:text-rojo transition-colors" size={20} />
                      <input 
                        required 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••" 
                        className="w-full bg-[#F9FAFB] border-2 border-[#F1F3F5] focus:border-rojo focus:bg-white rounded-2xl pl-12 pr-6 py-5 font-semibold transition-all outline-none placeholder:text-gris/40" 
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-1">
                  <input 
                    type="checkbox" 
                    id="remember" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-borde text-rojo focus:ring-rojo" 
                  />
                  <label htmlFor="remember" className="text-xs font-bold text-gris uppercase tracking-wider cursor-pointer">Recordarme en este equipo</label>
                </div>

                <div className="pt-6 space-y-4">
                  <button 
                    type="submit"
                    className="w-full bg-texto text-white py-6 rounded-[24px] font-black text-xl shadow-2xl hover:bg-rojo hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 cursor-pointer"
                  >
                    Iniciar sesión <ArrowRight size={22} />
                  </button>
                  
                  <button 
                    type="button"
                    onClick={() => {
                      onRequestAccess();
                      onClose();
                    }}
                    className="w-full py-5 rounded-[24px] font-black text-lg text-gris hover:text-rojo border-2 border-[#F1F3F5] hover:border-rojo/30 transition-all flex items-center justify-center gap-3 cursor-pointer"
                  >
                    <UserPlus size={20} />
                    Solicitar acceso B2B
                  </button>
                </div>
                
                <div className="text-center text-[10px] text-gris font-medium mt-10 px-10 leading-relaxed uppercase tracking-widest space-y-1">
                  <p>Protegido por políticas de seguridad corporativa TBS.</p>
                  <p>
                    Al iniciar sesión aceptas nuestra <button type="button" onClick={() => { onGoLegalPage('privacidad'); onClose(); }} className="font-black hover:text-rojo underline">Política de privacidad</button> y <button type="button" onClick={() => { onGoLegalPage('terminos'); onClose(); }} className="font-black hover:text-rojo underline">Términos</button>.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
