import { 
  Product, 
  TBSNotification, 
  ShoppingList, 
  B2BPromotion, 
  CustomerIntelligenceSummary, 
  MonthlyPurchaseMetric, 
  CategoryConsumption, 
  TopPurchasedProduct, 
  CustomerInsight,
  ProviderProduct,
  ProviderSalesMetric,
  ProviderChannelMetric,
  ProviderCityMetric,
  ProviderCampaign,
  ProviderSettlement,
  ProviderInsight,
  B2BPermission,
  B2BCompanyAccount,
  B2BManagedUser,
  B2BUserActivity,
  PendingApprovalOrder,
  FAQItem
} from './types';

export const B2B_PERMISSIONS: B2BPermission[] = [
  {
    key: "ver_catalogo",
    label: "Ver catálogo",
    description: "Puede consultar productos, categorías y disponibilidad.",
    category: "compras"
  },
  {
    key: "crear_pedidos",
    label: "Crear pedidos",
    description: "Puede agregar productos al carrito y crear pedidos.",
    category: "compras"
  },
  {
    key: "aprobar_pedidos",
    label: "Aprobar pedidos",
    description: "Puede aprobar pedidos creados por otros usuarios.",
    category: "compras"
  },
  {
    key: "ver_pedidos",
    label: "Ver pedidos",
    description: "Puede consultar pedidos y seguimiento.",
    category: "operacion"
  },
  {
    key: "ver_cartera",
    label: "Ver cartera",
    description: "Puede consultar facturas, cupo y vencimientos.",
    category: "finanzas"
  },
  {
    key: "pagar_facturas",
    label: "Pagar facturas",
    description: "Puede realizar pagos de facturas desde el portal.",
    category: "finanzas"
  },
  {
    key: "ver_pagos",
    label: "Ver pagos",
    description: "Puede consultar pagos realizados.",
    category: "finanzas"
  },
  {
    key: "pedido_urgente",
    label: "Pedido urgente",
    description: "Puede solicitar pedidos urgentes sujetos a validación.",
    category: "operacion"
  },
  {
    key: "reordenar",
    label: "Reordenar",
    description: "Puede repetir pedidos anteriores y compras frecuentes.",
    category: "compras"
  },
  {
    key: "gestionar_listas",
    label: "Gestionar listas",
    description: "Puede crear y editar listas de compra.",
    category: "compras"
  },
  {
    key: "ver_promociones",
    label: "Ver promociones",
    description: "Puede consultar promociones y condiciones comerciales.",
    category: "comercial"
  },
  {
    key: "ver_inteligencia",
    label: "Ver inteligencia B2B",
    description: "Puede consultar reportes e inteligencia de compra.",
    category: "comercial"
  },
  {
    key: "hablar_asesor",
    label: "Hablar con asesor",
    description: "Puede comunicarse con el asesor TBS desde el chat interno.",
    category: "operacion"
  },
  {
    key: "gestionar_usuarios",
    label: "Gestionar usuarios",
    description: "Puede crear, editar y desactivar usuarios de la cuenta.",
    category: "administracion"
  },
  {
    key: "gestionar_sucursales",
    label: "Gestionar sucursales",
    description: "Puede administrar ciudades, sucursales y puntos de venta.",
    category: "administracion"
  },
  {
    key: "configurar_aprobaciones",
    label: "Configurar aprobaciones",
    description: "Puede crear reglas de aprobación para pedidos.",
    category: "administracion"
  }
];

