import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Package, ShoppingCart, Plus, ArrowRight, Tag } from 'lucide-react';
import { Button } from './ui';
import { Product } from '../types';

interface ProductCarouselProps {
  title?: string;
  subtitle?: string;
  products: Product[];
  onProductClick?: (product: Product) => void;
  onAddToCart?: (product: Product, source?: string | any) => void;
  autoPlayInterval?: number;
  isCliente?: boolean;
}

export function ProductCarousel({
  title = "Productos destacados",
  subtitle = "Explora productos recomendados para abastecer tu negocio.",
  products,
  onProductClick,
  onAddToCart,
  autoPlayInterval = 3500,
  isCliente = false
}: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Determine how many products to show based on screen width
  // This is handled by CSS grid, but for index-based navigation:
  const getVisibleCount = () => {
    if (typeof window === 'undefined') return 4;
    if (window.innerWidth < 640) return 1.2;
    if (window.innerWidth < 1024) return 2.5;
    return 4;
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) >= products.length ? 0 : prevIndex + 1);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1) < 0 ? products.length - 1 : prevIndex - 1);
  };

  // Autoplay
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(interval);
  }, [isPaused, products.length, autoPlayInterval]);

  // Sync scroll position with currentIndex
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const firstChild = container.children[0] as HTMLElement;
      if (firstChild) {
        const itemWidth = firstChild.offsetWidth + 24; // width + gap
        container.scrollTo({
          left: currentIndex * itemWidth,
          behavior: 'smooth'
        });
      }
    }
  }, [currentIndex]);

  if (!products || products.length === 0) return null;

  return (
    <section className="mt-20 border-t border-gray-100 pt-16 mb-20 px-4 md:px-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <div className="text-rojo text-[11px] font-black uppercase tracking-[0.2em] mb-2 font-sans">Recomendados TBS</div>
          <h2 className="text-3xl md:text-4xl font-black text-texto tracking-tighter">{title}</h2>
          <p className="text-gris font-medium text-sm md:text-base mt-2 max-w-xl">{subtitle}</p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="md"
            onClick={prevSlide}
            aria-label="Producto anterior"
            className="rounded-full bg-white transition-all tbs-shadow"
            leftIcon={ChevronLeft}
          />
          <Button
            variant="outline"
            size="md"
            onClick={nextSlide}
            aria-label="Producto siguiente"
            className="rounded-full bg-white transition-all tbs-shadow"
            leftIcon={ChevronRight}
          />
        </div>
      </div>

      <div 
        className="relative overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div 
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollBehavior: 'smooth' }}
        >
          {products.map((product) => (
            <div 
              key={product.id}
              className="min-w-[85%] sm:min-w-[45%] lg:min-w-[calc(25%-18px)] snap-start"
            >
              <motion.div 
                whileHover={{ y: -8 }}
                className="bg-white border border-borde rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all h-full flex flex-col group relative"
              >
                {/* Badge */}
                {product.originalPrice ? (
                  <div className="absolute top-4 left-4 z-10">
                    <div className="bg-rojo text-white text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest shadow-lg flex items-center gap-1.5 animate-pulse-slow">
                      <Tag size={10} className="fill-white" /> 
                      Oferta Especial
                    </div>
                  </div>
                ) : (
                  <div className="absolute top-4 left-4 z-10">
                    <div className="bg-[#303844] text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-1.5">
                      <span className="w-1 h-1 bg-rojo rounded-full animate-pulse" />
                      Destacado
                    </div>
                  </div>
                )}

                {/* Image */}
                <div 
                  className="aspect-[4/3] bg-gray-50 overflow-hidden cursor-pointer relative"
                  onClick={() => onProductClick?.(product)}
                >
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="text-[10px] font-black text-rojo uppercase tracking-widest mb-1.5">{product.category}</div>
                  <h3 
                    className="text-lg font-black text-texto leading-tight mb-2 group-hover:text-rojo transition-colors cursor-pointer"
                    onClick={() => onProductClick?.(product)}
                  >
                    {product.name}
                  </h3>
                  <p className="text-xs text-gris font-semibold mb-6 flex-1">{product.specs}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50 gap-4 mt-auto">
                    <div>
                      <div className="text-[10px] text-gris font-black uppercase tracking-tighter mb-0.5">Precio {isCliente ? '' : 'Público'}</div>
                      <div className="flex flex-col">
                        {product.originalPrice && (
                          <span className="text-[10px] text-gris line-through font-bold leading-none mb-1">
                            {product.originalPrice}
                          </span>
                        )}
                        <div className={`text-lg font-black ${product.originalPrice ? 'text-rojo' : 'text-texto'}`}>
                          {product.price}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                       <Button
                        variant="ghost"
                        size="md"
                        onClick={() => onProductClick?.(product)}
                        className="bg-gray-50 text-texto rounded-xl border border-borde hover:bg-texto hover:text-white"
                        leftIcon={ArrowRight}
                        title="Ver producto"
                      />
                      <Button
                        variant="primary"
                        size="md"
                        onClick={() => onAddToCart?.(product, 'carousel' as any)}
                        className="rounded-xl tbs-shadow"
                        leftIcon={Plus}
                        title="Agregar al carrito"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Scroll Indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {products.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 rounded-full transition-all cursor-pointer ${
              currentIndex === idx ? 'w-8 bg-rojo' : 'w-2 bg-gray-200 hover:bg-gray-300'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
