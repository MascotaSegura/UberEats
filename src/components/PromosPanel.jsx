import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from '@phosphor-icons/react';
import { useCart } from '../context/useCart';

const handleKeyDown = (fn) => (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    fn();
  }
};

const mockPromos = [
  { id: '1', title: 'Envío Gratis', desc: 'En pedidos mayores a $200 MXN.', code: 'FREESHIP' },
  { id: '2', title: '20% de Descuento', desc: 'En tu primera orden de Hamburguesas.', code: 'BURGER20' },
];

const PromosPanel = ({ onClose }) => {
  const { applyPromo, activePromo } = useCart();
  const [inputCode, setInputCode] = useState('');
  const [message, setMessage] = useState(null);

  const handleApply = () => {
    if (!inputCode.trim()) return;
    const res = applyPromo(inputCode.trim());
    if (res.success) {
      setMessage({ type: 'success', text: '¡Cupón aplicado con éxito!' });
      setInputCode('');
    } else {
      setMessage({ type: 'error', text: res.error });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 h-[100dvh] w-screen z-50 flex items-end md:items-stretch justify-center md:justify-end bg-[#1E1E1E]/40 md:p-0 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Promociones"
    >
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
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
            Promociones
          </h2>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-6">
          <div className="flex items-center bg-[#F3F4F6] rounded-full px-4 py-1 mb-2 focus-within:bg-[#ECECEE] transition-colors">
             <input 
                type="text" 
                placeholder="Ingresa un código promocional" 
                className="flex-1 bg-transparent outline-none text-[15px] text-[#1E1E1E] placeholder:text-[#8E8E93] h-12 uppercase" 
                value={inputCode}
                onChange={(e) => {
                   setInputCode(e.target.value.toUpperCase());
                   if (message) setMessage(null);
                }}
                onKeyDown={(e) => {
                   if (e.key === 'Enter') handleApply();
                }}
             />
             <button 
                className="bg-[#1E1E1E] text-white px-5 py-2 rounded-full font-medium text-[14px] hover:bg-[#2C2C2E] active:scale-[0.95] transition-all outline-none focus-visible:opacity-90 disabled:opacity-50"
                onClick={handleApply}
                disabled={!inputCode.trim()}
             >
               Aplicar
             </button>
          </div>
          
          <div className="h-6 mb-4">
             {message && (
               <p className={`text-[13px] font-medium px-2 ${message.type === 'success' ? 'text-[#06C167]' : 'text-[#FF3B30]'}`}>
                 {message.text}
               </p>
             )}
             {!message && activePromo && (
               <p className="text-[13px] font-medium px-2 text-[#06C167]">
                 Cupón activo: {activePromo.code}
               </p>
             )}
          </div>

          <h3 className="font-semibold text-[#1E1E1E] text-[16px] mb-4">Promociones disponibles</h3>
          
          <div className="flex flex-col gap-4">
            {mockPromos.map((promo) => (
              <div key={promo.id} className="bg-[#06C167]/10 p-5 rounded-2xl flex flex-col gap-2">
                <span className="font-bold text-[#06C167] text-[18px]">{promo.title}</span>
                <span className="text-[#1E1E1E] text-[14px] mb-2 max-w-[80%]">{promo.desc}</span>
                
                <div className="flex items-center justify-between mt-1 bg-white p-2 pl-4 rounded-full">
                  <span className="font-mono font-bold text-[#1E1E1E] text-[15px]">{promo.code}</span>
                  <button 
                    className="h-8 px-3 bg-[#F3F4F6] rounded-full flex items-center justify-center text-[#1E1E1E] text-[13px] font-medium hover:bg-[#ECECEE] active:scale-[0.95] transition-all outline-none focus-visible:bg-[#ECECEE]"
                    onClick={() => {
                       setInputCode(promo.code);
                       setMessage(null);
                    }}
                    aria-label={`Usar código ${promo.code}`}
                  >
                    Usar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PromosPanel;
