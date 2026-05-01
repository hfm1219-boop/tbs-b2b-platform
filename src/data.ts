import { Product, TBSNotification } from './types';

export const PRODUCTS: Product[] = [
  // Whisky
  { 
    id: 1, 
    name: "Old Parr 12 Años", 
    category: "Whisky", 
    specs: "750ml • 40% Alc.", 
    price: "$ 145.000", 
    image: "https://images.unsplash.com/photo-1527281473222-f9e87be50519?auto=format&fit=crop&q=80&w=400",
    description: "Un whisky escocés blend de malta y grado premium, conocido por su suavidad excepcional y notas ricas de miel, frutas y un toque de humo.",
    origin: "Escocia",
    subcategory: "Blended Scotch"
  },
  { 
    id: 2, 
    name: "Johnnie Walker Black Label", 
    category: "Whisky", 
    specs: "1L • 40% Alc.", 
    price: "$ 185.000", 
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=400",
    description: "El referente de los whiskies escoceses de lujo. Una mezcla compleja de más de 40 whiskies, cada uno madurado por al menos 12 años.",
    origin: "Escocia",
    subcategory: "Blended Scotch"
  },
  { 
    id: 3, 
    name: "Buchanan's Deluxe 12", 
    category: "Whisky", 
    specs: "750ml • 40% Alc.", 
    price: "$ 155.000", 
    image: "https://images.unsplash.com/photo-1614313511387-1436a4480ebb?auto=format&fit=crop&q=80&w=400",
    description: "Reconocido por su suavidad y perfil afrutado. Perfecto para disfrutar solo, con hielo o en coctelería premium.",
    origin: "Escocia",
    subcategory: "Blended Scotch"
  },
  // Ron
  { 
    id: 4, 
    name: "Ron Viejo de Caldas Juan de la Cruz", 
    category: "Ron", 
    specs: "750ml • 35% Alc.", 
    price: "$ 65.000", 
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=400",
    description: "Ron colombiano añejado en barricas de roble blanco. Notas dulces de caramelo y vainilla con un final suave.",
    origin: "Colombia",
    subcategory: "Añejo"
  },
  { 
    id: 5, 
    name: "Ron Zacapa 23 Solera", 
    category: "Ron", 
    specs: "750ml • 40% Alc.", 
    price: "$ 240.000", 
    image: "https://images.unsplash.com/photo-1527281473222-f9e87be50519?auto=format&fit=crop&q=80&w=400",
    description: "Considerado uno de los mejores rones del mundo. Mezcla de rones de 6 a 23 años, añejados bajo el sistema solera en las tierras altas de Guatemala.",
    origin: "Guatemala",
    subcategory: "Premium"
  },
  // Ginebra
  { 
    id: 6, 
    name: "Tanqueray London Dry", 
    category: "Ginebra", 
    specs: "750ml • 47% Alc.", 
    price: "$ 115.000", 
    image: "https://images.unsplash.com/photo-1551538666-80029b3ae383?auto=format&fit=crop&q=80&w=400",
    description: "La ginebra más galardonada del mundo. Su receta equilibrada de cuatro botánicos base (enebro, cilantro, angélica y regaliz) la hace inconfundible.",
    origin: "Reino Unido",
    subcategory: "London Dry"
  },
  { 
    id: 7, 
    name: "Hendrick's Gin", 
    category: "Ginebra", 
    specs: "750ml • 44% Alc.", 
    price: "$ 185.000", 
    image: "https://images.unsplash.com/photo-1551538666-80029b3ae383?auto=format&fit=crop&q=80&w=400",
    description: "Infundida con pétalos de rosa y pepino, Hendrick's ofrece una experiencia refrescante y única en el mundo de las ginebras premium.",
    origin: "Escocia",
    subcategory: "Premium"
  },
  // Tequila
  { 
    id: 8, 
    name: "Don Julio Reposado", 
    category: "Tequila y mezcal", 
    specs: "750ml • 38% Alc.", 
    price: "$ 210.000", 
    image: "https://images.unsplash.com/photo-1516535794938-6063878f28cc?auto=format&fit=crop&q=80&w=400",
    description: "Tequila 100% de agave azul, añejado por ocho meses en barricas de roble blanco americano. Color ambarino y sabor rico y suave.",
    origin: "México",
    subcategory: "Reposado"
  },
];

export const NOTIFICATIONS: TBSNotification[] = [
  {
    id: "notif-001",
    type: "pedido",
    title: "Pedido en tránsito",
    message: "Tu pedido TBS-10245 salió a ruta y será entregado hoy entre 2:00 p.m. y 5:00 p.m.",
    createdAt: "Hoy, 1:15 p.m.",
    read: false,
    priority: "alta",
    actionLabel: "Ver seguimiento",
    actionTarget: "ordersTracking",
    context: {
      label: "Pedido",
      value: "TBS-10245",
      entityType: "pedido"
    }
  },
  {
    id: "notif-002",
    type: "chat",
    title: "Nuevo mensaje de Laura Gómez",
    message: "El pedido ya fue preparado y está programado para salir en la ruta de la tarde.",
    createdAt: "Hoy, 10:30 a.m.",
    read: false,
    priority: "media",
    actionLabel: "Abrir chat",
    actionTarget: "advisorChat",
    context: {
      label: "Conversación",
      value: "conv-001",
      entityType: "chat"
    }
  },
  {
    id: "notif-003",
    type: "cartera",
    title: "Factura próxima a vencer",
    message: "La factura FV-88321 vence el 8 de mayo. Puedes pagarla desde cartera y pagos.",
    createdAt: "Ayer, 4:20 p.m.",
    read: false,
    priority: "alta",
    actionLabel: "Pagar factura",
    actionTarget: "payments",
    context: {
      label: "Factura",
      value: "FV-88321",
      entityType: "factura"
    }
  },
  {
    id: "notif-004",
    type: "pedido_urgente",
    title: "Solicitud urgente recibida",
    message: "Tu solicitud urgente fue recibida y está en validación logística.",
    createdAt: "Ayer, 2:05 p.m.",
    read: true,
    priority: "media",
    actionLabel: "Ver seguimiento",
    actionTarget: "ordersTracking",
    context: {
      label: "Solicitud",
      value: "URG-1020",
      entityType: "solicitud_urgente"
    }
  },
  {
    id: "notif-005",
    type: "producto",
    title: "Producto disponible para recompra",
    message: "Whisky Premium 750 ml vuelve a estar disponible para tu ciudad.",
    createdAt: "30 abr, 9:10 a.m.",
    read: true,
    priority: "baja",
    actionLabel: "Reordenar",
    actionTarget: "reorder",
    context: {
      label: "Producto",
      value: "Whisky Premium 750 ml",
      entityType: "producto"
    }
  },
  {
    id: "notif-006",
    type: "comercial",
    title: "Recomendación para fin de semana",
    message: "Por tu historial de compra, te recomendamos programar reposición antes del jueves.",
    createdAt: "29 abr, 8:00 a.m.",
    read: true,
    priority: "baja",
    actionLabel: "Reordenar pedido",
    actionTarget: "reorder"
  }
];
