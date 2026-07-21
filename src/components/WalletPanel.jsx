import React, { useState, useRef, useEffect } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { X, CreditCard, Plus } from '@phosphor-icons/react';
import { useCart } from '../context/useCart';
import { useModalHistory } from '../hooks/useModalHistory';
import PullToRefresh from './PullToRefresh';
import { CardItemSkeleton } from './SkeletonComponents';

const handleKeyDown = (fn) => (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    fn();
  }
};

const getCardType = (number) => {
  const clean = number.replace(/\D/g, '');
  if (clean.startsWith('4')) return 'Visa';
  if (/^5[1-5]/.test(clean) || /^2[2-7]/.test(clean)) return 'Mastercard';
  if (/^3[47]/.test(clean)) return 'Amex';
  return 'Tarjeta';
};

const formatCardNumber = (val) => {
  const clean = val.replace(/\D/g, '');
  const type = getCardType(clean);
  if (type === 'Amex') {
    const match = clean.match(/^(\d{0,4})(\d{0,6})(\d{0,5})$/);
    if (!match) return clean.slice(0, 15);
    return [match[1], match[2], match[3]].filter(Boolean).join(' ');
  } else {
    const match = clean.match(/^(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})$/);
    if (!match) return clean.slice(0, 16);
    return [match[1], match[2], match[3], match[4]].filter(Boolean).join(' ');
  }
};

const formatExpiry = (val) => {
  const clean = val.replace(/\D/g, '');
  if (clean.length >= 3) return `${clean.slice(0, 2)}/${clean.slice(2, 4)}`;
  return clean;
};

