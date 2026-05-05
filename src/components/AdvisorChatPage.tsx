import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Search, 
  Plus, 
  MessageSquare, 
  Send, 
  Paperclip, 
  MoreVertical, 
  Phone, 
  Mail, 
  User as UserIcon,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  ChevronRight,
  Package,
  FileText,
  Zap,
  Info
} from 'lucide-react';
import { User, Advisor, ChatMessage, Conversation, ConversationTopic } from '../types';
import { useAnalytics } from '../hooks/useAnalytics';

interface AdvisorChatPageProps {
  currentUser: User | null;
  onBackToAccount: () => void;
  onGoHome: () => void;
  onGoOrdersTracking: () => void;
  onGoPayments: () => void;
  onGoCatalog: () => void;
  onGoUrgentOrder: () => void;
  initialTopic?: ConversationTopic;
  initialContext?: { label: string; type: ChatMessage['attachmentType'] } | string;
  initialConversationId?: string | null;
  onClearInitialStates?: () => void;
  onCreateNotification?: (notification: any) => void;
}

const ADVISOR_DATA_CLIENTE: Advisor = {
  id: "advisor-001",
  name: "Laura Gómez",
  role: "Asesora comercial TBS",
  phone: "317 123 4567",
  email: "laura.gomez@tbs.com",
  availability: "Lunes a viernes, 8:00 a.m. - 6:00 p.m.",
  status: "en_linea",
  avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop"
};

const ADVISOR_DATA_PROVIDER: Advisor = {
  id: "advisor-002",
  name: "Andrés Martínez",
  role: "Ejecutivo de Cuenta Sr. TBS",
  phone: "320 987 6543",
  email: "andres.martinez@tbs.com",
  availability: "Lunes a viernes, 8:00 a.m. - 5:30 p.m.",
  status: "en_linea",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop"
};

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-001",
    topic: "pedido",
    title: "Consulta sobre pedido TBS-10245",
    status: "abierta",
    createdAt: "2026-05-01 09:15",
    updatedAt: "2026-05-01 10:30",
    messages: [
      {
        id: "msg-001",
        sender: "sistema",
        text: "Conversación creada desde el pedido TBS-10245.",
        createdAt: "09:15 a.m.",
        attachmentLabel: "Pedido TBS-10245",
        attachmentType: "pedido"
      },
      {
        id: "msg-002",
        sender: "cliente",
        text: "Hola Laura, necesito confirmar si este pedido llega hoy en la tarde.",
        createdAt: "09:16 a.m."
      },
      {
        id: "msg-003",
        sender: "asesor",
        text: "Hola Humberto. Sí, el pedido está en validación logística. Te confirmo apenas pase a ruta.",
        createdAt: "09:22 a.m."
      },
      {
        id: "msg-004",
        sender: "asesor",
        text: "El pedido ya fue preparado y está programado para salir en la ruta de la tarde.",
        createdAt: "10:30 a.m."
      }
    ]
  },
  {
    id: "conv-002",
    topic: "cartera",
    title: "Consulta sobre factura FV-88321",
    status: "en_revision",
    createdAt: "2026-04-30 03:40",
    updatedAt: "2026-04-30 04:05",
    messages: [
      {
        id: "msg-005",
        sender: "sistema",
        text: "Conversación creada desde cartera y pagos.",
        createdAt: "03:40 p.m.",
        attachmentLabel: "Factura FV-88321",
        attachmentType: "factura"
      },
      {
        id: "msg-006",
        sender: "cliente",
        text: "Necesito validar la fecha de vencimiento de esta factura.",
        createdAt: "03:41 p.m."
      },
      {
        id: "msg-007",
        sender: "asesor",
        text: "La reviso con cartera y te confirmo la información actualizada.",
        createdAt: "04:05 p.m."
      }
    ]
  }
];

const TOPIC_LABELS_CLIENTE: Record<ConversationTopic, string> = {
  pedido: 'Pedido',
  cartera: 'Cartera y Pagos',
  producto: 'Productos / Stock',
  pedido_urgente: 'Pedido Urgente',
  activacion: 'Activación Comercial',
  soporte: 'Soporte Técnico',
  otro: 'Otro'
};

const TOPIC_LABELS_PROVIDER: Record<ConversationTopic, string> = {
  pedido: 'Activaciones de Marca',
  cartera: 'Liquidaciones y Pagos',
  producto: 'Gestión de Catálogo',
  pedido_urgente: 'Trade Marketing',
  activacion: 'Lanzamientos',
  soporte: 'Soporte de Plataforma',
  otro: 'Otro'
};

