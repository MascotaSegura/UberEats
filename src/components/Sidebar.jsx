import React, { useEffect, useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Receipt, Wallet, Tag, Storefront, Question, X, DeviceMobile } from '@phosphor-icons/react';
import { AuthContext } from '../context/AuthContext';
import AuthModal from './AuthModal';
import PWAInstallModal from './PWAInstallModal';

const Sidebar = ({ isOpen, onClose, onMenuSelect, onOpenProfile }) => {
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
  const [isStandalone, setIsStandalone] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      setIsStandalone(true);
    }
  }, []);

  const handleInstallClick = async () => {
    if (window.deferredPrompt) {
      window.deferredPrompt.prompt();
      const { outcome } = await window.deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        window.deferredPrompt = null;
        setIsStandalone(true);
      }
    } else {
      setShowInstallModal(true);
    }
  };

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
            onClick={() => { onOpenProfile(); onClose(); }}
          >
            <div className="w-6 h-6 rounded-full bg-[#1E1E1E] text-white flex items-center justify-center text-[11px] font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            Mi Perfil
          </button>
        ) : (
          <>
            <button 
              className="w-full py-3 bg-[#1E1E1E] text-white rounded-full font-medium text-[14px] hover:bg-[#2C2C2E] active:bg-[#2C2C2E] active:scale-[0.98] transition-all outline-none focus-visible:opacity-80"
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

        {!isStandalone && (
          <button 
            className="flex items-center gap-4 w-full px-4 py-3.5 mt-2 text-left rounded-2xl bg-[#F3F4F6] text-[#06C167] hover:bg-[#ECECEE] active:bg-[#ECECEE] transition-all outline-none focus-visible:opacity-80 active:scale-[0.98]"
            onClick={handleInstallClick}
          >
            <div className="shrink-0">
              <DeviceMobile size={24} weight="fill" />
            </div>
            <span className="text-[16px] font-medium whitespace-nowrap">
              Instalar App
            </span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#1E1E1E]/40"
        onClick={onClose}
      />
      
      {/* Sidebar Panel */}
      <motion.div 
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={{ left: 0.5, right: 0 }}
        onDragEnd={(e, info) => {
          if (info.offset.x < -70 || info.velocity.x < -500) {
            onClose();
          }
        }}
        className="relative w-[80%] max-w-[320px] h-full bg-white flex flex-col isolate"
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between pb-6">
          <div className="text-[22px] tracking-tight text-[#1E1E1E]">
            <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="Uber Eats" className="h-7 w-auto object-contain shrink-0" />
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#F3F4F6] hover:bg-[#ECECEE] active:bg-[#ECECEE] active:scale-[0.95] transition-all outline-none"
          >
            <X size={20} weight="bold" />
          </button>
        </div>

        {content}
      </motion.div>
      
      <AuthModal isOpen={authModalConfig.isOpen} onClose={closeAuth} initialView={authModalConfig.view} />
      <PWAInstallModal isOpen={showInstallModal} onClose={() => setShowInstallModal(false)} />
    </motion.div>
  );
};

export default Sidebar;