const WalletPanel = ({ onClose }) => {
  useModalHistory(true, onClose);
  const { savedCards, addCard, selectedPaymentMethod, setSelectedPaymentMethod } = useCart();
  const dragControls = useDragControls();
  const [isAdding, setIsAdding] = useState(false);
  const [showFundMsg, setShowFundMsg] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const scrollContainerRef = useRef(null);

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

  const handleAddCard = () => {
    setErrorMsg(null);
    const cleanNum = cardNumber.replace(/\D/g, '');
    const type = getCardType(cleanNum);
    const requiredLength = type === 'Amex' ? 15 : 16;

    if (cleanNum.length !== requiredLength) { setErrorMsg('Número de tarjeta incompleto.'); return; }
    if (expiry.length < 5) { setErrorMsg('Fecha de expiración incompleta.'); return; }

    const [month, year] = expiry.split('/');
    const now = new Date();
    const currentYear = parseInt(now.getFullYear().toString().slice(2), 10);
    const currentMonth = now.getMonth() + 1;
    const expM = parseInt(month, 10);
    const expY = parseInt(year, 10);

    if (expM < 1 || expM > 12) { setErrorMsg('Mes de expiración inválido.'); return; }
    if (expY < currentYear || (expY === currentYear && expM < currentMonth)) { setErrorMsg('La tarjeta ha expirado.'); return; }

    const requiredCvv = type === 'Amex' ? 4 : 3;
    if (cvv.length !== requiredCvv) { setErrorMsg(`El código de seguridad debe ser de ${requiredCvv} dígitos.`); return; }

    addCard({ type, last4: cleanNum.slice(-4) });
    setIsAdding(false);
    setCardNumber('');
    setExpiry('');
    setCvv('');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 h-[100dvh] w-screen z-50 flex items-end md:items-stretch justify-center md:justify-end bg-[#1E1E1E]/40 md:p-0 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Billetera"
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
              onPointerDown={(e) => e.stopPropagation()}
              onKeyDown={handleKeyDown(onClose)}
              role="button"
              tabIndex={0}
              aria-label="Cerrar"
            >
              <X size={20} weight="bold" color="#1E1E1E" />
            </div>
            <h2 className="flex-1 text-center text-lg font-semibold text-[#1E1E1E] pr-10 pointer-events-none">
              Billetera
            </h2>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto" ref={scrollContainerRef}>
          <PullToRefresh onRefresh={handleRefresh} scrollRef={scrollContainerRef}>
            <div className="p-6">
              <div className="bg-[#1E1E1E] text-white p-6 rounded-2xl mb-8 flex flex-col gap-1">
                <span className="text-[14px] text-[#D1D1D6] font-medium">Uber Cash</span>
                <span className="text-3xl font-bold">$150.00 <span className="text-[14px] font-medium text-[#8E8E93]">MXN</span></span>
                <button
                  className="mt-4 bg-[#2C2C2E] py-2.5 rounded-full font-medium text-[14px] hover:bg-[#3C3C3E] active:scale-[0.98] outline-none focus-visible:opacity-80 transition-all w-fit px-6"
                  onClick={() => { setShowFundMsg(true); setTimeout(() => setShowFundMsg(false), 3000); }}
                >
                  Agregar fondos
                </button>
                {showFundMsg && (
                  <p className="text-[13px] text-[#8E8E93] mt-2">Esta función estará disponible próximamente.</p>
                )}
              </div>

              <h3 className="font-semibold text-[#1E1E1E] text-[16px] mb-4">Métodos de pago</h3>

              <div className="flex flex-col gap-3">
                {isLoading ? (
                  <>
                    <CardItemSkeleton />
                    <CardItemSkeleton />
                  </>
                ) : savedCards.map((card) => (
                  <div
                    key={card.id}
                    onClick={() => setSelectedPaymentMethod(card)}
                    className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-colors outline-none focus-visible:opacity-80 ${
                      selectedPaymentMethod?.id === card.id ? 'bg-[#1E1E1E] text-white' : 'bg-[#F3F4F6] text-[#1E1E1E] hover:bg-[#ECECEE]'
                    }`}
                  >
                    <div className={`w-12 h-8 rounded-2xl flex items-center justify-center ${selectedPaymentMethod?.id === card.id ? 'bg-[#2C2C2E]' : 'bg-white'}`}>
                      <CreditCard size={20} weight="fill" color={selectedPaymentMethod?.id === card.id ? '#FFFFFF' : '#1E1E1E'} />
                    </div>
                    <div className="flex-1 flex flex-col">
                      <span className="font-medium text-[15px]">{card.type}</span>
                      <span className={`text-[13px] ${selectedPaymentMethod?.id === card.id ? 'text-[#D1D1D6]' : 'text-[#8E8E93]'}`}>•••• {card.last4}</span>
                    </div>
                  </div>
                ))}

                {!isAdding ? (
                  <div
                    className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer outline-none focus-visible:opacity-80 transition-all hover:bg-[#F3F4F6] active:bg-[#F3F4F6]"
                    onClick={() => setIsAdding(true)}
                  >
                    <div className="w-10 h-10 bg-[#F3F4F6] rounded-full flex items-center justify-center">
                      <Plus size={20} weight="bold" color="#1E1E1E" />
                    </div>
                    <span className="font-medium text-[#1E1E1E] text-[15px]">Agregar método de pago</span>
                  </div>
                ) : (
                  <div className="bg-[#F3F4F6] p-5 rounded-2xl flex flex-col gap-3 mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-[#1E1E1E] text-[15px]">Nueva Tarjeta</span>
                      {cardNumber.replace(/\D/g, '').length > 0 && (
                        <span className="text-[13px] font-bold text-[#8E8E93] bg-white px-2 py-0.5 rounded-full">{getCardType(cardNumber)}</span>
                      )}
                    </div>

                    <input
                      type="text"
                      placeholder="Número de tarjeta"
                      className={`w-full rounded-2xl h-11 px-4 outline-none text-[14px] text-[#1E1E1E] placeholder:text-[#8E8E93] transition-colors ${errorMsg?.includes('Número') ? 'bg-[#FFF0F0] text-[#FF3B30]' : 'bg-white focus:bg-[#ECECEE]'}`}
                      value={cardNumber}
                      onChange={(e) => { setCardNumber(formatCardNumber(e.target.value)); setErrorMsg(null); }}
                    />

                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className={`flex-1 min-w-0 rounded-2xl h-11 px-4 outline-none text-[14px] text-[#1E1E1E] placeholder:text-[#8E8E93] transition-colors ${errorMsg?.includes('expiración') ? 'bg-[#FFF0F0] text-[#FF3B30]' : 'bg-white focus:bg-[#ECECEE]'}`}
                        value={expiry}
                        onChange={(e) => { setExpiry(formatExpiry(e.target.value)); setErrorMsg(null); }}
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        maxLength={getCardType(cardNumber) === 'Amex' ? 4 : 3}
                        className={`flex-1 min-w-0 rounded-2xl h-11 px-4 outline-none text-[14px] text-[#1E1E1E] placeholder:text-[#8E8E93] transition-colors ${errorMsg?.includes('código') ? 'bg-[#FFF0F0] text-[#FF3B30]' : 'bg-white focus:bg-[#ECECEE]'}`}
                        value={cvv}
                        onChange={(e) => { setCvv(e.target.value.replace(/\D/g, '').slice(0, 4)); setErrorMsg(null); }}
                      />
                    </div>

                    {errorMsg && (
                      <span className="text-[13px] text-[#FF3B30] font-medium px-1">{errorMsg}</span>
                    )}

                    <div className="flex gap-2 mt-1">
                      <button
                        className="flex-1 bg-white text-[#1E1E1E] py-2.5 rounded-full font-medium text-[14px] hover:bg-[#ECECEE] active:scale-[0.98] outline-none focus-visible:bg-[#ECECEE] transition-all"
                        onClick={() => { setIsAdding(false); setCardNumber(''); setExpiry(''); setCvv(''); setErrorMsg(null); }}
                      >
                        Cancelar
                      </button>
                      <button
                        className="flex-1 bg-[#1E1E1E] text-white py-2.5 rounded-full font-medium text-[14px] hover:bg-[#2C2C2E] active:scale-[0.98] outline-none focus-visible:opacity-90 transition-all disabled:opacity-50"
                        onClick={handleAddCard}
                        disabled={cardNumber.length < 15 || expiry.length < 5 || cvv.length < 3}
                      >
                        Guardar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </PullToRefresh>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WalletPanel;
