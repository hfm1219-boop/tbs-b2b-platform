export type AdPlacementType =
  | 'home_hero_secondary'
  | 'home_mid_banner'
  | 'catalog_top_banner'
  | 'catalog_mid_banner'
  | 'catalog_bottom_carousel'
  | 'category_featured_brand'
  | 'search_sponsored_result'
  | 'product_card_sponsored'
  | 'product_detail_premium'
  | 'campaign_page'
  | 'coupon_strip'
  | 'editorial_card'
  | 'provider_visibility';

export type AdFormat =
  | 'banner'
  | 'carousel'
  | 'featured_brand'
  | 'sponsored_product'
  | 'premium_product_card'
  | 'campaign_page'
  | 'coupon'
  | 'editorial_content'
  | 'sponsored_search'
  | 'segmented_campaign';

export type AdAudienceSegment =
  | 'todos'
  | 'cliente_b2b'
  | 'cliente_contado'
  | 'cliente_credito'
  | 'horeca'
  | 'bares'
  | 'restaurantes'
  | 'hoteles'
  | 'licoreras'
  | 'eventos'
  | 'proveedor_marca'
  | 'ciudad_cartagena'
  | 'ciudad_barranquilla'
  | 'premium';

export interface BrandAdCampaign {
  id: string;
  brandName: string;
  supplierName?: string;
  campaignName: string;
  format: AdFormat;
  placement: AdPlacementType;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  logo?: string;
  ctaLabel: string;
  ctaTarget:
    | 'catalog'
    | 'product'
    | 'category'
    | 'campaignPage'
    | 'promotions'
    | 'advisorChat'
    | 'accessRequestProvider'
    | 'blogArticle'
    | 'none';
  productId?: number;
  category?: string;
  campaignSlug?: string;
  couponCode?: string;
  discountLabel?: string;
  audienceSegments: AdAudienceSegment[];
  cityTargets?: string[];
  priority: number;
  active: boolean;
  sponsoredLabel?: string;
  startsAt?: string;
  endsAt?: string;
}

export interface CampaignPageData {
  id: string;
  slug: string;
  brandName: string;
  campaignName: string;
  title: string;
  subtitle: string;
  heroImage?: string;
  logo?: string;
  description: string;
  featuredProductIds: number[];
  benefits: string[];
  terms?: string[];
  ctaLabel: string;
}

export interface ProductPackagingOption {
  id: string;
  label: string; // Ej: "Caja x6"
  unitsPerPackage: number; // 6, 12, 24
  pricePerUnit?: number;
  packagePrice?: number;
  available: boolean;
  stockLabel?: string;
  isDefault?: boolean;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  specs: string;
  price: string;
  originalPrice?: string;
  image: string;
  description?: string;
  origin?: string;
  subcategory?: string;
  packagingOptions?: ProductPackagingOption[];
  selectedPackaging?: ProductPackagingOption;
  isUrgent?: boolean;
  previouslyPurchased?: boolean;
  isSponsored?: boolean;
  hasPromotion?: boolean;
  stockStatus?: 'available' | 'low_stock' | 'out_of_stock';
  suggestedSubstituteId?: number;
  requiresConfirmation?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  packaging?: ProductPackagingOption;
  packageQuantity?: number;
  totalUnits?: number;
  lineComment?: string;
  isConfirmed?: boolean;
}

export type UserRole = 'cliente_b2b' | 'proveedor' | 'marca' | 'admin' | 'hospitality_partner';

export type ClientAccountRole =
  | 'master'
  | 'administrador'
  | 'comprador'
  | 'aprobador'
  | 'finanzas'
  | 'consulta'
  | 'operador';

export type UserStatus =
  | 'activo'
  | 'pendiente'
  | 'inactivo'
  | 'bloqueado';

export type PermissionKey =
  | 'ver_catalogo'
  | 'crear_pedidos'
  | 'aprobar_pedidos'
  | 'ver_pedidos'
  | 'ver_cartera'
  | 'pagar_facturas'
  | 'ver_pagos'
  | 'pedido_urgente'
  | 'reordenar'
  | 'gestionar_listas'
  | 'ver_promociones'
  | 'ver_inteligencia'
  | 'hablar_asesor'
  | 'gestionar_usuarios'
  | 'gestionar_sucursales'
  | 'solicitar_credito'
  | 'configurar_aprobaciones'
  | 'crear_clientes_gestionados'
  | 'comprar_para_clientes'
  | 'programar_entregas_eventos'
  | 'ver_comisiones'
  | 'gestionar_eventos';

