
export const PUBLIC_PAGE_SEO = {
  home: {
    title: "TBS Destilados | Plataforma B2B de abastecimiento de licores",
    description: "Compra, paga, repite y recibe licores desde una plataforma B2B para bares, restaurantes, hoteles, licoreras y marcas.",
    canonicalPath: "/"
  },
  about: {
    title: "Qué es TBS | Plataforma B2B para el sector de licores",
    description: "TBS conecta catálogo, precios B2B competitivos, crédito, pagos, pedidos recurrentes, logística y soporte comercial para el canal B2B de licores.",
    canonicalPath: "/que-es-tbs"
  },
  clients: {
    title: "Clientes B2B | Abastecimiento para bares, restaurantes, hoteles y licoreras",
    description: "Soluciones de compra, crédito, pagos, pedidos recurrentes, seguimiento y soporte para negocios que venden o sirven licores.",
    canonicalPath: "/clientes-b2b"
  },
  providers: {
    title: "Marcas | Vende y activa tu portafolio con TBS",
    description: "TBS ayuda a marcas, importadoras y empresas a llegar al canal B2B con portafolio, logística, datos, campañas y reportes.",
    canonicalPath: "/proveedores-y-marcas"
  },
  services: {
    title: "Servicios TBS | Logística, crédito, pagos, datos y activación comercial",
    description: "Conoce los servicios de TBS para abastecimiento B2B, logística, pedido urgente, cartera, pagos, inteligencia comercial y soporte.",
    canonicalPath: "/servicios-tbs"
  },
  catalog: {
    title: "Catálogo B2B de licores | TBS Destilados",
    description: "Explora categorías, marcas y productos para negocios B2B. Los precios, promociones y disponibilidad dependen del perfil comercial.",
    canonicalPath: "/catalogo"
  },
  faq: {
    title: "Centro de ayuda TBS | Preguntas frecuentes B2B de licores",
    description: "Resuelve dudas sobre acceso B2B, catálogo, pedidos, pagos, seguimiento, usuarios, marcas, promociones y soporte en TBS.",
    canonicalPath: "/faq"
  },
  accessRequest: {
    title: "Solicitar acceso B2B | TBS Destilados",
    description: "Solicita acceso a TBS como cliente B2B o marca. Un asesor revisará tu información para continuar el proceso.",
    canonicalPath: "/solicitar-acceso"
  }
};

export const getCanonicalPathForActivePage = (activePage: string): string => {
  switch (activePage) {
    case 'home': return "/";
    case 'about': return "/que-es-tbs";
    case 'clients': return "/clientes-b2b";
    case 'providers': return "/proveedores-y-marcas";
    case 'services': return "/servicios-tbs";
    case 'catalog': return "/catalogo";
    case 'faq': return "/faq";
    case 'request-access': return "/solicitar-acceso";
    default: return "/";
  }
};