export const B2B_COMPANY_ACCOUNT: B2BCompanyAccount = {
  id: "acct-001",
  businessName: "Grupo Restaurante Demo",
  nit: "900.123.456-7",
  accountType: "empresa_multi_sede",
  cities: [
    { id: "city-ctg", name: "Cartagena", active: true },
    { id: "city-baq", name: "Barranquilla", active: true },
    { id: "city-smr", name: "Santa Marta", active: true }
  ],
  branches: [
    {
      id: "branch-ctg-001",
      cityId: "city-ctg",
      name: "Sucursal Bocagrande",
      address: "Bocagrande, Carrera 3 #8-45",
      phone: "605 111 2233",
      active: true
    },
    {
      id: "branch-ctg-002",
      cityId: "city-ctg",
      name: "Sucursal Centro",
      address: "Centro Histórico, Calle del Arsenal #10-20",
      phone: "605 222 3344",
      active: true
    },
    {
      id: "branch-baq-001",
      cityId: "city-baq",
      name: "Sucursal Norte Barranquilla",
      address: "Alto Prado, Carrera 53 #80-120",
      phone: "605 333 4455",
      active: true
    },
    {
      id: "branch-smr-001",
      cityId: "city-smr",
      name: "Sucursal Rodadero",
      address: "Rodadero, Carrera 1 #7-90",
      phone: "605 444 5566",
      active: true
    }
  ],
  pointsOfSale: [
    {
      id: "pos-001",
      branchId: "branch-ctg-001",
      name: "Bar principal Bocagrande",
      code: "BOC-BAR-01",
      address: "Piso 1",
      active: true
    },
    {
      id: "pos-002",
      branchId: "branch-ctg-001",
      name: "Restaurante Bocagrande",
      code: "BOC-RES-01",
      address: "Piso 2",
      active: true
    },
    {
      id: "pos-003",
      branchId: "branch-ctg-002",
      name: "Bar rooftop Centro",
      code: "CTR-ROOF-01",
      address: "Terraza",
      active: true
    },
    {
      id: "pos-004",
      branchId: "branch-baq-001",
      name: "Bar Norte",
      code: "BAQ-BAR-01",
      address: "Piso 1",
      active: true
    },
    {
      id: "pos-005",
      branchId: "branch-smr-001",
      name: "Restaurante Rodadero",
      code: "SMR-RES-01",
      address: "Lobby",
      active: true
    }
  ],
  users: [
    {
      id: "user-001",
      name: "Humberto",
      email: "humberto@demo.com",
      phone: "300 111 2233",
      role: "master",
      status: "activo",
      assignedCityIds: ["city-ctg", "city-baq", "city-smr"],
      assignedBranchIds: ["branch-ctg-001", "branch-ctg-002", "branch-baq-001", "branch-smr-001"],
      assignedPointOfSaleIds: ["pos-001", "pos-002", "pos-003", "pos-004", "pos-005"],
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
      purchaseLimit: 50000000,
      requiresApprovalAbove: 0,
      createdAt: "2026-04-01",
      lastLogin: "Hoy, 8:15 a.m."
    },
    {
      id: "user-002",
      name: "María Compras",
      email: "maria.compras@demo.com",
      phone: "300 222 3344",
      role: "comprador",
      status: "activo",
      assignedCityIds: ["city-ctg"],
      assignedBranchIds: ["branch-ctg-001", "branch-ctg-002"],
      assignedPointOfSaleIds: ["pos-001", "pos-002", "pos-003"],
      permissions: [
        "ver_catalogo",
        "crear_pedidos",
        "ver_pedidos",
        "pedido_urgente",
        "reordenar",
        "gestionar_listas",
        "hablar_asesor"
      ],
      purchaseLimit: 3500000,
      requiresApprovalAbove: 2500000,
      createdAt: "2026-04-05",
      lastLogin: "Ayer, 5:10 p.m."
    },
    {
      id: "user-003",
      name: "Carlos Finanzas",
      email: "carlos.finanzas@demo.com",
      phone: "300 333 4455",
      role: "finanzas",
      status: "activo",
      assignedCityIds: ["city-ctg", "city-baq", "city-smr"],
      assignedBranchIds: ["branch-ctg-001", "branch-ctg-002", "branch-baq-001", "branch-smr-001"],
      assignedPointOfSaleIds: [],
      permissions: [
        "ver_pedidos",
        "ver_cartera",
        "pagar_facturas",
        "ver_pagos",
        "hablar_asesor"
      ],
      purchaseLimit: 0,
      requiresApprovalAbove: 0,
      createdAt: "2026-04-08",
      lastLogin: "Hoy, 7:50 a.m."
    },
    {
      id: "user-004",
      name: "Ana Aprobadora",
      email: "ana.aprobadora@demo.com",
      phone: "300 444 5566",
      role: "aprobador",
      status: "activo",
      assignedCityIds: ["city-baq", "city-smr"],
      assignedBranchIds: ["branch-baq-001", "branch-smr-001"],
      assignedPointOfSaleIds: ["pos-004", "pos-005"],
      permissions: [
        "ver_catalogo",
        "aprobar_pedidos",
        "ver_pedidos",
        "ver_cartera",
        "ver_inteligencia",
        "hablar_asesor"
      ],
      purchaseLimit: 12000000,
      requiresApprovalAbove: 0,
      createdAt: "2026-04-12",
      lastLogin: "30 abr, 11:20 a.m."
    },
    {
      id: "user-005",
      name: "Pedro Consulta",
      email: "pedro.consulta@demo.com",
      phone: "300 555 6677",
      role: "consulta",
      status: "pendiente",
      assignedCityIds: ["city-ctg"],
      assignedBranchIds: ["branch-ctg-001"],
      assignedPointOfSaleIds: ["pos-001"],
      permissions: [
        "ver_catalogo",
        "ver_pedidos"
      ],
      purchaseLimit: 0,
      requiresApprovalAbove: 0,
      createdAt: "2026-05-01"
    }
  ],
  approvalRules: [
    {
      id: "rule-001",
      name: "Aprobación pedidos Cartagena sobre $2.500.000",
      active: true,
      appliesToCityIds: ["city-ctg"],
      appliesToBranchIds: ["branch-ctg-001", "branch-ctg-002"],
      appliesToRole: "comprador",
      minAmount: 2500000,
      approverUserIds: ["user-001"],
      description: "Los compradores de Cartagena requieren aprobación del master para pedidos superiores a $2.500.000."
    },
    {
      id: "rule-002",
      name: "Aprobación pedidos Barranquilla y Santa Marta",
      active: true,
      appliesToCityIds: ["city-baq", "city-smr"],
      appliesToBranchIds: ["branch-baq-001", "branch-smr-001"],
      appliesToRole: "comprador",
      minAmount: 1500000,
      approverUserIds: ["user-004", "user-001"],
      description: "Pedidos de compradores en Barranquilla y Santa Marta requieren aprobación desde $1.500.000."
    }
  ],
  activities: [
    {
      id: "act-001",
      userId: "user-002",
      userName: "María Compras",
      action: "Creó pedido",
      detail: "Pedido TBS-10245 por $1.850.000 para Sucursal Bocagrande.",
      date: "Hoy, 8:35 a.m.",
      module: "pedidos"
    },
    {
      id: "act-002",
      userId: "user-003",
      userName: "Carlos Finanzas",
      action: "Consultó cartera",
      detail: "Revisó facturas pendientes y cupo disponible.",
      date: "Hoy, 7:55 a.m.",
      module: "cartera"
    },
    {
      id: "act-003",
      userId: "user-001",
      userName: "Humberto",
      action: "Actualizó permiso",
      detail: "Asignó permiso de pedido urgente a María Compras.",
      date: "Ayer, 4:15 p.m.",
      module: "usuarios"
    },
    {
      id: "act-004",
      userId: "user-004",
      userName: "Ana Aprobadora",
      action: "Aprobó pedido",
      detail: "Aprobó pedido TBS-10218 para Sucursal Norte Barranquilla.",
      date: "30 abr, 2:40 p.m.",
      module: "pedidos"
    }
  ],
  settings: {
    approveOrdersOverLimit: true,
    notifyUrgentOrders: true,
    validateNewUsers: false
  }
};