export interface B2BPermission {
  key: PermissionKey;
  label: string;
  description: string;
  category: 'compras' | 'finanzas' | 'operacion' | 'administracion' | 'comercial';
}

export interface B2BCity {
  id: string;
  name: string;
  active: boolean;
}

export interface B2BBranch {
  id: string;
  cityId: string;
  name: string;
  address: string;
  phone?: string;
  active: boolean;
}

export interface B2BPointOfSale {
  id: string;
  branchId: string;
  name: string;
  code: string;
  address?: string;
  active: boolean;
}

export interface B2BManagedUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: ClientAccountRole;
  status: UserStatus;
  assignedCityIds: string[];
  assignedBranchIds: string[];
  assignedPointOfSaleIds: string[];
  permissions: PermissionKey[];
  purchaseLimit?: number;
  requiresApprovalAbove?: number;
  createdAt: string;
  lastLogin?: string;
}

export interface B2BApprovalRule {
  id: string;
  name: string;
  active: boolean;
  appliesToCityIds: string[];
  appliesToBranchIds: string[];
  appliesToRole?: ClientAccountRole;
  minAmount: number;
  approverUserIds: string[];
  description: string;
}

export interface B2BUserActivity {
  id: string;
  userId: string;
  userName: string;
  action: string;
  detail: string;
  date: string;
  module: 'pedidos' | 'cartera' | 'usuarios' | 'sucursales' | 'pagos' | 'login' | 'listas' | 'credito' | 'sistema';
}

export interface B2BCompanyAccount {
  id: string;
  businessName: string;
  nit: string;
  accountType: 'empresa_multi_sede' | 'empresa_simple';
  cities: B2BCity[];
  branches: B2BBranch[];
  pointsOfSale: B2BPointOfSale[];
  users: B2BManagedUser[];
  approvalRules: B2BApprovalRule[];
  activities: B2BUserActivity[];
  settings: {
    approveOrdersOverLimit: boolean;
    notifyUrgentOrders: boolean;
    validateNewUsers: boolean;
  };
}

export interface BusinessContactInfo {
  businessName: string;
  legalName: string;
  nit?: string;
  address: string;
  city: string;
  region: string;
  country: string;
  phone: string;
  email?: string;
  website: string;
  businessHours?: string[];
  mapEmbedUrl?: string;
}

export interface ContactChannel {
  id: string;
  title: string;
  description: string;
  type: 'telefono' | 'formulario' | 'asesor' | 'proveedor' | 'soporte' | 'ubicacion';
  actionLabel: string;
  actionTarget:
    | 'call'
    | 'accessRequestClient'
    | 'accessRequestProvider'
    | 'advisorChat'
    | 'faq'
    | 'catalog';
}

export type AnalyticsUserRole =
  | 'visitante'
  | 'cliente_b2b'
  | 'comprador'
  | 'finanzas'
  | 'master'
  | 'aprobador'
  | 'proveedor'
  | 'marca'
  | 'admin'
  | 'desconocido';

export type AnalyticsEventCategory =
  | 'navigation'
  | 'public_acquisition'
  | 'authentication'
  | 'catalog'
  | 'cart'
  | 'checkout'
  | 'orders'
  | 'payments'
  | 'chat'
  | 'faq'
  | 'blog'
  | 'contact'
  | 'provider'
  | 'account_admin'
  | 'notifications'
  | 'trust'
  | 'error'
  | 'engagement'
  | 'advertising';

export type AnalyticsEventName =
  | 'page_view'
  | 'cta_click'
  | 'menu_click'
  | 'footer_link_click'
  | 'access_request_started'
  | 'access_request_submitted'
  | 'login_modal_opened'
  | 'login_success'
  | 'logout'
  | 'catalog_viewed'
  | 'catalog_search'
  | 'catalog_filter_used'
  | 'product_viewed'
  | 'product_added_to_cart'
  | 'packaging_selector_opened'
  | 'product_saved_to_list'
  | 'cart_opened'
  | 'cart_item_quantity_changed'
  | 'cart_cleared'
  | 'checkout_started'
  | 'checkout_submitted'
  | 'order_created'
  | 'order_pending_approval'
  | 'payment_page_viewed'
  | 'invoice_selected'
  | 'payment_simulated'
  | 'orders_tracking_viewed'
  | 'order_detail_viewed'
  | 'reorder_started'
  | 'urgent_order_started'
  | 'urgent_order_submitted'
  | 'advisor_chat_opened'
  | 'advisor_message_sent'
  | 'advisor_conversation_created'
  | 'faq_viewed'
  | 'faq_search'
  | 'faq_question_opened'
  | 'faq_feedback_submitted'
  | 'blog_index_viewed'
  | 'blog_article_viewed'
  | 'contact_viewed'
  | 'phone_click'
  | 'public_landing_viewed'
  | 'trust_page_viewed'
  | 'provider_dashboard_viewed'
  | 'provider_campaign_request_submitted'
  | 'account_admin_viewed'
  | 'managed_user_created'
  | 'permission_changed'
  | 'notification_opened'
  | 'notification_action_clicked'
  | 'permission_denied'
  | 'return_request_started'
  | 'return_product_search'
  | 'return_request_submitted'
  | 'credit_request_started'
  | 'credit_request_submitted'
  | 'credit_document_attached'
  | 'credit_request_detail_viewed'
  | 'ad_impression'
  | 'ad_click'
  | 'sponsored_product_viewed'
  | 'coupon_clicked'
  | 'campaign_page_viewed'
  | 'provider_price_template_downloaded'
  | 'provider_price_file_uploaded'
  | 'provider_price_import_validated'
  | 'provider_price_import_submitted'
  | 'provider_price_import_batch_viewed';

