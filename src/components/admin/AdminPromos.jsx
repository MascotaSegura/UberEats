import React, { useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { Plus, Trash } from '@phosphor-icons/react';

const AdminPromos = () => {
  const { promos, addPromo, deletePromo } = useContext(AdminContext);

  const handleAdd = () => {
    const code = prompt('Ingresa el código del cupón (ej. DESCUENTO10):');
    if (!code) return;
    const type = confirm('¿Es un porcentaje de descuento? (Aceptar = Porcentaje, Cancelar = Monto fijo)') ? 'percentage' : 'fixed';
    const amountStr = prompt(`Ingresa el ${type === 'percentage' ? 'porcentaje (ej. 0.15 para 15%)' : 'monto fijo (ej. 50)'}:`);
    const amount = parseFloat(amountStr);
    
    if (amount) {
      addPromo({ code: code.toUpperCase(), type, discount: amount });
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto">
      <div className="mb-6 md:mb-8 mt-2 md:mt-0 px-2 md:px-0 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-[#1E1E1E]">Promociones</h1>
          <p className="text-[#8E8E93] text-[15px] mt-1">Gestiona los cupones de descuento.</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-[#06C167] text-white px-5 py-2.5 rounded-full font-medium text-[15px] hover:bg-[#05a055] active:scale-[0.98] flex items-center gap-2 outline-none transition-all"
        >
          <Plus size={18} weight="bold" />
          <span className="hidden md:inline">Nuevo Cupón</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl flex-1 p-2 md:p-4 mx-2 md:mx-0">
        <div className="flex flex-col gap-2">
          {promos.map(promo => (
            <div key={promo.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-[#F3F4F6] rounded-2xl hover:bg-[#ECECEE] transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0 text-[#1E1E1E] font-bold">
                  %
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-[#1E1E1E] text-[16px]">{promo.code}</span>
                  <span className="text-[13px] text-[#8E8E93] mt-0.5">
                    {promo.type === 'percentage' ? `${promo.discount * 100}% de descuento` : `$${promo.discount} de descuento`}
                  </span>
                </div>
              </div>
              <div className="flex items-center mt-4 md:mt-0 justify-end">
                <button
                  onClick={() => deletePromo(promo.id)}
                  className="p-2.5 bg-white text-[#FF3B30] rounded-full hover:bg-[#FFF0F0] active:scale-[0.95] transition-all outline-none"
                >
                  <Trash size={20} weight="fill" />
                </button>
              </div>
            </div>
          ))}
          {promos.length === 0 && (
            <div className="p-10 text-center text-[#8E8E93]">No hay promociones activas.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPromos;
