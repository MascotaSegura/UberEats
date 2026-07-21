import React, { useRef, useEffect, useState } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { X, Storefront, MapPin } from '@phosphor-icons/react';
import { useCart } from '../context/useCart';
import { useModalHistory } from '../hooks/useModalHistory';
import PullToRefresh from './PullToRefresh';
import { BranchItemSkeleton } from './SkeletonComponents';

const handleKeyDown = (fn) => (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    fn();
  }
};

const StoresPanel = ({ onClose }) => {
  useModalHistory(true, onClose);
  const { branches, pickupBranch, setPickupBranch, setDeliveryMode } = useCart();
  const dragControls = useDragControls();
  const scrollContainerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial data fetch
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

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
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        drag="y"
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.5 }}
        onDragEnd={(e, info) => {
          if (info.offset.y > 100 || info.velocity.y > 500) {
            onClose();
          }
        }}
        className="bg-white w-full h-full max-h-[100dvh] md:h-full max-w-[480px] flex flex-col md:rounded-l-2xl rounded-t-2xl md:rounded-tr-none overflow-hidden relative isolate">
        
        {/* Drag Handle Area */}
        <div 
          className="flex flex-col shrink-0 bg-white touch-none cursor-grab active:cursor-grabbing"
          onPointerDown={(e) => dragControls.start(e)}
        >
          <div className="w-full flex justify-center pt-3 pb-1 md:hidden">
            <div className="w-12 h-1.5 bg-[#E5E5EA] rounded-full" />
          </div>
          
          <div className="flex items-center px-6 pb-4 pt-2 md:pt-[max(1rem,env(safe-area-inset-top,1rem))]">
            <div
              className="w-10 h-10 bg-[#F3F4F6] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#ECECEE] active:bg-[#ECECEE] active:scale-[0.95] outline-none focus-visible:bg-[#ECECEE] transition-all"
              onClick={onClose}
              onPointerDown={(e) => e.stopPropagation()}
              onKeyDown={handleKeyDown(onClose)}
              role="button"
              tabIndex={0}
              aria-label="Cerrar"
            >
              <X size={20} weight="bold" color="#1E1E1E" />
            </div>
            <h2 className="flex-1 text-center text-lg font-semibold text-[#1E1E1E] pr-10 pointer-events-none">
              Sucursales
            </h2>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto" ref={scrollContainerRef}>
          <PullToRefresh onRefresh={handleRefresh} scrollRef={scrollContainerRef}>
            <div className="p-6">
              {isLoading ? (
                <div className="flex flex-col gap-4">
                  <BranchItemSkeleton />
                  <BranchItemSkeleton />
                </div>
              ) : !branches || branches.length === 0 ? (
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
          </PullToRefresh>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StoresPanel;