export const PENDING_APPROVAL_ORDERS: PendingApprovalOrder[] = [
  {
    id: "appr-001",
    orderNumber: "TBS-AP-1001",
    createdAt: "Hoy, 9:20 a.m.",
    createdByUserId: "user-002",
    createdByUserName: "María Compras",
    cityId: "city-ctg",
    cityName: "Cartagena",
    branchId: "branch-ctg-001",
    branchName: "Sucursal Bocagrande",
    pointOfSaleId: "pos-001",
    pointOfSaleName: "Bar principal Bocagrande",
    status: "pendiente",
    reason: "supera_limite_usuario",
    reasonLabel: "Supera límite del comprador",
    total: 3850000,
    userPurchaseLimit: 3500000,
    approvalThreshold: 2500000,
    paymentMethod: "Crédito B2B",
    deliveryWindow: "Mañana: 8:00 a.m. - 12:00 p.m.",
    deliveryAddress: "Bocagrande, Carrera 3 #8-45",
    notes: "Pedido para operación de fin de semana.",
    lines: [
      {
        id: "line-001",
        productId: 1,
        name: "Whisky Premium 750 ml",
        category: "Whisky",
        specs: "Caja x 12 unidades",
        image: "/imagenes/producto-1.png",
        quantity: 18,
        unitPrice: 95000,
        subtotal: 1710000
      },
      {
        id: "line-002",
        productId: 2,
        name: "Ron Añejo 750 ml",
        category: "Ron",
        specs: "Caja x 12 unidades",
        image: "/imagenes/producto-2.png",
        quantity: 20,
        unitPrice: 62000,
        subtotal: 1240000
      },
      {
        id: "line-003",
        productId: 4,
        name: "Vodka Premium 750 ml",
        category: "Vodka",
        specs: "Caja x 12 unidades",
        image: "/imagenes/producto-4.png",
        quantity: 15,
        unitPrice: 60000,
        subtotal: 900000
      }
    ],
    approverUserIds: ["user-001"],
    decisions: []
  },
  {
    id: "appr-002",
    orderNumber: "TBS-AP-1002",
    createdAt: "Ayer, 4:35 p.m.",
    createdByUserId: "user-002",
    createdByUserName: "María Compras",
    cityId: "city-ctg",
    cityName: "Cartagena",
    branchId: "branch-ctg-002",
    branchName: "Sucursal Centro",
    pointOfSaleId: "pos-003",
    pointOfSaleName: "Bar rooftop Centro",
    status: "devuelto",
    reason: "pedido_urgente",
    reasonLabel: "Pedido urgente requiere revisión",
    total: 2200000,
    userPurchaseLimit: 3500000,
    approvalThreshold: 1500000,
    paymentMethod: "Crédito B2B",
    deliveryWindow: "Lo antes posible",
    deliveryAddress: "Centro Histórico, Calle del Arsenal #10-20",
    notes: "Solicitud urgente para evento privado.",
    lines: [
      {
        id: "line-004",
        productId: 5,
        name: "Tequila Reposado 750 ml",
        category: "Tequila",
        specs: "Caja x 12 unidades",
        image: "/imagenes/producto-5.png",
        quantity: 12,
        unitPrice: 74000,
        subtotal: 888000
      },
      {
        id: "line-005",
        productId: 3,
        name: "Ginebra London Dry 750 ml",
        category: "Ginebra",
        specs: "Caja x 6 unidades",
        image: "/imagenes/producto-3.png",
        quantity: 24,
        unitPrice: 54666,
        subtotal: 1312000
      }
    ],
    approverUserIds: ["user-001"],
    decisions: [
      {
        id: "dec-001",
        userId: "user-001",
        userName: "Humberto",
        decision: "devuelto",
        comment: "Validar cantidades de ginebra antes de aprobar. Parece superior al consumo habitual.",
        date: "Ayer, 5:05 p.m."
      }
    ]
  },
  {
    id: "appr-003",
    orderNumber: "TBS-AP-1003",
    createdAt: "30 abr, 11:10 a.m.",
    createdByUserId: "user-002",
    createdByUserName: "María Compras",
    cityId: "city-baq",
    cityName: "Barranquilla",
    branchId: "branch-baq-001",
    branchName: "Sucursal Norte Barranquilla",
    pointOfSaleId: "pos-004",
    pointOfSaleName: "Bar Norte",
    status: "aprobado",
    reason: "supera_regla_ciudad",
    reasonLabel: "Supera regla de ciudad",
    total: 1850000,
    userPurchaseLimit: 3500000,
    approvalThreshold: 1500000,
    paymentMethod: "PSE",
    deliveryWindow: "Tarde: 12:00 p.m. - 5:00 p.m.",
    deliveryAddress: "Alto Prado, Carrera 53 #80-120",
    notes: "Reposición programada.",
    lines: [
      {
        id: "line-006",
        productId: 1,
        name: "Whisky Premium 750 ml",
        category: "Whisky",
        specs: "Caja x 12 unidades",
        image: "/imagenes/producto-1.png",
        quantity: 10,
        unitPrice: 95000,
        subtotal: 950000
      },
      {
        id: "line-007",
        productId: 2,
        name: "Ron Añejo 750 ml",
        category: "Ron",
        specs: "Caja x 12 unidades",
        image: "/imagenes/producto-2.png",
        quantity: 15,
        unitPrice: 60000,
        subtotal: 900000
      }
    ],
    approverUserIds: ["user-004", "user-001"],
    decisions: [
      {
        id: "dec-002",
        userId: "user-004",
        userName: "Ana Aprobadora",
        decision: "aprobado",
        comment: "Pedido aprobado para reposición programada.",
        date: "30 abr, 11:35 a.m."
      }
    ]
  }
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: "faq-001",
    question: "¿Qué es TBS?",
    answer: "TBS es una plataforma B2B de abastecimiento de licores para negocios como bares, restaurantes, hoteles, licoreras, supermercados, discotecas, eventos y clientes especializados. Desde un solo portal puedes consultar catálogo, precios, pedidos, pagos, seguimiento, promociones, listas, reportes y soporte comercial.",
    category: "general",
    audience: "publico",
    tags: ["tbs", "plataforma", "b2b", "licores"],
    helpfulCount: 12,
    notHelpfulCount: 1,
    relatedActionLabel: "Solicitar acceso B2B",
    relatedActionTarget: "accessRequest"
  },
  {
    id: "faq-002",
    question: "¿Quién puede comprar en TBS?",
    answer: "TBS está diseñado para clientes B2B como bares, restaurantes, hoteles, clubes, licoreras, supermercados, discotecas, eventos, distribuidores y clientes especializados. Para comprar con condiciones comerciales debes solicitar acceso o iniciar sesión.",
    category: "acceso",
    audience: "publico",
    tags: ["clientes", "comprar", "b2b", "acceso"],
    helpfulCount: 8,
    notHelpfulCount: 0,
    relatedActionLabel: "Solicitar acceso B2B",
    relatedActionTarget: "accessRequest"
  },
  {
    id: "faq-003",
    question: "¿Por qué no veo precios personalizados sin iniciar sesión?",
    answer: "Los precios B2B pueden depender del tipo de cliente, ciudad, volumen, disponibilidad, condiciones comerciales, crédito y acuerdos específicos. Por eso algunos precios y promociones solo se muestran a usuarios validados.",
    category: "catalogo",
    audience: "publico",
    tags: ["precios", "login", "catálogo", "condiciones"],
    helpfulCount: 15,
    notHelpfulCount: 2,
    relatedActionLabel: "Iniciar sesión",
    relatedActionTarget: "login"
  },
  {
    id: "faq-004",
    question: "¿Cómo solicito acceso B2B?",
    answer: "Debes completar el formulario de solicitud con los datos del negocio, ciudad, tipo de cliente, contacto y necesidad principal. El equipo TBS revisará la información y se comunicará contigo para continuar el proceso.",
    category: "acceso",
    audience: "publico",
    tags: ["solicitar acceso", "registro", "formulario"],
    helpfulCount: 9,
    notHelpfulCount: 0,
    relatedActionLabel: "Solicitar acceso",
    relatedActionTarget: "accessRequest"
  },
  {
    id: "faq-005",
    question: "¿Cómo hago un pedido?",
    answer: "Inicia sesión, entra al catálogo, agrega productos al carrito y continúa al checkout. Allí completas dirección, ciudad, fecha deseada, ventana de entrega, método de pago y observaciones. El pedido queda sujeto a validación comercial, inventario y logística.",
    category: "pedidos",
    audience: "cliente_b2b",
    tags: ["pedido", "carrito", "checkout"],
    helpfulCount: 11,
    notHelpfulCount: 1,
    relatedActionLabel: "Ir al catálogo",
    relatedActionTarget: "catalog"
  },
  {
    id: "faq-006",
    question: "¿Puedo repetir un pedido anterior?",
    answer: "Sí. Desde Reordenar puedes repetir pedidos anteriores, listas frecuentes o productos recomendados. También puedes modificar cantidades antes de agregar productos al carrito.",
    category: "listas_reordenar",
    audience: "cliente_b2b",
    tags: ["reordenar", "pedido anterior", "listas"],
    helpfulCount: 10,
    notHelpfulCount: 0,
    relatedActionLabel: "Reordenar pedido",
    relatedActionTarget: "reorder"
  },
  {
    id: "faq-007",
    question: "¿Qué es el pedido urgente?",
    answer: "Es un servicio para necesidades inmediatas de abastecimiento. Está sujeto a ciudad, inventario, horario, capacidad logística y validación comercial. Puede aplicar tarifa logística adicional.",
    category: "pedido_urgente",
    audience: "cliente_b2b",
    tags: ["urgente", "horeca", "entrega", "logística"],
    helpfulCount: 14,
    notHelpfulCount: 1,
    relatedActionLabel: "Crear pedido urgente",
    relatedActionTarget: "urgentOrder"
  },
  {
    id: "faq-008",
    question: "¿Dónde veo mis facturas y pagos?",
    answer: "Desde Cartera y pagos puedes consultar facturas pendientes, próximas a vencer, vencidas y pagadas. También puedes seleccionar facturas y simular un pago dentro del portal.",
    category: "cartera_pagos",
    audience: "cliente_b2b",
    tags: ["facturas", "pagos", "cartera", "cupo"],
    helpfulCount: 13,
    notHelpfulCount: 0,
    relatedActionLabel: "Ir a cartera y pagos",
    relatedActionTarget: "payments"
  },
  {
    id: "faq-009",
    question: "¿Cómo hago seguimiento de un pedido?",
    answer: "Desde Seguimiento de pedidos puedes ver estado, transportador, ventana de entrega, productos, línea de tiempo y novedades logísticas. Si hay una novedad, puedes contactar a tu asesor desde el chat interno.",
    category: "seguimiento",
    audience: "cliente_b2b",
    tags: ["seguimiento", "entrega", "pedido", "novedad"],
    helpfulCount: 16,
    notHelpfulCount: 1,
    relatedActionLabel: "Ver seguimiento",
    relatedActionTarget: "ordersTracking"
  },
  {
    id: "faq-010",
    question: "¿Cómo hablo con mi asesor?",
    answer: "Puedes comunicarte con tu asesor desde el Centro de mensajes interno de TBS. No necesitas salir de la página. El número del asesor también queda visible como opción secundaria por si quieres llamar.",
    category: "asesor_chat",
    audience: "cliente_b2b",
    tags: ["asesor", "chat", "mensaje", "soporte"],
    helpfulCount: 20,
    notHelpfulCount: 0,
    relatedActionLabel: "Abrir chat interno",
    relatedActionTarget: "advisorChat"
  },
  {
    id: "faq-011",
    question: "¿Puedo crear usuarios para mi empresa?",
    answer: "Sí. Si tienes perfil master o permisos de administración, puedes crear usuarios, asignar ciudades, sucursales, puntos de venta, roles, permisos y límites de compra dentro de Administración de cuenta.",
    category: "cuenta_usuarios",
    audience: "cliente_b2b",
    tags: ["usuarios", "permisos", "sucursales", "master"],
    helpfulCount: 7,
    notHelpfulCount: 0,
    relatedActionLabel: "Administración de cuenta",
    relatedActionTarget: "b2bAccountAdmin"
  },
  {
    id: "faq-012",
    question: "¿Qué puede hacer un usuario comprador?",
    answer: "Un usuario comprador puede ver catálogo, crear pedidos, reordenar, gestionar listas y solicitar pedidos urgentes si tiene permisos. No necesariamente puede pagar facturas, administrar usuarios o ver inteligencia comercial.",
    category: "cuenta_usuarios",
    audience: "cliente_b2b",
    tags: ["comprador", "permisos", "roles"],
    helpfulCount: 5,
    notHelpfulCount: 0,
    relatedActionLabel: "Ir a mi cuenta",
    relatedActionTarget: "account"
  },
  {
    id: "faq-013",
    question: "¿Qué pasa si un pedido necesita aprobación?",
    answer: "Si un pedido supera el límite del usuario o una regla de aprobación de la cuenta, queda pendiente de aprobación. Un usuario master o aprobador puede revisarlo, aprobarlo, rechazarlo o devolverlo con comentarios.",
    category: "aprobaciones",
    audience: "cliente_b2b",
    tags: ["aprobaciones", "pedidos", "límites", "master"],
    helpfulCount: 6,
    notHelpfulCount: 0,
    relatedActionLabel: "Ver aprobaciones",
    relatedActionTarget: "orderApprovals"
  },
  {
    id: "faq-014",
    question: "¿Cómo funcionan las promociones B2B?",
    answer: "Las promociones pueden depender de ciudad, perfil del cliente, volumen, disponibilidad, vigencia y condiciones comerciales. Algunas promociones se agregan al carrito, pero quedan sujetas a validación final.",
    category: "promociones",
    audience: "cliente_b2b",
    tags: ["promociones", "descuentos", "volumen"],
    helpfulCount: 8,
    notHelpfulCount: 1,
    relatedActionLabel: "Ver promociones",
    relatedActionTarget: "promotions"
  },
  {
    id: "faq-015",
    question: "¿Para qué sirve Inteligencia B2B?",
    answer: "Inteligencia B2B muestra consumo mensual, categorías más compradas, productos frecuentes, recompra sugerida, alertas operativas y oportunidades comerciales para ayudarte a comprar mejor.",
    category: "inteligencia",
    audience: "cliente_b2b",
    tags: ["inteligencia", "reportes", "recompra", "consumo"],
    helpfulCount: 8,
    notHelpfulCount: 0,
    relatedActionLabel: "Ver inteligencia",
    relatedActionTarget: "intelligence"
  },
  {
    id: "faq-016",
    question: "¿Cómo puede una marca vender con TBS?",
    answer: "Las marcas, importadoras y proveedores pueden solicitar acceso para publicar portafolio, participar en campañas, revisar desempeño, rotación, ventas por ciudad y liquidaciones. El modelo puede ser compra directa, consignación, marketplace o despacho directo.",
    category: "proveedores_marcas",
    audience: "proveedor_marca",
    tags: ["proveedor", "marca", "vender", "portafolio"],
    helpfulCount: 9,
    notHelpfulCount: 0,
    relatedActionLabel: "Solicitar acceso",
    relatedActionTarget: "accessRequest"
  },
  {
    id: "faq-017",
    question: "¿El proveedor tiene el mismo panel que el cliente?",
    answer: "No. El cliente B2B tiene un panel para comprar, pagar, reordenar y hacer seguimiento. La marca o proveedor tiene un panel diferente para ventas, portafolio, campañas, liquidaciones, inventario, rotación y oportunidades comerciales.",
    category: "proveedores_marcas",
    audience: "proveedor_marca",
    tags: ["panel proveedor", "marca", "cliente"],
    helpfulCount: 6,
    notHelpfulCount: 0,
    relatedActionLabel: "Ir al panel proveedor",
    relatedActionTarget: "providerDashboard"
  },
  {
    id: "faq-018",
    question: "¿Mis pagos se procesan realmente en este prototipo?",
    answer: "No. En esta etapa los pagos son simulados. Más adelante se conectarán con la pasarela de pago y los módulos correspondientes. Por ahora el objetivo es validar la experiencia del usuario.",
    category: "cartera_pagos",
    audience: "todos",
    tags: ["pagos", "prototipo", "simulado"],
    helpfulCount: 4,
    notHelpfulCount: 0,
    relatedActionLabel: "Ir a cartera y pagos",
    relatedActionTarget: "payments"
  },
  {
    id: "faq-019",
    question: "¿Qué hago si no encuentro respuesta?",
    answer: "Si estás logueado, puedes abrir el chat interno con tu asesor o ejecutivo TBS. Si aún no tienes acceso, puedes solicitar acceso B2B y el equipo TBS se comunicará contigo.",
    category: "soporte",
    audience: "todos",
    tags: ["soporte", "ayuda", "asesor"],
    helpfulCount: 18,
    notHelpfulCount: 0,
    relatedActionLabel: "Hablar con asesor",
    relatedActionTarget: "advisorChat"
  }
];

