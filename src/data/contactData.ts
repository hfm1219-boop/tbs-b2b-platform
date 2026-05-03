import { BusinessContactInfo, ContactChannel } from '../types';

export const BUSINESS_CONTACT_INFO: BusinessContactInfo = {
  businessName: "TBS Destilados",
  legalName: "TBS Destilados SAS",
  nit: "",
  address: "Carrera 2 No. 7-17 Local 1, Bocagrande",
  city: "Cartagena",
  region: "Bolívar",
  country: "Colombia",
  phone: "+57 314 581 3569",
  email: "",
  website: "https://tbsdestilados.com",
  businessHours: [
    "Horarios sujetos a confirmación comercial",
    "Atención B2B según canal y disponibilidad"
  ]
};

export const CONTACT_CHANNELS: ContactChannel[] = [
  {
    id: "contact-client",
    title: "Clientes B2B",
    description: "Solicita acceso para comprar, consultar precios, cartera, pedidos, seguimiento y soporte comercial.",
    type: "formulario",
    actionLabel: "Solicitar acceso B2B",
    actionTarget: "accessRequestClient"
  },
  {
    id: "contact-provider",
    title: "Marcas",
    description: "Conecta tu portafolio con el canal B2B de TBS y solicita información sobre modelos comerciales.",
    type: "proveedor",
    actionLabel: "Quiero vender con TBS",
    actionTarget: "accessRequestProvider"
  },
  {
    id: "contact-support",
    title: "Soporte y ayuda",
    description: "Consulta preguntas frecuentes o comunícate con tu asesor desde el chat interno si ya tienes cuenta.",
    type: "soporte",
    actionLabel: "Ir al centro de ayuda",
    actionTarget: "faq"
  },
  {
    id: "contact-phone",
    title: "Llamada directa",
    description: "También puedes comunicarte por teléfono si necesitas validar información general.",
    type: "telefono",
    actionLabel: "Llamar",
    actionTarget: "call"
  }
];