export type ProviderPriceImportStatus =
  | 'borrador'
  | 'validando'
  | 'listo_para_enviar'
  | 'enviado'
  | 'requiere_correccion'
  | 'rechazado'
  | 'aprobado';

export type ProviderPriceImportRowStatus =
  | 'valido'
  | 'advertencia'
  | 'error';

export interface ProviderPriceImportRow {
  id: string;
  rowNumber: number;
  productName: string;
  internalSku?: string;
  barcode: string;
  brandName: string;
  category: string;
  presentation: string;
  packaging: string;
  unitsPerPackage: number;
  baseCost: number;
  taxRate: number;
  exciseTax?: number;
  suggestedPrice?: number;
  minimumPrice?: number;
  currency: 'COP' | 'USD';
  effectiveFrom: string;
  notes?: string;
  status: ProviderPriceImportRowStatus;
  errors: string[];
  warnings: string[];
}

export interface ProviderPriceImportBatch {
  id: string;
  batchNumber: string;
  providerId: string;
  providerName: string;
  brandName: string;
  fileName: string;
  createdAt: string;
  effectiveFrom: string;
  status: ProviderPriceImportStatus;
  totalRows: number;
  validRows: number;
  warningRows: number;
  errorRows: number;
  rows: ProviderPriceImportRow[];
  disclaimerAccepted: boolean;
  submittedAt?: string;
}

export interface AnalyticsEventPayload {
  page?: string;
  path?: string;
  section?: string;
  ctaLabel?: string;
  source?: string;
  target?: string;
  userRole?: AnalyticsUserRole;
  accountRole?: string;
  customerType?: string;
  providerType?: string;
  productId?: string | number;
  productCategory?: string;
  productCount?: number;
  units?: number;
  cartValue?: number;
  orderValue?: number;
  paymentValue?: number;
  invoiceCount?: number;
  searchTerm?: string;
  filterName?: string;
  filterValue?: string;
  faqId?: string;
  articleSlug?: string;
  landingKey?: string;
  notificationType?: string;
  success?: boolean;
  reason?: string;
  metadata?: Record<string, string | number | boolean | null | undefined>;
}

export interface AnalyticsEvent {
  name: AnalyticsEventName;
  category: AnalyticsEventCategory;
  payload?: AnalyticsEventPayload;
  timestamp: string;
}

export interface User {
  id?: string;
  name: string;
  email: string;
  businessName: string;
  role: UserRole;
  city: string;
  address: string;
  customerType?: string;
  providerType?: 'marca' | 'importadora' | 'fabricante' | 'distribuidor' | 'aliado_logistico';
  creditLimit?: number;
  availableCredit?: number;
  creditRisk?: 'bajo' | 'atencion' | 'medio' | 'alto' | 'bloqueado';
  creditRiskScore?: number;
  accountRole?: ClientAccountRole;
  companyAccountId?: string;
  assignedCityIds?: string[];
  assignedBranchIds?: string[];
  assignedPointOfSaleIds?: string[];
  permissions?: PermissionKey[];
  purchaseLimit?: number;
  requiresApprovalAbove?: number;
  commercialCondition?: 'credito' | 'contado';
  paymentPolicy?: 'pago_anticipado' | 'pago_contra_entrega' | 'credito_aprobado';
  creditStatus?: 'sin_credito' | 'en_analisis' | 'aprobado' | 'bloqueado';
  
