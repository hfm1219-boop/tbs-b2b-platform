import { X, Plus, Minus, Trash2, ShoppingCart, CreditCard, UserPlus, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect } from 'react';
import { CartItem, User } from '../types';
import { useAnalytics } from '../hooks/useAnalytics';

interface CartDrawerProps {
  isOpen: boolean;
  currentUser: User | null;
  items: CartItem[];
  onClose: () => void;
  onIncrement: (productId: number, packagingId?: string) => void;
  onDecrement: (productId: number, packagingId?: string) => void;
  onRemove: (productId: number) => void;
  onClear: () => void;
  onCheckout: () => void;
  onRequestAccess: () => void;
  onGoToCatalog: () => void;
  onGoPromotions?: () => void;
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

export function CartDrawer({
  isOpen,
  currentUser,
  items,
  onClose,
  onIncrement,
  onDecrement,
  onRemove,
  onClear,
  onCheckout,
  onRequestAccess,
  onGoToCatalog,
  onGoPromotions,
}: CartDrawerProps) {
  const analytics = useAnalytics(currentUser);
  const totalUnits = items.reduce((sum, item) => sum + (item.totalUnits || item.quantity), 0);
  const isCliente = currentUser?.role === 'cliente_b2b' || currentUser?.role === 'hospitality_partner';
  const isProvider = currentUser?.role === 'marca' || currentUser?.role === 'proveedor';
  const isCash = currentUser?.commercialCondition === 'contado';

  const subtotal = items.reduce((sum, item) => {
    const pkgPrice = item.packaging?.packagePrice || (parsePrice(item.product.price) * (item.packaging?.unitsPerPackage || 1));
    const qty = item.packageQuantity || 1;
    return sum + (pkgPrice * qty);
  }, 0);

  useEffect(() => {
    if (isOpen) {
      analytics.track('cart_opened', 'cart', {
        productCount: items.length,
        units: totalUnits,
        cartValue: subtotal
      });
    }
  }, [isOpen, analytics, items.length, totalUnits, subtotal]);

  const handleClearCart = () => {
    analytics.track('cart_cleared', 'cart');
    onClear();
  };

  const handleCheckout = () => {
    analytics.track('checkout_started', 'checkout', {
      productCount: items.length,
      units: totalUnits,
      cartValue: subtotal
    });
    onCheckout();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-[180]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.aside
            className="fixed right-0 top-0 h-full w-full max-w-[460px] bg-white z-[190] shadow-2xl flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 260 }}
          >
            <div className="p-6 border-b border-[#F1F3F5] flex items-center justify-between">
              <div>
                <div className="text-[11px] font-black uppercase tracking-[0.18em] text-rojo">
                  Carrito B2B
                </div>
                <h2 className="text-2xl font-black text-texto">
                  Tu pedido
                </h2>
              </div>

              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full border border-[#F1F3F5] flex items-center justify-center hover:bg-rojo hover:text-white transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 rounded-full bg-rojo/10 flex items-center justify-center text-rojo mb-5">
                  <ShoppingCart size={36} />
                </div>

                <h3 className="text-xl font-black text-texto">
                  Tu carrito está vacío
                </h3>

                <p className="mt-2 text-sm font-semibold text-gris leading-relaxed max-w-[300px]">
                  Agrega productos desde el catálogo para construir tu pedido.
                </p>

                <button
                  onClick={onGoToCatalog}
                  className="mt-6 px-6 py-3 bg-rojo text-white rounded-md font-black hover:bg-rojo-oscuro transition-colors cursor-pointer"
                >
                  Ir al catálogo
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {items.map((item) => (
                    <article
                      key={item.product.id}
                      className="border border-[#F1F3F5] rounded-xl p-4 flex gap-4"
                    >
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
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

                        {item.packaging && (
                          <div className="mt-1 flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 bg-gray-100 text-gris font-black text-[9px] rounded uppercase border border-borde">
                              {item.packaging.label}
                            </span>
                            <span className="text-[9px] font-black text-rojo">
                              x{item.packaging.unitsPerPackage} und.
                            </span>
                          </div>
                        )}

                        <div className="mt-3 flex items-center justify-between gap-3">
                          <div>
                            <div className="text-[10px] text-gris font-bold uppercase">
                              {item.packaging && item.packaging.unitsPerPackage > 1 ? 'Precio caja' : 'Precio unitario'}
                            </div>
                            <div className="text-sm font-black text-texto">
                              $ {(item.packaging?.packagePrice || parsePrice(item.product.price)).toLocaleString('es-CO')}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                onDecrement(item.product.id, item.packaging?.id);
                                analytics.track('cart_item_quantity_changed', 'cart', {
                                  productId: item.product.id,
                                  productName: item.product.name,
                                  quantity: (item.packageQuantity || item.quantity) - 1,
                                  action: 'decrease'
                                });
                              }}
                              className="w-8 h-8 rounded-md border border-[#F1F3F5] flex items-center justify-center hover:border-rojo hover:text-rojo transition-colors cursor-pointer"
                            >
                              <Minus size={15} />
                            </button>

                            <span className="w-7 text-center font-black">
                              {item.packageQuantity || item.quantity}
                            </span>

                            <button
                              onClick={() => {
                                onIncrement(item.product.id, item.packaging?.id);
                                analytics.track('cart_item_quantity_changed', 'cart', {
                                  productId: item.product.id,
                                  productName: item.product.name,
                                  quantity: (item.packageQuantity || item.quantity) + 1,
                                  action: 'increase'
                                });
                              }}
                              className="w-8 h-8 rounded-md border border-[#F1F3F5] flex items-center justify-center hover:border-rojo hover:text-rojo transition-colors cursor-pointer"
                            >
                              <Plus size={15} />
                            </button>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between border-t border-[#F1F3F5] pt-3">
                          <div className="text-sm font-black text-rojo">
                            {formatCOP((item.packaging?.packagePrice || parsePrice(item.product.price)) * (item.packageQuantity || 1))}
                          </div>

                          <button
                            onClick={() => {
                              onRemove(item.product.id);
                              analytics.track('cart_item_quantity_changed', 'cart', {
                                productId: item.product.id,
                                productName: item.product.name,
                                quantity: 0,
                                action: 'remove'
                              });
                            }}
                            className="text-gris hover:text-rojo transition-colors cursor-pointer"
                            title="Eliminar producto"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="border-t border-[#F1F3F5] p-6 bg-[#FCFCFC] space-y-4">
                  {isCliente && onGoPromotions && (
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                      <div className="flex items-start gap-3">
                        <Tag size={18} className="text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-black text-blue-900">¿Quieres ahorrar más?</p>
                          <p className="text-[10px] font-bold text-blue-700 mt-1 leading-tight">Revisa las promociones B2B vigentes para tu negocio antes de cerrar el pedido.</p>
                          <button 
                            onClick={() => {
                              onClose();
                              onGoPromotions();
                            }}
                            className="mt-2 text-xs font-black text-blue-700 underline hover:text-blue-900 cursor-pointer"
                          >
                            Ver promociones
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm font-bold text-texto-sec">
                    <span>Resumen</span>
                    <span>{items.length} productos / {totalUnits} unidades</span>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-base font-black text-texto">
                      Total estimado
                    </span>
                    <span className="text-2xl font-black text-texto">
                      {formatCOP(subtotal)}
                    </span>
                  </div>

                  {isCash && (
                    <div className="mt-2 text-[10px] font-black text-orange-600 uppercase tracking-widest text-center px-4">
                      Cliente contado: el pedido requerirá pago anticipado o confirmación de pago.
                    </div>
                  )}

                  {isProvider ? (
                    <div className="mt-4 rounded-lg bg-gray-50 border border-gray-100 p-4 text-sm font-semibold text-gris text-center leading-relaxed">
                      Este perfil está configurado para gestión de marca. Para realizar compras B2B, por favor utiliza un perfil de cliente.
                    </div>
                  ) : !isCliente && (
                    <div className="mt-4 rounded-lg bg-rojo/5 border border-rojo/10 p-4 text-sm font-semibold text-texto-sec leading-relaxed">
                      Para ver precios B2B, disponibilidad real, crédito y condiciones comerciales,
                      solicita acceso o inicia sesión.
                    </div>
                  )}

                  <button
                    onClick={() => {
                      if (isCliente) {
                        handleCheckout();
                      } else if (isProvider) {
                        onClose();
                      } else {
                        onRequestAccess();
                      }
                    }}
                    disabled={isProvider}
                    className={`mt-5 w-full h-14 rounded-xl font-black flex items-center justify-center gap-3 transition-colors cursor-pointer ${
                      isProvider ? 'bg-gray-200 text-gris cursor-not-allowed' : 'bg-rojo text-white hover:bg-rojo-oscuro'
                    }`}
                  >
                    {isCliente ? (
                      <>
                        <CreditCard size={20} />
                        {isCash ? 'Continuar a pago' : 'Continuar pedido'}
                      </>
                    ) : isProvider ? (
                      <>
                        <X size={20} />
                        Compra no disponible
                      </>
                    ) : (
                      <>
                        <UserPlus size={20} />
                        Solicitar acceso B2B
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleClearCart}
                    className="mt-3 w-full text-sm font-black text-gris hover:text-rojo transition-colors cursor-pointer"
                  >
                    Vaciar carrito
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
