import React, { useEffect } from 'react';
import { User, Receipt, Wallet, Tag, Storefront, Question, X } from '@phosphor-icons/react';

const Sidebar = ({ isOpen, onClose }) => {
  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const menuItems = [
    { icon: <User size={24} weight="fill" />, label: 'Cuenta' },
    { icon: <Receipt size={24} weight="fill" />, label: 'Pedidos' },
    { icon: <Wallet size={24} weight="fill" />, label: 'Billetera' },
    { icon: <Storefront size={24} weight="fill" />, label: 'Sucursales' },
    { icon: <Tag size={24} weight="fill" />, label: 'Promociones' },
    { icon: <Question size={24} weight="fill" />, label: 'Ayuda' },
  ];

  const content = (
    <div className="flex-1 overflow-y-auto py-2">
      {/* Auth buttons (visible globally as the profile section placeholder) */}
      <div className="flex flex-col gap-3 px-4 pb-4 pt-2">
        <button className="w-full py-3 bg-[#1E1E1E] text-white rounded-xl font-medium text-[14px] active:scale-[0.98] transition-transform outline-none focus-visible:opacity-80">
          Registrarte
        </button>
        <button className="w-full py-3 bg-[#F3F4F6] hover:bg-[#ECECEE] text-[#1E1E1E] rounded-xl font-medium text-[14px] active:scale-[0.98] transition-all outline-none focus-visible:bg-[#ECECEE]">
          Iniciar sesión
        </button>
      </div>

      <div className="flex flex-col mt-2 px-3 gap-1">
        {menuItems.map((item, index) => (
          <button 
            key={index}
            className="flex items-center gap-4 w-full px-4 py-3.5 text-left rounded-2xl hover:bg-[#F3F4F6] transition-all outline-none focus-visible:bg-[#F3F4F6] active:scale-[0.98]"
          >
            <div className="text-[#1E1E1E] shrink-0">
              {item.icon}
            </div>
            <span className="text-[16px] font-medium text-[#1E1E1E] whitespace-nowrap">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#1E1E1E]/40 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Sidebar Panel */}
      <div className="relative w-[80%] max-w-[320px] h-full bg-white flex flex-col animate-slide-in-left">
        {/* Header */}
        <div className="p-4 flex items-center justify-between pb-6">
          <div className="text-[22px] tracking-tight text-[#1E1E1E]">
            <span className="font-normal">Uber</span> <span className="font-medium">Eats</span>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#F3F4F6] hover:bg-[#ECECEE] active:scale-95 transition-all outline-none"
          >
            <X size={20} weight="bold" />
          </button>
        </div>

        {content}
      </div>
    </div>
  );
};

export default Sidebar;
