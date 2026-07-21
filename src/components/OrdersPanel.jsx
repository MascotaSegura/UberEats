import React, { useRef } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { X, Receipt, Package } from '@phosphor-icons/react';
import { useModalHistory } from '../hooks/useModalHistory';
import { useCart } from '../context/useCart';
import PullToRefresh from './PullToRefresh';

const handleKeyDown = (fn) => (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    fn();
  }
};

const mockOrders = [
  { id: '1', date: '10 de Julio, 2026', total: 350.00, items: 3, status: 'Entregado' },
  { id: '2', date: '5 de Julio, 2026', total: 120.50, items: 1, status: 'Entregado' },
];

const OrdersPanel = ({ onClose }) => {
  useModalHistory(true, onClose);
  const { activeOrder, setOrderStatus } = useCart();
  const dragControls = useDragControls();
  const scrollContainerRef = useRef(null);

  const handleRefresh = async () => {
    await new Promise(resolve => setTimeout(resolve, 1500));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 h-[100dvh] w-screen z-50 flex items-end md:items-stretch justify-center md:justify-end bg-[#1E1E1E]/40 md:p-0 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Mis Pedidos"
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
          if (info.offset.y > 100 || info.velocity.y > 500) onClose();
        }}
        className="bg-white w-full h-full max-h-[100dvh] md:h-full max-w-[480px] flex flex-col md:rounded-l-2xl rounded-t-2xl md:rounded-tr-none overflow-hidden relative isolate"
      >
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
              onPointerDown={(e) => e.stopPropagation()} // Prevent drag when clicking the close button
              onKeyDown={handleKeyDown(onClose)}
              role="button"
              tabIndex={0}
              aria-label="Cerrar"
            >
              <X size={20} weight="bold" color="#1E1E1E" />
            </div>
            <h2 className="flex-1 text-center text-lg font-semibold text-[#1E1E1E] pr-10 pointer-events-none">
              Mis Pedidos
            </h2>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto" ref={scrollContainerRef}>
          <PullToRefresh onRefresh={handleRefresh} scrollRef={scrollContainerRef}>
            <div className="p-6">
          {mockOrders.length === 0 && !activeOrder ? (
            <div className="h-full flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-[#F3F4F6] rounded-full flex items-center justify-center mb-6">
                <Receipt size={40} weight="fill" color="#D1D1D6" />
              </div>
              <h3 className="text-xl font-semibold text-[#1E1E1E] mb-2">No tienes pedidos</h3>
              <p className="text-[15px] text-[#8E8E93] max-w-[250px]">¡Realiza tu primer pedido y aparecerá aquí!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {activeOrder && (
                <div
                  className="bg-[#1E1E1E] p-5 rounded-2xl flex flex-col gap-3 hover:bg-[#2C2C2E] transition-colors cursor-pointer outline-none focus-visible:opacity-90 relative overflow-hidden"
                  onClick={() => { setOrderStatus('tracking'); onClose(); }}
                >
                  <div className="flex justify-between items-center relative z-10">
                    <span className="font-semibold text-white text-[15px]">Pedido en curso</span>
                    <span className="text-[#1E1E1E] font-bold text-[13px] bg-[#06C167] px-2 py-1 rounded-full flex items-center gap-1">
                      <Package size={14} weight="bold" /> Activo
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[14px] relative z-10">
                    <span className="text-[#8E8E93]">¡Sigue tu pedido en tiempo real!</span>
                  </div>
                  <button className="mt-2 w-full bg-white text-[#1E1E1E] font-medium py-2.5 rounded-full hover:bg-[#FAFAFA] active:scale-[0.98] outline-none focus-visible:bg-[#FAFAFA] transition-all relative z-10">
                    Ver seguimiento
                  </button>
                </div>
              )}
              {mockOrders.map((order) => (
                <div key={order.id} className="bg-[#F3F4F6] p-5 rounded-2xl flex flex-col gap-3 hover:bg-[#ECECEE] transition-colors cursor-pointer outline-none focus-visible:bg-[#ECECEE]">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-[#1E1E1E] text-[15px]">{order.date}</span>
                    <span className="text-[#06C167] font-medium text-[13px] bg-white px-2 py-1 rounded-full">{order.status}</span>
                  </div>
                  <div className="flex justify-between items-center text-[14px]">
                    <span className="text-[#8E8E93]">{order.items} {order.items === 1 ? 'artículo' : 'artículos'}</span>
                    <span className="font-semibold text-[#1E1E1E]">${order.total.toFixed(2)} MXN</span>
                  </div>
                  <button className="mt-2 w-full bg-white text-[#1E1E1E] font-medium py-2.5 rounded-full hover:bg-[#FAFAFA] active:scale-[0.98] outline-none focus-visible:bg-[#FAFAFA] transition-all">
                    Volver a pedir
                  </button>
                </div>
              ))}
            </div>
          )}
            </div>
          </PullToRefresh>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OrdersPanel;