export const PROVIDER_PRODUCTS: ProviderProduct[] = [
  {
    id: "pp-001",
    sku: "MP-WH-750",
    name: "Whisky Premium 750 ml",
    category: "Whisky",
    brand: "Marca Premium Demo",
    image: "https://images.unsplash.com/photo-1527281473222-f9e87be50519?auto=format&fit=crop&q=80&w=400",
    inventoryModel: "consignacion",
    status: "activo",
    stock: 420,
    unitsSold: 186,
    revenue: 17670000,
    rotation: "alta",
    margin: 18,
    cityAvailability: ["Cartagena", "Barranquilla", "Santa Marta"]
  },
  {
    id: "pp-002",
    sku: "MP-GN-750",
    name: "Gin Premium Botánico 750 ml",
    category: "Ginebra",
    brand: "Marca Premium Demo",
    image: "https://images.unsplash.com/photo-1551538666-80029b3ae383?auto=format&fit=crop&q=80&w=400",
    inventoryModel: "marketplace",
    status: "activo",
    stock: 160,
    unitsSold: 72,
    revenue: 6336000,
    rotation: "media",
    margin: 22,
    cityAvailability: ["Cartagena"]
  },
  {
    id: "pp-003",
    sku: "MP-RM-750",
    name: "Ron Reserva Especial 750 ml",
    category: "Ron",
    brand: "Marca Premium Demo",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=400",
    inventoryModel: "compra_directa",
    status: "activo",
    stock: 260,
    unitsSold: 94,
    revenue: 5828000,
    rotation: "media",
    margin: 16,
    cityAvailability: ["Cartagena", "Barranquilla"]
  },
  {
    id: "pp-004",
    sku: "MP-SP-750",
    name: "Espumante Brut Premium 750 ml",
    category: "Espumantes",
    brand: "Marca Premium Demo",
    image: "https://images.unsplash.com/photo-1527281473222-f9e87be50519?auto=format&fit=crop&q=80&w=400",
    inventoryModel: "despacho_directo",
    status: "pendiente",
    stock: 0,
    unitsSold: 0,
    revenue: 0,
    rotation: "baja",
    margin: 20,
    cityAvailability: []
  }
];

