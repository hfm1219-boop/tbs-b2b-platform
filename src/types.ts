export interface Product {
  id: number;
  name: string;
  category: string;
  specs: string;
  price: string;
  image: string;
  description?: string;
  origin?: string;
  subcategory?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type UserRole = 'cliente_b2b' | 'proveedor' | 'marca' | 'admin';

export type ClientAccountRole =
  | 'master'
  | 'administrador'
  | 'comprador'
  | 'aprobador'
  | 'finanzas'
  | 'consulta';

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
  | 'configurar_aprobaciones';

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
  module: 'pedidos' | 'cartera' | 'usuarios' | 'sucursales' | 'pagos' | 'login' | 'listas';
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
  accountRole?: ClientAccountRole;
  companyAccountId?: string;
  assignedCityIds?: string[];
  assignedBranchIds?: string[];
  assignedPointOfSaleIds?: string[];
  permissions?: PermissionKey[];
  purchaseLimit?: number;
  requiresApprovalAbove?: number;
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

export type ActivePage = 'home' | 'category' | 'about' | 'clients' | 'providers' | 'services' | 'request-access' | 'checkout' | 'account' | 'payments' | 'ordersTracking' | 'reorder' | 'urgentOrder' | 'advisorChat' | 'notifications' | 'shoppingLists' | 'promotions' | 'intelligence' | 'providerDashboard' | 'providerProducts' | 'providerCampaigns' | 'providerSettlements' | 'providerReports' | 'b2bAccountAdmin' | 'orderApprovals' | 'faq';

export type FAQAudience =
  | 'publico'
  | 'cliente_b2b'
  | 'proveedor_marca'
  | 'todos';

export type FAQCategory =
  | 'general'
  | 'acceso'
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
    | 'orderApprovals';
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
  | 'inteligencia';

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
    | 'orderApprovals';
  context?: {
    label?: string;
    value?: string;
    entityType?: 'pedido' | 'factura' | 'producto' | 'chat' | 'solicitud_urgente';
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
  | 'en_validacion'
  | 'aprobado'
  | 'preparando'
  | 'en_transito'
  | 'entregado'
  | 'novedad'
  | 'cancelado';

export interface OrderProduct {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unitPrice: number;
  image?: string;
}

export interface OrderTimelineEvent {
  id: string;
  title: string;
  description: string;
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
  advisorPhone: string;
  transporter?: string;
  trackingCode?: string;
  products: OrderProduct[];
  timeline: OrderTimelineEvent[];
  issues?: OrderIssue[];
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
