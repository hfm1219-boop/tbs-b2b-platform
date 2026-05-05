import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Search, 
  Zap, 
  ChevronRight, 
  Clock, 
  MapPin, 
  Phone, 
  User as UserIcon, 
  Package, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  X,
  Truck,
  Plus,
  Minus,
  MessageSquare,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Activity,
  Map,
  ListChecks,
  History,
  TrendingUp,
  Award
} from 'lucide-react';
import { 
  Button,
  StatusBadge,
  MetricCard,
  AlertBox,
  EmptyState,
  SectionHeader,
  ActionCard,
  ModalShell
} from './ui';
import { User, UrgentProduct, UrgentReason, UrgentOrderRequest } from '../types';
import { useAnalytics } from '../hooks/useAnalytics';

interface UrgentOrderPageProps {
  currentUser: User | null;
  onBackToAccount: () => void;
  onGoHome: () => void;
  onGoTracking: () => void;
  onGoCatalog: () => void;
  onGoAdvisorChat: (topic?: any, context?: any) => void;
  onCreateNotification?: (notification: any) => void;
}

// --- New Subcomponents for HORECA Premium Experience ---

function UrgentServiceConditions({ condition, onCityChange }: { condition: CityCondition, onCityChange: (city: string) => void }) {
  return (
    <div className="bg-white rounded-[32px] border border-borde p-8 mb-8 tbs-shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-rojo/5 rounded-full -mr-20 -mt-20 blur-3xl" />
      
      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 pb-8 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="px-3 py-1 bg-texto text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                HORECA Premium
              </div>
            </div>
            <h2 className="text-3xl font-black text-texto tracking-tight mb-2">Condiciones de pedido urgente hoy</h2>
            <p className="text-gris font-medium">Consulta el estado operativo, horarios y SLA estimados para tu zona.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            <div className="w-full sm:w-auto space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gris ml-2">Ciudad de operación</label>
              <select 
                value={condition.city}
                onChange={(e) => onCityChange(e.target.value)}
                className="w-full sm:w-64 h-12 bg-gray-50 border border-borde rounded-xl px-4 font-black text-texto outline-none focus:border-rojo appearance-none cursor-pointer"
              >
                {Object.keys(CITY_CONDITIONS).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-8">
          <ConditionItem 
            icon={Clock} 
            label="Horario Límite" 
            value={condition.cutoffTime} 
            description="Solicitudes hoy hasta esta hora" 
          />
          <ConditionItem 
            icon={MapPin} 
            label="Ventana Disponible" 
            value={condition.availableWindow} 
            description="Tiempo estimado de entrega" 
          />
          <ConditionItem 
            icon={ShieldCheck} 
            label="Nivel de Prioridad" 
            value={condition.priorityLevel} 
            description="Asignación en ruta logística" 
            valueColor="text-rojo"
          />
          <ConditionItem 
            icon={Zap} 
            label="Atención Estimada" 
            value={condition.estimatedSLA} 
            description="Tiempo de validación técnica" 
          />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-bold text-gris uppercase tracking-wider">
            <CheckCircle2 size={14} className="text-green-500" /> Sujeto a Inventario
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-bold text-gris uppercase tracking-wider">
            <CheckCircle2 size={14} className="text-green-500" /> Sujeto a Cupo Cartera
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-bold text-gris uppercase tracking-wider">
            <CheckCircle2 size={14} className="text-green-500" /> Validación Logística
          </div>
        </div>
      </div>
    </div>
  );
}

function ConditionItem({ icon: Icon, label, value, description, valueColor = 'text-texto' }: any) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gris">
          <Icon size={18} />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-gris">{label}</span>
      </div>
      <div>
        <div className={`text-xl font-black ${valueColor} tracking-tight leading-none mb-1`}>{value}</div>
        <p className="text-[10px] font-medium text-gris opacity-70">{description}</p>
      </div>
    </div>
  );
}

