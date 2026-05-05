/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useCallback } from 'react';
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
  MessageSquare,
  Star,
  Tag,
  BarChart3,
  ShieldCheck,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CartItem, 
  ViewMode, 
  Product, 
  User, 
  ActivePage, 
  TBSNotification, 
  ShoppingList, 
  B2BPromotion,
  B2BCompanyAccount,
  B2BUserActivity,
  PermissionKey,
  PendingApprovalOrder,
  LegalPageKey,
  HospitalityCommission,
  ProviderPriceImportBatch
} from './types';
import { 
  PRODUCTS, 
  BRAND_AD_CAMPAIGNS,
  CAMPAIGN_PAGES,
  NOTIFICATIONS, 
  SHOPPING_LISTS, 
  B2B_PROMOTIONS,
  CUSTOMER_INTELLIGENCE_SUMMARY,
  MONTHLY_PURCHASE_METRICS,
  CATEGORY_CONSUMPTION,
  TOP_PURCHASED_PRODUCTS,
  CUSTOMER_INSIGHTS,
  PROVIDER_PRODUCTS,
  PROVIDER_SALES_METRICS,
  PROVIDER_CHANNEL_METRICS,
  PROVIDER_CITY_METRICS,
  PROVIDER_CAMPAIGNS,
  PROVIDER_SETTLEMENTS,
  PROVIDER_INSIGHTS,
  B2B_COMPANY_ACCOUNT,
  B2B_PERMISSIONS,
  PENDING_APPROVAL_ORDERS,
  FAQ_ITEMS,
  HOSPITALITY_PARTNER_PROFILES,
  MANAGED_CLIENTS,
  MANAGED_EVENTS,
  HOSPITALITY_COMMISSIONS,
  HOSPITALITY_COMMISSION_RULES,
  PROVIDER_PRICE_IMPORT_BATCHES
} from './data';
import { LEGAL_PAGES } from './data/legalData';
import { BLOG_ARTICLES } from './data/blogData';
import { BUSINESS_CONTACT_INFO, CONTACT_CHANNELS } from './data/contactData';
import { ANALYTICS_CONFIG } from './data/analyticsConfig';
import { useAnalytics } from './hooks/useAnalytics';
import { getAnalyticsUserRole } from './services/analytics';

import { FAQPage } from './components/FAQPage';
import { PackagingSelectorModal } from './components/PackagingSelectorModal';
import { CategoryPage } from './components/CategoryPage';
import { AboutPage } from './components/AboutPage';
import { ClientsPage } from './components/ClientsPage';
import { ProvidersPage } from './components/ProvidersPage';
import { ServicesPage } from './components/ServicesPage';
import { AccessRequestPage } from './components/AccessRequestPage';
import { BlogIndexPage } from './components/BlogIndexPage';
import { BlogArticlePage } from './components/BlogArticlePage';
import ContactPage from './components/ContactPage';
import { AuthModal } from './components/AuthModal';
import { LoginModal } from './components/LoginModal';
import { PaymentsPage } from './components/PaymentsPage';
import { OrdersTrackingPage } from './components/OrdersTrackingPage';
import { ReorderPage } from './components/ReorderPage';
import { UrgentOrderPage } from './components/UrgentOrderPage';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutPage } from './components/CheckoutPage';
import { ShoppingListsPage } from './components/ShoppingListsPage';
import { PromotionsPage } from './components/PromotionsPage';
import { IntelligencePage } from './components/IntelligencePage';
import { ProviderDashboardPage } from './components/ProviderDashboardPage';
import { AdvertisingPage } from './components/AdvertisingPage';
import { HospitalityPartnerDashboardPage } from './components/HospitalityPartnerDashboardPage';
import { HospitalityPartnersPage } from './components/HospitalityPartnersPage';
import { B2BAccountAdminPage } from './components/B2BAccountAdminPage';
import OrderApprovalsPage from './components/OrderApprovalsPage';

import { TrustPage } from './components/trust/TrustPage';
import { PublicLandingPage } from './components/PublicLandingPage';
import { AuthenticatedHome } from './components/AuthenticatedHome';
import { PUBLIC_LANDINGS } from './data/publicLandingData';

import { AccountDashboardPage } from './components/AccountDashboardPage';
import AdvisorChatPage from './components/AdvisorChatPage';
import { NotificationsPanel } from './components/NotificationsPanel';
import { NotificationsPage } from './components/NotificationsPage';
import { LegalIndexPage } from './components/legal/LegalIndexPage';
import { LegalPage } from './components/legal/LegalPage';
import { CookieConsentBanner } from './components/legal/CookieConsentBanner';
import { AgeGateNotice } from './components/legal/AgeGateNotice';

import { SEOHead } from './components/SEOHead';
import { PublicFooter } from './components/PublicFooter';
import { Breadcrumbs } from './components/Breadcrumbs';
import { PUBLIC_PAGE_SEO } from './data/seoData';
import { 
  buildOrganizationSchema, 
  buildWebsiteSchema, 
  buildBreadcrumbSchema, 
  buildFAQSchema,
  buildServiceSchema,
  buildCatalogSchema,
  buildLocalBusinessSchema
} from './data/schemaData';

import { CreditRequestPage } from './components/CreditRequestPage';
import { CREDIT_REQUESTS } from './data';
import { CreditRequest } from './types';

import { AdSlot } from './components/advertising/AdSlot';
import { CampaignPage } from './components/advertising/CampaignPage';
import { BrandAdCampaign } from './types';

// Helpers for customer conditions
import { MobileMenuDrawer } from './components/MobileMenuDrawer';
import { FloatingActionButton } from './components/ui';

export function isCashCustomer(user: User | null) {
  return user?.role === 'cliente_b2b' && user?.commercialCondition === 'contado';
}

