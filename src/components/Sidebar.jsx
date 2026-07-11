import React, { useEffect, useState, useContext } from 'react';
import { Receipt, Wallet, Tag, Storefront, Question, X } from '@phosphor-icons/react';
import { AuthContext } from '../context/AuthContext';
import AuthModal from './AuthModal';

const Sidebar = ({ isOpen, onClose, onMenuSelect }) => {
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

  const { user } = useContext(AuthContext);
  const [authModalConfig, setAuthModalConfig] = useState({ isOpen: false, view: 'login' });

  if (!isOpen) return null;

  const menuItems = [
    { id: 'orders', icon: <Receipt size={24} weight="fill" />, label: 'Pedidos' },
    { id: 'wallet', icon: <Wallet size={24} weight="fill" />, label: 'Billetera' },
    { id: 'stores', icon: <Storefront size={24} weight="fill" />, label: 'Sucursales' },
    { id: 'promos', icon: <Tag size={24} weight="fill" />, label: 'Promociones' },
    { id: 'help', icon: <Question size={24} weight="fill" />, label: 'Ayuda' },
  ];

  const openAuth = (view) => setAuthModalConfig({ isOpen: true, view });
  const closeAuth = () => setAuthModalConfig({ ...authModalConfig, isOpen: false });

  const handleMenuClick = (itemId) => {
    const requiresAuth = ['orders', 'wallet', 'promos'].includes(itemId);
    if (requiresAuth && !user) {
      openAuth('login');
    } else {
      onMenuSelect(itemId);
    }
  };

  const content = (
    <div className="flex-1 overflow-y-auto py-2">
      {/* Auth buttons (visible globally as the profile section placeholder) */}
      <div className="flex flex-col gap-3 px-4 pb-4 pt-2">
        {user ? (
          <button 
            className="w-full py-3 bg-[#F3F4F6] hover:bg-[#ECECEE] active:bg-[#ECECEE] text-[#1E1E1E] rounded-full font-medium text-[14px] active:scale-[0.98] transition-all outline-none focus-visible:bg-[#ECECEE] flex items-center justify-center gap-2"
            onClick={() => { openAuth('profile'); }}
          >
            <div className="w-6 h-6 rounded-full bg-[#1E1E1E] text-white flex items-center justify-center text-[11px] font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            Mi Perfil
          </button>
        ) : (
          <>
            <button 
              className="w-full py-3 bg-[#1E1E1E] text-white rounded-full font-medium text-[14px] active:scale-[0.98] transition-transform outline-none focus-visible:opacity-80"
              onClick={() => { openAuth('signup'); }}
            >
              Registrarte
            </button>
            <button 
              className="w-full py-3 bg-[#F3F4F6] hover:bg-[#ECECEE] active:bg-[#ECECEE] text-[#1E1E1E] rounded-full font-medium text-[14px] active:scale-[0.98] transition-all outline-none focus-visible:bg-[#ECECEE]"
              onClick={() => { openAuth('login'); }}
            >
              Iniciar sesión
            </button>
          </>
        )}
      </div>

      <div className="flex flex-col mt-2 px-3 gap-1">
        {menuItems.map((item) => (
          <button 
            key={item.id}
            className="flex items-center gap-4 w-full px-4 py-3.5 text-left rounded-2xl hover:bg-[#F3F4F6] active:bg-[#F3F4F6] transition-all outline-none focus-visible:bg-[#F3F4F6] active:scale-[0.98]"
            onClick={() => handleMenuClick(item.id)}
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
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#F3F4F6] hover:bg-[#ECECEE] active:bg-[#ECECEE] active:scale-95 transition-all outline-none"
          >
            <X size={20} weight="bold" />
          </button>
        </div>

        {content}
      </div>
      
      <AuthModal isOpen={authModalConfig.isOpen} onClose={closeAuth} initialView={authModalConfig.view} />
    </div>
  );
};

export default Sidebar;
