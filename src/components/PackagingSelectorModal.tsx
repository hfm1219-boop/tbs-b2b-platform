import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Package, 
  ChevronRight, 
  Minus, 
  Plus, 
  Info, 
  CheckCircle2,
  AlertCircle,
  TrendingDown
} from 'lucide-react';
import { Product, ProductPackagingOption } from '../types';

interface PackagingSelectorModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (
    product: Product,
    packaging: ProductPackagingOption,
    packageQuantity: number
  ) => void;
}

export function PackagingSelectorModal({
  product,
  isOpen,
  onClose,
  onConfirm
}: PackagingSelectorModalProps) {
  const [selectedPkgId, setSelectedPkgId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (isOpen && product) {
      // Find default packaging or first available
      const defaultPkg = product.packagingOptions?.find(p => p.isDefault && p.available) 
        || product.packagingOptions?.find(p => p.available);
      
      if (defaultPkg) {
        setSelectedPkgId(defaultPkg.id);
      }
      setQuantity(1);
    }
  }, [isOpen, product]);

  if (!product) return null;

  const selectedPkg = product.packagingOptions?.find(p => p.id === selectedPkgId);
  const totalUnits = selectedPkg ? quantity * selectedPkg.unitsPerPackage : 0;
  
  const packagePrice = selectedPkg?.packagePrice 
    || (selectedPkg && selectedPkg.pricePerUnit ? selectedPkg.pricePerUnit * selectedPkg.unitsPerPackage : 0)
    || Number(product.price.replace(/[^0-9.-]+/g, "")) * (selectedPkg?.unitsPerPackage || 1);

  const totalPrice = quantity * (packagePrice || 0);

  const handleConfirm = () => {
    if (selectedPkg && quantity > 0) {
      onConfirm(product, selectedPkg, quantity);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1500] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={onClose}
                className="p-2 bg-gray-100 hover:bg-gray-200 text-gris rounded-full transition-colors"
                id="close-packaging-modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 md:p-8 flex-1 overflow-y-auto">
              <div className="flex flex-col md:flex-row gap-6 mb-8">
                <div className="w-full md:w-40 aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-borde shrink-0">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 pt-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-rojo mb-1 block">
                    {product.category}
                  </span>
                  <h2 className="text-2xl font-black text-texto mb-2 leading-tight">
                    {product.name}
                  </h2>
                  <p className="text-sm font-medium text-gris">
                    {product.specs}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-black text-texto uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Package size={16} className="text-rojo" /> Selecciona embalaje
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.packagingOptions?.map((pkg) => (
                    <button
                      key={pkg.id}
                      disabled={!pkg.available}
                      onClick={() => setSelectedPkgId(pkg.id)}
                      className={`relative flex flex-col p-4 rounded-2xl border text-left transition-all duration-300 ${
                        selectedPkgId === pkg.id
                          ? 'border-rojo bg-rojo-suave/30 shadow-md ring-1 ring-rojo'
                          : pkg.available 
                            ? 'border-borde hover:border-rojo/50 hover:bg-gray-50' 
                            : 'border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed'
                      }`}
                      id={`pkg-option-${pkg.id}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-lg font-black ${selectedPkgId === pkg.id ? 'text-rojo' : 'text-texto'}`}>
                          {pkg.label}
                        </span>
                        {selectedPkgId === pkg.id && (
                          <div className="w-5 h-5 bg-rojo rounded-full flex items-center justify-center">
                            <CheckCircle2 size={12} className="text-white" />
                          </div>
                        )}
                        {pkg.isDefault && !selectedPkgId && (
                          <span className="text-[10px] font-black uppercase tracking-tighter bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                            Recomendado
                          </span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-gris">
                          <span>{pkg.unitsPerPackage === 1 ? 'Precio unidad:' : 'Precio por caja:'}</span>
                          <span className="text-texto">
                            $ {(pkg.packagePrice || (pkg.pricePerUnit ? pkg.pricePerUnit * pkg.unitsPerPackage : 0)).toLocaleString('es-CO')}
                          </span>
                        </div>
                        {pkg.pricePerUnit && pkg.unitsPerPackage > 1 && (
                          <div className="flex justify-between text-[10px] font-medium text-gris/60 italic">
                            <span>Precio unitario:</span>
                            <span>$ {pkg.pricePerUnit.toLocaleString('es-CO')}</span>
                          </div>
                        )}
                      </div>

                      {pkg.stockLabel && (
                        <div className="mt-3 flex items-center gap-1.5">
                          <TrendingDown size={12} className="text-rojo" />
                          <span className="text-[10px] font-bold text-rojo uppercase tracking-tighter">
                            {pkg.stockLabel}
                          </span>
                        </div>
                      )}

                      {!pkg.available && (
                        <div className="mt-3 flex items-center gap-1 text-amber-600">
                          <AlertCircle size={12} />
                          <span className="text-[10px] font-black uppercase">No disponible</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {selectedPkg && (
                <div className="bg-gray-50 rounded-2xl p-6 border border-borde">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <h4 className="text-xs font-black text-gris uppercase tracking-wider mb-3">
                        {selectedPkg.unitsPerPackage === 1 ? 'Cantidad de unidades' : 'Cantidad de cajas'}
                      </h4>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-10 h-10 rounded-xl bg-white border border-borde flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
                          id="decrease-quantity"
                        >
                          <Minus size={18} className="text-texto" />
                        </button>
                        <span className="text-2xl font-black text-texto w-10 text-center">{quantity}</span>
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="w-10 h-10 rounded-xl bg-white border border-borde flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
                          id="increase-quantity"
                        >
                          <Plus size={18} className="text-texto" />
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 md:text-right">
                      <div className="inline-block text-left md:text-right">
                        <div className="text-xs font-bold text-gris mb-1">
                          {selectedPkg.unitsPerPackage === 1 ? (
                            <span className="text-rojo font-black">{quantity} unidades</span>
                          ) : (
                            <>
                              {quantity} {quantity === 1 ? 'caja' : 'cajas'} x {selectedPkg.unitsPerPackage} = <span className="text-rojo font-black">{totalUnits} unidades</span>
                            </>
                          )}
                        </div>
                        <div className="text-3xl font-black text-texto">
                          $ {totalPrice.toLocaleString('es-CO')}
                        </div>
                        <div className="text-[10px] font-bold text-gris/60 uppercase tracking-widest mt-1">
                          Total estimado
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 bg-gray-50 border-t border-borde flex gap-4">
              <button
                onClick={onClose}
                className="flex-1 py-4 px-6 bg-white border border-borde text-texto font-black rounded-2xl hover:bg-gray-100 transition-all uppercase tracking-widest text-xs"
              >
                Cancelar
              </button>
              <button
                disabled={!selectedPkg || quantity < 1}
                onClick={handleConfirm}
                className="flex-[2] py-4 px-6 bg-rojo text-white font-black rounded-2xl hover:bg-rojo-oscuro disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-rojo/20 uppercase tracking-widest text-xs flex items-center justify-center gap-2"
                id="add-to-cart-confirm"
              >
                Agregar a la cesta <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
