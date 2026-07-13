import React from 'react';
import { X, Trash, Plus, Minus, CheckCircle, Package, Truck, ShoppingCart, CreditCard, CaretLeft, CaretRight, Ticket } from '@phosphor-icons/react';
import { useCart } from '../context/useCart';
import DeliverySelector from './DeliverySelector';

import { AuthContext } from '../context/AuthContext';
import AuthModal from './AuthModal';
import NotificationModal from './NotificationModal';


const handleKeyDown = (fn) => (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    fn();
  }
};



const CartPanel = ({ onClose }) => {
  const {
    cartItems,
    getCartTotal,
    updateQuantity,
    removeFromCart,
    placeOrder,
    deliveryMode,
    deliveryAddress,
    activePromo,
    removePromo,
    applyPromo,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    savedCards,
  } = useCart();

  const { user } = React.useContext(AuthContext);
  const [authModalConfig, setAuthModalConfig] = React.useState({ isOpen: false, view: 'login' });

  const [errorMsg, setErrorMsg] = React.useState('');
  const [showNotificationModal, setShowNotificationModal] = React.useState(false);

  const [promoInput, setPromoInput] = React.useState('');
  const [promoError, setPromoError] = React.useState('');
  const [activeView, setActiveView] = React.useState('cart');

  const handleApplyPromo = () => {
    if (!promoInput.trim()) return;
    const res = applyPromo(promoInput.trim());
    if (res.success) {
      setPromoInput('');
      setPromoError('');
      setActiveView('cart');
    } else {
      setPromoError(res.error);
    }
  };

  const handlePlaceOrder = () => {
    if (!user) {
      setAuthModalConfig({ isOpen: true, view: 'login' });
      return;
    }
    if (deliveryMode === 'delivery' && !deliveryAddress) {
      setErrorMsg('Por favor, selecciona o agrega una dirección de entrega antes de continuar.');
      return;
    }
    setErrorMsg('');
    placeOrder();
    const hasAsked = localStorage.getItem('ubereats_asked_notif_v2');
    if (!hasAsked) {
      setTimeout(() => { setShowNotificationModal(true); }, 500);
    }
  };

  // ── Order tracking is now handled globally in Home/App via OrderTrackingScreen

  // ── Compute totals ───────────────────────────────────────────────────────
  const subtotal = getCartTotal();
  const deliveryFee = deliveryMode === 'delivery' ? 25 : 0;
  let discountAmount = 0;
  if (activePromo) {
    if (activePromo.type === 'shipping') discountAmount = deliveryFee;
    if (activePromo.type === 'percentage') discountAmount = subtotal * activePromo.discount;
  }
  const finalTotal = Math.max(0, subtotal + deliveryFee - discountAmount);

  return (
    <div
      className="fixed inset-0 h-[100dvh] w-screen z-50 flex items-end md:items-stretch justify-center md:justify-end bg-[#1E1E1E]/40 md:p-0 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Tu carrito"
    >
      <div className="bg-white w-full h-full max-h-[100dvh] md:h-full max-w-[480px] flex flex-col md:rounded-l-2xl rounded-t-2xl md:rounded-tr-none overflow-hidden relative animate-slide-up md:animate-none isolate">

        {/* ── VISTA: CARRITO ─────────────────────────────────────────────── */}
        {activeView === 'cart' && (
          <>
            {/* Header */}
            <div className="flex items-center px-6 pb-4 pt-[max(1rem,env(safe-area-inset-top,1rem))] shrink-0">
              <div
                className="w-10 h-10 bg-[#F3F4F6] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#ECECEE] active:bg-[#ECECEE] active:scale-[0.95] outline-none focus-visible:bg-[#ECECEE] transition-all"
                onClick={() => { onClose(); }}
                onKeyDown={handleKeyDown(() => { onClose(); })}
                role="button"
                tabIndex={0}
                aria-label="Cerrar carrito"
              >
                <X size={20} weight="bold" color="#1E1E1E" />
              </div>
              <h2 className="flex-1 text-center text-lg font-semibold text-[#1E1E1E] pr-10">Tu Carrito</h2>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 min-h-0 overflow-y-auto">
              {cartItems.length > 0 && (
                <div className="px-6 pb-2 pt-2 shrink-0 flex flex-col gap-4">
                  <div className="bg-[#F3F4F6] rounded-2xl p-4 mb-4 w-full">
                    <DeliverySelector variant="cart" />
                  </div>
                </div>
              )}

              <div className="p-6">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center py-20 px-4 text-center">
                    <div className="w-20 h-20 bg-[#F3F4F6] rounded-full flex items-center justify-center mb-6">
                      <ShoppingCart size={40} weight="fill" color="#D1D1D6" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#1E1E1E] mb-2">Tu carrito está vacío</h3>
                    <p className="text-[15px] text-[#8E8E93] max-w-[250px]">¡Agrega algunas delicias para comenzar tu pedido!</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-20 h-20 bg-[#F3F4F6] flex justify-center items-center p-1 shrink-0 rounded-2xl">
                          <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div className="flex justify-between items-start gap-2">
                            <div className="flex flex-col">
                              <h3 className="font-medium text-[#1E1E1E] text-[15px] leading-tight">{item.name}</h3>
                              {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                                <p className="text-[12px] text-[#8E8E93] mt-1 leading-tight">
                                  {Object.values(item.selectedVariants).join(', ')}
                                </p>
                              )}
                              {item.customizations && item.customizations.length > 0 && (
                                <p className="text-[12px] text-[#8E8E93] mt-1 leading-tight">Sin {item.customizations.join(', ')}</p>
                              )}
                              {item.specialInstructions && (
                                <p className="text-[12px] text-[#8E8E93] mt-0.5 leading-tight italic">Nota: {item.specialInstructions}</p>
                              )}
                            </div>
                            <div
                              className="text-[#8E8E93] hover:text-[#06C167] active:text-[#06C167] cursor-pointer shrink-0 transition-all active:scale-[0.95] outline-none rounded-full focus-visible:opacity-80"
                              onClick={() => removeFromCart(item.id)}
                              onKeyDown={handleKeyDown(() => removeFromCart(item.id))}
                              role="button"
                              tabIndex={0}
                              aria-label={`Eliminar ${item.name}`}
                            >
                              <Trash size={20} weight="bold" />
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="font-semibold text-[#1E1E1E]">
                              ${(item.price * item.quantity).toFixed(2)} <span className="text-[11px] font-semibold text-[#8E8E93]">MXN</span>
                            </span>
                            <div className="flex items-center gap-3 bg-[#F3F4F6] px-2 py-1 rounded-full">
                              <div
                                className="cursor-pointer p-1 hover:text-[#06C167] active:text-[#06C167] transition-all active:scale-[0.95] outline-none rounded-full focus-visible:bg-[#E5E5E7]"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                onKeyDown={handleKeyDown(() => updateQuantity(item.id, item.quantity - 1))}
                                role="button"
                                tabIndex={0}
                                aria-label={`Quitar uno de ${item.name}`}
                              >
                                <Minus size={14} weight="bold" />
                              </div>
                              <span className="text-[14px] font-bold w-4 text-center">{item.quantity}</span>
                              <div
                                className="cursor-pointer p-1 hover:text-[#06C167] active:text-[#06C167] transition-all active:scale-[0.95] outline-none rounded-full focus-visible:bg-[#E5E5E7]"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                onKeyDown={handleKeyDown(() => updateQuantity(item.id, item.quantity + 1))}
                                role="button"
                                tabIndex={0}
                                aria-label={`Agregar uno de ${item.name}`}
                              >
                                <Plus size={14} weight="bold" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Move breakdown and selectors here to scroll with the content */}
              {cartItems.length > 0 && (
                <div className="px-6 pb-6 pt-4">
                  
                  
                  {/* Price breakdown */}
                  <div className="flex flex-col gap-2 mb-6 text-[#8E8E93] text-[15px]">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="text-[#1E1E1E]">${subtotal.toFixed(2)}</span>
                    </div>
                    {deliveryMode === 'delivery' && (
                      <div className="flex justify-between">
                        <span>Envío</span>
                        <span className="text-[#1E1E1E]">${deliveryFee.toFixed(2)}</span>
                      </div>
                    )}
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-[#06C167]">
                        <span>Cupón ({activePromo.code})</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  {/* Promo & Payment rows */}
                  <div className="flex flex-col gap-2">
                    <div
                      className="flex items-center justify-between p-3 bg-[#F3F4F6] rounded-2xl cursor-pointer hover:bg-[#ECECEE] transition-colors active:scale-[0.98] outline-none focus-visible:bg-[#ECECEE]"
                      onClick={() => setActiveView('promo')}
                      role="button"
                      tabIndex={0}
                      onKeyDown={handleKeyDown(() => setActiveView('promo'))}
                    >
                      <div className="flex items-center gap-3">
                        <Ticket size={18} color={activePromo ? '#06C167' : '#1E1E1E'} weight={activePromo ? 'fill' : 'regular'} />
                        <span className={`text-[14px] font-medium ${activePromo ? 'text-[#06C167]' : 'text-[#1E1E1E]'}`}>
                          {activePromo ? `Cupón aplicado (${activePromo.code})` : 'Agregar cupón de descuento'}
                        </span>
                      </div>
                      <CaretRight size={16} color="#8E8E93" />
                    </div>

                    {user && (
                      <div
                        className="flex items-center justify-between p-3 bg-[#F3F4F6] rounded-2xl cursor-pointer hover:bg-[#ECECEE] transition-colors active:scale-[0.98] outline-none focus-visible:bg-[#ECECEE]"
                        onClick={() => setActiveView('payment')}
                        role="button"
                        tabIndex={0}
                        onKeyDown={handleKeyDown(() => setActiveView('payment'))}
                      >
                        <div className="flex items-center gap-3">
                          <CreditCard size={18} color="#1E1E1E" weight="fill" />
                          <span className="text-[14px] font-medium text-[#1E1E1E]">
                            {selectedPaymentMethod
                              ? `Pago con ${selectedPaymentMethod.type} •••• ${selectedPaymentMethod.last4}`
                              : 'Seleccionar método de pago'}
                          </span>
                        </div>
                        <CaretRight size={16} color="#8E8E93" />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Sticky Footer: total + confirm */}
            {cartItems.length > 0 && (
              <div className="p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] bg-white shrink-0">
                {/* Total */}
                <div className="flex justify-between mb-6 text-[#1E1E1E] items-end">
                  <span className="font-semibold text-lg">Total</span>
                  <span className="font-semibold text-2xl">${finalTotal.toFixed(2)} <span className="text-[14px] font-semibold text-[#8E8E93]">MXN</span></span>
                </div>

                {errorMsg && (
                  <div className="bg-[#FFF0F0] text-[#FF3B30] p-3 rounded-2xl mb-4 text-[14px] font-medium text-center">
                    {errorMsg}
                  </div>
                )}

                <div
                  className="w-full bg-[#06C167] text-white py-4 rounded-full flex justify-center font-medium cursor-pointer transition-all hover:bg-[#05a055] active:bg-[#05a055] active:scale-[0.98] outline-none focus-visible:opacity-90"
                  onClick={() => { handlePlaceOrder(); }}
                  onKeyDown={handleKeyDown(() => { handlePlaceOrder(); })}
                  role="button"
                  tabIndex={0}
                  aria-label={`Confirmar pedido, total ${finalTotal.toFixed(2)} MXN`}
                >
                  Confirmar Pedido
                </div>
              </div>
            )}
          </>
        )}

        {/* ── VISTA: CUPÓN ───────────────────────────────────────────────── */}
        {activeView === 'promo' && (
          <div className="flex flex-col h-full w-full bg-white">
            <div className="flex items-center px-6 pb-4 pt-[max(1rem,env(safe-area-inset-top,1rem))] shrink-0">
              <div
                className="w-10 h-10 bg-[#F3F4F6] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#ECECEE] active:bg-[#ECECEE] active:scale-[0.95] outline-none focus-visible:bg-[#ECECEE] transition-all"
                onClick={() => { setActiveView('cart'); setPromoError(''); }}
                onKeyDown={handleKeyDown(() => { setActiveView('cart'); setPromoError(''); })}
                role="button"
                tabIndex={0}
              >
                <CaretLeft size={20} weight="bold" color="#1E1E1E" />
              </div>
              <h2 className="flex-1 text-center text-lg font-semibold text-[#1E1E1E] pr-10">Cupón de Descuento</h2>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
              {!activePromo ? (
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleApplyPromo(); }}
                      placeholder="Ingresa tu código"
                      className="flex-1 bg-[#F3F4F6] rounded-2xl px-4 py-3 text-[15px] outline-none focus:bg-[#ECECEE] text-[#1E1E1E] transition-colors"
                    />
                    <button
                      onClick={handleApplyPromo}
                      className="bg-[#1E1E1E] text-white px-5 py-3 rounded-2xl text-[15px] font-medium hover:bg-[#333] transition-colors outline-none focus-visible:opacity-80"
                    >
                      Aplicar
                    </button>
                  </div>
                  {promoError && <span className="text-[13px] text-[#FF3B30] px-1">{promoError}</span>}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between bg-[#F3F4F6] p-4 rounded-2xl">
                    <div className="flex items-center gap-3 text-[#06C167]">
                      <Ticket size={24} weight="fill" />
                      <span className="text-[15px] font-semibold">Cupón aplicado: {activePromo.code}</span>
                    </div>
                    <button
                      onClick={removePromo}
                      className="text-[14px] font-medium text-[#FF3B30] hover:underline outline-none"
                    >
                      Quitar
                    </button>
                  </div>
                  <button
                    onClick={() => setActiveView('cart')}
                    className="w-full bg-[#1E1E1E] text-white py-4 rounded-full flex justify-center font-medium cursor-pointer transition-all hover:bg-[#2C2C2E] active:bg-[#2C2C2E] active:scale-[0.98] outline-none focus-visible:opacity-90 mt-4"
                  >
                    Volver al carrito
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── VISTA: MÉTODO DE PAGO ──────────────────────────────────────── */}
        {activeView === 'payment' && (
          <div className="flex flex-col h-full w-full bg-white">
            <div className="flex items-center px-6 pb-4 pt-[max(1rem,env(safe-area-inset-top,1rem))] shrink-0">
              <div
                className="w-10 h-10 bg-[#F3F4F6] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#ECECEE] active:bg-[#ECECEE] active:scale-[0.95] outline-none focus-visible:bg-[#ECECEE] transition-all"
                onClick={() => setActiveView('cart')}
                onKeyDown={handleKeyDown(() => setActiveView('cart'))}
                role="button"
                tabIndex={0}
              >
                <CaretLeft size={20} weight="bold" color="#1E1E1E" />
              </div>
              <h2 className="flex-1 text-center text-lg font-semibold text-[#1E1E1E] pr-10">Método de Pago</h2>
            </div>

            <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-3">
              {savedCards.map((card) => (
                <div
                  key={card.id}
                  className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all ${
                    selectedPaymentMethod?.id === card.id
                      ? 'bg-[#ECECEE]'
                      : 'bg-[#F3F4F6] hover:bg-[#ECECEE]'
                  }`}
                  onClick={() => { setSelectedPaymentMethod(card); setActiveView('cart'); }}
                  onKeyDown={handleKeyDown(() => { setSelectedPaymentMethod(card); setActiveView('cart'); })}
                  role="button"
                  tabIndex={0}
                >
                  <div className="w-10 h-8 bg-white rounded-2xl flex items-center justify-center shrink-0">
                    <CreditCard size={20} weight="fill" color="#1E1E1E" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col">
                    <span className="text-[15px] font-semibold text-[#1E1E1E] truncate">{card.type}</span>
                    <span className="text-[13px] text-[#8E8E93]">•••• {card.last4}</span>
                  </div>
                  {selectedPaymentMethod?.id === card.id && (
                    <CheckCircle size={24} weight="fill" color="#06C167" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
      <AuthModal isOpen={authModalConfig.isOpen} onClose={() => setAuthModalConfig({ ...authModalConfig, isOpen: false })} initialView={authModalConfig.view} />
      <NotificationModal 
        isOpen={showNotificationModal} 
        onClose={() => setShowNotificationModal(false)}
        onAllow={() => {
          localStorage.setItem('ubereats_asked_notif_v2', 'true');
        }}
      />
    </div>
  );
};

export default CartPanel;
