import { X, Plus, Minus, Trash2, ShoppingCart, CreditCard, UserPlus, Tag, MessageSquare, AlertTriangle, Zap, History, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { CartItem, User, Product } from '../types';
import { useAnalytics } from '../hooks/useAnalytics';
import { Button, ConfirmDialog, Tooltip } from './ui';
import { useToasts } from './ToastContext';

interface CartDrawerProps {
  isOpen: boolean;
  currentUser: User | null;
  items: CartItem[];
  allProducts?: Product[];
  onClose: () => void;
  onIncrement: (productId: number, packagingId?: string) => void;
  onDecrement: (productId: number, packagingId?: string) => void;
  onRemove: (productId: number) => void;
  onClear: () => void;
  onCheckout: () => void;
  onRequestAccess: () => void;
  onGoToCatalog: () => void;
  onGoPromotions?: () => void;
  onUpdateComment?: (productId: number, comment: string) => void;
  onReplaceWithSubstitute?: (productId: number, substituteId: number) => void;
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
  allProducts = [],
  onClose,
  onIncrement,
  onDecrement,
  onRemove,
  onClear,
  onCheckout,
  onRequestAccess,
  onGoToCatalog,
  onGoPromotions,
  onUpdateComment,
  onReplaceWithSubstitute,
}: CartDrawerProps) {
  const analytics = useAnalytics(currentUser);
  const toasts = useToasts();
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const totalUnits = items.reduce((sum, item) => sum + (item.totalUnits || item.quantity), 0);
  const totalCases = items.reduce((sum, item) => sum + (item.packaging && item.packaging.unitsPerPackage > 1 ? (item.packageQuantity || 1) : 0), 0);
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
    setIsClearConfirmOpen(false);
    toasts.info("Carrito vaciado", "Todos los productos han sido eliminados del pedido.");
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    analytics.track('checkout_started', 'checkout', {
      productCount: items.length,
      units: totalUnits,
      cartValue: subtotal
    });
    // Brief simulate processing
    await new Promise(resolve => setTimeout(resolve, 800));
    onCheckout();
    setIsCheckingOut(false);
  };

  const handleRemove = (productId: number, productName: string) => {
    onRemove(productId);
    toasts.info("Producto eliminado", `${productName} se ha quitado del pedido.`);
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
            className="fixed right-0 top-0 h-full w-full max-w-[500px] bg-white z-[190] shadow-2xl flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 260 }}
          >
            <div className="p-6 border-b border-[#F1F3F5] flex items-center justify-between">
              <div>
                <div className="text-[11px] font-black uppercase tracking-[0.18em] text-rojo">
                  Operación B2B
                </div>
                <h2 className="text-2xl font-black text-texto">
                  Carrito de Compra
                </h2>
              </div>

              <div className="flex items-center gap-2">
                {items.length > 0 && (
                   <button
                    onClick={() => setIsClearConfirmOpen(true)}
                    className="text-[10px] font-black text-gris hover:text-rojo uppercase tracking-widest px-3 py-2 cursor-pointer"
                  >
                    Vaciar
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full border border-[#F1F3F5] flex items-center justify-center hover:bg-rojo hover:text-white transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
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
                  Agrega productos desde el catálogo para construir tu pedido operativo.
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
                <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
                  {items.map((item) => {
                    const isOutOfStock = item.product.stockStatus === 'out_of_stock';
                    const isLowStock = item.product.stockStatus === 'low_stock';
                    const substitute = item.product.suggestedSubstituteId 
                      ? allProducts.find(p => p.id === item.product.suggestedSubstituteId)
                      : null;

                    return (
                      <article
                        key={item.product.id}
                        className={`border rounded-2xl overflow-hidden transition-all ${
                          isOutOfStock ? 'opacity-70 grayscale bg-gray-50 border-gray-200' : 'bg-white border-[#F1F3F5] hover:border-rojo shadow-sm'
                        }`}
                      >
                        <div className="p-4">
                          <div className="flex gap-4">
                            <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-50 border border-borde shrink-0 relative">
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                              {item.product.hasPromotion && (
                                <div className="absolute top-1 right-1 bg-rojo text-white p-1 rounded-md shadow-sm">
                                  <Tag size={10} />
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0 flex flex-col">
                              <div className="flex justify-between items-start">
                                <div className="text-[10px] font-black text-rojo uppercase tracking-widest truncate max-w-[120px]">
                                  {item.product.category}
                                </div>
                                <div className="flex gap-1.5">
                                  {item.product.previouslyPurchased && (
                                    <div className="bg-gray-100 text-gris p-1 rounded-md" title="Comprado antes">
                                      <History size={12} />
                                    </div>
                                  )}
                                  {item.product.isUrgent && (
                                    <div className="bg-yellow-100 text-yellow-600 p-1 rounded-md" title="Entrega urgente">
                                      <Zap size={12} fill="currentColor" />
                                    </div>
                                  )}
                                </div>
                              </div>

                              <h3 className="mt-1 text-base font-black text-texto leading-none tracking-tight">
                                {item.product.name}
                              </h3>
                              <p className="text-[10px] font-bold text-gris uppercase mt-1">{item.product.specs}</p>

                              {item.packaging && (
                                <div className="mt-2 flex items-center gap-2">
                                  <span className="px-2 py-0.5 bg-texto text-white font-black text-[9px] rounded-md uppercase tracking-wider">
                                    {item.packaging.label}
                                  </span>
                                  <span className="text-[10px] font-black text-rojo">
                                    x{item.packaging.unitsPerPackage} und.
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="mt-4 flex items-center justify-between bg-gray-50 rounded-xl p-3 border border-gray-100">
                            <div className="flex flex-col">
                              <div className="text-[9px] font-black text-gris uppercase tracking-widest mb-0.5">
                                {item.packaging && item.packaging.unitsPerPackage > 1 ? 'Precio B2B / Caja' : 'Precio B2B / Unidad'}
                              </div>
                              <div className="text-sm font-black text-texto">
                                $ {(item.packaging?.packagePrice || parsePrice(item.product.price)).toLocaleString('es-CO')}
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => onDecrement(item.product.id, item.packaging?.id)}
                                className="w-8 h-8 rounded-lg bg-white border border-[#F1F3F5] flex items-center justify-center hover:border-rojo hover:text-rojo transition-all cursor-pointer shadow-sm"
                              >
                                <Minus size={14} strokeWidth={3} />
                              </button>

                              <div className="flex flex-col items-center w-8">
                                <span className="text-sm font-black text-texto">
                                  {item.packageQuantity || item.quantity}
                                </span>
                                <span className="text-[8px] font-bold text-gris uppercase">
                                  {item.packaging && item.packaging.unitsPerPackage > 1 ? 'Cajas' : 'Unds'}
                                </span>
                              </div>

                              <button
                                onClick={() => onIncrement(item.product.id, item.packaging?.id)}
                                className="w-8 h-8 rounded-lg bg-white border border-[#F1F3F5] flex items-center justify-center hover:border-rojo hover:text-rojo transition-all cursor-pointer shadow-sm"
                              >
                                <Plus size={14} strokeWidth={3} />
                              </button>
                            </div>
                          </div>

                          <div className="mt-3 flex items-center justify-between border-t border-dashed border-gray-200 pt-3">
                            <div className="flex flex-col">
                              <div className="text-[9px] font-black text-gris uppercase tracking-widest">Subtotal Línea</div>
                              <div className="text-md font-black text-rojo">
                                {formatCOP((item.packaging?.packagePrice || parsePrice(item.product.price)) * (item.packageQuantity || 1))}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                               <button
                                onClick={() => setEditingComment(editingComment === item.product.id ? null : item.product.id)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                  item.lineComment ? 'bg-texto text-white' : 'bg-gray-100 text-gris hover:bg-gray-200'
                                }`}
                              >
                                <MessageSquare size={12} /> {item.lineComment ? 'Editar Notas' : 'Notas'}
                              </button>
                              <button
                                onClick={() => handleRemove(item.product.id, item.product.name)}
                                className="w-9 h-9 rounded-lg border border-gray-100 flex items-center justify-center text-gris hover:text-rojo hover:bg-rojo/5 transition-all cursor-pointer"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>

                          {editingComment === item.product.id && (
                            <div className="mt-3">
                              <textarea
                                value={item.lineComment || ''}
                                onChange={(e) => onUpdateComment?.(item.product.id, e.target.value)}
                                placeholder="Instrucción especial para esta línea (ej. caja sellada, lote reciente)..."
                                className="w-full text-xs font-semibold p-3 border border-borde rounded-xl h-20 outline-none focus:border-rojo resize-none"
                              />
                            </div>
                          )}

                          {isOutOfStock && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl">
                               <div className="flex items-center gap-2 text-red-700 mb-2">
                                  <AlertTriangle size={14} />
                                  <span className="text-[10px] font-black uppercase tracking-widest">Sin Disponibilidad</span>
                               </div>
                               {substitute ? (
                                 <div className="space-y-3">
                                    <p className="text-[10px] font-bold text-red-800">TBS sugiere reemplazar por:</p>
                                    <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-red-200">
                                       <img src={substitute.image} alt={substitute.name} className="w-10 h-10 rounded object-cover" />
                                       <div className="flex-1 min-w-0">
                                          <div className="text-[9px] font-black text-texto leading-none truncate">{substitute.name}</div>
                                          <div className="text-[9px] font-bold text-rojo">{substitute.price}</div>
                                       </div>
                                       <button 
                                          onClick={() => onReplaceWithSubstitute?.(item.product.id, substitute.id)}
                                          className="px-2 py-1 bg-rojo text-white rounded text-[8px] font-black uppercase tracking-widest"
                                       >
                                          Reemplazar
                                       </button>
                                    </div>
                                 </div>
                               ) : (
                                 <p className="text-[10px] font-bold text-red-800">El producto quedará sujeto a confirmación de TBS.</p>
                               )}
                            </div>
                          )}

                          {isLowStock && (
                            <div className="mt-3 flex items-center gap-2 px-3 py-1 bg-orange-50 text-orange-600 rounded-lg border border-orange-100">
                               <AlertTriangle size={12} />
                               <span className="text-[10px] font-black uppercase tracking-widest">Bajo Stock - Sujeto a Confirmación</span>
                            </div>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>

                <div className="border-t border-[#F1F3F5] p-6 bg-[#FCFCFC] space-y-4 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white border border-[#F1F3F5] p-4 rounded-2xl flex flex-col items-center">
                       <span className="text-[9px] font-black text-gris uppercase tracking-widest mb-1 leading-none">Referencias</span>
                       <span className="text-xl font-black text-texto leading-none">{items.length}</span>
                    </div>
                    <div className="bg-white border border-[#F1F3F5] p-4 rounded-2xl flex flex-col items-center">
                       <span className="text-[9px] font-black text-gris uppercase tracking-widest mb-1 leading-none">Volumen Total</span>
                       <span className="text-sm font-black text-texto leading-none">{totalUnits} units · {totalCases} cajas</span>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex flex-col gap-2">
                    <div className="flex items-center justify-between text-[10px] font-bold text-gris uppercase tracking-tight">
                       <span>Condición Comercial</span>
                       <span className={isCash ? 'text-orange-600' : 'text-rojo'}>{isCash ? 'CONTADO' : 'CRÉDITO B2B'}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-bold text-gris uppercase tracking-tight">
                       <span>Impuestos estimados</span>
                       <span>Incluidos en total</span>
                    </div>
                    <div className="pt-2 border-t border-dashed border-gray-200 flex items-center justify-between">
                       <span className="text-sm font-black text-texto uppercase tracking-[0.1em]">Total estimado</span>
                       <span className="text-2xl font-black text-rojo tracking-tighter">{formatCOP(subtotal)}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 pt-2">
                    <Button
                      onClick={() => {
                        if (isCliente) {
                          handleCheckout();
                        } else if (isProvider) {
                          onClose();
                        } else {
                          onRequestAccess();
                        }
                      }}
                      isLoading={isCheckingOut}
                      disabled={isProvider}
                      className="w-full h-14 rounded-2xl text-xs gap-3 shadow-xl"
                    >
                      {isCliente ? (
                        <>
                          <CreditCard size={20} />
                          <span className="uppercase tracking-widest">{isCash ? 'Continuar a Pago' : 'Confirmar & Checkout'}</span>
                          <ChevronRight size={18} />
                        </>
                      ) : (
                        <>
                          <UserPlus size={20} />
                          <span className="uppercase tracking-widest">Solicitar Acceso B2B</span>
                        </>
                      )}
                    </Button>
                    
                    {isCliente && (
                      <button
                        onClick={() => {
                          onClose();
                          // Logic for creating a list from cart could go here
                        }}
                        className="w-full py-4 text-xs font-black text-gris hover:text-rojo uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                      >
                         Guardar como lista de favoritos
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </motion.aside>
          {isClearConfirmOpen && (
            <ConfirmDialog 
              isOpen={isClearConfirmOpen}
              onClose={() => setIsClearConfirmOpen(false)}
              onConfirm={handleClearCart}
              title="¿Vaciar el carrito?"
              description="Esta acción eliminará todos los productos que has seleccionado para tu pedido. ¿Estás seguro?"
              confirmLabel="Sí, vaciar carrito"
              cancelLabel="Mantener productos"
              variant="warning"
            />
          )}
        </>
      )}
    </AnimatePresence>
  );
}