const CONTEXT_OPTIONS_CLIENTE = [
  { label: 'Pedido TBS-10245', type: 'pedido' as const },
  { label: 'Pedido TBS-10198', type: 'pedido' as const },
  { label: 'Factura FV-88321', type: 'factura' as const },
  { label: 'Factura FV-88174', type: 'factura' as const },
  { label: 'Whisky Premium 750 ml', type: 'producto' as const },
  { label: 'Ron Añejo 750 ml', type: 'producto' as const },
  { label: 'Solicitud urgente URG-1020', type: 'solicitud_urgente' as const }
];

const CONTEXT_OPTIONS_PROVIDER = [
  { label: 'Liquidación LIQ-2026-05', type: 'factura' as const },
  { label: 'Liquidación LIQ-2026-04', type: 'factura' as const },
  { label: 'Campaña Lanzamiento Premium', type: 'solicitud_urgente' as const },
  { label: 'Whisky Premium 750 ml (Catálogo)', type: 'producto' as const },
  { label: 'Reporte de Ventas Mayo', type: 'pedido' as const },
  { label: 'Activación Trade Marketing Q2', type: 'solicitud_urgente' as const }
];

export default function AdvisorChatPage({ 
  currentUser, 
  onBackToAccount,
  onGoHome,
  onGoOrdersTracking,
  onGoPayments,
  onGoCatalog,
  onGoUrgentOrder,
  initialTopic,
  initialContext,
  initialConversationId,
  onClearInitialStates,
  onCreateNotification
}: AdvisorChatPageProps) {
  const analytics = useAnalytics(currentUser);
  const isProvider = currentUser?.role === 'marca' || currentUser?.role === 'proveedor';
  const advisorData = isProvider ? ADVISOR_DATA_PROVIDER : ADVISOR_DATA_CLIENTE;
  const topicLabels = isProvider ? TOPIC_LABELS_PROVIDER : TOPIC_LABELS_CLIENTE;
  const contextOptions = isProvider ? CONTEXT_OPTIONS_PROVIDER : CONTEXT_OPTIONS_CLIENTE;
  
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeConvId, setActiveConvId] = useState<string | null>(INITIAL_CONVERSATIONS[0].id);
  const [isNewConvModalOpen, setIsNewConvModalOpen] = useState(false);
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');
  
  // New Conversation Form
  const [newConvTopic, setNewConvTopic] = useState<ConversationTopic | ''>('');
  const [newConvSubject, setNewConvSubject] = useState('');
  const [newConvMessage, setNewConvMessage] = useState('');
  const [newConvContext, setNewConvContext] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find(c => c.id === activeConvId);

  useEffect(() => {
    scrollToBottom();
  }, [activeConvId, conversations]);

  // Handle initial context if provided
  useEffect(() => {
    if (initialConversationId) {
      setActiveConvId(initialConversationId);
      if (onClearInitialStates) {
        onClearInitialStates();
      }
      return;
    }

    if (initialTopic) {
      const topicLabel = topicLabels[initialTopic] || 'General';
      
      // Auto-send if context is a string (direct message)
      if (typeof initialContext === 'string') {
        const newId = `conv-${Date.now()}`;
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();
        
        const newConv: Conversation = {
          id: newId,
          topic: initialTopic as ConversationTopic,
          title: `Reporte: ${topicLabel}`,
          status: 'abierta',
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
          messages: [
            {
              id: `msg-init-${Date.now()}`,
              sender: 'cliente',
              text: initialContext,
              createdAt: timeStr
            }
          ]
        };

        setConversations(prev => [newConv, ...prev]);
        setActiveConvId(newId);
        
        analytics.track('chat_conversation_auto_started', 'chat', {
          conversationId: newId,
          topic: initialTopic
        });

        // Initial advisor response
        setTimeout(() => {
          const response: ChatMessage = {
            id: `msg-resp-init-${Date.now()}`,
            sender: 'asesor',
            text: "Recibido. Estoy revisando la información de tu disputa y te daré respuesta por este chat.",
            createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase()
          };
          updateConversationMessages(newId, response);
        }, 2000);

        if (onClearInitialStates) {
          onClearInitialStates();
        }
        return;
      }

      setIsNewConvModalOpen(true);
      setNewConvTopic(initialTopic);
      
      // Pre-fill subject based on topic or context
      if (initialContext && typeof initialContext !== 'string' && initialContext.label) {
        setNewConvSubject(`Consulta sobre ${initialContext.label}`);
        setNewConvMessage(`Hola ${advisorData.name.split(' ')[0]}, tengo una duda respecto a ${initialContext.label.toLowerCase()}...`);
        
        const ctxIdx = contextOptions.findIndex(o => o.label === initialContext.label);
        if (ctxIdx !== -1) {
          setNewConvContext(ctxIdx);
        }
      } else {
        const topicValue = initialTopic && topicLabels[initialTopic] ? initialTopic : 'otro';
        
        setNewConvTopic(topicValue as ConversationTopic);
        setNewConvSubject(`Nueva consulta: ${topicLabel}`);
        setNewConvMessage(`Hola ${advisorData.name.split(' ')[0]}, escribo para consultar sobre ${topicLabel.toLowerCase()}...`);
      }
      
      // Clear initial states in parent once consumed
      if (onClearInitialStates) {
        onClearInitialStates();
      }
    }
  }, [initialTopic, initialContext, onClearInitialStates]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeConvId) return;

    // Track message sent (without content)
    analytics.track('chat_message_sent', 'chat', {
      conversationId: activeConvId,
      topic: activeConversation?.topic
    });

    const msg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'cliente',
      text: newMessage,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase()
    };

    updateConversationMessages(activeConvId, msg);
    setNewMessage('');

    // Simulated response
    setTimeout(() => {
      const response: ChatMessage = {
        id: `msg-resp-${Date.now()}`,
        sender: 'asesor',
        text: "Recibido. Lo reviso y te confirmo por este mismo chat.",
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase()
      };
      updateConversationMessages(activeConvId, response);

      // Trigger notification for the user
      if (onCreateNotification) {
        onCreateNotification({
          id: `notif-chat-${Date.now()}`,
          type: 'chat',
          title: "Nuevo mensaje de tu asesor",
          message: "Tu asesor respondió en el chat interno sobre tu consulta.",
          read: false,
          priority: 'media',
          actionTarget: 'advisorChat',
          context: {
            label: "Chat",
            value: activeConvId,
            entityType: 'chat'
          }
        });
      }
    }, 1500);
  };

  const updateConversationMessages = (convId: string, newMessage: ChatMessage) => {
    setConversations(prev => prev.map(c => {
      if (c.id === convId) {
        return {
          ...c,
          updatedAt: new Date().toISOString(),
          messages: [...c.messages, newMessage]
        };
      }
      return c;
    }));
  };

  const handleCreateConversation = () => {
    if (!newConvTopic || !newConvSubject.trim() || !newConvMessage.trim()) return;

    const newId = `conv-${Date.now()}`;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();

    const messages: ChatMessage[] = [];

    // Add context if selected or if dynamic initialContext exists
    if (newConvContext !== null) {
      const ctx = contextOptions[newConvContext];
      messages.push({
        id: `msg-ctx-${Date.now()}`,
        sender: 'sistema',
        text: `Conversación creada desde ${ctx.label.toLowerCase()}.`,
        createdAt: timeStr,
        attachmentLabel: ctx.label,
        attachmentType: ctx.type
      });
    } else if (initialContext && typeof initialContext !== 'string') {
      messages.push({
        id: `msg-ctx-${Date.now()}`,
        sender: 'sistema',
        text: `Conversación creada desde ${initialContext.label.toLowerCase()}.`,
        createdAt: timeStr,
        attachmentLabel: initialContext.label,
        attachmentType: initialContext.type
      });
    }

    // Add initial message
    messages.push({
      id: `msg-init-${Date.now()}`,
      sender: 'cliente',
      text: newConvMessage,
      createdAt: timeStr
    });

    const newConv: Conversation = {
      id: newId,
      topic: newConvTopic as ConversationTopic,
      title: newConvSubject,
      status: 'abierta',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      messages
    };

    analytics.track('chat_conversation_started', 'chat', {
      conversationId: newId,
      topic: newConvTopic,
      hasContext: newConvContext !== null || !!initialContext
    });

    setConversations([newConv, ...conversations]);
    setActiveConvId(newId);
    setIsNewConvModalOpen(false);
    
    // Reset form
    setNewConvTopic('');
    setNewConvSubject('');
    setNewConvMessage('');
    setNewConvContext(null);

    // Initial advisor response
    setTimeout(() => {
      const response: ChatMessage = {
        id: `msg-resp-init-${Date.now()}`,
        sender: 'asesor',
        text: "Gracias por escribirnos. Estoy revisando tu solicitud y te responderé por este chat interno.",
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase()
      };
      updateConversationMessages(newId, response);
    }, 2000);
  };

  const handleAddContextToChat = (ctx: typeof CONTEXT_OPTIONS_CLIENTE[0]) => {
    if (!activeConvId) return;

    analytics.track('chat_context_added', 'chat', {
      conversationId: activeConvId,
      contextType: ctx.type,
      contextLabel: ctx.label
    });

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();
    const msg: ChatMessage = {
      id: `msg-ctx-${Date.now()}`,
      sender: 'sistema',
      text: `Contexto agregado: ${ctx.label}`,
      createdAt: timeStr,
      attachmentLabel: ctx.label,
      attachmentType: ctx.type
    };

    updateConversationMessages(activeConvId, msg);
    setIsContextMenuOpen(false);

    // Prompt advisor acknowledgment
    setTimeout(() => {
      const response: ChatMessage = {
        id: `msg-resp-ctx-${Date.now()}`,
        sender: 'asesor',
        text: `Veo que adjuntaste información sobre ${ctx.label.toLowerCase()}. Permíteme validarlo.`,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase()
      };
      updateConversationMessages(activeConvId, response);
    }, 1500);
  };

  const filteredConversations = conversations.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    topicLabels[c.topic].toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-borde sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {mobileView === 'chat' ? (
              <button 
                onClick={() => setMobileView('list')}
                className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center text-gris hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <ArrowLeft size={20} />
              </button>
            ) : (
              <button 
                onClick={onBackToAccount}
                className="w-10 h-10 rounded-full flex items-center justify-center text-gris hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-texto">
                  {currentUser?.role === 'marca' || currentUser?.role === 'proveedor' ? 'Mi ejecutivo TBS' : 'Mi asesor'}
                </h1>
                <span className="px-2 py-0.5 bg-rojo/10 text-rojo text-[10px] font-black rounded uppercase tracking-wider">Chat interno TBS</span>
              </div>
              <p className="text-xs text-gris font-medium">Comunícate con tu {currentUser?.role === 'marca' || currentUser?.role === 'proveedor' ? 'ejecutivo' : 'asesor'} TBS desde la plataforma, sin salir de la página.</p>
            </div>
          </div>
          
          {currentUser && (
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs font-black text-texto">{currentUser.businessName}</span>
              <span className="text-[10px] font-bold text-gris uppercase tracking-widest">{currentUser.city}</span>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-0 lg:px-4 py-0 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Advisor Card Sidebar - Hidden on mobile */}
          <div className="hidden lg:block lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-borde panel-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-50 flex items-center justify-center bg-gray-100">
                    {advisorData.avatar ? (
                      <img src={advisorData.avatar} alt={advisorData.name} className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon size={40} className="text-gris/30" />
                    )}
                  </div>
                  <div className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-4 border-white ${
                    advisorData.status === 'en_linea' ? 'bg-green-500' : advisorData.status === 'ocupado' ? 'bg-orange-500' : 'bg-gray-400'
                  }`} />
                </div>
                
                <h3 className="text-lg font-black text-texto">{advisorData.name}</h3>
                <p className="text-sm font-bold text-rojo mb-4">{advisorData.role}</p>
                
                <div className="w-full flex items-center justify-center gap-2 mb-6">
                  {advisorData.status === 'en_linea' ? (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-[10px] font-black rounded-full uppercase tracking-wider">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      En línea
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gris text-[10px] font-black rounded-full uppercase tracking-wider">
                      Fuera de horario
                    </span>
                  )}
                </div>

                <div className="w-full space-y-4 text-left border-t border-gray-50 pt-6">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                      <Clock size={16} className="text-gris" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-gris tracking-widest leading-tight">Horario</p>
                      <p className="text-xs font-bold text-texto">{advisorData.availability}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                      <Phone size={16} className="text-gris" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-gris tracking-widest leading-tight">Teléfono</p>
                      <p className="text-xs font-bold text-texto">{advisorData.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                      <Mail size={16} className="text-gris" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-gris tracking-widest leading-tight">Email</p>
                      <p className="text-xs font-bold text-texto truncate">{advisorData.email}</p>
                    </div>
                  </div>
                </div>

                <div className="w-full mt-8">
                  <a 
                    href={`tel:${advisorData.phone.replace(/\s+/g, '')}`}
                    className="w-full h-12 rounded-xl border-2 border-rojo text-rojo font-black text-sm flex items-center justify-center gap-2 hover:bg-rojo/5 transition-colors"
                  >
                    <Phone size={18} />
                    Llamar al ejecutivo
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-3xl p-6 border border-borde panel-shadow">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-gris mb-4">Acciones rápidas</h4>
              <div className="grid grid-cols-1 gap-2">
                <button onClick={onGoOrdersTracking} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 group text-left">
                  <span className="text-xs font-bold text-texto">Consultar pedidos</span>
                  <ChevronRight size={14} className="text-gris group-hover:text-rojo" />
                </button>
                <button onClick={onGoPayments} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 group text-left">
                  <span className="text-xs font-bold text-texto">Validar cartera</span>
                  <ChevronRight size={14} className="text-gris group-hover:text-rojo" />
                </button>
                <button onClick={onGoCatalog} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 group text-left">
                  <span className="text-xs font-bold text-texto">Consultar productos</span>
                  <ChevronRight size={14} className="text-gris group-hover:text-rojo" />
                </button>
                <button onClick={onGoUrgentOrder} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 group text-left">
                  <span className="text-xs font-bold text-texto">Solicitar pedido urgente</span>
                  <ChevronRight size={14} className="text-gris group-hover:text-rojo" />
                </button>
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 bg-white rounded-none lg:rounded-[32px] border-x-0 lg:border border-borde panel-shadow overflow-hidden min-h-[calc(100vh-80px)] lg:min-h-[700px]">
            {/* Conversations List */}
            <div className={`${mobileView === 'chat' ? 'hidden md:flex' : 'flex'} md:col-span-1 border-r border-borde flex-col h-full bg-white`}>
              <div className="p-6 border-b border-borde flex flex-col gap-4">
                <button 
                  onClick={() => setIsNewConvModalOpen(true)}
                  className="w-full h-12 bg-rojo text-white rounded-xl font-black text-sm flex items-center justify-center gap-2 tbs-shadow hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Plus size={18} />
                  Nueva conversación
                </button>
                <div className="relative">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gris" />
                  <input 
                    type="text" 
                    placeholder="Buscar chats..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-12 bg-gray-50 border border-transparent focus:border-rojo/20 rounded-xl pl-12 pr-4 text-sm font-bold text-texto outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {filteredConversations.map(conv => (
                  <button 
                    key={conv.id}
                    onClick={() => {
                      setActiveConvId(conv.id);
                      setMobileView('chat');
                    }}
                    className={`w-full p-4 rounded-2xl border text-left transition-all ${
                      activeConvId === conv.id 
                        ? 'bg-rojo/5 border-rojo/20' 
                        : 'bg-white border-transparent hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1 text-[10px] font-black uppercase tracking-wider">
                      <span className="text-rojo">{topicLabels[conv.topic]}</span>
                      <span className="text-gris opacity-60">
                        {new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase()}
                      </span>
                    </div>
                    <h5 className="text-sm font-black text-texto leading-tight mb-2 truncate">{conv.title}</h5>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        conv.status === 'abierta' ? 'bg-blue-50 text-blue-600' :
                        conv.status === 'en_revision' ? 'bg-orange-50 text-orange-600' :
                        'bg-green-50 text-green-600'
                      }`}>
                        {conv.status.replace('_', ' ')}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className={`${mobileView === 'list' ? 'hidden md:flex' : 'flex'} md:col-span-2 flex-col h-full bg-gray-50`}>
              {activeConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="bg-white p-4 border-b border-borde flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-rojo">
                        <MessageSquare size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-texto truncate max-w-[200px]">{activeConversation.title}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase text-gris opacity-60">{topicLabels[activeConversation.topic]}</span>
                          <span className="w-1 h-1 rounded-full bg-gris/30" />
                          <span className="text-[10px] font-black text-rojo uppercase tracking-wider">{advisorData.name}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select 
                        value={activeConversation.status}
                        onChange={(e) => {
                          const newStatus = e.target.value as Conversation['status'];
                          setConversations(prev => prev.map(c => c.id === activeConvId ? { ...c, status: newStatus } : c));
                        }}
                        className="bg-gray-100 border-none rounded-lg px-3 py-1.5 text-[10px] font-black uppercase outline-none focus:ring-1 focus:ring-rojo/20 cursor-pointer"
                      >
                        <option value="abierta">Abierta</option>
                        <option value="en_revision">En revisión</option>
                        <option value="resuelta">Resuelta</option>
                      </select>
                    </div>
                  </div>

                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Security Notice */}
                    <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex gap-3">
                      <AlertCircle size={18} className="text-orange-500 shrink-0" />
                      <p className="text-[11px] font-bold text-orange-800 leading-tight">
                        Este chat es corporativo y monitoreado. Por tu seguridad, no compartas contraseñas, datos de tarjetas de crédito o información personal sensible. El equipo TBS nunca te pedirá tus claves por este medio.
                      </p>
                    </div>

                    {activeConversation.messages.map(msg => (
                      <div 
                        key={msg.id} 
                        className={`flex ${msg.sender === 'cliente' ? 'justify-end' : msg.sender === 'sistema' ? 'justify-center' : 'justify-start'}`}
                      >
                        {msg.sender === 'sistema' ? (
                          <div className="bg-white border border-borde rounded-full px-4 py-1.5 flex items-center gap-2 shadow-sm">
                            <Info size={12} className="text-blue-500" />
                            <span className="text-[10px] font-bold text-gris">{msg.text}</span>
                          </div>
                        ) : (
                          <div className={`max-w-[80%] flex flex-col ${msg.sender === 'cliente' ? 'items-end' : 'items-start'}`}>
                            <div className={`p-4 rounded-2xl text-sm font-medium ${
                              msg.sender === 'cliente' 
                                ? 'bg-rojo text-white rounded-tr-none' 
                                : 'bg-white border border-borde text-texto rounded-tl-none shadow-sm'
                            }`}>
                              {msg.text}

                              {msg.attachmentLabel && (
                                <div className={`mt-3 p-3 rounded-xl flex items-center gap-3 ${
                                  msg.sender === 'cliente' ? 'bg-black/10' : 'bg-gray-50 border border-gray-100'
                                }`}>
                                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-sm text-rojo">
                                    {msg.attachmentType === 'pedido' ? <Package size={16} /> :
                                     msg.attachmentType === 'factura' ? <FileText size={16} /> :
                                     msg.attachmentType === 'producto' ? <ChevronRight size={16} /> :
                                     <Zap size={16} />}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className={`text-[10px] font-black uppercase opacity-60 tracking-wider ${
                                      msg.sender === 'cliente' ? 'text-white' : 'text-gris'
                                    }`}>{msg.attachmentType?.replace('_', ' ')}</p>
                                    <p className={`text-[11px] font-bold truncate ${
                                      msg.sender === 'cliente' ? 'text-white' : 'text-texto'
                                    }`}>{msg.attachmentLabel}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                            <span className="mt-1 text-[10px] font-bold text-gris opacity-60">{msg.createdAt}</span>
                          </div>
                        )}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Area */}
                  <div className="bg-white p-4 border-t border-borde">
                    <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-2 border border-transparent focus-within:border-rojo/20 focus-within:bg-white transition-all shadow-sm">
                      <div className="relative">
                        <button 
                          onClick={() => setIsContextMenuOpen(!isContextMenuOpen)}
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-gris hover:bg-gray-100 hover:text-rojo transition-all cursor-pointer"
                        >
                          <Paperclip size={20} />
                        </button>

                        <AnimatePresence>
                          {isContextMenuOpen && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              className="absolute bottom-full left-0 mb-4 w-64 bg-white rounded-2xl border border-borde p-3 tbs-shadow z-50 overflow-hidden"
                            >
                              <h5 className="text-[10px] font-black uppercase text-gris px-3 pt-2 pb-3 border-b border-gray-50 flex items-center gap-2">
                                <Info size={12} />
                                Agregar contexto
                              </h5>
                              <div className="max-h-60 overflow-y-auto mt-2">
                                {contextOptions.map((ctx, idx) => (
                                  <button 
                                    key={idx}
                                    onClick={() => handleAddContextToChat(ctx)}
                                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 text-left group"
                                  >
                                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gris group-hover:bg-rojo/5 group-hover:text-rojo">
                                      {ctx.type === 'pedido' ? <Package size={14} /> :
                                       ctx.type === 'factura' ? <FileText size={14} /> :
                                       <Zap size={14} />}
                                    </div>
                                    <span className="text-xs font-bold text-texto group-hover:text-rojo truncate">{ctx.label}</span>
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <input 
                        type="text" 
                        placeholder="Escribe un mensaje para tu asesor..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-texto py-2"
                      />

                      <button 
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                          newMessage.trim() ? 'bg-rojo text-white shadow-lg shadow-rojo/20 hover:scale-105' : 'bg-gray-200 text-gris'
                        }`}
                      >
                        <Send size={18} />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gris/30 mb-6">
                    <MessageSquare size={40} />
                  </div>
                  <h4 className="text-lg font-black text-texto mb-2">No has seleccionado un chat</h4>
                  <p className="text-sm text-gris font-medium mb-8">Selecciona una conversación de la lista o crea una nueva para hablar con tu asesor comercial.</p>
                  <button 
                    onClick={() => setIsNewConvModalOpen(true)}
                    className="h-12 px-8 bg-rojo text-white rounded-xl font-black text-sm flex items-center justify-center gap-2 tbs-shadow hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <Plus size={18} />
                    Nueva conversación
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* New Conversation Modal */}
      <AnimatePresence>
        {isNewConvModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNewConvModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[24px] overflow-hidden tbs-shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-black text-texto">Nueva conversación</h2>
                    <p className="text-[11px] text-gris font-medium">Inicia un tema de comunicación con tu asesor.</p>
                  </div>
                  <button 
                    onClick={() => setIsNewConvModalOpen(false)}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-gris hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gris tracking-widest mb-2">Tema de consulta</label>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(topicLabels).map(([topic, label]) => (
                        <button
                          key={topic}
                          onClick={() => setNewConvTopic(topic as ConversationTopic)}
                          className={`px-3 py-2.5 rounded-xl text-[11px] font-bold border transition-all text-left ${
                            newConvTopic === topic 
                              ? 'bg-rojo/5 border-rojo/30 text-rojo' 
                              : 'bg-gray-50 border-transparent text-gris hover:bg-gray-100'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-gris tracking-widest mb-2">Asunto / Contexto</label>
                    <input 
                      type="text" 
                      placeholder="Ej: Duda sobre entrega pedido TBS-10245"
                      value={newConvSubject}
                      onChange={(e) => setNewConvSubject(e.target.value)}
                      className="w-full h-12 bg-gray-50 border border-transparent focus:border-rojo/20 rounded-xl px-4 text-sm font-bold text-texto outline-none transition-all"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[10px] font-black uppercase text-gris tracking-widest">Vincular información (Opcional)</label>
                      {newConvContext !== null && (
                        <button onClick={() => setNewConvContext(null)} className="text-[9px] font-black text-rojo uppercase tracking-wider">Limpiar</button>
                      )}
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                      {contextOptions.map((ctx, idx) => (
                        <button
                          key={idx}
                          onClick={() => setNewConvContext(idx)}
                          className={`shrink-0 px-3 py-2 rounded-xl text-[10px] font-bold border transition-all flex items-center gap-2 ${
                            newConvContext === idx 
                              ? 'bg-rojo text-white border-rojo' 
                              : 'bg-white border-borde text-gris hover:bg-gray-50'
                          }`}
                        >
                          {ctx.type === 'pedido' ? <Package size={12} /> :
                           ctx.type === 'factura' ? <FileText size={12} /> :
                           <Zap size={12} />}
                          {ctx.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="block text-[10px] font-black uppercase text-gris tracking-widest mb-2">Mensaje inicial</label>
                    <textarea 
                      placeholder="Describe tu consulta detalladamente..."
                      value={newConvMessage}
                      onChange={(e) => setNewConvMessage(e.target.value)}
                      className="w-full h-32 bg-gray-50 border border-transparent focus:border-rojo/20 rounded-xl p-4 text-sm font-bold text-texto outline-none transition-all resize-none"
                    />
                  </div>

                  <button 
                    disabled={!newConvTopic || !newConvSubject.trim() || !newConvMessage.trim()}
                    onClick={handleCreateConversation}
                    className="w-full h-14 bg-rojo text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 tbs-shadow hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 disabled:grayscale disabled:scale-100 disabled:cursor-not-allowed"
                  >
                    Crear conversación
                    <ChevronRight size={18} />
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
