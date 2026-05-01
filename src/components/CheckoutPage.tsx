import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  MapPin,
  CalendarDays,
  Clock,
  MessageSquareText,
  PackageCheck,
  ShoppingCart,
  Truck,
  WalletCards,
} from 'lucide-react';
import { CartItem, User } from '../types';

interface CheckoutPageProps {
  items: CartItem[];
  currentUser: User | null;
  onBack: () => void;
  onFinish: () => void;
}

function parsePrice(price: string) {
  return Number(price.replace(/[^0-9]/g, '')) || 0;
}

function formatCOP(value: number) {
  return value.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  });
}

export function CheckoutPage({ items, currentUser, onBack, onFinish }: CheckoutPageProps) {
  const [confirmed, setConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    contactName: currentUser?.name || 'Humberto',
    phone: '',
    city: currentUser?.city || 'Cartagena',
    address: '',
    deliveryDate: '',
    deliveryWindow: 'Mañana: 8:00 a.m. - 12:00 p.m.',
    paymentMethod: 'Crédito B2B',
    cardFranchise: 'Visa', // New field
    notes: '',
  });

  const totalUnits = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      return sum + parsePrice(item.product.price) * item.quantity;
    }, 0);
  }, [items]);

  const ivaEstimado = Math.round(subtotal * 0.19);
  const totalConIva = subtotal + ivaEstimado;

  const cardCommissionPercent = useMemo(() => {
    if (form.paymentMethod === 'Tarjeta de crédito') {
      if (form.cardFranchise === 'American Express') return 0.03;
      return 0.02; // Visa / Mastercard
    }
    return 0;
  }, [form.paymentMethod, form.cardFranchise]);

  const commissionValue = Math.round(totalConIva * cardCommissionPercent);
  const totalEstimado = totalConIva + commissionValue;

  const isValid =
    form.contactName.trim() &&
    form.phone.trim() &&
    form.city.trim() &&
    form.address.trim() &&
    form.deliveryDate.trim() &&
    form.deliveryWindow.trim() &&
    form.paymentMethod.trim();

  const handleChange = (
    field: keyof typeof form,
    value: string
  ) => {
    if (field === 'paymentMethod' && value === 'Tarjeta de crédito') {
      alert("Atención: Los pagos con tarjeta de crédito tienen una comisión administrativa (Visa/Mastercard 2%, Amex 3%) que se sumará al total.");
    }
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleConfirm = async () => {
    if (!isValid) return;
    
    setIsSubmitting(true);
    try {
      // Integration with the backend API I created earlier
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderDetails: {
            items: items.map(item => ({
              id: item.product.id,
              name: item.product.name,
              quantity: item.quantity,
              price: item.product.price
            })),
            totalUnits,
            estimatedTotal: totalEstimado,
            form: form
          },
          userEmail: currentUser?.email || "h.fm1219@gmail.com" // Recommended to keep consistent with previous setup
        }),
      });
      
      if (response.ok) {
        setConfirmed(true);
      } else {
        alert("Hubo un problema al procesar el pedido.");
      }
    } catch (error) {
      console.error("Order error:", error);
      alert("Error de conexión.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && !confirmed) {
    return (
      <main className="min-h-screen bg-[#FCFCFC] flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white rounded-2xl border border-[#F1F3F5] p-8 text-center shadow-sm">
          <div className="w-20 h-20 mx-auto rounded-full bg-rojo/10 flex items-center justify-center text-rojo">
            <ShoppingCart size={36} />
          </div>

          <h1 className="mt-5 text-2xl font-black text-texto">
            No tienes productos en el carrito
          </h1>

          <p className="mt-3 text-sm font-semibold text-gris leading-relaxed">
            Agrega productos desde el catálogo para poder continuar con el checkout.
          </p>

          <button
            onClick={onBack}
            className="mt-6 bg-rojo text-white rounded-lg px-6 py-3 font-black hover:bg-rojo-oscuro transition-colors cursor-pointer"
          >
            Volver al catálogo
          </button>
        </div>
      </main>
    );
  }

  if (confirmed) {
    return (
      <main className="min-h-screen bg-[#FCFCFC] flex items-center justify-center px-6">
        <div className="max-w-2xl w-full bg-white rounded-2xl border border-[#F1F3F5] p-10 text-center shadow-sm">
          <div className="w-24 h-24 mx-auto rounded-full bg-green-50 flex items-center justify-center text-green-600">
            <CheckCircle2 size={52} />
          </div>

          <div className="mt-5 text-[11px] font-black uppercase tracking-[0.18em] text-rojo">
            Pedido recibido
          </div>

          <h1 className="mt-3 text-3xl font-black text-texto">
            Tu pedido fue enviado para validación.
          </h1>

          <p className="mt-4 text-base font-semibold text-gris leading-relaxed">
            El equipo TBS revisará disponibilidad, condiciones comerciales, cupo y ventana logística.
            Recibirás confirmación por el canal registrado.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div className="rounded-xl border border-[#F1F3F5] p-4">
              <div className="text-xs font-black text-gris uppercase">Unidades</div>
              <div className="mt-1 text-xl font-black text-texto">{totalUnits}</div>
            </div>

            <div className="rounded-xl border border-[#F1F3F5] p-4">
              <div className="text-xs font-black text-gris uppercase">Total estimado</div>
              <div className="mt-1 text-xl font-black text-texto">{formatCOP(totalEstimado)}</div>
            </div>

            <div className="rounded-xl border border-[#F1F3F5] p-4">
              <div className="text-xs font-black text-gris uppercase">Pago</div>
              <div className="mt-1 text-xl font-black text-texto">{form.paymentMethod}</div>
            </div>
          </div>

          <button
            onClick={onFinish}
            className="mt-8 bg-rojo text-white rounded-lg px-8 py-4 font-black hover:bg-rojo-oscuro transition-colors cursor-pointer"
          >
            Volver al inicio
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FCFCFC]">
      <div className="max-w-[1380px] mx-auto px-8 py-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-black text-gris hover:text-rojo transition-colors cursor-pointer"
        >
          <ArrowLeft size={18} />
          Volver al carrito
        </button>

        <div className="mt-6">
          <div className="text-[12px] font-black uppercase tracking-[0.18em] text-rojo">
            Checkout B2B
          </div>

          <h1 className="mt-2 text-4xl font-black tracking-[-0.04em] text-texto">
            Confirmar pedido
          </h1>

          <p className="mt-3 text-base font-semibold text-gris max-w-2xl leading-relaxed">
            Completa la información de entrega y pago. El pedido quedará sujeto a validación
            de inventario, condiciones comerciales, cupo y disponibilidad logística.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8">
          <section className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#F1F3F5] p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-rojo/10 flex items-center justify-center text-rojo">
                  <Truck size={23} />
                </div>

                <div>
                  <h2 className="text-xl font-black text-texto">
                    Información de entrega
                  </h2>
                  <p className="text-sm font-semibold text-gris">
                    Datos necesarios para coordinar la entrega.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-black text-texto mb-2">
                    Nombre de contacto
                  </label>
                  <input
                    value={form.contactName}
                    onChange={(e) => handleChange('contactName', e.target.value)}
                    className="w-full h-12 rounded-lg border border-[#F1F3F5] px-4 outline-none focus:border-rojo"
                    placeholder="Nombre del responsable"
                  />
                </div>

                <div>
                  <label className="block text-sm font-black text-texto mb-2">
                    Celular de contacto
                  </label>
                  <input
                    value={form.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full h-12 rounded-lg border border-[#F1F3F5] px-4 outline-none focus:border-rojo"
                    placeholder="Ej: 300 123 4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-black text-texto mb-2">
                    Ciudad
                  </label>
                  <div className="relative">
                    <select
                      value={form.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      className="w-full h-12 rounded-lg border border-[#F1F3F5] px-4 outline-none focus:border-rojo appearance-none bg-white cursor-pointer"
                    >
                      <option>Cartagena</option>
                      <option>Barranquilla</option>
                      <option>Santa Marta</option>
                      <option>Montería</option>
                      <option>Sincelejo</option>
                      <option>Valledupar</option>
                      <option>Otra ciudad</option>
                    </select>
                    <MapPin
                      size={18}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gris pointer-events-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-black text-texto mb-2">
                    Fecha deseada de entrega
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={form.deliveryDate}
                      onChange={(e) => handleChange('deliveryDate', e.target.value)}
                      className="w-full h-12 rounded-lg border border-[#F1F3F5] px-4 outline-none focus:border-rojo cursor-pointer"
                    />
                    <CalendarDays
                      size={18}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gris pointer-events-none"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-black text-texto mb-2">
                    Dirección de entrega
                  </label>
                  <input
                    value={form.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className="w-full h-12 rounded-lg border border-[#F1F3F5] px-4 outline-none focus:border-rojo"
                    placeholder="Dirección completa, barrio, punto de referencia"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-black text-texto mb-2">
                    Ventana de entrega
                  </label>
                  <div className="relative">
                    <select
                      value={form.deliveryWindow}
                      onChange={(e) => handleChange('deliveryWindow', e.target.value)}
                      className="w-full h-12 rounded-lg border border-[#F1F3F5] px-4 outline-none focus:border-rojo appearance-none bg-white cursor-pointer"
                    >
                      <option>Mañana: 8:00 a.m. - 12:00 p.m.</option>
                      <option>Tarde: 12:00 p.m. - 5:00 p.m.</option>
                      <option>Noche: 5:00 p.m. - 9:00 p.m.</option>
                      <option>Pedido urgente sujeto a disponibilidad</option>
                    </select>
                    <Clock
                      size={18}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gris pointer-events-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#F1F3F5] p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-rojo/10 flex items-center justify-center text-rojo">
                  <WalletCards size={23} />
                </div>

                <div>
                  <h2 className="text-xl font-black text-texto">
                    Método de pago
                  </h2>
                  <p className="text-sm font-semibold text-gris">
                    Selecciona cómo deseas pagar este pedido.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  'Crédito B2B',
                  'PSE',
                  'Tarjeta de crédito',
                  'QR / pago en línea',
                ].map((method) => (
                  <button
                    key={method}
                    onClick={() => handleChange('paymentMethod', method)}
                    className={`text-left rounded-xl border p-4 transition-colors cursor-pointer ${
                      form.paymentMethod === method
                        ? 'border-rojo bg-rojo/5'
                        : 'border-[#F1F3F5] bg-white hover:border-rojo'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard size={20} className="text-rojo" />
                      <span className="font-black text-texto">{method}</span>
                    </div>

                    <p className="mt-2 text-xs font-semibold text-gris leading-relaxed">
                      {method === 'Crédito B2B'
                        ? 'Sujeto a cupo disponible y política comercial.'
                        : 'Pago digital desde la plataforma.'}
                    </p>

                    {method === 'Tarjeta de crédito' && form.paymentMethod === 'Tarjeta de crédito' && (
                      <div className="mt-3 pt-3 border-t border-rojo/10">
                        <label className="block text-[10px] font-black text-rojo uppercase mb-2">Franquicia</label>
                        <div className="flex flex-wrap gap-2">
                          {['Visa', 'MasterCard', 'American Express'].map(franchise => (
                            <button
                              key={franchise}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleChange('cardFranchise', franchise);
                              }}
                              className={`px-2 py-1 rounded text-[10px] font-black border transition-all ${
                                form.cardFranchise === franchise
                                  ? 'bg-rojo text-white border-rojo'
                                  : 'bg-white text-gris border-borde hover:border-rojo'
                              }`}
                            >
                              {franchise}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#F1F3F5] p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-rojo/10 flex items-center justify-center text-rojo">
                  <MessageSquareText size={23} />
                </div>

                <div>
                  <h2 className="text-xl font-black text-texto">
                    Observaciones
                  </h2>
                  <p className="text-sm font-semibold text-gris">
                    Agrega instrucciones especiales para el pedido o la entrega.
                  </p>
                </div>
              </div>

              <textarea
                value={form.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                className="mt-6 w-full min-h-[120px] rounded-lg border border-[#F1F3F5] px-4 py-3 outline-none focus:border-rojo"
                placeholder="Ej: entregar en recepción, llamar antes de llegar, separar por sede, pedido para evento, etc."
              />
            </div>
          </section>

          <aside className="lg:sticky lg:top-6 h-fit bg-white rounded-2xl border border-[#F1F3F5] p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-rojo/10 flex items-center justify-center text-rojo">
                <PackageCheck size={23} />
              </div>

              <div>
                <h2 className="text-xl font-black text-texto">
                  Resumen del pedido
                </h2>
                <p className="text-sm font-semibold text-gris">
                  {totalUnits} unidades agregadas
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4 max-h-[360px] overflow-y-auto pr-1 custom-scrollbar">
              {items.map((item) => (
                <article key={item.product.id} className="flex gap-3 border-b border-[#F1F3F5] pb-4 last:border-0 last:pb-0">
                  <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-black text-rojo uppercase tracking-widest">
                      {item.product.category}
                    </div>

                    <h3 className="mt-1 text-sm font-black text-texto leading-tight">
                      {item.product.name}
                    </h3>

                    <div className="mt-1 text-xs font-semibold text-gris">
                      {item.quantity} x {item.product.price}
                    </div>
                  </div>

                  <div className="text-sm font-black text-texto">
                    {formatCOP(parsePrice(item.product.price) * item.quantity)}
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between font-semibold text-texto-sec">
                <span>Subtotal estimado</span>
                <span>{formatCOP(subtotal)}</span>
              </div>

              <div className="flex justify-between font-semibold text-texto-sec">
                <span>IVA estimado (19%)</span>
                <span>{formatCOP(ivaEstimado)}</span>
              </div>

              {commissionValue > 0 && (
                <div className="flex justify-between font-black text-rojo italic bg-rojo/5 p-2 rounded-md">
                  <span>Recargo tarjeta ({cardCommissionPercent * 100}%)</span>
                  <span>{formatCOP(commissionValue)}</span>
                </div>
              )}

              <div className="pt-3 border-t border-[#F1F3F5] flex justify-between items-center">
                <span className="text-base font-black text-texto">
                  Total estimado
                </span>
                <span className="text-2xl font-black text-texto">
                  {formatCOP(totalEstimado)}
                </span>
              </div>
            </div>

            <div className="mt-5 rounded-xl bg-rojo/5 border border-rojo/10 p-4">
              <div className="text-sm font-black text-texto">
                Validación comercial
              </div>
              <p className="mt-1 text-xs font-semibold text-texto-sec leading-relaxed">
                El total puede variar según disponibilidad, descuentos, impuestos,
                acuerdos comerciales y condiciones finales del cliente.
              </p>
            </div>

            <button
              onClick={handleConfirm}
              disabled={!isValid || isSubmitting}
              className={`mt-5 w-full rounded-xl px-6 py-4 font-black flex items-center justify-center gap-3 transition-all cursor-pointer ${
                isValid && !isSubmitting
                  ? 'bg-rojo text-white hover:bg-rojo-oscuro hover:scale-[1.02] active:scale-[0.98]'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <PackageCheck size={20} />
              )}
              {isSubmitting ? 'Procesando...' : 'Confirmar pedido'}
            </button>

            {!isValid && (
              <p className="mt-3 text-xs font-semibold text-rojo leading-relaxed text-center">
                Completa todos los campos obligatorios para continuar.
              </p>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
