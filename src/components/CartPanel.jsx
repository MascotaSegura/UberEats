import React from 'react';
import { X, Trash, Plus, Minus, CheckCircle, Package, Truck, MapPin, Storefront } from '@phosphor-icons/react';
import { useCart } from '../context/useCart';
import DeliverySelector from './DeliverySelector';

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
  } = useCart();

  if (orderStatus) {
    const currentIndex = STEPS.findIndex((s) => s.key === orderStatus);
    return (
      <div className="fixed inset-0 z-50 flex items-center md:items-stretch justify-center md:justify-end bg-[#1E1E1E]/40 p-4 md:p-0">
        <div className="bg-white w-full max-w-[480px] flex flex-col items-center justify-center p-8 text-center rounded-2xl md:rounded-none md:rounded-l-2xl">
          <h2 className="text-3xl font-bold text-[#1E1E1E] mb-2">
            {statusTitle[orderStatus]}
          </h2>
          <p className="text-[#8E8E93] text-[15px] mb-10">
            Gracias por elegir DidiBurger.
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
                          ? 'bg-[#FF441F] text-white'
                          : 'bg-[#F3F4F6] text-[#8E8E93]'
                      }`}
                    >
                      <Icon size={20} weight="fill" />
                    </div>
                    <span
                      className={`text-xs font-semibold ${
                        done || active ? 'text-[#1E1E1E]' : 'text-[#8E8E93]'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-[2px] -translate-y-3 transition-colors ${
                        i < currentIndex ? 'bg-[#FF441F]' : 'bg-[#F3F4F6]'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          <div
            className="bg-[#1E1E1E] text-white px-8 py-3 rounded-full font-bold cursor-pointer transition-transform active:scale-[0.98]"
            onClick={resetOrder}
            onKeyDown={handleKeyDown(resetOrder)}
            role="button"
            tabIndex={0}
          >
            Volver al inicio
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-stretch justify-center md:justify-end bg-[#1E1E1E]/40 md:p-0"
      role="dialog"
      aria-modal="true"
      aria-label="Tu carrito"
    >
      <div className="bg-white w-full h-screen h-[100dvh] md:h-full max-w-[480px] flex flex-col md:rounded-none md:rounded-l-2xl overflow-hidden md:max-h-full relative animate-slide-up md:animate-none">
        <div className="flex items-center px-6 pb-4 pt-[max(1rem,env(safe-area-inset-top))] shrink-0">
          <div
            className="w-10 h-10 bg-[#F3F4F6] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#ECECEE] transition-colors"
            onClick={onClose}
            onKeyDown={handleKeyDown(onClose)}
            role="button"
            tabIndex={0}
            aria-label="Cerrar carrito"
          >
            <X size={20} weight="bold" color="#1E1E1E" />
          </div>
          <h2 className="flex-1 text-center text-lg font-bold text-[#1E1E1E] pr-10">
            Tu Carrito
          </h2>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto">
          {cartItems.length > 0 && (
            <div className="px-6 pb-2 pt-2 shrink-0 flex flex-col gap-4">
              <div className="bg-[#F3F4F6] rounded-2xl p-4 mb-4 w-full">
                <DeliverySelector />
              </div>
            </div>
          )}

          <div className="p-6">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-[#8E8E93] py-20">
              <p>No tienes productos en tu carrito.</p>
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
                        <h3 className="font-semibold text-[#1E1E1E] text-[15px] leading-tight">
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
                        className="text-[#8E8E93] hover:text-[#FF441F] cursor-pointer shrink-0 transition-colors"
                        onClick={() => removeFromCart(item.id)}
                        onKeyDown={handleKeyDown(() => removeFromCart(item.id))}
                        role="button"
                        tabIndex={0}
                        aria-label={`Eliminar ${item.name}`}
                      >
                        <Trash size={20} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-[#1E1E1E]">
                        ${(item.price * item.quantity).toFixed(2)} <span className="text-[11px] font-semibold text-[#8E8E93]">MXN</span>
                      </span>
                      <div className="flex items-center gap-3 bg-[#F3F4F6] px-2 py-1 rounded-full">
                        <div
                          className="cursor-pointer p-1 hover:text-[#FF441F] transition-colors"
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
                          className="cursor-pointer p-1 hover:text-[#FF441F] transition-colors"
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

        {cartItems.length > 0 && (
          <div className="p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] bg-white shrink-0">
            <div className="flex flex-col gap-2 mb-4 text-[#8E8E93] text-[15px]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-[#1E1E1E]">${getCartTotal().toFixed(2)}</span>
              </div>
              {deliveryMode === 'delivery' && (
                <div className="flex justify-between">
                  <span>Envío</span>
                  <span className="text-[#1E1E1E]">$25.00</span>
                </div>
              )}
            </div>
            <div className="flex justify-between mb-6 text-[#1E1E1E] items-end">
              <span className="font-semibold text-lg">Total</span>
              <span className="font-bold text-2xl">${(getCartTotal() + (deliveryMode === 'delivery' ? 25 : 0)).toFixed(2)} <span className="text-[14px] font-semibold text-[#8E8E93]">MXN</span></span>
            </div>
            <div
              className="w-full bg-[#FF441F] text-white py-4 rounded-full flex justify-center font-bold cursor-pointer transition-transform active:scale-[0.98]"
              onClick={placeOrder}
              onKeyDown={handleKeyDown(placeOrder)}
              role="button"
              tabIndex={0}
              aria-label={`Confirmar pedido, total ${(getCartTotal() + (deliveryMode === 'delivery' ? 25 : 0)).toFixed(2)} MXN`}
            >
              Confirmar Pedido
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPanel;
