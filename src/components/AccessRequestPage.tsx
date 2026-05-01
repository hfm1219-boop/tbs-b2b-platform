import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  ClipboardList, 
  ArrowLeft, 
  CheckCircle2, 
  ArrowRight,
  ChevronDown,
  Briefcase
} from 'lucide-react';

interface AccessRequestPageProps {
  onBack: () => void;
  initialRole?: 'client' | 'provider';
}

type RequestRole = 'client' | 'provider';

export function AccessRequestPage({ onBack, initialRole = 'client' }: AccessRequestPageProps) {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [role, setRole] = useState<RequestRole>(initialRole);
  const [personType, setPersonType] = useState<'natural' | 'juridica'>('juridica');

  const handleRoleChange = (newRole: RequestRole) => {
    setRole(newRole);
    if (newRole === 'provider') {
      setFormData(prev => ({ ...prev, businessType: 'Proveedor / marca' }));
    } else {
      setFormData(prev => ({ ...prev, businessType: '' }));
    }
  };
  
  const [formData, setFormData] = useState({
    businessName: '',
    nit: '',
    city: '',
    businessType: '',
    contactName: '',
    position: '',
    phone: '',
    email: '',
    message: ''
  });

  const businessTypes = [
    'Bar', 'Restaurante', 'Hotel', 'Club', 'Licorera', 'Supermercado', 
    'Discoteca', 'Evento', 'Distribuidor', 'Proveedor / marca', 'Otro'
  ];

  const isFormValid = 
    role && 
    (role === 'client' ? personType : true) &&
    formData.businessName && 
    formData.city && 
    formData.businessType && 
    formData.contactName && 
    formData.phone && 
    formData.email;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      setStep('success');
      window.scrollTo(0, 0);
    }
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-white container-padding py-20 flex flex-col items-center justify-center text-center">
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-rojo/10 text-rojo rounded-full flex items-center justify-center mb-8"
        >
          <CheckCircle2 size={48} strokeWidth={2.5} />
        </motion.div>
        
        <h2 className="text-4xl lg:text-6xl font-black tracking-tighter mb-6">
          Solicitud recibida
        </h2>
        
        <p className="text-xl text-texto-sec font-medium max-w-2xl mb-12 leading-relaxed">
          El equipo <span className="text-rojo font-bold">TBS</span> revisará tu información y se comunicará contigo para continuar el proceso de activación.
        </p>

        <div className="w-full max-w-md bg-[#F9FAFB] border border-[#F1F3F5] rounded-3xl p-8 text-left mb-12">
          <h3 className="text-xs font-black text-gris uppercase tracking-widest mb-6 px-4 py-2 bg-white rounded-xl border border-[#F1F3F5] w-fit">Resumen de solicitud</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-gray-200/50 pb-3">
              <span className="text-gris text-xs font-bold uppercase tracking-wider">Tipo</span>
              <span className="font-black text-texto">
                {role === 'client' ? `Cliente B2B (${personType === 'natural' ? 'Persona Natural' : 'Persona Jurídica'})` : 'Proveedor / Marca'}
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-200/50 pb-3">
              <span className="text-gris text-xs font-bold uppercase tracking-wider">Negocio</span>
              <span className="font-black text-texto">{formData.businessName}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-200/50 pb-3">
              <span className="text-gris text-xs font-bold uppercase tracking-wider">Ciudad</span>
              <span className="font-black text-texto">{formData.city}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-200/50 pb-3">
              <span className="text-gris text-xs font-bold uppercase tracking-wider">Contacto</span>
              <span className="font-black text-texto">{formData.contactName}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-200/50 pb-3">
              <span className="text-gris text-xs font-bold uppercase tracking-wider">Celular</span>
              <span className="font-black text-texto">{formData.phone}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gris text-xs font-bold uppercase tracking-wider">Email</span>
              <span className="font-black text-texto">{formData.email}</span>
            </div>
          </div>
        </div>

        <button 
          onClick={onBack}
          className="px-10 py-5 bg-rojo text-white rounded-2xl font-black text-lg hover:bg-rojo-oscuro transition-all flex items-center gap-3 tbs-shadow group cursor-pointer"
        >
          Volver al inicio
          <ArrowRight className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden border-b border-borde bg-[#F8FAFC]">
        <div className="max-w-[1480px] mx-auto px-8">
          <button 
            onClick={onBack}
            className="inline-flex items-center gap-2 mb-12 text-[13px] font-black uppercase tracking-widest text-gris hover:text-rojo transition-colors outline-none cursor-pointer group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
            Volver al inicio
          </button>

          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[#334155] text-[11px] font-black uppercase tracking-[0.2em] mb-4"
            >
              Crecimiento B2B
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-[44px] lg:text-[88px] font-black tracking-tighter leading-[0.9] mb-8"
            >
              Solicita tu acceso<br />
              <span className="text-rojo">a TBS.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl lg:text-[22px] text-texto-sec font-medium leading-relaxed max-w-2xl"
            >
              Completa la información de tu negocio y un asesor comercial revisará tu solicitud para activar tu acceso, precios B2B, crédito y acompañamiento experto.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <div className="py-20 container-padding overflow-hidden">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-16">
          
          {/* Section 1: Tipo de solicitud */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <span className="w-10 h-10 rounded-full bg-rojo text-white flex items-center justify-center font-black">1</span>
              <h3 className="text-2xl font-black tracking-tight">Tipo de solicitud</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <button
                type="button"
                onClick={() => handleRoleChange('client')}
                className={`p-8 rounded-3xl border-2 text-left transition-all cursor-pointer group ${
                  role === 'client' 
                    ? 'border-rojo bg-rojo/5 shadow-xl shadow-rojo/5' 
                    : 'border-[#F1F3F5] hover:border-rojo/30'
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
                  role === 'client' ? 'bg-rojo text-white' : 'bg-gray-100 text-gris group-hover:text-rojo group-hover:bg-rojo/10'
                }`}>
                  <ShoppingCart size={32} />
                </div>
                <h4 className="text-xl font-black mb-2">Cliente</h4>
                <p className="text-sm font-semibold text-texto-sec leading-relaxed">Quiero comprar productos de múltiples marcas para mi negocio.</p>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('provider')}
                className={`p-8 rounded-3xl border-2 text-left transition-all cursor-pointer group ${
                  role === 'provider' 
                    ? 'border-rojo bg-rojo/5 shadow-xl shadow-rojo/5' 
                    : 'border-[#F1F3F5] hover:border-rojo/30'
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
                  role === 'provider' ? 'bg-rojo text-white' : 'bg-gray-100 text-gris group-hover:text-rojo group-hover:bg-rojo/10'
                }`}>
                  <Briefcase size={32} />
                </div>
                <h4 className="text-xl font-black mb-2">Proveedor o marca</h4>
                <p className="text-sm font-semibold text-texto-sec leading-relaxed">Quiero vender mis productos y usar la red logística de TBS.</p>
              </button>
            </div>

            {/* Persona Natural vs Jurídica Selection (Only for Client) */}
            <AnimatePresence mode="wait">
              {role === 'client' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="pt-6 border-t border-[#F1F3F5]"
                >
                  <label className="text-[11px] font-black uppercase tracking-widest text-gris-oscuro mb-4 block">Personalidad jurídica</label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setPersonType('natural')}
                      className={`flex-1 py-4 rounded-xl border-2 font-black text-sm transition-all cursor-pointer ${
                        personType === 'natural' ? 'border-rojo bg-rojo text-white' : 'border-[#F1F3F5] text-gris hover:border-rojo/30'
                      }`}
                    >
                      Persona Natural
                    </button>
                    <button
                      type="button"
                      onClick={() => setPersonType('juridica')}
                      className={`flex-1 py-4 rounded-xl border-2 font-black text-sm transition-all cursor-pointer ${
                        personType === 'juridica' ? 'border-rojo bg-rojo text-white' : 'border-[#F1F3F5] text-gris hover:border-rojo/30'
                      }`}
                    >
                      Persona Jurídica
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Section 2: Datos del negocio */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <span className="w-10 h-10 rounded-full bg-rojo text-white flex items-center justify-center font-black">2</span>
              <h3 className="text-2xl font-black tracking-tight">Datos del negocio</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-gris-oscuro px-1 ml-1 border-l-2 border-rojo">
                  {role === 'client' && personType === 'natural' ? 'Nombre completo (Persona Natural)' : 'Razón social o nombre comercial'}
                </label>
                <div className="relative group">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gris/40 group-focus-within:text-rojo transition-colors" size={20} />
                  <input 
                    required 
                    type="text" 
                    placeholder={role === 'client' && personType === 'natural' ? 'Tu nombre completo' : 'Ej: Inversiones Gastro SAS'}
                    value={formData.businessName}
                    onChange={e => setFormData({...formData, businessName: e.target.value})}
                    className="w-full bg-[#F9FAFB] border-2 border-[#F1F3F5] focus:border-rojo focus:bg-white rounded-2xl pl-12 pr-6 py-5 font-semibold transition-all outline-none placeholder:text-gris/40" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-gris-oscuro px-1 ml-1 border-l-2 border-rojo">
                  {role === 'client' && personType === 'natural' ? 'Cédula de ciudadanía' : 'NIT o identificación tributaria'}
                </label>
                <div className="relative group">
                  <ClipboardList className="absolute left-4 top-1/2 -translate-y-1/2 text-gris/40 group-focus-within:text-rojo transition-colors" size={20} />
                  <input 
                    type="text" 
                    placeholder={role === 'client' && personType === 'natural' ? '1.XXX.XXX.XXX' : '901.XXX.XXX-X'}
                    value={formData.nit}
                    onChange={e => setFormData({...formData, nit: e.target.value})}
                    className="w-full bg-[#F9FAFB] border-2 border-[#F1F3F5] focus:border-rojo focus:bg-white rounded-2xl pl-12 pr-6 py-5 font-semibold transition-all outline-none placeholder:text-gris/40" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-gris-oscuro px-1 ml-1 border-l-2 border-rojo">Ciudad</label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gris/40 group-focus-within:text-rojo transition-colors" size={20} />
                  <input 
                    required 
                    type="text" 
                    placeholder="Ej: Cartagena, Bolívar"
                    value={formData.city}
                    onChange={e => setFormData({...formData, city: e.target.value})}
                    className="w-full bg-[#F9FAFB] border-2 border-[#F1F3F5] focus:border-rojo focus:bg-white rounded-2xl pl-12 pr-6 py-5 font-semibold transition-all outline-none placeholder:text-gris/40" 
                  />
                </div>
              </div>

              {role === 'client' && (
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-gris-oscuro px-1 ml-1 border-l-2 border-rojo">Tipo de negocio</label>
                  <div className="relative group">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gris/40 group-focus-within:text-rojo transition-colors" size={20} />
                    <select 
                      required 
                      value={formData.businessType}
                      onChange={e => setFormData({...formData, businessType: e.target.value})}
                      className="w-full bg-[#F9FAFB] border-2 border-[#F1F3F5] focus:border-rojo focus:bg-white rounded-2xl pl-12 pr-6 py-5 font-semibold transition-all outline-none appearance-none cursor-pointer"
                    >
                      <option value="">Selecciona...</option>
                      {businessTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gris/40 pointer-events-none" size={18} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Datos de contacto */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <span className="w-10 h-10 rounded-full bg-rojo text-white flex items-center justify-center font-black">3</span>
              <h3 className="text-2xl font-black tracking-tight">Datos de contacto</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 col-span-full md:col-span-1">
                <label className="text-[11px] font-black uppercase tracking-widest text-gris-oscuro px-1 ml-1 border-l-2 border-rojo">Nombre del contacto</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gris/40 group-focus-within:text-rojo transition-colors" size={20} />
                  <input 
                    required 
                    type="text" 
                    placeholder="Nombre completo"
                    value={formData.contactName}
                    onChange={e => setFormData({...formData, contactName: e.target.value})}
                    className="w-full bg-[#F9FAFB] border-2 border-[#F1F3F5] focus:border-rojo focus:bg-white rounded-2xl pl-12 pr-6 py-5 font-semibold transition-all outline-none placeholder:text-gris/40" 
                  />
                </div>
              </div>

              <div className="space-y-2 col-span-full md:col-span-1">
                <label className="text-[11px] font-black uppercase tracking-widest text-gris-oscuro px-1 ml-1 border-l-2 border-rojo">Cargo</label>
                <div className="relative group">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gris/40 group-focus-within:text-rojo transition-colors" size={20} />
                  <input 
                    type="text" 
                    placeholder="Ej: Administrador / Dueño"
                    value={formData.position}
                    onChange={e => setFormData({...formData, position: e.target.value})}
                    className="w-full bg-[#F9FAFB] border-2 border-[#F1F3F5] focus:border-rojo focus:bg-white rounded-2xl pl-12 pr-6 py-5 font-semibold transition-all outline-none placeholder:text-gris/40" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-gris-oscuro px-1 ml-1 border-l-2 border-rojo">Celular</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gris/40 group-focus-within:text-rojo transition-colors" size={20} />
                  <input 
                    required 
                    type="tel" 
                    placeholder="321 000 0000"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-[#F9FAFB] border-2 border-[#F1F3F5] focus:border-rojo focus:bg-white rounded-2xl pl-12 pr-6 py-5 font-semibold transition-all outline-none placeholder:text-gris/40" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-gris-oscuro px-1 ml-1 border-l-2 border-rojo">Correo electrónico</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gris/40 group-focus-within:text-rojo transition-colors" size={20} />
                  <input 
                    required 
                    type="email" 
                    placeholder="nombre@empresa.com"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-[#F9FAFB] border-2 border-[#F1F3F5] focus:border-rojo focus:bg-white rounded-2xl pl-12 pr-6 py-5 font-semibold transition-all outline-none placeholder:text-gris/40" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Necesidad principal */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <span className="w-10 h-10 rounded-full bg-rojo text-white flex items-center justify-center font-black">4</span>
              <h3 className="text-2xl font-black tracking-tight">Necesidad principal</h3>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-gris-oscuro px-1 ml-1 border-l-2 border-rojo">Mensaje / Requerimientos especiales</label>
              <textarea 
                placeholder="Cuéntanos qué necesitas: comprar productos, acceder a crédito, publicar tu marca, activar productos, logística, pedidos recurrentes, etc."
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
                className="w-full bg-[#F9FAFB] border-2 border-[#F1F3F5] focus:border-rojo focus:bg-white rounded-3xl px-8 py-6 font-semibold transition-all outline-none placeholder:text-gris/40 min-h-[160px] resize-none" 
              />
            </div>
          </div>

          <div className="pt-10">
            <button 
              type="submit"
              disabled={!isFormValid}
              className={`w-full py-6 md:py-8 rounded-3xl font-black text-xl md:text-2xl transition-all tbs-shadow flex items-center justify-center gap-4 ${
                isFormValid 
                  ? 'bg-rojo text-white hover:bg-rojo-oscuro hover:scale-[1.01] active:scale-100 cursor-pointer' 
                  : 'bg-gray-100 text-gris cursor-not-allowed border-2 border-[#F1F3F5]'
              }`}
            >
              Enviar solicitud de acceso
              <ArrowRight size={24} strokeWidth={3} />
            </button>
            {!isFormValid && (
              <p className="text-center mt-6 text-sm font-bold text-gris uppercase tracking-widest">Completa todos los campos obligatorios para enviar</p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

function ShoppingCart(props: any) {
  return (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}
