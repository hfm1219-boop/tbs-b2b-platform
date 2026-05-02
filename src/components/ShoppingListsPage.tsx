import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Trash2, 
  Edit2, 
  Copy, 
  ShoppingCart, 
  ChevronRight, 
  Package, 
  Info,
  CheckCircle2,
  AlertCircle,
  X,
  History,
  Star,
  FileText,
  Calendar,
  Building2,
  MapPin,
  Headset,
  Minus,
  Check
} from 'lucide-react';
import { User, ShoppingList, ShoppingListProduct, Product } from '../types';

interface ShoppingListsPageProps {
  currentUser: User | null;
  shoppingLists: ShoppingList[];
  onBackToAccount: () => void;
  onGoCatalog: () => void;
  onAddToCart: (product: any, quantity: number) => void;
  onOpenCart: () => void;
  onCreateList: (list: Omit<ShoppingList, 'id' | 'createdAt' | 'updatedAt' | 'products'>) => void;
  onUpdateList: (id: string, updates: Partial<ShoppingList>) => void;
  onDeleteList: (id: string) => void;
  onRemoveProductFromList: (listId: string, productId: string) => void;
  onUpdateProductQuantity: (listId: string, productId: string, quantity: number) => void;
  onGoAdvisorChat: (topic?: any, context?: any) => void;
  onCreateNotification?: (notif: any) => void;
}

const formatCOP = (value: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(value);
};

