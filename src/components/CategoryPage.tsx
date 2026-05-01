import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Info, Plus, ShoppingCart, Package, Filter, ChevronRight, Check } from 'lucide-react';
import { Product } from '../types';
import { ProductModal } from './ProductModal';

interface CategoryPageProps {
  category: string | null;
  products: Product[];
  onBack: () => void;
  isCliente: boolean;
  onAddToCart: (product: Product, quantity?: number) => void;
  onCategorySelect: (category: string | null) => void;
  onRequestAccess: () => void;
  onLogin: () => void;
}

export function CategoryPage({ 
  category, 
  products, 
  onBack, 
  isCliente, 
  onAddToCart, 
  onCategorySelect,
  onRequestAccess,
  onLogin
}: CategoryPageProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Filter states
  const [selectedOrigin, setSelectedOrigin] = useState<string | null>(null);
  const [selectedSubcat, setSelectedSubcat] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Extract filter options based on current category products
  const filterOptions = useMemo(() => {
    const origins = new Set<string>();
    const subcats = new Set<string>();
    
    products.forEach(p => {
      if (p.origin) origins.add(p.origin);
      if (p.subcategory) subcats.add(p.subcategory);
    });
    
    return {
      origins: Array.from(origins).sort(),
      subcategories: Array.from(subcats).sort()
    };
  }, [products]);

  // Apply filters
  const filteredList = useMemo(() => {
    return products.filter(p => {
      const matchOrigin = !selectedOrigin || p.origin === selectedOrigin;
      const matchSubcat = !selectedSubcat || p.subcategory === selectedSubcat;
      return matchOrigin && matchSubcat;
    });
  }, [products, selectedOrigin, selectedSubcat]);

  // Pagination logic
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const paginatedList = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredList.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredList, currentPage]);

  const clearFilters = () => {
    setSelectedOrigin(null);
    setSelectedSubcat(null);
    onCategorySelect(null);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset page when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [selectedOrigin, selectedSubcat]);

  return (
    <div className="max-w-[1480px] mx-auto px-8 py-10">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 mb-8 text-sm font-extrabold text-gris hover:text-rojo cursor-pointer transition-colors outline-none"
      >
        <ArrowLeft size={18} /> Volver al inicio
      </button>

      <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-10">
        <div>
          <div className="text-rojo text-[11px] font-black uppercase tracking-[0.2em] mb-2">Catálogo B2B</div>
          <h2 className="text-4xl lg:text-[48px] font-black tracking-tighter leading-tight">{category || 'Todos los productos'}</h2>
          <p className="mt-2 text-gris font-medium uppercase tracking-widest text-[11px]">Mostrando {filteredList.length} productos disponibles en Cartagena.</p>
        </div>
        {!isCliente && (
          <div className="bg-rojo-suave border border-[#F0D3D3] p-4 rounded-xl flex items-center gap-4 max-w-md">
            <Info size={24} className="text-rojo shrink-0" />
            <p className="text-sm font-bold text-texto">
              Estás viendo precios públicos. <button onClick={onLogin} className="text-rojo underline font-black cursor-pointer bg-transparent border-none p-0 outline-none">Inicia sesión</button> para ver tus precios B2B.
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="sticky top-24 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-black text-texto">
                <Filter size={18} /> Filtros
              </h3>
              {(selectedOrigin || selectedSubcat || category) && (
                <button 
                  onClick={clearFilters}
                  className="text-xs font-bold text-rojo hover:underline cursor-pointer"
                >
                  Limpiar
                </button>
              )}
            </div>

            {/* Filter Group: Category */}
            <div>
              <h4 className="text-xs font-black text-gris uppercase tracking-widest mb-4">Categoría</h4>
              <div className="space-y-2">
                {[
                  'Whisky', 'Ron', 'Ginebra', 'Vodka', 'Tequila y mezcal', 'Aguardiente', 'Vinos y espumantes'
                ].map(cat => (
                  <button
                    key={cat}
                    onClick={() => onCategorySelect(cat === category ? null : cat)}
                    className={`flex items-center justify-between w-full text-sm font-bold p-2.5 rounded-lg transition-all cursor-pointer ${
                      category === cat 
                        ? 'bg-rojo/5 text-rojo border border-rojo/20' 
                        : 'text-texto-sec hover:bg-gray-100'
                    }`}
                  >
                    {cat}
                    {category === cat && <Check size={14} strokeWidth={3} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Group: Origin */}
            {filterOptions.origins.length > 0 && (
              <div>
                <h4 className="text-xs font-black text-gris uppercase tracking-widest mb-4">Origen</h4>
                <div className="space-y-2">
                  {filterOptions.origins.map(origin => (
                    <button
                      key={origin}
                      onClick={() => setSelectedOrigin(origin === selectedOrigin ? null : origin)}
                      className={`flex items-center justify-between w-full text-sm font-bold p-2.5 rounded-lg transition-all cursor-pointer ${
                        selectedOrigin === origin 
                          ? 'bg-rojo/5 text-rojo border border-rojo/20' 
                          : 'text-texto-sec hover:bg-gray-100'
                      }`}
                    >
                      {origin}
                      {selectedOrigin === origin && <Check size={14} strokeWidth={3} />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Filter Group: Subcategory */}
            {filterOptions.subcategories.length > 0 && (
              <div>
                <h4 className="text-xs font-black text-gris uppercase tracking-widest mb-4">Tipo de destilado</h4>
                <div className="space-y-2">
                  {filterOptions.subcategories.map(sub => (
                    <button
                      key={sub}
                      onClick={() => setSelectedSubcat(sub === selectedSubcat ? null : sub)}
                      className={`flex items-center justify-between w-full text-sm font-bold p-2.5 rounded-lg transition-all cursor-pointer ${
                        selectedSubcat === sub 
                          ? 'bg-rojo/5 text-rojo border border-rojo/20' 
                          : 'text-texto-sec hover:bg-gray-100'
                      }`}
                    >
                      {sub}
                      {selectedSubcat === sub && <Check size={14} strokeWidth={3} />}
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {paginatedList.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedList.map((product) => (
                  <motion.article 
                    key={product.id}
                    whileHover={{ y: -5 }}
                    onClick={() => setSelectedProduct(product)}
                    className="bg-white border border-borde rounded-xl overflow-hidden tarjeta-hover flex flex-col h-full cursor-pointer relative group"
                  >
                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full text-xs font-black text-texto tbs-shadow">
                          Ver detalles
                        </div>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-[10px] font-black text-gris uppercase tracking-[0.16em]">{product.category}</div>
                        {product.origin && (
                          <div className="text-[9px] font-black text-rojo bg-rojo-suave px-2 py-0.5 rounded-md uppercase tracking-wider">{product.origin}</div>
                        )}
                      </div>
                      <h3 className="text-[17px] font-black text-texto leading-snug mb-2 group-hover:text-rojo transition-colors">{product.name}</h3>
                      <p className="text-[13px] text-gris font-medium mb-4">{product.specs}</p>
                      
                      <div className="mt-auto pt-4 border-t border-[#F1F3F5] flex items-center justify-between">
                        <div>
                          <div className="text-[11px] text-gris font-bold mb-0.5">Precio {isCliente ? 'B2B' : 'público'}</div>
                          {isCliente ? (
                            <div className="text-xl font-black text-texto">{product.price}</div>
                          ) : (
                            <button 
                              onClick={(e) => { e.stopPropagation(); onRequestAccess(); }}
                              className="text-sm font-black text-rojo hover:underline cursor-pointer"
                            >
                              Solicitar acceso
                            </button>
                          )}
                        </div>
                        {isCliente && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); onAddToCart(product, 1); }}
                            className="w-10 h-10 bg-rojo text-white rounded-lg flex items-center justify-center hover:bg-rojo-oscuro tbs-shadow transition-colors cursor-pointer group outline-none"
                            title="Agregar"
                          >
                            <Plus size={20} strokeWidth={2.5} className="group-active:scale-90 transition-transform" />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>

              {/* Pagination UI */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="p-2.5 border border-borde rounded-lg hover:border-rojo hover:text-rojo disabled:opacity-30 disabled:hover:border-borde disabled:hover:text-inherit transition-all cursor-pointer outline-none"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-lg text-sm font-black transition-all cursor-pointer outline-none ${
                        currentPage === page 
                          ? 'bg-rojo text-white tbs-shadow' 
                          : 'border border-borde hover:border-rojo hover:text-rojo'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="p-2.5 border border-borde rounded-lg hover:border-rojo hover:text-rojo disabled:opacity-30 disabled:hover:border-borde disabled:hover:text-inherit transition-all cursor-pointer outline-none rotate-180"
                  >
                    <ArrowLeft size={18} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="py-20 text-center border-2 border-dashed border-borde rounded-2xl">
              <Package size={48} className="mx-auto text-gris mb-4 opacity-50" />
              <h3 className="text-xl font-black text-texto">No se encontraron productos</h3>
              <p className="text-gris font-semibold mt-2">Prueba ajustando los filtros seleccionados.</p>
              <button onClick={clearFilters} className="mt-6 px-6 py-3 bg-rojo text-white rounded-md font-black cursor-pointer hover:bg-rojo-oscuro transition-colors outline-none">
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalle de Producto */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductModal 
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
            onAddToCart={onAddToCart}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