export function isCreditCustomer(user: User | null) {
  return user?.role === 'cliente_b2b' && user?.commercialCondition !== 'contado';
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [providerDashboardTab, setProviderDashboardTab] = useState<'overview' | 'products' | 'campaigns' | 'settlements' | 'reports'>('overview');
  const [activeLegalPageKey, setActiveLegalPageKey] = useState<LegalPageKey | null>(null);
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
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<TBSNotification[]>(NOTIFICATIONS);

  const [activeArticleSlug, setActiveArticleSlug] = useState<string | null>(null);
  const [activeCampaignSlug, setActiveCampaignSlug] = useState<string | null>(null);
  const [activeLandingKey, setActiveLandingKey] = useState<string | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>(SHOPPING_LISTS);
  const [creditRequests, setCreditRequests] = useState<CreditRequest[]>(CREDIT_REQUESTS);
  const [promotions] = useState<B2BPromotion[]>(B2B_PROMOTIONS);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [companyAccount, setCompanyAccount] = useState<B2BCompanyAccount>(B2B_COMPANY_ACCOUNT);
  const [approvalOrders, setApprovalOrders] = useState<PendingApprovalOrder[]>(PENDING_APPROVAL_ORDERS);
  
  // Hospitality Partner State
  const [managedClients, setManagedClients] = useState(MANAGED_CLIENTS);
  const [managedEvents, setManagedEvents] = useState(MANAGED_EVENTS);
  const [hospitalityCommissions, setHospitalityCommissions] = useState(HOSPITALITY_COMMISSIONS);
  const [hospitalityPurchaseContext, setHospitalityPurchaseContext] = useState<{
    partnerId: string;
    managedClientId: string;
    managedEventId?: string;
    billingType: any;
  } | null>(null);

  const [permissionErrorModal, setPermissionErrorModal] = useState<{ open: boolean; permission?: string } | null>(null);

  const [packagingModalProduct, setPackagingModalProduct] = useState<Product | null>(null);
  const [pendingCartSource, setPendingCartSource] = useState<string>('catalog');

  const analytics = useAnalytics(currentUser);
  const isCliente = !!currentUser;
  const isProveedor = currentUser?.role === 'proveedor';
  const isMarca = currentUser?.role === 'marca';
  const isHospitalityPartner = currentUser?.role === 'hospitality_partner';

  // Track page views
  // Scroll to top on page change
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [activePage]);

  React.useEffect(() => {
    analytics.trackPageView(activePage, activePage === 'blogArticle' ? activeArticleSlug || '' : activePage, {
      userRole: getAnalyticsUserRole(currentUser)
    });
  }, [activePage, activeArticleSlug, currentUser, analytics]);

  const getSEOContent = () => {
    switch (activePage) {
      case 'home':
        return {
          ...PUBLIC_PAGE_SEO.home,
          jsonLd: [buildOrganizationSchema(), buildWebsiteSchema(), buildLocalBusinessSchema()]
        };
      case 'advertising':
        return {
          title: "Publicidad B2B en TBS - Retail Media para Marcas",
          description: "Descubre cómo potenciar tu marca y aumentar tus ventas en el canal profesional con las soluciones de publicidad segmentada de TBS.",
          canonicalPath: "/publicidad",
          jsonLd: [buildOrganizationSchema(), buildServiceSchema()]
        };
      case 'hospitalityPartners':
        return {
          title: "Aliados Hospitality y Wedding Planners | TBS B2B",
          description: "Gestiona las compras de licores para tus eventos de forma profesional. Wedding planners, concierges y administradores de villas.",
          canonicalPath: "/aliados-hospitality",
          jsonLd: [buildOrganizationSchema(), buildServiceSchema()]
        };
      case 'about':
        return {
          ...PUBLIC_PAGE_SEO.about,
          jsonLd: [
            buildBreadcrumbSchema([{ label: 'Qué es TBS', url: '/que-es-tbs' }]),
            buildOrganizationSchema()
          ]
        };
      case 'clients':
        return {
          ...PUBLIC_PAGE_SEO.clients,
          jsonLd: [
            buildBreadcrumbSchema([{ label: 'Clientes B2B', url: '/clientes-b2b' }]),
            buildOrganizationSchema()
          ]
        };
      case 'providers':
        return {
          ...PUBLIC_PAGE_SEO.providers,
          jsonLd: [
            buildBreadcrumbSchema([{ label: 'Marcas', url: '/proveedores-y-marcas' }]),
            buildOrganizationSchema()
          ]
        };
      case 'services':
        return {
          ...PUBLIC_PAGE_SEO.services,
          jsonLd: [
            buildServiceSchema(), 
            buildBreadcrumbSchema([{ label: 'Servicios TBS', url: '/servicios-tbs' }]),
            buildOrganizationSchema()
          ]
        };
      case 'catalog':
        return {
          ...PUBLIC_PAGE_SEO.catalog,
          jsonLd: [
            buildBreadcrumbSchema([{ label: 'Catálogo público', url: '/catalogo' }]),
            buildCatalogSchema(PRODUCTS.slice(0, 10))
          ]
        };
      case 'faq':
        return {
          ...PUBLIC_PAGE_SEO.faq,
          jsonLd: [
            buildFAQSchema(FAQ_ITEMS),
            buildLocalBusinessSchema(),
            buildBreadcrumbSchema([{ label: 'Centro de ayuda', url: '/ayuda' }])
          ]
        };
      case 'request-access':
        return {
          ...PUBLIC_PAGE_SEO.accessRequest,
          jsonLd: [
            buildBreadcrumbSchema([{ label: 'Solicitar acceso B2B', url: '/solicitar-acceso' }]),
            buildLocalBusinessSchema()
          ]
        };
      case 'blogIndex':
        return {
          title: "Guías y recursos B2B | TBS Destilados",
          description: "Guías sobre abastecimiento B2B, licores para restaurantes, eventos, regalos empresariales, maridaje, coctelería y marcas.",
          canonicalPath: "/guias",
          jsonLd: [
            buildBreadcrumbSchema([{ label: 'Guías y recursos', url: '/guias' }]),
            buildOrganizationSchema()
          ]
        };
      case 'blogArticle': {
        const article = BLOG_ARTICLES.find(a => a.slug === activeArticleSlug);
        if (!article) return { title: 'TBS', description: '', canonicalPath: '/guias', jsonLd: [] };
        return {
          title: article.seoTitle,
          description: article.seoDescription,
          canonicalPath: article.slug,
          jsonLd: [] // Managed inside BlogArticlePage.tsx but included here for consistency if needed
        };
      }
      case 'contact':
        return {
          title: 'Contacto y ubicación | TBS Destilados Cartagena',
          description: 'Contacta a TBS Destilados en Cartagena. Información para clientes B2B, proveedores, marcas, soporte y solicitudes de acceso.',
          canonicalPath: '/contacto',
          jsonLd: [
            buildLocalBusinessSchema(),
            buildBreadcrumbSchema([{ label: 'Contacto y ubicación', url: '/contacto' }])
          ]
        };
      default:
        return {
          ...PUBLIC_PAGE_SEO.home,
          jsonLd: []
        };
    }
  };

  const seo = getSEOContent();
  const isPublicPage = ['home', 'about', 'clients', 'providers', 'services', 'catalog', 'faq', 'request-access', 'blogIndex', 'blogArticle', 'contact', 'legalIndex', 'legalPage', 'hospitalityPartners'].includes(activePage);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleGoHospitalityPartners = () => {
    setActiveMenu(null);
    setIsCheckoutOpen(false);
    window.scrollTo(0, 0);
    setActivePage('hospitalityPartners');
  };

  const handleGoHospitalityDashboard = () => {
    if (!currentUser) {
      setLoginModalOpen(true);
      return;
    }
    setActiveMenu(null);
    setIsCheckoutOpen(false);
    window.scrollTo(0, 0);
    setActivePage('hospitalityPartnerDashboard');
  };

  const handleCreateManagedClient = (client: any) => {
    setManagedClients(prev => [client, ...prev]);
    handleCreateNotification({
      type: "comercial",
      title: "Solicitud de cliente creada",
      message: `El cliente ${client.businessName} quedó pendiente de validación por TBS.`,
      priority: "media",
      actionLabel: "Ver Panel",
      actionTarget: "hospitalityPartnerDashboard"
    });
    
    analytics.track('managed_client_created', 'engagement', {
      metadata: {
        clientType: client.clientType,
        billingType: client.billingType,
        city: client.city
      }
    });
  };

  const handleCreateManagedEvent = (event: any) => {
    setManagedEvents(prev => [event, ...prev]);
    handleCreateNotification({
      type: "pedido",
      title: "Evento creado",
      message: `El evento ${event.eventName} quedó disponible para programar compras.`,
      priority: "media",
      actionLabel: "Ver Panel",
      actionTarget: "hospitalityPartnerDashboard"
    });
    
    analytics.track('managed_event_created', 'engagement', {
      metadata: {
        eventType: event.eventType,
        city: event.city
      }
    });
  };

  const handleStartPurchaseForManagedClient = (clientId: string, eventId?: string, billingType?: any) => {
    const client = managedClients.find(c => c.id === clientId);
    if (!client) return;

    setHospitalityPurchaseContext({
      partnerId: currentUser?.hospitalityPartnerId || '',
      managedClientId: clientId,
      managedEventId: eventId,
      billingType: billingType || client.billingType
    });
    
    analytics.track('managed_client_purchase_started', 'checkout', {
      metadata: {
        billingType: billingType || client.billingType,
        clientStatus: client.status,
        hasEvent: !!eventId
      }
    });
    
    goToCatalog();
  };

  const handleClearHospitalityPurchaseContext = () => {
    setHospitalityPurchaseContext(null);
    analytics.track('cta_click', 'navigation', { ctaLabel: 'Cancelar compra gestionada' });
  };

  const handleUpdateCartItemComment = (productId: number, comment: string) => {
    setCartItems(prev => prev.map(item => 
      item.product.id === productId ? { ...item, lineComment: comment } : item
    ));
  };

  const handleReplaceCartItemWithSubstitute = (productId: number, substituteId: number) => {
    const substituteProduct = PRODUCTS.find(p => p.id === substituteId);
    if (!substituteProduct) return;

    setCartItems(prev => {
      const originalItem = prev.find(item => item.product.id === productId);
      if (!originalItem) return prev;

      // Create new item for substitute, using same quantity if possible
      const newItem: CartItem = {
        ...originalItem,
        product: substituteProduct,
        packaging: substituteProduct.packagingOptions?.[0], // Pick default or first packaging
        isConfirmed: true
      };

      return prev.map(item => item.product.id === productId ? newItem : item);
    });
  };

  const currentPartnerProfile = HOSPITALITY_PARTNER_PROFILES.find(p => p.userId === currentUser?.id) || HOSPITALITY_PARTNER_PROFILES[0];

  const handleUpdateApprovalOrder = (orderId: string, updates: Partial<PendingApprovalOrder>) => {
    setApprovalOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...updates } : o));
  };

  const handleCreatePendingApprovalOrder = (order: PendingApprovalOrder) => {
    setApprovalOrders(prev => [order, ...prev]);
    // Create activity
    handleCreateActivity({
      userId: currentUser?.name || 'Sistema',
      userName: currentUser?.name || 'Sistema',
      action: 'Creación de pedido pendiente',
      detail: `Pedido ${order.orderNumber} enviado a aprobación por monto de ${order.total.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })}`,
      date: "Hoy",
      module: 'pedidos'
    });
    // Create notification for approvers
    handleCreateNotification({
      type: 'pedido',
      title: 'Nuevo pedido pendiente de aprobación',
      message: `El pedido ${order.orderNumber} por ${order.total.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })} requiere tu revisión.`,
      priority: 'alta',
      actionLabel: 'Ver pedido',
      actionTarget: 'orderApprovals',
      context: { entityType: 'pedido', value: order.id }
    });
  };

  const handleGoOrderApprovals = () => {
    if (!currentUser) {
      setLoginModalOpen(true);
      return;
    }
    setIsCheckoutOpen(false);
    window.scrollTo(0, 0);
    setActivePage('orderApprovals');
  };

  const handleGoFAQ = () => {
    setIsNotificationsOpen(false);
    setActiveMenu(null);
    setIsCheckoutOpen(false);
    window.scrollTo(0, 0);
    setActivePage('faq');
    analytics.track('faq_viewed', 'faq', { source: 'navigation' });
  };

  const handleGoBlog = () => {
    setIsNotificationsOpen(false);
    setActiveMenu(null);
    setIsCheckoutOpen(false);
    setActiveArticleSlug(null);
    window.scrollTo(0, 0);
    setActivePage('blogIndex');
    analytics.track('blog_index_viewed', 'blog', { source: 'navigation' });
  };

  const handleGoContact = () => {
    setIsNotificationsOpen(false);
    setActiveMenu(null);
    setIsCheckoutOpen(false);
    window.scrollTo(0, 0);
    setActivePage('contact');
    analytics.track('contact_viewed', 'contact', { source: 'navigation' });
  };

  const handleGoArticle = (slug: string) => {
    setIsNotificationsOpen(false);
    setActiveMenu(null);
    setIsCheckoutOpen(false);
    setActiveArticleSlug(slug);
    window.scrollTo(0, 0);
    setActivePage('blogArticle');
    analytics.track('blog_article_viewed', 'blog', { articleSlug: slug });
  };

  const handleGoCampaignPage = (slug: string) => {
    setIsNotificationsOpen(false);
    setActiveMenu(null);
    setIsCheckoutOpen(false);
    setActiveCampaignSlug(slug);
    window.scrollTo(0, 0);
    setActivePage('campaignPage');
    analytics.track('campaign_page_viewed', 'advertising', { campaignSlug: slug });
  };

  const handleAdClick = (campaign: BrandAdCampaign) => {
    analytics.track('ad_click', 'advertising', { 
      source: campaign.placement,
      target: campaign.ctaTarget,
      metadata: {
        campaignId: campaign.id,
        brandName: campaign.brandName,
        format: campaign.format
      }
    });

    if (campaign.ctaTarget === 'campaignPage' && campaign.campaignSlug) {
      handleGoCampaignPage(campaign.campaignSlug);
      return;
    }

    if (campaign.ctaTarget === 'catalog') {
      setActivePage('catalog');
      setSelectedCategory(null);
      window.scrollTo(0, 0);
      return;
    }

    if (campaign.ctaTarget === 'category' && campaign.category) {
      setSelectedCategory(campaign.category);
      setActivePage('catalog');
      window.scrollTo(0, 0);
      return;
    }

    if (campaign.ctaTarget === 'product' && campaign.productId) {
      const product = PRODUCTS.find(p => p.id === campaign.productId);
      if (product) {
        setPackagingModalProduct(product);
      }
      return;
    }

    if (campaign.ctaTarget === 'promotions') {
      handleGoPromotions();
      return;
    }

    if (campaign.ctaTarget === 'advisorChat') {
      if (currentUser) {
        handleGoAdvisorChat('activacion', { label: 'Campaña: ' + campaign.brandName, value: campaign.campaignName });
      } else {
        handleGoAccessRequest('client');
      }
      return;
    }

    if (campaign.ctaTarget === 'accessRequestProvider') {
      handleGoAccessRequest('provider');
      return;
    }

    if (campaign.ctaTarget === 'blogArticle' && campaign.brandName.toLowerCase().includes('tequila')) {
      // Small logic for the editorial ad
      const tequilaArt = BLOG_ARTICLES.find(a => a.category === 'guias_producto' && a.title.toLowerCase().includes('tequila'));
      if (tequilaArt) {
        handleGoArticle(tequilaArt.slug);
      } else {
        handleGoBlog();
      }
      return;
    }
  };

  const handleGoAccessRequest = (role: 'client' | 'provider' = 'client') => {
    setRequestAccessRole(role);
    setActiveMenu(null);
    setLoginModalOpen(false);
    window.scrollTo(0, 0);
    setActivePage('request-access');
    analytics.track('access_request_started', 'public_acquisition', { 
      source: 'navigation',
      metadata: { requestedRole: role }
    });
  };

  const handleGoLegalIndex = () => {
    setActiveMenu(null);
    setLoginModalOpen(false);
    setIsNotificationsOpen(false);
    setIsCartOpen(false);
    window.scrollTo(0, 0);
    setActivePage('legalIndex');
  };

  const handleGoLegalPage = (key: LegalPageKey) => {
    setActiveLegalPageKey(key);
    setActiveMenu(null);
    setLoginModalOpen(false);
    setIsNotificationsOpen(false);
    setIsCartOpen(false);
    window.scrollTo(0, 0);
    setActivePage('legalPage');
  };

  const handleGoCookiePolicy = () => {
    handleGoLegalPage('cookies');
  };

  const handleGoPublicLanding = (key: string) => {
    setActiveLandingKey(key);
    setActiveMenu(null);
    setLoginModalOpen(false);
    setIsNotificationsOpen(false);
    setIsCartOpen(false);
    window.scrollTo(0, 0);
    setActivePage('publicLanding');
  };

  const handleGoTrust = () => {
    setActiveMenu(null);
    setLoginModalOpen(false);
    setIsNotificationsOpen(false);
    setIsCartOpen(false);
    window.scrollTo(0, 0);
    setActivePage('trust');
  };

  const simulatedHumberto: User = {
    id: "user-001",
    name: "Humberto",
    email: "humberto@example.com",
    businessName: "Restaurante Demo",
    role: "cliente_b2b",
    accountRole: "master",
    permissions: [
      "ver_catalogo",
      "crear_pedidos",
      "aprobar_pedidos",
      "ver_pedidos",
      "ver_cartera",
      "pagar_facturas",
      "ver_pagos",
      "pedido_urgente",
      "reordenar",
      "gestionar_listas",
      "ver_promociones",
      "ver_inteligencia",
      "hablar_asesor",
      "gestionar_usuarios",
      "gestionar_sucursales",
      "configurar_aprobaciones"
    ],
    city: "Nacional",
    address: "Cobertura Nacional",
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
    let filtered = PRODUCTS;
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) ||
        p.specs.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }
    return filtered;
  }, [selectedCategory, searchQuery]);

  const handleSearchTrigger = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearchQuery(searchInput);
    setActivePage('catalog');
    // If searching globally, we might want to clear category, 
    // but often users search within a category if they are already there.
    // For now, let's keep it global and clear category if not on catalog page.
    if (activePage !== 'catalog') {
      setSelectedCategory(null);
    }
  };

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    handleRequestAddToCart(product, 'catalog');
  };

  const handleRequestAddToCart = (product: Product, source = 'catalog') => {
    if (!hasPermission('crear_pedidos')) {
      handlePermissionRestricted('crear_pedidos');
      return;
    }

    const options = product.packagingOptions || [];
    const availableOptions = options.filter(option => option.available);

    if (availableOptions.length === 0) {
      const price = Number(product.price.replace(/[^0-9.-]+/g, ""));
      const fallbackPackaging: any = {
        id: `pkg-${product.id}-unit`,
        label: product.specs || 'Unidad',
        unitsPerPackage: 1,
        pricePerUnit: price,
        packagePrice: price,
        available: true,
        stockLabel: 'Disponible',
        isDefault: true
      };
      handleConfirmAddToCart(product, fallbackPackaging, 1, source);
      return;
    }

    setPendingCartSource(source);
    setPackagingModalProduct(product);
    
    analytics.track('packaging_selector_opened', 'cart', {
      source,
      productId: product.id,
      productCategory: product.category
    });
  };

  const handleConfirmAddToCart = (
    product: Product, 
    packaging: any, 
    packageQuantity: number, 
    source = pendingCartSource
  ) => {
    const totalUnits = packageQuantity * packaging.unitsPerPackage;
    
    setCartItems((prev) => {
      const existing = prev.find((item) => 
        item.product.id === product.id && 
        item.packaging?.id === packaging.id
      );

      if (existing) {
        return prev.map((item) =>
          (item.product.id === product.id && item.packaging?.id === packaging.id)
            ? { 
                ...item, 
                packageQuantity: (item.packageQuantity || 0) + packageQuantity,
                totalUnits: (item.totalUnits || 0) + totalUnits,
                quantity: (item.quantity) + totalUnits
              }
            : item
        );
      }

      return [...prev, { 
        product, 
        quantity: totalUnits,
        packaging, 
        packageQuantity, 
        totalUnits 
      }];
    });

    setIsCartOpen(true);
    setPackagingModalProduct(null);
    
    analytics.track('product_added_to_cart', 'cart', {
      source,
      productId: product.id,
      productCategory: product.category,
      units: totalUnits,
      productCount: packageQuantity,
      metadata: {
        packagingLabel: packaging.label,
        unitsPerPackage: packaging.unitsPerPackage
      }
    });
  };

  const handleIncrementCartItem = (productId: number, packagingId?: string) => {
    if (!hasPermission('crear_pedidos')) {
      handlePermissionRestricted('crear_pedidos');
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.product.id === productId && (!packagingId || item.packaging?.id === packagingId)) {
          const unitsPerPkg = item.packaging?.unitsPerPackage || 1;
          const newPkgQty = (item.packageQuantity || (item.quantity / unitsPerPkg)) + 1;
          const newTotalUnits = newPkgQty * unitsPerPkg;
          return { 
            ...item, 
            packageQuantity: newPkgQty,
            totalUnits: newTotalUnits,
            quantity: newTotalUnits
          };
        }
        return item;
      })
    );
  };

  const handleDecrementCartItem = (productId: number, packagingId?: string) => {
    if (!hasPermission('crear_pedidos')) {
      handlePermissionRestricted('crear_pedidos');
      return;
    }
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId && (!packagingId || item.packaging?.id === packagingId)) {
            const unitsPerPkg = item.packaging?.unitsPerPackage || 1;
            const newPkgQty = (item.packageQuantity || (item.quantity / unitsPerPkg)) - 1;
            const newTotalUnits = newPkgQty * unitsPerPkg;
            return { 
              ...item, 
              packageQuantity: newPkgQty,
              totalUnits: newTotalUnits,
              quantity: newTotalUnits
            };
          }
          return item;
        })
        .filter((item) => (item.packageQuantity || item.quantity) > 0)
    );
  };

  const handleRemoveCartItem = (productId: number) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleOpenCheckout = () => {
    if (!hasPermission('crear_pedidos')) {
      handlePermissionRestricted('crear_pedidos');
      return;
    }
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
        const packaging = product.packagingOptions?.find(p => p.isDefault && p.available) 
          || product.packagingOptions?.find(p => p.available)
          || {
            id: `pkg-${product.id}-default`,
            label: product.specs || "Unidad",
            unitsPerPackage: 1,
            pricePerUnit: Number(product.price.replace(/[^0-9.-]+/g, "")),
            packagePrice: Number(product.price.replace(/[^0-9.-]+/g, "")),
            available: true,
            isDefault: true
          };

        const packageQuantity = quantity;
        const totalUnits = packageQuantity * (packaging as any).unitsPerPackage;

        const existingIndex = newCart.findIndex((item) => 
          item.product.id === product.id && item.packaging?.id === (packaging as any).id
        );

        if (existingIndex > -1) {
          newCart[existingIndex] = { 
            ...newCart[existingIndex], 
            packageQuantity: (newCart[existingIndex].packageQuantity || 0) + packageQuantity,
            totalUnits: (newCart[existingIndex].totalUnits || 0) + totalUnits,
            quantity: newCart[existingIndex].quantity + totalUnits 
          };
        } else {
          newCart.push({ 
            product, 
            quantity: totalUnits,
            packaging: packaging as any, 
            packageQuantity, 
            totalUnits 
          });
        }
      });
      return newCart;
    });
    setIsCartOpen(true);

    analytics.track('product_added_to_cart', 'cart', {
      source: 'mass_action',
      metadata: { itemCount: items.length }
    });
  };

  const handleGoPayments = (invoiceId?: string) => {
    console.log("Navegando a pagos. Cliente:", !!currentUser);
    if (!currentUser) {
      setLoginModalOpen(true);
      return;
    }
    if (!hasPermission('ver_cartera')) {
      handlePermissionRestricted('ver_cartera');
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
    if (!hasPermission('ver_pedidos')) {
      handlePermissionRestricted('ver_pedidos');
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
    if (!hasPermission('reordenar')) {
      handlePermissionRestricted('reordenar');
      return;
    }
    setActivePage('reorder');
  };

  const handleGoUrgentOrder = () => {
    if (!currentUser) {
      setLoginModalOpen(true);
      return;
    }
    if (!hasPermission('pedido_urgente')) {
      handlePermissionRestricted('pedido_urgente');
      return;
    }
    setActivePage('urgentOrder');
  };

  const handleGoShoppingLists = () => {
    if (!currentUser) {
      setLoginModalOpen(true);
      return;
    }
    if (!hasPermission('gestionar_listas')) {
      handlePermissionRestricted('gestionar_listas');
      return;
    }
    setActivePage('shoppingLists');
  };

  const handleGoPromotions = () => {
    console.log("Navegando a Promociones...");
    if (!currentUser) {
      console.log("No hay usuario, abriendo login...");
      setLoginModalOpen(true);
      return;
    }
    const hasPerm = hasPermission('ver_promociones');
    console.log("Permiso ver_promociones:", hasPerm);
    if (!hasPerm) {
      handlePermissionRestricted('ver_promociones');
      return;
    }
    setActiveMenu(null);
    setIsCheckoutOpen(false);
    window.scrollTo(0, 0);
    setActivePage('promotions');
  };

  const handleGoIntelligence = () => {
    console.log("Navegando a Inteligencia...");
    if (!currentUser) {
      console.log("No hay usuario, abriendo login...");
      setLoginModalOpen(true);
      return;
    }
    const hasPerm = hasPermission('ver_inteligencia');
    console.log("Permiso ver_inteligencia:", hasPerm);
    if (!hasPerm) {
      handlePermissionRestricted('ver_inteligencia');
      return;
    }
    setActiveMenu(null);
    setIsCheckoutOpen(false);
    window.scrollTo(0, 0);
    setActivePage('intelligence');
  };

  const handleGoCreditRequest = () => {
    if (!currentUser) {
      setLoginModalOpen(true);
      return;
    }
    if (!hasPermission('solicitar_credito')) {
      handlePermissionRestricted('solicitar_credito');
      return;
    }
    setActivePage('creditRequest');
  };

  const handleCreateCreditRequest = (newRequest: CreditRequest) => {
    setCreditRequests(prev => [newRequest, ...prev]);
    
    // Create activity
    handleCreateActivity({
      userId: currentUser?.id || 'sistema',
      userName: currentUser?.name || 'Sistema',
      action: 'Solicitud de crédito',
      detail: `Solicitud #${newRequest.number} enviada por valor de ${newRequest.requestedAmount.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })}`,
      date: "Hoy",
      module: 'credito'
    });

    // Create notification
    handleCreateNotification({
      type: 'mensaje',
      title: "Solicitud de crédito recibida",
      message: `Tu solicitud #${newRequest.number} ha sido recibida y está en análisis por nuestro equipo financiero.`,
      priority: 'media',
      actionLabel: "Ver solicitud",
      actionTarget: 'creditRequest',
      context: { entityType: 'credit_request', value: newRequest.id }
    });
  };

  const handleCreateNotification = (notif: Partial<TBSNotification>) => {
    const newNotif: TBSNotification = {
      id: `notif-${Date.now()}`,
      type: notif.type || 'sistema',
      title: notif.title || 'Notificación',
      message: notif.message || '',
      createdAt: "Recién",
      read: false,
      priority: notif.priority || 'baja',
      actionLabel: notif.actionLabel,
      actionTarget: notif.actionTarget,
      context: notif.context
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleCreateShoppingList = (list: Omit<ShoppingList, 'id' | 'createdAt' | 'updatedAt' | 'products'>) => {
    const newList: ShoppingList = {
      ...list,
      id: `list-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      products: []
    };
    setShoppingLists(prev => [newList, ...prev]);
    handleCreateNotification({
      type: 'sistema',
      title: 'Lista creada',
      message: `Tu lista "${list.name}" fue creada correctamente.`,
      actionTarget: 'shoppingLists'
    });
  };

  const handleUpdateShoppingList = (id: string, updates: Partial<ShoppingList>) => {
    setShoppingLists(prev => prev.map(list => 
      list.id === id 
        ? { ...list, ...updates, updatedAt: new Date().toISOString().split('T')[0] } 
        : list
    ));
  };

  const handleDeleteShoppingList = (id: string) => {
    setShoppingLists(prev => prev.filter(list => list.id !== id));
  };

  const handleAddProductToShoppingList = (listId: string, product: Product, quantity: number) => {
    setShoppingLists(prev => prev.map(list => {
      if (list.id !== listId) return list;
      
      const existing = list.products.find(p => p.productId === product.id);
      if (existing) {
        return {
          ...list,
          updatedAt: new Date().toISOString().split('T')[0],
          products: list.products.map(p => p.productId === product.id 
            ? { ...p, suggestedQuantity: p.suggestedQuantity + quantity } 
            : p)
        };
      }

      const newProductItem: any = {
        id: `slp-${Date.now()}`,
        productId: product.id,
        name: product.name,
        category: product.category,
        specs: product.specs,
        image: product.image,
        price: Number(product.price.replace(/[^0-9]/g, '')),
        suggestedQuantity: quantity,
        available: true,
        stockLabel: "Disponible",
        addedAt: new Date().toISOString().split('T')[0]
      };

      return {
        ...list,
        updatedAt: new Date().toISOString().split('T')[0],
        products: [...list.products, newProductItem]
      };
    }));
  };

  const handleRemoveProductFromShoppingList = (listId: string, productId: string) => {
    setShoppingLists(prev => prev.map(list => 
      list.id === listId 
        ? { ...list, products: list.products.filter(p => p.id !== productId) } 
        : list
    ));
  };

  const handleUpdateProductQuantity = (listId: string, productId: string, quantity: number) => {
    setShoppingLists(prev => prev.map(list => 
      list.id === listId 
        ? { 
            ...list, 
            products: list.products.map(p => p.id === productId ? { ...p, suggestedQuantity: quantity } : p) 
          } 
        : list
    ));
  };

  const handleSettleCommission = (commissionId: string, documentUrl: string) => {
    setHospitalityCommissions(prev => prev.map(c => 
      c.id === commissionId 
        ? { ...c, status: 'en_revision', userDocumentUrl: documentUrl } 
        : c
    ));
    
    handleCreateNotification({
      type: 'comercial',
      title: "Liquidación en proceso",
      message: "Tu solicitud de liquidación ha sido recibida y está siendo revisada.",
      priority: "baja",
      actionLabel: "Ver comisiones",
      actionTarget: "hospitalityPartnerDashboard"
    });
  };

  const handleGoAccount = () => {
    if (!currentUser) {
      setLoginModalOpen(true);
      return;
    }
    if (currentUser.role === 'marca' || currentUser.role === 'proveedor') {
      setActivePage('providerDashboard');
    } else {
      setActivePage('account');
    }
  };

  const handleClearAdvisorChatStates = useCallback(() => {
    setSelectedTopic(null);
    setSelectedContext(null);
    setSelectedConversationId(null);
  }, []);

  const handleGoAdvisorChat = useCallback((topic?: any, context?: any, conversationId?: string | null) => {
    if (!currentUser) {
      setLoginModalOpen(true);
      return;
    }

    // Check if topic is a React/DOM event (prevents crashes when passed directly to onClick)
    const isEvent = topic && typeof topic === 'object' && ('nativeEvent' in topic || 'target' in topic || 'type' in topic);
    
    setSelectedTopic(isEvent ? null : (topic || null));
    setSelectedContext(isEvent ? null : (context || null));
    setSelectedConversationId(isEvent ? null : (conversationId || null));
    setActivePage('advisorChat');
  }, [currentUser]);

  const handleFinishCheckout = () => {
    setIsCheckoutOpen(false);
    
    if (hospitalityPurchaseContext) {
      const total = cartItems.reduce((sum, item) => sum + (item.packaging?.packagePrice || 0) * (item.packageQuantity || 0), 0);
      
      analytics.track('hospitality_order_submitted', 'checkout', {
        orderValue: total,
        metadata: {
          billingType: hospitalityPurchaseContext.billingType,
          hasEvent: !!hospitalityPurchaseContext.managedEventId,
          managedClientId: hospitalityPurchaseContext.managedClientId
        }
      });
      
      const client = managedClients.find(c => c.id === hospitalityPurchaseContext.managedClientId);
      const event = managedEvents.find(e => e.id === hospitalityPurchaseContext.managedEventId);
      
      const newCommission: HospitalityCommission = {
        id: `hcomm-${Math.random().toString(36).substr(2, 9)}`,
        partnerId: hospitalityPurchaseContext.partnerId,
        partnerName: currentUser?.name || '',
        managedClientId: hospitalityPurchaseContext.managedClientId,
        managedClientName: client?.businessName || '',
        orderId: `order-${Math.random().toString(36).substr(2, 9)}`,
        orderNumber: `TBS-${Math.floor(10000 + Math.random() * 90000)}`,
        orderDate: new Date().toISOString().split('T')[0],
        orderTotal: total,
        commissionBase: total,
        commissionPercent: 5,
        commissionAmount: total * 0.05,
        status: 'estimada',
        eventName: event?.eventName,
        eventId: event?.id
      };
      
      setHospitalityCommissions(prev => [newCommission, ...prev]);
      handleClearHospitalityPurchaseContext();
    }

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
    else if (notif.actionTarget === 'orderApprovals') handleGoOrderApprovals();
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
    else if (notif.actionTarget === 'catalog') goToCatalog(null); // Fixed from 'Whisky'
    else if (notif.actionTarget === 'account') setActivePage('account');
    else if (notif.actionTarget === 'intelligence') handleGoIntelligence();
    else if (notif.actionTarget === 'shoppingLists') handleGoShoppingLists();
    else if (notif.actionTarget === 'promotions') handleGoPromotions();
    else if (notif.actionTarget === 'creditRequest') handleGoCreditRequest();
    else setActivePage('notifications');
  };

  const hasPermission = (permissionKey: PermissionKey) => {
    if (!currentUser) return false;
    // Administradores de sistema y roles Master/Administrador de cuenta B2B tienen acceso total
    if (currentUser.role === 'admin' || currentUser.accountRole === 'master' || currentUser.accountRole === 'administrador') return true;
    return currentUser.permissions?.includes(permissionKey) || false;
  };

  const handlePermissionRestricted = (key?: string) => {
    setPermissionErrorModal({ open: true, permission: key });
  };

  const handleGoB2BAccountAdmin = () => {
    if (!currentUser) {
      setLoginModalOpen(true);
      return;
    }
    const canAdmin = hasPermission('gestionar_usuarios') || 
                    hasPermission('gestionar_sucursales') || 
                    hasPermission('configurar_aprobaciones');
    
    if (!canAdmin) {
      handlePermissionRestricted();
      return;
    }
    setActivePage('b2bAccountAdmin');
  };

  const handleUpdateCompanyAccount = (updatedAccount: B2BCompanyAccount) => {
    setCompanyAccount(updatedAccount);
  };

  const handleCreateActivity = (activity: Omit<B2BUserActivity, 'id'>) => {
    const newActivity: B2BUserActivity = {
      ...activity,
      id: `act-${Date.now()}`
    };
    setCompanyAccount(prev => ({
      ...prev,
      activities: [newActivity, ...prev.activities]
    }));
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
    setSearchQuery('');
    setSearchInput('');
    setActivePage('home');
    setActiveMenu(null);
  };

  const goToCatalog = (category: string | null = null) => {
    setSelectedCategory(category);
    setSearchQuery('');
    setSearchInput('');
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
        companyAccount={companyAccount}
        onBack={handleBackFromCheckout}
        onFinish={handleFinishCheckout}
        onCreatePendingApprovalOrder={handleCreatePendingApprovalOrder}
        onGoOrderApprovals={handleGoOrderApprovals}
        hospitalityContext={hospitalityPurchaseContext}
        managedClients={managedClients}
        managedEvents={managedEvents}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 selection:bg-rojo/10 selection:text-rojo" onClick={() => setActiveMenu(null)}>
      <SEOHead 
        title={seo.title}
        description={seo.description}
        canonicalPath={seo.canonicalPath}
        jsonLd={seo.jsonLd}
      />
      {/* Barra Demo */}
      <div className="sticky top-0 z-50 border-bottom border-borde bg-white/94 backdrop-blur-md" onClick={(e) => e.stopPropagation()}>
        <div className="max-w-[1480px] mx-auto px-8 py-3 flex items-center justify-between">
          <div className="text-sm font-bold text-texto-sec">Modo Demo TBS</div>
          <div className="flex gap-1 p-1 border border-[#DDE1E7] bg-[#F8FAFC] rounded-full overflow-x-auto max-w-[calc(100vw-400px)] scrollbar-hide">
            <button 
              onClick={() => setCurrentUser(null)}
              className={`px-5 py-2 rounded-full font-extrabold text-sm transition-all whitespace-nowrap ${!currentUser ? 'bg-rojo text-white tbs-shadow' : 'text-texto-sec hover:bg-gray-100'}`}
            >
              Sin Sesión
            </button>
            <button 
              onClick={() => {
                const master = companyAccount.users.find(u => u.role === 'master');
                if (master) {
                  setCurrentUser({
                    id: master.id,
                    name: master.name,
                    email: master.email,
                    businessName: companyAccount.businessName,
                    role: "cliente_b2b",
                    city: "Bogotá",
                    address: "Calle 93 # 12-45",
                    customerType: "Restaurante",
                    commercialCondition: "credito",
                    creditLimit: 50000000,
                    availableCredit: 12500000,
                    accountRole: master.role,
                    companyAccountId: companyAccount.id,
                    permissions: master.permissions,
                    assignedCityIds: master.assignedCityIds,
                    assignedBranchIds: master.assignedBranchIds,
                    assignedPointOfSaleIds: master.assignedPointOfSaleIds
                  });
                }
                resetToHome();
              }}
              className={`px-5 py-2 rounded-full font-extrabold text-sm transition-all whitespace-nowrap ${currentUser?.accountRole === 'master' ? 'bg-rojo text-white tbs-shadow' : 'text-texto-sec hover:bg-gray-100'}`}
            >
              Master B2B (Humberto)
            </button>
            <button 
              onClick={() => {
                const comprador = companyAccount.users.find(u => u.role === 'comprador');
                if (comprador) {
                  setCurrentUser({
                    name: comprador.name,
                    email: comprador.email,
                    businessName: companyAccount.businessName,
                    role: "cliente_b2b",
                    city: "Bogotá",
                    address: "Calle 93 # 12-45, Local 2",
                    customerType: "Restaurante",
                    commercialCondition: "credito",
                    creditLimit: 5000000,
                    availableCredit: 850000,
                    accountRole: comprador.role,
                    companyAccountId: companyAccount.id,
                    permissions: comprador.permissions,
                    assignedCityIds: comprador.assignedCityIds,
                    assignedBranchIds: comprador.assignedBranchIds,
                    assignedPointOfSaleIds: comprador.assignedPointOfSaleIds,
                    requiresApprovalAbove: comprador.requiresApprovalAbove
                  });
                }
                resetToHome();
              }}
              className={`px-5 py-2 rounded-full font-extrabold text-sm transition-all whitespace-nowrap ${currentUser?.accountRole === 'comprador' ? 'bg-rojo text-white tbs-shadow' : 'text-texto-sec hover:bg-gray-100'}`}
            >
              Comprador B2B (María)
            </button>
            <button 
              onClick={() => {
                const finanzas = companyAccount.users.find(u => u.role === 'finanzas');
                if (finanzas) {
                  setCurrentUser({
                    name: finanzas.name,
                    email: finanzas.email,
                    businessName: companyAccount.businessName,
                    role: "cliente_b2b",
                    city: "Cartagena",
                    address: "Centro Histórico, Calle del Arsenal #10-20",
                    customerType: "Restaurante",
                    accountRole: finanzas.role,
                    companyAccountId: companyAccount.id,
                    permissions: finanzas.permissions,
                    assignedCityIds: finanzas.assignedCityIds,
                    assignedBranchIds: finanzas.assignedBranchIds,
                    assignedPointOfSaleIds: finanzas.assignedPointOfSaleIds
                  });
                }
                resetToHome();
              }}
              className={`px-5 py-2 rounded-full font-extrabold text-sm transition-all whitespace-nowrap ${currentUser?.accountRole === 'finanzas' ? 'bg-rojo text-white tbs-shadow' : 'text-texto-sec hover:bg-gray-100'}`}
            >
              Finanzas B2B (Carlos)
            </button>
            <button 
              onClick={() => {
                setCurrentUser({
                  id: "sofia-contado-001",
                  name: "Sofia Contado",
                  email: "sofia.contado@demo.com",
                  businessName: "Bar Minimal (Contado)",
                  role: "cliente_b2b",
                  city: "Cartagena",
                  address: "Getsemaní, Calle de la Sierpe #5-12",
                  customerType: "Bar",
                  accountRole: "master",
                  commercialCondition: "contado",
                  permissions: [
                    "ver_catalogo",
                    "crear_pedidos",
                    "ver_pedidos",
                    "hablar_asesor",
                    "reordenar"
                  ]
                });
                resetToHome();
              }}
              className={`px-5 py-2 rounded-full font-extrabold text-sm transition-all whitespace-nowrap ${currentUser?.name === 'Sofia Contado' ? 'bg-rojo text-white tbs-shadow' : 'text-texto-sec hover:bg-gray-100'}`}
            >
              Sofia Contado (Cash)
            </button>
            <button 
              onClick={() => {
                setCurrentUser({
                  id: "val-001",
                  name: "Valentina",
                  email: "valentina@example.com",
                  businessName: "Marca Premium Demo",
                  role: "marca",
                  city: "Colombia",
                  address: "Sede Nacional",
                  providerType: "importadora",
                  permissions: [
                    "ver_catalogo",
                    "ver_pedidos",
                    "ver_promociones",
                    "ver_inteligencia",
                    "hablar_asesor"
                  ]
                });
                setActivePage('providerDashboard');
              }}
              className={`px-5 py-2 rounded-full font-extrabold text-sm transition-all whitespace-nowrap ${currentUser?.role === 'marca' ? 'bg-rojo text-white tbs-shadow' : 'text-texto-sec hover:bg-gray-100'}`}
            >
              Marca (Valentina)
            </button>
          </div>
        </div>
      </div>

      {/* Topbar */}
      <div className="bg-rojo text-white text-[13px] font-bold hidden md:block">
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
      <header className="bg-white border-b border-[#EFEFEF] sticky top-0 z-[80] md:relative">
        <div className="max-w-[1480px] mx-auto px-4 sm:px-8 py-4 sm:py-6 flex items-center gap-4 sm:gap-8 flex-nowrap lg:flex-nowrap">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 md:hidden text-texto hover:text-rojo transition-colors"
            id="mobile-menu-trigger"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className="w-full h-0.5 bg-current rounded-full" />
              <span className="w-full h-0.5 bg-current rounded-full" />
              <span className="w-full h-0.5 bg-current rounded-full" />
            </div>
          </button>

          <div className="min-w-[80px] sm:min-w-[120px] leading-none cursor-pointer" onClick={resetToHome}>
            <div className="text-[32px] sm:text-[42px] font-black tracking-[-2px] text-rojo">TBS</div>
          </div>

          <div className="hidden lg:flex items-center gap-3 min-w-[130px] text-[13px] text-gris leading-tight">
            <MapPin size={22} className="text-texto" />
            <div>Cobertura<br /><strong className="text-texto">Nacional</strong></div>
          </div>

          <form 
            onSubmit={handleSearchTrigger}
            className="relative flex-1 hidden md:block"
          >
            <input 
              type="text" 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Buscar productos, marcas, categorías..." 
              className="w-full h-12 border border-[#DDE1E7] rounded-md px-5 pr-12 text-sm outline-none focus:border-rojo transition-colors"
            />
            <button 
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8A8F98] hover:text-rojo transition-colors cursor-pointer outline-none bg-transparent border-none p-0"
            >
              <Search size={22} />
            </button>
          </form>

          <div className="flex items-center gap-4 sm:gap-[22px] text-sm font-bold ml-auto md:ml-0">
            <button 
              onClick={() => setActivePage('catalog')}
              className="p-2 md:hidden text-gris hover:text-rojo transition-colors"
            >
              <Search size={22} />
            </button>
            {!currentUser ? (
              <>
                <button onClick={() => setLoginModalOpen(true)} className="hover:text-rojo cursor-pointer transition-colors">Iniciar sesión / Entrar</button>
                <div className="flex items-center gap-[22px]">
                  <div 
                    className="relative inline-flex cursor-pointer transition-transform hover:scale-110"
                    onClick={() => setIsCartOpen(true)}
                  >
                    <ShoppingCart size={25} strokeWidth={1.8} />
                    <span className="absolute -top-[9px] -right-[9px] flex items-center justify-center min-w-[19px] h-[19px] px-1.5 bg-[#D90000] text-white rounded-full text-[10px] font-extrabold">{cartCount}</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                {isCreditCustomer(currentUser) && (
                  <div className="hidden lg:flex flex-col items-end leading-tight text-gris-oscuro">
                    <span className="text-[10px] font-black uppercase tracking-widest text-rojo">Crédito Disponible</span>
                    <strong className="text-texto text-sm font-black">${currentUser?.availableCredit?.toLocaleString('es-CO') || "3'250.000"}</strong>
                  </div>
                )}
                <div className="flex items-center gap-[22px]">
                  <div className="relative inline-flex cursor-pointer transition-transform hover:scale-110" onClick={handleToggleNotifications}>
                    <Bell size={24} strokeWidth={1.8} />
                    {notifications.filter(n => !n.read).length > 0 && (
                      <span className="absolute -top-[9px] -right-[9px] flex items-center justify-center min-w-[19px] h-[19px] px-1.5 bg-[#D90000] text-white rounded-full text-[10px] font-extrabold">
                        {notifications.filter(n => !n.read).length}
                      </span>
                    )}
                  </div>
                </div>
                {(currentUser.role === 'cliente_b2b') && (
                  <div 
                    className="relative inline-flex cursor-pointer transition-transform hover:scale-110"
                    onClick={() => setIsCartOpen(true)}
                  >
                    <ShoppingCart size={25} strokeWidth={1.8} />
                    <span className="absolute -top-[9px] -right-[9px] flex items-center justify-center min-w-[19px] h-[19px] px-1.5 bg-[#D90000] text-white rounded-full text-[10px] font-extrabold">{cartCount}</span>
                  </div>
                )}
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
                      <div className="text-[10px] font-black uppercase tracking-[0.15em] text-gris mb-0.5">
                        {currentUser.role === 'marca' || currentUser.role === 'proveedor' ? 'Panel de Marca' : 'Mi Cuenta'}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <strong className="font-black text-texto text-sm tracking-tight">{currentUser.name}</strong>
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
                            <div className="text-[10px] font-black uppercase tracking-widest text-rojo mb-1">
                              {currentUser.role === 'marca' || currentUser.role === 'proveedor' ? 'Marca / Proveedor' : 'Negocio Registrado'}
                            </div>
                            <div className="text-sm font-black text-texto truncate">{currentUser.businessName}</div>
                            <div className="text-[11px] font-bold text-gris mt-1 uppercase tracking-tight">
                              {currentUser.city} · {currentUser.providerType || currentUser.customerType}
                            </div>
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
                              <span className="text-sm font-bold text-texto">
                                {currentUser.role === 'marca' || currentUser.role === 'proveedor' ? 'Dashboard de Marca' : 'Mi Perfil'}
                              </span>
                            </button>

                              {/* B2B Customer specific menu */}
                            {currentUser.role === 'cliente_b2b' && (
                              <>
                                <button 
                                  onClick={() => {
                                    handleGoOrderApprovals();
                                    setActiveMenu(null);
                                  }}
                                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                >
                                  <ShieldCheck size={18} className="text-gris" />
                                  <span className="text-sm font-bold text-texto">
                                    {hasPermission('aprobar_pedidos') ? 'Aprobación de pedidos' : 'Mis pedidos en aprobación'}
                                  </span>
                                </button>
                                <button 
                                  onClick={() => {
                                    handleGoShoppingLists();
                                    setActiveMenu(null);
                                  }}
                                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                >
                                  <Star size={18} className="text-gris" />
                                  <span className="text-sm font-bold text-texto">Listas de compra</span>
                                </button>
                                <button 
                                  onClick={() => {
                                    handleGoCreditRequest();
                                    setActiveMenu(null);
                                  }}
                                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                >
                                  <CreditCard size={18} className="text-gris" />
                                  <span className="text-sm font-bold text-texto">Solicitud de crédito</span>
                                </button>
                              </>
                            )}

                            {/* Providers specific menu */}
                            {(currentUser.role === 'marca' || currentUser.role === 'proveedor') && (
                              <>
                                <button 
                                  onClick={() => {
                                    setActivePage('providerProducts');
                                    setActiveMenu(null);
                                  }}
                                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                >
                                  <Package size={18} className="text-gris" />
                                  <span className="text-sm font-bold text-texto">Mi Portafolio</span>
                                </button>
                                <button 
                                  onClick={() => {
                                    setActivePage('providerCampaigns');
                                    setActiveMenu(null);
                                  }}
                                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                >
                                  <Tag size={18} className="text-gris" />
                                  <span className="text-sm font-bold text-texto">Mis Campañas</span>
                                </button>
                                <button 
                                  onClick={() => {
                                    setActivePage('providerSettlements');
                                    setActiveMenu(null);
                                  }}
                                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                >
                                  <FileText size={18} className="text-gris" />
                                  <span className="text-sm font-bold text-texto">Liquidaciones</span>
                                </button>
                                <button 
                                  onClick={() => {
                                    setActivePage('providerReports');
                                    setActiveMenu(null);
                                  }}
                                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                >
                                  <BarChart3 size={18} className="text-gris" />
                                  <span className="text-sm font-bold text-texto">Reportes de Marca</span>
                                </button>
                                <button 
                                  onClick={() => {
                                    handleGoAdvisorChat('activacion');
                                    setActiveMenu(null);
                                  }}
                                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                >
                                  <MessageSquare size={18} className="text-gris" />
                                  <span className="text-sm font-bold text-texto">Ejecutivo TBS</span>
                                </button>
                              </>
                            )}

                            <div className="h-px bg-gray-100 my-1" />
                            
                            {currentUser.role === 'cliente_b2b' && hasPermission('gestionar_usuarios') && (
                              <button 
                                onClick={() => {
                                  handleGoB2BAccountAdmin();
                                  setActiveMenu(null);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-texto hover:bg-rojo/5 hover:text-rojo rounded-lg transition-all group/item"
                              >
                                <div className="p-1.5 bg-gray-50 rounded-md group-hover/item:bg-rojo/10 transition-colors">
                                  <Briefcase size={16} />
                                </div>
                                Administrar Cuenta B2B
                              </button>
                            )}

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
                onClick={() => { goToCatalog(null); setActiveMenu(null); }}
                className={`flex items-center gap-1.5 text-[13px] font-black text-[#303844] hover:text-rojo whitespace-nowrap py-2 cursor-pointer outline-none uppercase tracking-wider ${activePage === 'catalog' ? 'text-rojo' : ''}`}
              >
                Catálogo <ChevronDown size={14} onMouseEnter={() => toggleMenu('catalog')} className={`transition-transform ${activeMenu === 'catalog' ? 'rotate-180' : ''}`} />
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
                        <div className="mb-4">
                          <h4 className="text-base font-black text-texto">Categorías de Licores</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-6">
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
                        <button 
                          onClick={() => goToCatalog(null)}
                          className="text-[11px] font-black text-rojo hover:underline cursor-pointer uppercase tracking-wider block"
                        >
                          Ver todo el catálogo →
                        </button>
                      </div>
                      <div className="rounded-xl bg-gradient-to-br from-[#FFF1F1] to-white border border-[#F0D3D3] p-[22px]">
                        <span className="inline-block mb-2.5 px-2.5 py-1.5 rounded-full bg-rojo text-white text-[11px] font-black uppercase tracking-wider">Acceso B2B</span>
                        <h3 className="text-[21px] font-black text-texto leading-none">Precios B2B para tu negocio.</h3>
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

            {isCliente ? null : (
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
                                { title: 'Precios B2B', desc: 'Condiciones según tipo de cliente y volumen.' },
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
                              TBS es una plataforma B2B que ayuda a negocios del sector de licores a comprar, pagar, recibir y gestionar su abastecimiento desde un solo lugar.
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
                    Marcas <ChevronDown size={14} onMouseEnter={() => toggleMenu('providers')} className={`transition-transform ${activeMenu === 'providers' ? 'rotate-180' : ''}`} />
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
                                { title: 'Acceso al canal B2B', desc: 'Llega a bares, hoteles, licoreras y clientes especializados.' },
                                { title: 'Logística y distribución', desc: 'Apóyate en la red operativa de TBS para despacho.' },
                                { title: 'Visibilidad comercial', desc: 'Participa en campañas, vitrinas y activaciones.' },
                                { title: 'Publicidad en TBS', desc: 'Soluciones de retail media B2B para potenciar tu marca.' },
                                { title: 'Reportes de desempeño', desc: 'Consulta rotación, ventas y cumplimiento.' },
                                { title: 'Activación en clientes', desc: 'Ejecuta marcas en punto de consumo con apoyo.' }
                              ].map((prov, i) => (
                                <button 
                                  key={i} 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    if (prov.title === 'Publicidad en TBS') {
                                      setActivePage('advertising');
                                    } else {
                                      setActivePage('providers');
                                    }
                                    setActiveMenu(null);
                                  }}
                                  className="proveedor-card group text-left w-full cursor-pointer outline-none bg-transparent"
                                >
                                  <strong className="block text-[14px] font-black group-hover:text-rojo transition-colors">{prov.title}</strong>
                                  <span className="block text-[12px] text-gris font-semibold leading-tight">{prov.desc}</span>
                                </button>
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
                              <p className="text-[12px] font-bold text-gris leading-tight">
                                Al unirte como proveedor, accedes a herramientas de inteligencia de datos y planeación logística.
                              </p>
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
                                { title: 'Pedido urgente', desc: 'Servicio para necesidades inmediatas de tu negocio.' },
                                { title: 'Crédito B2B', desc: 'Condiciones comerciales y cupos según perfil de riesgo.' },
                                { title: 'Cartera y pagos', desc: 'Consulta facturas, vencimientos y pagos pendientes.' },
                                { title: 'Pedidos recurrentes', desc: 'Repite compras frecuentes y listas favoritas.' },
                                { title: 'Activaciones comerciales', desc: 'Apoyo en campañas, temporadas y eventos.' },
                                { title: 'Publicidad en TBS', desc: 'Soluciones de visibilidad y posicionamiento de marca.' },
                                { title: 'Inteligencia comercial', desc: 'Información de rotación y comportamiento de compra.' }
                              ].map((serv, i) => (
                                <button 
                                  key={i} 
                                  onClick={() => { 
                                    if (serv.title === 'Pedido urgente') {
                                      handleGoUrgentOrder();
                                    } else if (serv.title === 'Publicidad en TBS') {
                                      setActivePage('advertising');
                                    } else {
                                      setActivePage('services');
                                    }
                                    setActiveMenu(null); 
                                  }}
                                  className="servicio-card group text-left w-full cursor-pointer outline-none bg-transparent"
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

                <div className="relative">
                  <button 
                    onClick={handleGoHospitalityPartners} 
                    className={`flex items-center gap-1.5 text-[13px] font-black text-[#303844] hover:text-rojo whitespace-nowrap py-2 cursor-pointer outline-none uppercase tracking-wider ${activePage === 'hospitalityPartners' ? 'text-rojo' : ''}`}
                  >
                    Hospitality
                  </button>
                </div>

                <div className="relative">
                  <button 
                    onClick={handleGoFAQ} 
                    className={`flex items-center gap-1.5 text-[13px] font-black text-[#303844] hover:text-rojo whitespace-nowrap py-2 cursor-pointer outline-none uppercase tracking-wider ${activePage === 'faq' ? 'text-rojo' : ''}`}
                  >
                    Ayuda
                  </button>
                </div>

                <div className="relative">
                  <button 
                    onClick={handleGoContact} 
                    className={`flex items-center gap-1.5 text-[13px] font-black text-[#303844] hover:text-rojo whitespace-nowrap py-2 cursor-pointer outline-none uppercase tracking-wider ${activePage === 'contact' ? 'text-rojo' : ''}`}
                  >
                    Contacto
                  </button>
                </div>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-6">
            {isCliente && (currentUser?.role === 'cliente_b2b' || currentUser?.role === 'proveedor' || currentUser?.role === 'marca' || currentUser?.role === 'hospitality_partner') && (
              <div className="flex items-center gap-6">
                {currentUser?.role === 'hospitality_partner' && (
                  <>
                    <button 
                      onClick={handleGoHospitalityDashboard}
                      className={`text-[11px] font-black uppercase tracking-widest whitespace-nowrap cursor-pointer transition-colors ${activePage === 'hospitalityPartnerDashboard' ? 'text-rojo' : 'text-[#303844] hover:text-rojo'}`}
                    >
                      Panel Gestión
                    </button>
                    <button 
                      onClick={handleGoOrdersTracking} 
                      className={`text-[11px] font-black uppercase tracking-widest whitespace-nowrap cursor-pointer transition-colors ${activePage === 'ordersTracking' ? 'text-rojo' : 'text-[#303844] hover:text-rojo'}`}
                    >
                      Mis Ventas
                    </button>
                    <button 
                      onClick={() => handleGoAdvisorChat()} 
                      className={`text-[11px] font-black uppercase tracking-widest whitespace-nowrap cursor-pointer transition-colors ${activePage === 'advisorChat' ? 'text-rojo' : 'text-[#303844] hover:text-rojo'}`}
                    >
                      Soporte TBS
                    </button>
                  </>
                )}
                {(currentUser?.role === 'marca' || currentUser?.role === 'proveedor') && (
                  <>
                    <button 
                      onClick={() => {
                        setActivePage('providerDashboard');
                        setProviderDashboardTab('overview');
                      }} 
                      className={`text-[11px] font-black uppercase tracking-widest whitespace-nowrap cursor-pointer transition-colors ${activePage === 'providerDashboard' && providerDashboardTab === 'overview' ? 'text-rojo' : 'text-[#303844] hover:text-rojo'}`}
                    >
                      Resumen
                    </button>
                    <button 
                      onClick={() => {
                        setActivePage('providerDashboard');
                        setProviderDashboardTab('products');
                      }} 
                      className={`text-[11px] font-black uppercase tracking-widest whitespace-nowrap cursor-pointer transition-colors ${activePage === 'providerDashboard' && providerDashboardTab === 'products' ? 'text-rojo' : 'text-[#303844] hover:text-rojo'}`}
                    >
                      Portafolio
                    </button>
                    <button 
                      onClick={() => {
                        setActivePage('providerDashboard');
                        setProviderDashboardTab('campaigns');
                      }} 
                      className={`text-[11px] font-black uppercase tracking-widest whitespace-nowrap cursor-pointer transition-colors ${activePage === 'providerDashboard' && providerDashboardTab === 'campaigns' ? 'text-rojo' : 'text-[#303844] hover:text-rojo'}`}
                    >
                      Campañas
                    </button>
                    <button 
                      onClick={() => {
                        setActivePage('providerDashboard');
                        setProviderDashboardTab('settlements');
                      }} 
                      className={`text-[11px] font-black uppercase tracking-widest whitespace-nowrap cursor-pointer transition-colors ${activePage === 'providerDashboard' && providerDashboardTab === 'settlements' ? 'text-rojo' : 'text-[#303844] hover:text-rojo'}`}
                    >
                      Liquidaciones
                    </button>
                    <button 
                      onClick={() => {
                        setActivePage('providerDashboard');
                        setProviderDashboardTab('reports');
                      }} 
                      className={`text-[11px] font-black uppercase tracking-widest whitespace-nowrap cursor-pointer transition-colors ${activePage === 'providerDashboard' && providerDashboardTab === 'reports' ? 'text-rojo' : 'text-[#303844] hover:text-rojo'}`}
                    >
                      Reportes
                    </button>
                    <button 
                      onClick={handleGoOrdersTracking} 
                      className={`text-[11px] font-black uppercase tracking-widest whitespace-nowrap cursor-pointer transition-colors ${activePage === 'ordersTracking' ? 'text-rojo' : 'text-[#303844] hover:text-rojo'}`}
                    >
                      Ventas
                    </button>
                  </>
                )}
                {currentUser?.role === 'cliente_b2b' && (
                  <>
                    <button 
                      onClick={resetToHome} 
                      className={`text-[11px] font-black uppercase tracking-widest whitespace-nowrap cursor-pointer transition-colors ${activePage === 'home' ? 'text-rojo' : 'text-[#303844] hover:text-rojo'}`}
                    >
                      Dashboard
                    </button>
                    <button onClick={handleGoReorder} className={`text-[11px] font-black uppercase tracking-widest whitespace-nowrap cursor-pointer transition-colors ${activePage === 'reorder' ? 'text-rojo' : 'text-[#303844] hover:text-rojo'}`}>Reordenar</button>
                    <button 
                      onClick={handleGoIntelligence} 
                      className={`text-[11px] font-black uppercase tracking-widest whitespace-nowrap cursor-pointer transition-colors ${activePage === 'intelligence' ? 'text-rojo' : 'text-[#303844] hover:text-rojo'}`}
                    >
                      Inteligencia
                    </button>
                    <button 
                      onClick={handleGoPromotions} 
                      className={`text-[11px] font-black uppercase tracking-widest whitespace-nowrap cursor-pointer transition-colors ${activePage === 'promotions' ? 'text-rojo' : 'text-[#303844] hover:text-rojo'}`}
                    >
                      Promos
                    </button>
                    {currentUser?.commercialCondition !== 'contado' && (
                      <button 
                        onClick={handleGoPayments} 
                        className={`text-[11px] font-black uppercase tracking-widest whitespace-nowrap cursor-pointer transition-colors ${activePage === 'payments' ? 'text-rojo' : 'text-[#303844] hover:text-rojo'}`}
                      >
                        Cartera
                      </button>
                    )}
                    <button 
                      onClick={handleGoOrdersTracking} 
                      className={`text-[11px] font-black uppercase tracking-widest whitespace-nowrap cursor-pointer transition-colors ${activePage === 'ordersTracking' ? 'text-rojo' : 'text-[#303844] hover:text-rojo'}`}
                    >
                      Seguimiento
                    </button>
                    <button 
                      onClick={handleGoUrgentOrder} 
                      className={`text-[11px] font-black uppercase tracking-widest whitespace-nowrap cursor-pointer transition-colors ${activePage === 'urgentOrder' ? 'text-rojo' : 'text-[#303844] hover:text-rojo'}`}
                    >
                      Pedido urgente
                    </button>
                  </>
                )}
                <button 
                  onClick={() => handleGoAdvisorChat()} 
                  className={`text-[11px] font-black uppercase tracking-widest whitespace-nowrap cursor-pointer transition-colors ${activePage === 'advisorChat' ? 'text-rojo' : 'text-[#303844] hover:text-rojo'}`}
                >
                  Mi asesor
                </button>
                <button 
                  onClick={handleGoFAQ} 
                  className={`text-[11px] font-black uppercase tracking-widest whitespace-nowrap cursor-pointer transition-colors ${activePage === 'faq' ? 'text-rojo' : 'text-[#303844] hover:text-rojo'}`}
                >
                  Ayuda
                </button>
              </div>
            )}
            
            {!isCliente && (
              <button 
                onClick={() => openAuth('request')} 
                className="px-7 py-3 bg-rojo text-white rounded-md text-[11px] font-black uppercase tracking-widest hover:bg-rojo-oscuro transition-all shadow-lg shadow-rojo/20 cursor-pointer outline-none"
              >
                Solicitar acceso
              </button>
            )}
          </div>
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
              onAddToCart={handleRequestAddToCart}
              isCliente={isCliente}
              currentUser={currentUser}
              onCategorySelect={setSelectedCategory}
              onRequestAccess={() => openAuth('request')}
              onLogin={() => setLoginModalOpen(true)}
              shoppingLists={shoppingLists}
              onAddToList={handleAddProductToShoppingList}
              onCreateList={(name, desc) => handleCreateShoppingList({ name, description: desc, type: 'personalizada' })}
              onGoPromotions={handleGoPromotions}
              promotions={promotions}
              searchQuery={searchQuery}
              onClearSearch={() => { setSearchQuery(''); setSearchInput(''); }}
              onAdClick={handleAdClick}
              hospitalityContext={hospitalityPurchaseContext}
              managedClients={managedClients}
              managedEvents={managedEvents}
              onClearHospitalityContext={handleClearHospitalityPurchaseContext}
              onGoHospitalityDashboard={handleGoHospitalityDashboard}
            />
          </motion.div>
        ) : activePage === 'hospitalityPartnerDashboard' ? (
          <motion.div
            key="hospitalityDashboard"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <HospitalityPartnerDashboardPage 
              currentUser={currentUser}
              partnerProfile={currentPartnerProfile}
              managedClients={managedClients}
              managedEvents={managedEvents}
              commissions={hospitalityCommissions}
              commissionRules={HOSPITALITY_COMMISSION_RULES}
              onGoCatalog={() => goToCatalog(null)}
              onGoAdvisorChat={handleGoAdvisorChat}
              onGoOrdersTracking={handleGoOrdersTracking}
              onGoAccount={handleGoAccount}
              onCreateManagedClient={handleCreateManagedClient}
              onCreateManagedEvent={handleCreateManagedEvent}
              onStartPurchaseForClient={handleStartPurchaseForManagedClient}
              onSettleCommission={handleSettleCommission}
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
              onGoPage={(p) => setActivePage(p as any)}
            />
            {isPublicPage && <PublicFooter onGoPage={(p) => setActivePage(p as any)} />}
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
              onGoToCatalog={() => goToCatalog(null)}
              onRequestAccess={handleGoAccessRequest}
              onLogin={() => setLoginModalOpen(true)}
              onGoAdvisorChat={handleGoAdvisorChat}
            />
            {isPublicPage && <PublicFooter onGoPage={(p) => setActivePage(p as any)} />}
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
              onRequestAccess={() => handleGoAccessRequest('provider')}
              onLogin={() => setLoginModalOpen(true)}
              onGoAdvisorChat={handleGoAdvisorChat}
              onGoAdvertising={() => setActivePage('advertising')}
            />
            {isPublicPage && <PublicFooter onGoPage={(p) => setActivePage(p as any)} />}
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
              onGoToCatalog={() => goToCatalog(null)}
              onRequestAccess={handleGoAccessRequest}
              onLogin={() => setLoginModalOpen(true)}
              onGoAdvisorChat={handleGoAdvisorChat}
              onGoPage={setActivePage as any}
              onGoAdvertising={() => setActivePage('advertising')}
            />
            {isPublicPage && <PublicFooter onGoPage={(p) => setActivePage(p as any)} />}
          </motion.div>
        ) : activePage === 'campaignPage' ? (
          <motion.div
            key="campaign"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <CampaignPage 
              campaignPage={CAMPAIGN_PAGES.find(c => c.slug === activeCampaignSlug) || CAMPAIGN_PAGES[0]}
              products={PRODUCTS}
              currentUser={currentUser}
              onGoCatalog={() => setActivePage('catalog')}
              onGoAdvisorChat={handleGoAdvisorChat}
              onGoAccessRequest={handleGoAccessRequest}
              onProductClick={(p) => setPackagingModalProduct(p)}
              onAddToCart={handleRequestAddToCart}
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
                onGoShoppingLists={handleGoShoppingLists}
                onGoPromotions={handleGoPromotions}
                onGoIntelligence={handleGoIntelligence}
                onGoB2BAccountAdmin={handleGoB2BAccountAdmin}
                onGoOrderApprovals={handleGoOrderApprovals}
                onGoFAQ={handleGoFAQ}
                onGoCreditRequest={handleGoCreditRequest}
                onGoProviderProducts={() => setActivePage('providerProducts')}
                onGoProviderCampaigns={() => setActivePage('providerCampaigns')}
                onGoProviderSettlements={() => setActivePage('providerSettlements')}
                onGoProviderReports={() => setActivePage('providerReports')}
                onAdClick={handleAdClick}
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
              onGoFAQ={handleGoFAQ}
              onGoLegalPage={handleGoLegalPage}
              initialRole={requestAccessRole}
            />
            {isPublicPage && <PublicFooter onGoPage={(p) => setActivePage(p as any)} />}
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
              onGoCreditRequest={handleGoCreditRequest}
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
              commissions={hospitalityCommissions}
              commissionRules={HOSPITALITY_COMMISSION_RULES}
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
              onAddToCart={handleRequestAddToCart}
              onOpenCart={() => setIsCartOpen(true)}
              onGoAdvisorChat={handleGoAdvisorChat}
              onGoShoppingLists={handleGoShoppingLists}
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
              onClearInitialStates={handleClearAdvisorChatStates}
              onCreateNotification={(n) => setNotifications(prev => [n, ...prev])}
            />
          </motion.div>
        ) : activePage === 'shoppingLists' ? (
          <motion.div
            key="shoppingLists"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <ShoppingListsPage 
              currentUser={currentUser}
              shoppingLists={shoppingLists}
              onBackToAccount={() => setActivePage('account')}
              onGoCatalog={() => goToCatalog('Whisky')}
              onAddToCart={handleRequestAddToCart}
              onOpenCart={() => setIsCartOpen(true)}
              onCreateList={handleCreateShoppingList}
              onUpdateList={handleUpdateShoppingList}
              onDeleteList={handleDeleteShoppingList}
              onRemoveProductFromList={handleRemoveProductFromShoppingList}
              onUpdateProductQuantity={handleUpdateProductQuantity}
              onGoAdvisorChat={handleGoAdvisorChat}
              onCreateNotification={handleCreateNotification}
            />
          </motion.div>
        ) : activePage === 'promotions' ? (
          <motion.div
            key="promotions"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <PromotionsPage 
              currentUser={currentUser}
              promotions={promotions}
              onBackToAccount={() => setActivePage('account')}
              onGoCatalog={() => goToCatalog('Whisky')}
              onAddToCart={handleRequestAddToCart}
              onOpenCart={() => setIsCartOpen(true)}
              onGoAdvisorChat={handleGoAdvisorChat}
              onCreateNotification={handleCreateNotification}
            />
          </motion.div>
        ) : activePage === 'advertising' ? (
          <motion.div
            key="advertising"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
          >
            <AdvertisingPage 
              onBack={resetToHome}
              onRequestAccess={(role) => openAuth('request', role)}
              onGoAdvisorChat={handleGoAdvisorChat}
              currentUser={currentUser}
              products={PRODUCTS}
              campaigns={BRAND_AD_CAMPAIGNS}
            />
          </motion.div>
        ) : activePage === 'hospitalityPartners' ? (
          <motion.div
            key="hospitalityPartners"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
          >
            <HospitalityPartnersPage 
              currentUser={currentUser}
              onGoAccessRequest={handleGoAccessRequest}
              onGoHospitalityDashboard={handleGoHospitalityDashboard}
              onGoAdvisorChat={handleGoAdvisorChat}
              onBack={resetToHome}
            />
            {isPublicPage && <PublicFooter onGoPage={(p) => setActivePage(p as any)} />}
          </motion.div>
        ) : activePage === 'intelligence' ? (
          <motion.div
            key="intelligence"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <IntelligencePage 
              currentUser={currentUser}
              summary={CUSTOMER_INTELLIGENCE_SUMMARY}
              monthlyMetrics={MONTHLY_PURCHASE_METRICS}
              categoryConsumption={CATEGORY_CONSUMPTION}
              topProducts={TOP_PURCHASED_PRODUCTS}
              insights={CUSTOMER_INSIGHTS}
              onBackToAccount={() => setActivePage('account')}
              onGoReorder={handleGoReorder}
              onGoPayments={handleGoPayments}
              onGoPromotions={handleGoPromotions}
              onGoAdvisorChat={handleGoAdvisorChat}
              onGoUrgentOrder={handleGoUrgentOrder}
              onGoShoppingLists={handleGoShoppingLists}
              onGoCatalog={goToCatalog}
              onAddToCart={(p) => handleRequestAddToCart(p, 'intelligence' as any)}
              onOpenCart={() => setIsCartOpen(true)}
              onCreateNotification={handleCreateNotification}
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
        ) : activePage === 'b2bAccountAdmin' ? (
          <motion.div
            key="b2bAccountAdmin"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <B2BAccountAdminPage 
              currentUser={currentUser!}
              companyAccount={companyAccount}
              permissions={B2B_PERMISSIONS}
              onBackToAccount={() => setActivePage('account')}
              onGoHome={resetToHome}
              onGoAdvisorChat={handleGoAdvisorChat}
              onUpdateCompanyAccount={handleUpdateCompanyAccount}
              onCreateNotification={handleCreateNotification}
              onCreateActivity={handleCreateActivity}
            />
          </motion.div>
        ) : activePage === 'creditRequest' ? (
          <motion.div
            key="creditRequest"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {currentUser && (
              <CreditRequestPage 
                currentUser={currentUser}
                creditRequests={creditRequests}
                onBackToAccount={() => setActivePage('account')}
                onGoPayments={handleGoPayments}
                onGoAdvisorChat={handleGoAdvisorChat}
                onCreateNotification={handleCreateNotification}
                onCreateCreditRequest={handleCreateCreditRequest}
              />
            )}
          </motion.div>
        ) : (activePage === 'orderApprovals' && currentUser) ? (
          <motion.div
            key="orderApprovals"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <OrderApprovalsPage 
              currentUser={currentUser}
              approvalOrders={approvalOrders}
              companyAccount={companyAccount}
              onBackToAccount={() => setActivePage('account')}
              onGoOrdersTracking={() => setActivePage('ordersTracking')}
              onGoAdvisorChat={handleGoAdvisorChat}
              onUpdateApprovalOrders={(updated) => setApprovalOrders(updated)}
              onCreateNotification={handleCreateNotification}
              onCreateActivity={handleCreateActivity}
            />
          </motion.div>
        ) : activePage === 'faq' ? (
          <motion.div
            key="faq"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <FAQPage
              currentUser={currentUser}
              faqItems={FAQ_ITEMS}
              onGoHome={resetToHome}
              onGoAccessRequest={handleGoAccessRequest}
              onGoLogin={() => setLoginModalOpen(true)}
              onGoCatalog={() => goToCatalog(null)}
              onGoAccount={handleGoAccount}
              onGoPayments={handleGoPayments}
              onGoOrdersTracking={handleGoOrdersTracking}
              onGoUrgentOrder={handleGoUrgentOrder}
              onGoReorder={handleGoReorder}
              onGoShoppingLists={handleGoShoppingLists}
              onGoPromotions={handleGoPromotions}
              onGoIntelligence={handleGoIntelligence}
              onGoAdvisorChat={handleGoAdvisorChat}
              onGoProviderDashboard={() => setActivePage('providerDashboard')}
              onGoB2BAccountAdmin={handleGoB2BAccountAdmin}
              onGoOrderApprovals={handleGoOrderApprovals}
              onGoContact={handleGoContact}
            />
            {isPublicPage && <PublicFooter onGoPage={(p) => setActivePage(p as any)} />}
          </motion.div>
        ) : activePage === 'blogIndex' ? (
          <motion.div
            key="blogIndex"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <BlogIndexPage 
              articles={BLOG_ARTICLES}
              currentUser={currentUser}
              onGoHome={resetToHome}
              onGoArticle={handleGoArticle}
              onGoAccessRequest={handleGoAccessRequest}
              onGoFAQ={handleGoFAQ}
              onGoCatalog={() => goToCatalog(null)}
              onGoAdvisorChat={handleGoAdvisorChat}
            />
            {isPublicPage && <PublicFooter onGoPage={(p) => setActivePage(p as any)} />}
          </motion.div>
        ) : activePage === 'blogArticle' ? (
          <motion.div
            key="blogArticle"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {(() => {
              const article = BLOG_ARTICLES.find(a => a.slug === activeArticleSlug);
              if (!article) return <div className="p-20 text-center font-black">Artículo no encontrado</div>;
              return (
                <BlogArticlePage 
                  article={article}
                  articles={BLOG_ARTICLES}
                  currentUser={currentUser}
                  onGoHome={resetToHome}
                  onGoBlog={handleGoBlog}
                  onGoArticle={handleGoArticle}
                  onGoAccessRequest={handleGoAccessRequest}
                  onGoCatalog={() => goToCatalog(null)}
                  onGoFAQ={handleGoFAQ}
                  onGoAdvisorChat={handleGoAdvisorChat}
                  onGoPublicLanding={(key) => setActivePage(key as any)}
                  onGoProviders={() => setActivePage('providers')}
                  onGoClients={() => setActivePage('clients')}
                  onGoServices={() => setActivePage('services')}
                />
              );
            })()}
            {isPublicPage && <PublicFooter onGoPage={(p) => setActivePage(p as any)} />}
          </motion.div>
        ) : activePage === 'legalIndex' ? (
          <motion.div
            key="legalIndex"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <LegalIndexPage 
              legalPages={LEGAL_PAGES}
              onGoHome={resetToHome}
              onGoLegalPage={handleGoLegalPage}
              onGoContact={handleGoContact}
            />
            {isPublicPage && <PublicFooter onGoPage={(p) => setActivePage(p as any)} />}
          </motion.div>
        ) : activePage === 'legalPage' ? (
          <motion.div
            key="legalPage"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {(() => {
              const pageData = LEGAL_PAGES.find(p => p.key === activeLegalPageKey);
              if (!pageData) return <LegalIndexPage legalPages={LEGAL_PAGES} onGoHome={resetToHome} onGoLegalPage={handleGoLegalPage} onGoContact={handleGoContact} />;
              return (
                <LegalPage 
                  pageData={pageData}
                  onGoHome={resetToHome}
                  onGoContact={handleGoContact}
                  onGoLegalPage={handleGoLegalPage}
                />
              );
            })()}
            {isPublicPage && <PublicFooter onGoPage={(p) => setActivePage(p as any)} />}
          </motion.div>
        ) : activePage === 'publicLanding' ? (
          <motion.div
            key="publicLanding"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {(() => {
              const landingData = PUBLIC_LANDINGS.find(l => l.key === activeLandingKey);
              if (!landingData) return <div className="p-20 text-center font-black">Página no encontrada</div>;
              return (
                <PublicLandingPage 
                  data={landingData}
                  onGoHome={resetToHome}
                  onGoCatalog={() => goToCatalog(null)}
                  onGoAccessRequest={handleGoAccessRequest}
                  onGoAdvisorChat={handleGoAdvisorChat}
                  onGoHospitalityPartners={handleGoHospitalityPartners}
                  onAdClick={handleAdClick}
                  currentUser={currentUser}
                />
              );
            })()}
            {isPublicPage && <PublicFooter onGoPage={(p) => setActivePage(p as any)} />}
          </motion.div>
        ) : activePage === 'trust' ? (
          <motion.div
            key="trust"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <TrustPage 
              onBack={resetToHome}
              onGoContact={handleGoContact}
              onGoAccessRequest={handleGoAccessRequest}
              onGoLegalPage={handleGoLegalPage}
            />
            {isPublicPage && <PublicFooter onGoPage={(p) => setActivePage(p as any)} />}
          </motion.div>
        ) : activePage === 'contact' ? (
          <motion.div
            key="contact"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <ContactPage
              currentUser={currentUser}
              contactInfo={BUSINESS_CONTACT_INFO}
              contactChannels={CONTACT_CHANNELS}
              onGoHome={resetToHome}
              onGoAccessRequest={handleGoAccessRequest}
              onGoFAQ={handleGoFAQ}
              onGoCatalog={() => goToCatalog(null)}
              onGoAdvisorChat={handleGoAdvisorChat}
              onGoLegalPage={handleGoLegalPage}
            />
            {isPublicPage && <PublicFooter onGoPage={(p) => setActivePage(p as any)} />}
          </motion.div>
        ) : (activePage === 'providerProducts' || activePage === 'providerCampaigns' || activePage === 'providerSettlements' || activePage === 'providerReports') ? (
          <motion.div
            key="providerSubPages"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ProviderDashboardPage 
              currentUser={currentUser}
              products={PROVIDER_PRODUCTS}
              salesMetrics={PROVIDER_SALES_METRICS}
              channelMetrics={PROVIDER_CHANNEL_METRICS}
              cityMetrics={PROVIDER_CITY_METRICS}
              campaigns={PROVIDER_CAMPAIGNS}
              settlements={PROVIDER_SETTLEMENTS}
              insights={PROVIDER_INSIGHTS}
              priceImportBatches={PROVIDER_PRICE_IMPORT_BATCHES}
              onGoHome={resetToHome}
              onGoAdvisorChat={handleGoAdvisorChat}
              onGoProviderProducts={() => setActivePage('providerProducts')}
              onGoProviderCampaigns={() => setActivePage('providerCampaigns')}
              onGoProviderSettlements={() => setActivePage('providerSettlements')}
              onGoProviderReports={() => setActivePage('providerReports')}
              onGoAdvertising={() => setActivePage('advertising')}
              onCreateNotification={handleCreateNotification}
              onGoFAQ={handleGoFAQ}
              activeTab={providerDashboardTab}
              onTabChange={setProviderDashboardTab}
            />
          </motion.div>
        ) : activePage === 'providerDashboard' ? (
          <motion.div
            key="providerDashboard"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <ProviderDashboardPage 
              currentUser={currentUser}
              products={PROVIDER_PRODUCTS}
              salesMetrics={PROVIDER_SALES_METRICS}
              channelMetrics={PROVIDER_CHANNEL_METRICS}
              cityMetrics={PROVIDER_CITY_METRICS}
              campaigns={PROVIDER_CAMPAIGNS}
              settlements={PROVIDER_SETTLEMENTS}
              insights={PROVIDER_INSIGHTS}
              priceImportBatches={PROVIDER_PRICE_IMPORT_BATCHES}
              onGoHome={resetToHome}
              onGoAdvisorChat={handleGoAdvisorChat}
              onGoProviderProducts={() => setActivePage('providerProducts')}
              onGoProviderCampaigns={() => setActivePage('providerCampaigns')}
              onGoProviderSettlements={() => setActivePage('providerSettlements')}
              onGoProviderReports={() => setActivePage('providerReports')}
              onGoAdvertising={() => setActivePage('advertising')}
              onCreateNotification={handleCreateNotification}
              onGoFAQ={handleGoFAQ}
              activeTab={providerDashboardTab}
              onTabChange={setProviderDashboardTab}
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
            {isCliente && currentUser?.role === 'cliente_b2b' ? (
              <AuthenticatedHome 
                currentUser={currentUser}
                companyAccount={companyAccount}
                notifications={notifications}
                approvalOrders={approvalOrders}
                frequentProducts={PRODUCTS.slice(0, 8)}
                promotions={promotions}
                onGoCatalog={goToCatalog}
                onGoReorder={handleGoReorder}
                onGoPayments={handleGoPayments}
                onGoOrdersTracking={handleGoOrdersTracking}
                onGoUrgentOrder={handleGoUrgentOrder}
                onGoAdvisorChat={handleGoAdvisorChat}
                onGoPromotions={handleGoPromotions}
                onGoOrderApprovals={handleGoOrderApprovals}
                onGoIntelligence={handleGoIntelligence}
                onAddToCart={handleAddToCart}
              />
            ) : (
              <>
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
                    Abastecimiento inteligente para negocios que venden licores
                  </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-7 text-lg lg:text-[20px] text-[#334155] leading-relaxed font-medium max-w-[640px]"
            >
              Compra licores con precios B2B competitivos, crédito, pagos unificados, entregas confiables y soporte comercial experto desde una sola plataforma diseñada para tu operación.
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
                {currentUser?.role === 'marca' || currentUser?.role === 'proveedor' ? (
                  <>
                    <div className="flex flex-col mb-4">
                      <h3 className="text-base font-black whitespace-nowrap leading-tight">Tu desempeño hoy</h3>
                      <button onClick={() => setActivePage('providerDashboard')} className="w-fit text-[10px] font-black text-rojo hover:underline uppercase tracking-wider cursor-pointer mt-1">Ver dashboard →</button>
                    </div>

                    {[
                      { icon: BarChart3, val: '$ 29.8M', label: 'Ventas del mes', link: 'Ver reportes →', onClick: () => setActivePage('providerDashboard') },
                      { icon: Package, val: '24', label: 'Productos activos', link: 'Gestionar stock →', onClick: () => setActivePage('providerDashboard') },
                      { icon: Tag, val: '2', label: 'Campañas activas', link: 'Ver activaciones →', onClick: () => setActivePage('providerDashboard') }
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
                      <div className="w-[42px] h-[42px] rounded-full bg-gray-100 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop" alt="Andrés Martínez" className="w-full h-full object-cover" />
                      </div>
                      <div className="text-[13px] leading-snug flex-1">
                        <div className="text-gris uppercase text-[10px] font-black tracking-widest">Ejecutivo TBS</div>
                        <strong className="font-bold block tracking-tight">Andrés Martínez</strong>
                        <div className="flex items-center justify-between">
                          <span className="text-gris">320 987 6543</span>
                          <button 
                            onClick={() => handleGoAdvisorChat('activacion')}
                            className="text-rojo font-black text-[10px] uppercase hover:underline cursor-pointer"
                          >
                            Chat →
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col mb-4">
                      <h3 className="text-base font-black whitespace-nowrap leading-tight">Tu operación hoy</h3>
                      <button onClick={handleGoReorder} className="w-fit text-[10px] font-black text-rojo hover:underline uppercase tracking-wider cursor-pointer mt-1">Reordenar →</button>
                    </div>

                    {[
                      { icon: Truck, val: '2', label: 'Pedidos en tránsito', link: 'Ver seguimiento →', onClick: handleGoOrdersTracking },
                      { icon: FileText, val: '4', label: 'Facturas pendientes', link: 'Ver cartera →', onClick: handleGoPayments },
                      { icon: CreditCard, val: '$ 3.250.000', label: 'Cupo disponible', link: 'Ver detalles →', onClick: handleGoPayments },
                      { icon: ShieldCheck, val: approvalOrders.filter(o => o.status === 'pendiente').length.toString(), label: 'Para aprobación', link: 'Gestionar →', onClick: handleGoOrderApprovals }
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
                  </>
                )}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-5 mt-6">
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
                <QuickAccessCard onClick={handleGoOrderApprovals} icon={ShieldCheck} title="Aprobaciones" desc="Gestión de pedidos pendientes de firma." />
                <QuickAccessCard onClick={handleGoOrdersTracking} icon={Truck} title="Seguimiento" desc="Rastrea tus pedidos en tiempo real." />
                <QuickAccessCard onClick={handleGoUrgentOrder} icon={Zap} title="Pedido urgente" desc="Abastecimiento inmediato." />
                <QuickAccessCard onClick={() => handleGoAdvisorChat()} icon={UserIcon} title="Mi asesor" desc="Soporte especializado." />
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
      {isPublicPage && <PublicFooter onGoPage={(p) => setActivePage(p as any)} />}
              </>
            )}
          </motion.div>
  )}
</AnimatePresence>


      {/* Login Modal */}
      <LoginModal 
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLogin={(user) => {
          // Special handling for B2B Demo Login
          if (user.role === 'cliente_b2b') {
            const masterUser = companyAccount.users.find(u => u.email === user.email);
            if (masterUser) {
              setCurrentUser({
                ...user,
                accountRole: masterUser.role,
                companyAccountId: companyAccount.id,
                permissions: masterUser.permissions,
                assignedCityIds: masterUser.assignedCityIds,
                assignedBranchIds: masterUser.assignedBranchIds,
                assignedPointOfSaleIds: masterUser.assignedPointOfSaleIds,
                purchaseLimit: masterUser.purchaseLimit,
                requiresApprovalAbove: masterUser.requiresApprovalAbove
              });
            } else {
              setCurrentUser(user);
            }
          } else {
            setCurrentUser(user);
          }
          if (user.role === 'proveedor' || user.role === 'marca') {
            setActivePage('providerDashboard');
          } else if (user.role === 'hospitality_partner') {
            setActivePage('hospitalityPartnerDashboard');
          } else {
            resetToHome();
          }
        }}
        onRequestAccess={() => {
          setRequestAccessRole('client');
          setActivePage('request-access');
        }}
        companyAccount={companyAccount}
        onGoFAQ={handleGoFAQ}
        onGoLegalPage={handleGoLegalPage}
      />

      {/* Permission Restricted Modal */}
      <AnimatePresence>
        {permissionErrorModal?.open && (
          <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPermissionErrorModal(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-10 text-center shadow-2xl z-10"
            >
              <div className="w-20 h-20 bg-rojo/10 text-rojo rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck size={40} />
              </div>
              <h3 className="text-2xl font-black text-texto mb-2">Permiso requerido</h3>
              <p className="text-gris font-medium leading-relaxed mb-8">
                No tienes permisos suficientes para realizar esta acción o acceder a este módulo. 
                Contacta al administrador de tu cuenta para solicitar autorización.
              </p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => {
                    setPermissionErrorModal(null);
                    setActivePage('account');
                  }}
                  className="w-full bg-rojo text-white py-4 rounded-xl font-black shadow-lg hover:bg-rojo-oscuro transition-all"
                >
                  Ir a mi cuenta
                </button>
                <button 
                  onClick={() => {
                    setPermissionErrorModal(null);
                    handleGoAdvisorChat('soporte', { label: 'Permisos', type: 'solicitud_urgente', key: permissionErrorModal.permission });
                  }}
                  className="w-full py-4 text-rojo font-black hover:bg-rojo-suave rounded-xl transition-all"
                >
                  Hablar con asesor TBS
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
        onGoPromotions={handleGoPromotions}
      />

      <CookieConsentBanner 
        onGoCookiePolicy={handleGoCookiePolicy}
        onConsentChange={(prefs) => {
           analytics.track('cta_click', 'engagement', { 
             ctaLabel: 'Guardar preferencias cookies', 
             source: 'cookie_banner',
             target: 'cookie_consent' 
           });
        }}
      />

      {isPublicPage && <AgeGateNotice onGoLegalPage={handleGoLegalPage} />}

      <PackagingSelectorModal 
        product={packagingModalProduct}
        isOpen={!!packagingModalProduct}
        onClose={() => setPackagingModalProduct(null)}
        onConfirm={handleConfirmAddToCart}
      />

      <MobileMenuDrawer 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        currentUser={currentUser}
        activePage={activePage}
        onNavigate={(page) => setActivePage(page)}
        onLogout={handleLogout}
        onLogin={() => setLoginModalOpen(true)}
        onRequestAccess={() => openAuth('request')}
        hasPermission={hasPermission}
      />

      <FloatingActionButton 
        icon={ShoppingCart}
        label="Carrito"
        badgeCount={cartCount}
        onClick={() => setIsCartOpen(true)}
        show={isCliente && cartCount > 0 && !isCheckoutOpen}
        color="rojo"
      />

      <FloatingActionButton 
        icon={Zap}
        label="Urgente"
        onClick={handleGoUrgentOrder}
        show={isCliente && currentUser?.role === 'cliente_b2b' && activePage !== 'urgentOrder' && !isCheckoutOpen}
        position="bottom-left"
        color="texto"
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