export const PROVIDER_SALES_METRICS: ProviderSalesMetric[] = [
  { month: "Enero", revenue: 18500000, units: 210, orders: 42 },
  { month: "Febrero", revenue: 21400000, units: 245, orders: 48 },
  { month: "Marzo", revenue: 23800000, units: 272, orders: 55 },
  { month: "Abril", revenue: 26100000, units: 301, orders: 61 },
  { month: "Mayo", revenue: 29834000, units: 352, orders: 74 }
];

export const PROVIDER_CHANNEL_METRICS: ProviderChannelMetric[] = [
  { channel: "Restaurantes", revenue: 10400000, units: 124, percentage: 35 },
  { channel: "Bares", revenue: 8650000, units: 98, percentage: 29 },
  { channel: "Hoteles", revenue: 5370000, units: 58, percentage: 18 },
  { channel: "Licoreras", revenue: 3580000, units: 49, percentage: 12 },
  { channel: "Eventos", revenue: 1834000, units: 23, percentage: 6 }
];

export const PROVIDER_CITY_METRICS: ProviderCityMetric[] = [
  { city: "Cartagena", revenue: 14200000, units: 166, percentage: 48 },
  { city: "Barranquilla", revenue: 8900000, units: 104, percentage: 30 },
  { city: "Santa Marta", revenue: 4234000, units: 52, percentage: 14 },
  { city: "Montería", revenue: 2500000, units: 30, percentage: 8 }
];