  // Hospitality Partner fields
  partnerType?: HospitalityPartnerType;
  hospitalityPartnerId?: string;
  commissionRuleId?: string;
  canCreateManagedClients?: boolean;
  canBuyForManagedClients?: boolean;
  canScheduleManagedDeliveries?: boolean;
  canViewCommissions?: boolean;
}

export type HospitalityPartnerType =
  | 'wedding_planner'
  | 'event_planner'
  | 'catering'
  | 'hotel_concierge'
  | 'bar_consultant'
  | 'hospitality_consultant'
  | 'agency'
  | 'other';

export type ManagedClientStatus =
  | 'borrador'
  | 'pendiente_validacion'
  | 'activo'
  | 'requiere_informacion'
  | 'rechazado'
  | 'inactivo';

export type ManagedClientBillingType =
  | 'facturar_cliente_final'
  | 'facturar_gestor'
  | 'por_definir';

export type HospitalityCommissionStatus =
  | 'estimada'
  | 'pendiente_liquidacion'
  | 'en_revision'
  | 'aprobada'
  | 'pagada'
  | 'rechazada';

export interface ManagedClient {
  id: string;
  clientCode?: string;
  businessName: string;
  legalName?: string;
  nit?: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  city: string;
  address?: string;
  clientType:
    | 'persona_natural'
    | 'empresa'
    | 'hotel'
    | 'restaurante'
    | 'evento'
    | 'club'
    | 'otro';
  billingType: ManagedClientBillingType;
  status: ManagedClientStatus;
  createdAt: string;
  notes?: string;
  assignedPartnerId: string;
  assignedPartnerName: string;
}

export interface ManagedEvent {
  id: string;
  eventName: string;
  managedClientId: string;
  managedClientName: string;
  eventType:
    | 'boda'
    | 'evento_corporativo'
    | 'banquete'
    | 'fiesta_privada'
    | 'evento_hotel'
    | 'activacion_marca'
    | 'otro';
  eventDate: string;
  city: string;
  venueName?: string;
  deliveryAddress: string;
  estimatedGuests?: number;
  deliveryWindow: string;
  status:
    | 'planeado'
    | 'pedido_en_preparacion'
    | 'entrega_programada'
    | 'entregado'
    | 'cerrado'
    | 'cancelado';
  notes?: string;
}

export interface HospitalityCommissionRule {
  id: string;
  partnerId: string;
  partnerName: string;
  commissionType: 'porcentaje_venta' | 'valor_fijo' | 'mixta';
  commissionPercent?: number;
  fixedAmount?: number;
  appliesToCategories?: string[];
  active: boolean;
  description: string;
}

export interface HospitalityCommission {
  id: string;
  partnerId: string;
  partnerName: string;
  managedClientId: string;
  managedClientName: string;
  orderId: string;
  orderNumber: string;
  eventId?: string;
  eventName?: string;
  orderDate: string;
  orderTotal: number;
  commissionBase: number;
  commissionPercent: number;
  commissionAmount: number;
  status: HospitalityCommissionStatus;
  paymentDate?: string;
  userDocumentUrl?: string;
  tbsProofOfPaymentUrl?: string;
  notes?: string;
}

export interface HospitalityPartnerProfile {
  id: string;
  userId: string;
  name: string;
  partnerType: HospitalityPartnerType;
  city: string;
  phone: string;
  email: string;
  status: 'activo' | 'pendiente' | 'inactivo';
  commissionRuleId: string;
  managedClientIds: string[];
  managedEventIds: string[];
}

export type ProviderInventoryModel =
  | 'compra_directa'
  | 'consignacion'
  | 'marketplace'
  | 'despacho_directo';

export type ProviderProductStatus =
  | 'activo'
  | 'pendiente'
  | 'agotado'
  | 'pausado';

export interface ProviderProduct {
  id: string;
  sku: string;
  name: string;
  category: string;
  brand: string;
  image?: string;
  inventoryModel: ProviderInventoryModel;
  status: ProviderProductStatus;
  stock: number;
  unitsSold: number;
  revenue: number;
  rotation: 'alta' | 'media' | 'baja';
  margin?: number;
  cityAvailability: string[];
}

export interface ProviderSalesMetric {
  month: string;
  revenue: number;
  units: number;
  orders: number;
}

export interface ProviderChannelMetric {
  channel: string;
  revenue: number;
  units: number;
  percentage: number;
}

export interface ProviderCityMetric {
  city: string;
  revenue: number;
  units: number;
  percentage: number;
}