function UrgentSLAWidget() {
  const steps = [
    { label: 'Solicitud', status: 'completed' },
    { label: 'Validación', status: 'current' },
    { label: 'Preparación', status: 'pending' },
    { label: 'Ruta', status: 'pending' },
    { label: 'Entrega', status: 'pending' },
  ];

  return (
    <div className="bg-white p-6 rounded-3xl border border-borde tbs-shadow mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gris">SLA Operativo Estimado</div>
        <div className="text-[10px] font-bold text-rojo bg-rojo/5 px-2 py-1 rounded-lg">Flujo prioritario</div>
      </div>
      <div className="relative flex justify-between">
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-100 -z-0" />
        {steps.map((step, idx) => (
          <div key={idx} className="relative z-10 flex flex-col items-center gap-2">
            <div className={`w-8 h-8 rounded-full border-4 border-white shadow-sm flex items-center justify-center transition-all ${
              step.status === 'completed' ? 'bg-green-500' :
              step.status === 'current' ? 'bg-rojo animate-pulse' : 'bg-gray-200'
            }`}>
              {step.status === 'completed' ? <CheckCircle2 size={12} className="text-white" /> : null}
            </div>
            <span className={`text-[9px] font-black uppercase tracking-widest ${
              step.status === 'pending' ? 'text-gris' : 'text-texto'
            }`}>{step.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
        <div>
          <div className="text-[9px] font-black text-gris uppercase mb-1">Confirmación</div>
          <div className="text-xs font-black text-texto">15-30 min</div>
        </div>
        <div>
          <div className="text-[9px] font-black text-gris uppercase mb-1">Entrega total</div>
          <div className="text-xs font-black text-texto">2-4 horas</div>
        </div>
      </div>
    </div>
  );
}

function UrgentAdvisorContact() {
  return (
    <div className="bg-texto text-white p-8 rounded-[32px] tbs-shadow-lg relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-rojo/20 rounded-full -mr-10 -mb-10 blur-2xl" />
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/20">
            <img 
              src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=200&auto=format&fit=crop" 
              alt="Asesor" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-green-500 text-[8px] font-black uppercase tracking-widest rounded-full mb-1">
              <span className="w-1 h-1 bg-white rounded-full animate-ping" /> Disponible
            </div>
            <div className="text-lg font-black tracking-tight leading-tight">Laura Gómez</div>
            <div className="text-xs text-white/60 font-bold uppercase tracking-wider">Asesor Urgent Care TBS</div>
          </div>
        </div>
        <p className="text-sm font-medium text-white/70 mb-8 leading-relaxed">
          "Hola, soy Laura. Estoy validando inventario y rutas ahora para los pedidos HORECA del día. Si tienes una ruptura crítica, escríbeme directamente."
        </p>
        <div className="space-y-3">
          <button className="w-full py-4 bg-white text-texto rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rojo hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer">
            <MessageSquare size={16} /> Hablar por WhatsApp
          </button>
          <button className="w-full py-4 bg-white/10 text-white border border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer">
            <Phone size={16} /> Solicitar llamada
          </button>
        </div>
      </div>
    </div>
  );
}

function UrgentValidationPanel({ totals, isValid, onSubmit }: { totals: any, isValid: boolean, onSubmit: () => void }) {
  const validations = [
    { label: 'Cupo disponible', status: 'valid', icon: ShieldCheck },
    { label: 'Cartera sin mora', status: 'valid', icon: ListChecks },
    { label: 'Inventario local', status: 'warning', icon: AlertCircle },
    { label: 'Ruta logística', status: 'valid', icon: Truck },
    { label: 'Tarifa urgente', status: 'pending', icon: Zap },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[32px] border border-borde tbs-shadow p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-rojo text-white rounded-xl flex items-center justify-center shadow-lg shadow-rojo/20">
            <Zap size={20} />
          </div>
          <h4 className="text-xl font-black text-texto tracking-tight leading-none">Resumen Operativo</h4>
        </div>

        <div className="space-y-4 mb-8">
          {validations.map((v, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-3">
                <v.icon size={16} className={v.status === 'valid' ? 'text-green-500' : v.status === 'warning' ? 'text-orange-500' : 'text-gris'} />
                <span className="text-[10px] font-black uppercase tracking-widest text-gris">{v.label}</span>
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${
                v.status === 'valid' ? 'text-green-600' : 
                v.status === 'warning' ? 'text-orange-600' : 'text-gris'
              }`}>
                {v.status === 'valid' ? 'Correcto' : v.status === 'warning' ? 'Validar' : 'Pendiente'}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-gray-100 space-y-4">
          <div className="flex justify-between items-center text-xs font-black text-gris uppercase tracking-widest">
            <span>Subtotal estimado</span>
            <span className="text-texto">{totals.subtotal}</span>
          </div>
          <div className="flex justify-between items-center text-xs font-black text-rojo uppercase tracking-widest">
            <span>Tarifa despacho urgente</span>
            <span>+ {totals.fee}</span>
          </div>
          <div className="pt-4 flex justify-between items-end">
            <div>
              <div className="text-[10px] font-black uppercase text-gris tracking-widest leading-none mb-1">Total a validar</div>
              <div className="text-3xl font-black text-texto tracking-tighter leading-none">{totals.total}</div>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-orange-50 border border-orange-100 rounded-2xl flex gap-3">
          <AlertCircle size={16} className="text-orange-600 shrink-0 mt-0.5" />
          <p className="text-[10px] font-bold text-orange-800 leading-normal">
            El pedido no se confirma automáticamente. TBS validará disponibilidad final y te contactará.
          </p>
        </div>

        <button 
          onClick={onSubmit}
          disabled={!isValid}
          className="w-full mt-8 py-5 bg-texto text-white rounded-2xl font-black hover:bg-rojo transition-all disabled:opacity-30 disabled:cursor-not-allowed tbs-shadow flex items-center justify-center gap-3 cursor-pointer group"
        >
          <div className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
            <ShieldCheck size={20} className="text-rojo" />
          </div>
          Confirmar y enviar validación
        </button>
      </div>
      
      <UrgentAdvisorContact />
    </div>
  );
}

function UrgentRestrictionsBlock() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="bg-gray-100 border border-gray-200 rounded-2xl overflow-hidden mt-8">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between text-[10px] font-black text-gris uppercase tracking-widest hover:bg-gray-200 transition-colors"
      >
        <span>Condiciones y restricciones del servicio urgente</span>
        <ChevronRight size={16} className={`transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </button>
      {isOpen && (
        <div className="p-6 bg-white space-y-4 text-[10px] font-medium text-gris leading-relaxed border-t border-gray-200">
          <div className="flex gap-2">
            <div className="w-1.5 h-1.5 bg-rojo rounded-full mt-1 shrink-0" />
            <p>Servicio sujeto a disponibilidad de inventario en bodega local.</p>
          </div>
          <div className="flex gap-2">
            <div className="w-1.5 h-1.5 bg-rojo rounded-full mt-1 shrink-0" />
            <p>La validación logística puede tomar entre 15 y 45 minutos.</p>
          </div>
          <div className="flex gap-2">
            <div className="w-1.5 h-1.5 bg-rojo rounded-full mt-1 shrink-0" />
            <p>Se aplica tarifa operativa urgente que será confirmada por el asesor.</p>
          </div>
          <div className="flex gap-2">
            <div className="w-1.5 h-1.5 bg-rojo rounded-full mt-1 shrink-0" />
            <p>No todos los productos del catálogo principal son elegibles para despacho urgente.</p>
          </div>
          <div className="flex gap-2">
            <div className="w-1.5 h-1.5 bg-rojo rounded-full mt-1 shrink-0" />
            <p>Pedidos con novedad de cartera pueden requerir aprobación manual de gerencia.</p>
          </div>
          <div className="flex gap-2">
            <div className="w-1.5 h-1.5 bg-rojo rounded-full mt-1 shrink-0" />
            <p>Las ventanas de entrega son rangos estimados y pueden variar según tráfico o demanda.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function UrgentProductEligibilityCard({ 
  product, 
  isSelected, 
  onToggle, 
  quantity, 
  onUpdateQuantity,
  onConsultAdvisor 
}: any) {
  const isEligible = product.availableForUrgent;
  
  return (
    <div className={`bg-white rounded-2xl border transition-all p-5 relative flex flex-col tbs-shadow ${isSelected ? 'border-rojo ring-1 ring-rojo' : 'border-borde hover:border-rojo/20'}`}>
      <div className="flex gap-4 mb-4">
        <div className="w-20 h-24 bg-white rounded-xl p-2 flex items-center justify-center shrink-0 border border-gray-100 shadow-sm relative">
          <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
          <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-lg flex items-center justify-center shadow-md ${isEligible ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}`}>
            {isEligible ? <Zap size={12} fill="currentColor" /> : <Clock size={12} />}
          </div>
        </div>
        <div className="flex-1">
          <div className="text-[9px] font-black uppercase text-gris tracking-[0.15em] mb-1 opacity-70">{product.category}</div>
          <h4 className="text-sm font-black text-texto tracking-tight leading-[1.3] mb-1 line-clamp-2">{product.name}</h4>
          <div className="text-xs font-black text-gris opacity-50 mb-2 uppercase tracking-tighter">{product.specs}</div>
          <div className="text-base font-black text-rojo-oscuro mb-3">{formatCOP(product.estimatedPrice)}</div>
          
          <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${
            isEligible ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isEligible ? 'bg-green-500' : 'bg-orange-500'}`} />
            {isEligible ? 'Elegible Urgente' : 'Sujeto a Confirmación'}
          </div>
        </div>
      </div>

      <div className="mt-auto pt-5 border-t border-gray-50">
        {isEligible ? (
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-borde">
              <button 
                onClick={() => onUpdateQuantity(-1)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gris hover:text-rojo transition-colors"
              >
                <Minus size={14} />
              </button>
              <div className="w-8 text-center text-xs font-black text-texto">{quantity}</div>
              <button 
                onClick={() => onUpdateQuantity(1)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gris hover:text-rojo transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
            <button 
              onClick={onToggle}
              className={`flex-1 py-3 mt-0 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                isSelected 
                  ? 'bg-texto text-white' 
                  : 'bg-white border-2 border-texto text-texto hover:bg-texto hover:text-white'
              }`}
            >
              {isSelected ? 'Agregado' : 'Añadir'}
            </button>
          </div>
        ) : (
          <button 
            onClick={onConsultAdvisor}
            className="w-full py-3 rounded-xl border border-orange-200 bg-orange-50 text-orange-700 font-black text-[10px] uppercase tracking-widest hover:bg-orange-100 transition-all flex items-center justify-center gap-2"
          >
            <HelpCircle size={14} />
            Consultar disponibilidad
          </button>
        )}
      </div>
    </div>
  );
}

function UrgentPrioritySelector({ selected, onSelect }: any) {
  const priorities = [
    { id: 'standard', label: 'Estandar', description: 'Reposición normal de inventario', color: 'bg-blue-50 text-blue-700 border-blue-100' },
    { id: 'alta', label: 'Alta', description: 'Alta demanda inesperada', color: 'bg-orange-50 text-orange-700 border-orange-100' },
    { id: 'critica', label: 'Crítica HORECA', description: 'Ruptura total de stock operativa', color: 'bg-rojo/5 text-rojo border-rojo/10' },
    { id: 'evento', label: 'Evento hoy', description: 'Garantía para operación de evento', color: 'bg-texto text-white border-texto' },
  ];

  return (
    <div className="flex flex-wrap gap-4">
      {priorities.map(p => (
        <button
          key={p.id}
          onClick={() => onSelect(p.id)}
          className={`px-4 py-3 rounded-2xl border-2 transition-all text-left flex-1 min-w-[140px] ${
            selected === p.id 
              ? 'ring-2 ring-rojo ring-offset-2 border-transparent' 
              : 'border-borde hover:border-rojo/30'
          } ${selected === p.id && p.id === 'evento' ? 'bg-texto text-white' : ''}`}
        >
          <div className="text-[10px] font-black uppercase tracking-[0.1em] mb-1">{p.label}</div>
          <div className="text-[10px] font-medium opacity-70 leading-tight">{p.description}</div>
        </button>
      ))}
    </div>
  );
}

function UrgentRequestStatusBadge({ status }: { status: string }) {
  const states: any = {
    'recepcionada': { label: 'Recibida', color: 'bg-gray-100 text-gray-700' },
    'en_validacion': { label: 'En Validación Operativa', color: 'bg-blue-50 text-blue-700 border-blue-100' },
    'pendiente_inventario': { label: 'Pendiente Inventario', color: 'bg-orange-50 text-orange-700 border-orange-100' },
    'confirmado': { label: 'Confirmado', color: 'bg-green-100 text-green-700 border-green-200' },
  };
  
  const s = states[status] || { label: status, color: 'bg-gray-100' };
  
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${s.color}`}>
      {s.label}
    </span>
  );
}

function UrgentConfirmationModal({ request, onBack, onReset, onTracking }: any) {
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onReset} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="relative bg-white rounded-[40px] max-w-2xl w-full tbs-shadow-lg border-b-8 border-rojo overflow-hidden">
        <div className="p-10">
          <div className="text-center mb-10">
            <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <ShieldCheck size={48} />
            </div>
            <h3 className="text-4xl font-black text-texto mb-2 tracking-tighter">Solicitud enviada</h3>
            <p className="text-gris font-medium text-lg leading-snug">
              Tu solicitud urgente está siendo validada por el equipo de control logístico TBS.
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-[32px] p-8 border border-gray-100 mb-10">
            <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b border-gray-200">
              <div>
                <div className="text-[10px] font-black uppercase text-gris tracking-widest mb-2">Número de Ticket</div>
                <div className="text-2xl font-black text-rojo">{request.id}</div>
              </div>
              <div>
                <div className="text-[10px] font-black uppercase text-gris tracking-widest mb-2">Estado Inicial</div>
                <UrgentRequestStatusBadge status={request.status} />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-y-6 gap-x-8">
              <SmallDetail label="Ciudad" value={request.city} />
              <SmallDetail label="Ventana" value={request.deliveryWindow} />
              <SmallDetail label="Tiempo Estimado" value="15-30 min respuesta" />
              <SmallDetail label="Productos" value={`${request.products.length} Items seleccionados`} />
            </div>
          </div>

          <div className="bg-rojo/5 border border-rojo/10 rounded-2xl p-6 mb-10 flex gap-4 items-start">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-rojo shrink-0 mt-1">
              <TrendingUp size={20} />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-rojo mb-1">Próximo paso</div>
              <p className="text-sm font-bold text-texto leading-tight">
                Recibirás una notificación en la app y un mensaje de tu asesor para confirmar inventario y hora final de entrega.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={onTracking}
              className="flex-1 py-5 bg-texto text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rojo transition-all tbs-shadow shadow-texto/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <History size={18} /> Ver seguimiento
            </button>
            <button 
              onClick={onReset}
              className="flex-1 py-5 bg-gray-100 text-texto rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap size={18} /> Nueva Solicitud
            </button>
          </div>

          <button 
            onClick={onBack}
            className="w-full mt-6 text-xs font-black text-gris uppercase tracking-widest hover:text-rojo transition-colors"
          >
            Volver a mi cuenta
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function SmallDetail({ label, value }: { label: string, value: string }) {
  return (
    <div>
      <div className="text-[9px] font-black uppercase text-gris tracking-widest mb-1">{label}</div>
      <div className="text-sm font-black text-texto truncate">{value}</div>
    </div>
  );
}

const formatCOP = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value).replace('COP', '$');
};

const URGENT_PRODUCTS_DATA: UrgentProduct[] = [
  {
    id: "up-001",
    productId: 1,
    name: "Whisky Premium 750 ml",
    category: "Whisky",
    specs: "Botella individual",
    image: "https://images.unsplash.com/photo-1527045980461-84bc131f13b6?q=80&w=200&auto=format&fit=crop",
    estimatedPrice: 95000,
    availableForUrgent: true,
    stockLabel: "Disponible para urgente",
    suggestedQuantity: 6
  },
  {
    id: "up-002",
    productId: 2,
    name: "Ron Añejo 750 ml",
    category: "Ron",
    specs: "Botella individual",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=200&auto=format&fit=crop",
    estimatedPrice: 62000,
    availableForUrgent: true,
    stockLabel: "Disponible para urgente",
    suggestedQuantity: 6
  },
  {
    id: "up-003",
    productId: 4,
    name: "Vodka Premium 750 ml",
    category: "Vodka",
    specs: "Botella individual",
    image: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=200&auto=format&fit=crop",
    estimatedPrice: 61000,
    availableForUrgent: true,
    stockLabel: "Disponible para urgente",
    suggestedQuantity: 6
  },
  {
    id: "up-004",
    productId: 5,
    name: "Tequila Reposado 750 ml",
    category: "Tequila",
    specs: "Botella individual",
    image: "https://images.unsplash.com/photo-1610450507204-1f19616d2460?q=80&w=200&auto=format&fit=crop",
    estimatedPrice: 74000,
    availableForUrgent: true,
    stockLabel: "Disponible para urgente",
    suggestedQuantity: 4
  },
  {
    id: "up-005",
    productId: 6,
    name: "Aguardiente 750 ml",
    category: "Aguardiente",
    specs: "Botella individual",
    image: "https://images.unsplash.com/photo-1544145945-f904253db0ad?q=80&w=200&auto=format&fit=crop",
    estimatedPrice: 38000,
    availableForUrgent: false,
    stockLabel: "Validar disponibilidad",
    suggestedQuantity: 12
  },
  {
    id: "up-006",
    productId: 9,
    name: "Gin Premium Botánico 750 ml",
    category: "Ginebra",
    specs: "Botella individual",
    image: "https://images.unsplash.com/photo-1551538597-15828bb41103?q=80&w=200&auto=format&fit=crop",
    estimatedPrice: 88000,
    availableForUrgent: true,
    stockLabel: "Disponible para urgente",
    suggestedQuantity: 3
  }
];

const REASONS: { id: UrgentReason; label: string; icon: any }[] = [
  { id: 'ruptura_inventario', label: 'Ruptura de inventario', icon: AlertTriangle },
  { id: 'evento', label: 'Evento', icon: CheckCircle2 },
  { id: 'alta_demanda', label: 'Alta demanda', icon: Zap },
  { id: 'cliente_vip', label: 'Cliente VIP', icon: UserIcon },
  { id: 'reposición_fin_semana', label: 'Reposición fin de semana', icon: Clock },
  { id: 'otro', label: 'Otro', icon: MessageSquare },
];

const DELIVERY_WINDOWS = [
  { id: 'asap', label: 'Lo antes posible', fee: 35000 },
  { id: 'next_2_4', label: 'Próximas 2 a 4 horas', fee: 35000 },
  { id: 'today_afternoon', label: 'Hoy en la tarde', fee: 20000 },
  { id: 'today_night', label: 'Hoy en la noche', fee: 20000 },
  { id: 'tomorrow_morning', label: 'Mañana temprano', fee: 20000 },
];

const CITIES = ['Cartagena', 'Barranquilla', 'Santa Marta', 'Montería', 'Sincelejo', 'Valledupar', 'Otra ciudad'];

type ServiceStatusKey = 'disponible' | 'alta_demanda' | 'ventana_limitada' | 'cerrado' | 'sujeto_confirmacion' | 'no_disponible';

interface CityCondition {
  city: string;
  status: ServiceStatusKey;
  cutoffTime: string;
  availableWindow: string;
  estimatedSLA: string;
  priorityLevel: 'Alta' | 'Media' | 'Crítica' | 'Baja';
  urgentFee: number;
  isHighDemand?: boolean;
  restrictions?: string[];
}

const CITY_CONDITIONS: Record<string, CityCondition> = {
  'Cartagena': {
    city: 'Cartagena',
    status: 'disponible',
    cutoffTime: '4:00 p.m.',
    availableWindow: '2 a 4 horas',
    estimatedSLA: '15-30 min validación',
    priorityLevel: 'Alta',
    urgentFee: 25000,
  },
  'Barranquilla': {
    city: 'Barranquilla',
    status: 'alta_demanda',
    cutoffTime: '3:00 p.m.',
    availableWindow: '4 a 6 horas',
    estimatedSLA: '30-45 min validación',
    priorityLevel: 'Media',
    urgentFee: 35000,
    isHighDemand: true
  },
  'Santa Marta': {
    city: 'Santa Marta',
    status: 'ventana_limitada',
    cutoffTime: '2:00 p.m.',
    availableWindow: '2 horas restantes',
    estimatedSLA: '20 min validación',
    priorityLevel: 'Crítica',
    urgentFee: 25000,
  },
  'Bogotá': {
    city: 'Bogotá',
    status: 'sujeto_confirmacion',
    cutoffTime: '1:00 p.m.',
    availableWindow: 'Validación manual',
    estimatedSLA: 'Siguiente día o validación',
    priorityLevel: 'Alta',
    urgentFee: 45000,
  },
  'Medellín': {
    city: 'Medellín',
    status: 'cerrado',
    cutoffTime: '12:00 p.m.',
    availableWindow: 'Cerrado por hoy',
    estimatedSLA: 'Validación mañana',
    priorityLevel: 'Baja',
    urgentFee: 0,
  }
};

const OPERATIONAL_STATUSES: Record<ServiceStatusKey, { label: string; description: string; color: string; icon: any }> = {
  disponible: {
    label: 'Disponible',
    description: 'Servicio urgente disponible para esta ciudad.',
    color: 'text-green-600 bg-green-50 border-green-100',
    icon: CheckCircle2
  },
  alta_demanda: {
    label: 'Alta demanda',
    description: 'Servicio disponible con tiempos extendidos por alta demanda.',
    color: 'text-orange-600 bg-orange-50 border-orange-100',
    icon: Activity
  },
  ventana_limitada: {
    label: 'Ventana limitada',
    description: 'Quedan pocas ventanas disponibles para hoy.',
    color: 'text-yellow-600 bg-yellow-50 border-yellow-100',
    icon: Clock
  },
  cerrado: {
    label: 'Cerrado por horario',
    description: 'El horario de solicitud urgente para hoy ya cerró.',
    color: 'text-gray-600 bg-gray-50 border-gray-100',
    icon: X
  },
  sujeto_confirmacion: {
    label: 'Sujeto a confirmación',
    description: 'La disponibilidad depende de inventario, cupo y logística.',
    color: 'text-blue-600 bg-blue-50 border-blue-100',
    icon: AlertCircle
  },
  no_disponible: {
    label: 'No disponible',
    description: 'Pedido urgente no disponible para esta ciudad.',
    color: 'text-rojo bg-rojo/5 border-rojo/10',
    icon: AlertTriangle
  }
};

export function UrgentOrderPage({ 
  currentUser, 
  onBackToAccount, 
  onGoHome, 
  onGoTracking,
  onGoCatalog,
  onGoAdvisorChat,
  onCreateNotification
}: UrgentOrderPageProps) {
  const analytics = useAnalytics(currentUser);
  
  // Tracking page view
  useEffect(() => {
    analytics.track('urgent_order_viewed', 'checkout', {
      city: currentUser?.city
    });
    analytics.trackFormStart('urgent_order', 'urgent_order_page');
  }, []);

  // Form State
  const [selectedCity, setSelectedCity] = useState(currentUser?.city || 'Cartagena');
  const cityCondition = CITY_CONDITIONS[selectedCity] || CITY_CONDITIONS['Cartagena'];
  
  const [reason, setReason] = useState<UrgentReason | null>(null);
  const city = selectedCity;
  const address = currentUser?.address || 'Dirección registrada en contrato B2B';
  const [deliveryWindow, setDeliveryWindow] = useState('asap');
  const [contactName, setContactName] = useState(currentUser?.name || '');
  const [contactPhone, setContactPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    const q: Record<string, number> = {};
    URGENT_PRODUCTS_DATA.forEach(p => {
      q[p.id] = p.suggestedQuantity;
    });
    return q;
  });
  const [selectedProducts, setSelectedProducts] = useState<Record<string, { product: UrgentProduct; quantity: number }>>({});
  
  // UI State
  const [showConfirmModal, setShowConfirmModal] = useState<UrgentOrderRequest | null>(null);
  const [showAdvisorModal, setShowAdvisorModal] = useState<UrgentProduct | null>(null);

  // Derived Values
  const filteredProducts = useMemo(() => {
    return URGENT_PRODUCTS_DATA.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                             p.category.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === 'Todos' || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(URGENT_PRODUCTS_DATA.map(p => p.category)));
    return ['Todos', ...cats];
  }, []);

  const logisticFee = useMemo(() => {
    // Priority and city affect fee
    let baseFee = cityCondition.urgentFee || 25000;
    if (reason === 'cliente_vip') baseFee = baseFee * 0.8; // Discount for VIP? Or maybe more for critical
    
    const window = DELIVERY_WINDOWS.find(w => w.label === deliveryWindow) || DELIVERY_WINDOWS.find(w => w.id === deliveryWindow);
    return window ? baseFee : 20000;
  }, [deliveryWindow, cityCondition, reason]);

  const totals = useMemo(() => {
    const productsArray = Object.values(selectedProducts) as { product: UrgentProduct; quantity: number }[];
    const subtotal = productsArray.reduce((sum, item) => sum + (item.product.estimatedPrice * item.quantity), 0);
    const units = productsArray.reduce((sum, item) => sum + item.quantity, 0);
    return { subtotal, units, total: subtotal + logisticFee };
  }, [selectedProducts, logisticFee]);

  const isFormValid = useMemo(() => {
    return (
      reason !== null &&
      contactName.length > 3 &&
      contactPhone.length >= 7 &&
      Object.keys(selectedProducts).length > 0
    );
  }, [reason, contactName, contactPhone, selectedProducts]);

  // Handlers
  const handleToggleProduct = (product: UrgentProduct) => {
    if (selectedProducts[product.id]) {
      const newSelected = { ...selectedProducts };
      delete newSelected[product.id];
      setSelectedProducts(newSelected);
    } else {
      setSelectedProducts({
        ...selectedProducts,
        [product.id]: { product, quantity: quantities[product.id] || product.suggestedQuantity }
      });
      analytics.track('product_selected', 'catalog', {
        productId: product.productId,
        productName: product.name,
        source: 'urgent_order'
      });
    }
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    const newQty = Math.max(1, (quantities[id] || 1) + delta);
    setQuantities(prev => ({ ...prev, [id]: newQty }));
    
    if (selectedProducts[id]) {
      setSelectedProducts(prev => ({
        ...prev,
        [id]: { ...prev[id], quantity: newQty }
      }));
    }
  };

  const handleSubmit = () => {
    if (!isFormValid) {
      analytics.trackFormSubmit('urgent_order', false, {
        reason: 'missing_required_fields'
      });
      return;
    }

    const request: UrgentOrderRequest = {
      id: `URG-${Math.floor(1000 + Math.random() * 9000)}`,
      reason: reason!,
      city,
      address,
      deliveryWindow: DELIVERY_WINDOWS.find(w => w.id === deliveryWindow)?.label || deliveryWindow,
      contactName,
      contactPhone,
      notes,
      products: (Object.values(selectedProducts) as { product: UrgentProduct; quantity: number }[]).map(item => ({ product: item.product, quantity: item.quantity })),
      estimatedTotal: totals.total,
      status: 'en_validacion'
    };

    analytics.track('urgent_order_submitted', 'checkout', {
      requestId: request.id,
      reason: request.reason,
      deliveryWindow: request.deliveryWindow,
      productCount: request.products.length,
      estimatedTotal: request.estimatedTotal
    });
    analytics.trackFormSubmit('urgent_order', true, {
      requestId: request.id
    });

    setShowConfirmModal(request);

    // Notify internal if enabled
    if (onCreateNotification) {
      onCreateNotification({
        id: `notif-urgent-${Date.now()}`,
        type: 'pedido_urgente',
        title: "Solicitud urgente recibida",
        message: "Tu solicitud urgente está en validación logística.",
        read: false,
        priority: 'alta',
        actionTarget: 'ordersTracking',
        context: {
          label: "Id Solicitud",
          value: request.id,
          entityType: 'solicitud_urgente'
        }
      });
    }
  };

  const resetForm = () => {
    setReason(null);
    setDeliveryWindow('asap');
    setContactPhone('');
    setNotes('');
    setSelectedProducts({});
    setShowConfirmModal(null);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32">
      {/* Header section */}
      <div className="bg-white border-b border-borde pt-8 pb-10">
        <div className="max-w-[1480px] mx-auto px-8">
          <button 
            onClick={onBackToAccount}
            className="flex items-center gap-2 text-gris hover:text-rojo font-black text-xs uppercase tracking-wider mb-6 group transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Volver a mi cuenta
          </button>
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-texto">Pedido urgente</h1>
                <span className="bg-rojo text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">Servicio Premium</span>
              </div>
              <p className="text-gris font-medium text-lg leading-relaxed max-w-2xl">
                Solicita abastecimiento para operación inmediata. El servicio está sujeto a ciudad, inventario, horario y ventana logística.
              </p>
            </div>
            <div className="bg-gray-50 px-6 py-4 rounded-2xl border border-borde">
              <div className="text-[10px] font-black uppercase tracking-widest text-rojo mb-1">Operación B2B</div>
              <div className="text-lg font-black text-texto">{currentUser?.businessName || 'Cargando...'}</div>
              <div className="text-xs font-extrabold text-gris mt-1 uppercase tracking-tight">{currentUser?.city}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1480px] mx-auto px-8 mt-10">
        {/* Urgent Service Conditions Header Block */}
        <UrgentServiceConditions 
          condition={cityCondition} 
          onCityChange={setSelectedCity}
        />

        {/* Operational Status Banner */}
        <div className={`mb-10 p-6 rounded-3xl border flex items-center justify-between gap-6 ${OPERATIONAL_STATUSES[cityCondition.status].color}`}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white border border-current/10 flex items-center justify-center">
              {React.createElement(OPERATIONAL_STATUSES[cityCondition.status].icon, { size: 24 })}
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-80">Estado operativo hoy</div>
              <div className="text-xl font-black tracking-tight">{OPERATIONAL_STATUSES[cityCondition.status].label}</div>
            </div>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-xs font-bold leading-relaxed">{OPERATIONAL_STATUSES[cityCondition.status].description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-12">
            {/* Section 1: Urgency Level */}
            <section className="space-y-6">
              <SectionHeader 
                eyebrow="Nivel de Prioridad"
                title="¿Cuál es el motivo de la urgencia?"
                description="Selecciona la prioridad para que nuestro equipo logístico asigne los recursos adecuados."
              />
              <UrgentPrioritySelector selected={reason} onSelect={setReason} />
            </section>

            {/* Section 2: Delivery */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-texto text-white flex items-center justify-center font-black text-xs">2</div>
                <h3 className="text-xl font-black text-texto uppercase tracking-tight">Datos de entrega</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 rounded-3xl border border-borde tbs-shadow">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gris">Ciudad de urgencia</label>
                  <div className="w-full h-12 bg-gray-100 border border-borde rounded-xl px-4 flex items-center gap-2">
                    <MapPin size={16} className="text-gris/40" />
                    <span className="font-black text-texto opacity-60">{city}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gris">Dirección de entrega</label>
                  <div className="w-full h-12 bg-gray-100 border border-borde rounded-xl px-4 flex items-center gap-2">
                    <MapPin size={16} className="text-gris/40" />
                    <span className="font-black text-texto opacity-60 truncate">{address}</span>
                  </div>
                </div>
                <div className="md:col-span-2 py-2 px-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-3">
                  <Info size={14} className="text-blue-600" />
                  <span className="text-[10px] font-bold text-blue-700">Los datos de entrega están vinculados a tu cuenta B2B y no pueden ser modificados para pedidos urgentes.</span>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gris">Ventana de entrega</label>
                  <select 
                    value={deliveryWindow}
                    onChange={(e) => setDeliveryWindow(e.target.value)}
                    className="w-full h-12 bg-gray-50 border border-borde rounded-xl px-4 font-black text-texto outline-none focus:border-rojo appearance-none"
                  >
                    {DELIVERY_WINDOWS.map(w => <option key={w.id} value={w.id}>{w.label}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gris">Persona de contacto</label>
                  <input 
                    type="text" 
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Nombre completo"
                    className="w-full h-12 bg-gray-50 border border-borde rounded-xl px-4 font-black text-texto outline-none focus:border-rojo"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gris">Celular de contacto</label>
                  <input 
                    type="tel" 
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="Ej: 317 123 4567"
                    className="w-full h-12 bg-gray-50 border border-borde rounded-xl px-4 font-black text-texto outline-none focus:border-rojo"
                  />
                </div>
              </div>
            </section>

            {/* Section 3: Products */}
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <SectionHeader
                  eyebrow="Selección de inventario"
                  title="Productos urgentes"
                  description="Solo productos con disponibilidad para despacho inmediato."
                />
              </div>

              <div className="bg-white p-6 rounded-3xl border border-borde tbs-shadow space-y-6">
                {/* Search & Categories */}
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gris" size={20} />
                    <input 
                      type="text" 
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Buscar producto urgente por nombre o categoría"
                      className="w-full h-12 bg-gray-50 border border-borde rounded-xl pl-12 pr-6 font-semibold outline-none focus:border-rojo transition-colors"
                    />
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap cursor-pointer ${
                          activeCategory === cat ? 'bg-rojo text-white' : 'bg-gray-50 text-gris hover:bg-gray-100'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredProducts.length > 0 ? filteredProducts.map(p => (
                    <UrgentProductEligibilityCard 
                      key={p.id}
                      product={p}
                      isSelected={!!selectedProducts[p.id]}
                      onToggle={() => handleToggleProduct(p)}
                      quantity={quantities[p.id] || p.suggestedQuantity}
                      onUpdateQuantity={(delta: number) => handleUpdateQuantity(p.id, delta)}
                      onConsultAdvisor={() => setShowAdvisorModal(p)}
                    />
                  )) : (
                    <div className="col-span-full py-12">
                      <EmptyState 
                        variant="warning"
                        title="No encontramos productos urgentes"
                        description={`No hay resultados para "${search}" en la categoría ${activeCategory}.`}
                        primaryActionLabel="Limpiar búsqueda"
                        onPrimaryAction={() => {
                          setSearch('');
                          setActiveCategory('Todos');
                        }}
                        secondaryActionLabel="Hablar con asesor"
                        onSecondaryAction={() => onGoAdvisorChat('producto', { label: 'Consulta disponibilidad urgente', type: 'soporte' })}
                        compact
                      />
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Section 4: Notes */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-texto text-white flex items-center justify-center font-black text-xs">4</div>
                <h3 className="text-xl font-black text-texto uppercase tracking-tight">Observaciones operativas</h3>
              </div>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej: pedido para evento esta noche, entregar por recepción, llamar antes de llegar, acceso por parqueadero, productos sustitutos permitidos, etc."
                className="w-full h-32 bg-white border border-borde rounded-3xl p-6 font-semibold text-texto outline-none focus:border-rojo resize-none tbs-shadow"
              />
              
              <UrgentRestrictionsBlock />
            </section>
          </div>

          {/* Lateral Panel */}
          <div className="lg:col-span-1 space-y-6">
            <UrgentSLAWidget />
            <UrgentValidationPanel 
              totals={{
                subtotal: formatCOP(totals.subtotal),
                fee: formatCOP(logisticFee),
                total: formatCOP(totals.total)
              }} 
              isValid={isFormValid} 
              onSubmit={handleSubmit} 
            />
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={resetForm} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative bg-white rounded-[40px] max-w-2xl w-full tbs-shadow border-4 border-white overflow-hidden">
              <div className="p-10 text-center">
                <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-3xl font-black text-texto mb-2 tracking-tight">Solicitud urgente recibida</h3>
                <p className="text-gris font-medium text-lg leading-snug mb-8">
                  El equipo TBS validará inventario, ruta y condiciones comerciales para confirmar la entrega.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 rounded-[32px] p-8 text-left mb-8">
                  <div className="space-y-4">
                    <div>
                      <div className="text-[10px] font-black uppercase text-gris tracking-widest mb-1">Número de solicitud</div>
                      <div className="text-lg font-black text-rojo">{showConfirmModal.id}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase text-gris tracking-widest mb-1">Motivo</div>
                      <div className="text-sm font-black text-texto uppercase">{REASONS.find(r => r.id === showConfirmModal.reason)?.label}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase text-gris tracking-widest mb-1">Ciudad y dirección</div>
                      <div className="text-sm font-black text-texto leading-snug">{showConfirmModal.city}, {showConfirmModal.address}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase text-gris tracking-widest mb-1">Ventana de entrega</div>
                      <div className="text-sm font-black text-texto">{showConfirmModal.deliveryWindow}</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="text-[10px] font-black uppercase text-gris tracking-widest mb-1">Contacto</div>
                      <div className="text-sm font-black text-texto">{showConfirmModal.contactName}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase text-gris tracking-widest mb-1">Celular</div>
                      <div className="text-sm font-black text-texto">{showConfirmModal.contactPhone}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase text-gris tracking-widest mb-1">Resumen selección</div>
                      <div className="text-sm font-black text-texto">{showConfirmModal.products.length} productos ({showConfirmModal.products.reduce((s,i) => s+i.quantity, 0)} uds)</div>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                      <div className="flex justify-between items-end">
                        <div className="text-[10px] font-black uppercase text-gris tracking-widest">Estado</div>
                        <span className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-[10px] font-black uppercase border border-yellow-100">En validación</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={onBackToAccount}
                    className="flex-1 py-4 border-2 border-borde text-gris rounded-xl font-black hover:border-rojo/30 hover:text-rojo transition-all cursor-pointer"
                  >
                    Volver a mi cuenta
                  </button>
                  <button 
                    onClick={resetForm}
                    className="flex-1 py-4 bg-gray-100 text-texto rounded-xl font-black hover:bg-gray-200 transition-all cursor-pointer"
                  >
                    Hacer otra solicitud
                  </button>
                  <button 
                    onClick={() => {
                      onGoTracking();
                      setShowConfirmModal(null);
                    }}
                    className="flex-1 py-4 bg-texto text-white rounded-xl font-black hover:bg-rojo transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Truck size={18} /> Ver seguimiento
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Advisor Modal */}
      <AnimatePresence>
        {showAdvisorModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAdvisorModal(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative bg-white p-8 rounded-[32px] max-w-sm w-full tbs-shadow">
              <button onClick={() => setShowAdvisorModal(null)} className="absolute top-6 right-6 text-gris hover:text-texto transition-colors cursor-pointer">
                <X size={24} />
              </button>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle size={32} />
                </div>
                <h3 className="text-2xl font-black text-texto mb-1 leading-tight">Consultar disponibilidad urgente</h3>
                <p className="text-sm font-medium text-gris mb-8 leading-relaxed">
                  Tu asesor TBS puede validar inventario, sustitutos o próxima disponibilidad para este producto.
                </p>
                
                <div className="bg-gray-50 rounded-2xl p-6 text-left space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <img src={showAdvisorModal.image} alt="" className="w-10 h-10 object-contain bg-white rounded-lg border border-borde p-1" />
                    <div>
                      <div className="text-[10px] font-black uppercase text-gris tracking-widest mb-0.5">Producto</div>
                      <div className="text-xs font-black text-texto leading-tight">{showAdvisorModal.name}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase text-gris tracking-widest mb-1">Asesor asignado</div>
                    <div className="text-sm font-black text-texto">Laura Gómez</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase text-gris tracking-widest mb-1">WhatsApp de urgencias</div>
                    <div className="text-sm font-black text-texto">317 123 4567</div>
                  </div>
                </div>

                <div className="bg-white border border-borde rounded-xl p-4 mb-8 text-left italic text-xs text-gris">
                  "Hola, necesito validar disponibilidad urgente de {showAdvisorModal.name}."
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={() => {
                      onGoAdvisorChat('producto', { label: showAdvisorModal.name, type: 'producto' });
                      setShowAdvisorModal(null);
                    }}
                    className="w-full py-4 bg-rojo text-white rounded-xl font-black flex items-center justify-center gap-2 hover:bg-texto transition-all cursor-pointer"
                  >
                    <MessageSquare size={18} /> Chatear con mi asesor
                  </button>
                  <button onClick={() => setShowAdvisorModal(null)} className="w-full py-4 border border-borde text-gris rounded-xl font-black hover:bg-gray-50 transition-all cursor-pointer">
                    Cerrar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

