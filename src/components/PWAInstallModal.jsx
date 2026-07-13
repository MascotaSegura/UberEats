import React from 'react';
import { createPortal } from 'react-dom';
import { X, Export, PlusSquare } from '@phosphor-icons/react';

const handleKeyDown = (fn) => (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    fn();
  }
};

const PWAInstallModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-end md:items-center justify-center bg-[#1E1E1E]/40 md:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full h-auto max-h-[80vh] md:max-w-[400px] flex flex-col rounded-t-2xl md:rounded-2xl overflow-hidden relative animate-slide-up md:animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-4 bg-white shrink-0 relative">
          <h2 className="flex-1 text-center font-semibold text-lg text-[#1E1E1E]">
            Instalar App
          </h2>
          <div
            className="absolute right-4 w-9 h-9 bg-[#F3F4F6] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#ECECEE] active:bg-[#ECECEE] active:scale-[0.95] outline-none focus-visible:bg-[#ECECEE] transition-all shrink-0"
            onClick={onClose}
            onKeyDown={handleKeyDown(onClose)}
            role="button"
            tabIndex={0}
          >
            <X size={18} weight="bold" color="#1E1E1E" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center text-center gap-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <div className="w-[64px] h-[64px] shrink-0 bg-[#06C167] rounded-2xl flex items-center justify-center mb-2 overflow-hidden">
            <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="App Icon" className="w-full h-full object-cover" />
          </div>
          
          <div className="flex flex-col gap-2">
            <h3 className="text-[18px] font-semibold text-[#1E1E1E]">Instala Uber Eats</h3>
            <p className="text-[15px] text-[#8E8E93] leading-relaxed">
              Agrega nuestra aplicación a tu pantalla de inicio para una experiencia más rápida y como una app nativa.
            </p>
          </div>

          <div className="w-full bg-[#F3F4F6] rounded-2xl p-5 flex flex-col gap-4 text-left mt-2">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0">
                <Export size={18} weight="bold" color="#1E1E1E" />
              </div>
              <span className="text-[14px] font-medium text-[#1E1E1E]">
                1. Toca el botón <strong>Compartir</strong> en la barra de navegación.
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0">
                <PlusSquare size={18} weight="bold" color="#1E1E1E" />
              </div>
              <span className="text-[14px] font-medium text-[#1E1E1E]">
                2. Selecciona <strong>"Agregar a Inicio"</strong>.
              </span>
            </div>
          </div>

          <button
            className="w-full mt-2 bg-[#1E1E1E] text-white py-3.5 rounded-full font-medium hover:bg-[#2C2C2E] active:bg-[#2C2C2E] transition-all active:scale-[0.98] outline-none focus-visible:opacity-90"
            onClick={onClose}
          >
            Entendido
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PWAInstallModal;