export interface ProviderCampaign {
  id: string;
  name: string;
  type: 'promocion' | 'activacion' | 'visibilidad' | 'lanzamiento' | 'trade_marketing';
  status: 'activa' | 'programada' | 'finalizada' | 'pausada';
  startDate: string;
  endDate: string;
  budget?: number;
  revenueGenerated?: number;
  products: string[];
}

export interface ProviderSettlement {
  id: string;
  period: string;
  grossSales: number;
  commissions: number;
  logisticsFees: number;
  netPayable: number;
  status: 'pendiente' | 'en_revision' | 'pagada';
  paymentDate?: string;
}

export interface ProviderInsight {
  id: string;
  title: string;
  description: string;
  priority: 'alta' | 'media' | 'baja';
  actionLabel: string;
  actionTarget:
    | 'providerProducts'
    | 'providerCampaigns'
    | 'providerSettlements'
    | 'advisorChat'
    | 'providerReports';
}

export type PublicLandingKey = 'about' | 'clients' | 'providers' | 'services' | 'faq';

export type LegalPageKey =
  | 'privacy'
  | 'dataTreatment'
  | 'terms'
  | 'cookies'
  | 'ageNotice';

export interface LegalSection {
  id: string;
  title: string;
  body: string;
  bullets?: string[];
}

export interface LegalPageData {
  key: LegalPageKey;
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  updatedAt: string;
  intro: string;
  sections: LegalSection[];
}

export type CookieCategory =
  | 'essential'
  | 'functional'
  | 'analytics'
  | 'marketing';

export interface CookiePreference {
  category: CookieCategory;
  label: string;
  description: string;
  required: boolean;
  enabled: boolean;
}

export type BlogCategory =
  | 'guias_producto'
  | 'sector_licores'
  | 'eventos'
  | 'regalos_empresariales'
  | 'maridaje'
  | 'cocteleria'
  | 'proveedores_marcas'
  | 'tendencias'
  | 'turismo_premium'
  | 'operacion_b2b';

export interface BlogArticleSection {
  heading: string;
  body: string;
  bullets?: string[];
}

export interface BlogArticleFAQ {
  question: string;
  answer: string;
}

export interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  excerpt: string;
  category: BlogCategory;
  audience: 'publico' | 'cliente_b2b' | 'proveedor_marca' | 'todos';
  language: 'es' | 'en';
  author: string;
  publishedAt: string;
  readingTime: string;
  tags: string[];
  heroImage?: string;
  sections: BlogArticleSection[];
  faqs?: BlogArticleFAQ[];
  relatedLandingKeys?: PublicLandingKey[];
  primaryCtaLabel?: string;
  primaryCtaTarget?: 'accessRequest' | 'catalog' | 'faq' | 'providers' | 'clients' | 'services' | 'advisorChat';
}

export type ActivePage = 'home' | 'catalog' | 'category' | 'about' | 'clients' | 'providers' | 'services' | 'request-access' | 'checkout' | 'account' | 'payments' | 'ordersTracking' | 'reorder' | 'urgentOrder' | 'advisorChat' | 'notifications' | 'shoppingLists' | 'promotions' | 'intelligence' | 'providerDashboard' | 'providerProducts' | 'providerCampaigns' | 'providerSettlements' | 'providerReports' | 'b2bAccountAdmin' | 'orderApprovals' | 'faq' | 'blogIndex' | 'blogArticle' | 'contact' | 'legalIndex' | 'legalPage' | 'publicLanding' | 'trust' | 'creditRequest' | 'campaignPage' | 'hospitalityPartnerDashboard' | 'hospitalityPartners' | 'advertising';

export type FAQAudience =
  | 'publico'
  | 'cliente_b2b'
  | 'proveedor_marca'
  | 'todos';

export type FAQCategory =
  | 'general'
  | 'acceso'
  | 'comprar_en_tbs'
  | 'catalogo'
  | 'pedidos'
  | 'cartera_pagos'
  | 'seguimiento'
  | 'pedido_urgente'
  | 'cuenta_usuarios'
  | 'aprobaciones'
  | 'promociones'
  | 'listas_reordenar'
  | 'inteligencia'
  | 'asesor_chat'
  | 'proveedores_marcas'
  | 'servicios'
  | 'seguridad'
  | 'soporte';

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: FAQCategory;
  audience: FAQAudience;
  tags: string[];
  helpfulCount: number;
  notHelpfulCount: number;
  relatedActionLabel?: string;
  relatedActionTarget?:
    | 'accessRequest'
    | 'login'
    | 'catalog'
    | 'account'
    | 'payments'
    | 'ordersTracking'
    | 'urgentOrder'
    | 'reorder'
    | 'shoppingLists'
    | 'promotions'
    | 'intelligence'
    | 'advisorChat'
    | 'providerDashboard'
    | 'b2bAccountAdmin'
    | 'orderApprovals'
    | 'creditRequest';
}