export function ShoppingListsPage({
  currentUser,
  shoppingLists,
  onBackToAccount,
  onGoCatalog,
  onAddToCart,
  onOpenCart,
  onCreateList,
  onUpdateList,
  onDeleteList,
  onRemoveProductFromList,
  onUpdateProductQuantity,
  onGoAdvisorChat,
  onCreateNotification
}: ShoppingListsPageProps) {
  const [filter, setFilter] = useState<ShoppingList['type'] | 'todos'>('todos');
  const [search, setSearch] = useState('');
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const selectedList = useMemo(() => 
    shoppingLists.find(l => l.id === selectedListId) || null
  , [shoppingLists, selectedListId]);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<string | null>(null);
  const [newListName, setNewListName] = useState('');
  const [newListDesc, setNewListDesc] = useState('');
  const [newListType, setNewListType] = useState<ShoppingList['type']>('personalizada');
  const [editList, setEditList] = useState<ShoppingList | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showAddSuccess, setShowAddSuccess] = useState<{ count: number, total: number } | null>(null);

  // Stats
  const stats = useMemo(() => {
    const totalLists = shoppingLists.length;
    const totalProducts = shoppingLists.reduce((acc, list) => acc + list.products.length, 0);
    const availableProducts = shoppingLists.reduce((acc, list) => 
      acc + list.products.filter(p => p.available).length, 0);
    const unavailableProducts = totalProducts - availableProducts;

    return { totalLists, totalProducts, availableProducts, unavailableProducts };
  }, [shoppingLists]);

  // Filtering
  const filteredLists = useMemo(() => {
    return shoppingLists.filter(list => {
      const matchesFilter = filter === 'todos' || list.type === filter;
      const matchesSearch = list.name.toLowerCase().includes(search.toLowerCase()) ||
                          list.description.toLowerCase().includes(search.toLowerCase()) ||
                          list.products.some(p => p.name.toLowerCase().includes(search.toLowerCase()) || 
                                              p.category.toLowerCase().includes(search.toLowerCase()));
      return matchesFilter && matchesSearch;
    });
  }, [shoppingLists, filter, search]);

  const handleCreateList = () => {
    if (!newListName.trim()) return;
    onCreateList({
      name: newListName,
      description: newListDesc,
      type: newListType
    });
    setNewListName('');
    setNewListDesc('');
    setNewListType('personalizada');
    setIsCreateModalOpen(false);
  };

  const handleUpdateList = () => {
    if (!editList || !newListName.trim()) return;
    onUpdateList(editList.id, {
      name: newListName,
      description: newListDesc,
      type: newListType
    });
    setEditList(null);
    setIsEditModalOpen(false);
  };

  const handleAddAllToCart = (list: ShoppingList) => {
    const availableOnes = list.products.filter(p => p.available);
    let totalAdded = 0;
    let totalPrice = 0;

    availableOnes.forEach(item => {
      onAddToCart({
        id: item.productId || parseInt(item.id.replace('slp-', '')),
        name: item.name,
        category: item.category,
        specs: item.specs,
        price: formatCOP(item.price),
        image: item.image || "https://images.unsplash.com/photo-1527281473222-f9e87be50519?auto=format&fit=crop&q=80&w=400"
      }, item.suggestedQuantity);
      totalAdded += item.suggestedQuantity;
      totalPrice += item.price * item.suggestedQuantity;
    });

    if (totalAdded > 0) {
      setShowAddSuccess({ count: totalAdded, total: totalPrice });
    }
  };

  const handleAddSelectedToCart = () => {
    if (!selectedList) return;
    const selectedOnes = selectedList.products.filter(p => selectedItems.includes(p.id) && p.available);
    let totalAdded = 0;
    let totalPrice = 0;

    selectedOnes.forEach(item => {
      onAddToCart({
        id: item.productId || parseInt(item.id.replace('slp-', '')),
        name: item.name,
        category: item.category,
        specs: item.specs,
        price: formatCOP(item.price),
        image: item.image || "https://images.unsplash.com/photo-1527281473222-f9e87be50519?auto=format&fit=crop&q=80&w=400"
      }, item.suggestedQuantity);
      totalAdded += item.suggestedQuantity;
      totalPrice += item.price * item.suggestedQuantity;
    });

    if (totalAdded > 0) {
      setShowAddSuccess({ count: totalAdded, total: totalPrice });
      setSelectedItems([]);
    }
  };

  const toggleItemSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
      {/* Header */}
      <div className="bg-white border-b border-borde sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <button 
                onClick={onBackToAccount}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft size={20} className="text-gris" />
              </button>
              <div>
                <h1 className="text-2xl font-black text-gris tracking-tight uppercase">Listas de compra</h1>
                <p className="text-sm text-gris-claro font-medium">
                  {currentUser?.businessName} • {currentUser?.city}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={onGoCatalog}
                className="px-5 py-2.5 bg-white border border-borde rounded-xl text-gris font-black text-sm hover:border-rojo/30 transition-all cursor-pointer flex items-center gap-2"
              >
                Ir al catálogo
              </button>
              <button 
                onClick={() => {
                  setNewListName('');
                  setNewListDesc('');
                  setNewListType('personalizada');
                  setIsCreateModalOpen(true);
                }}
                className="px-5 py-2.5 bg-rojo text-white rounded-xl font-black text-sm tbs-shadow hover:bg-rojo-oscuro transition-all cursor-pointer flex items-center gap-2"
              >
                <Plus size={18} />
                Crear nueva lista
              </button>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#F8F9FA] p-4 rounded-2xl border border-borde">
              <div className="flex items-center gap-3 mb-1">
                <FileText size={16} className="text-rojo" />
                <span className="text-[10px] font-black text-gris-claro uppercase tracking-wider">Listas activas</span>
              </div>
              <div className="text-xl font-black text-gris">{stats.totalLists}</div>
            </div>
            <div className="bg-[#F8F9FA] p-4 rounded-2xl border border-borde">
              <div className="flex items-center gap-3 mb-1">
                <Package size={16} className="text-rojo" />
                <span className="text-[10px] font-black text-gris-claro uppercase tracking-wider">Productos</span>
              </div>
              <div className="text-xl font-black text-gris">{stats.totalProducts}</div>
            </div>
            <div className="bg-[#F8F9FA] p-4 rounded-2xl border border-borde">
              <div className="flex items-center gap-3 mb-1">
                <CheckCircle2 size={16} className="text-green-600" />
                <span className="text-[10px] font-black text-gris-claro uppercase tracking-wider">Disponibles</span>
              </div>
              <div className="text-xl font-black text-gris">{stats.availableProducts}</div>
            </div>
            <div className="bg-[#F8F9FA] p-4 rounded-2xl border border-borde">
              <div className="flex items-center gap-3 mb-1">
                <AlertCircle size={16} className="text-amber-500" />
                <span className="text-[10px] font-black text-gris-claro uppercase tracking-wider">Sin stock</span>
              </div>
              <div className="text-xl font-black text-gris">{stats.unavailableProducts}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-8">
        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gris-claro" size={18} />
            <input 
              type="text" 
              placeholder="Buscar lista, producto o categoría..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-borde rounded-2xl text-gris focus:outline-none focus:border-rojo/30 transition-all font-medium tbs-shadow"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {(['todos', 'frecuente', 'personalizada', 'recomendada', 'evento', 'sede'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer border ${
                  filter === t 
                    ? 'bg-rojo text-white border-rojo' 
                    : 'bg-white text-gris border-borde hover:border-rojo/30'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* List Grid */}
        {filteredLists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredLists.map((list) => (
                <motion.div
                  key={list.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-3xl border border-borde p-6 lg:p-8 tbs-shadow hover:border-rojo/30 transition-all group relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                      list.type === 'recomendada' ? 'bg-amber-100 text-amber-700' :
                      list.type === 'frecuente' ? 'bg-blue-100 text-blue-700' :
                      list.type === 'evento' ? 'bg-purple-100 text-purple-700' :
                      list.type === 'sede' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {list.type}
                    </span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => {
                          setEditList(list);
                          setNewListName(list.name);
                          setNewListDesc(list.description);
                          setNewListType(list.type);
                          setIsEditModalOpen(true);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gris-claro hover:text-rojo transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => setIsDeleteModalOpen(list.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gris-claro hover:text-rojo transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-xl font-black text-gris mb-2 group-hover:text-rojo transition-colors line-clamp-1">{list.name}</h3>
                  <p className="text-sm text-gris-claro mb-6 line-clamp-2 min-h-[40px]">{list.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <div className="text-[9px] font-black text-gris-claro uppercase tracking-wider mb-1">Productos</div>
                      <div className="text-lg font-black text-gris">{list.products.length}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <div className="text-[9px] font-black text-gris-claro uppercase tracking-wider mb-1">Total est.</div>
                      <div className="text-base font-black text-rojo">
                        {formatCOP(list.products.reduce((acc, p) => acc + (p.price * p.suggestedQuantity), 0))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-gris-claro font-medium mb-6">
                    <div className="flex items-center gap-1.5">
                      <History size={12} />
                      Actualizado: {list.updatedAt}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 size={12} className="text-green-600" />
                      {list.products.filter(p => p.available).length} disponibles
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => setSelectedListId(list.id)}
                      className="w-full py-3 bg-gray-50 text-gris rounded-xl font-black text-xs uppercase tracking-widest hover:bg-rojo-suave hover:text-rojo transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      Ver lista
                      <ChevronRight size={14} />
                    </button>
                    <button 
                      onClick={() => handleAddAllToCart(list)}
                      className="w-full py-3 bg-rojo text-white rounded-xl font-black text-xs uppercase tracking-widest tbs-shadow hover:bg-rojo-oscuro transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={14} />
                      Agregar todo al carrito
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[40px] border border-borde tbs-shadow">
            <div className="w-20 h-20 bg-rojo-suave rounded-full flex items-center justify-center text-rojo mb-6">
              <Star size={40} />
            </div>
            <h3 className="text-2xl font-black text-gris mb-2 uppercase tracking-tight">Aún no tienes listas de compra</h3>
            <p className="text-gris-claro font-medium mb-8 text-center max-w-md">
              Crea una lista para organizar tus productos frecuentes por ocasión, sede o tipo de operación y abastece tu negocio más rápido.
            </p>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="px-8 py-4 bg-rojo text-white rounded-2xl font-black text-sm uppercase tracking-widest tbs-shadow hover:bg-rojo-oscuro transition-all cursor-pointer flex items-center gap-3"
            >
              <Plus size={20} />
              Crear mi primera lista
            </button>
          </div>
        )}
      </div>

      {/* List Detail Overlay */}
      <AnimatePresence>
        {selectedList && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-end md:items-center justify-end md:p-6"
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedListId(null)} />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full md:w-[600px] h-[90vh] md:h-full bg-white md:rounded-[32px] shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Detail Header */}
              <div className="px-8 py-8 border-b border-borde flex items-start justify-between bg-white relative">
                <div className="flex-1 pr-8">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest bg-gray-100 text-gray-700`}>
                      {selectedList.type}
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-gris tracking-tight uppercase leading-tight mb-2">
                    {selectedList.name}
                  </h2>
                  <p className="text-sm text-gris-claro font-medium">{selectedList.description}</p>
                </div>
                <button 
                  onClick={() => setSelectedListId(null)}
                  className="p-2 hover:bg-gray-100 rounded-full text-gris transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Selection Bar */}
              {selectedItems.length > 0 && (
                <div className="bg-rojo-suave px-8 py-3 border-b border-rojo/10 flex items-center justify-between">
                  <div className="text-xs font-black text-rojo uppercase tracking-wider">
                    {selectedItems.length} {selectedItems.length === 1 ? 'producto seleccionado' : 'productos seleccionados'}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setSelectedItems([])}
                      className="text-[10px] font-black text-rojo uppercase tracking-widest hover:underline"
                    >
                      Limpiar
                    </button>
                    <button 
                      onClick={handleAddSelectedToCart}
                      className="px-3 py-1.5 bg-rojo text-white rounded-lg text-[10px] font-black uppercase tracking-widest"
                    >
                      Agregar selección
                    </button>
                  </div>
                </div>
              )}

              {/* Detail Content */}
              <div className="flex-1 overflow-y-auto p-8 bg-[#F8F9FA]">
                <div className="space-y-4">
                  {selectedList.products.map((product) => (
                    <div 
                      key={product.id}
                      className={`bg-white rounded-2xl border transition-all p-4 flex gap-4 ${
                        selectedItems.includes(product.id) ? 'border-rojo ring-1 ring-rojo/20 shadow-md' : 'border-borde shadow-sm'
                      }`}
                    >
                      <div className="flex items-center">
                        <button 
                          onClick={() => toggleItemSelection(product.id)}
                          className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                            selectedItems.includes(product.id)
                              ? 'bg-rojo border-rojo text-white'
                              : 'border-borde hover:border-rojo/30'
                          }`}
                        >
                          {selectedItems.includes(product.id) && <Check size={14} />}
                        </button>
                      </div>

                      <div className="w-16 h-16 bg-gray-50 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-100">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="text-sm font-black text-gris line-clamp-1">{product.name}</h4>
                          {!product.available && (
                            <span className="text-[8px] font-black text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md uppercase tracking-tighter">Sujeto a validación</span>
                          )}
                        </div>
                        <div className="text-[10px] font-medium text-gris-claro mb-2 tracking-wide uppercase">{product.category} • {product.specs}</div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-black text-gris">{formatCOP(product.price)}</div>
                          
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 bg-gray-50 rounded-lg border border-gray-100 p-1">
                              <button 
                                onClick={() => onUpdateProductQuantity(selectedList.id, product.id, Math.max(1, product.suggestedQuantity - 1))}
                                className="w-6 h-6 flex items-center justify-center hover:text-rojo transition-colors"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="text-xs font-black min-w-[20px] text-center">{product.suggestedQuantity}</span>
                              <button 
                                onClick={() => onUpdateProductQuantity(selectedList.id, product.id, product.suggestedQuantity + 1)}
                                className="w-6 h-6 flex items-center justify-center hover:text-rojo transition-colors"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <button 
                              onClick={() => {
                                if (product.available) {
                                  onAddToCart({
                                    id: product.productId || parseInt(product.id.replace('slp-', '')),
                                    name: product.name,
                                    category: product.category,
                                    specs: product.specs,
                                    price: formatCOP(product.price),
                                    image: product.image
                                  }, product.suggestedQuantity);
                                  setShowAddSuccess({ count: product.suggestedQuantity, total: product.price * product.suggestedQuantity });
                                } else {
                                  onGoAdvisorChat('producto', { label: 'Producto sin stock', value: product.name });
                                }
                              }}
                              className={`p-2 rounded-lg transition-all ${
                                product.available 
                                  ? 'bg-rojo text-white hover:bg-rojo-oscuro' 
                                  : 'bg-gray-100 text-gris-claro border border-borde'
                              }`}
                            >
                              {product.available ? <Plus size={18} /> : <Headset size={18} />}
                            </button>
                            <button 
                              onClick={() => onRemoveProductFromList(selectedList.id, product.id)}
                              className="p-2 text-gris-claro hover:text-rojo hover:bg-rojo/5 rounded-lg transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detail Footer */}
              <div className="p-8 border-t border-borde bg-white">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <div className="text-[10px] font-black text-gris-claro uppercase tracking-widest mb-1">Total estimado</div>
                    <div className="text-2xl font-black text-rojo">
                      {formatCOP(selectedList.products.reduce((acc, p) => acc + (p.price * p.suggestedQuantity), 0))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-black text-gris-claro uppercase tracking-widest mb-1">Items</div>
                    <div className="text-sm font-black text-gris">{selectedList.products.length}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => {
                      setEditList(selectedList);
                      setNewListName(selectedList.name);
                      setNewListDesc(selectedList.description);
                      setNewListType(selectedList.type);
                      setIsEditModalOpen(true);
                    }}
                    className="py-4 border border-borde text-gris rounded-2xl font-black text-sm uppercase tracking-widest hover:border-rojo/30 transition-all cursor-pointer"
                  >
                    Editar lista
                  </button>
                  <button 
                    onClick={() => handleAddAllToCart(selectedList)}
                    className="py-4 bg-rojo text-white rounded-2xl font-black text-sm uppercase tracking-widest tbs-shadow hover:bg-rojo-oscuro transition-all cursor-pointer flex items-center justify-center gap-3"
                  >
                    <ShoppingCart size={20} />
                    Agregar todo
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Success Toast Overlay */}
      <AnimatePresence>
        {showAddSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[40px] p-10 max-w-lg w-full text-center shadow-2xl relative overflow-hidden"
            >
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-8">
                <CheckCircle2 size={48} />
              </div>
              <h3 className="text-3xl font-black text-gris tracking-tight uppercase mb-4 leading-tight">
                ¡Productos agregados correctamente!
              </h3>
              <p className="text-gris-claro font-medium mb-10 text-lg">
                Agregaste <span className="text-rojo font-black">{showAddSuccess.count} unidades</span> al carrito por un total estimado de <span className="text-rojo font-black">{formatCOP(showAddSuccess.total)}</span>.
              </p>
              
              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => {
                    setShowAddSuccess(null);
                    onOpenCart();
                  }}
                  className="w-full py-5 bg-rojo text-white rounded-2xl font-black text-base uppercase tracking-widest tbs-shadow hover:bg-rojo-oscuro transition-all cursor-pointer flex items-center justify-center gap-3"
                >
                  Ver carrito de compras
                  <ChevronRight size={20} />
                </button>
                <button 
                  onClick={() => setShowAddSuccess(null)}
                  className="w-full py-5 border-2 border-rojo-suave text-rojo rounded-2xl font-black text-base uppercase tracking-widest hover:bg-rojo-suave transition-all cursor-pointer"
                >
                  Seguir en listas
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          >
            <div className="absolute inset-0" onClick={() => setIsDeleteModalOpen(null)} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[40px] p-10 max-w-lg w-full text-center shadow-2xl relative z-10"
            >
              <div className="w-20 h-20 bg-rojo-suave rounded-full flex items-center justify-center text-rojo mx-auto mb-8">
                <AlertCircle size={40} />
              </div>
              <h3 className="text-2xl font-black text-gris tracking-tight uppercase mb-4">¿Eliminar lista?</h3>
              <p className="text-gris-claro font-medium mb-10">
                Esta acción eliminará la lista y sus productos guardados de forma permanente. No afectará tus pedidos anteriores ni facturas actuales.
              </p>
              <div className="flex flex-col md:flex-row gap-4">
                <button 
                  onClick={() => setIsDeleteModalOpen(null)}
                  className="flex-1 py-4 bg-gray-100 text-gris font-black rounded-2xl uppercase tracking-widest hover:bg-gray-200 transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => {
                    onDeleteList(isDeleteModalOpen);
                    setIsDeleteModalOpen(null);
                  }}
                  className="flex-1 py-4 bg-rojo text-white font-black rounded-2xl uppercase tracking-widest tbs-shadow hover:bg-rojo-oscuro transition-all cursor-pointer"
                >
                  Sí, eliminar lista
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {(isCreateModalOpen || isEditModalOpen) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          >
            <div className="absolute inset-0" onClick={() => {
              setIsCreateModalOpen(false);
              setIsEditModalOpen(false);
            }} />
            <motion.div 
              initial={{ y: 50, scale: 0.9, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 50, scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-xl rounded-[40px] overflow-hidden shadow-2xl relative z-10"
            >
              <div className="p-10">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black text-gris uppercase tracking-tight">
                    {isCreateModalOpen ? 'Nueva lista de compra' : 'Editar lista de compra'}
                  </h3>
                  <button 
                    onClick={() => {
                      setIsCreateModalOpen(false);
                      setIsEditModalOpen(false);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full text-gris transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-gris-claro uppercase tracking-widest mb-2 px-1">Nombre de la lista</label>
                    <input 
                      type="text" 
                      placeholder="Ej: Fin de semana, Carta cocteles..."
                      value={newListName}
                      onChange={(e) => setNewListName(e.target.value)}
                      className="w-full px-5 py-4 bg-[#F8F9FA] border border-borde rounded-2xl text-gris focus:outline-none focus:border-rojo font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gris-claro uppercase tracking-widest mb-2 px-1">Descripción</label>
                    <textarea 
                      placeholder="Indica el propósito de esta lista..."
                      value={newListDesc}
                      onChange={(e) => setNewListDesc(e.target.value)}
                      rows={3}
                      className="w-full px-5 py-4 bg-[#F8F9FA] border border-borde rounded-2xl text-gris focus:outline-none focus:border-rojo font-medium resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gris-claro uppercase tracking-widest mb-2 px-1">Tipo de operación</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {(['personalizada', 'frecuente', 'recomendada', 'evento', 'sede'] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => setNewListType(t)}
                          className={`px-3 py-3 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all border ${
                            newListType === t 
                              ? 'bg-rojo text-white border-rojo shadow-lg' 
                              : 'bg-white text-gris border-borde hover:border-rojo/30'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 mt-10">
                  <button 
                    onClick={() => {
                      setIsCreateModalOpen(false);
                      setIsEditModalOpen(false);
                    }}
                    className="flex-1 py-4 bg-gray-100 text-gris font-black rounded-2xl uppercase tracking-widest hover:bg-gray-200 transition-all cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={isCreateModalOpen ? handleCreateList : handleUpdateList}
                    disabled={!newListName.trim()}
                    className="flex-1 py-4 bg-rojo text-white font-black rounded-2xl uppercase tracking-widest tbs-shadow hover:bg-rojo-oscuro transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCreateModalOpen ? 'Crear lista' : 'Guardar cambios'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
