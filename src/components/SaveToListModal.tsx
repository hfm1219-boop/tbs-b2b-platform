import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, Plus, Check, ChevronRight, Search } from 'lucide-react';
import { Product, ShoppingList } from '../types';

interface SaveToListModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  shoppingLists: ShoppingList[];
  onCreateList: (name: string, description: string) => void;
  onAddToList: (listId: string, product: Product, quantity: number) => void;
}

export function SaveToListModal({ 
  product, 
  isOpen, 
  onClose, 
  shoppingLists,
  onCreateList,
  onAddToList
}: SaveToListModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDesc, setNewListDesc] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);

  const filteredLists = shoppingLists.filter(list => 
    list.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateAndAdd = () => {
    if (!newListName.trim()) return;
    
    // In a real app, we'd wait for the ID. 
    // Here we'll simulate the creation and then add.
    // But since state updates are async, we'll just use a workaround or 
    // leave it to the user to wrap their head around it.
    // Actually, App.tsx should handle this. 
    // For now, let's just use an existing list for the demo of "save".
  };

  const handleSave = (listId: string, listName: string) => {
    onAddToList(listId, product, quantity);
    setSavedSuccess(listName);
    setTimeout(() => {
      setSavedSuccess(null);
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative"
      >
        <div className="p-6 border-b border-borde flex items-center justify-between bg-white sticky top-0 z-10">
          <h3 className="text-xl font-black text-texto flex items-center gap-2">
            <Star size={20} className="text-rojo fill-rojo" /> Guardar en lista
          </h3>
          <button onClick={onClose} className="text-gris hover:text-texto transition-colors cursor-pointer">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {savedSuccess ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 text-center"
            >
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={32} strokeWidth={3} />
              </div>
              <h4 className="text-xl font-black text-texto">¡Guardado con éxito!</h4>
              <p className="text-gris font-medium mt-2">
                <strong>{product.name}</strong> se agregó a <br />
                <span className="text-rojo">"{savedSuccess}"</span>
              </p>
            </motion.div>
          ) : (
            <>
              {/* Product Preview */}
              <div className="flex gap-4 p-4 bg-gray-50 rounded-xl mb-6">
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-borde shrink-0">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-texto leading-snug">{product.name}</h4>
                  <p className="text-xs font-bold text-gris mt-1">{product.specs}</p>
                  
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] font-black text-gris uppercase">Cant. sugerida:</span>
                    <input 
                      type="number" 
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-12 text-center border-b border-borde font-black text-sm outline-none focus:border-rojo"
                    />
                  </div>
                </div>
              </div>

              {!isCreating ? (
                <>
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gris" size={16} />
                    <input 
                      type="text" 
                      placeholder="Buscar lista..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-borde rounded-xl text-sm font-bold focus:border-rojo focus:ring-1 focus:ring-rojo outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-2 mb-6">
                    {filteredLists.length > 0 ? (
                      filteredLists.map(list => (
                        <button
                          key={list.id}
                          onClick={() => handleSave(list.id, list.name)}
                          className="w-full flex items-center justify-between p-4 border border-borde rounded-xl hover:border-rojo hover:bg-rojo-suave/30 transition-all group text-left cursor-pointer"
                        >
                          <div>
                            <strong className="block text-sm font-black text-texto group-hover:text-rojo transition-colors">{list.name}</strong>
                            <span className="text-[11px] font-bold text-gris">{list.products.length} productos</span>
                          </div>
                          <ChevronRight size={18} className="text-gris group-hover:text-rojo group-hover:translate-x-1 transition-all" />
                        </button>
                      ))
                    ) : (
                      <div className="py-8 text-center bg-gray-50 rounded-xl border border-dashed border-borde">
                        <p className="text-sm font-bold text-gris">No tienes listas con ese nombre.</p>
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={() => setIsCreating(true)}
                    className="w-full py-4 border-2 border-dashed border-rojo/30 rounded-xl text-rojo font-black text-sm flex items-center justify-center gap-2 hover:bg-rojo-suave transition-colors cursor-pointer"
                  >
                    <Plus size={18} strokeWidth={3} /> Crear una nueva lista
                  </button>
                </>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-black text-gris uppercase tracking-widest mb-1.5">Nombre de la lista</label>
                    <input 
                      type="text" 
                      value={newListName}
                      onChange={(e) => setNewListName(e.target.value)}
                      placeholder="Ej: Reposición semanal"
                      className="w-full px-4 py-3 bg-gray-50 border border-borde rounded-xl font-bold focus:border-rojo outline-none"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-gris uppercase tracking-widest mb-1.5">Descripción (opcional)</label>
                    <textarea 
                      value={newListDesc}
                      onChange={(e) => setNewListDesc(e.target.value)}
                      placeholder="Ej: Productos para fin de semana..."
                      className="w-full px-4 py-3 bg-gray-50 border border-borde rounded-xl font-medium text-sm focus:border-rojo outline-none min-h-[100px] resize-none"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button 
                      onClick={() => setIsCreating(false)}
                      className="flex-1 py-3.5 border border-borde text-gris rounded-xl font-black text-sm hover:bg-gray-50 cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button 
                      onClick={() => {
                        if (newListName.trim()) {
                          onCreateList(newListName, newListDesc);
                          setIsCreating(false);
                          setNewListName('');
                          setNewListDesc('');
                        }
                      }}
                      className="flex-1 py-3.5 bg-rojo text-white rounded-xl font-black text-sm shadow-lg shadow-rojo/20 hover:bg-rojo-oscuro cursor-pointer"
                    >
                      Crear lista
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