export type InvoiceStatus = 'pendiente' | 'por_vencer' | 'vencida' | 'pagada';

export interface Invoice {
  id: string;
  number: string;
  issueDate: string;
  dueDate: string;
  value: number;
  balance: number;
  status: InvoiceStatus;
  orderNumber?: string;
  description?: string;
  daysOverdue?: number;
  daysUntilDue?: number;
  site?: string;
  city?: string;
  allowsPartialPayment?: boolean;
  minimumPartialPayment?: number;
  hasDispute?: boolean;
  paymentStatus?: 'pendiente' | 'en_validacion' | 'parcial' | 'pagada';
}

export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  method: string;
  reference: string;
  status: 'aprobado' | 'pendiente' | 'rechazado';
}

export type ViewMode = 'visitante' | 'cliente';

export type NotificationType =
  | 'pedido'
  | 'cartera'
  | 'pago'
  | 'chat'
  | 'pedido_urgente'
  | 'producto'
  | 'sistema'
  | 'comercial'
  | 'inteligencia'
  | 'credito'
  | 'mensaje';

export type NotificationPriority = 'alta' | 'media' | 'baja';

export interface TBSNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  priority: NotificationPriority;
  actionLabel?: string;
  actionTarget?: 
    | 'ordersTracking'
    | 'payments'
    | 'advisorChat'
    | 'urgentOrder'
    | 'reorder'
    | 'catalog'
    | 'account'
    | 'shoppingLists'
    | 'promotions'
    | 'intelligence'
    | 'orderApprovals'
    | 'creditRequest'
    | 'hospitalityPartnerDashboard'
    | 'legalPage';
  context?: {
    label?: string;
    value?: string;
    entityType?: 'pedido' | 'factura' | 'producto' | 'chat' | 'solicitud_urgente' | 'credit_request';
  };
}

export type ConversationTopic =
  | 'pedido'
  | 'cartera'
  | 'producto'
  | 'pedido_urgente'
  | 'activacion'
  | 'soporte'
  | 'otro';

export interface Advisor {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  availability: string;
  status: 'en_linea' | 'ocupado' | 'fuera_de_horario';
  avatar?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'cliente' | 'asesor' | 'sistema';
  text: string;
  createdAt: string;
  attachmentLabel?: string;
  attachmentType?: 'pedido' | 'factura' | 'producto' | 'solicitud_urgente';
}

export interface Conversation {
  id: string;
  topic: ConversationTopic;
  title: string;
  status: 'abierta' | 'en_revision' | 'resuelta';
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export type OrderStatus =
  | 'recibido'
  | 'validacion_cartera'
  | 'en_preparacion'
  | 'facturado'
  | 'programado'
  | 'programado_hoy'
  | 'en_ruta'
  | 'entregado'
  | 'con_novedad'
  | 'reprogramado'
  | 'entrega_parcial'
  | 'rechazado'
  | 'cancelado'
  | 'pendiente'
  | 'en_validacion'
  | 'aprobado'
  | 'preparando'
  | 'en_transito'
  | 'novedad';

export interface OrderProduct {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unitPrice: number;
  image?: string;
  presentation?: string;
  dispatchedQty?: number;
  deliveredQty?: number;
  pendingQty?: number;
  lineStatus?: 'completo' | 'pendiente' | 'sustituido' | 'no_entregado' | 'entregado_parcial';
  notes?: string;
}

export interface OrderTimelineEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  completed: boolean;
}

export interface OrderIssue {
  id: string;
  type: string;
  description: string;
  date: string;
  status: 'abierta' | 'resuelta' | 'en_revision';
}

export interface CustomerOrder {
  id: string;
  number: string;
  date: string;
  status: OrderStatus;
  total: number;
  units: number;
  deliveryCity: string;
  deliveryAddress: string;
  deliveryWindow: string;
  estimatedDelivery: string;
  paymentMethod: string;
  advisorName: string;
  advisorPhone?: string;
  transporter?: string;
  trackingCode?: string;
  documentNumber?: string;
  invoiceNumber?: string;
  deliveryDocumentNumber?: string;
  nextStep?: string;
  orderType?: 'normal' | 'urgente' | 'programado';
  isUrgent?: boolean;
  receivingContact?: string;
  siteName?: string;
  isRescheduled?: boolean;
  hasPartialDelivery?: boolean;
  requiresCustomerAction?: boolean;
  hospitalityPartnerId?: string;
  hospitalityPartnerName?: string;
  products: OrderProduct[];
  timeline: OrderTimelineEvent[];
  issues?: OrderIssue[];
}

