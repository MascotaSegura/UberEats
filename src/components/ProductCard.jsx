import React from 'react';
import { Plus, Minus, Trash } from '@phosphor-icons/react';
import { useCart } from '../context/useCart';

const handleKeyDown = (fn) => (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    fn();
  }
};

const QuickAddControl = ({ product }) => {
  const { cartItems, addToCart, updateQuantity, removeFromCart } = useCart();
  
  // Find if product is already in cart.
  // Match only items without customizations for quick add.
  const cartItem = cartItems.find(item => item.productId === product.id && (!item.customizations || item.customizations.length === 0));
  
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleIncrement = (e) => {
    e.stopPropagation();
    if (quantity === 0) {
      addToCart(product, 1);
    } else {
      updateQuantity(cartItem.id, quantity + 1);
    }
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    if (quantity === 1) {
      removeFromCart(cartItem.id);
    } else if (quantity > 1) {
      updateQuantity(cartItem.id, quantity - 1);
    }
  };

  if (quantity === 0) {
    return (
      <button 
        className="w-8 h-8 rounded-full bg-[#F3F4F6] flex items-center justify-center hover:bg-[#1E1E1E] active:bg-[#1E1E1E] hover:text-white active:text-white transition-colors active:scale-[0.90] outline-none focus-visible:bg-[#E5E5E7]"
        onClick={handleIncrement}
        aria-label={`Añadir ${product.name} al carrito`}
        type="button"
      >
        <Plus size={16} weight="bold" />
      </button>
    );
  }

  return (
    <div 
      className="flex items-center gap-2 bg-[#F3F4F6] px-1 py-1 rounded-full" 
      onClick={e => e.stopPropagation()}
    >
      <button
        className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#1E1E1E] hover:text-[#06C167] active:text-[#06C167] transition-colors active:scale-[0.90] outline-none focus-visible:bg-[#ECECEE]"
        onClick={handleDecrement}
        aria-label="Disminuir cantidad"
        type="button"
      >
        {quantity === 1 ? <Trash size={14} weight="bold" /> : <Minus size={14} weight="bold" />}
      </button>
      <span className="text-[13px] font-medium w-3 text-center select-none">
        {quantity}
      </span>
      <button
        className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#1E1E1E] hover:text-[#06C167] active:text-[#06C167] transition-colors active:scale-[0.90] outline-none focus-visible:bg-[#ECECEE]"
        onClick={handleIncrement}
        aria-label="Aumentar cantidad"
        type="button"
      >
        <Plus size={14} weight="bold" />
      </button>
    </div>
  );
};

const ProductCard = ({ product, onClick }) => {
  return (
    <div
      className="bg-white p-4 flex flex-col cursor-pointer hover:-translate-y-1 hover:bg-[#FAFAFA] active:bg-[#FAFAFA] active:scale-[0.98] transition-all outline-none focus-visible:bg-[#F9F9F9] rounded-2xl"
      onClick={() => { onClick(product); }}
      onKeyDown={handleKeyDown(() => { onClick(product); })}
      role="button"
      tabIndex={0}
      aria-label={`Ver ${product.name}, ${product.price.toFixed(2)} MXN`}
    >
      <div className="w-full aspect-square mb-3 relative flex justify-center items-center">
        <img
          src={product.image}
          alt={product.name}
          className="max-w-full max-h-full object-contain mix-blend-multiply"
        />
      </div>

      <h3 className="text-[15px] font-semibold text-[#1E1E1E] leading-tight mb-1 line-clamp-2">
        {product.name}
      </h3>

      <p className="text-[13px] text-[#8E8E93] line-clamp-2 mb-3 flex-1 leading-snug">
        {product.description}
      </p>

      <div className="flex items-center mt-auto justify-between">
        <span className="text-[15px] font-semibold text-[#1E1E1E]">
          ${product.price.toFixed(2)} <span className="text-[12px] font-semibold text-[#8E8E93]">MXN</span>
        </span>
        
        <QuickAddControl product={product} />
      </div>
    </div>
  );
};

export default ProductCard;
