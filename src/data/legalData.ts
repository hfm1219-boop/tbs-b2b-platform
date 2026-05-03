
import { LegalPageData, CookiePreference } from '../types';

export const LEGAL_PAGES: LegalPageData[] = [
  {
    key: 'privacy',
    slug: '/politica-de-privacidad',
    title: 'Política de privacidad',
    seoTitle: 'Política de privacidad | TBS Destilados',
    seoDescription: 'Consulta cómo TBS Destilados protege la privacidad de usuarios, clientes B2B, marcas y visitantes del portal.',
    updatedAt: '03 de Mayo de 2026',
    intro: 'Esta política explica cómo TBS Destilados trata la información relacionada con visitantes, clientes B2B, marcas y usuarios del portal. Este documento es una base operativa y debe ser revisado por asesoría legal antes de producción.',
    sections: [
      {
        id: 'responsable',
        title: 'Responsable del tratamiento',
        body: 'TBS Destilados SAS, con domicilio principal en Cartagena, Colombia, podrá actuar como responsable del tratamiento de los datos personales recolectados a través de este portal. Se garantiza que el uso de la información estará sujeto a las finalidades autorizadas por los titulares y a lo establecido en la ley estatutaria 1581 de 2012 o la normativa que la modifique. El tratamiento podrá incluir la recolección, almacenamiento, uso y circulación de datos bajo estrictos estándares de seguridad.'
      },
      {
        id: 'informacion',
        title: 'Información que puede recolectarse',
        body: 'El portal podrá recolectar datos de contacto (nombre, email, teléfono), información corporativa (NIT, razón social), datos de ubicación para despachos y datos técnicos de navegación. En el contexto B2B, TBS captura información necesaria para la validación comercial y financiera de los clientes, así como datos de los usuarios autorizados por las empresas para operar en la plataforma. No se recolectarán datos sensibles a menos que sea estrictamente necesario para la prestación del servicio y con autorización explícita.'
      },
      {
        id: 'finalidades',
        title: 'Finalidades del tratamiento',
        body: 'Los datos serán tratados con el fin de gestionar la relación comercial, procesar pedidos, coordinar entregas, gestionar pagos y proporcionar soporte técnico. Así mismo, la información podrá ser usada para enviar notificaciones operativas, actualizaciones del catálogo, promociones personalizadas y realizar análisis estadísticos internos sobre el uso del portal. El tratamiento busca optimizar la eficiencia de la cadena de suministro B2B para todos los actores involucrados.'
      },
      {
        id: 'clientes-b2b',
        title: 'Datos de clientes B2B',
        body: 'Para los clientes empresariales, TBS podrá tratar datos relacionados con el historial compras, facturación, cupos de crédito otorgados por proveedores y comportamiento de pago. Esta información es fundamental para mantener la trazabilidad de las operaciones comerciales y permitir el funcionamiento de los módulos de inteligencia de negocio y auditoría del portal TBS.'
      },
      {
        id: 'marcas',
        title: 'Datos de marcas',
        body: 'Los datos de marcas e importadores registrados en TBS serán tratados para la gestión de su inventario en plataforma, liquidación de ventas, ejecución de campañas de marketing y comunicación de insights sobre el desempeño de sus productos. TBS actúa como un habilitador tecnológico que organiza la información para mejorar la visibilidad de las marcas ante los canales de venta.'
      },
      {
        id: 'navegacion',
        title: 'Datos de navegación y medición',
        body: 'TBS podrá utilizar tecnologías de medición (como cookies) para entender el comportamiento de navegación en el portal. Actualmente, el proyecto utiliza una capa de medición en modo debug que registra eventos de interacción sin capturar datos personales sensibles, permitiendo la mejora continua de la usabilidad y la arquitectura de la plataforma antes de su lanzamiento productivo.'
      },
      {
        id: 'conservacion',
        title: 'Conservación de la información',
        body: 'Los datos personales se conservarán mientras dure la relación comercial o legal con TBS, o según sea necesario para cumplir con obligaciones contables, tributarias y auditorías comerciales. Una vez cumplida la finalidad y agotados los términos legales de conservación, se procederá a su supresión o anonimización, garantizando que no puedan ser asociados nuevamente al titular.'
      },
      {
        id: 'seguridad',
        title: 'Seguridad de la información',
        body: 'TBS implementa medidas técnicas, humanas y administrativas necesarias para otorgar seguridad a los registros evitando su adulteración, pérdida, consulta o uso no autorizado. Se utilizan protocolos de cifrado y controles de acceso restringido basados en roles definidos dentro de la arquitectura técnica del portal.'
      },
      {
        id: 'derechos',
        title: 'Derechos de los titulares',
        body: 'Conforme a la normativa vigente, los titulares tienen derecho a conocer, actualizar y rectificar sus datos personales frente a TBS; solicitar prueba de la autorización otorgada; ser informados sobre el uso que se les ha dado; revocar la autorización o solicitar la supresión en caso de tratamiento no autorizado; y acceder gratuitamente a sus datos personales.'
      },
      {
        id: 'contacto',
        title: 'Canales de contacto',
        body: 'Para el ejercicio de los derechos relacionados con la protección de datos, TBS dispondrá de canales oficiales como el correo electrónico de soporte y el chat interno del portal. Cualquier solicitud será tramitada en los términos de ley correspondientes por el oficial de protección de datos o el equipo encargado de la administración del portal.'
      },
      {
        id: 'cambios',
        title: 'Cambios en la política',
        body: 'TBS se reserva el derecho de modificar esta política en cualquier momento para adaptarla a novedades legislativas o corporativas. Cualquier cambio sustancial será notificado a través del portal TBS o por los conductos de comunicación habituales con los clientes y proveedores asociados.'
      }
    ]
  },
  {
    key: 'dataTreatment',
    slug: '/tratamiento-de-datos',
    title: 'Política de tratamiento de datos personales',
    seoTitle: 'Tratamiento de datos personales | TBS Destilados',
    seoDescription: 'Política base para el tratamiento de datos personales en TBS Destilados, orientada a clientes B2B, marcas y usuarios del portal.',
    updatedAt: '03 de Mayo de 2026',
    intro: 'TBS Destilados podrá tratar datos personales conforme a la normativa colombiana aplicable, incluyendo principios de legalidad, finalidad, libertad, veracidad, transparencia, acceso restringido, seguridad y confidencialidad. Este texto debe ser validado legalmente antes de producción.',
    sections: [
      {
        id: 'marco-normativo',
        title: 'Marco normativo de referencia',
        body: 'El tratamiento de datos personales en TBS se rige principalmente por la Ley 1581 de 2012, el Decreto 1074 de 2015 y demás normas que regulan el derecho de Habeas Data en Colombia. Este marco garantiza que la recolección de información se realice bajo el respeto de los derechos fundamentales de los titulares.'
      },
      {
        id: 'definiciones',
        title: 'Definiciones básicas',
        body: 'Para efectos de esta política, se entenderá por Autorización el consentimiento previo y expreso del Titular; Base de Datos como el conjunto organizado de datos; Dato Personal como cualquier información vinculada a una persona; y Responsable del Tratamiento como TBS Destilados SAS, quien decide sobre el uso de la base de datos.'
      },
      {
        id: 'principios',
        title: 'Principios aplicables',
        body: 'TBS aplica principios de legalidad en materia de tratamiento de datos; Finalidad legítima informada al titular; Libertad en el suministro de datos; Veracidad o calidad de la información tratada; Transparencia para obtener información en cualquier momento; Acceso y circulación restringida; Seguridad de los datos y Confidencialidad de la información.'
      },
      {
        id: 'autorizacion',
        title: 'Autorización del titular',
        body: 'El tratamiento de datos personales por parte de TBS requiere del consentimiento libre, previo, expreso e informado del titular. TBS obtendrá esta autorización a través de medios físicos o electrónicos, como formularios de registro o casillas de verificación en el portal, conservando prueba de dicha autorización para consulta posterior.'
      },
      {
        id: 'finalidades',
        title: 'Finalidades del tratamiento',
        body: 'TBS utilizará los datos recolectados para: validar la identidad de los clientes B2B; gestionar la logística de pedidos de licores; administrar el chat de asesoría técnica; remitir información sobre facturación y novedades en el catálogo; y cumplir con requerimientos legales o auditorías corporativas. Las finalidades siempre estarán limitadas al objeto social de TBS y la operación del portal.'
      },
      {
        id: 'derechos',
        title: 'Derechos del titular',
        body: 'El titular de los datos personales tiene derecho a: Acceder a sus datos; Actualizar su información; Rectificar datos inexactos; Solicitar la supresión de la información cuando proceda; y Revocar la autorización otorgada, siempre que no exista un deber legal o contractual que obligue a TBS a mantener la información.'
      },
      {
        id: 'procedimiento',
        title: 'Procedimiento para consultas y reclamos',
        body: 'Los titulares pueden presentar consultas sobre sus datos o reclamos por presunto incumplimiento de deberes legales mediante solicitud escrita enviada a los canales de TBS. La consulta será atendida en un plazo máximo de diez (10) días hábiles, y el reclamo en quince (15) días hábiles, prorrogables según la normativa vigente.'
      },
      {
        id: 'sensibles',
        title: 'Datos sensibles y menores de edad',
        body: 'TBS por regla general no trata datos sensibles (aquellos que afectan la intimidad o pueden generar discriminación). En caso de requerirlos, se informará el carácter facultativo de la respuesta. Respecto a menores de edad, TBS prohíbe el registro de usuarios que no cumplan la mayoría de edad legal, dado que el portal se enfoca en el sector de bebidas alcohólicas.'
      },
      {
        id: 'encargados',
        title: 'Encargados y terceros',
        body: 'TBS podrá entregar datos a terceros encargados del tratamiento (como proveedores tecnológicos de hosting, pasarelas de pago o servicios logísticos) para la correcta ejecución del servicio. Dichos terceros deberán adherirse a las políticas de seguridad y privacidad de TBS y actuar bajo sus instrucciones.'
      },
      {
        id: 'transferencia',
        title: 'Transferencia o transmisión de datos',
        body: 'En caso de que TBS realice transferencias internacionales de datos, se garantizará que el país receptor cuente con niveles adecuados de protección de datos conforme a lo definido por la Superintendencia de Industria y Comercio de Colombia, o se suscribirán contratos de transmisión de datos que regulen el flujo de información.'
      },
      {
        id: 'vigencia',
        title: 'Vigencia de las bases de datos',
        body: 'Las bases de datos gestionadas por TBS tendrán una vigencia equivalente al tiempo que se mantenga el vínculo comercial o legal con el titular, más un periodo adicional razonable para el cumplimiento de obligaciones legales de archivo y trazabilidad empresarial.'
      },
      {
        id: 'contacto-proteccion',
        title: 'Contacto para protección de datos',
        body: 'Cualquier comunicación dirigida al área encargada de la protección de datos personales en TBS debe realizarse a través del correo electrónico institucional definido por la compañía para tal fin. TBS designará un oficial de cumplimiento interno para velar por el respeto a los derechos de los usuarios.'
      }
    ]
  },
  {
    key: 'terms',
    slug: '/terminos-y-condiciones',
    title: 'Términos y condiciones',
    seoTitle: 'Términos y condiciones | TBS Destilados',
    seoDescription: 'Consulta los términos y condiciones generales de uso del portal TBS Destilados para clientes B2B, marcas y visitantes.',
    updatedAt: '03 de Mayo de 2026',
    intro: 'Estos términos regulan el uso del portal TBS por parte de visitantes, clientes B2B, usuarios empresariales y marcas. Son una base operativa para revisión legal antes de producción.',
    sections: [
      {
        id: 'objeto',
        title: 'Objeto del portal',
        body: 'El portal TBS tiene como objeto proporcionar una plataforma tecnológica para que empresas del sector horeca, licoreras y otros comercios autorizados gestionen su abastecimiento de licores directamente con marcas, importadores y distribuidores. TBS actúa como facilitador tecnológico y no siempre como vendedor directo de todos los bienes exhibidos.'
      },
      {
        id: 'usuarios',
        title: 'Usuarios permitidos',
        body: 'El acceso al portal está reservado exclusivamente a personas jurídicas o personas naturales con actividad mercantil debidamente registrada ante las autoridades competentes. Los usuarios deben ser mayores de edad y contar con las licencias legales requeridas para el comercio de bebidas alcohólicas en su jurisdicción correspondiente.'
      },
      {
        id: 'acceso-b2b',
        title: 'Acceso B2B y validación',
        body: 'Para operar en TBS, las empresas deben pasar por un proceso de validación de documentos (NIT, RUT, Cámara de Comercio). TBS se reserva el derecho de aprobar o negar el acceso basándose en criterios de veracidad de la información y cumplimiento de políticas comerciales internas. Cada usuario master es responsable de las credenciales otorgadas a su personal.'
      },
      {
        id: 'catalogo',
        title: 'Catálogo, precios y disponibilidad',
        body: 'Los precios, promociones y disponibilidad de productos mostrados en el portal son dinámicos y pueden variar según la ciudad de despacho, el tipo de cliente B2B y la marca proveedora. TBS procura mantener la información actualizada, pero se advierte que las existencias reales son confirmadas por los proveedores al momento del alistamiento del pedido.'
      },
      {
        id: 'pedidos',
        title: 'Pedidos y confirmación',
        body: 'La solicitud de productos a través del portal TBS constituye una orden de pedido sujeta a confirmación operativa. El portal notificará al usuario sobre el estado de su orden (Validación, Aprobado, Alistamiento, En tránsito, Entregado). Un pedido solo se considera en firme cuando el sistema de inventarios del proveedor o de TBS ha bloqueado las existencias.'
      },
      {
        id: 'pagos',
        title: 'Pagos, cartera y crédito',
        body: 'Los usuarios podrán pagar mediante métodos digitales habilitados o mediante cupos de crédito otorgados directamente por los proveedores registrados. TBS proporciona una interfaz de gestión de cartera para visualizar facturas pendientes y fechas de vencimiento. El incumplimiento en los pagos puede acarrear el bloqueo automático del acceso al catálogo B2B.'
      },
      {
        id: 'urgente',
        title: 'Pedido urgente',
        body: 'TBS ofrece una funcionalidad de pedido urgente sujeta a horarios específicos y disponibilidad de rutas logísticas rápidas ("Express"). El usuario reconoce que estas órdenes podrán tener condiciones comerciales particulares y costos logísticos diferenciados según la configuración operativa del momento.'
      },
      {
        id: 'marcas',
        title: 'Marcas',
        body: 'Las marcas e importadores que utilizan TBS como canal de venta son responsables de la calidad, registro sanitario y origen legal de los productos despachados a los clientes. TBS vigila el cumplimiento de estos estándares pero no asume responsabilidad directa por vicios ocultos o problemas de calidad que competen al fabricante original.'
      },
      {
        id: 'chat',
        title: 'Uso del chat interno',
        body: 'El chat con el asesor TBS es una herramienta de soporte profesional. Se prohíbe el uso de lenguaje ofensivo o el intercambio de datos sensibles innecesarios. TBS podrá almacenar la trazabilidad de las conversaciones con fines de auditoría del servicio y para resolver controversias sobre pedidos o acuerdos comerciales realizados por este medio.'
      },
      {
        id: 'propiedad',
        title: 'Propiedad intelectual',
        body: 'Todos los contenidos, diseños, código fuente, logotipos y bases de datos del portal TBS son propiedad exclusiva de TBS Destilados SAS o de sus licenciantes marcas aliadas. Queda prohibida la reproducción parcial o total, extracción de datos mediante robots (scraping) o cualquier uso comercial no autorizado de la arquitectura del portal.'
      },
      {
        id: 'aceptable',
        title: 'Uso aceptable del portal',
        body: 'Los usuarios se comprometen a usar el portal de buena fe, evitando cualquier acción que sobrecargue los servidores, intente vulnerar la seguridad de otros usuarios o introduzca información falsa. TBS monitorea los patrones de uso y podrá suspender cuentas que presenten comportamientos anómalos o de ciberataque detectados por sus sistemas.'
      },
      {
        id: 'responsabilidad',
        title: 'Limitaciones de responsabilidad',
        body: 'TBS no será responsable por daños indirectos, lucro cesante o pérdida de datos derivados de fallas técnicas menores o interrupciones programadas del servicio. La responsabilidad total de TBS en relación con cualquier transacción se limitará al valor de la transacción específica que generó la reclamación, salvo disposición legal en contrario.'
      },
      {
        id: 'cambios',
        title: 'Cambios en el servicio',
        body: 'TBS se reserva el derecho de retirar, modificar o expandir funcionalidades del portal en cualquier momento sin previo aviso, en búsqueda de la mejora operativa. Estas actualizaciones automáticas son parte del modelo de software como servicio (SaaS) bajo el cual opera la plataforma TBS.'
      },
      {
        id: 'ley-aplicable',
        title: 'Ley aplicable y jurisdicción',
        body: 'Estos términos se rigen ante todo por las leyes de la República de Colombia. Cualquier controversia técnica o comercial que no sea resuelta por mutuo acuerdo en primera instancia, será sometida a los tribunales competentes de la ciudad de Cartagena o mediante arbitraje si las partes así lo estipulan por contrato adjunto.'
      }
    ]
  },
  {
    key: 'cookies',
    slug: '/politica-de-cookies',
    title: 'Política de cookies y tecnologías de medición',
    seoTitle: 'Política de cookies | TBS Destilados',
    seoDescription: 'Conoce cómo TBS utiliza cookies esenciales, funcionales, analíticas y de marketing en su portal.',
    updatedAt: '03 de Mayo de 2026',
    intro: 'Esta política explica el uso de cookies y tecnologías similares dentro del portal TBS. Por ahora, el proyecto usa una capa de medición en modo debug y puede prepararse para futuras herramientas como Google Tag Manager o GA4.',
    sections: [
      {
        id: 'que-son',
        title: 'Qué son las cookies',
        body: 'Las cookies son pequeños archivos de texto que se almacenan en su navegador cuando visita un sitio web. Permiten que el portal recuerde sus preferencias de navegación, mantenga su sesión iniciada de forma segura y nos proporcione información técnica para que la plataformaTBS funcione de manera óptima en diferentes dispositivos.'
      },
      {
        id: 'tipos',
        title: 'Tipos de cookies',
        body: 'TBS puede agrupar sus cookies en cuatro categorías principales: Esenciales, que son estrictamente necesarias; Funcionales, que mejoran la experiencia; Analíticas, que miden el rendimiento agregado; y de Marketing, que sirven para segmentación de contenidos promocionales.'
      },
      {
        id: 'esenciales',
        title: 'Cookies esenciales',
        body: 'Son aquellas sin las cuales el portal TBS no podría operar. Incluyen las de seguridad del usuario, gestión de sesión, almacenamiento del carrito de compras y control de acceso a zonas restringidas del portal B2B. Al ser vitales para el servicio, no pueden desactivarse individualmente sin afectar la funcionalidad básica.'
      },
      {
        id: 'funcionales',
        title: 'Cookies funcionales',
        body: 'Permiten que el portal proporcione funciones mejoradas y mayor personalización, como recordar su ciudad de preferencia para el catálogo o mantener la configuración del visor de reportes seleccionado por el usuario. Pueden ser establecidas por TBS o por proveedores externos cuyos servicios hayamos agregado a nuestras páginas.'
      },
      {
        id: 'analiticas',
        title: 'Cookies analíticas o de rendimiento',
        body: 'Nos permiten contar las visitas y fuentes de tráfico para poder medir y mejorar el desempeño de TBS. Nos ayudan a saber qué páginas son las más o menos populares, qué flujos de compra son más rápidos y cómo se mueven los visitantes por el sitio. Actualmente se gestionan en modo debug para desarrollo.'
      },
      {
        id: 'marketing',
        title: 'Cookies de marketing',
        body: 'Aunque actualmente no se despliegan campañas de terceros, estas cookies podrían ser utilizadas en el futuro por TBS o aliados comerciales para crear un perfil de sus intereses y mostrar contenido relevante de las marcas que representamos en otros portales. Estas cookies no almacenan información personal directa, sino que se basan en la identificación única de su navegador.'
      },
      {
        id: 'gestion',
        title: 'Cómo gestionar preferencias',
        body: 'Puede configurar sus preferencias en cualquier momento a través del banner de consentimiento desplegado en la parte inferior del portal. Así mismo, la mayoría de navegadores permiten bloquear cookies de terceros en el menú de configuración de privacidad del software utilizado para acceder a TBS.'
      },
      {
        id: 'cambios',
        title: 'Cambios en esta política',
        body: 'TBS podrá actualizar esta política de cookies para reflejar cambios en las tecnologías de medición utilizadas. Se recomienda revisar este documento periódicamente para estar al tanto de cómo estamos optimizando su experiencia técnica dentro de la plataforma.'
      },
      {
        id: 'contacto',
        title: 'Contacto',
        body: 'Si tiene preguntas sobre el uso de cookies y tecnologías de rastreo en nuestro portal, puede comunicarse con nosotros a través de los canales de atención comercial o mediante el chat de asesoría disponible para usuarios registrados.'
      }
    ]
  },
  {
    key: 'ageNotice',
    slug: '/mayoria-de-edad-consumo-responsable',
    title: 'Mayoría de edad y consumo responsable',
    seoTitle: 'Mayoría de edad y consumo responsable | TBS Destilados',
    seoDescription: 'Información sobre mayoría de edad, consumo responsable y restricciones aplicables a bebidas alcohólicas en TBS.',
    updatedAt: '03 de Mayo de 2026',
    intro: 'TBS promueve el consumo responsable de bebidas alcohólicas. El acceso a productos y contenidos relacionados con bebidas alcohólicas debe estar limitado a personas mayores de edad conforme a la normativa aplicable.',
    sections: [
      {
        id: 'acceso-mayores',
        title: 'Acceso para mayores de edad',
        body: 'TBS es un portal especializado en el abastecimiento de licores a través de canales comerciales. Por tanto, el acceso al contenido detallado de productos y la realización de pedidos está estrictamente prohibido a menores de dieciocho (18) años, dando cumplimiento a lo establecido en la Ley 124 de 1994 o sus actualizaciones.'
      },
      {
        id: 'consumo-responsable',
        title: 'Consumo responsable',
        body: 'Promovemos que el consumo de los productos que comercializamos a través de nuestros clientes B2B se realice con moderación. Fomentamos la cultura del disfrute responsable, advirtiendo siempre que "El exceso de alcohol es perjudicial para la salud" y que no se debe conducir bajo los efectos del mismo.'
      },
      {
        id: 'restriccion-menores',
        title: 'Restricción de venta a menores',
        body: 'TBS advierte que "Prohíbase el expendio de bebidas embriagantes a menores de edad". Esta advertencia debe ser replicada por todos nuestros clientes B2B en sus respectivos puntos de venta físicos o digitales, manteniendo el compromiso de la industria con la protección de la infancia y adolescencia.'
      },
      {
        id: 'responsabilidad-usuario',
        title: 'Responsabilidad del usuario',
        body: 'Al navegar y utilizar las herramientas comerciales de TBS, el usuario manifiesta bajo gravedad de juramento que cumple con la edad legal para interactuar con licores. TBS podrá solicitar validaciones de identidad adicionales en cualquier momento para comprobar el cumplimiento de esta restricción legal.'
      },
      {
        id: 'clientes-b2b-licencias',
        title: 'Clientes B2B',
        body: 'Nuestros clientes empresariales están obligados a contar con todas las licencias administrativas vigentes para el expendio de licores. TBS podrá suspender el suministro a establecimientos comerciales que se sospeche facilitan el consumo de licores a menores de edad o que operan sin los permisos sanitarios requeridos.'
      },
      {
        id: 'eventos',
        title: 'Eventos y actividades',
        body: 'Cualquier actividad de promoción o evento de marca que se coordine a través de TBS deberá contemplar controles rigurosos de edad en el ingreso y durante el desarrollo de la activación, garantizando que no se involucre a población menor de edad en contenidos de marketing de destilados.'
      },
      {
        id: 'comunicacion-responsable',
        title: 'Comunicación comercial responsable',
        body: 'TBS se adhiere a los códigos de ética de la industria que regulan la publicidad de licores, evitando que los mensajes comerciales resulten atractivos para menores de edad o que promuevan comportamientos de consumo irresponsable o nocivo para el entorno social.'
      },
      {
        id: 'contacto',
        title: 'Contacto',
        body: 'Para reportar cualquier uso inadecuado de la plataforma o para obtener más información sobre nuestras políticas de consumo responsable, puede contactar al equipo TBS mediante los canales de atención comercial definidos en el portal.'
      }
    ]
  }
];

export const COOKIE_PREFERENCES_DEFAULT: CookiePreference[] = [
  {
    category: "essential",
    label: "Esenciales",
    description: "Necesarias para el funcionamiento básico del portal, navegación, seguridad y gestión de sesión.",
    required: true,
    enabled: true
  },
  {
    category: "functional",
    label: "Funcionales",
    description: "Permiten recordar preferencias de navegación y mejorar la experiencia del usuario.",
    required: false,
    enabled: false
  },
  {
    category: "analytics",
    label: "Analíticas o rendimiento",
    description: "Ayudan a entender cómo se usa el portal mediante eventos agregados y sin capturar datos personales sensibles.",
    required: false,
    enabled: false
  },
  {
    category: "marketing",
    label: "Marketing",
    description: "Podrían usarse en el futuro para medir campañas o audiencias, siempre sujeto a configuración y consentimiento aplicable.",
    required: false,
    enabled: false
  }
];
