import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, 
  CreditCard, 
  Clock, 
  History, 
  FileText, 
  ShieldCheck, 
  Plus, 
  X, 
  Upload, 
  Download,
  AlertCircle, 
  CheckCircle2, 
  ChevronRight,
  MessageSquare,
  Building2,
  User as UserIcon,
  Phone,
  Mail,
  MapPin,
  TrendingUp,
  FileCheck,
  Search,
  ExternalLink,
  Lock,
  Trash2,
  FileSearch,
  Check,
  Zap,
  Star,
  ClipboardList
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  CreditRequest, 
  CreditRequestType, 
  CreditRequestStatus, 
  CreditDocumentType, 
  CreditAttachment, 
  CreditReference,
  LegalPageKey
} from '../types';
import { useAnalytics } from '../hooks/useAnalytics';

interface CreditRequestPageProps {
  currentUser: User | null;
  creditRequests: CreditRequest[];
  onBackToAccount: () => void;
  onGoPayments: () => void;
  onGoAdvisorChat: (topic?: any, context?: any) => void;
  onGoLegalPage?: (key: LegalPageKey) => void;
  onCreateNotification?: (notification: any) => void;
  onCreateCreditRequest: (request: CreditRequest) => void;
}

export function CreditRequestPage({
  currentUser,
  creditRequests,
  onBackToAccount,
  onGoPayments,
  onGoAdvisorChat,
  onGoLegalPage,
  onCreateNotification,
  onCreateCreditRequest
}: CreditRequestPageProps) {
  const analytics = useAnalytics(currentUser);
  const [activeTab, setActiveTab] = useState<'nueva' | 'historial' | 'documentos'>('nueva');
  const [showSuccess, setShowSuccess] = useState(false);
  const [newRequest, setNewRequest] = useState<CreditRequest | null>(null);
  const [selectedHistoryRequest, setSelectedHistoryRequest] = useState<CreditRequest | null>(null);

  // Form State
  const [requestType, setRequestType] = useState<CreditRequestType>(
    (currentUser?.creditLimit && currentUser.creditLimit > 0) ? 'aumento_cupo' : 'nuevo_credito'
  );
  const [businessData, setBusinessData] = useState({
    businessName: currentUser?.businessName || '',
    nit: '',
    city: currentUser?.city || '',
    businessType: currentUser?.customerType || '',
    yearsInBusiness: '',
    monthlySalesRange: '',
    averageMonthlyPurchase: '',
    requestedAmount: '',
    paymentTermRequested: 'contado' as any,
    notes: ''
  });
  const [legalRep, setLegalRep] = useState({
    name: '',
    id: '',
    phone: '',
    email: ''
  });
  const [contact, setContact] = useState({
    name: currentUser?.name || '',
    role: '',
    phone: '',
    email: currentUser?.email || ''
  });
  const [references, setReferences] = useState<CreditReference[]>([
    { id: 'ref-1', companyName: '', contactName: '', phone: '', relationshipType: 'proveedor' }
  ]);
  const [attachments, setAttachments] = useState<Partial<CreditAttachment>[]>([]);
  const [authorizations, setAuthorizations] = useState({
    dataTreatment: false,
    creditCheck: false,
    terms: false
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorFiles, setErrorFiles] = useState<string[]>([]);

  React.useEffect(() => {
    analytics.track('credit_request_started', 'engagement', { page: 'creditRequest' });
  }, []);

  const handleAddReference = () => {
    setReferences(prev => [...prev, { 
      id: `ref-${Date.now()}`, 
      companyName: '', 
      contactName: '', 
      phone: '', 
      relationshipType: 'proveedor' 
    }]);
  };

  const handleRemoveReference = (id: string) => {
    setReferences(prev => prev.filter(ref => ref.id !== id));
  };

  const handleReferenceChange = (id: string, field: string, value: string) => {
    setReferences(prev => prev.map(ref => ref.id === id ? { ...ref, [field]: value } : ref));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: CreditDocumentType, label: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setErrorFiles(prev => [...prev, label]);
      return;
    }

    setErrorFiles(prev => prev.filter(l => l !== label));
    
    const newAttachment = {
      id: `att-${Date.now()}`,
      type: type,
      fileName: file.name,
      fileSize: file.size,
      uploadedAt: new Date().toLocaleDateString(),
      status: 'pendiente' as const
    };

    setAttachments(prev => {
      const filtered = prev.filter(a => a.type !== type);
      return [...filtered, newAttachment as CreditAttachment];
    });

    analytics.track('credit_document_attached', 'engagement', {
      metadata: {
        documentType: type,
        fileExtension: file.name.split('.').pop() || 'unknown',
        fileSizeRange: file.size < 1024 * 1024 ? '<1MB' : (file.size < 5 * 1024 * 1024 ? '1-5MB' : '5-10MB')
      }
    });
  };

  const handleRemoveAttachment = (type: CreditDocumentType) => {
    setAttachments(prev => prev.filter(a => a.type !== type));
  };

  const isFormValid = () => {
    const requiredDocs = ['rut', 'camara_comercio', 'cedula_representante', 'pagare'];
    if (requestType === 'aumento_cupo') {
      // Logic from prompt: "Si el tipo de solicitud es aumento de cupo: También exigir estados financieros o extractos bancarios."
      const hasFinancials = attachments.some(a => a.type === 'estados_financieros' as any || a.type === 'referencia_comercial' as any);
      if (!hasFinancials) return false;
    }
    
    const hasRequiredDocs = requiredDocs.every(type => attachments.some(a => a.type === type));
    
    return (
      requestType &&
      businessData.businessName &&
      businessData.nit &&
      businessData.city &&
      businessData.businessType &&
      businessData.requestedAmount &&
      businessData.paymentTermRequested &&
      legalRep.name &&
      legalRep.id &&
      contact.name &&
      contact.phone &&
      contact.email &&
      references.length >= 1 &&
      references[0].companyName &&
      hasRequiredDocs &&
      authorizations.dataTreatment &&
      authorizations.creditCheck &&
      authorizations.terms
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;

    const request: CreditRequest = {
      id: `cred-${Date.now()}`,
      number: `CRD-${Date.now().toString().slice(-6)}`,
      requestType,
      status: 'en_analisis',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      businessName: businessData.businessName,
      nit: businessData.nit,
      city: businessData.city,
      businessType: businessData.businessType,
      requestedAmount: Number(businessData.requestedAmount),
      currentCreditLimit: currentUser?.creditLimit,
      averageMonthlyPurchase: Number(businessData.averageMonthlyPurchase),
      paymentTermRequested: businessData.paymentTermRequested,
      legalRepresentativeName: legalRep.name,
      legalRepresentativeId: legalRep.id,
      contactName: contact.name,
      contactPhone: contact.phone,
      contactEmail: contact.email,
      monthlySalesRange: businessData.monthlySalesRange,
      yearsInBusiness: businessData.yearsInBusiness,
      hasOtherSuppliersCredit: true, // Simulated
      references: references.filter(r => r.companyName),
      attachments: attachments as CreditAttachment[],
      history: [
        {
          status: 'enviada',
          date: new Date().toISOString().replace('T', ' ').slice(0, 16),
          comment: 'Solicitud enviada para análisis',
          userId: currentUser?.id || 'system',
          userName: currentUser?.name || 'Cliente'
        }
      ]
    };

    onCreateCreditRequest(request);
    setNewRequest(request);
    setShowSuccess(true);
    
    if (onCreateNotification) {
      onCreateNotification({
        type: "cartera",
        title: "Solicitud de crédito enviada",
        message: "Tu solicitud de crédito fue recibida y está en análisis.",
        priority: "media",
        actionTarget: "creditRequest"
      });
    }

    analytics.track('credit_request_submitted', 'engagement', {
      success: true,
      orderValue: Number(businessData.requestedAmount),
      metadata: {
        requestType,
        paymentTermRequested: businessData.paymentTermRequested,
        attachmentCount: attachments.length,
        referenceCount: references.length,
        city: businessData.city,
        businessType: businessData.businessType
      }
    });
  };

  if (showSuccess && newRequest) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 pb-24">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-white rounded-[40px] p-12 text-center tbs-shadow border border-borde"
        >
          <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-4xl font-black text-texto tracking-tighter mb-4">Solicitud de crédito enviada</h2>
          <p className="text-gris font-medium mb-12 max-w-lg mx-auto">
            Tu solicitud fue recibida y quedó en análisis. El equipo TBS revisará la información y podrá solicitar documentos adicionales si lo considera necesario.
          </p>

          <div className="grid grid-cols-2 gap-6 mb-12 text-left">
            <div className="p-6 bg-gray-50 rounded-3xl border border-borde">
              <div className="text-[10px] font-black uppercase text-gris tracking-widest mb-1">Solicitud #</div>
              <div className="text-lg font-black text-texto">{newRequest.requestNumber}</div>
            </div>
            <div className="p-6 bg-gray-50 rounded-3xl border border-borde">
              <div className="text-[10px] font-black uppercase text-gris tracking-widest mb-1">Tipo</div>
              <div className="text-lg font-black text-texto">{newRequest.requestType.replace('_', ' ')}</div>
            </div>
            <div className="p-6 bg-gray-50 rounded-3xl border border-borde">
              <div className="text-[10px] font-black uppercase text-gris tracking-widest mb-1">Monto solicitado</div>
              <div className="text-lg font-black text-rojo">
                {newRequest.requestedAmount.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })}
              </div>
            </div>
            <div className="p-6 bg-gray-50 rounded-3xl border border-borde">
              <div className="text-[10px] font-black uppercase text-gris tracking-widest mb-1">Estado</div>
              <div className="text-lg font-black text-orange-600">En análisis</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => {
                setShowSuccess(false);
                setActiveTab('historial');
                window.scrollTo(0, 0);
              }}
              className="px-8 py-4 bg-texto text-white rounded-2xl font-black hover:bg-rojo transition-all cursor-pointer"
            >
              Ver historial
            </button>
            <button 
              onClick={onBackToAccount}
              className="px-8 py-4 bg-gray-100 text-texto rounded-2xl font-black hover:bg-gray-200 transition-all cursor-pointer"
            >
              Volver a mi cuenta
            </button>
            <button 
              onClick={() => onGoAdvisorChat('cartera', { label: `Solicitud de crédito ${newRequest.requestNumber}`, type: 'cartera' })}
              className="px-8 py-4 border border-borde text-texto rounded-2xl font-black hover:bg-gray-50 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <MessageSquare size={20} /> Hablar con asesor
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-borde sticky top-0 z-30">
        <div className="max-w-[1480px] mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={onBackToAccount}
              className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-texto hover:bg-rojo hover:text-white transition-all cursor-pointer"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-black text-texto tracking-tighter">Solicitud de crédito B2B</h1>
              <div className="flex items-center gap-2 text-xs font-bold text-gris">
                <span>{currentUser?.businessName}</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                <span>{currentUser?.city}</span>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-8">
             <div className="text-right">
                <div className="text-[10px] font-black text-gris uppercase tracking-widest mb-0.5">Cupo Actual</div>
                <div className="text-lg font-black text-texto">
                  {currentUser?.creditLimit?.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }) || '$0'}
                </div>
             </div>
             <div className="w-px h-10 bg-gray-100" />
             <div className="text-right">
                <div className="text-[10px] font-black text-gris uppercase tracking-widest mb-0.5">Cupo Disponible</div>
                <div className="text-lg font-black text-texto">
                  {currentUser?.availableCredit?.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }) || '$0'}
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1480px] mx-auto px-8 mt-10">
        {/* Header/Intro Block */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[40px] p-10 border border-borde tbs-shadow relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-rojo/5 rounded-full -mr-32 -mt-32 blur-3xl" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-rojo-suave text-rojo rounded-2xl flex items-center justify-center mb-6">
                  <CreditCard size={28} />
                </div>
                <h2 className="text-3xl font-black text-texto tracking-tighter mb-4">Gestión de Crédito Comercial</h2>
                <p className="text-gris font-medium text-lg leading-relaxed mb-8 max-w-2xl">
                  Diligencia la información de tu negocio y adjunta los documentos requeridos para que TBS analice tu solicitud de crédito comercial o aumento de cupo.
                </p>
                <div className="flex flex-wrap gap-4">
                   <div className="px-5 py-3 bg-gray-50 rounded-2xl border border-borde flex items-center gap-3">
                      <Clock className="text-rojo" size={18} />
                      <span className="text-xs font-black text-texto">Análisis en 48-72h</span>
                   </div>
                   <div className="px-5 py-3 bg-gray-50 rounded-2xl border border-borde flex items-center gap-3">
                      <ShieldCheck className="text-rojo" size={18} />
                      <span className="text-xs font-black text-texto">Proceso Seguro</span>
                   </div>
                   <div className="px-5 py-3 bg-gray-50 rounded-2xl border border-borde flex items-center gap-3">
                      <FileCheck className="text-rojo" size={18} />
                      <span className="text-xs font-black text-texto">Documentación Digital</span>
                   </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-texto text-white rounded-[40px] p-10 border border-texto tbs-shadow">
             <div className="flex items-center gap-3 mb-6">
                <AlertCircle className="text-rojo" size={24} />
                <h3 className="text-xl font-black tracking-tight">Antes de solicitar</h3>
             </div>
             <p className="text-white/70 text-sm font-medium mb-6">
                La solicitud será revisada por el equipo TBS. La aprobación y condiciones están sujetas a validación comercial y políticas internas.
             </p>
             <ul className="space-y-4">
                {[
                  "No garantiza aprobación automática.",
                  "TBS puede solicitar más documentos.",
                  "Solo para análisis comercial.",
                  "Resultado vía asesor o portal.",
                  "Requiere autorización de datos."
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs font-bold">
                    <div className="mt-1 w-1.5 h-1.5 bg-rojo rounded-full flex-shrink-0" />
                    {item}
                  </li>
                ))}
             </ul>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex gap-4 mb-10 overflow-x-auto pb-2 scrollbar-hide">
          <button 
            onClick={() => setActiveTab('nueva')}
            className={`flex items-center gap-3 px-8 py-5 rounded-[24px] font-black text-sm transition-all cursor-pointer whitespace-nowrap shadow-sm border ${
              activeTab === 'nueva' 
              ? 'bg-rojo text-white border-rojo shadow-rojo/20' 
              : 'bg-white text-gris border-borde hover:border-rojo/30 hover:text-rojo'
            }`}
          >
            <Plus size={20} />
            Nueva Solicitud
          </button>
          <button 
            onClick={() => setActiveTab('historial')}
            className={`flex items-center gap-3 px-8 py-5 rounded-[24px] font-black text-sm transition-all cursor-pointer whitespace-nowrap shadow-sm border ${
              activeTab === 'historial' 
              ? 'bg-rojo text-white border-rojo shadow-rojo/20' 
              : 'bg-white text-gris border-borde hover:border-rojo/30 hover:text-rojo'
            }`}
          >
            <History size={20} />
            Historial ({creditRequests.length})
          </button>
          <button 
            onClick={() => setActiveTab('documentosc')}
            className={`flex items-center gap-3 px-8 py-5 rounded-[24px] font-black text-sm transition-all cursor-pointer whitespace-nowrap shadow-sm border ${
              activeTab === 'documentosc' 
              ? 'bg-rojo text-white border-rojo shadow-rojo/20' 
              : 'bg-white text-gris border-borde hover:border-rojo/30 hover:text-rojo'
            }`}
          >
            <FileSearch size={20} />
            Documentos Requeridos
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'nueva' && (
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Sección 1: Tipo de Solicitud */}
              <div className="bg-white rounded-[40px] p-10 border border-borde tbs-shadow">
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-10 h-10 bg-rojo-suave text-rojo rounded-xl flex items-center justify-center">
                      <Zap size={20} />
                   </div>
                   <h3 className="text-xl font-black text-texto tracking-tighter">Tipo de Solicitud</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { id: 'nuevo_credito', label: 'Nuevo Crédito', desc: 'Solicita tu primer cupo comercial con TBS.', icon: Plus },
                    { id: 'aumento_cupo', label: 'Aumento de Cupo', desc: 'Eleva el cupo actual para ampliar tu operación.', icon: TrendingUp },
                    { id: 'actualizacion_datos', label: 'Actualización', desc: 'Renueva tus documentos y datos comerciales.', icon: History }
                  ].map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setRequestType(type.id as CreditRequestType)}
                      className={`p-6 rounded-[32px] border-2 text-left transition-all cursor-pointer group relative ${
                        requestType === type.id 
                        ? 'border-rojo bg-rojo/5' 
                        : 'border-gray-100 bg-gray-50 hover:border-rojo/30'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all ${
                        requestType === type.id ? 'bg-rojo text-white' : 'bg-white text-gris group-hover:text-rojo'
                      }`}>
                        <type.icon size={24} />
                      </div>
                      <div className="font-black text-texto mb-1">{type.label}</div>
                      <div className="text-xs font-bold text-gris leading-relaxed">{type.desc}</div>
                      
                      {requestType === type.id && (
                        <div className="absolute top-4 right-4">
                           <CheckCircle2 className="text-rojo" size={20} />
                        </div>
                      )}

                      {/* Recommend badge */}
                      {((type.id === 'nuevo_credito' && (!currentUser?.creditLimit || currentUser.creditLimit === 0)) ||
                        (type.id === 'aumento_cupo' && currentUser?.creditLimit && currentUser.creditLimit > 0)) && (
                        <div className="absolute -top-3 left-6 px-3 py-1 bg-rojo text-white text-[9px] font-black uppercase rounded-full shadow-lg">Recomendada</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sección 2: Datos del Negocio */}
              <div className="bg-white rounded-[40px] p-10 border border-borde tbs-shadow">
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-10 h-10 bg-rojo-suave text-rojo rounded-xl flex items-center justify-center">
                      <Building2 size={20} />
                   </div>
                   <h3 className="text-xl font-black text-texto tracking-tighter">Datos del Negocio</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <FormInput label="Razón Social / Nombre Comercial" name="businessName" value={businessData.businessName} onChange={(v) => setBusinessData({...businessData, businessName: v})} required />
                  <FormInput label="NIT" name="nit" value={businessData.nit} onChange={(v) => setBusinessData({...businessData, nit: v})} required placeholder="Ej: 900.123.456-7" />
                  <FormInput label="Ciudad" name="city" value={businessData.city} onChange={(v) => setBusinessData({...businessData, city: v})} required />
                  
                  <FormSelect 
                    label="Tipo de Negocio" 
                    value={businessData.businessType} 
                    onChange={(v) => setBusinessData({...businessData, businessType: v})}
                    options={['Bar', 'Restaurante', 'Hotel', 'Club', 'Licorera', 'Supermercado', 'Discoteca', 'Evento', 'Distribuidor', 'Otro']}
                    required
                  />
                  <FormSelect 
                    label="Años en Operación" 
                    value={businessData.yearsInBusiness} 
                    onChange={(v) => setBusinessData({...businessData, yearsInBusiness: v})}
                    options={['Menos de 1 año', '1-2 años', '2-5 años', 'Más de 5 años']}
                    required
                  />
                  <FormSelect 
                    label="Ventas Mensuales" 
                    value={businessData.monthlySalesRange} 
                    onChange={(v) => setBusinessData({...businessData, monthlySalesRange: v})}
                    options={['Menos de 10M', '10M - 30M', '30M - 50M', '50M - 100M', 'Más de 100M']}
                    required
                  />
                  
                  <FormInput label="Compra Mensual Estimada con TBS" name="averageMonthlyPurchase" type="number" value={businessData.averageMonthlyPurchase} onChange={(v) => setBusinessData({...businessData, averageMonthlyPurchase: v})} required />
                  <FormInput label="Cupo Solicitado" name="requestedAmount" type="number" value={businessData.requestedAmount} onChange={(v) => setBusinessData({...businessData, requestedAmount: v})} required />
                  
                  <FormSelect 
                    label="Plazo de Pago Solicitado" 
                    value={businessData.paymentTermRequested} 
                    onChange={(v) => setBusinessData({...businessData, paymentTermRequested: v})}
                    options={['contado', '8_dias', '15_dias', '30_dias', '45_dias']}
                    required
                  />
                </div>
                
                {requestType === 'aumento_cupo' && currentUser?.creditLimit && Number(businessData.requestedAmount) > 0 && Number(businessData.requestedAmount) < currentUser.creditLimit && (
                  <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-2xl flex items-center gap-3 text-orange-700 text-xs font-bold">
                    <AlertCircle size={20} />
                    <span>El monto solicitado es menor a tu cupo actual. Por favor verifica si realmente deseas solicitar una reducción.</span>
                  </div>
                )}
              </div>

              {/* Sección 3 & 4: Representante y Contacto */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-[40px] p-10 border border-borde tbs-shadow">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 bg-rojo-suave text-rojo rounded-xl flex items-center justify-center">
                        <UserIcon size={20} />
                    </div>
                    <h3 className="text-xl font-black text-texto tracking-tighter">Representante Legal</h3>
                  </div>
                  <div className="space-y-6">
                    <FormInput label="Nombre del Representante" value={legalRep.name} onChange={(v) => setLegalRep({...legalRep, name: v})} required />
                    <FormInput label="Identificación" value={legalRep.id} onChange={(v) => setLegalRep({...legalRep, id: v})} required />
                    <FormInput label="Celular" value={legalRep.phone} onChange={(v) => setLegalRep({...legalRep, phone: v})} required />
                    <FormInput label="Correo" type="email" value={legalRep.email} onChange={(v) => setLegalRep({...legalRep, email: v})} required />
                  </div>
                </div>

                <div className="bg-white rounded-[40px] p-10 border border-borde tbs-shadow">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 bg-rojo-suave text-rojo rounded-xl flex items-center justify-center">
                        <Phone size={20} />
                    </div>
                    <h3 className="text-xl font-black text-texto tracking-tighter">Contacto para Análisis</h3>
                  </div>
                  <div className="space-y-6">
                    <FormInput label="Nombre de Contacto" value={contact.name} onChange={(v) => setContact({...contact, name: v})} required />
                    <FormInput label="Cargo" value={contact.role} onChange={(v) => setContact({...contact, role: v})} required />
                    <FormInput label="Celular" value={contact.phone} onChange={(v) => setContact({...contact, phone: v})} required />
                    <FormInput label="Correo" type="email" value={contact.email} onChange={(v) => setContact({...contact, email: v})} required />
                  </div>
                </div>
              </div>

              {/* Sección 5: Referencias Comerciales */}
              <div className="bg-white rounded-[40px] p-10 border border-borde tbs-shadow">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-rojo-suave text-rojo rounded-xl flex items-center justify-center">
                        <Star size={20} />
                    </div>
                    <h3 className="text-xl font-black text-texto tracking-tighter">Referencias Comerciales</h3>
                  </div>
                  <button 
                    type="button" 
                    onClick={handleAddReference}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-50 text-texto rounded-xl font-black text-xs hover:bg-texto hover:text-white transition-all cursor-pointer"
                  >
                    <Plus size={16} /> Agregar referencia
                  </button>
                </div>

                <div className="space-y-6">
                  {references.map((ref, idx) => (
                    <div key={ref.id} className="p-8 bg-gray-50 rounded-[32px] border border-borde relative group">
                      <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                         {references.length > 1 && (
                           <button 
                             type="button" 
                             onClick={() => handleRemoveReference(ref.id)}
                             className="w-10 h-10 bg-white text-red-500 rounded-xl flex items-center justify-center hover:bg-red-50 transition-all cursor-pointer"
                           >
                             <Trash2 size={18} />
                           </button>
                         )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                         <FormInput label="Empresa" value={ref.companyName} onChange={(v) => handleReferenceChange(ref.id, 'companyName', v)} required={idx === 0} />
                         <FormInput label="Contacto" value={ref.contactName || ''} onChange={(v) => handleReferenceChange(ref.id, 'contactName', v)} />
                         <FormInput label="Teléfono" value={ref.phone || ''} onChange={(v) => handleReferenceChange(ref.id, 'phone', v)} />
                         <FormSelect 
                           label="Tipo de Relación" 
                           value={ref.relationshipType} 
                           onChange={(v) => handleReferenceChange(ref.id, 'relationshipType', v)}
                           options={['proveedor', 'cliente', 'banco', 'otro']}
                         />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sección 6: Documentos Adjuntos */}
              <div className="bg-white rounded-[40px] p-10 border border-borde tbs-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-rojo-suave text-rojo rounded-xl flex items-center justify-center">
                      <FileText size={20} />
                  </div>
                  <h3 className="text-xl font-black text-texto tracking-tighter">Documentos Adjuntos</h3>
                </div>
                <p className="text-gris text-sm font-medium mb-10">Adjunta los soportes requeridos. Formatos permitidos: PDF, JPG, PNG, XLS. Máx 10MB por archivo.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { type: 'rut' as CreditDocumentType, label: 'RUT', required: true },
                    { type: 'camara_comercio' as CreditDocumentType, label: 'Cámara de Comercio', required: true },
                    { type: 'cedula_representante' as CreditDocumentType, label: 'Cédula Representante', required: true },
                    { type: 'estados_financieros' as CreditDocumentType, label: 'Estados Financieros', required: requestType === 'aumento_cupo' },
                    { type: 'extractos_bancarios' as CreditDocumentType, label: 'Extractos Bancarios', required: requestType === 'aumento_cupo' },
                    { type: 'declaracion_renta' as CreditDocumentType, label: 'Declaración de Renta', required: false },
                    { type: 'referencias_comerciales' as CreditDocumentType, label: 'Refs. Comerciales', required: false },
                    { type: 'certificacion_bancaria' as CreditDocumentType, label: 'Cert. Bancaria', required: false },
                    { type: 'pagare' as CreditDocumentType, label: 'Pagaré Firmado', required: true, downloadUrl: '#', isPagare: true },
                    { type: 'otro' as CreditDocumentType, label: 'Otro Documento', required: false },
                  ].map((doc: any) => {
                    const attachment = attachments.find(a => a.type === doc.type);
                    const isError = errorFiles.includes(doc.label);
                    
                    return (
                      <div key={doc.type} className={`p-6 rounded-[32px] border-2 border-dashed transition-all relative overflow-hidden ${
                        attachment ? 'border-green-100 bg-green-50/30' : (isError ? 'border-red-200 bg-red-50' : (doc.isPagare ? 'border-rojo/40 bg-rojo/5' : 'border-gray-100 bg-white hover:border-rojo/30'))
                      }`}>
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              attachment ? 'bg-green-100 text-green-600' : (doc.isPagare ? 'bg-rojo/10 text-rojo' : 'bg-gray-100 text-gris')
                            }`}>
                              {attachment ? <Check size={20} /> : <FileSearch size={20} />}
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              {doc.required && !attachment && (
                                <span className="text-[9px] font-black uppercase text-rojo px-2 py-1 bg-rojo/5 rounded-full ring-1 ring-rojo/20">Obligatorio</span>
                              )}
                              {doc.isPagare && (
                                <span className="text-[8px] font-black uppercase text-texto px-2 py-0.5 bg-white border border-borde rounded-full">Descargar y firmar</span>
                              )}
                            </div>
                        </div>
                        
                        <div className="font-black text-texto text-sm mb-1">{doc.label}</div>
                        
                        {attachment ? (
                          <div className="space-y-3">
                            <div className="text-[10px] font-bold text-gris truncate max-w-[180px]">{attachment.fileName}</div>
                            <button 
                              type="button"
                              onClick={() => handleRemoveAttachment(doc.type)}
                              className="text-[10px] font-black text-red-500 uppercase flex items-center gap-1 hover:text-red-700 transition-colors"
                            >
                              <X size={12} /> Eliminar archivo
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-3">
                            {doc.isPagare && (
                              <button 
                                type="button"
                                onClick={() => {
                                  // Mock download
                                  analytics.track('credit_pagare_downloaded', 'engagement', { type: 'pagare' });
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-rojo/20 text-rojo rounded-xl font-black text-[10px] uppercase hover:bg-rojo hover:text-white transition-all w-fit"
                              >
                                <Download size={14} /> Descargar Pagaré
                              </button>
                            )}
                            <label className="block w-full h-full cursor-pointer">
                              <input 
                                type="file" 
                                className="hidden" 
                                accept=".pdf,.jpg,.png,.xls,.xlsx"
                                onChange={(e) => handleFileUpload(e, doc.type, doc.label)}
                              />
                              <div className={`text-[10px] font-black uppercase flex items-center gap-1 hover:gap-2 transition-all ${doc.isPagare ? 'text-rojo' : 'text-rojo'}`}>
                                <Upload size={14} /> {doc.isPagare ? 'Subir Pagaré Firmado' : 'Adjuntar archivo'}
                              </div>
                            </label>
                            {isError && (
                              <div className="mt-2 text-[9px] font-bold text-red-600 flex items-center gap-1">
                                <AlertCircle size={10} /> Excede 10MB
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sección 7: Observaciones */}
              <div className="bg-white rounded-[40px] p-10 border border-borde tbs-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-rojo-suave text-rojo rounded-xl flex items-center justify-center">
                      <MessageSquare size={20} />
                  </div>
                  <h3 className="text-xl font-black text-texto tracking-tighter">Observaciones (Opcional)</h3>
                </div>
                <p className="text-gris text-sm font-medium mb-8">Cuéntanos por qué necesitas el crédito, cómo será utilizado o cualquier información relevante.</p>
                <textarea 
                  value={businessData.notes}
                  onChange={(e) => setBusinessData({...businessData, notes: e.target.value})}
                  className="w-full bg-gray-50 border border-borde rounded-3xl p-6 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rojo/20 focus:border-rojo min-h-[160px]"
                  placeholder="Escribe aquí tus comentarios..."
                />
              </div>

              {/* Sección 8: Autorizaciones */}
              <div className="bg-white rounded-[40px] p-10 border border-borde tbs-shadow">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 bg-rojo-suave text-rojo rounded-xl flex items-center justify-center">
                      <ShieldCheck size={20} />
                  </div>
                  <h3 className="text-xl font-black text-texto tracking-tighter">Autorizaciones y Términos</h3>
                </div>
                
                <div className="space-y-6">
                  <AuthCheckbox 
                    label={<span>Autorizo el tratamiento de mis datos personales conforme a la <button type="button" onClick={() => onGoLegalPage?.('privacy')} className="text-rojo hover:underline">política de privacidad</button> y <button type="button" onClick={() => onGoLegalPage?.('dataTreatment')} className="text-rojo hover:underline">tratamiento de datos</button> de TBS.</span>}
                    checked={authorizations.dataTreatment}
                    onChange={() => setAuthorizations({...authorizations, dataTreatment: !authorizations.dataTreatment})}
                  />
                  <AuthCheckbox 
                    label="Autorizo a TBS a realizar análisis comercial, crediticio y documental para evaluar esta solicitud en centrales de riesgo u otros medios."
                    checked={authorizations.creditCheck}
                    onChange={() => setAuthorizations({...authorizations, creditCheck: !authorizations.creditCheck})}
                  />
                  <AuthCheckbox 
                    label={<span>Declaro que la información suministrada es veraz y acepto los <button type="button" onClick={() => onGoLegalPage?.('terms')} className="text-rojo hover:underline">términos y condiciones</button> aplicables.</span>}
                    checked={authorizations.terms}
                    onChange={() => setAuthorizations({...authorizations, terms: !authorizations.terms})}
                  />
                </div>

                <div className="mt-12 flex flex-col md:flex-row items-center gap-6 pt-10 border-t border-gray-50">
                  <button 
                    type="submit"
                    disabled={!isFormValid()}
                    className={`px-12 py-5 rounded-2xl font-black text-lg transition-all shadow-xl flex items-center gap-3 ${
                      isFormValid() 
                      ? 'bg-rojo text-white shadow-rojo/30 hover:bg-rojo-oscuro hover:scale-[1.02] cursor-pointer' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                    }`}
                  >
                    Enviar solicitud de crédito <ChevronRight size={24} />
                  </button>
                  <p className="text-gris text-xs font-bold max-w-sm">
                    Al hacer clic en enviar, confirmas que has validado los datos y documentos adjuntos.
                  </p>
                </div>
              </div>
            </form>
          )}

          {activeTab === 'historial' && (
            <div className="space-y-6">
              {creditRequests.map((req) => (
                <div key={req.id} className="bg-white rounded-[32px] border border-borde p-8 tbs-shadow hover:border-rojo/30 htransition-all group">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div className="flex flex-wrap items-center gap-6 lg:gap-12 flex-1">
                      <div>
                        <div className="text-[10px] font-black uppercase text-gris tracking-widest mb-1 leading-none">Solicitud #</div>
                        <div className="text-lg font-black text-rojo tracking-tight">{req.number}</div>
                      </div>
                      
                      <div className="w-px h-8 bg-gray-100 hidden lg:block" />
                      
                      <div>
                        <div className="text-[10px] font-black uppercase text-gris tracking-widest mb-1 leading-none">Fecha</div>
                        <div className="text-sm font-black text-texto-sec">{req.createdAt}</div>
                      </div>

                      <div className="w-px h-8 bg-gray-100 hidden lg:block" />

                      <div>
                        <div className="text-[10px] font-black uppercase text-gris tracking-widest mb-1 leading-none">Monto</div>
                        <div className="text-sm font-black text-texto">{req.requestedAmount.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })}</div>
                      </div>

                      <div className="w-px h-8 bg-gray-100 hidden lg:block" />

                      <div className="flex-1 lg:flex-none">
                        <StatusBadge status={req.status} />
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full lg:w-auto">
                      <button 
                        onClick={() => {
                          setSelectedHistoryRequest(req);
                          analytics.track('credit_request_detail_viewed', 'engagement', { metadata: { requestId: req.id } });
                        }}
                        className="flex-1 lg:flex-none px-6 py-3 bg-gray-100 text-texto rounded-xl font-black text-xs hover:bg-texto hover:text-white transition-all cursor-pointer whitespace-nowrap"
                      >
                        Ver detalle
                      </button>
                      <button 
                        onClick={() => onGoAdvisorChat('cartera', { label: `Solicitud de crédito ${req.number}`, type: 'cartera' })}
                        className="flex-1 lg:flex-none px-6 py-3 bg-texto text-white rounded-xl font-black text-xs hover:bg-rojo transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                      >
                        <MessageSquare size={16} /> Hablar con asesor
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {creditRequests.length === 0 && (
                <div className="py-20 text-center bg-white border-2 border-dashed border-borde rounded-[40px]">
                   <div className="w-20 h-20 bg-gray-50 text-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                      <History size={40} />
                   </div>
                   <h4 className="text-2xl font-black text-texto mb-2">No tienes solicitudes anteriores</h4>
                   <p className="text-gris font-medium max-w-md mx-auto mb-8">
                     Tus solicitudes de crédito o aumento de cupo aparecerán aquí para tu control.
                   </p>
                   <button 
                     onClick={() => setActiveTab('nueva')}
                     className="px-8 py-4 bg-texto text-white rounded-xl font-black hover:bg-rojo transition-all cursor-pointer"
                   >
                     Solicitar crédito ahora
                   </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'documentos' && (
            <div className="bg-white rounded-[40px] p-12 border border-borde tbs-shadow">
               <h3 className="text-2xl font-black text-texto tracking-tighter mb-8">Información de Documentos</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    { label: 'RUT', desc: 'Permite validar identificación tributaria del negocio.', icon: ClipboardList },
                    { label: 'Cámara de Comercio', desc: 'Permite validar existencia, representación legal y actividad económica.', icon: Building2 },
                    { label: 'Cédula del Representante Legal', desc: 'Permite validar identidad del representante.', icon: UserIcon },
                    { label: 'Estados Financieros', desc: 'Ayudan a analizar capacidad financiera.', icon: TrendingUp },
                    { label: 'Extractos Bancarios', desc: 'Ayudan a revisar comportamiento financiero.', icon: CreditCard },
                    { label: 'Declaración de Renta', desc: 'Puede solicitarse para análisis ampliado.', icon: FileText },
                    { label: 'Referencias Comerciales', desc: 'Permiten validar comportamiento con otros proveedores.', icon: Star },
                    { label: 'Certificación Bancaria', desc: 'Permite validar datos de cuenta y relación bancaria.', icon: ShieldCheck },
                  ].map((doc, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-6 bg-gray-50 rounded-3xl border border-borde">
                       <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-rojo shrink-0 shadow-sm">
                          <doc.icon size={24} />
                       </div>
                       <div>
                          <div className="font-black text-texto mb-1">{doc.label}</div>
                          <p className="text-xs font-bold text-gris leading-relaxed">{doc.desc}</p>
                       </div>
                    </div>
                  ))}
               </div>
               
               <div className="mt-12 p-8 bg-rojo/5 rounded-[32px] border border-rojo/20">
                  <div className="flex items-center gap-3 mb-4">
                     <AlertCircle className="text-rojo" size={20} />
                     <h4 className="text-lg font-black text-texto tracking-tight">Nota Importante</h4>
                  </div>
                  <p className="text-sm font-bold text-gris leading-relaxed">
                    Los documentos solicitados pueden variar según tipo de cliente, cupo solicitado, ciudad, historial comercial y políticas internas de TBS. Mantener tus documentos actualizados mejora tus posibilidades de aprobación y aumento de cupo.
                  </p>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedHistoryRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedHistoryRequest(null)}
              className="absolute inset-0 bg-texto/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className="relative w-full max-w-3xl bg-white rounded-[40px] overflow-hidden tbs-shadow flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-borde flex items-center justify-between sticky top-0 bg-white z-10">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-rojo-suave text-rojo rounded-2xl flex items-center justify-center">
                      <CreditCard size={24} />
                   </div>
                   <div>
                      <h3 className="text-2xl font-black text-texto tracking-tighter">Detalle de Solicitud</h3>
                      <div className="text-xs font-black text-rojo uppercase tracking-widest">{selectedHistoryRequest.requestNumber}</div>
                   </div>
                </div>
                <button 
                  onClick={() => setSelectedHistoryRequest(null)}
                  className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gris hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-10 overflow-y-auto space-y-10 custom-scrollbar">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                   <DetailBox label="Fecha" value={selectedHistoryRequest.createdAt} />
                   <DetailBox label="Tipo" value={selectedHistoryRequest.requestType.replace('_', ' ')} />
                   <DetailBox label="Monto" value={selectedHistoryRequest.requestedAmount.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })} isRed />
                   <div className="p-4 bg-gray-50 rounded-2xl border border-borde">
                      <div className="text-[10px] font-black uppercase text-gris tracking-widest mb-1">Estado</div>
                      <StatusBadge status={selectedHistoryRequest.status} />
                   </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-lg font-black text-texto tracking-tight flex items-center gap-3">
                    <Building2 size={20} className="text-rojo" /> Datos del Negocio
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-8 rounded-[32px] border border-borde">
                     <DetailRow label="Razón Social" value={selectedHistoryRequest.businessName} />
                     <DetailRow label="NIT" value={selectedHistoryRequest.nit} />
                     <DetailRow label="Ciudad" value={selectedHistoryRequest.city} />
                     <DetailRow label="Tipo Negocio" value={selectedHistoryRequest.businessType} />
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-lg font-black text-texto tracking-tight flex items-center gap-3">
                    <FileSearch size={20} className="text-rojo" /> Documentos Adjuntos
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {selectedHistoryRequest.attachments.map((att, idx) => (
                       <div key={idx} className="p-4 bg-white border border-borde rounded-2xl flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
                                <Check size={16} />
                             </div>
                             <div>
                                <div className="text-[10px] font-bold text-texto">{att.label}</div>
                                <div className="text-[9px] text-gris font-medium">{att.fileName}</div>
                             </div>
                          </div>
                       </div>
                     ))}
                  </div>
                </div>

                {selectedHistoryRequest.notes && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-black text-texto tracking-tight">Observaciones</h4>
                    <div className="p-6 bg-gray-50 rounded-3xl border border-borde text-sm font-medium text-gris italic">
                      "{selectedHistoryRequest.notes}"
                    </div>
                  </div>
                )}

                <div className="p-8 bg-texto text-white rounded-[40px] flex items-center justify-between gap-6">
                   <div>
                      <div className="text-xl font-black tracking-tight mb-1">¿Tienes dudas sobre esta solicitud?</div>
                      <p className="text-white/60 text-xs font-bold leading-relaxed">Habla con nuestro equipo de cartera para resolver cualquier inquietud.</p>
                   </div>
                   <button 
                     onClick={() => {
                       setSelectedHistoryRequest(null);
                       onGoAdvisorChat('cartera', { label: `Solicitud de crédito ${selectedHistoryRequest.requestNumber}`, type: 'cartera' });
                     }}
                     className="px-6 py-3 bg-rojo text-white rounded-xl font-black text-xs hover:bg-rojo-oscuro transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap"
                   >
                     <MessageSquare size={16} /> Contactar apoyo
                   </button>
                </div>
              </div>

              <div className="p-6 border-t border-borde bg-gray-50 flex justify-center sticky bottom-0">
                 <p className="text-[10px] font-bold text-gris">La decisión final está sujeta a análisis y políticas internas de TBS.</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <NotificationsBar />
    </div>
  );
}

function FormInput({ label, name, type = "text", value, onChange, required, placeholder }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-black uppercase text-gris tracking-widest px-1">
        {label} {required && <span className="text-rojo">*</span>}
      </label>
      <input 
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-50 border border-borde rounded-2xl px-5 py-4 text-sm font-black text-texto focus:outline-none focus:ring-2 focus:ring-rojo/20 focus:border-rojo transition-all"
        placeholder={placeholder}
      />
    </div>
  );
}

function FormSelect({ label, value, onChange, options, required }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-black uppercase text-gris tracking-widest px-1">
        {label} {required && <span className="text-rojo">*</span>}
      </label>
      <div className="relative">
        <select 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-gray-50 border border-borde rounded-2xl px-5 py-4 text-sm font-black text-texto appearance-none focus:outline-none focus:ring-2 focus:ring-rojo/20 focus:border-rojo transition-all cursor-pointer"
        >
          <option value="" disabled>Selecciona una opción</option>
          {options.map((opt: string) => (
            <option key={opt} value={opt}>{opt.replace('_', ' ')}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gris pointer-events-none" size={18} />
      </div>
    </div>
  );
}

function AuthCheckbox({ label, checked, onChange }: any) {
  return (
    <label className="flex items-start gap-4 cursor-pointer group">
      <div className="relative mt-0.5">
        <input 
          type="checkbox" 
          className="peer hidden" 
          checked={checked}
          onChange={onChange}
        />
        <div className="w-6 h-6 border-2 border-borde rounded-lg bg-white peer-checked:bg-rojo peer-checked:border-rojo transition-all flex items-center justify-center">
           <Check size={16} className={`text-white transition-opacity ${checked ? 'opacity-100' : 'opacity-0'}`} />
        </div>
      </div>
      <span className="text-xs font-bold text-gris leading-relaxed select-none group-hover:text-texto transition-colors">{label}</span>
    </label>
  );
}

function StatusBadge({ status }: { status: CreditRequestStatus }) {
  const config = {
    borrador: { label: 'Borrador', classes: 'bg-gray-100 text-gray-600 border-gray-200' },
    enviada: { label: 'Enviada', classes: 'bg-blue-50 text-blue-600 border-blue-200' },
    en_analisis: { label: 'En análisis', classes: 'bg-yellow-50 text-yellow-600 border-yellow-200' },
    requiere_informacion: { label: 'Requiere info', classes: 'bg-orange-50 text-orange-600 border-orange-200' },
    aprobada: { label: 'Aprobada', classes: 'bg-green-50 text-green-600 border-green-200' },
    rechazada: { label: 'Rechazada', classes: 'bg-red-50 text-red-600 border-red-200' },
    cancelada: { label: 'Cancelada', classes: 'bg-gray-50 text-gray-400 border-gray-200' }
  };

  const current = config[status] || config.enviada;

  return (
    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase border tracking-widest ${current.classes}`}>
       {current.label}
    </span>
  );
}

function DetailBox({ label, value, isRed }: any) {
  return (
    <div className="p-4 bg-gray-50 rounded-2xl border border-borde">
      <div className="text-[10px] font-black uppercase text-gris tracking-widest mb-1">{label}</div>
      <div className={`text-sm font-black ${isRed ? 'text-rojo' : 'text-texto'}`}>{value}</div>
    </div>
  );
}

function DetailRow({ label, value }: any) {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-xs font-bold text-gris">{label}</div>
      <div className="text-sm font-black text-texto">{value}</div>
    </div>
  );
}

function NotificationsBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-texto text-white p-4 hidden md:block z-40 border-t border-white/10">
       <div className="max-w-[1480px] mx-auto px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <Lock size={18} className="text-rojo" />
             </div>
             <div>
                <p className="text-xs font-black tracking-tight">Portal TBS de Crédito Comercial</p>
                <p className="text-[10px] font-bold text-white/50">Esta versión del prototipo no carga archivos a un servidor real.</p>
             </div>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest">Servidor Activo</span>
             </div>
             <p className="text-[10px] font-bold text-white/30">v1.2.5 - Simulation Mode</p>
          </div>
       </div>
    </div>
  );
}

const ChevronDown = ({ className, size }: { className?: string, size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m6 9 6 6 6-6"/>
  </svg>
);
