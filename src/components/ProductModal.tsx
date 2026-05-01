import { motion } from 'motion/react';
import { X, Minus, Plus, ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { useState } from 'react';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export function ProductModal({ product, onClose, onAddToCart }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  const handleIncrease = () => {
    setQuantity(prev => prev + 1);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur border border-borde rounded-full flex items-center justify-center text-texto hover:bg-rojo hover:text-white transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Imagen del Producto */}
        <div className="w-full md:w-1/2 aspect-square md:aspect-auto bg-gray-50 border-r border-borde relative overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Detalles del Producto */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col">
          <div className="mb-6">
            <div className="text-[11px] font-black text-rojo uppercase tracking-widest mb-2">{product.category}</div>
            <h2 className="text-3xl font-black text-texto tracking-tight mb-3">{product.name}</h2>
            <div className="inline-block px-3 py-1 bg-rojo-suave text-rojo rounded-full text-xs font-black mb-6">
              {product.specs}
            </div>
            
            <p className="text-texto-sec leading-relaxed font-medium mb-8">
              {product.description || "Este producto premium forma parte de nuestra selección exclusiva para el canal Horeca y licoreras. Consulta disponibilidad para entregas inmediatas en tu zona."}
            </p>
          </div>

          <div className="mt-auto space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] text-gris font-black uppercase mb-1">Precio Unitario</div>
                <div className="text-3xl font-black text-texto">{product.price}</div>
              </div>
              
              <div className="flex flex-col items-end">
                <div className="text-[11px] text-gris font-black uppercase mb-1">Cantidad</div>
                <div className="flex items-center gap-3 border border-borde rounded-lg p-1.5 bg-gray-50">
                  <button 
                    onClick={handleDecrease}
                    className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white hover:text-rojo transition-all cursor-pointer border border-transparent hover:border-borde disabled:opacity-30"
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} strokeWidth={2.5} />
                  </button>
                  <span className="w-8 text-center text-lg font-black">{quantity}</span>
                  <button 
                    onClick={handleIncrease}
                    className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white hover:text-rojo transition-all cursor-pointer border border-transparent hover:border-borde"
                  >
                    <Plus size={16} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </div>

            <button 
              onClick={() => {
                onAddToCart(product, quantity);
                onClose();
              }}
              className="w-full h-14 bg-rojo text-white rounded-xl font-black text-lg flex items-center justify-center gap-3 tbs-shadow hover:bg-rojo-oscuro hover:scale-[1.02] active:scale-100 transition-all cursor-pointer"
            >
              <ShoppingCart size={22} strokeWidth={2.5} />
              Agregar
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
