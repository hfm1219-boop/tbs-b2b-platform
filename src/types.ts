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

export interface User {
  name: string;
  email: string;
  businessName: string;
  role: 'cliente_b2b' | 'proveedor' | 'admin';
  city: string;
  address: string;
  customerType: string;
  creditLimit?: number;
  availableCredit?: number;
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

export type ActivePage = 'home' | 'category' | 'about' | 'clients' | 'providers' | 'services' | 'request-access' | 'checkout' | 'account' | 'payments' | 'ordersTracking' | 'reorder' | 'urgentOrder' | 'advisorChat' | 'notifications';

export type NotificationType =
  | 'pedido'
  | 'cartera'
  | 'pago'
  | 'chat'
  | 'pedido_urgente'
  | 'producto'
  | 'sistema'
  | 'comercial';

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
    | 'account';
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
