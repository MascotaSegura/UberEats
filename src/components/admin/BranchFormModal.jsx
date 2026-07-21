import React, { useState, useEffect, useContext } from 'react';
import { createPortal } from 'react-dom';
import { X } from '@phosphor-icons/react';
import { AdminContext } from '../../context/AdminContext';

const BranchFormModal = ({ isOpen, onClose, branch }) => {
  const { addBranch, updateBranch } = useContext(AdminContext);

  const [formData, setFormData] = useState({
    label: '',
    detail: '',
    address: '',
  });

  useEffect(() => {
    if (branch) {
      setFormData({
        label: branch.label || '',
        detail: branch.detail || '',
        address: branch.address || '',
      });
    } else {
      setFormData({ label: '', detail: '', address: '' });
    }
  }, [branch, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.label) return;
    
    if (branch) {
      updateBranch(branch.id, formData);
    } else {
      addBranch({ ...formData, isActive: true });
    }
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-[#1E1E1E]/40 md:p-4">
      <div 
        className="bg-white w-full h-auto max-h-[90vh] md:w-[500px] flex flex-col rounded-t-2xl md:rounded-2xl overflow-hidden relative animate-slide-up md:animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-6 py-4 bg-white shrink-0 relative pb-4 shadow-none">
          <h2 className="flex-1 text-center font-semibold text-lg text-[#1E1E1E]">
            {branch ? 'Editar Sucursal' : 'Nueva Sucursal'}
          </h2>
          <button
            onClick={onClose}
            className="absolute right-4 w-9 h-9 bg-[#F3F4F6] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#ECECEE] active:bg-[#ECECEE] active:scale-[0.95] outline-none transition-all text-[#1E1E1E]"
          >
            <X size={18} weight="bold" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <form id="branch-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#1E1E1E]">Nombre de la Sucursal</label>
              <input
                type="text"
                name="label"
                value={formData.label}
                onChange={handleChange}
                placeholder="Ej. Sucursal Sur"
                className="w-full bg-[#F3F4F6] rounded-2xl px-4 py-3 text-[15px] text-[#1E1E1E] outline-none focus:bg-[#ECECEE] transition-colors"
                required
                autoFocus
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#1E1E1E]">Tiempo Estimado de Entrega</label>
              <input
                type="text"
                name="detail"
                value={formData.detail}
                onChange={handleChange}
                placeholder="Ej. 15-20 min"
                className="w-full bg-[#F3F4F6] rounded-2xl px-4 py-3 text-[15px] text-[#1E1E1E] outline-none focus:bg-[#ECECEE] transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-[#1E1E1E]">Dirección Completa</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Ingresa la calle, número, colonia..."
                rows={3}
                className="w-full bg-[#F3F4F6] rounded-2xl px-4 py-3 text-[15px] text-[#1E1E1E] outline-none focus:bg-[#ECECEE] transition-colors resize-none"
              />
            </div>

          </form>
        </div>

        <div className="p-4 bg-white shrink-0 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-none">
          <button
            type="submit"
            form="branch-form"
            className="w-full bg-[#1E1E1E] text-white py-4 rounded-full font-bold text-[16px] hover:bg-[#2C2C2E] active:scale-[0.98] transition-all outline-none"
          >
            {branch ? 'Guardar Cambios' : 'Crear Sucursal'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default BranchFormModal;