export type ReturnReason =
  | 'producto_no_solicitado'
  | 'producto_averiado'
  | 'producto_vencido'
  | 'cantidad_incorrecta'
  | 'error_en_facturacion'
  | 'pedido_duplicado'
  | 'calidad_no_conforme'
  | 'otro';

export type ReturnRequestStatus =
  | 'borrador'
  | 'enviada'
  | 'en_revision'
  | 'aprobada'
  | 'rechazada'
  | 'recogida_programada'
  | 'cerrada';

export interface ReturnRequestLine {
  id: string;
  productId?: number;
  productName: string;
  category: string;
  orderedQuantity: number;
  returnQuantity: number;
  unitPrice: number;
  reason: ReturnReason;
  reasonDetail?: string;
}

export interface ReturnRequest {
  id: string;
  requestNumber: string;
  orderId: string;
  orderNumber: string;
  documentNumber?: string;
  createdAt: string;
  status: ReturnRequestStatus;
  customerName: string;
  businessName: string;
  city: string;
  branchName?: string;
  deliveryAddress?: string;
  pickupPreference?: string;
  generalReason?: string;
  lines: ReturnRequestLine[];
  notes?: string;
}

export interface ProductOrderMatch {
  orderId: string;
  orderNumber: string;
  documentNumber?: string;
  orderDate: string;
  deliveryCity: string;
  deliveryAddress: string;
  productId?: number;
  productName: string;
  category: string;
  quantity: number;
  unitPrice: number;
  isLatest: boolean;
}

export interface ReorderProduct {
  id: string;
  productId?: number;
  name: string;
  category: string;
  specs: string;
  image?: string;
  lastPrice: number;
  suggestedQuantity: number;
  available: boolean;
  stockLabel: string;
}

export interface ReorderGroup {
  id: string;
  title: string;
  description: string;
  type: 'pedido_anterior' | 'lista_frecuente' | 'recomendado';
  lastOrderDate?: string;
  orderNumber?: string;
  products: ReorderProduct[];
}

export type UrgentReason =
  | 'ruptura_inventario'
  | 'evento'
  | 'alta_demanda'
  | 'cliente_vip'
  | 'reposición_fin_semana'
  | 'otro';

export interface UrgentProduct {
  id: string;
  productId?: number;
  name: string;
  category: string;
  specs: string;
  image?: string;
  estimatedPrice: number;
  availableForUrgent: boolean;
  stockLabel: string;
  suggestedQuantity: number;
}

export interface UrgentOrderRequest {
  id: string;
  reason: UrgentReason;
  city: string;
  address: string;
  deliveryWindow: string;
  contactName: string;
  contactPhone: string;
  notes?: string;
  products: Array<{
    product: UrgentProduct;
    quantity: number;
  }>;
  estimatedTotal: number;
  status: 'recibida' | 'en_validacion' | 'aprobada' | 'rechazada';
}

export interface ShoppingListProduct {
  id: string;
  productId?: number;
  name: string;
  category: string;
  specs: string;
  image?: string;
  price: number;
  suggestedQuantity: number;
  available: boolean;
  stockLabel: string;
  addedAt: string;
}

export interface ShoppingList {
  id: string;
  name: string;
  description: string;
  type: 'personalizada' | 'frecuente' | 'recomendada' | 'evento' | 'sede';
  createdAt: string;
  updatedAt: string;
  products: ShoppingListProduct[];
}

export type PromotionType =
  | 'descuento_por_volumen'
  | 'combo'
  | 'precio_especial'
  | 'marca_destacada'
  | 'recompra'
  | 'temporada'
  | 'liquidacion'
  | 'activacion';

export type PromotionStatus =
  | 'activa'
  | 'programada'
  | 'vencida'
  | 'agotada';

export interface PromotionCondition {
  minUnits?: number;
  minAmount?: number;
  customerTypes?: string[];
  cities?: string[];
  validFrom: string;
  validUntil: string;
  requiresApproval?: boolean;
  notes?: string;
}

export interface PromotionProduct {
  productId?: number;
  name: string;
  category: string;
  specs: string;
  image?: string;
  regularPrice: number;
  promoPrice?: number;
  discountPercent?: number;
  requiredQuantity?: number;
  available: boolean;
}

