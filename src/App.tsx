/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { 
  Phone, 
  Headset, 
  MapPin, 
  Search, 
  ShoppingCart, 
  Bell, 
  User as UserIcon, 
  ChevronDown, 
  Users, 
  Briefcase, 
  Truck, 
  ClipboardList, 
  FileText, 
  CreditCard, 
  Zap, 
  Store, 
  Music, 
  Package, 
  Building2,
  ArrowRight,
  ArrowLeft,
  LogOut,
  Wallet,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, ViewMode, Product, User, ActivePage, TBSNotification } from './types';
import { PRODUCTS, NOTIFICATIONS } from './data';
import { CategoryPage } from './components/CategoryPage';
import { AboutPage } from './components/AboutPage';
import { ClientsPage } from './components/ClientsPage';
import { ProvidersPage } from './components/ProvidersPage';
import { ServicesPage } from './components/ServicesPage';
import { AccessRequestPage } from './components/AccessRequestPage';
import { AuthModal } from './components/AuthModal';
import { LoginModal } from './components/LoginModal';
import { PaymentsPage } from './components/PaymentsPage';
import { OrdersTrackingPage } from './components/OrdersTrackingPage';
import { ReorderPage } from './components/ReorderPage';
import { UrgentOrderPage } from './components/UrgentOrderPage';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutPage } from './components/CheckoutPage';

