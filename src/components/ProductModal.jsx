import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShareNetwork, Check, MagnifyingGlassPlus, Heart } from '@phosphor-icons/react';
import { useCart } from '../context/useCart';
import ImageViewer from './ImageViewer';


const handleKeyDown = (fn) => (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    fn();
  }
};

const ProductModal = ({ product, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [removedIngredients, setRemovedIngredients] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [copied, setCopied] = useState(false);
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const { addToCart, favorites = [], toggleFavorite = () => {} } = useCart();
  const isFavorite = favorites.includes(product?.id);

  const [selectedVariants, setSelectedVariants] = useState(() => {
    const defaults = {};
    if (product?.singleChoiceOptions) {
      product.singleChoiceOptions.forEach(opt => {
        if (opt.required && opt.options.length > 0) {
          defaults[opt.title] = opt.options[0].label;
        }
      });
    }
    return defaults;
  });

  const calculatedPrice = useMemo(() => {
    let p = product?.price || 0;
    if (product?.singleChoiceOptions) {
      product.singleChoiceOptions.forEach(opt => {
        const selectedLabel = selectedVariants[opt.title];
        const optionDef = opt.options.find(o => o.label === selectedLabel);
        if (optionDef && optionDef.priceAdd) {
          p += optionDef.priceAdd;
        }
      });
    }
    return p;
  }, [product, selectedVariants]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!product) return null;

  const handleShare = async () => {
    const shareData = {
      title: 'Uber Eats',
      text: `¡Mira ${product.name} en Uber Eats!`,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or error sharing
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
      } catch (err) {
        // Clipboard unavailable, fail silently
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAdd = () => {
    addToCart(product, quantity, removedIngredients, specialInstructions.trim(), selectedVariants);
    onClose();
  };


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 h-[100dvh] w-screen z-50 flex items-end md:items-center justify-center bg-[#1E1E1E]/40 p-0 md:p-4 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
    >
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
        className="bg-white w-full max-h-[100dvh] h-full md:h-[85vh] md:max-h-[650px] max-w-[480px] md:max-w-[900px] flex flex-col md:flex-row md:rounded-2xl overflow-hidden relative isolate"
      >
        
        {/* Imagen - Solo Desktop */}
        <div 
          className="hidden md:flex relative w-[45%] shrink-0 h-full bg-[#F3F4F6] justify-center items-center p-8 group cursor-pointer"
          onClick={() => setIsImageExpanded(true)}
          role="button"
          tabIndex={0}
          onKeyDown={handleKeyDown(() => setIsImageExpanded(true))}
          aria-label="Ver imagen ampliada"
        >
          <motion.img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="bg-white/90 p-3 rounded-full text-[#1E1E1E]">
              <MagnifyingGlassPlus size={24} weight="bold" />
            </div>
          </div>
        </div>

        {/* Columna de Información (Mobile: 100%, Desktop: 55%) */}
        <div className="flex-1 min-h-0 flex flex-col w-full md:w-[55%] bg-white relative">
          
          {/* Header absoluto */}
          <div className="absolute md:relative top-0 left-0 w-full flex justify-between md:justify-end items-center px-4 py-3 pt-[max(1rem,env(safe-area-inset-top,1rem))] z-20 md:bg-white shrink-0 pointer-events-none md:pointer-events-auto">
            
            {/* Left side: Close Button (Mobile Only) */}
            <div className="md:hidden pointer-events-auto">
              <div
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-[#ECECEE] active:bg-[#ECECEE] active:scale-[0.95] outline-none focus-visible:bg-[#ECECEE] transition-all"
                onClick={onClose}
                onKeyDown={handleKeyDown(onClose)}
                role="button"
                tabIndex={0}
                aria-label="Cerrar"
              >
                <X size={20} weight="bold" color="#1E1E1E" />
              </div>
            </div>

            {/* Right side: Actions + Desktop Close */}
            <div className="flex items-center gap-2 pointer-events-auto">
              {/* Share Button */}
              <div
                className="w-10 h-10 bg-white md:bg-[#F3F4F6] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#ECECEE] active:bg-[#ECECEE] active:scale-[0.95] outline-none focus-visible:bg-[#ECECEE] transition-all"
                onClick={handleShare}
                onKeyDown={handleKeyDown(handleShare)}
                role="button"
                tabIndex={0}
                aria-label={copied ? 'Enlace copiado' : 'Compartir'}
              >
                {copied
                  ? <Check size={20} weight="bold" color="#06C167" />
                  : <ShareNetwork size={20} weight="bold" color="#1E1E1E" />}
              </div>

              {/* Favorite Button */}
              <div
                className="w-10 h-10 bg-white md:bg-[#F3F4F6] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#ECECEE] active:bg-[#ECECEE] active:scale-[0.95] outline-none focus-visible:bg-[#ECECEE] transition-all"
                onClick={() => toggleFavorite(product.id)}
                onKeyDown={handleKeyDown(() => toggleFavorite(product.id))}
                role="button"
                tabIndex={0}
                aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              >
                <Heart size={20} weight={isFavorite ? "fill" : "bold"} color={isFavorite ? "#FF3B30" : "currentColor"} />
              </div>

              {/* Close Button (Desktop Only) */}
              <div className="hidden md:block">
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
              </div>
            </div>
          </div>

          {/* Área con Scroll */}
          <div className="flex-1 min-h-0 min-w-0 overflow-y-auto">
            
            {/* Imagen - Solo Mobile (Se mueve con el scroll) */}
            <div 
              className="md:hidden relative w-full aspect-square bg-[#F3F4F6] flex justify-center items-center p-8 mb-6 cursor-pointer"
              onClick={() => setIsImageExpanded(true)}
              role="button"
              tabIndex={0}
              onKeyDown={handleKeyDown(() => setIsImageExpanded(true))}
              aria-label="Ver imagen ampliada"
            >
              <motion.img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain mix-blend-multiply"
              />
              <div className="absolute bottom-4 right-4 bg-white/90 p-2 rounded-full text-[#1E1E1E]">
                <MagnifyingGlassPlus size={20} weight="bold" />
              </div>
            </div>

            {/* Contenido */}
            <div className="px-6 pb-6 pt-4">
              {product.originalPrice && (
                <div className="inline-block bg-[#06C167] text-white text-[12px] font-bold px-3 py-1 rounded-full leading-none mb-3">
                  OFERTA
                </div>
              )}
              <h1 className="text-2xl md:text-3xl font-bold text-[#1E1E1E] mb-2 leading-tight">{product.name}</h1>
              {/* Diseño: Precio unitario calculado (con recargos de variantes). Si hay descuento, muestra original tachado. */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-[20px] font-semibold text-[#1E1E1E]">${calculatedPrice.toFixed(2)} MXN</span>
                {product.originalPrice && (
                  <span className="text-[15px] text-[#8E8E93] line-through">${product.originalPrice.toFixed(2)}</span>
                )}
              </div>
              <p className="text-[#8E8E93] text-[15px] md:text-[16px] leading-relaxed mb-8">
                {product.description}
              </p>

            {/* Variantes de selección única (Radio Buttons) */}
            {product.singleChoiceOptions && product.singleChoiceOptions.length > 0 && (
              <div className="mb-8 flex flex-col gap-6">
                {product.singleChoiceOptions.map(opt => (
                  <div key={opt.title} className="flex flex-col gap-3">
                    <span className="text-[#1E1E1E] font-medium block">{opt.title}</span>
                    <div className="flex flex-col gap-2">
                      {opt.options.map(option => {
                        const isSelected = selectedVariants[opt.title] === option.label;
                        return (
                          <div 
                            key={option.label}
                            className={`flex justify-between items-center p-4 rounded-2xl cursor-pointer transition-colors ${isSelected ? 'bg-[#ECECEE]' : 'bg-[#F3F4F6] hover:bg-[#ECECEE]'}`}
                            onClick={() => setSelectedVariants(prev => ({...prev, [opt.title]: option.label}))}
                            role="button"
                            tabIndex={0}
                            onKeyDown={handleKeyDown(() => setSelectedVariants(prev => ({...prev, [opt.title]: option.label})))}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isSelected ? 'bg-[#06C167]' : 'bg-white'}`}>
                                {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                              </div>
                              <span className="text-[15px] font-medium text-[#1E1E1E]">{option.label}</span>
                            </div>
                            {option.priceAdd > 0 && <span className="text-[#8E8E93] text-[14px]">+${option.priceAdd}</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {product.ingredients && product.ingredients.length > 0 && (
              <div className="mb-8">
                <span className="text-[#1E1E1E] font-medium block mb-3">Ingredientes</span>
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map(ing => {
                    const isRemoved = removedIngredients.includes(ing);
                    return (
                      <div
                        key={ing}
                        onClick={() => {
                          if (isRemoved) {
                            setRemovedIngredients(prev => prev.filter(i => i !== ing));
                          } else {
                            setRemovedIngredients(prev => [...prev, ing]);
                          }
                        }}
                        onKeyDown={handleKeyDown(() => {
                          if (isRemoved) {
                            setRemovedIngredients(prev => prev.filter(i => i !== ing));
                          } else {
                            setRemovedIngredients(prev => [...prev, ing]);
                          }
                        })}
                        role="button"
                        tabIndex={0}
                        aria-pressed={!isRemoved}
                        className={`px-4 py-2 rounded-full text-[14px] font-medium cursor-pointer active:scale-[0.95] outline-none focus-visible:opacity-80 transition-all select-none ${
                          isRemoved 
                            ? 'bg-[#ECECEE] text-[#8E8E93] line-through hover:bg-[#E5E5E7] active:bg-[#E5E5E7]' 
                            : 'bg-[#F3F4F6] text-[#1E1E1E] hover:bg-[#ECECEE] active:bg-[#ECECEE]'
                        }`}
                      >
                        {ing}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2 mb-6">
              <span className="text-[14px] font-medium text-[#1E1E1E]">Instrucciones especiales (Opcional)</span>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Ej. poca sal, salsa aparte..."
                rows={2}
                className="w-full bg-[#F3F4F6] rounded-2xl px-4 py-3 text-[14px] outline-none text-[#1E1E1E] placeholder:text-[#8E8E93] focus:bg-[#ECECEE] resize-none transition-colors"
              />
            </div>


          </div>
          </div>

          {/* Botón inferior y controles de cantidad unificados */}
          <div className="p-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:p-6 md:pb-[max(1.5rem,env(safe-area-inset-bottom))] bg-white shrink-0 flex items-center gap-3 md:gap-4">
            {/* Controles de cantidad (Píldora) */}
            <div className="flex items-center justify-center gap-2 md:gap-3 bg-[#F3F4F6] rounded-full p-1 md:p-1.5 shrink-0">
              <div
                className={`w-10 h-10 md:w-11 md:h-11 flex items-center justify-center bg-white rounded-full text-[#1E1E1E] transition-all outline-none focus-visible:bg-[#ECECEE] ${quantity <= 1 ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:bg-[#ECECEE] active:bg-[#ECECEE] active:scale-[0.95]'}`}
                onClick={() => { if (quantity > 1) setQuantity(quantity - 1); }}
                onKeyDown={handleKeyDown(() => { if (quantity > 1) setQuantity(quantity - 1); })}
                role="button"
                tabIndex={quantity <= 1 ? -1 : 0}
                aria-disabled={quantity <= 1}
                aria-label="Quitar uno"
              >
                <Minus size={18} weight="bold" />
              </div>
              <span className="text-[16px] md:text-lg font-medium w-4 md:w-5 text-center text-[#1E1E1E]">
                {quantity}
              </span>
              <div
                className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center bg-white rounded-full cursor-pointer text-[#1E1E1E] hover:bg-[#ECECEE] active:bg-[#ECECEE] active:scale-[0.95] outline-none focus-visible:bg-[#ECECEE] transition-all"
                onClick={() => setQuantity(quantity + 1)}
                onKeyDown={handleKeyDown(() => setQuantity(quantity + 1))}
                role="button"
                tabIndex={0}
                aria-label="Agregar uno"
              >
                <Plus size={18} weight="bold" />
              </div>
            </div>

            {/* Botón de agregar */}
            <div
              className="flex-1 bg-[#06C167] text-white h-[48px] md:h-[56px] rounded-full flex items-center justify-between px-5 md:px-6 font-medium cursor-pointer transition-all hover:bg-[#05a055] active:bg-[#05a055] active:scale-[0.98] outline-none focus-visible:bg-[#05a055] text-[15px] md:text-[16px]"
              onClick={handleAdd}
              onKeyDown={handleKeyDown(handleAdd)}
              role="button"
              tabIndex={0}
              aria-label={`Agregar al carrito, ${(calculatedPrice * quantity).toFixed(2)} MXN`}
            >
              <span>Agregar</span>
              <span>${(calculatedPrice * quantity).toFixed(2)} MXN</span>
            </div>
          </div>
        </div>
      </motion.div>
      <AnimatePresence>
        {isImageExpanded && (
          <ImageViewer 
            src={product.image} 
            alt={product.name} 
            onClose={() => setIsImageExpanded(false)} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductModal;
