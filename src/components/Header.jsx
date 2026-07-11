import React, { useState } from 'react';
import { MagnifyingGlass, ShoppingCart, X, List, User } from '@phosphor-icons/react';
import { useCart } from '../context/useCart';
import { DeliveryLocation, DeliveryModeDesktop, DeliveryModeMobile, DeliveryModals, useDeliveryModalState } from './DeliverySelector';
const handleKeyDown = (fn) => (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    fn();
  }
};

const CartButton = ({ onOpenCart, cartCount }) => (
  <button
    type="button"
    onClick={() => { onOpenCart(); }}
    aria-label={`Carrito${cartCount > 0 ? `, ${cartCount} artículos` : ''}`}
    className="relative w-9 h-9 flex items-center justify-center cursor-pointer hover:bg-[#F3F4F6] active:scale-[0.95] outline-none focus-visible:bg-[#F3F4F6] rounded-full transition-all shrink-0"
  >
    <ShoppingCart size={22} weight="bold" color="#1E1E1E" />
    {cartCount > 0 && (
      <div className="absolute -top-1 -right-1 bg-[#06C167] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
        {cartCount}
      </div>
    )}
  </button>
);

const Header = ({ onOpenCart, searchQuery, onSearchChange, onMenuToggle }) => {
  const { cartItems } = useCart();
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const hasText = searchQuery.trim().length > 0;
  
  const { activeModal, setActiveModal, modes } = useDeliveryModalState();

  return (
    <div className="bg-white">
      {/* MOBILE LAYOUT (3 Rows: Logo, Location/Switch, Search) */}
      <div className="md:hidden flex flex-col gap-1.5 px-4 pt-1.5 pb-2">
        {/* Row 1: Logo & Cart */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button 
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#F3F4F6] active:scale-95 transition-all outline-none"
              onClick={onMenuToggle}
            >
              <List size={24} weight="bold" color="#1E1E1E" />
            </button>
            <div className="text-[22px] tracking-tight text-[#1E1E1E] leading-none">
              <span className="font-normal">Uber</span> <span className="font-medium">Eats</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#F3F4F6] active:scale-95 transition-all outline-none">
              <User size={22} weight="bold" color="#1E1E1E" />
            </button>
            <CartButton onOpenCart={onOpenCart} cartCount={cartCount} />
          </div>
        </div>

        {/* Row 2: Location & DeliveryMode */}
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <DeliveryLocation setActiveModal={setActiveModal} />
          </div>
          <div className="shrink-0">
            <DeliveryModeMobile setActiveModal={setActiveModal} />
          </div>
        </div>

        {/* Row 3: Search */}
        <div className="w-full">
          <div className="flex items-center bg-[#F3F4F6] rounded-full h-9 px-4 focus-within:bg-[#ECECEE] transition-colors">
            <MagnifyingGlass size={18} weight="bold" color="#8E8E93" className="shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
              placeholder="Buscar platillos..."
              className="flex-1 ml-2 text-[14px] outline-none bg-transparent text-[#1E1E1E] placeholder:text-[#8E8E93] min-w-0"
            />
            {hasText && (
              <button
                type="button"
                aria-label="Limpiar búsqueda"
                onClick={() => onSearchChange('')}
                className="shrink-0 ml-1 p-1 rounded-full outline-none focus-visible:bg-[#E5E5E7] text-[#8E8E93] hover:text-[#1E1E1E] active:scale-[0.95] transition-all"
              >
                <X size={16} weight="bold" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* DESKTOP LAYOUT (1 Compact Row) */}
      <div className="hidden md:flex max-w-7xl mx-auto px-4 py-2 items-center gap-3 h-[52px]">
        
        {/* Hamburger + Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#F3F4F6] active:scale-95 transition-all outline-none"
            onClick={onMenuToggle}
          >
            <List size={22} weight="bold" color="#1E1E1E" />
          </button>
          <div className="text-[22px] tracking-tight text-[#1E1E1E] whitespace-nowrap">
            <span className="font-normal">Uber</span> <span className="font-medium">Eats</span>
          </div>
        </div>

        {/* 1. Interruptor (Switch) */}
        <div className="shrink-0 flex items-center">
          <DeliveryModeDesktop variant="header" />
        </div>

        {/* 2. Ubicación */}
        <div className="flex shrink-0 min-w-0 max-w-[200px]">
          <DeliveryLocation setActiveModal={setActiveModal} variant="compact" />
        </div>

        {/* 3. Buscador */}
        <div className="flex-1 min-w-[80px] max-w-2xl">
          <div className="flex items-center bg-[#F3F4F6] rounded-full h-9 px-4 focus-within:bg-[#ECECEE] transition-colors">
            <MagnifyingGlass size={18} weight="bold" color="#8E8E93" className="shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}
              placeholder="Buscar platillos..."
              className="flex-1 ml-2 text-[14px] outline-none bg-transparent text-[#1E1E1E] placeholder:text-[#8E8E93] min-w-0"
            />
            {hasText && (
              <button
                type="button"
                aria-label="Limpiar búsqueda"
                onClick={() => onSearchChange('')}
                className="shrink-0 ml-1 p-1 rounded-full outline-none focus-visible:bg-[#E5E5E7] text-[#8E8E93] hover:text-[#1E1E1E] active:scale-[0.95] transition-all"
              >
                <X size={16} weight="bold" />
              </button>
            )}
          </div>
        </div>
        
        {/* 4. Auth Buttons & Cart */}
        <div className="flex items-center shrink-0 gap-1 lg:gap-2 ml-auto">
          <button className="hidden lg:flex px-4 h-9 items-center justify-center rounded-full bg-white hover:bg-[#F3F4F6] text-[#1E1E1E] font-medium text-[14px] transition-all outline-none">
            Iniciar sesión
          </button>
          <button className="hidden lg:flex px-4 h-9 items-center justify-center rounded-full bg-[#1E1E1E] hover:bg-[#2C2C2E] text-white font-medium text-[14px] transition-all outline-none">
            Registrarte
          </button>
          {/* Tablet (md) fallback User Icon */}
          <button className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full bg-white hover:bg-[#F3F4F6] text-[#1E1E1E] transition-all outline-none">
            <User size={22} weight="bold" />
          </button>
          <CartButton onOpenCart={onOpenCart} cartCount={cartCount} />
        </div>

      </div>

      <DeliveryModals activeModal={activeModal} setActiveModal={setActiveModal} modes={modes} />
    </div>
  );
};

export default Header;
