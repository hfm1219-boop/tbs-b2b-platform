# TBS B2B Design System

Este documento define las bases visuales y los componentes comunes de la plataforma TBS para asegurar consistencia, claridad operativa y una estética premium.

## 1. Principios de Diseño

1. **Sobriedad B2B**: Menos es más. La información debe ser el centro.
2. **Claridad Operativa**: Jerarquías visuales claras para acciones rápidas.
3. **Confianza**: Uso de colores de estado consistentes y tipografía robusta.
4. **Estética Premium**: Bordes suaves (24px+), sombras sutiles y mucho espacio en blanco.

## 2. Tokens Visuales

- **Primary**: Rojo TBS (`#A90000`)
- **Text**: Gris Muy Oscuro (`#1F2933`)
- **Secondary Text**: Gris Medio (`#4B5563`)
- **Border**: Gris Claro (`#E4E7EC`)
- **Surface**: Blanco (`#FFFFFF`)
- **Background**: Gris Ultra Claro (`#FCFCFC`)

## 3. Componentes Base (`src/components/ui`)

### Button
Componente unificado para todas las acciones.
- **Variantes**: `primary`, `secondary`, `outline`, `ghost`, `danger`, `success`.
- **Tamaños**: `sm`, `md`, `lg`.

### StatusBadge
Para comunicar estados de pedidos, cartera o sistema de forma inequívoca.
- **Configuración**: Colores predefinidos para estados como `en_ruta`, `vencido`, `entregado`, etc.

### MetricCard
Tarjetas para dashboards con soporte para tendencias, progreso y CTAs.
- **Uso**: Resúmenes de cartera, pedidos del mes, KPIs.

### EmptyState
Para cuando no hay datos. Siempre ofrece una salida o explicación.
- **Variantes**: `neutral`, `noResults`, `noPermission`, `pendingApproval`.

### ActionCard
Accesos rápidos con iconos grandes y descripciones breves.
- **Variantes**: `default`, `highlight`, `outline`.

### SectionHeader
Títulos de sección consistentes con soporte para descripción y acciones laterales.

### AlertBox
Mensajes operativos dentro del flujo (info, success, warning, danger).

### TableShell
Contenedor visual para tablas con buscador, acciones y estados de carga.

### PageHero
Encabezados de página con soporte para imagen, acciones y variantes (public/dashboard).

### ModalShell
Contenedor unificado para ventanas emergentes con scroll interno y footer.

### FormField
Contenedor para inputs que asegura labels, mensajes de error y ayuda consistentes.

## 4. Mejores Prácticas

- **Radios**: Usar `rounded-xl` (12px) para inputs/botones pequeños y `rounded-[24px]` o `rounded-[32px]` para tarjetas y modales.
- **Espaciado**: Mantener `p-6` o `p-8` en tarjetas para dar aire al contenido.
- **Sombras**: Usar `panel-shadow` (personalizada en index.css) para elevación sutil.
- **Tipografía**: Títulos en `font-black tracking-tighter` para un look moderno y potente.
