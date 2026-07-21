import React, { useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { Storefront, Plus, Trash, Check, X } from '@phosphor-icons/react';

const AdminBranches = () => {
  const { branches, addBranch, deleteBranch, updateBranch } = useContext(AdminContext);

  const handleAdd = () => {
    const label = prompt('Nombre de la sucursal (ej. Sucursal Sur):');
    if (!label) return;
    const detail = prompt('Tiempo estimado (ej. 15-20 min):');
    if (detail) {
      addBranch({ label, detail, isActive: true });
    }
  };

  const toggleStatus = (id, isActive) => {
    updateBranch(id, { isActive: !isActive });
  };

  return (
    <div className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto">
      <div className="mb-6 md:mb-8 mt-2 md:mt-0 px-2 md:px-0 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-[#1E1E1E]">Sucursales</h1>
          <p className="text-[#8E8E93] text-[15px] mt-1">Gestiona las sucursales disponibles.</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-[#06C167] text-white px-5 py-2.5 rounded-full font-medium text-[15px] hover:bg-[#05a055] active:scale-[0.98] flex items-center gap-2 outline-none transition-all"
        >
          <Plus size={18} weight="bold" />
          <span className="hidden md:inline">Nueva Sucursal</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl flex-1 p-2 md:p-4 mx-2 md:mx-0">
        <div className="flex flex-col gap-2">
          {branches.map(branch => (
            <div key={branch.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-[#F3F4F6] rounded-2xl hover:bg-[#ECECEE] transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0 text-[#1E1E1E]">
                  <Storefront size={24} weight="fill" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-[#1E1E1E] text-[16px]">{branch.label}</span>
                  <span className="text-[13px] text-[#8E8E93] mt-0.5">{branch.detail}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 md:mt-0 justify-end">
                <button
                  onClick={() => toggleStatus(branch.id, branch.isActive)}
                  className={`px-4 py-2 rounded-full font-bold text-[13px] flex items-center gap-1.5 transition-all outline-none active:scale-95 ${
                    branch.isActive ? 'bg-[#E5F7ED] text-[#06C167]' : 'bg-[#FFF0F0] text-[#FF3B30]'
                  }`}
                >
                  {branch.isActive ? <Check size={16} weight="bold" /> : <X size={16} weight="bold" />}
                  {branch.isActive ? 'Activa' : 'Inactiva'}
                </button>
                <button
                  onClick={() => deleteBranch(branch.id)}
                  className="p-2.5 bg-white text-[#FF3B30] rounded-full hover:bg-[#FFF0F0] active:scale-[0.95] transition-all outline-none ml-2"
                >
                  <Trash size={20} weight="fill" />
                </button>
              </div>
            </div>
          ))}
          {branches.length === 0 && (
            <div className="p-10 text-center text-[#8E8E93]">No hay sucursales registradas.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBranches;
