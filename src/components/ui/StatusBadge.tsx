import React from 'react';
import { LucideIcon } from 'lucide-react';

export type StatusType = 
  // Pedidos
  | 'recibido' | 'validando_cartera' | 'en_preparacion' | 'facturado' | 'programado' | 'en_ruta' | 'entregado' | 'con_novedad' | 'cancelado' | 'reprogramado' | 'entrega_parcial' | 'rechazado'
  // Cartera
  | 'al_dia' | 'proximo_a_vencer' | 'vencido' | 'pagado' | 'pago_pendiente' | 'en_disputa' | 'pago_rechazado'
  // Productos
  | 'disponible' | 'bajo_stock' | 'sin_stock' | 'entrega_urgente' | 'patrocinado' | 'recomendado' | 'producto_frecuente' | 'promocion_activa' | 'sujeto_confirmacion'
  // Proveedor / Marca
  | 'activo' | 'inactivo' | 'pendiente_revision' | 'aprobado' | 'denegado' | 'en_revision' | 'con_errores'
  // Hospitality
  | 'comision_estimada' | 'comision_aprobada' | 'comision_pagada' | 'cliente_pendiente' | 'evento_programado'
  // Sistema / General
  | 'borrador' | 'enviado' | 'error' | 'completado' | 'bloqueado' | 'urgente' | 'prioridad_alta' | 'prioridad_media' | 'prioridad_baja' | 'sujeto_validacion';

interface StatusBadgeProps {
  status: StatusType | string;
  label?: string;
  icon?: LucideIcon;
  className?: string;
}

