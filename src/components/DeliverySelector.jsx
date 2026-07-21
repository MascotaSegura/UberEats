import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { CaretDown, Check, X, PencilSimple, MapPin, Storefront, Moped } from '@phosphor-icons/react';
import { useCart } from '../context/useCart';
import AddressForm from './AddressForm';
import { useModalHistory } from '../hooks/useModalHistory';


const handleKeyDown = (fn) => (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    fn();
  }
};

export const ModalDropdown = ({ isOpen, onClose, title, items, selectedId, onSelect, showAddAction, onAddAction, onEditAction }) => {
  useModalHistory(isOpen, onClose);
  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-[#1E1E1E]/40 md:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full h-auto max-h-[80vh] md:max-w-[400px] flex flex-col rounded-t-2xl md:rounded-2xl overflow-hidden relative animate-slide-up md:animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-4 bg-white shrink-0 relative">
          <h2 className="flex-1 text-center font-semibold text-lg text-[#1E1E1E]">
            {title}
          </h2>
          <div
            className="absolute right-4 w-9 h-9 bg-[#F3F4F6] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#ECECEE] active:bg-[#ECECEE] active:scale-[0.95] outline-none focus-visible:bg-[#ECECEE] transition-all shrink-0"
            onClick={onClose}
            onKeyDown={handleKeyDown(onClose)}
            role="button"
            tabIndex={0}
            aria-label="Cerrar"
          >
            <X size={18} weight="bold" color="#1E1E1E" />
          </div>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto p-4 pb-[max(1rem,env(safe-area-inset-bottom))] flex flex-col gap-2">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[200px] p-6 text-center bg-[#F3F4F6] rounded-2xl">
               <span className="text-[15px] font-semibold text-[#1E1E1E] mb-2">Lista vacía</span>
               <span className="text-[13px] text-[#8E8E93] mb-6">
                 {showAddAction ? 'Agrega tu primera dirección para poder recibir tu pedido.' : 'No hay sucursales disponibles en este momento.'}
               </span>
               {showAddAction && (
                 <button
                   className="bg-[#06C167] text-white px-6 py-3 rounded-full font-medium text-[14px] outline-none focus-visible:opacity-80 cursor-pointer hover:bg-[#05a055] active:bg-[#05a055] active:scale-[0.98] transition-all"
                   onClick={(e) => { e.stopPropagation(); onClose(); onAddAction(); }}
                 >
                   Agregar Dirección
                 </button>
               )}
            </div>
          ) : (
            items.map((item) => {
              const isSelected = item.id === selectedId;
              return (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer outline-none focus-visible:opacity-80 transition-all ${
                    isSelected ? 'bg-[#1E1E1E] text-white' : 'bg-[#F3F4F6] text-[#1E1E1E] hover:bg-[#ECECEE] active:bg-[#ECECEE]'
                  }`}
                  onClick={() => {
                    onSelect(item);
                    onClose();
                  }}
                  onKeyDown={handleKeyDown(() => {
                    onSelect(item);
                    onClose();
                  })}
                  role="button"
                  tabIndex={0}
                >
                  <div className="flex items-center gap-3">
                    {item.icon && <span className="shrink-0">{item.icon}</span>}
                    <div className="flex flex-col">
                      <span className="font-medium">{item.label}</span>
                      {item.detail && (
                        <span className={`text-[13px] ${isSelected ? 'text-[#ECECEE]' : 'text-[#8E8E93]'}`}>
                          {item.detail}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {onEditAction && (
                      <div
                        className={`p-2 rounded-full cursor-pointer outline-none focus-visible:bg-[#D9D9D9] active:scale-[0.95] transition-all ${isSelected ? 'hover:bg-[#2C2C2E] active:bg-[#2C2C2E] text-white' : 'hover:bg-[#E5E5E7] active:bg-[#E5E5E7] text-[#1E1E1E]'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditAction(item);
                        }}
                        role="button"
                        tabIndex={0}
                      >
                        <PencilSimple size={18} weight="bold" />
                      </div>
                    )}
                    {isSelected && <Check size={20} weight="bold" />}
                  </div>
                </div>
              );
            })
          )}
        </div>
        {showAddAction && items.length > 0 && (
          <div className="p-4 pb-[max(1rem,env(safe-area-inset-bottom))] bg-white shrink-0">
            <div
              className="w-full bg-[#06C167] text-white py-3 rounded-full flex items-center justify-center font-medium cursor-pointer transition-all hover:bg-[#05a055] active:bg-[#05a055] active:scale-[0.98] outline-none focus-visible:opacity-80"
              onClick={() => { onClose(); onAddAction(); }}
              role="button"
              tabIndex={0}
            >
              Agregar nueva dirección
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export const DeliveryLocation = ({ setActiveModal, variant = 'header' }) => {
  const { deliveryMode, deliveryAddress, pickupBranch, addresses } = useCart();
  const currentLocationLabel = deliveryMode === 'delivery' 
    ? deliveryAddress?.label || 'Agregar dirección' 
    : pickupBranch?.label || 'Sucursal';

  const handleClick = () => {
    if (deliveryMode === 'delivery' && (!addresses || addresses.length === 0)) {
      setActiveModal('add-address');
    } else {
      setActiveModal('location');
    }
  };

  return (
    <div
      className="flex flex-row items-center cursor-pointer outline-none focus-visible:bg-[#ECECEE] rounded-full hover:opacity-80 active:opacity-80 transition-opacity flex-1 min-w-0 h-9"
      onClick={handleClick}
      onKeyDown={handleKeyDown(handleClick)}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-center gap-1.5 w-full">
        {deliveryMode === 'delivery' ? (
          <MapPin size={20} weight="fill" color="#1E1E1E" className="shrink-0" />
        ) : (
          <Storefront size={20} weight="fill" color="#1E1E1E" className="shrink-0" />
        )}
        <div className="flex flex-col min-w-0 flex-1 justify-center">
          {variant !== 'compact' && (
            <span className={`text-[11px] font-medium text-[#8E8E93] leading-none mb-0.5 ${variant === 'header' ? 'md:hidden' : ''}`}>
              {deliveryMode === 'delivery' ? 'Entregar ahora' : 'Recoger ahora'}
            </span>
          )}
          <span className="font-medium text-[14px] text-[#1E1E1E] truncate leading-none">
            {currentLocationLabel}
          </span>
        </div>
        <CaretDown size={16} weight="bold" color="#1E1E1E" className="shrink-0 ml-0.5" />
      </div>
    </div>
  );
};

export const DeliveryModeMobile = ({ setActiveModal, variant = 'header' }) => {
  const { deliveryMode } = useCart();
  const currentModeLabel = deliveryMode === 'delivery' ? 'A Domicilio' : 'Recoger';
  const bgClass = variant === 'header' ? 'bg-[#F3F4F6] hover:bg-[#ECECEE] active:bg-[#ECECEE]' : 'bg-white hover:bg-[#ECECEE] active:bg-[#ECECEE]';

  return (
    <div
      className={`flex items-center gap-1.5 px-2.5 h-9 rounded-full text-[13px] font-semibold cursor-pointer transition-colors text-[#1E1E1E] outline-none focus-visible:opacity-80 shrink-0 ${bgClass}`}
      onClick={() => setActiveModal('mode')}
      onKeyDown={handleKeyDown(() => setActiveModal('mode'))}
      role="button"
      tabIndex={0}
    >
      <span>{currentModeLabel}</span>
      <CaretDown size={14} weight="bold" />
    </div>
  );
};

export const DeliveryModeDesktop = ({ variant = 'header' }) => {
  const { deliveryMode, setDeliveryMode } = useCart();
  const containerBg = variant === 'header' ? 'bg-[#F3F4F6]' : 'bg-white';
  const inactiveHover = variant === 'header' ? 'hover:bg-white active:bg-white text-[#1E1E1E]' : 'hover:bg-[#ECECEE] active:bg-[#ECECEE] text-[#1E1E1E]';

  return (
    <div className={`flex items-center gap-1 rounded-full p-1 shrink-0 h-8 ${containerBg}`}>
      <button
        className={`flex items-center justify-center px-3 h-full rounded-full outline-none focus-visible:opacity-80 transition-all cursor-pointer ${
          deliveryMode === 'delivery'
            ? 'bg-[#1E1E1E] text-white'
            : `${inactiveHover}`
        }`}
        onClick={() => { setDeliveryMode('delivery'); }}
        type="button"
      >
        <span className="text-[14px] font-medium">A Domicilio</span>
      </button>
      <button
        className={`flex items-center justify-center px-3 h-full rounded-full outline-none focus-visible:opacity-80 transition-all cursor-pointer ${
          deliveryMode === 'pickup'
            ? 'bg-[#1E1E1E] text-white'
            : `${inactiveHover}`
        }`}
        onClick={() => { setDeliveryMode('pickup'); }}
        type="button"
      >
        <span className="text-[14px] font-medium">Recoger</span>
      </button>
    </div>
  );
};

export const DeliveryModals = ({ activeModal, setActiveModal, modes }) => {
  const {
    deliveryMode,
    setDeliveryMode,
    addresses,
    branches,
    deliveryAddress,
    setDeliveryAddress,
    pickupBranch,
    setPickupBranch,
  } = useCart();
  
  const [editingItem, setEditingItem] = useState(null);

  const handleSetEditing = (item) => {
    setEditingItem(item);
    setActiveModal('edit-address');
  };

  return (
    <>
      <ModalDropdown
        isOpen={activeModal === 'mode'}
        onClose={() => setActiveModal(null)}
        title="Tipo de Entrega"
        items={modes}
        selectedId={deliveryMode}
        onSelect={(item) => setDeliveryMode(item.id)}
      />

      <ModalDropdown
        isOpen={activeModal === 'location'}
        onClose={() => setActiveModal(null)}
        title={deliveryMode === 'delivery' ? 'Dirección de Entrega' : 'Sucursal de Recojo'}
        items={deliveryMode === 'delivery' ? addresses : branches}
        selectedId={deliveryMode === 'delivery' ? deliveryAddress?.id : pickupBranch?.id}
        onSelect={(item) => {
          if (deliveryMode === 'delivery') setDeliveryAddress(item);
          else setPickupBranch(item);
        }}
        showAddAction={deliveryMode === 'delivery'}
        onAddAction={() => setActiveModal('add-address')}
        onEditAction={deliveryMode === 'delivery' ? handleSetEditing : undefined}
      />
      {(activeModal === 'add-address' || activeModal === 'edit-address') && (
        <AddressForm 
          onClose={() => { setActiveModal('location'); setEditingItem(null); }} 
          initialData={activeModal === 'edit-address' ? editingItem : null}
        />
      )}
    </>
  );
};

export const useDeliveryModalState = () => {
  const [activeModal, setActiveModal] = useState(null);
  const modes = [
    { id: 'delivery', label: 'A Domicilio', icon: <Moped size={20} weight="fill" /> },
    { id: 'pickup', label: 'Recoger', icon: <Storefront size={20} weight="fill" /> },
  ];
  return { activeModal, setActiveModal, modes };
};

const DeliverySelector = ({ variant = 'cart' }) => {
  const { activeModal, setActiveModal, modes } = useDeliveryModalState();

  return (
    <>
      <div className="flex items-center shrink-0 gap-4 w-full justify-between">
        <div className="flex-1 min-w-0 mr-2">
          <DeliveryLocation setActiveModal={setActiveModal} variant={variant} />
        </div>
        
        <div className="md:hidden flex-shrink-0">
          <DeliveryModeMobile setActiveModal={setActiveModal} variant={variant} />
        </div>

        <div className="hidden md:flex flex-shrink-0">
          <DeliveryModeDesktop variant={variant} />
        </div>
      </div>

      <DeliveryModals activeModal={activeModal} setActiveModal={setActiveModal} modes={modes} />
    </>
  );
};

export default DeliverySelector;

