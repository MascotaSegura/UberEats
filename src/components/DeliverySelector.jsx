import React, { useState } from 'react';
import { CaretDown, Check, X, PencilSimple, MapPin, Storefront, Moped } from '@phosphor-icons/react';
import { useCart } from '../context/useCart';
import AddressForm from './AddressForm';

const handleKeyDown = (fn) => (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    fn();
  }
};

export const ModalDropdown = ({ isOpen, onClose, title, items, selectedId, onSelect, showAddAction, onAddAction, onEditAction }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-[#1E1E1E]/40 md:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full h-auto max-h-[80vh] md:max-w-[400px] flex flex-col rounded-t-2xl md:rounded-2xl overflow-hidden relative animate-slide-up md:animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3 bg-[#F3F4F6] shrink-0">
          <div
            className="w-9 h-9 bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-[#ECECEE] active:scale-[0.95] outline-none focus-visible:ring-2 focus-visible:ring-[#FF441F] transition-all shrink-0"
            onClick={onClose}
            onKeyDown={handleKeyDown(onClose)}
            role="button"
            tabIndex={0}
            aria-label="Cerrar"
          >
            <X size={18} weight="bold" color="#1E1E1E" />
          </div>
          <h2 className="flex-1 text-center font-bold text-[#1E1E1E] pr-9">
            {title}
          </h2>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto p-4 pb-[max(1rem,env(safe-area-inset-bottom))] flex flex-col gap-2">
          {items.map((item) => {
            const isSelected = item.id === selectedId;
            return (
              <div
                key={item.id}
                className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#FF441F] transition-all ${
                  isSelected ? 'bg-[#1E1E1E] text-white' : 'bg-[#F3F4F6] text-[#1E1E1E] hover:bg-[#ECECEE]'
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
                <div className="flex flex-col">
                  <span className="font-bold">{item.label}</span>
                  {item.detail && (
                    <span className={`text-[13px] ${isSelected ? 'text-gray-300' : 'text-[#8E8E93]'}`}>
                      {item.detail}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {onEditAction && (
                    <div
                      className={`p-2 rounded-full cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#FF441F] active:scale-[0.95] transition-all ${isSelected ? 'hover:bg-white/20 text-white' : 'hover:bg-[#E5E5E7] text-[#1E1E1E]'}`}
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
          })}
        </div>
        {showAddAction && (
          <div className="p-4 pb-[max(1rem,env(safe-area-inset-bottom))] bg-white shrink-0">
            <div
              className="w-full bg-[#1E1E1E] text-white py-3 rounded-full flex items-center justify-center font-bold cursor-pointer transition-all active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-[#FF441F] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              onClick={() => { onClose(); onAddAction(); }}
              role="button"
              tabIndex={0}
            >
              Agregar nueva dirección
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const DeliverySelector = () => {
  const {
    deliveryMode,
    setDeliveryMode,
    addresses,
    branches,
    deliveryAddress,
    setDeliveryAddress,
    pickupBranch,
    setPickupBranch,
    removeAddress,
  } = useCart();

  const [activeModal, setActiveModal] = useState(null); // 'mode' | 'location' | 'add-address' | 'edit-address' | null
  const [editingItem, setEditingItem] = useState(null);

  const currentLocationLabel = deliveryMode === 'delivery' 
    ? deliveryAddress?.label || 'Dirección' 
    : pickupBranch?.label || 'Sucursal';

  return (
    <>
      <div className="flex items-center shrink-0 gap-4 w-full justify-between mb-2">
        <div
          className="flex flex-col cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#FF441F] rounded-xl px-1 -ml-1 hover:opacity-80 transition-opacity flex-1 min-w-0 mr-2"
          onClick={() => setActiveModal('location')}
          onKeyDown={handleKeyDown(() => setActiveModal('location'))}
          role="button"
          tabIndex={0}
        >
          <span className="text-[12px] font-semibold text-[#1E1E1E] leading-tight mb-0.5">
            {deliveryMode === 'delivery' ? 'Entregar ahora' : 'Recoger ahora'}
          </span>
          <div className="flex items-center gap-1.5 w-full">
            {deliveryMode === 'delivery' ? (
              <MapPin size={18} weight="fill" color="#FF441F" className="shrink-0" />
            ) : (
              <Storefront size={18} weight="fill" color="#FF441F" className="shrink-0" />
            )}
            <span className="text-[15px] font-bold text-[#1E1E1E] truncate leading-tight">
              {currentLocationLabel}
            </span>
            <CaretDown size={16} weight="bold" color="#1E1E1E" className="shrink-0" />
          </div>
        </div>
        
        <div className="flex items-center bg-[#F3F4F6] rounded-full p-1 shrink-0">
          <button
            className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#FF441F] transition-all cursor-pointer ${
              deliveryMode === 'delivery'
                ? 'bg-[#1E1E1E] text-white'
                : 'text-[#8E8E93] hover:text-[#1E1E1E]'
            }`}
            onClick={() => setDeliveryMode('delivery')}
            type="button"
          >
            <Moped size={16} weight="fill" />
            <span className="text-[13px] font-bold hidden sm:inline">Domicilio</span>
            <span className="text-[13px] font-bold sm:hidden">Dom.</span>
          </button>
          <button
            className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#FF441F] transition-all cursor-pointer ${
              deliveryMode === 'pickup'
                ? 'bg-[#1E1E1E] text-white'
                : 'text-[#8E8E93] hover:text-[#1E1E1E]'
            }`}
            onClick={() => setDeliveryMode('pickup')}
            type="button"
          >
            <Storefront size={16} weight="fill" />
            <span className="text-[13px] font-bold">Recoger</span>
          </button>
        </div>
      </div>

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
        onEditAction={deliveryMode === 'delivery' ? (item) => { setEditingItem(item); setActiveModal('edit-address'); } : undefined}
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

export default DeliverySelector;
