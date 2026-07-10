import React, { useState, useEffect } from 'react';
import { X, Minus, Plus, ShareNetwork, Check } from '@phosphor-icons/react';
import { useCart } from '../context/useCart';


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
  const { addToCart } = useCart();

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!product) return null;

  const handleShare = async () => {
    const shareData = {
      title: 'DidiBurger',
      text: `¡Mira ${product.name} en DidiBurger!`,
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
    addToCart(product, quantity, removedIngredients, specialInstructions.trim());
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div
      className="fixed inset-0 h-[100dvh] w-screen z-50 flex items-end md:items-center justify-center bg-[#1E1E1E]/40 p-0 md:p-4 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
    >
      <div className="bg-white w-full max-h-[100dvh] h-full md:h-[85vh] md:max-h-[650px] max-w-[480px] md:max-w-[900px] flex flex-col md:flex-row md:rounded-2xl overflow-hidden relative animate-slide-up md:animate-fade-in isolate">
        
        {/* Imagen - Solo Desktop */}
        <div className="hidden md:flex relative w-[45%] shrink-0 h-full bg-[#F3F4F6] justify-center items-center p-8">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain mix-blend-multiply"
          />
        </div>

        {/* Columna de Información (Mobile: 100%, Desktop: 55%) */}
        <div className="flex-1 min-h-0 flex flex-col w-full md:w-[55%] bg-white relative">
          
          {/* Diseño (Flat/Moderno): En móvil el header es absoluto y transparente para que los íconos floten sobre la imagen del producto, evitando barras sólidas que cortan la experiencia visual. */}
          <div className="absolute md:relative top-0 left-0 w-full flex justify-between md:justify-end gap-2 px-4 py-3 pt-[max(1rem,env(safe-area-inset-top,1rem))] z-20 md:bg-white shrink-0 pointer-events-none md:pointer-events-auto">
            {/* Close Button (Left on mobile, Right on desktop) */}
            <div
              className="w-10 h-10 bg-white md:bg-[#F3F4F6] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#ECECEE] active:scale-[0.95] outline-none focus-visible:ring-2 focus-visible:ring-[#FF441F] transition-all pointer-events-auto md:order-2"
              onClick={handleClose}
              onKeyDown={handleKeyDown(handleClose)}
              role="button"
              tabIndex={0}
              aria-label="Cerrar"
            >
              <X size={20} weight="bold" color="#1E1E1E" />
            </div>
            {/* Share Button (Right on mobile, Left on desktop) */}
            <div
              className="w-10 h-10 bg-white md:bg-[#F3F4F6] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#ECECEE] active:scale-[0.95] outline-none focus-visible:ring-2 focus-visible:ring-[#FF441F] transition-all pointer-events-auto md:order-1"
              onClick={handleShare}
              onKeyDown={handleKeyDown(handleShare)}
              role="button"
              tabIndex={0}
              aria-label={copied ? 'Enlace copiado' : 'Compartir'}
            >
              {copied
                ? <Check size={20} weight="bold" color="#FF441F" />
                : <ShareNetwork size={20} weight="bold" color="#1E1E1E" />}
            </div>
          </div>

          {/* Área con Scroll */}
          <div className="flex-1 min-h-0 min-w-0 overflow-y-auto">
            
            {/* Imagen - Solo Mobile (Se mueve con el scroll) */}
            <div className="md:hidden relative w-full aspect-square bg-[#F3F4F6] flex justify-center items-center p-8 mb-6">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </div>

            {/* Contenido */}
            <div className="px-6 pb-6 pt-4">
              <h1 className="text-2xl md:text-3xl font-bold text-[#1E1E1E] mb-2 leading-tight">{product.name}</h1>
              {/* Diseño: Mostramos el precio unitario del producto aquí para mayor claridad. */}
              <div className="text-[20px] font-bold text-[#1E1E1E] mb-4">${product.price?.toFixed(2)} MXN</div>
              <p className="text-[#8E8E93] text-[15px] md:text-[16px] leading-relaxed mb-8">
                {product.description}
              </p>

            {product.ingredients && product.ingredients.length > 0 && (
              <div className="mb-8">
                <span className="text-[#1E1E1E] font-semibold block mb-3">Ingredientes</span>
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
                        className={`px-4 py-2 rounded-full text-[14px] font-semibold cursor-pointer active:scale-[0.95] outline-none focus-visible:ring-2 focus-visible:ring-[#FF441F] focus-visible:ring-offset-1 transition-all select-none ${
                          isRemoved 
                            ? 'bg-[#ECECEE] text-[#8E8E93] line-through hover:bg-[#E5E5E7]' 
                            : 'bg-[#F3F4F6] text-[#1E1E1E] hover:bg-[#ECECEE]'
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
              <span className="text-[14px] font-bold text-[#1E1E1E]">Instrucciones especiales (Opcional)</span>
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
          {/* Diseño: Se elimina la fila separada de "Cantidad" y se integra aquí para consolidar la acción en un solo lugar visible y accesible tanto en móvil como en escritorio. */}
          <div className="p-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:p-6 md:pb-[max(1.5rem,env(safe-area-inset-bottom))] bg-white shrink-0 flex items-center gap-3 md:gap-4">
            {/* Controles de cantidad (Píldora) */}
            <div className="flex items-center justify-center gap-2 md:gap-3 bg-[#F3F4F6] rounded-full p-1 md:p-1.5 shrink-0">
              <div
                className={`w-10 h-10 md:w-11 md:h-11 flex items-center justify-center bg-white rounded-full text-[#1E1E1E] transition-all outline-none focus-visible:ring-2 focus-visible:ring-[#FF441F] ${quantity <= 1 ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:bg-[#ECECEE] active:scale-[0.95]'}`}
                onClick={() => { if (quantity > 1) setQuantity(quantity - 1); }}
                onKeyDown={handleKeyDown(() => { if (quantity > 1) setQuantity(quantity - 1); })}
                role="button"
                tabIndex={quantity <= 1 ? -1 : 0}
                aria-disabled={quantity <= 1}
                aria-label="Quitar uno"
              >
                <Minus size={18} weight="bold" />
              </div>
              <span className="text-[16px] md:text-lg font-bold w-4 md:w-5 text-center text-[#1E1E1E]">
                {quantity}
              </span>
              <div
                className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center bg-white rounded-full cursor-pointer text-[#1E1E1E] hover:bg-[#ECECEE] active:scale-[0.95] outline-none focus-visible:ring-2 focus-visible:ring-[#FF441F] transition-all"
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
              className="flex-1 bg-[#1E1E1E] text-white h-[48px] md:h-[56px] rounded-full flex items-center justify-between px-5 md:px-6 font-bold cursor-pointer transition-all active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-[#FF441F] focus-visible:ring-offset-2 focus-visible:ring-offset-white text-[15px] md:text-[16px]"
              onClick={handleAdd}
              onKeyDown={handleKeyDown(handleAdd)}
              role="button"
              tabIndex={0}
              aria-label={`Agregar al carrito, ${(product.price * quantity).toFixed(2)} MXN`}
            >
              <span>Agregar</span>
              <span>${(product.price * quantity).toFixed(2)} MXN</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
