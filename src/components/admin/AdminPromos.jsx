import React, { useContext, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { Plus, Trash, MagnifyingGlass, X } from '@phosphor-icons/react';

const PROMO_TYPES = ['percentage', 'fixed', 'shipping'];

const PromoFormModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({ code: '', type: 'percentage', discount: '' });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.code || !formData.discount) return;
    onSave({ ...formData, code: formData.code.toUpperCase(), discount: parseFloat(formData.discount) });
    setFormData({ code: '', type: 'percentage', discount: '' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end md:items-center justify-center bg-[#1E1E1E]/40 md:p-4">
      <div className="bg-white w-full h-auto md:w-[420px] flex flex-col rounded-t-2xl md:rounded-2xl overflow-hidden animate-slide-up md:animate-fade-in">
        <div className="flex items-center px-6 py-4 bg-white shrink-0 relative border-b border-[#F3F4F6]">
          <h2 className="flex-1 text-center font-semibold text-lg text-[#1E1E1E]">Nuevo Cupón</h2>
          <button
            onClick={onClose}
            className="absolute right-4 w-9 h-9 bg-[#F3F4F6] rounded-full flex items-center justify-center hover:bg-[#ECECEE] active:scale-95 outline-none text-[#1E1E1E] transition-all"
          >
            <X size={18} weight="bold" />
          </button>
        </div>

        <form id="promo-form" onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#1E1E1E]">Código del cupón</label>
            <input
              type="text"
              value={formData.code}
              onChange={e => setFormData(p => ({ ...p, code: e.target.value }))}
              placeholder="Ej. DESCUENTO15"
              className="w-full bg-[#F3F4F6] rounded-xl px-4 py-3 text-[15px] text-[#1E1E1E] outline-none focus:bg-[#ECECEE] transition-colors uppercase"
              required
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#1E1E1E]">Tipo de descuento</label>
            <div className="flex gap-2">
              {PROMO_TYPES.map(t => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setFormData(p => ({ ...p, type: t }))}
                  className={`flex-1 py-2.5 rounded-xl text-[13px] font-bold transition-all outline-none active:scale-95 ${
                    formData.type === t ? 'bg-[#1E1E1E] text-white' : 'bg-[#F3F4F6] text-[#1E1E1E] hover:bg-[#ECECEE]'
                  }`}
                >
                  {t === 'percentage' ? 'Porcentaje' : t === 'fixed' ? 'Monto Fijo' : 'Envío Gratis'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-[#1E1E1E]">
              {formData.type === 'percentage' ? 'Porcentaje (ej. 0.15 para 15%)' : 'Monto ($)'}
            </label>
            <input
              type="number"
              value={formData.discount}
              onChange={e => setFormData(p => ({ ...p, discount: e.target.value }))}
              placeholder={formData.type === 'percentage' ? '0.15' : '50.00'}
              step="0.01"
              className="w-full bg-[#F3F4F6] rounded-xl px-4 py-3 text-[15px] text-[#1E1E1E] outline-none focus:bg-[#ECECEE] transition-colors"
              required
            />
          </div>
        </form>

        <div className="p-4 bg-white border-t border-[#F3F4F6] pb-[max(1rem,env(safe-area-inset-bottom))]">
          <button
            type="submit"
            form="promo-form"
            className="w-full bg-[#1E1E1E] text-white py-4 rounded-full font-bold text-[16px] hover:bg-[#2C2C2E] active:scale-[0.98] transition-all outline-none"
          >
            Crear Cupón
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminPromos = () => {
  const { promos, addPromo, deletePromo } = useContext(AdminContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredPromos = promos.filter(p =>
    p.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto pb-24 md:pb-8">
      <div className="mb-6 md:mb-8 mt-2 md:mt-0 px-2 md:px-0 flex flex-col gap-4">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-[#1E1E1E]">Promociones</h1>
            <p className="text-[#8E8E93] text-[15px] mt-1">Gestiona los cupones de descuento.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#06C167] text-white px-5 py-2.5 rounded-full font-medium text-[15px] hover:bg-[#05a055] active:scale-[0.98] flex items-center gap-2 outline-none transition-all shrink-0"
          >
            <Plus size={18} weight="bold" />
            <span className="hidden md:inline">Nuevo Cupón</span>
          </button>
        </div>

        <div className="relative">
          <MagnifyingGlass size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8E8E93]" weight="bold" />
          <input
            type="text"
            placeholder="Buscar cupón por código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white rounded-full h-12 pl-11 pr-4 text-[15px] text-[#1E1E1E] outline-none border border-transparent focus:border-[#E5E5EA] shadow-sm transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl flex-1 p-2 md:p-4 mx-2 md:mx-0">
        <div className="flex flex-col gap-2">
          {filteredPromos.map(promo => (
            <div key={promo.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-[#F3F4F6] rounded-2xl hover:bg-[#ECECEE] transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0 text-[#1E1E1E] font-bold text-lg">
                  %
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-[#1E1E1E] text-[16px]">{promo.code}</span>
                  <span className="text-[13px] text-[#8E8E93] mt-0.5">
                    {promo.type === 'percentage' ? `${promo.discount * 100}% de descuento` :
                     promo.type === 'shipping' ? 'Envío gratuito' :
                     `$${promo.discount} de descuento`}
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
          {filteredPromos.length === 0 && (
            <div className="p-10 text-center text-[#8E8E93]">No hay promociones que coincidan.</div>
          )}
        </div>
      </div>

      <PromoFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(promo) => addPromo(promo)}
      />
    </div>
  );
};

export default AdminPromos;
