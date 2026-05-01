import { X, Plus, Minus, Trash2, ShoppingCart, CreditCard, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, User } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  currentUser: User | null;
  items: CartItem[];
  onClose: () => void;
  onIncrement: (productId: number) => void;
  onDecrement: (productId: number) => void;
  onRemove: (productId: number) => void;
  onClear: () => void;
  onCheckout: () => void;
  onRequestAccess: () => void;
  onGoToCatalog: () => void;
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
}: CartDrawerProps) {
  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);
  const isCliente = !!currentUser;

  const subtotal = items.reduce((sum, item) => {
    return sum + parsePrice(item.product.price) * item.quantity;
  }, 0);

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

                        <p className="mt-1 text-xs font-semibold text-gris">
                          {item.product.specs}
                        </p>

                        <div className="mt-3 flex items-center justify-between gap-3">
                          <div>
                            <div className="text-[10px] text-gris font-bold uppercase">
                              Precio unitario
                            </div>
                            <div className="text-sm font-black text-texto">
                              {item.product.price}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onDecrement(item.product.id)}
                              className="w-8 h-8 rounded-md border border-[#F1F3F5] flex items-center justify-center hover:border-rojo hover:text-rojo transition-colors cursor-pointer"
                            >
                              <Minus size={15} />
                            </button>

                            <span className="w-7 text-center font-black">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() => onIncrement(item.product.id)}
                              className="w-8 h-8 rounded-md border border-[#F1F3F5] flex items-center justify-center hover:border-rojo hover:text-rojo transition-colors cursor-pointer"
                            >
                              <Plus size={15} />
                            </button>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between border-t border-[#F1F3F5] pt-3">
                          <div className="text-sm font-black text-texto">
                            {formatCOP(parsePrice(item.product.price) * item.quantity)}
                          </div>

                          <button
                            onClick={() => onRemove(item.product.id)}
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

                <div className="border-t border-[#F1F3F5] p-6 bg-[#FCFCFC]">
                  <div className="flex items-center justify-between text-sm font-bold text-texto-sec">
                    <span>Productos</span>
                    <span>{totalUnits} unidades</span>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-base font-black text-texto">
                      Total estimado
                    </span>
                    <span className="text-2xl font-black text-texto">
                      {formatCOP(subtotal)}
                    </span>
                  </div>

                  {!isCliente && (
                    <div className="mt-4 rounded-lg bg-rojo/5 border border-rojo/10 p-4 text-sm font-semibold text-texto-sec leading-relaxed">
                      Para ver precios B2B, disponibilidad real, crédito y condiciones comerciales,
                      solicita acceso o inicia sesión.
                    </div>
                  )}

                  <button
                    onClick={() => {
                      if (isCliente) {
                        onCheckout();
                      } else {
                        onRequestAccess();
                      }
                    }}
                    className="mt-5 w-full h-14 bg-rojo text-white rounded-xl font-black flex items-center justify-center gap-3 hover:bg-rojo-oscuro transition-colors cursor-pointer"
                  >
                    {isCliente ? (
                      <>
                        <CreditCard size={20} />
                        Continuar pedido
                      </>
                    ) : (
                      <>
                        <UserPlus size={20} />
                        Solicitar acceso B2B
                      </>
                    )}
                  </button>

                  <button
                    onClick={onClear}
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