const statusConfig: Record<string, { color: string; label: string }> = {
  // Pedidos
  recibido: { color: 'bg-blue-50 text-blue-700 border-blue-100', label: 'Pedido recibido' },
  validando_cartera: { color: 'bg-amber-50 text-amber-700 border-amber-100', label: 'Validación de cartera' },
  en_preparacion: { color: 'bg-indigo-50 text-indigo-700 border-indigo-100', label: 'En preparación' },
  facturado: { color: 'bg-emerald-50 text-emerald-700 border-emerald-100', label: 'Facturado' },
  programado: { color: 'bg-cyan-50 text-cyan-700 border-cyan-100', label: 'Programado' },
  en_ruta: { color: 'bg-rojo-suave text-rojo border-red-100 animate-pulse', label: 'En ruta' },
  entregado: { color: 'bg-green-50 text-green-700 border-green-100', label: 'Entregado' },
  con_novedad: { color: 'bg-rose-100 text-rose-800 border-rose-200', label: 'Con novedad' },
  reprogramado: { color: 'bg-violet-50 text-violet-700 border-violet-100', label: 'Reprogramado' },
  entrega_parcial: { color: 'bg-yellow-50 text-yellow-700 border-yellow-100', label: 'Entrega parcial' },
  cancelado: { color: 'bg-gray-100 text-gray-700 border-gray-200', label: 'Cancelado' },
  rechazado: { color: 'bg-red-50 text-red-700 border-red-100', label: 'Rechazado' },

  // Cartera
  al_dia: { color: 'bg-green-50 text-green-700 border-green-100', label: 'Al día' },
  proximo_a_vencer: { color: 'bg-amber-50 text-amber-700 border-amber-100', label: 'Próximo a vencer' },
  vencido: { color: 'bg-red-50 text-red-700 border-red-100', label: 'Factura vencida' },
  pagado: { color: 'bg-green-50 text-green-700 border-green-100', label: 'Pagado' },
  pago_pendiente: { color: 'bg-slate-50 text-slate-700 border-slate-100', label: 'Pago pendiente' },
  en_disputa: { color: 'bg-amber-500 text-white border-amber-600 shadow-sm shadow-amber-200', label: 'En disputa' },
  disputa: { color: 'bg-amber-500 text-white border-amber-600 shadow-sm shadow-amber-200', label: 'En disputa' },
  pago_rechazado: { color: 'bg-red-50 text-red-700 border-red-100', label: 'Pago rechazado' },

  // Productos
  disponible: { color: 'bg-green-50 text-green-700 border-green-100', label: 'Disponible' },
  bajo_stock: { color: 'bg-amber-50 text-amber-700 border-amber-100', label: 'Bajo stock' },
  sin_stock: { color: 'bg-gray-100 text-gray-400 border-gray-200', label: 'Sin disponibilidad' },
  entrega_urgente: { color: 'bg-rojo text-white border-rojo', label: 'Entrega urgente' },
  patrocinado: { color: 'bg-amber-50 text-amber-600 border-amber-200', label: 'Patrocinado' },
  recomendado: { color: 'bg-indigo-50 text-indigo-600 border-indigo-200', label: 'Recomendación TBS' },
  producto_frecuente: { color: 'bg-blue-50 text-blue-600 border-blue-200', label: 'Producto frecuente' },
  promocion_activa: { color: 'bg-rose-50 text-rose-600 border-rose-200', label: 'Promoción B2B' },
  sujeto_confirmacion: { color: 'bg-gray-100 text-gray-700 border-gray-200', label: 'Sujeto a confirmación' },

  // Proveedor
  activo: { color: 'bg-green-50 text-green-700 border-green-100', label: 'Activo' },
  inactivo: { color: 'bg-gray-100 text-gray-400 border-gray-200', label: 'Inactivo' },
  pendiente_revision: { color: 'bg-amber-50 text-amber-700 border-amber-100', label: 'Pendiente revisión' },
  en_revision: { color: 'bg-blue-50 text-blue-700 border-blue-100', label: 'En revisión TBS' },
  aprobado: { color: 'bg-green-50 text-green-700 border-green-100', label: 'Aprobado' },
  denegado: { color: 'bg-red-50 text-red-700 border-red-100', label: 'Denegado' },
  con_errores: { color: 'bg-rose-50 text-rose-700 border-rose-100', label: 'Con errores' },

  // Hospitality
  comision_estimada: { color: 'bg-blue-50 text-blue-700 border-blue-100', label: 'Comisión estimada' },
  comision_aprobada: { color: 'bg-green-50 text-green-700 border-green-100', label: 'Comisión aprobada' },
  comision_pagada: { color: 'bg-indigo-50 text-indigo-700 border-indigo-100', label: 'Comisión pagada' },
  cliente_pendiente: { color: 'bg-amber-50 text-amber-700 border-amber-100', label: 'Cliente pendiente' },
  evento_programado: { color: 'bg-cyan-50 text-cyan-700 border-cyan-100', label: 'Evento programado' },

  // General
  borrador: { color: 'bg-gray-100 text-gray-600 border-gray-200', label: 'Borrador' },
  enviado: { color: 'bg-blue-50 text-blue-700 border-blue-100', label: 'Enviado' },
  error: { color: 'bg-red-50 text-red-700 border-red-100', label: 'Error' },
  completado: { color: 'bg-green-50 text-green-700 border-green-100', label: 'Completado' },
  bloqueado: { color: 'bg-gray-950 text-white border-gray-900', label: 'Bloqueado' },
  urgente: { color: 'bg-rojo text-white border-rojo', label: 'Urgente' },
  prioridad_alta: { color: 'bg-red-100 text-red-700 border-red-200', label: 'Prioridad alta' },
  prioridad_media: { color: 'bg-amber-100 text-amber-700 border-amber-200', label: 'Prioridad media' },
  prioridad_baja: { color: 'bg-blue-100 text-blue-700 border-blue-200', label: 'Prioridad baja' },
  sujeto_validacion: { color: 'bg-slate-100 text-slate-700 border-slate-200', label: 'Sujeto a validación' }
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  label, 
  icon: Icon, 
  className = '' 
}) => {
  const config = statusConfig[status.toLowerCase()] || { color: 'bg-gray-50 text-gray-700 border-gray-100', label: status };
  const displayLabel = label || config.label;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest border rounded-lg ${config.color} ${className}`}>
      {Icon && <Icon size={12} />}
      {displayLabel}
    </div>
  );
};