export const PROVIDER_CAMPAIGNS: ProviderCampaign[] = [
  {
    id: "pc-001",
    name: "Marca destacada del mes",
    type: "visibilidad",
    status: "activa",
    startDate: "2026-05-01",
    endDate: "2026-05-31",
    budget: 3500000,
    revenueGenerated: 9800000,
    products: ["Whisky Premium 750 ml", "Gin Premium Botánico 750 ml"]
  },
  {
    id: "pc-002",
    name: "Activación carta de cocteles",
    type: "activacion",
    status: "programada",
    startDate: "2026-05-15",
    endDate: "2026-06-15",
    budget: 5200000,
    revenueGenerated: 0,
    products: ["Gin Premium Botánico 750 ml"]
  },
  {
    id: "pc-003",
    name: "Promoción volumen HORECA",
    type: "promocion",
    status: "activa",
    startDate: "2026-04-20",
    endDate: "2026-05-20",
    budget: 2000000,
    revenueGenerated: 6500000,
    products: ["Whisky Premium 750 ml", "Ron Reserva Especial 750 ml"]
  }
];

export const PROVIDER_SETTLEMENTS: ProviderSettlement[] = [
  {
    id: "ps-001",
    period: "Mayo 2026 - Corte 1",
    grossSales: 14800000,
    commissions: 1480000,
    logisticsFees: 620000,
    netPayable: 12700000,
    status: "pendiente"
  },
  {
    id: "ps-002",
    period: "Abril 2026",
    grossSales: 26100000,
    commissions: 2610000,
    logisticsFees: 1140000,
    netPayable: 22350000,
    status: "pagada",
    paymentDate: "2026-05-03"
  },
  {
    id: "ps-003",
    period: "Marzo 2026",
    grossSales: 23800000,
    commissions: 2380000,
    logisticsFees: 980000,
    netPayable: 20440000,
    status: "pagada",
    paymentDate: "2026-04-05"
  }
];

export const PROVIDER_INSIGHTS: ProviderInsight[] = [
  {
    id: "pi-001",
    title: "Whisky Premium tiene alta rotación",
    description: "El producto concentra 59% de tus ventas y tiene rotación alta en Cartagena y Barranquilla.",
    priority: "alta",
    actionLabel: "Ver productos",
    actionTarget: "providerProducts"
  },
  {
    id: "pi-002",
    title: "Oportunidad en hoteles",
    description: "Hoteles representa 18% de ventas, pero tiene crecimiento frente al mes anterior. Puede impulsarse con activación.",
    priority: "media",
    actionLabel: "Solicitar campaña",
    actionTarget: "providerCampaigns"
  },
  {
    id: "pi-003",
    title: "Liquidación pendiente",
    description: "Tienes una liquidación pendiente del corte de mayo por $12.700.000.",
    priority: "alta",
    actionLabel: "Ver liquidaciones",
    actionTarget: "providerSettlements"
  },
  {
    id: "pi-004",
    title: "Producto pendiente de activación",
    description: "Espumante Brut Premium está pendiente de publicación y puede entrar en campaña de eventos.",
    priority: "media",
    actionLabel: "Gestionar portafolio",
    actionTarget: "providerProducts"
  },
  {
    id: "pi-005",
    title: "Consulta con ejecutivo TBS",
    description: "Puedes coordinar una estrategia de activación para bares y restaurantes desde el chat interno.",
    priority: "baja",
    actionLabel: "Hablar con ejecutivo",
    actionTarget: "advisorChat"
  }
];

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

export const SHOPPING_LISTS: ShoppingList[] = [
  {
    id: "list-001",
    name: "Fin de semana",
    description: "Productos de alta rotación para preparar viernes, sábado y domingo.",
    type: "frecuente",
    createdAt: "2026-04-10",
    updatedAt: "2026-05-01",
    products: [
      {
        id: "slp-001",
        productId: 1,
        name: "Whisky Premium 750 ml",
        category: "Whisky",
        specs: "Caja x 12 unidades",
        image: "https://images.unsplash.com/photo-1527281473222-f9e87be50519?auto=format&fit=crop&q=80&w=400",
        price: 95000,
        suggestedQuantity: 12,
        available: true,
        stockLabel: "Disponible",
        addedAt: "2026-04-10"
      },
      {
        id: "slp-002",
        productId: 4,
        name: "Ron Añejo 750 ml",
        category: "Ron",
        specs: "Caja x 12 unidades",
        image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=400",
        price: 62000,
        suggestedQuantity: 8,
        available: true,
        stockLabel: "Disponible",
        addedAt: "2026-04-10"
      },
      {
        id: "slp-003",
        productId: 6,
        name: "Ginebra London Dry 750 ml",
        category: "Ginebra",
        specs: "Caja x 12 unidades",
        image: "https://images.unsplash.com/photo-1551538666-80029b3ae383?auto=format&fit=crop&q=80&w=400",
        price: 61000,
        suggestedQuantity: 12,
        available: true,
        stockLabel: "Disponible",
        addedAt: "2026-04-11"
      }
    ]
  },
  {
    id: "list-002",
    name: "Carta de cocteles",
    description: "Insumos principales para coctelería de bar y restaurante.",
    type: "personalizada",
    createdAt: "2026-04-15",
    updatedAt: "2026-04-28",
    products: [
      {
        id: "slp-004",
        productId: 7,
        name: "Hendrick's Gin Premium 750 ml",
        category: "Ginebra",
        specs: "Caja x 6 unidades",
        image: "https://images.unsplash.com/photo-1551538666-80029b3ae383?auto=format&fit=crop&q=80&w=400",
        price: 185000,
        suggestedQuantity: 6,
        available: true,
        stockLabel: "Disponible",
        addedAt: "2026-04-15"
      },
      {
        id: "slp-005",
        productId: 8,
        name: "Tequila Don Julio Reposado 750 ml",
        category: "Tequila y mezcal",
        specs: "Caja x 12 unidades",
        image: "https://images.unsplash.com/photo-1516535794938-6063878f28cc?auto=format&fit=crop&q=80&w=400",
        price: 210000,
        suggestedQuantity: 6,
        available: true,
        stockLabel: "Disponible",
        addedAt: "2026-04-15"
      }
    ]
  },
  {
    id: "list-003",
    name: "Eventos y grupos",
    description: "Productos recomendados para eventos, reservas grandes y alta demanda.",
    type: "evento",
    createdAt: "2026-04-20",
    updatedAt: "2026-04-29",
    products: [
      {
        id: "slp-006",
        productId: 2,
        name: "Johnnie Walker Black Label 1L",
        category: "Whisky",
        specs: "Caja x 12 unidades",
        image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=400",
        price: 185000,
        suggestedQuantity: 12,
        available: false,
        stockLabel: "Consultar disponibilidad",
        addedAt: "2026-04-20"
      },
      {
        id: "slp-007",
        productId: 3,
        name: "Buchanan's Deluxe 12 750ml",
        category: "Whisky",
        specs: "Caja x 12 unidades",
        image: "https://images.unsplash.com/photo-1614313511387-1436a4480ebb?auto=format&fit=crop&q=80&w=400",
        price: 155000,
        suggestedQuantity: 6,
        available: true,
        stockLabel: "Disponible",
        addedAt: "2026-04-21"
      }
    ]
  }
];

