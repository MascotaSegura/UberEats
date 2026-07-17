import React from 'react';
import { motion } from 'framer-motion';
import { X, Storefront, MapPin } from '@phosphor-icons/react';
import { useCart } from '../context/useCart';

const handleKeyDown = (fn) => (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    fn();
  }
};

const StoresPanel = ({ onClose }) => {
  const { branches, pickupBranch, setPickupBranch, setDeliveryMode } = useCart();

  const handleSelectBranch = (branch) => {
    setPickupBranch(branch);
    setDeliveryMode('pickup');
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 h-[100dvh] w-screen z-50 flex items-end md:items-stretch justify-center md:justify-end bg-[#1E1E1E]/40 md:p-0 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Sucursales"
    >
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.5 }}
        onDragEnd={(e, info) => {
          if (info.offset.y > 100 || info.velocity.y > 500) {
            onClose();
          }
        }}
        className="bg-white w-full h-full max-h-[100dvh] md:h-full max-w-[480px] flex flex-col md:rounded-l-2xl rounded-t-2xl md:rounded-tr-none overflow-hidden relative isolate">
        <div className="flex items-center px-6 pb-4 pt-[max(1rem,env(safe-area-inset-top,1rem))] shrink-0 bg-white">
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
          <h2 className="flex-1 text-center text-lg font-semibold text-[#1E1E1E] pr-10">
            Sucursales
          </h2>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-6">
          {!branches || branches.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-[#F3F4F6] rounded-full flex items-center justify-center mb-6">
                <Storefront size={40} weight="fill" color="#D1D1D6" />
              </div>
              <h3 className="text-xl font-semibold text-[#1E1E1E] mb-2">No hay sucursales</h3>
              <p className="text-[15px] text-[#8E8E93] max-w-[250px]">En este momento no hay sucursales disponibles.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {branches.map((branch) => {
                const isSelected = pickupBranch?.id === branch.id;
                return (
                  <div key={branch.id} className={`p-5 rounded-2xl flex flex-col gap-3 transition-colors outline-none focus-visible:opacity-80 ${isSelected ? 'bg-[#1E1E1E] text-white' : 'bg-[#F3F4F6] text-[#1E1E1E]'}`}>
                    <div className="flex items-start gap-3">
                      <Storefront size={24} weight="fill" className={isSelected ? 'text-white' : 'text-[#1E1E1E]'} />
                      <div className="flex-1 flex flex-col">
                        <span className="font-semibold text-[16px]">{branch.label}</span>
                        <span className={`text-[14px] mt-1 ${isSelected ? 'text-[#D1D1D6]' : 'text-[#8E8E93]'}`}>{branch.detail}</span>
                      </div>
                    </div>
                    {!isSelected && (
                      <button 
                        className="mt-2 w-full bg-white text-[#1E1E1E] font-medium py-2.5 rounded-full hover:bg-[#ECECEE] active:scale-[0.98] outline-none focus-visible:bg-[#ECECEE] transition-all"
                        onClick={() => handleSelectBranch(branch)}
                      >
                        Recoger aquí
                      </button>
                    )}
                    {isSelected && (
                      <div className="mt-2 w-full bg-[#2C2C2E] text-white font-medium py-2.5 rounded-full flex items-center justify-center cursor-default">
                        Seleccionada
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StoresPanel;
