import React from 'react';
import { X, Trash, Plus, Minus, CheckCircle, Package, Truck, MapPin, Storefront, ShoppingCart, CreditCard } from '@phosphor-icons/react';
import { useCart } from '../context/useCart';
import DeliverySelector from './DeliverySelector';
import NotificationModal from './NotificationModal';


const handleKeyDown = (fn) => (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    fn();
  }
};

const STEPS = [
  { key: 'preparing', label: 'Preparando', Icon: Package },
  { key: 'on-the-way', label: 'En camino', Icon: Truck },
  { key: 'delivered', label: 'Entregado', Icon: CheckCircle },
];

const statusTitle = {
  preparing: 'Preparando pedido...',
  'on-the-way': '¡Tu pedido va en camino!',
  delivered: '¡Pedido entregado!',
};



const CartPanel = ({ onClose }) => {
  const {
    cartItems,
    getCartTotal,
    updateQuantity,
    removeFromCart,
    placeOrder,
    orderStatus,
    resetOrder,
    deliveryMode,
    deliveryAddress,
    pickupBranch,
    activePromo,
    removePromo,
    selectedPaymentMethod,
  } = useCart();

  const [errorMsg, setErrorMsg] = React.useState('');
  const [showNotificationModal, setShowNotificationModal] = React.useState(false);

  const handlePlaceOrder = () => {
    if (deliveryMode === 'delivery' && !deliveryAddress) {
      setErrorMsg('Por favor, selecciona o agrega una dirección de entrega antes de continuar.');
      return;
    }
    setErrorMsg('');
    placeOrder();
    
    const hasAsked = localStorage.getItem('didi_asked_notif_v2');
    if (!hasAsked) {
      setTimeout(() => {
        setShowNotificationModal(true);
      }, 500);
    }
  };

  if (orderStatus) {
    const currentIndex = STEPS.findIndex((s) => s.key === orderStatus);
    return (
      <div className="fixed inset-0 h-[100dvh] w-screen z-50 flex items-center md:items-stretch justify-center md:justify-end bg-[#1E1E1E]/40 p-4 md:p-0 overflow-hidden">
        <div className="bg-white w-full max-h-[100dvh] max-w-[480px] flex flex-col items-center justify-center p-8 text-center rounded-2xl md:rounded-none md:rounded-l-2xl isolate overflow-y-auto">
          <h2 className="text-3xl font-semibold text-[#1E1E1E] mb-2">
            {statusTitle[orderStatus]}
          </h2>
          <p className="text-[#8E8E93] text-[15px] mb-10">
            Gracias por elegir Uber Eats.
          </p>

          <div className="flex items-center justify-center gap-2 mb-12 w-full max-w-[320px]">
            {STEPS.map((step, i) => {
              const { Icon } = step;
              const done = i < currentIndex;
              const active = i === currentIndex;
              return (
                <React.Fragment key={step.key}>
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                        done || active
                          ? 'bg-[#06C167] text-white'
                          : 'bg-[#F3F4F6] text-[#8E8E93]'
                      }`}
                    >
                      <Icon size={20} weight="fill" />
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        done || active ? 'text-[#1E1E1E]' : 'text-[#8E8E93]'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-[2px] -translate-y-3 transition-colors ${
                        i < currentIndex ? 'bg-[#06C167]' : 'bg-[#F3F4F6]'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          <div
            className="bg-[#1E1E1E] text-white px-8 py-3 rounded-full font-medium cursor-pointer transition-all active:scale-[0.98] outline-none focus-visible:opacity-80"
            onClick={resetOrder}
            onKeyDown={handleKeyDown(resetOrder)}
            role="button"
            tabIndex={0}
          >
            Volver al inicio
          </div>
        </div>
        <NotificationModal 
          isOpen={showNotificationModal} 
          onClose={() => {
            localStorage.setItem('didi_asked_notif_v2', 'true');
            setShowNotificationModal(false);
          }}
          onAllow={() => {
            localStorage.setItem('didi_asked_notif_v2', 'true');
            // Here would be the actual push notification permission request
            setShowNotificationModal(false);
          }}
        />
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 h-[100dvh] w-screen z-50 flex items-end md:items-stretch justify-center md:justify-end bg-[#1E1E1E]/40 md:p-0 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Tu carrito"
    >
      <div className="bg-white w-full h-full max-h-[100dvh] md:h-full max-w-[480px] flex flex-col md:rounded-none md:rounded-l-2xl overflow-hidden relative animate-slide-up md:animate-none isolate">
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
          <h2 className="flex-1 text-center text-lg font-semibold text-[#1E1E1E] pr-10">
            Tu Carrito
          </h2>
        </div>

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
                <div
                  key={item.id}
                  className="flex gap-4"
                >
                  <div className="w-20 h-20 bg-[#F3F4F6] flex justify-center items-center p-1 shrink-0 rounded-2xl">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="max-w-full max-h-full object-contain mix-blend-multiply"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex flex-col">
                        <h3 className="font-medium text-[#1E1E1E] text-[15px] leading-tight">
                          {item.name}
                        </h3>
                        {item.customizations && item.customizations.length > 0 && (
                          <p className="text-[12px] text-[#8E8E93] mt-1 leading-tight">
                            Sin {item.customizations.join(', ')}
                          </p>
                        )}
                        {item.specialInstructions && (
                          <p className="text-[12px] text-[#8E8E93] mt-0.5 leading-tight italic">
                            Nota: {item.specialInstructions}
                          </p>
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
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          onKeyDown={handleKeyDown(() =>
                            updateQuantity(item.id, item.quantity - 1)
                          )}
                          role="button"
                          tabIndex={0}
                          aria-label={`Quitar uno de ${item.name}`}
                        >
                          <Minus size={14} weight="bold" />
                        </div>
                        <span className="text-[14px] font-bold w-4 text-center">
                          {item.quantity}
                        </span>
                        <div
                          className="cursor-pointer p-1 hover:text-[#06C167] active:text-[#06C167] transition-all active:scale-[0.95] outline-none rounded-full focus-visible:bg-[#E5E5E7]"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          onKeyDown={handleKeyDown(() =>
                            updateQuantity(item.id, item.quantity + 1)
                          )}
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
        </div>

        {cartItems.length > 0 && (() => {
          const subtotal = getCartTotal();
          const deliveryFee = deliveryMode === 'delivery' ? 25 : 0;
          let discountAmount = 0;
          if (activePromo) {
             if (activePromo.type === 'shipping') discountAmount = deliveryFee;
             if (activePromo.type === 'percentage') discountAmount = subtotal * activePromo.discount;
          }
          const finalTotal = Math.max(0, subtotal + deliveryFee - discountAmount);

          return (
          <div className="p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] bg-white shrink-0">
            <div className="flex flex-col gap-2 mb-4 text-[#8E8E93] text-[15px]">
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
                  <span className="flex items-center gap-2">
                    Cupón ({activePromo.code})
                    <button onClick={removePromo} className="text-[#FF3B30] hover:underline text-[12px]">Quitar</button>
                  </span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
            </div>
            
            {selectedPaymentMethod && (
              <div className="flex items-center gap-3 bg-[#F3F4F6] p-3 rounded-xl mb-4">
                 <div className="w-8 h-6 bg-white rounded-md flex items-center justify-center shrink-0">
                    <CreditCard size={14} weight="fill" color="#1E1E1E" />
                 </div>
                 <div className="flex-1 min-w-0 flex justify-between items-center">
                    <span className="text-[13px] font-medium text-[#1E1E1E] truncate">Pago con {selectedPaymentMethod.type}</span>
                    <span className="text-[13px] text-[#8E8E93]">•••• {selectedPaymentMethod.last4}</span>
                 </div>
              </div>
            )}
            
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
              className="w-full bg-[#06C167] text-white py-4 rounded-full flex justify-center font-medium cursor-pointer transition-all active:scale-[0.98] outline-none focus-visible:opacity-90"
              onClick={() => { handlePlaceOrder(); }}
              onKeyDown={handleKeyDown(() => { handlePlaceOrder(); })}
              role="button"
              tabIndex={0}
              aria-label={`Confirmar pedido, total ${finalTotal.toFixed(2)} MXN`}
            >
              Confirmar Pedido
            </div>
          </div>
        )})()}
      </div>
    </div>
  );
};

export default CartPanel;