export const B2B_PROMOTIONS: B2BPromotion[] = [
  {
    id: "promo-001",
    title: "Whisky Premium por volumen",
    subtitle: "Descuento especial desde 12 unidades",
    description: "Promoción para clientes B2B con recompra frecuente de whisky premium.",
    type: "descuento_por_volumen",
    status: "activa",
    brand: "Marca Premium",
    category: "Whisky",
    badge: "12+ unidades",
    priority: "alta",
    products: [
      {
        productId: 1,
        name: "Old Parr 12 Años",
        category: "Whisky",
        specs: "Caja x 12 unidades",
        image: "https://images.unsplash.com/photo-1527281473222-f9e87be50519?auto=format&fit=crop&q=80&w=400",
        regularPrice: 145000,
        promoPrice: 135000,
        discountPercent: 7,
        requiredQuantity: 12,
        available: true
      }
    ],
    condition: {
      minUnits: 12,
      customerTypes: ["Restaurante", "Bar", "Hotel", "Licorera"],
      cities: ["Cartagena", "Barranquilla", "Santa Marta"],
      validFrom: "2026-05-01",
      validUntil: "2026-05-31",
      requiresApproval: false,
      notes: "Aplicable hasta agotar inventario."
    }
  },
  {
    id: "promo-002",
    title: "Combo coctelería",
    subtitle: "Ginebra + vodka + tequila para carta de cocteles",
    description: "Combo recomendado para bares y restaurantes con carta activa de coctelería.",
    type: "combo",
    status: "activa",
    brand: "Portafolio mixto",
    category: "Coctelería",
    badge: "Combo B2B",
    priority: "alta",
    products: [
      {
        productId: 6,
        name: "Tanqueray London Dry",
        category: "Ginebra",
        specs: "750ml • 47.3% Alc.",
        image: "https://images.unsplash.com/photo-1551538666-80029b3ae383?auto=format&fit=crop&q=80&w=400",
        regularPrice: 115000,
        promoPrice: 108000,
        discountPercent: 6,
        requiredQuantity: 6,
        available: true
      },
      {
        productId: 8,
        name: "Don Julio Reposado",
        category: "Tequila y mezcal",
        specs: "750ml • 38% Alc.",
        image: "https://images.unsplash.com/photo-1516535794938-6063878f28cc?auto=format&fit=crop&q=80&w=400",
        regularPrice: 210000,
        promoPrice: 200000,
        discountPercent: 5,
        requiredQuantity: 4,
        available: true
      }
    ],
    condition: {
      minUnits: 10,
      customerTypes: ["Bar", "Restaurante", "Hotel"],
      cities: ["Cartagena"],
      validFrom: "2026-05-01",
      validUntil: "2026-05-20",
      requiresApproval: false,
      notes: "Ideal para cartas de coctelería y eventos."
    }
  },
  {
    id: "promo-003",
    title: "Reposición fin de semana",
    subtitle: "Beneficio para pedidos programados antes del jueves",
    description: "Promoción para clientes que programan abastecimiento antes de picos de consumo.",
    type: "recompra",
    status: "activa",
    brand: "TBS",
    category: "Multicategoría",
    badge: "Recompra",
    priority: "media",
    products: [
      {
        productId: 4,
        name: "Ron Viejo de Caldas Juan de la Cruz",
        category: "Ron",
        specs: "750ml • 35% Alc.",
        image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=400",
        regularPrice: 65000,
        promoPrice: 61000,
        discountPercent: 6,
        requiredQuantity: 8,
        available: true
      },
      {
        productId: 2,
        name: "Johnnie Walker Black Label",
        category: "Whisky",
        specs: "1L • 40% Alc.",
        image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=400",
        regularPrice: 185000,
        promoPrice: 178000,
        discountPercent: 4,
        requiredQuantity: 12,
        available: false
      }
    ],
    condition: {
      minUnits: 20,
      customerTypes: ["Bar", "Restaurante", "Discoteca", "Evento"],
      cities: ["Cartagena", "Barranquilla"],
      validFrom: "2026-05-01",
      validUntil: "2026-06-15",
      requiresApproval: true,
      notes: "Puede requerir validación de inventario y cupo."
    }
  },
  {
    id: "promo-004",
    title: "Marca destacada del mes",
    subtitle: "Visibilidad especial y precio preferencial",
    description: "Promoción impulsada por marca aliada para clientes estratégicos.",
    type: "marca_destacada",
    status: "activa",
    brand: "Marca Aliada",
    category: "Whisky",
    badge: "Marca destacada",
    priority: "media",
    products: [
      {
        productId: 3,
        name: "Buchanan's Deluxe 12",
        category: "Whisky",
        specs: "750ml • 40% Alc.",
        image: "https://images.unsplash.com/photo-1614313511387-1436a4480ebb?auto=format&fit=crop&q=80&w=400",
        regularPrice: 155000,
        promoPrice: 145000,
        discountPercent: 6,
        requiredQuantity: 6,
        available: true
      }
    ],
    condition: {
      minUnits: 12,
      customerTypes: ["Hotel", "Restaurante", "Club"],
      cities: ["Cartagena", "Santa Marta"],
      validFrom: "2026-05-01",
      validUntil: "2026-05-31",
      requiresApproval: false,
      notes: "Sujeto a disponibilidad por ciudad."
    }
  }
];

