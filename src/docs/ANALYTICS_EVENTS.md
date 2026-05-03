# TBS Analytics & Conversion Tracking

## Objetivo
Medir el comportamiento del usuario en el portal TBS Destilados para optimizar la conversión B2B, mejorar la experiencia del cliente y preparar el terreno para integraciones con GA4 y Google Tag Manager.

## Implementación Técnica
- **Modo**: DataLayer + Debug Console.
- **Estructura**: Los eventos se envían a `window.dataLayer`.
- **Privacidad**: Se aplica una capa de sanitización estricta (PII Sanitization) para evitar capturar correos, teléfonos, NITs o datos sensibles.

## Eventos Principales

### Navegación y Adquisición
- `page_view`: Captura la página actual y el rol del usuario.
- `cta_click`: Medición de clics en botones importantes.
- `access_request_started`: Cuando un visitante inicia su solicitud B2B.
- `access_request_submitted`: Conversión principal de visitante a lead B2B.

### Autenticación
- `login_modal_opened`: Interés en entrar a la plataforma.
- `login_success`: Acceso exitoso.
- `logout`: Cierre de sesión.

### E-commerce B2B (Catálogo y Carrito)
- `catalog_viewed`: Visualización del portafolio.
- `product_viewed`: Interés específico en un ítem.
- `product_added_to_cart`: Intención de compra.
- `checkout_started`: Inicio del proceso de pedido.
- `order_created`: Pedido finalizado con éxito.

### Soporte e Interacción
- `advisor_chat_opened`: Uso del canal de ayuda humana.
- `faq_search`: Dudas comunes del usuario.
- `blog_article_viewed`: Engagement con contenido de valor.
- `phone_click`: Intención de contacto directo desde móviles.

## Conversiones Clave (KPIs)
1. `access_request_submitted` (Nuevos leads)
2. `order_created` (Ventas finalizadas)
3. `urgent_order_submitted` (Pedidos críticos)
4. `advisor_conversation_created` (Soporte activo)
5. `login_success` (Retención de clientes)

## Cómo Validar
1. **Consola**: Busca mensajes con el prefijo `[TBS Analytics]`.
2. **DataLayer**: Escribe `window.dataLayer` en la consola para ver el historial de eventos de la sesión.
3. **Debug Panel**: Usa el panel flotante (solo en modo debug) para ver eventos en tiempo real.

## Seguridad y Privacidad (PII)
**PROHIBIDO CAPTURAR**:
- Emails (`user@domain.com`)
- Teléfonos (`314...`)
- NIT / Documentos
- Direcciones exactas
- Texto de mensajes del chat
- Contraseñas

Cualquier campo que contenga estos datos será automáticamente reemplazado o eliminado por el servicio de sanitización antes de enviarse al `dataLayer`.
