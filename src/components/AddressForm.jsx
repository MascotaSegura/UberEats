import React, { useState } from 'react';
import { X, MapPin } from '@phosphor-icons/react';
import { useCart } from '../context/useCart';

const AddressForm = ({ onClose, initialData }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  
  // Backward compatibility for old addresses that only have "detail"
  const defaultStreet = initialData?.street || initialData?.detail || '';
  const [selectedPlace, setSelectedPlace] = useState(initialData ? { place_name: defaultStreet } : null);
  
  const [label, setLabel] = useState(initialData?.label || '');
  const [street, setStreet] = useState(defaultStreet);
  const [interior, setInterior] = useState(initialData?.interior || '');
  const [references, setReferences] = useState(initialData?.references || '');
  const [instructions, setInstructions] = useState(initialData?.instructions || '');
  
  const { addAddress, updateAddress, removeAddress } = useCart();

  const handleSearch = async (val) => {
    setQuery(val);
    if (selectedPlace) setSelectedPlace(null);
    if (!val || val.trim().length < 3) {
      setResults([]);
      return;
    }
    try {
      const key = import.meta.env.VITE_MAPTILER_KEY;
      if (!key) {
         console.warn('MapTiler key not set in .env');
      }
      const res = await fetch(`https://api.maptiler.com/geocoding/${encodeURIComponent(val)}.json?key=${key}&limit=5`);
      const data = await res.json();
      setResults(data.features || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = () => {
    if (!label.trim() || !street.trim()) return;
    
    // Computed detail for UI backwards compatibility (CartPanel, DeliverySelector)
    let computedDetail = street.trim();
    if (interior.trim()) computedDetail += `, Int/Depto: ${interior.trim()}`;
    
    const addressData = {
      label: label.trim(),
      street: street.trim(),
      interior: interior.trim(),
      references: references.trim(),
      instructions: instructions.trim(),
      detail: computedDetail,
    };
    
    if (initialData) {
      updateAddress(initialData.id, addressData);
    } else {
      addAddress(addressData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end md:items-center justify-center bg-[#1E1E1E]/40 md:p-4">
      <div className="bg-white w-full h-[95vh] md:h-auto max-h-[95vh] md:max-w-[480px] flex flex-col rounded-t-2xl md:rounded-2xl overflow-hidden relative animate-slide-up md:animate-fade-in">
        <div className="flex items-center px-4 py-3 bg-[#F3F4F6] shrink-0">
          <div
            className="w-9 h-9 bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-[#ECECEE] transition-colors shrink-0"
            onClick={onClose}
            role="button"
            tabIndex={0}
          >
            <X size={18} weight="bold" color="#1E1E1E" />
          </div>
          <h2 className="flex-1 text-center font-bold text-[#1E1E1E] pr-9">
            {initialData ? 'Editar Dirección' : 'Nueva Dirección'}
          </h2>
        </div>
        
        <div className="flex-1 min-h-0 overflow-y-auto p-6 flex flex-col gap-6">
          {!selectedPlace ? (
            <div>
              <label className="text-[14px] font-bold text-[#1E1E1E] mb-2 block">Buscar dirección</label>
              <div className="bg-[#F3F4F6] rounded-full px-4 py-3 flex items-center focus-within:ring-2 focus-within:ring-[#FF441F] transition-shadow">
                <MapPin size={20} color="#8E8E93" className="shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Ej. Av. Reforma 123"
                  className="flex-1 ml-2 text-[15px] outline-none bg-transparent text-[#1E1E1E] placeholder:text-[#8E8E93]"
                />
              </div>
              
              {results.length > 0 && (
                <div className="mt-4 flex flex-col gap-2">
                  {results.map((feature) => (
                    <div 
                      key={feature.id}
                      className="p-4 bg-[#F3F4F6] hover:bg-[#ECECEE] cursor-pointer rounded-2xl transition-colors"
                      onClick={() => {
                        setSelectedPlace(feature);
                        setStreet(feature.place_name);
                      }}
                    >
                      <span className="font-semibold text-[#1E1E1E] block text-[15px]">{feature.text}</span>
                      <span className="text-[#8E8E93] text-[13px]">{feature.place_name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-5 animate-fade-in">
              <div>
                <label className="text-[14px] font-bold text-[#1E1E1E] mb-2 block">Nombre de la dirección</label>
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="Ej. Mi Casa, Trabajo"
                  className="w-full bg-[#F3F4F6] rounded-2xl px-4 py-3 text-[15px] outline-none text-[#1E1E1E] placeholder:text-[#8E8E93] focus:ring-2 focus:ring-[#FF441F]"
                />
              </div>
              
              <div className="flex flex-col gap-5 md:flex-row md:gap-4">
                <div className="flex-1">
                  <label className="text-[14px] font-bold text-[#1E1E1E] mb-2 block">Calle y número exterior</label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Ej. Av. Reforma 123"
                    className="w-full bg-[#F3F4F6] rounded-2xl px-4 py-3 text-[15px] outline-none text-[#1E1E1E] placeholder:text-[#8E8E93] focus:ring-2 focus:ring-[#FF441F]"
                  />
                </div>
                <div className="md:w-32">
                  <label className="text-[14px] font-bold text-[#1E1E1E] mb-2 block">Int / Depto</label>
                  <input
                    type="text"
                    value={interior}
                    onChange={(e) => setInterior(e.target.value)}
                    placeholder="Opcional"
                    className="w-full bg-[#F3F4F6] rounded-2xl px-4 py-3 text-[15px] outline-none text-[#1E1E1E] placeholder:text-[#8E8E93] focus:ring-2 focus:ring-[#FF441F]"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-[14px] font-bold text-[#1E1E1E] mb-2 block">Referencias visuales (Opcional)</label>
                <textarea
                  value={references}
                  onChange={(e) => setReferences(e.target.value)}
                  placeholder="Ej. Casa de dos pisos verde con portón negro..."
                  rows={2}
                  className="w-full bg-[#F3F4F6] rounded-2xl px-4 py-3 text-[15px] outline-none text-[#1E1E1E] placeholder:text-[#8E8E93] focus:ring-2 focus:ring-[#FF441F] resize-none"
                />
              </div>

              <div>
                <label className="text-[14px] font-bold text-[#1E1E1E] mb-2 block">Instrucciones de entrega (Opcional)</label>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Ej. Dejar en recepción, timbre descompuesto..."
                  rows={2}
                  className="w-full bg-[#F3F4F6] rounded-2xl px-4 py-3 text-[15px] outline-none text-[#1E1E1E] placeholder:text-[#8E8E93] focus:ring-2 focus:ring-[#FF441F] resize-none"
                />
              </div>
            </div>
          )}
        </div>

        {selectedPlace && (
          <div className="p-4 pb-[max(1rem,env(safe-area-inset-bottom))] bg-white shrink-0 flex flex-col gap-3">
            <div
              className={`w-full py-4 rounded-full flex items-center justify-center font-bold transition-transform ${
                label.trim() && street.trim() 
                  ? 'bg-[#1E1E1E] text-white cursor-pointer active:scale-[0.98]'
                  : 'bg-[#F3F4F6] text-[#8E8E93] cursor-not-allowed opacity-70'
              }`}
              onClick={handleSave}
              role="button"
            >
              Guardar Dirección
            </div>
            {initialData && (
               <div 
                 className="w-full py-3 flex items-center justify-center font-bold text-[#FF441F] cursor-pointer hover:bg-[#F3F4F6] rounded-full transition-colors"
                 onClick={() => { removeAddress(initialData.id); onClose(); }}
                 role="button"
               >
                 Eliminar Dirección
               </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressForm;
