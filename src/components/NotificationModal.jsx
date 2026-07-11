import React from 'react';
import { createPortal } from 'react-dom';
import { BellRinging, X } from '@phosphor-icons/react';

const handleKeyDown = (fn) => (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    fn();
  }
};

const NotificationModal = ({ isOpen, onClose, onAllow }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center bg-[#1E1E1E]/40 md:p-4">
      <div
        className="bg-white w-full h-auto max-h-[80vh] md:max-w-[400px] flex flex-col rounded-t-2xl md:rounded-2xl overflow-hidden relative animate-slide-up md:animate-fade-in p-6 pt-10"
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-[#F3F4F6] rounded-full flex items-center justify-center mb-6">
            <BellRinging size={40} weight="fill" color="#1E1E1E" />
          </div>
          
          <h2 className="text-xl font-bold text-[#1E1E1E] mb-2">
            ¡Sigue tu pedido en vivo!
          </h2>
          <p className="text-[15px] text-[#8E8E93] mb-8 leading-snug px-4">
            Activa las notificaciones para saber cuándo el restaurante empiece a preparar tu comida y cuando el repartidor esté en camino.
          </p>
          
          <div className="w-full flex flex-col gap-3">
            <button
              className="w-full bg-[#1E1E1E] text-white py-3.5 rounded-full font-medium hover:bg-[#2C2C2E] active:bg-[#2C2C2E] transition-all active:scale-[0.98] outline-none"
              onClick={() => {
                onAllow();
                onClose();
              }}
            >
              Permitir notificaciones
            </button>
            <button
              className="w-full bg-[#F3F4F6] text-[#1E1E1E] py-3.5 rounded-full font-medium hover:bg-[#ECECEE] active:bg-[#ECECEE] transition-all active:scale-[0.98] outline-none"
              onClick={onClose}
            >
              Ahora no
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default NotificationModal;
