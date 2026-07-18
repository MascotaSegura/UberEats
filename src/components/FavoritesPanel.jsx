import React from 'react';
import { motion } from 'framer-motion';
import { X, Heart } from '@phosphor-icons/react';
import { useCart } from '../context/useCart';
import { products } from '../data/products';
import ProductCard from './ProductCard';

const handleKeyDown = (fn) => (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    fn();
  }
};

const FavoritesPanel = ({ onClose, onProductClick }) => {
  const { favorites = [] } = useCart();
  
  // Get full product objects for the favorited items
  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 h-[100dvh] w-screen z-[200] flex items-end md:items-stretch justify-center md:justify-end bg-[#1E1E1E]/40 md:p-0 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Mis Favoritos"
    >
      {/* Container - sliding from right in desktop, up in mobile */}
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.5 }}
        onDragEnd={(e, info) => {
          if (info.offset.y > 100 || info.velocity.y > 500) {
            onClose();
          }
        }}
        className="bg-[#F3F4F6] w-full h-full max-h-[100dvh] md:h-full md:max-w-[480px] flex flex-col md:rounded-l-2xl rounded-t-2xl md:rounded-tr-none overflow-hidden relative isolate">
        
        {/* Header */}
        <div className="flex items-center px-6 pb-4 pt-[max(1rem,env(safe-area-inset-top,1rem))] shrink-0 bg-white z-10">
          <div
            className="w-10 h-10 bg-[#F3F4F6] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#ECECEE] active:bg-[#ECECEE] active:scale-[0.95] outline-none focus-visible:bg-[#ECECEE] transition-all"
            onClick={onClose}
            onKeyDown={handleKeyDown(onClose)}
            role="button"
            tabIndex={0}
            aria-label="Cerrar"
          >
            <X size={20} weight="bold" color="#1E1E1E" />
          </div>
          <h2 className="flex-1 text-center text-lg font-semibold text-[#1E1E1E] pr-10">
            Favoritos
          </h2>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          {favoriteProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center py-10 text-center">
              <div className="w-20 h-20 bg-[#ECECEE] rounded-full flex items-center justify-center mb-6">
                <Heart size={40} weight="fill" color="#D1D1D6" />
              </div>
              <h3 className="text-xl font-semibold text-[#1E1E1E] mb-2">Aún no tienes favoritos</h3>
              <p className="text-[15px] text-[#8E8E93] max-w-[250px]">
                Presiona el corazón en tus platillos preferidos para guardarlos aquí.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {favoriteProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={(p) => {
                    if (onProductClick) onProductClick(p);
                    // Opcionalmente cerrar el panel o dejarlo abierto sobre el modal
                    // onClose(); 
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FavoritesPanel;
