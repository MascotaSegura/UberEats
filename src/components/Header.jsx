import { MagnifyingGlass, ShoppingCart, X } from '@phosphor-icons/react';
import { useCart } from '../context/useCart';

const handleKeyDown = (fn) => (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    fn();
  }
};

import DeliverySelector from './DeliverySelector';

const Header = ({ onOpenCart, searchQuery, onSearchChange }) => {
  const { cartItems } = useCart();
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const hasText = searchQuery.trim().length > 0;

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-3">
        
        {/* Top row: Logo, Toggle (hidden on mobile), Cart */}
        <div className="flex items-center justify-between w-full">
          <div className="text-xl font-bold tracking-tight text-[#FF441F] whitespace-nowrap">
            DidiBurger
          </div>

          <div className="hidden md:flex flex-1 justify-center">
          </div>

          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`Carrito${cartCount > 0 ? `, ${cartCount} artículos` : ''}`}
            className="relative p-2 cursor-pointer hover:bg-[#F3F4F6] active:scale-[0.95] outline-none focus-visible:ring-2 focus-visible:ring-[#FF441F] rounded-full transition-all shrink-0"
          >
            <ShoppingCart size={28} weight="regular" color="#1E1E1E" />
            {cartCount > 0 && (
              <div className="absolute top-0 right-0 bg-[#FF441F] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </div>
            )}
          </button>
        </div>

        {/* Middle row: Delivery Selector */}
        <div className="w-full mt-1">
          <DeliverySelector />
        </div>

        {/* Bottom row: Search */}
        <div className="flex flex-col md:flex-row items-center gap-3 w-full">
          
          <div className="flex-1 w-full">
            <div className="flex items-center bg-[#F3F4F6] rounded-full px-3 py-2 focus-within:ring-2 focus-within:ring-[#FF441F] transition-shadow">
              <MagnifyingGlass size={20} weight="bold" color="#8E8E93" className="shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
                placeholder="Buscar platillos..."
                className="flex-1 ml-2 text-sm outline-none bg-transparent text-[#1E1E1E] placeholder:text-[#8E8E93] min-w-0"
              />
              {hasText && (
                <button
                  type="button"
                  aria-label="Limpiar búsqueda"
                  onClick={() => onSearchChange('')}
                  className="shrink-0 ml-1 p-1 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#FF441F] text-[#8E8E93] hover:text-[#1E1E1E] active:scale-[0.95] transition-all"
                >
                  <X size={16} weight="bold" />
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Header;