import { AccountDashboardPage } from './components/AccountDashboardPage';
import AdvisorChatPage from './components/AdvisorChatPage';
import { NotificationsPanel } from './components/NotificationsPanel';
import { NotificationsPage } from './components/NotificationsPage';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [selectedTopic, setSelectedTopic] = useState<any>(null);
  const [selectedContext, setSelectedContext] = useState<any>(null);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [highlightedOrderId, setHighlightedOrderId] = useState<string | null>(null);
  const [highlightedInvoiceId, setHighlightedInvoiceId] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const [authModal, setAuthModal] = useState<{ open: boolean; type: 'login' | 'request'; role: 'client' | 'provider' }>({ open: false, type: 'login', role: 'client' });
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [requestAccessRole, setRequestAccessRole] = useState<'client' | 'provider'>('client');
  
  const [notifications, setNotifications] = useState<TBSNotification[]>(NOTIFICATIONS);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const isCliente = !!currentUser;

  const simulatedHumberto: User = {
    name: "Humberto",
    email: "humberto@example.com",
    businessName: "Restaurante Demo",
    role: "cliente_b2b",
    city: "Cartagena",
    address: "Centro Histórico, Calle del Arsenal #10-20",
    customerType: "Restaurante",
    creditLimit: 5000000,
    availableCredit: 3250000
  };

  const categories = [
    { title: 'Whisky', desc: 'Escocés, americano, japonés y premium.' },
    { title: 'Ron', desc: 'Rones nacionales, importados y marcas propias.' },
    { title: 'Ginebra', desc: 'Ginebras clásicas, premium y de coctelería.' },
    { title: 'Vodka', desc: 'Formatos para bares, discotecas y eventos.' },
    { title: 'Tequila y mezcal', desc: 'Portafolio para consumo y coctelería.' },
    { title: 'Aguardiente', desc: 'Alta rotación para licoreras y bares.' },
    { title: 'Vinos y espumantes', desc: 'Selección para hoteles y restaurantes.' },
    { title: 'Promociones B2B', desc: 'Ofertas disponibles según ciudad.' }
  ];

  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return PRODUCTS;
    return PRODUCTS.filter(p => p.category === selectedCategory);
  }, [selectedCategory]);

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);

      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prev, { product, quantity }];
    });

    setIsCartOpen(true);
  };

  const handleIncrementCartItem = (productId: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const handleDecrementCartItem = (productId: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (productId: number) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleOpenCheckout = () => {
    if (!currentUser) {
      setLoginModalOpen(true);
      return;
    }
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleBackFromCheckout = () => {
    setIsCheckoutOpen(false);
    setIsCartOpen(true);
  };

  const handleAddItemsToCart = (items: { product: Product, quantity: number }[]) => {
    setCartItems((prev) => {
      let newCart = [...prev];
      items.forEach(({ product, quantity }) => {
        const existingIndex = newCart.findIndex((item) => item.product.id === product.id);
        if (existingIndex > -1) {
          newCart[existingIndex] = { 
            ...newCart[existingIndex], 
            quantity: newCart[existingIndex].quantity + quantity 
          };
        } else {
          newCart.push({ product, quantity });
        }
      });
      return newCart;
    });
    setIsCartOpen(true);
  };

  const handleGoPayments = (invoiceId?: string) => {
    console.log("Navegando a pagos. Cliente:", !!currentUser);
    if (!currentUser) {
      setLoginModalOpen(true);
      return;
    }
    setHighlightedInvoiceId(invoiceId || null);
    setActivePage('payments');
  };

  const handleGoOrdersTracking = (orderId?: string) => {
    if (!currentUser) {
      setLoginModalOpen(true);
      return;
    }
    setHighlightedOrderId(orderId || null);
    setActivePage('ordersTracking');
  };

  const handleGoReorder = () => {
    if (!currentUser) {
      setLoginModalOpen(true);
      return;
    }
    setActivePage('reorder');
  };

  const handleGoUrgentOrder = () => {
    if (!currentUser) {
      setLoginModalOpen(true);
      return;
    }
    setActivePage('urgentOrder');
  };

  const handleGoAccount = () => {
    if (!currentUser) {
      setLoginModalOpen(true);
      return;
    }
    setActivePage('account');
  };

  const handleGoAdvisorChat = (topic?: any, context?: any, conversationId?: string | null) => {
    if (!currentUser) {
      setLoginModalOpen(true);
      return;
    }
    setSelectedTopic(topic || null);
    setSelectedContext(context || null);
    setSelectedConversationId(conversationId || null);
    setActivePage('advisorChat');
  };

  const handleFinishCheckout = () => {
    setIsCheckoutOpen(false);
    setCartItems([]);
    
    // Add Notification
    const newNotif: TBSNotification = {
      id: `notif-${Date.now()}`,
      type: 'pedido',
      title: "Pedido enviado para validación",
      message: "Tu pedido fue enviado y será revisado por el equipo TBS.",
      createdAt: "Recién",
      read: false,
      priority: 'media',
      actionLabel: "Ver seguimiento",
      actionTarget: 'ordersTracking'
    };
    setNotifications(prev => [newNotif, ...prev]);

    setActivePage('ordersTracking');
  };

  const handleToggleNotifications = () => {
    if (!currentUser) {
      setLoginModalOpen(true);
      return;
    }
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  const handleGoNotificationsPage = () => {
    if (!currentUser) {
      setLoginModalOpen(true);
      return;
    }
    setIsNotificationsOpen(false);
    setActivePage('notifications');
  };

  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleDeleteReadNotifications = () => {
    setNotifications(prev => prev.filter(n => !n.read));
  };

  const handleGoToNotification = (notif: TBSNotification) => {
    handleMarkNotificationAsRead(notif.id);
    setIsNotificationsOpen(false);
    
    const contextId = notif.context?.value;

    if (notif.actionTarget === 'ordersTracking') handleGoOrdersTracking(contextId);
    else if (notif.actionTarget === 'payments') handleGoPayments(contextId);
    else if (notif.actionTarget === 'advisorChat') {
      if (notif.context?.entityType === 'chat' && notif.context.value) {
        handleGoAdvisorChat(null, null, notif.context.value);
      } else {
        handleGoAdvisorChat(notif.type, notif.context);
      }
    }
    else if (notif.actionTarget === 'urgentOrder') handleGoUrgentOrder();
    else if (notif.actionTarget === 'reorder') handleGoReorder();
    else if (notif.actionTarget === 'catalog') goToCatalog('Whisky');
    else if (notif.actionTarget === 'account') setActivePage('account');
    else setActivePage('notifications');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    resetToHome();
  };

  const handleCheckout = async () => {
    console.log("Iniciando checkout... Cliente:", !!currentUser);
    if (!currentUser) {
      console.log("Usuario no autenticado, abriendo modal...");
      setLoginModalOpen(true);
      return;
    }

    if (cartItems.length === 0) {
      console.log("Carrito vacío");
      return;
    }

    setIsOrdering(true);
    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderDetails: {
            items: cartItems.map(item => ({
              id: item.product.id,
              name: item.product.name,
              quantity: item.quantity,
              price: item.product.price
            })),
            totalUnits: cartCount,
            estimatedTotal: cartItems.reduce((sum, item) => {
              const p = Number(item.product.price.replace(/[^0-9]/g, '')) || 0;
              return sum + p * item.quantity;
            }, 0)
          },
          userEmail: currentUser?.email || "h.fm1219@gmail.com"
        }),
      });

      if (!response.ok) {
        throw new Error(`Error en el servidor: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        alert("¡Pedido realizado con éxito!\n\nSe ha enviado un correo de confirmación a: " + (currentUser?.email || "h.fm1219@gmail.com") + "\n\n(Revisa la consola del servidor para ver el mensaje generado por Gemini)");
        setCartItems([]);
        setIsCartOpen(false);
      } else {
        alert("Error al procesar el pedido: " + data.error);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Error de conexión al procesar el pedido. Asegúrate de que el servidor esté corriendo.");
    } finally {
      setIsOrdering(false);
    }
  };

  const resetToHome = () => {
    setSelectedCategory(null);
    setActivePage('home');
    setActiveMenu(null);
  };

  const goToCatalog = (category: string | null = null) => {
    setSelectedCategory(category);
    setActivePage('catalog');
    setActiveMenu(null);
  };

  const openAuth = (type: 'login' | 'request', role: 'client' | 'provider' = 'client') => {
    if (type === 'login') {
      setLoginModalOpen(true);
      setActiveMenu(null);
      return;
    }
    if (type === 'request') {
      setRequestAccessRole(role);
      setActivePage('request-access');
      setActiveMenu(null);
      return;
    }
    setAuthModal({ open: true, type, role });
    setActiveMenu(null);
  };

  const toggleMenu = (menu: string) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  if (isCheckoutOpen) {
    return (
      <CheckoutPage
        items={cartItems}
        currentUser={currentUser}
        onBack={handleBackFromCheckout}
        onFinish={handleFinishCheckout}
      />
    );
  }

  return (
    <div className="min-h-screen" onClick={() => setActiveMenu(null)}>
      {/* Barra Demo */}
      <div className="sticky top-0 z-50 border-bottom border-borde bg-white/94 backdrop-blur-md" onClick={(e) => e.stopPropagation()}>
        <div className="max-w-[1480px] mx-auto px-8 py-3 flex items-center justify-between">
          <div className="text-sm font-bold text-texto-sec">Modo Demo TBS</div>
          <div className="flex gap-1 p-1 border border-[#DDE1E7] bg-[#F8FAFC] rounded-full">
            <button 
              onClick={() => setCurrentUser(null)}
              className={`px-5 py-2 rounded-full font-extrabold text-sm transition-all ${!currentUser ? 'bg-rojo text-white tbs-shadow' : 'text-texto-sec hover:bg-gray-100'}`}
            >
              Sin Sesión
            </button>
            <button 
              onClick={() => {
                setCurrentUser({
                  name: "Humberto",
                  email: "humberto@example.com",
                  businessName: "Restaurante Demo",
                  role: "cliente_b2b",
                  city: "Cartagena",
                  customerType: "Restaurante",
                  creditLimit: 5000000,
                  availableCredit: 3250000
                });
                resetToHome();
              }}
              className={`px-5 py-2 rounded-full font-extrabold text-sm transition-all ${currentUser ? 'bg-rojo text-white tbs-shadow' : 'text-texto-sec hover:bg-gray-100'}`}
            >
              Loguear B2B (Humberto)
            </button>
          </div>
        </div>
      </div>

      {/* Topbar */}
      <div className="bg-rojo text-white text-[13px] font-bold">
        <div className="max-w-[1480px] mx-auto px-8 py-2 flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-7">
            <span className="flex items-center gap-[7px]">
              <Building2 size={15} />
              Plataforma B2B de licores para negocios
            </span>
          </div>
          <div className="flex items-center gap-7">
            <span className="flex items-center gap-[7px]">
              <Phone size={15} />
              ¿Necesitas ayuda? 314 581 3569
            </span>
            <span className="flex items-center gap-[7px]">
              <Headset size={15} />
              Soporte
            </span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-[#EFEFEF]">
        <div className="max-w-[1480px] mx-auto px-8 py-6 flex items-center gap-8 flex-wrap lg:flex-nowrap">
          <div className="min-w-[120px] leading-none cursor-pointer" onClick={resetToHome}>
            <div className="text-[42px] font-black tracking-[-2px] text-rojo">TBS</div>
          </div>

          <div className="hidden md:flex items-center gap-3 min-w-[130px] text-[13px] text-gris leading-tight">
            <MapPin size={22} className="text-texto" />
            <div>Entrega en<br /><strong className="text-texto">Cartagena</strong></div>
          </div>

          <div className="relative flex-1 min-w-[280px]">
            <input 
              type="text" 
              placeholder="Buscar productos, marcas, categorías..." 
              className="w-full h-12 border border-[#DDE1E7] rounded-md px-5 pr-12 text-sm outline-none focus:border-rojo transition-colors"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A8F98]" size={22} />
          </div>

          <div className="flex items-center gap-[22px] text-sm font-bold">
            {!currentUser ? (
              <>
                <button onClick={() => setLoginModalOpen(true)} className="hover:text-rojo cursor-pointer transition-colors">Iniciar sesión / Entrar</button>
                <div 
                  className="relative inline-flex cursor-pointer transition-transform hover:scale-110"
                  onClick={() => setIsCartOpen(true)}
                >
                  <ShoppingCart size={25} strokeWidth={1.8} />
                  <span className="absolute -top-[9px] -right-[9px] flex items-center justify-center min-w-[19px] h-[19px] px-1.5 bg-[#D90000] text-white rounded-full text-[10px] font-extrabold">{cartCount}</span>
                </div>
              </>
            ) : (
              <>
                <div className="hidden lg:flex flex-col items-end leading-tight text-gris-oscuro">
                  <span className="text-[10px] font-black uppercase tracking-widest text-rojo">Crédito Disponible</span>
                  <strong className="text-texto text-sm font-black">$3'250.000</strong>
                </div>
                <div className="relative inline-flex cursor-pointer transition-transform hover:scale-110" onClick={handleToggleNotifications}>
                  <Bell size={24} strokeWidth={1.8} />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute -top-[9px] -right-[9px] flex items-center justify-center min-w-[19px] h-[19px] px-1.5 bg-[#D90000] text-white rounded-full text-[10px] font-extrabold">
                      {notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </div>
                <div 
                  className="relative inline-flex cursor-pointer transition-transform hover:scale-110"
                  onClick={() => setIsCartOpen(true)}
                >
                  <ShoppingCart size={25} strokeWidth={1.8} />
                  <span className="absolute -top-[9px] -right-[9px] flex items-center justify-center min-w-[19px] h-[19px] px-1.5 bg-[#D90000] text-white rounded-full text-[10px] font-extrabold">{cartCount}</span>
                </div>
                <div className="relative group/user">
                  <div className="flex items-center gap-[12px] leading-tight text-sm font-medium cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMenu('user');
                    }}
                  >
                    <div className="w-10 h-10 border-2 border-rojo rounded-full flex items-center justify-center bg-rojo-suave text-rojo transform group-hover/user:scale-110 transition-transform">
                      <UserIcon size={22} strokeWidth={2.5} />
                    </div>
                    <div className="hidden sm:block">
                      <div className="text-[10px] font-black uppercase tracking-[0.15em] text-gris mb-0.5">Mi Cuenta</div>
                      <div className="flex items-center gap-1.5">
                        <strong className="font-black text-texto text-sm tracking-tight">Humberto</strong>
                        <ChevronDown size={14} className={`transition-transform text-rojo ${activeMenu === 'user' ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {activeMenu === 'user' && (
                      <>
                        <div className="fixed inset-0 z-[100]" onClick={() => setActiveMenu(null)} />
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 10 }}
                          className="absolute top-full right-0 mt-3 w-72 bg-white border border-borde rounded-xl shadow-2xl p-4 z-[110]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="px-4 py-3 mb-2 bg-gray-50 rounded-lg">
                            <div className="text-[10px] font-black uppercase tracking-widest text-rojo mb-1">Negocio Registrado</div>
                            <div className="text-sm font-black text-texto truncate">{currentUser.businessName}</div>
                            <div className="text-[11px] font-bold text-gris mt-1 uppercase tracking-tight">{currentUser.city} · {currentUser.customerType}</div>
                          </div>

                          <div className="space-y-1">
                            <button 
                              onClick={() => {
                                handleGoAccount();
                                setActiveMenu(null);
                              }}
                              className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 flex items-center gap-3 transition-colors"
                            >
                              <UserIcon size={18} className="text-gris" />
                              <span className="text-sm font-bold text-texto">Mi Perfil / Dashboard</span>
                            </button>
                            <button 
                              onClick={() => {
                                handleGoPayments();
                                setActiveMenu(null);
                              }}
                              className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 flex items-center gap-3 transition-colors"
                            >
                              <Wallet size={18} className="text-gris" />
                              <span className="text-sm font-bold text-texto">Estado de Cartera</span>
                            </button>
                            <button 
                              onClick={() => {
                                handleGoOrdersTracking();
                                setActiveMenu(null);
                              }}
                              className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 flex items-center gap-3 transition-colors"
                            >
                              <Package size={18} className="text-gris" />
                              <span className="text-sm font-bold text-texto">Seguimiento de Pedidos</span>
                            </button>
                            <button 
                              onClick={() => {
                                handleGoUrgentOrder();
                                setActiveMenu(null);
                              }}
                              className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 flex items-center gap-3 transition-colors"
                            >
                              <Zap size={18} className="text-gris" />
                              <span className="text-sm font-bold text-texto">Pedido urgente</span>
                            </button>
                            <button 
                              onClick={() => {
                                handleGoAdvisorChat();
                                setActiveMenu(null);
                              }}
                              className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 flex items-center gap-3 transition-colors"
                            >
                              <MessageSquare size={18} className="text-gris" />
                              <span className="text-sm font-bold text-texto">Mi asesor</span>
                            </button>
                            <div className="h-px bg-gray-100 my-2" />
                            <button 
                              onClick={() => {
                                handleLogout();
                                setActiveMenu(null);
                              }}
                              className="w-full text-left px-4 py-3 rounded-lg bg-rojo-suave/30 hover:bg-rojo-suave flex items-center gap-3 transition-colors group"
                            >
                              <LogOut size={18} className="text-rojo" />
                              <span className="text-sm font-black text-rojo">Cerrar sesión</span>
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Nav */}
      <nav className="bg-white border-b border-[#EFEFEF] hidden md:block" onClick={(e) => e.stopPropagation()}>
        <div className="max-w-[1480px] mx-auto px-8 py-4 flex items-center justify-between gap-6">
          <div className="flex-1 flex items-center gap-4 lg:gap-8">
            <div className="relative">
              <button 
                onClick={() => toggleMenu('catalog')}
                className="flex items-center gap-1.5 text-[13px] font-black text-[#303844] hover:text-rojo whitespace-nowrap py-2 cursor-pointer uppercase tracking-wider"
              >
                Catálogo <ChevronDown size={14} className={`transition-transform ${activeMenu === 'catalog' ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {activeMenu === 'catalog' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 w-[680px] bg-white border border-borde rounded-xl shadow-2xl p-6 z-[100]"
                  >
                    <div className="grid grid-cols-[1.2fr_1fr] gap-7">
                      <div>
                        <div className="flex items-center justify-between mb-3.5">
                          <h4 className="text-base font-black text-texto">Categorías de Licores</h4>
                          <button 
                            onClick={() => goToCatalog(null)}
                            className="text-[11px] font-black text-rojo hover:underline cursor-pointer uppercase tracking-wider"
                          >
                            Ver todo el catálogo →
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {categories.map((cat, i) => (
                            <button 
                              key={i} 
                              onClick={() => goToCatalog(cat.title)}
                              className="flex flex-col gap-1 p-3 border border-[#EEF0F3] rounded-lg hover:border-rojo hover:bg-rojo-suave transition-colors text-left group cursor-pointer outline-none"
                            >
                              <strong className="text-sm font-black group-hover:text-rojo">{cat.title}</strong>
                              <span className="text-[12px] text-gris font-semibold leading-tight">{cat.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-xl bg-gradient-to-br from-[#FFF1F1] to-white border border-[#F0D3D3] p-[22px]">
                        <span className="inline-block mb-2.5 px-2.5 py-1.5 rounded-full bg-rojo text-white text-[11px] font-black uppercase tracking-wider">Acceso B2B</span>
                        <h3 className="text-[21px] font-black text-texto leading-none">Precios personalizados para tu negocio.</h3>
                        <p className="my-4 text-sm font-semibold text-texto-sec leading-relaxed">
                          Para ver precios mayoristas, crédito y disponibilidad real, solicita tu acceso.
                        </p>
                        <button 
                          onClick={() => openAuth('request')}
                          className="w-full px-[18px] py-3 bg-rojo text-white rounded-md text-[13px] font-black hover:bg-rojo-oscuro transition-colors cursor-pointer"
                        >
                          Solicitar acceso →
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {!isCliente ? (
              <>
                <div className="relative">
                   <button 
                    onClick={() => { setActivePage('about'); setActiveMenu(null); }}
                    className={`flex items-center gap-1.5 text-[13px] font-black text-[#303844] hover:text-rojo whitespace-nowrap py-2 cursor-pointer outline-none uppercase tracking-wider ${activePage === 'about' ? 'text-rojo' : ''}`}
                  >
                    Qué es TBS <ChevronDown size={14} onMouseEnter={() => toggleMenu('about')} className={`transition-transform ${activeMenu === 'about' ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {activeMenu === 'about' && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 w-[820px] bg-white border border-borde rounded-xl shadow-2xl p-7 z-[100]"
                      >
                        <div className="grid grid-cols-[1.5fr_1fr] gap-10">
                          <div>
                            <h4 className="mb-5 text-[15px] font-black text-texto uppercase tracking-wider">Lo que hacemos</h4>
                            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                              {[
                                { title: 'Catálogo B2B', desc: 'Explora productos, marcas y disponibilidad.' },
                                { title: 'Precios personalizados', desc: 'Condiciones según tipo de cliente y volumen.' },
                                { title: 'Crédito y cartera', desc: 'Consulta cupo, facturas y pagos.' },
                                { title: 'Pedidos recurrentes', desc: 'Repite compras frecuentes en segundos.' },
                                { title: 'Logística y seguimiento', desc: 'Entregas con trazabilidad y soporte.' },
                                { title: 'Acompañamiento', desc: 'Un asesor experto te ayuda a vender más.' }
                              ].map((item, i) => (
                                <div key={i} className="flex flex-col gap-1">
                                  <strong className="text-[14px] font-black text-texto">{item.title}</strong>
                                  <p className="text-[12px] text-gris font-semibold leading-relaxed">{item.desc}</p>
                                </div>
                              ))}
                            </div>
                            <div className="mt-8 pt-5 border-t border-gray-100 italic text-[13px] text-gris font-medium">
                              "TBS combina tecnología, logística y experiencia para ser el aliado del canal B2B."
                            </div>
                          </div>
                          
                          <div className="rounded-xl bg-gray-50 border border-borde p-6 flex flex-col">
                            <h3 className="text-xl font-black text-texto leading-snug">Mucho más que una tienda de licores.</h3>
                            <p className="mt-4 text-[13.5px] font-semibold text-texto-sec leading-relaxed">
                              TBS es una plataforma B2B que ayuda a negocios del sector HORECA a comprar, pagar, recibir y gestionar su abastecimiento desde un solo lugar.
                            </p>
                            
                            <div className="mt-6 flex-1">
                              <h4 className="text-[11px] font-black text-gris uppercase tracking-widest mb-3">Diseñado para</h4>
                              <div className="flex flex-wrap gap-2 text-[12px] font-bold text-texto-sec">
                                <span className="px-2 py-1 bg-white border border-borde rounded">Bares</span>
                                <span className="px-2 py-1 bg-white border border-borde rounded">Hoteles</span>
                                <span className="px-2 py-1 bg-white border border-borde rounded">Licoreras</span>
                                <span className="px-2 py-1 bg-white border border-borde rounded">Eventos</span>
                              </div>
                            </div>

                            <button 
                              onClick={() => { setActivePage('about'); setActiveMenu(null); }}
                              className="w-full mt-6 px-5 py-3 bg-rojo text-white rounded-md text-[13px] font-black hover:bg-rojo-oscuro transition-all flex items-center justify-center gap-2 group cursor-pointer outline-none"
                            >
                              Conocer la plataforma <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="relative">
                  <button 
                    onClick={() => { setActivePage('clients'); setActiveMenu(null); }}
                    className={`flex items-center gap-1.5 text-[13px] font-black text-[#303844] hover:text-rojo whitespace-nowrap py-2 cursor-pointer outline-none uppercase tracking-wider ${activePage === 'clients' ? 'text-rojo' : ''}`}
                  >
                    Clientes B2B <ChevronDown size={14} onMouseEnter={() => toggleMenu('clients')} className={`transition-transform ${activeMenu === 'clients' ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {activeMenu === 'clients' && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-1/2 -translate-x-[35%] w-[780px] bg-white border border-borde rounded-xl shadow-2xl p-7 z-[100]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="grid grid-cols-[1.3fr_0.9fr] gap-x-7">
                          <div>
                            <h4 className="mb-5 text-[15px] font-black text-texto uppercase tracking-wider">Soluciones por tipo de cliente</h4>
                            <div className="submenu-clientes-grid">
                              {[
                                { title: 'Bares y restaurantes', desc: 'Abastecimiento recurrente, pedidos urgentes y soporte.' },
                                { title: 'Hoteles y clubes', desc: 'Portafolio confiable, entregas programadas y crédito.' },
                                { title: 'Licoreras', desc: 'Compra por volumen, promociones y disponibilidad.' },
                                { title: 'Supermercados', desc: 'Condiciones comerciales, surtido y cumplimiento.' },
                                { title: 'Discotecas y eventos', desc: 'Productos de alta rotación y respuesta rápida.' },
                                { title: 'Canal especializado', desc: 'Soluciones para distribuidores y tiendas premium.' }
                              ].map((cliente, i) => (
                                <a key={i} href="#" className="cliente-card group">
                                  <strong className="block text-[14px] font-black group-hover:text-rojo transition-colors">{cliente.title}</strong>
                                  <span className="block text-[12px] text-gris font-semibold leading-tight">{cliente.desc}</span>
                                </a>
                              ))}
                            </div>
                          </div>
                          
                          <div className="clientes-beneficios-box">
                            <span className="inline-block px-2.5 py-1 bg-rojo text-white rounded-full text-[10px] font-black uppercase tracking-wider mb-3">Clientes B2B</span>
                            <h3 className="text-xl font-black text-texto leading-tight transition-colors">Compra, paga y recibe con más control.</h3>
                            <p className="mt-3 text-[14px] font-semibold text-texto-sec leading-relaxed">
                              TBS ayuda a negocios que venden o sirven licores a centralizar su abastecimiento desde una sola plataforma.
                            </p>
                            
                            <ul className="mt-4 space-y-1.5 text-[13px] font-bold text-texto-sec list-disc pl-5">
                              <li>Precios según perfil comercial.</li>
                              <li>Crédito y cartera visible.</li>
                              <li>Pedidos recurrentes.</li>
                              <li>Seguimiento de entregas.</li>
                              <li>Soporte comercial experto.</li>
                            </ul>

                            <button onClick={() => openAuth('request', 'client')} className="w-full mt-6 px-4 py-3 bg-rojo text-white rounded-md text-[13px] font-black hover:bg-rojo-oscuro transition-all cursor-pointer">
                              Solicitar acceso →
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="relative">
                  <button 
                    onClick={() => { setActivePage('providers'); setActiveMenu(null); }}
                    className={`flex items-center gap-1.5 text-[13px] font-black text-[#303844] hover:text-rojo whitespace-nowrap py-2 cursor-pointer outline-none uppercase tracking-wider ${activePage === 'providers' ? 'text-rojo' : ''}`}
                  >
                    Proveedores y marcas <ChevronDown size={14} onMouseEnter={() => toggleMenu('providers')} className={`transition-transform ${activeMenu === 'providers' ? 'rotate-180' : ''}`} />
                  </button>
 
                  <AnimatePresence>
                    {activeMenu === 'providers' && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-1/2 -translate-x-[45%] w-[820px] bg-white border border-borde rounded-xl shadow-2xl p-7 z-[100]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="grid grid-cols-[1.15fr_1fr] gap-x-7">
                          <div>
                            <h4 className="mb-5 text-[15px] font-black text-texto uppercase tracking-wider">Soluciones para marcas y proveedores</h4>
                            <div className="submenu-proveedores-grid">
                              {[
                                { title: 'Publicación de portafolio', desc: 'Muestra tus productos, marcas y disponibilidad.' },
                                { title: 'Acceso al canal HORECA', desc: 'Llega a bares, hoteles y clientes especializados.' },
                                { title: 'Logística y distribución', desc: 'Apóyate en la red operativa de TBS para despacho.' },
                                { title: 'Visibilidad comercial', desc: 'Participa en campañas, vitrinas y activaciones.' },
                                { title: 'Reportes de desempeño', desc: 'Consulta rotación, ventas y cumplimiento.' },
                                { title: 'Activación en clientes', desc: 'Ejecuta marcas en punto de consumo con apoyo.' }
                              ].map((prov, i) => (
                                <a key={i} href="#" className="proveedor-card group">
                                  <strong className="block text-[14px] font-black group-hover:text-rojo transition-colors">{prov.title}</strong>
                                  <span className="block text-[12px] text-gris font-semibold leading-tight">{prov.desc}</span>
                                </a>
                              ))}
                            </div>
                          </div>
                          
                          <div className="proveedores-destacado-box flex flex-col">
                            <span className="inline-block px-2.5 py-1 bg-rojo text-white rounded-full text-[10px] font-black uppercase tracking-wider mb-3 w-fit">Canal B2B</span>
                            <h3 className="text-xl font-black text-texto leading-tight">Convierte TBS en tu canal de crecimiento.</h3>
                            <p className="mt-3 text-[14px] font-semibold text-texto-sec leading-relaxed">
                              TBS permite a marcas, importadoras y proveedores llegar al mercado B2B con tecnología, operación y datos.
                            </p>
                            
                            <ul className="mt-4 space-y-1 text-[13px] font-bold text-texto-sec list-disc pl-5 flex-1">
                              <li>Mayor cobertura comercial.</li>
                              <li>Acceso a clientes B2B activos.</li>
                              <li>Modelos flexibles según inventario.</li>
                              <li>Reportes de rotación.</li>
                            </ul>

                            <button onClick={() => openAuth('request', 'provider')} className="w-full mt-6 px-4 py-3 bg-rojo text-white rounded-md text-[13px] font-black hover:bg-rojo-oscuro transition-all cursor-pointer">
                              Quiero vender con TBS →
                            </button>

                            <div className="mt-5 pt-4 border-t border-rojo/20">
                              <h5 className="text-[12px] font-black text-texto mb-2 uppercase tracking-wider">Modelos disponibles</h5>
                              <div className="flex flex-wrap gap-1.5">
                                {['Compra directa', 'Consignación', 'Marketplace', 'Despacho directo'].map(m => (
                                  <span key={m} className="px-2 py-1 bg-white border border-rojo/20 rounded-full text-[10px] font-black text-rojo">{m}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="relative">
                  <button 
                    onClick={() => { setActivePage('services'); setActiveMenu(null); }}
                    className={`flex items-center gap-1.5 text-[13px] font-black text-[#303844] hover:text-rojo whitespace-nowrap py-2 cursor-pointer outline-none uppercase tracking-wider ${activePage === 'services' ? 'text-rojo' : ''}`}
                  >
                    Servicios TBS <ChevronDown size={14} onMouseEnter={() => toggleMenu('services')} className={`transition-transform ${activeMenu === 'services' ? 'rotate-180' : ''}`} />
                  </button>
 
                  <AnimatePresence>
                    {activeMenu === 'services' && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-1/2 -translate-x-[85%] w-[860px] bg-white border border-borde rounded-xl shadow-2xl p-7 z-[100]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="grid grid-cols-[1.35fr_0.9fr] gap-x-7">
                          <div>
                            <h4 className="mb-5 text-[15px] font-black text-texto uppercase tracking-wider">Servicios para operar mejor tu negocio</h4>
                            <div className="submenu-servicios-grid">
                              {[
                                { title: 'Abastecimiento B2B', desc: 'Compra productos de múltiples marcas desde un solo lugar.' },
                                { title: 'Logística y entregas', desc: 'Despachos programados, seguimiento y gestión de novedades.' },
                                { title: 'Pedido urgente', desc: 'Servicio para necesidades inmediatas de negocios Horeca.' },
                                { title: 'Crédito B2B', desc: 'Condiciones comerciales y cupos según perfil de riesgo.' },
                                { title: 'Cartera y pagos', desc: 'Consulta facturas, vencimientos y pagos pendientes.' },
                                { title: 'Pedidos recurrentes', desc: 'Repite compras frecuentes y listas favoritas.' },
                                { title: 'Activaciones comerciales', desc: 'Apoyo en campañas, temporadas y eventos.' },
                                { title: 'Inteligencia comercial', desc: 'Información de rotación y comportamiento de compra.' }
                              ].map((serv, i) => (
                                <button 
                                  key={i} 
                                  onClick={() => { 
                                    if (serv.title === 'Pedido urgente') {
                                      handleGoUrgentOrder();
                                    } else {
                                      setActivePage('services');
                                    }
                                    setActiveMenu(null); 
                                  }}
                                  className="servicio-card group text-left w-full cursor-pointer"
                                >
                                  <strong className="block text-[14px] font-black group-hover:text-rojo transition-colors">{serv.title}</strong>
                                  <span className="block text-[12px] text-gris font-semibold leading-tight">{serv.desc}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                          
                          <div className="servicios-destacado-box flex flex-col">
                            <span className="inline-block px-2.5 py-1 bg-rojo text-white rounded-full text-[10px] font-black uppercase tracking-wider mb-3 w-fit">Infraestructura TBS</span>
                            <h3 className="text-xl font-black text-texto leading-tight transition-colors">Más que vender productos: ayudamos a operar y crecer.</h3>
                            <p className="mt-3 text-[14px] font-semibold text-texto-sec leading-relaxed">
                              TBS con tecnología, logística, crédito y datos para que los negocios compren mejor.
                            </p>
                            
                            <ul className="mt-4 space-y-1 text-[13px] font-bold text-texto-sec list-disc pl-5 flex-1">
                              <li>Un solo canal de compra.</li>
                              <li>Precios por cliente.</li>
                              <li>Seguimiento de pedidos.</li>
                              <li>Pagos en línea.</li>
                              <li>Soporte experto.</li>
                            </ul>

                            <button 
                              onClick={() => { setActivePage('services'); setActiveMenu(null); }}
                              className="w-full mt-6 px-4 py-3 bg-rojo text-white rounded-md text-[13px] font-black hover:bg-rojo-oscuro transition-all cursor-pointer"
                            >
                              Conocer servicios TBS →
                            </button>

                            <div className="mt-5 pt-4 border-t border-rojo/20">
                              <h5 className="text-[12px] font-black text-texto mb-2 uppercase tracking-wider">Servicios clave</h5>
                              <div className="flex flex-wrap gap-1.5">
                                {['Logística', 'Crédito', 'Pagos', 'Datos', 'Activaciones', 'Soporte'].map(s => (
                                  <span key={s} className="px-2 py-1 bg-white border border-rojo/20 rounded-full text-[10px] font-black text-rojo">{s}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <button onClick={handleGoReorder} className={`text-sm font-extrabold whitespace-nowrap cursor-pointer transition-colors ${activePage === 'reorder' ? 'text-rojo font-black' : 'text-[#303844] hover:text-rojo'}`}>Reordenar</button>
                <button 
                  onClick={handleGoPayments} 
                  className={`text-sm font-extrabold whitespace-nowrap cursor-pointer transition-colors ${activePage === 'payments' ? 'text-rojo font-black' : 'text-[#303844] hover:text-rojo'}`}
                >
                  Cartera y pagos
                </button>
                <button 
                  onClick={handleGoOrdersTracking} 
                  className={`text-sm font-extrabold whitespace-nowrap cursor-pointer transition-colors ${activePage === 'ordersTracking' ? 'text-rojo font-black' : 'text-[#303844] hover:text-rojo'}`}
                >
                  Seguimiento
                </button>
                <button 
                  onClick={handleGoUrgentOrder} 
                  className={`text-sm font-extrabold whitespace-nowrap cursor-pointer transition-colors ${activePage === 'urgentOrder' ? 'text-rojo font-black' : 'text-[#303844] hover:text-rojo'}`}
                >
                  Pedido urgente
                </button>
                <button 
                  onClick={() => handleGoAdvisorChat()} 
                  className={`text-sm font-extrabold whitespace-nowrap cursor-pointer transition-colors ${activePage === 'advisorChat' ? 'text-rojo font-black' : 'text-[#303844] hover:text-rojo'}`}
                >
                  Mi asesor
                </button>
                <button onClick={() => setActivePage('providers')} className="text-sm font-extrabold text-[#303844] hover:text-rojo whitespace-nowrap cursor-pointer">Proveedores y marcas</button>
                <button onClick={() => setActivePage('services')} className="flex items-center gap-1.5 text-sm font-extrabold text-[#303844] hover:text-rojo whitespace-nowrap cursor-pointer">Servicios TBS <ChevronDown size={14} /></button>
              </>
            )}
          </div>
          {!isCliente && (
            <button onClick={() => openAuth('request')} className="px-7 py-3.5 bg-rojo text-white rounded-md text-[13px] font-black hover:bg-rojo-oscuro transition-all uppercase tracking-wider shadow-lg shadow-rojo/20 cursor-pointer">Solicitar acceso</button>
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        {activePage === 'catalog' ? (
          <motion.div
            key="category"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <CategoryPage 
              category={selectedCategory} 
              products={filteredProducts}
              onBack={resetToHome} 
              onAddToCart={handleAddToCart}
              isCliente={isCliente}
              onCategorySelect={setSelectedCategory}
              onRequestAccess={() => openAuth('request')}
              onLogin={() => setLoginModalOpen(true)}
            />
          </motion.div>
        ) : activePage === 'about' ? (
          <motion.div
            key="about"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <AboutPage 
              onBack={resetToHome} 
              onGoToCatalog={() => { resetToHome(); }} 
              onGoAdvisorChat={handleGoAdvisorChat}
            />
          </motion.div>
        ) : activePage === 'clients' ? (
          <motion.div
            key="clients"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <ClientsPage 
              onBack={resetToHome}
              onGoToCatalog={() => goToCatalog('Whisky')}
              onRequestAccess={() => openAuth('request')}
              onLogin={() => setLoginModalOpen(true)}
              onGoAdvisorChat={handleGoAdvisorChat}
            />
          </motion.div>
        ) : activePage === 'providers' ? (
          <motion.div
            key="providers"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <ProvidersPage 
              onBack={resetToHome}
              onRequestAccess={() => openAuth('request', 'provider')}
              onLogin={() => setLoginModalOpen(true)}
            />
          </motion.div>
        ) : activePage === 'services' ? (
          <motion.div
            key="services"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <ServicesPage 
              onBack={resetToHome}
              onGoToCatalog={() => goToCatalog('Whisky')}
              onRequestAccess={() => openAuth('request')}
              onLogin={() => setLoginModalOpen(true)}
            />
          </motion.div>
        ) : activePage === 'account' ? (
          <motion.div
            key="account"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {currentUser && (
              <AccountDashboardPage 
                user={currentUser}
                onGoBack={resetToHome} 
                onGoCatalog={() => goToCatalog('Whisky')}
                onGoPayments={handleGoPayments}
                onGoOrders={handleGoOrdersTracking}
                onGoReorder={handleGoReorder}
                onGoUrgentOrder={handleGoUrgentOrder}
                onLogout={handleLogout}
                onGoAdvisorChat={handleGoAdvisorChat}
              />
            )}
          </motion.div>
        ) : activePage === 'request-access' ? (
          <motion.div
            key="request-access"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <AccessRequestPage 
              onBack={resetToHome}
              initialRole={requestAccessRole}
            />
          </motion.div>
        ) : activePage === 'payments' ? (
          <motion.div
            key="payments"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <PaymentsPage 
              currentUser={currentUser}
              onBackToAccount={() => setActivePage('account')}
              onGoHome={resetToHome}
              onGoAccount={() => setActivePage('account')}
              onGoAdvisorChat={handleGoAdvisorChat}
              highlightedInvoiceId={highlightedInvoiceId}
              onClearHighlight={() => setHighlightedInvoiceId(null)}
            />
          </motion.div>
        ) : activePage === 'ordersTracking' ? (
          <motion.div
            key="ordersTracking"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <OrdersTrackingPage 
              currentUser={currentUser}
              onBackToAccount={() => setActivePage('account')}
              onGoHome={resetToHome}
              onGoCatalog={() => goToCatalog('Whisky')}
              onAddItemsToCart={handleAddItemsToCart}
              onOpenCart={() => setIsCartOpen(true)}
              onGoReorder={handleGoReorder}
              onGoAdvisorChat={handleGoAdvisorChat}
              highlightedOrderId={highlightedOrderId}
              onClearHighlight={() => setHighlightedOrderId(null)}
            />
          </motion.div>
        ) : activePage === 'reorder' ? (
          <motion.div
            key="reorder"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <ReorderPage 
              currentUser={currentUser}
              onBackToAccount={() => setActivePage('account')}
              onGoHome={resetToHome}
              onGoCatalog={() => goToCatalog('Whisky')}
              onAddToCart={handleAddToCart}
              onOpenCart={() => setIsCartOpen(true)}
              onGoAdvisorChat={handleGoAdvisorChat}
            />
          </motion.div>
        ) : activePage === 'urgentOrder' ? (
          <motion.div
            key="urgentOrder"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <UrgentOrderPage 
              currentUser={currentUser}
              onBackToAccount={() => setActivePage('account')}
              onGoHome={resetToHome}
              onGoTracking={handleGoOrdersTracking}
              onGoCatalog={() => goToCatalog('Whisky')}
              onGoAdvisorChat={handleGoAdvisorChat}
              onCreateNotification={(n) => setNotifications(prev => [n, ...prev])}
            />
          </motion.div>
        ) : activePage === 'advisorChat' ? (
          <motion.div
            key="advisorChat"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <AdvisorChatPage 
              currentUser={currentUser}
              onBackToAccount={() => setActivePage('account')}
              onGoHome={resetToHome}
              onGoOrdersTracking={handleGoOrdersTracking}
              onGoPayments={handleGoPayments}
              onGoCatalog={() => goToCatalog('Whisky')}
              onGoUrgentOrder={handleGoUrgentOrder}
              initialTopic={selectedTopic}
              initialContext={selectedContext}
              initialConversationId={selectedConversationId}
              onClearInitialStates={() => {
                setSelectedTopic(null);
                setSelectedContext(null);
                setSelectedConversationId(null);
              }}
              onCreateNotification={(n) => setNotifications(prev => [n, ...prev])}
            />
          </motion.div>
        ) : activePage === 'notifications' ? (
          <motion.div
            key="notifications"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <NotificationsPage 
              currentUser={currentUser}
              notifications={notifications}
              onBackToAccount={() => setActivePage('account')}
              onGoHome={resetToHome}
              onMarkAsRead={handleMarkNotificationAsRead}
              onMarkAllAsRead={handleMarkAllNotificationsAsRead}
              onDeleteNotification={handleDeleteNotification}
              onDeleteReadNotifications={handleDeleteReadNotifications}
              onGoToNotification={handleGoToNotification}
            />
          </motion.div>
        ) : (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Hero */}
            <section className="bg-[#FFFDFD]">
        <div className="max-w-[1480px] mx-auto px-8 py-10 lg:py-12 flex flex-col lg:flex-row gap-8">
          <div className="flex-1 flex flex-col justify-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-rojo text-[11px] font-black uppercase tracking-[0.18em]"
            >
              Plataforma B2B
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-5 text-4xl sm:text-5xl lg:text-[76px] font-black leading-[0.9] tracking-[-3.5px] max-w-[620px]"
            >
              Abastece tu negocio.<br />Crece con <span className="text-rojo">TBS.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-7 text-lg lg:text-[20px] text-[#334155] leading-relaxed font-medium max-w-[640px]"
            >
              Compra licores con precios personalizados, crédito, pagos unificados, entregas confiables y soporte comercial experto desde una sola plataforma diseñada para tu operación.
            </motion.p>

            <div className="mt-8 flex flex-wrap gap-[18px]">
              {!isCliente ? (
                <>
                  <button onClick={() => openAuth('request')} className="px-7 py-3.5 bg-rojo text-white rounded-md text-[15px] font-black tbs-shadow hover:bg-rojo-oscuro transition-colors flex items-center gap-2 cursor-pointer">
                    Solicitar acceso B2B <ArrowRight size={18} />
                  </button>
                  <button onClick={() => setActivePage('about')} className="px-7 py-3.5 border border-[#C83A3A] bg-white text-rojo rounded-md text-[15px] font-black hover:bg-rojo-suave cursor-pointer">
                    Conocer cómo funciona
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => goToCatalog('Whisky')} className="px-7 py-3.5 bg-rojo text-white rounded-md text-[15px] font-black tbs-shadow hover:bg-rojo-oscuro transition-colors flex items-center gap-2 cursor-pointer">
                    Entrar al catálogo <ArrowRight size={18} />
                  </button>
                  <button onClick={handleGoReorder} className="px-7 py-3.5 border border-[#C83A3A] bg-white text-rojo rounded-md text-[15px] font-black hover:bg-rojo-suave cursor-pointer">
                    Reordenar pedido
                  </button>
                </>
              )}
            </div>

            <div className="mt-[38px] flex flex-nowrap items-center gap-x-8 text-[13px] text-texto-sec font-black uppercase tracking-wider overflow-x-auto whitespace-nowrap hide-scrollbar">
              {[
                { icon: Users, text: 'Precios por cliente' },
                { icon: Briefcase, text: 'Crédito B2B' },
                { icon: Truck, text: 'Entregas rápidas' },
                { icon: Headset, text: 'Soporte experto' }
              ].map((item, i) => (
                <span key={i} className="flex items-center gap-2">
                  <item.icon size={18} className="text-[#A90000]" />
                  {item.text}
                </span>
              ))}
            </div>
          </div>

          <div className="flex-1 min-h-[360px] relative flex items-center justify-center p-8">
            <motion.div 
               animate={{ y: [0, -10, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="relative w-full max-w-md aspect-square flex items-center justify-center"
            >
              {/* Illustration Components */}
              <div className="absolute right-[60px] top-[34px] w-16 h-[170px] border-4 border-[#2D333B] bg-white rounded-t-[32px] z-10">
                <div className="absolute -top-[48px] left-[15px] w-[30px] h-12 border-4 border-[#2D333B] bg-white"></div>
                <div className="absolute -top-[68px] left-[3px] w-[52px] h-7 border-2 border-[#2D333B] bg-white"></div>
                <div className="absolute left-6 top-12 w-0.5 h-20 bg-rojo"></div>
              </div>
              <div className="absolute left-[65px] bottom-[68px] w-28 h-20 border-4 border-[#2D333B] bg-white z-20">
                <div className="absolute -left-10 -top-2 w-9 h-11 border-l-4 border-b-4 border-[#2D333B]"></div>
              </div>
              <div className="relative w-[250px] h-[145px] mt-20 border-4 border-[#2D333B] bg-white shadow-sm z-0
                after:content-[''] after:absolute after:-right-[52px] after:-top-[22px] after:w-[50px] after:h-[145px] after:-skew-y-[25deg] after:border-4 after:border-l-0 after:border-[#2D333B] after:bg-white
                before:content-[''] before:absolute before:left-0 before:-top-[48px] before:w-full before:h-12 before:-skew-x-[35deg] before:border-4 before:border-b-0 before:border-[#2D333B] before:bg-white">
                <div className="absolute right-[52px] top-9 text-[54px] font-light text-rojo">↑</div>
              </div>
            </motion.div>
          </div>

          <AnimatePresence>
            {isCliente && (
              <motion.aside 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="w-full lg:w-[250px] flex-shrink-0 border border-[#E8EAEE] rounded-2xl bg-white p-5 panel-shadow self-start mt-3"
              >
                <div className="flex flex-col mb-4">
                  <h3 className="text-base font-black whitespace-nowrap leading-tight">Tu operación hoy</h3>
                  <button onClick={handleGoReorder} className="w-fit text-[10px] font-black text-rojo hover:underline uppercase tracking-wider cursor-pointer mt-1">Reordenar →</button>
                </div>

            {[
              { icon: Truck, val: '2', label: 'Pedidos en tránsito', link: 'Ver seguimiento →', onClick: handleGoOrdersTracking },
              { icon: FileText, val: '4', label: 'Facturas pendientes', link: 'Ver cartera →', onClick: handleGoPayments },
              { icon: CreditCard, val: '$ 3.250.000', label: 'Cupo disponible', link: 'Ver detalles →', onClick: handleGoPayments }
            ].map((ind, i) => (
              <div key={i} className="border border-[#E8EAEE] rounded-lg p-3.5 mb-3 transition-colors hover:border-rojo/30">
                <div className="flex gap-3 items-start">
                  <ind.icon size={20} className="text-gris" />
                  <div>
                    <div className="text-2xl font-black text-texto leading-none">{ind.val}</div>
                    <div className="mt-1 text-[12px] font-bold text-texto-sec">{ind.label}</div>
                    <button 
                      onClick={ind.onClick}
                      className="inline-block mt-1 text-rojo text-[12px] font-black hover:underline bg-transparent border-none p-0 cursor-pointer"
                    >
                      {ind.link}
                    </button>
                  </div>
                </div>
              </div>
            ))}

                <div className="flex items-center gap-3 mt-[18px] pt-4 border-t border-[#EEF0F3]">
                  <div className="w-[42px] h-[42px] rounded-full bg-gradient-to-br from-[#E7B19C] to-[#89513A] overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&auto=format&fit=crop" alt="Laura Gómez" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-[13px] leading-snug flex-1">
                    <div className="text-gris">Asesor asignado</div>
                    <strong className="font-bold block">Laura Gómez</strong>
                    <div className="flex items-center justify-between">
                      <span className="text-gris">317 123 4567</span>
                      <button 
                        onClick={() => handleGoAdvisorChat()}
                        className="text-rojo font-black text-[10px] uppercase hover:underline cursor-pointer"
                      >
                        Chat →
                      </button>
                    </div>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Accesos Rápidos */}
      <section className="py-10">
        <div className="max-w-[1480px] mx-auto px-8">
          <h2 className="text-3xl font-black tracking-tighter">Accesos rápidos</h2>
          <p className="mt-1 text-sm font-bold text-gris">
            {!isCliente ? 'Todo lo que necesitas para conocer nuestra plataforma.' : 'Todo lo que necesitas para operar tu negocio en un solo lugar.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 mt-6">
            {!isCliente ? (
              <>
                <QuickAccessCard icon={ShoppingCart} title="Catálogo B2B" desc="Explora productos por categoría y marca." onClick={() => goToCatalog(null)} />
                <QuickAccessCard icon={ClipboardList} title="Cómo funciona" desc="Descubre cómo TBS ayuda a tu negocio." />
                <QuickAccessCard icon={Users} title="Clientes B2B" desc="Soluciones para bares, hoteles y más." />
                <QuickAccessCard icon={Package} title="Proveedores" desc="Conecta tu marca con miles de clientes." />
                <QuickAccessCard icon={Truck} title="Logística" desc="Entregas confiables en todo el país." />
                <QuickAccessCard icon={Headset} title="Soporte" desc="Un asesor experto te acompaña siempre." />
              </>
            ) : (
              <>
                <QuickAccessCard onClick={() => goToCatalog(null)} icon={ShoppingCart} title="Catálogo B2B" desc="Explora productos y disponibilidad." />
                <QuickAccessCard onClick={handleGoReorder} icon={ClipboardList} title="Reordenar" desc="Repite tus pedidos anteriores en segundos." />
                <QuickAccessCard onClick={handleGoPayments} icon={CreditCard} title="Cartera y pagos" desc="Consulta facturas, vencimientos y cupo." />
                <QuickAccessCard onClick={handleGoOrdersTracking} icon={Truck} title="Seguimiento" desc="Rastrea tus pedidos en tiempo real." />
                <QuickAccessCard onClick={handleGoUrgentOrder} icon={Zap} title="Pedido urgente" desc="Abastecimiento para operación inmediata." />
                <QuickAccessCard onClick={() => handleGoAdvisorChat()} icon={UserIcon} title="Mi asesor" desc="Soporte comercial especializado." />
              </>
            )}
          </div>
        </div>
      </section>

      {/* Segmentos */}
      <section className="py-5">
        <div className="max-w-[1480px] mx-auto px-8">
          <h2 className="mb-6.5 text-[25px] font-black tracking-tight">Diseñado para quienes operan el mercado real de licores</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 border border-borde rounded-lg bg-white overflow-hidden">
            <SegmentCard icon={Store} title="Bares y restaurantes" desc="Abastecimiento recurrente y soporte en carta." />
            <SegmentCard icon={Building2} title="Hoteles y clubes" desc="Portafolio confiable y entregas programadas." />
            <SegmentCard icon={Package} title="Licoreras y supers" desc="Compra por volumen y promociones." />
            <SegmentCard icon={Music} title="Discotecas y eventos" desc="Respuesta rápida y productos de alta rotación." />
            <SegmentCard icon={Briefcase} title="Marcas y proveedores" desc="Ejecución comercial y visibilidad de canal." />
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="py-8">
        <div className="max-w-[1480px] mx-auto px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 rounded-2xl p-8 lg:px-10 bg-gradient-to-r from-[#FFF1F1] to-[#FFF9F9]">
            <div className="flex items-center gap-8 group">
              <div className="hidden sm:flex w-[130px] h-[110px] items-center justify-center border-2 border-[#D7B4B4] rounded-[18px] bg-white -rotate-6 text-rojo shrink-0 transition-transform group-hover:rotate-0">
                <Truck size={68} strokeWidth={1.2} />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-black leading-tight tracking-tight max-w-[700px]">
                  {!isCliente ? 'Empieza a operar tus compras desde una plataforma B2B.' : 'Sigue operando con más control y mejores resultados.'}
                </h2>
                <p className="mt-3 text-sm sm:text-base font-bold text-texto-sec">
                  {!isCliente ? 'Solicita tu acceso B2B hoy y un asesor se contactará contigo.' : 'Compra, paga, repite y recibe con TBS.'}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
               {!isCliente ? (
                 <>
                   <button onClick={() => openAuth('request')} className="px-7 py-3.5 bg-rojo text-white rounded-md text-[15px] font-black tbs-shadow hover:bg-rojo-oscuro transition-colors cursor-pointer">Solicitar acceso B2B →</button>
                                       <button onClick={() => handleGoAdvisorChat()} className="px-7 py-3.5 border border-[#C83A3A] bg-white text-rojo rounded-md text-[15px] font-black hover:bg-rojo-suave cursor-pointer">Hablar con asesor</button>
                 </>
               ) : (
                 <>
                   <button onClick={() => goToCatalog('Whisky')} className="px-7 py-3.5 bg-rojo text-white rounded-md text-[15px] font-black tbs-shadow hover:bg-rojo-oscuro transition-colors cursor-pointer">Entrar al catálogo →</button>
                                       <button onClick={() => handleGoAdvisorChat()} className="px-7 py-3.5 border border-[#C83A3A] bg-white text-rojo rounded-md text-[15px] font-black hover:bg-rojo-suave cursor-pointer">Hablar con mi asesor</button>
                 </>
               )}
            </div>
          </div>
        </div>
      </section>

      {/* Ventajas */}
      <section className="max-w-[1480px] mx-auto px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 pb-10">
        <PerkCard icon={Users} title="Compra unificada" desc="Miles de productos en un solo canal." />
        <PerkCard icon={FileText} title="Pagos y cartera" desc="Control total y pago seguro." />
        <PerkCard icon={Truck} title="Trazabilidad" desc="Seguimiento en tiempo real." />
        <PerkCard icon={Package} title="Confianza" desc="Transacciones seguras." />
        <PerkCard icon={MapPin} title="Cobertura" desc="Principales ciudades de Colombia." />
      </section>
    </motion.div>
  )}
</AnimatePresence>

      <footer className="border-t border-[#EFEFEF] bg-white text-center py-6 px-8 text-gris text-sm font-bold">
        TBS Destilados · Plataforma B2B de abastecimiento para negocios
      </footer>

      {/* Login Modal */}
      <LoginModal 
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLogin={setCurrentUser}
        onRequestAccess={() => openAuth('request')}
      />

      <AuthModal 
        isOpen={authModal.open} 
        onClose={() => setAuthModal({ ...authModal, open: false })} 
        type={authModal.type}
        initialRole={authModal.role}
      />

      <AnimatePresence>
        {isNotificationsOpen && currentUser && (
          <NotificationsPanel 
            notifications={notifications}
            onClose={() => setIsNotificationsOpen(false)}
            onMarkAsRead={handleMarkNotificationAsRead}
            onMarkAllAsRead={handleMarkAllNotificationsAsRead}
            onDeleteNotification={handleDeleteNotification}
            onGoToNotification={handleGoToNotification}
            onGoNotificationsPage={handleGoNotificationsPage}
          />
        )}
      </AnimatePresence>

      <CartDrawer
        isOpen={isCartOpen}
        currentUser={currentUser}
        items={cartItems}
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleOpenCheckout}
        onRequestAccess={() => openAuth('request')}
        onIncrement={handleIncrementCartItem}
        onDecrement={handleDecrementCartItem}
        onRemove={handleRemoveCartItem}
        onClear={handleClearCart}
        onGoToCatalog={() => { goToCatalog(null); setIsCartOpen(false); }}
      />
    </div>
  );
}

function QuickAccessCard({ icon: Icon, title, desc, onClick }: { icon: any, title: string, desc: string, onClick?: () => void }) {
  return (
    <article onClick={onClick} className="min-h-[205px] flex flex-col border border-borde rounded-lg bg-white p-[26px] tarjeta-hover cursor-pointer group transition-all">
      <Icon size={45} strokeWidth={1.6} className="text-[#C21D1D]" />
      <h3 className="mt-[22px] text-base font-black text-texto">{title}</h3>
      <p className="flex-1 mt-3 text-texto-sec text-sm leading-relaxed font-semibold">{desc}</p>
      <div className="mt-[18px] text-rojo text-[26px] font-light group-hover:translate-x-1 transition-transform">→</div>
    </article>
  );
}

function SegmentCard({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <article className="p-7 border-b lg:border-b-0 lg:border-r border-borde last:border-0 hover:bg-rojo-suave/30 transition-colors">
      <Icon size={47} strokeWidth={1.4} className="text-[#374151] mb-4" />
      <h3 className="text-lg font-black text-texto leading-none max-w-[170px]">{title}</h3>
      <p className="mt-3 text-sm text-texto-sec leading-relaxed font-semibold">{desc}</p>
    </article>
  );
}

function PerkCard({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="flex gap-3.5 bg-white rounded-lg p-5">
      <Icon size={34} strokeWidth={1.5} className="text-[#C21D1D] shrink-0" />
      <div>
        <h3 className="text-base font-black text-texto leading-none">{title}</h3>
        <p className="mt-1 text-sm text-texto-sec font-semibold leading-tight">{desc}</p>
      </div>
    </div>
  );
}
