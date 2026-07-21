import React, { useState, useRef } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { X, CaretDown, CaretUp, Question } from '@phosphor-icons/react';
import { useModalHistory } from '../hooks/useModalHistory';
import PullToRefresh from './PullToRefresh';
const handleKeyDown = (fn) => (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    fn();
  }
};

const faqs = [
  { id: '1', q: 'Problemas con un pedido reciente', a: 'Si tuviste un problema con tu pedido, puedes comunicarte con el soporte técnico o el restaurante directamente desde la sección de "Pedidos".' },
  { id: '2', q: 'Opciones de pago y Billetera', a: 'Aceptamos tarjetas de crédito, débito y pagos en efectivo. Puedes administrar tus métodos de pago en la sección de "Billetera".' },
  { id: '3', q: 'Configuración de la cuenta', a: 'Para cambiar tu contraseña, nombre o número telefónico, dirígete a "Mi Perfil" y selecciona editar.' },
  { id: '4', q: 'Tiempos de entrega', a: 'El tiempo estimado de entrega se calcula automáticamente basándose en la distancia de la sucursal y el tiempo de preparación.' },
];

const HelpPanel = ({ onClose, onOpenChat }) => {
  useModalHistory(true, onClose);
  const [expanded, setExpanded] = useState(null);
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
      aria-label="Ayuda"
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
          className="flex flex-col shrink-0 bg-white touch-none cursor-grab active:cursor-grabbing z-10"
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
              Ayuda
            </h2>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto" ref={scrollContainerRef}>
          <PullToRefresh onRefresh={handleRefresh} scrollRef={scrollContainerRef}>
            <div className="p-6">
          <div className="flex flex-col items-center justify-center mb-8 text-center mt-4">
            <div className="w-16 h-16 bg-[#F3F4F6] rounded-full flex items-center justify-center mb-4">
              <Question size={32} weight="fill" color="#1E1E1E" />
            </div>
            <h3 className="text-xl font-bold text-[#1E1E1E] mb-1">¿En qué podemos ayudarte?</h3>
            <p className="text-[15px] text-[#8E8E93]">Encuentra respuestas a las dudas más comunes.</p>
          </div>
          
          <div className="flex flex-col gap-3">
            {faqs.map((faq) => {
              const isExpanded = expanded === faq.id;
              return (
                <div 
                  key={faq.id} 
                  className={`bg-[#F3F4F6] rounded-2xl overflow-hidden transition-all outline-none ${isExpanded ? 'bg-[#ECECEE]' : 'hover:bg-[#ECECEE]'}`}
                >
                  <div 
                    className="p-5 flex items-center justify-between cursor-pointer active:scale-[0.99] transition-transform outline-none focus-visible:opacity-80"
                    onClick={() => setExpanded(isExpanded ? null : faq.id)}
                  >
                    <span className="font-semibold text-[#1E1E1E] text-[15px] pr-4">{faq.q}</span>
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shrink-0">
                      {isExpanded ? <CaretUp size={16} weight="bold" /> : <CaretDown size={16} weight="bold" />}
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="px-5 pb-5 text-[14.5px] text-[#8E8E93] leading-relaxed animate-fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
            </div>
            </div>
          </PullToRefresh>
        </div>
        
        <div className="p-6 bg-white shrink-0 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
           <button 
             className="w-full bg-[#1E1E1E] text-white py-3.5 rounded-full font-medium hover:bg-[#2C2C2E] active:scale-[0.98] outline-none focus-visible:opacity-90 transition-all"
             onClick={onOpenChat}
           >
             Contactar Soporte
           </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HelpPanel;
