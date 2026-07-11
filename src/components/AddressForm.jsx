import React, { useState, useRef } from 'react';
import { X, MapPin, NavigationArrow } from '@phosphor-icons/react';
import { useCart } from '../context/useCart';

const handleKeyDown = (fn) => (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    fn();
  }
};

const AddressForm = ({ onClose, initialData }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLocating, setIsLocating] = useState(false);
  
  // Backward compatibility for old addresses that only have "detail"
  const defaultStreet = initialData?.street || initialData?.detail || '';
  const [selectedPlace, setSelectedPlace] = useState(initialData ? { place_name: defaultStreet } : null);
  
  const tags = ['Casa', 'Trabajo', 'Escuela', 'Otro'];
  const [selectedTag, setSelectedTag] = useState(() => {
    if (!initialData?.label) return 'Casa';
    if (tags.includes(initialData.label)) return initialData.label;
    return 'Otro';
  });
  const [customLabel, setCustomLabel] = useState(() => {
    if (initialData?.label && !tags.includes(initialData.label)) return initialData.label;
    return '';
  });

  const [street, setStreet] = useState(defaultStreet);
  const [interior, setInterior] = useState(initialData?.interior || '');
  const [references, setReferences] = useState(initialData?.references || '');
  const [instructions, setInstructions] = useState(initialData?.instructions || '');
  
  const { addAddress, updateAddress, removeAddress } = useCart();

  const debounceRef = useRef(null);

  const handleGeolocation = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const key = import.meta.env.VITE_MAPTILER_KEY;
          if (!key) {
             console.warn('MapTiler key not set in .env');
          }
          const res = await fetch(`https://api.maptiler.com/geocoding/${longitude},${latitude}.json?key=${key}`);
          const data = await res.json();
          if (data.features && data.features.length > 0) {
            const feature = data.features[0];
            setSelectedPlace(feature);
            setStreet(feature.place_name);
          }
        } catch (e) {
          console.error(e);
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error(error);
        setIsLocating(false);
      }
    );
  };

  const handleSearch = (val) => {
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    
    debounceRef.current = setTimeout(async () => {
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
    }, 400);
  };

  const handleSave = () => {
    const finalLabel = selectedTag === 'Otro' ? customLabel : selectedTag;
    if (!finalLabel.trim() || !street.trim()) return;
    
    // Computed detail for UI backwards compatibility (CartPanel, DeliverySelector)
    let computedDetail = street.trim();
    if (interior.trim()) computedDetail += `, Int/Depto: ${interior.trim()}`;
    
    const addressData = {
      label: finalLabel.trim(),
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

  const finalLabelForValidation = selectedTag === 'Otro' ? customLabel : selectedTag;
  const isSaveEnabled = finalLabelForValidation.trim() && street.trim();

  return (
    <div className="fixed inset-0 z-[70] flex items-end md:items-center justify-center bg-[#1E1E1E]/40 md:p-4">
      <div className="bg-white w-full h-auto max-h-[90dvh] md:max-h-[85vh] md:max-w-[480px] flex flex-col rounded-t-2xl md:rounded-2xl overflow-hidden relative animate-slide-up md:animate-fade-in">
        <div className="flex items-center px-4 py-3 bg-[#F3F4F6] shrink-0">
          <div
            className="w-9 h-9 bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-[#ECECEE] active:scale-[0.95] outline-none focus-visible:bg-[#ECECEE] transition-all shrink-0"
            onClick={onClose}
            onKeyDown={handleKeyDown(onClose)}
            role="button"
            tabIndex={0}
            aria-label="Cerrar"
          >
            <X size={18} weight="bold" color="#1E1E1E" />
          </div>
          <h2 className="flex-1 text-center font-semibold text-[#1E1E1E] pr-9">
            {initialData ? 'Editar Dirección' : 'Nueva Dirección'}
          </h2>
        </div>
        
        <div className="flex-1 min-h-0 overflow-y-auto p-6 flex flex-col gap-6">
          {!selectedPlace ? (
            <div>
              <label className="text-[14px] font-medium text-[#1E1E1E] mb-2 block">Ubicación</label>
              
              <div 
                className="w-full bg-[#1E1E1E] text-white rounded-full px-4 py-3 mb-4 flex items-center justify-center gap-2 cursor-pointer hover:bg-[#2C2C2E] active:scale-[0.98] transition-all font-medium text-[14px]"
                onClick={handleGeolocation}
                onKeyDown={handleKeyDown(handleGeolocation)}
                role="button"
                tabIndex={0}
              >
                <NavigationArrow size={18} weight="bold" className={isLocating ? 'animate-pulse' : ''} />
                {isLocating ? 'Obteniendo ubicación...' : 'Usar mi ubicación actual'}
              </div>

              <div className="text-center mb-4 mt-2">
                <span className="text-[#8E8E93] text-[12px] font-semibold tracking-wider">O BUSCAR MANUALMENTE</span>
              </div>

              {/* Diseño (Flat Design): Se usa focus-within:bg-[#ECECEE] en lugar de focus-within:ring para evitar contornos (líneas) y mantener el aspecto "flat". */}
              <div className="bg-[#F3F4F6] rounded-full px-4 py-3 flex items-center focus-within:bg-[#ECECEE] transition-colors">
                <MapPin size={20} weight="fill" color="#8E8E93" className="shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Ej. Av. Reforma 123"
                  className="flex-1 ml-2 text-[14px] outline-none bg-transparent text-[#1E1E1E] placeholder:text-[#8E8E93]"
                />
              </div>
              
              {results.length > 0 && (
                <div className="mt-4 flex flex-col gap-2">
                  {results.map((feature) => (
                    <div 
                      key={feature.id}
                      className="p-4 bg-[#F3F4F6] hover:bg-[#ECECEE] cursor-pointer rounded-2xl outline-none focus-visible:opacity-80 transition-all"
                      onClick={() => {
                        setSelectedPlace(feature);
                        setStreet(feature.place_name);
                      }}
                    >
                      <span className="font-medium text-[#1E1E1E] block text-[15px]">{feature.text}</span>
                      <span className="text-[#8E8E93] text-[13px]">{feature.place_name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-5 animate-fade-in">
              <div>
                <label className="text-[14px] font-medium text-[#1E1E1E] mb-3 block">Etiqueta de la dirección</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.map(tag => (
                    <div
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      onKeyDown={handleKeyDown(() => setSelectedTag(tag))}
                      role="button"
                      tabIndex={0}
                      className={`px-4 py-2.5 rounded-full text-[14px] font-medium cursor-pointer outline-none focus-visible:opacity-80 transition-colors active:scale-[0.95] ${
                        selectedTag === tag
                          ? 'bg-[#1E1E1E] text-white'
                          : 'bg-[#F3F4F6] text-[#1E1E1E] hover:bg-[#ECECEE]'
                      }`}
                    >
                      {tag}
                    </div>
                  ))}
                </div>
                {selectedTag === 'Otro' && (
                  <input
                    type="text"
                    value={customLabel}
                    onChange={(e) => setCustomLabel(e.target.value)}
                    placeholder="Ej. Gimnasio, Departamento..."
                    className="w-full bg-[#F3F4F6] rounded-2xl px-4 py-3 text-[14px] outline-none text-[#1E1E1E] placeholder:text-[#8E8E93] focus:bg-[#ECECEE] transition-colors animate-fade-in"
                  />
                )}
              </div>
              
              <div className="flex flex-col gap-5 md:flex-row md:gap-4">
                <div className="flex-1">
                  <label className="text-[14px] font-medium text-[#1E1E1E] mb-2 block">Calle y número exterior</label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Ej. Av. Reforma 123"
                    className="w-full bg-[#F3F4F6] rounded-2xl px-4 py-3 text-[14px] outline-none text-[#1E1E1E] placeholder:text-[#8E8E93] focus:bg-[#ECECEE] transition-colors"
                  />
                </div>
                <div className="md:w-32">
                  <label className="text-[14px] font-medium text-[#1E1E1E] mb-2 block">Int / Depto</label>
                  <input
                    type="text"
                    value={interior}
                    onChange={(e) => setInterior(e.target.value)}
                    placeholder="Opcional"
                    className="w-full bg-[#F3F4F6] rounded-2xl px-4 py-3 text-[14px] outline-none text-[#1E1E1E] placeholder:text-[#8E8E93] focus:bg-[#ECECEE] transition-colors"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-[14px] font-medium text-[#1E1E1E] mb-2 block">Referencias visuales (Opcional)</label>
                <textarea
                  value={references}
                  onChange={(e) => setReferences(e.target.value)}
                  placeholder="Ej. Casa de dos pisos verde con portón negro..."
                  rows={2}
                  className="w-full bg-[#F3F4F6] rounded-2xl px-4 py-3 text-[14px] outline-none text-[#1E1E1E] placeholder:text-[#8E8E93] focus:bg-[#ECECEE] resize-none transition-colors"
                />
              </div>
              
              <div>
                <label className="text-[14px] font-medium text-[#1E1E1E] mb-2 block">Instrucciones de entrega (Opcional)</label>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Ej. Dejar en recepción, timbre descompuesto..."
                  rows={2}
                  className="w-full bg-[#F3F4F6] rounded-2xl px-4 py-3 text-[14px] outline-none text-[#1E1E1E] placeholder:text-[#8E8E93] focus:bg-[#ECECEE] resize-none transition-colors"
                />
              </div>
            </div>
          )}
        </div>

        {selectedPlace && (
          <div className="p-4 pb-[max(1rem,env(safe-area-inset-bottom))] bg-white shrink-0 flex flex-col gap-3">
            <div
              className={`w-full py-4 rounded-full flex items-center justify-center font-medium transition-all outline-none focus-visible:opacity-90 ${
                isSaveEnabled 
                  ? 'bg-[#06C167] text-white cursor-pointer active:scale-[0.98]'
                  : 'bg-[#F3F4F6] text-[#8E8E93] cursor-not-allowed opacity-70'
              }`}
              onClick={handleSave}
              onKeyDown={handleKeyDown(handleSave)}
              role="button"
              tabIndex={0}
              aria-disabled={!isSaveEnabled}
            >
              Guardar Dirección
            </div>
            {initialData && (
               <div 
                 className="w-full py-3 flex items-center justify-center font-medium text-[#EF4444] cursor-pointer hover:bg-[#F3F4F6] rounded-full outline-none focus-visible:bg-[#F3F4F6] transition-all"
                 onClick={() => { removeAddress(initialData.id); onClose(); }}
                 onKeyDown={handleKeyDown(() => { removeAddress(initialData.id); onClose(); })}
                 role="button"
                 tabIndex={0}
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