export const CUSTOMER_INTELLIGENCE_SUMMARY: CustomerIntelligenceSummary = {
  currentMonthTotal: 12840000,
  previousMonthTotal: 10950000,
  currentMonthOrders: 8,
  currentMonthUnits: 186,
  averageOrderValue: 1605000,
  pendingInvoices: 4,
  urgentOrdersUsed: 2,
  estimatedSavings: 740000
};

export const MONTHLY_PURCHASE_METRICS: MonthlyPurchaseMetric[] = [
  { month: "Enero", total: 8200000, orders: 5, units: 118 },
  { month: "Febrero", total: 9350000, orders: 6, units: 136 },
  { month: "Marzo", total: 10400000, orders: 7, units: 154 },
  { month: "Abril", total: 10950000, orders: 7, units: 162 },
  { month: "Mayo", total: 12840000, orders: 8, units: 186 }
];

export const CATEGORY_CONSUMPTION: CategoryConsumption[] = [
  { category: "Whisky", total: 3850000, units: 42, percentage: 30 },
  { category: "Ron", total: 2480000, units: 40, percentage: 19 },
  { category: "Vodka", total: 1830000, units: 30, percentage: 14 },
  { category: "Ginebra", total: 1620000, units: 26, percentage: 13 },
  { category: "Tequila", total: 1480000, units: 20, percentage: 12 },
  { category: "Vinos y espumantes", total: 1580000, units: 28, percentage: 12 }
];

export const TOP_PURCHASED_PRODUCTS: TopPurchasedProduct[] = [
  {
    productId: 1,
    name: "Whisky Premium 750 ml",
    category: "Whisky",
    image: "https://images.unsplash.com/photo-1527281473222-f9e87be50519?auto=format&fit=crop&q=80&w=400",
    units: 36,
    total: 3420000,
    lastPurchaseDate: "2026-05-01",
    suggestedReorderDate: "2026-05-13",
    trend: "sube"
  },
  {
    productId: 4,
    name: "Ron Añejo 750 ml",
    category: "Ron",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=400",
    units: 32,
    total: 1984000,
    lastPurchaseDate: "2026-05-01",
    suggestedReorderDate: "2026-05-12",
    trend: "estable"
  },
  {
    productId: 9, // Assuming a vodka premium id, or just Use existing ids
    name: "Vodka Premium 750 ml",
    category: "Vodka",
    image: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=400",
    units: 30,
    total: 1830000,
    lastPurchaseDate: "2026-04-28",
    suggestedReorderDate: "2026-05-10",
    trend: "sube"
  },
  {
    productId: 6,
    name: "Ginebra London Dry 750 ml",
    category: "Ginebra",
    image: "https://images.unsplash.com/photo-1551538666-80029b3ae383?auto=format&fit=crop&q=80&w=400",
    units: 24,
    total: 1296000,
    lastPurchaseDate: "2026-05-01",
    suggestedReorderDate: "2026-05-15",
    trend: "estable"
  },
  {
    productId: 8,
    name: "Tequila Reposado 750 ml",
    category: "Tequila",
    image: "https://images.unsplash.com/photo-1516535794938-6063878f28cc?auto=format&fit=crop&q=80&w=400",
    units: 18,
    total: 1332000,
    lastPurchaseDate: "2026-04-28",
    suggestedReorderDate: "2026-05-16",
    trend: "baja"
  }
];

export const CUSTOMER_INSIGHTS: CustomerInsight[] = [
  {
    id: "ins-001",
    type: "recompra",
    title: "Recompra sugerida de whisky",
    description: "Tu consumo de Whisky Premium subió frente al mes anterior. Sugerimos reponer antes del 13 de mayo.",
    priority: "alta",
    actionLabel: "Reordenar ahora",
    actionTarget: "reorder",
    context: "Whisky Premium 750 ml"
  },
  {
    id: "ins-002",
    type: "cartera",
    title: "Facturas próximas a vencer",
    description: "Tienes 2 facturas con vencimiento en los próximos 7 días. Pagar a tiempo mantiene disponible tu cupo.",
    priority: "alta",
    actionLabel: "Ir a cartera",
    actionTarget: "payments",
    context: "Facturas pendientes"
  },
  {
    id: "ins-003",
    type: "promocion",
    title: "Promoción disponible para coctelería",
    description: "Hay un combo B2B activo para ginebra, vodka y tequila que coincide con tu patrón de compra.",
    priority: "media",
    actionLabel: "Ver promociones",
    actionTarget: "promotions",
    context: "Combo coctelería"
  },
  {
    id: "ins-004",
    type: "lista",
    title: "Crea una lista para fin de semana",
    description: "Tus pedidos de jueves y viernes concentran productos repetidos. Una lista puede acelerar la recompra.",
    priority: "media",
    actionLabel: "Crear lista",
    actionTarget: "shoppingLists",
    context: "Fin de semana"
  },
  {
    id: "ins-005",
    type: "pedido_urgente",
    title: "Uso recurrente de pedidos urgentes",
    description: "Has usado 2 pedidos urgentes este mes. Podrías reducir costos programando reposiciones antes del jueves.",
    priority: "media",
    actionLabel: "Planear recompra",
    actionTarget: "reorder",
    context: "Pedido urgente"
  },
  {
    id: "ins-006",
    type: "asesor",
    title: "Oportunidad de optimizar carta",
    description: "Tu mix de whisky y coctelería permite revisar carta, margen y sugeridos con tu asesor TBS.",
    priority: "baja",
    actionLabel: "Hablar con asesor",
    actionTarget: "advisorChat",
    context: "Optimización de carta"
  }
];