export interface B2BPromotion {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  type: PromotionType;
  status: PromotionStatus;
  brand?: string;
  category: string;
  badge: string;
  priority: 'alta' | 'media' | 'baja';
  products: PromotionProduct[];
  condition: PromotionCondition;
  image?: string;
}

export interface AppliedPromotion {
  promotionId: string;
  title: string;
  discountValue: number;
  description: string;
}

export interface MonthlyPurchaseMetric {
  month: string;
  total: number;
  orders: number;
  units: number;
}

export interface CategoryConsumption {
  category: string;
  total: number;
  units: number;
  percentage: number;
}

export interface TopPurchasedProduct {
  productId?: number;
  name: string;
  category: string;
  image?: string;
  units: number;
  total: number;
  lastPurchaseDate: string;
  suggestedReorderDate: string;
  trend: 'sube' | 'estable' | 'baja';
}

export type InsightPriority = 'alta' | 'media' | 'baja';

export type InsightType =
  | 'recompra'
  | 'cartera'
  | 'promocion'
  | 'rotacion'
  | 'categoria'
  | 'pedido_urgente'
  | 'asesor'
  | 'lista';

export interface CustomerInsight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  priority: InsightPriority;
  actionLabel: string;
  actionTarget:
    | 'reorder'
    | 'payments'
    | 'promotions'
    | 'advisorChat'
    | 'urgentOrder'
    | 'shoppingLists'
    | 'catalog'
    | 'intelligence';
  context?: string;
}

export interface CustomerIntelligenceSummary {
  currentMonthTotal: number;
  previousMonthTotal: number;
  currentMonthOrders: number;
  currentMonthUnits: number;
  averageOrderValue: number;
  pendingInvoices: number;
  urgentOrdersUsed: number;
  estimatedSavings: number;
}

export type ApprovalStatus =
  | 'pendiente'
  | 'aprobado'
  | 'rechazado'
  | 'devuelto'
  | 'vencido';

export type ApprovalReason =
  | 'supera_limite_usuario'
  | 'supera_regla_sucursal'
  | 'supera_regla_ciudad'
  | 'pedido_urgente'
  | 'promocion_requiere_validacion'
  | 'manual';

export interface ApprovalOrderLine {
  id: string;
  productId?: number;
  name: string;
  category: string;
  specs: string;
  image?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface ApprovalDecision {
  id: string;
  userId: string;
  userName: string;
  decision: 'aprobado' | 'rechazado' | 'devuelto';
  comment: string;
  date: string;
}

export interface PendingApprovalOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  createdByUserId: string;
  createdByUserName: string;
  cityId: string;
  cityName: string;
  branchId: string;
  branchName: string;
  pointOfSaleId?: string;
  pointOfSaleName?: string;
  status: ApprovalStatus;
  reason: ApprovalReason;
  reasonLabel: string;
  total: number;
  userPurchaseLimit?: number;
  approvalThreshold?: number;
  paymentMethod: string;
  deliveryWindow: string;
  deliveryAddress: string;
  notes?: string;
  lines: ApprovalOrderLine[];
  approverUserIds: string[];
  decisions: ApprovalDecision[];
}

export type CreditRequestType = 'nuevo_credito' | 'aumento_cupo' | 'actualizacion_datos';
export type CreditRequestStatus = 'borrador' | 'enviada' | 'en_analisis' | 'aprobada' | 'rechazada' | 'devuelta';
export type CreditDocumentType = 'rut' | 'camara_comercio' | 'estados_financieros' | 'cedula_representante' | 'referencia_comercial' | 'otro' | 'pagare';

export interface CreditAttachment {
  id: string;
  type: CreditDocumentType;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  status: 'pendiente' | 'validado' | 'error';
}

export interface CreditReference {
  id: string;
  companyName: string;
  contactName: string;
  phone: string;
  relationshipType: 'proveedor' | 'banco' | 'comercial';
}

export interface CreditRequest {
  id: string;
  number: string;
  requestType: CreditRequestType;
  status: CreditRequestStatus;
  createdAt: string;
  updatedAt: string;
  businessName: string;
  nit: string;
  city: string;
  businessType: string;
  requestedAmount: number;
  currentCreditLimit?: number;
  averageMonthlyPurchase?: number;
  paymentTermRequested?: string;
  legalRepresentativeName: string;
  legalRepresentativeId: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  monthlySalesRange?: string;
  yearsInBusiness?: string;
  hasOtherSuppliersCredit?: boolean;
  references: CreditReference[];
  attachments: CreditAttachment[];
  history: Array<{
    status: CreditRequestStatus;
    date: string;
    comment: string;
    userId: string;
    userName: string;
  }>;
}
