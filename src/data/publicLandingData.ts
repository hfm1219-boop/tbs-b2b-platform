
import { Truck, Zap, ShieldCheck } from 'lucide-react';

export const PUBLIC_LANDINGS = [
  {
    key: 'cartagena',
    cityName: 'Cartagena',
    heroTitle: 'Abastecimiento premium en Cartagena.',
    heroSubtitle: 'Llegamos a la ciudad amurallada con el catálogo de licores más robusto y soporte comercial experto para tu bar o restaurante.',
    stats: [
      { label: 'Negocios aliados', value: '450+' },
      { label: 'Referencias', value: '1.2k' },
      { label: 'SLA Entrega', value: '98%' },
      { label: 'Ahorro promedio', value: '12%' }
    ],
    benefits: [
      { 
        icon: Truck, 
        title: 'Despachos locales', 
        desc: 'Contamos con centro de distribución en Cartagena para entregas rápidas y controladas.' 
      },
      { 
        icon: Zap, 
        title: 'Pedido ágil', 
        desc: 'Compra desde el móvil y recibe mañana mismo sin complicaciones operativas.' 
      },
      { 
        icon: ShieldCheck, 
        title: 'Confianza B2B', 
        desc: 'Precios competitivos y crédito para que tu flujo de caja siempre sea positivo.' 
      }
    ],
    featuredProducts: []
  },
  {
    key: 'bogota',
    cityName: 'Bogotá',
    heroTitle: 'TBS Bogotá: Tu socio en licores B2B.',
    heroSubtitle: 'Optimizamos el suministro de destilados para la capital. Mayor variedad, mejores precios y logística de precisión.',
    stats: [
      { label: 'Cobertura', value: '100%' },
      { label: 'Marcas', value: '80+' },
      { label: 'Entregas mes', value: '5k+' },
      { label: 'Satisfacción', value: '4.9/5' }
    ],
    benefits: [
      { 
        icon: Truck, 
        title: 'Logística urbana', 
        desc: 'Dominamos las rutas de Bogotá para que nunca te quedes sin stock en horas pico.' 
      },
      { 
        icon: Zap, 
        title: 'Soporte 24/7', 
        desc: 'Nuestro equipo y plataforma están siempre listos para atender tus requerimientos.' 
      },
      { 
        icon: ShieldCheck, 
        title: 'Precios de volumen', 
        desc: 'Aprovecha las mejores escalas de precio del mercado gracias a nuestra red de proveedores.' 
      }
    ],
    featuredProducts: []
  },
  {
    key: 'nacional',
    cityName: 'Colombia',
    heroTitle: 'Llevamos tu negocio al siguiente nivel.',
    heroSubtitle: 'La plataforma B2B de licores que conecta a marcas con el sector Horeca en todo el territorio nacional.',
    stats: [
      { label: 'Presencia', value: '12 deptos' },
      { label: 'Negocios', value: '2.5k+' },
      { label: 'Transacciones', value: '15k+' },
      { label: 'Equipo', value: '100+' }
    ],
    benefits: [
      { 
        icon: Truck, 
        title: 'Cadenas de suministro', 
        desc: 'Infraestructura robusta para abastecer grupos empresariales y cadenas a nivel nacional.' 
      },
      { 
        icon: Zap, 
        title: 'Inteligencia B2B', 
        desc: 'Datos y reportes para que tomes decisiones de compra basadas en el comportamiento real del mercado.' 
      },
      { 
        icon: ShieldCheck, 
        title: 'Respaldo TBS', 
        desc: 'Más que un proveedor, somos el aliado tecnológico que tu operación comercial necesita.' 
      }
    ],
    featuredProducts: []
  }
];
