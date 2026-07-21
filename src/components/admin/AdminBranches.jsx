import React, { useState, useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { Storefront, Plus, Trash, Check, X, MagnifyingGlass, PencilSimple } from '@phosphor-icons/react';
import BranchFormModal from './BranchFormModal';

const AdminBranches = () => {
  const { branches, deleteBranch, updateBranch } = useContext(AdminContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingBranch, setEditingBranch] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleStatus = (id, isActive) => {
    updateBranch(id, { isActive: !isActive });
  };

  const handleEdit = (branch) => {
    setEditingBranch(branch);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingBranch(null);
    setIsModalOpen(true);
  };

  const filteredBranches = branches.filter(b => 
    b.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (b.address && b.address.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto pb-24 md:pb-8">
      <div className="mb-6 md:mb-8 mt-2 md:mt-0 px-2 md:px-0 flex flex-col gap-4">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-[#1E1E1E]">Sucursales</h1>
            <p className="text-[#8E8E93] text-[15px] mt-1">Gestiona las sucursales y ubicaciones.</p>
          </div>
          <button
            onClick={handleCreate}
            className="bg-[#06C167] text-white px-5 py-2.5 rounded-full font-medium text-[15px] hover:bg-[#05a055] active:scale-[0.98] flex items-center gap-2 outline-none transition-all shrink-0"
          >
            <Plus size={18} weight="bold" />
            <span className="hidden md:inline">Nueva Sucursal</span>
          </button>
        </div>

        <div className="relative">
          <MagnifyingGlass size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8E8E93]" weight="bold" />
          <input
            type="text"
            placeholder="Buscar sucursal por nombre o dirección..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white rounded-full h-12 pl-11 pr-4 text-[15px] text-[#1E1E1E] outline-none border border-transparent focus:border-[#E5E5EA] transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl flex-1 p-2 md:p-4 mx-2 md:mx-0">
        <div className="flex flex-col gap-2">
          {filteredBranches.map(branch => (
            <div key={branch.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-[#F3F4F6] rounded-2xl hover:bg-[#ECECEE] transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 text-[#1E1E1E]">
                  <Storefront size={24} weight="fill" />
                </div>
                <div className="flex flex-col pr-4">
                  <span className="font-bold text-[#1E1E1E] text-[16px]">{branch.label}</span>
                  <span className="text-[13px] text-[#8E8E93] mt-0.5">{branch.detail}</span>
                  {branch.address && (
                    <span className="text-[12px] text-[#1E1E1E] opacity-70 mt-1 line-clamp-1">{branch.address}</span>
                  )}
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
                  onClick={() => handleEdit(branch)}
                  className="p-2.5 bg-white text-[#1E1E1E] rounded-full hover:bg-[#E5E5E7] active:scale-[0.95] transition-all outline-none ml-2"
                  title="Editar sucursal"
                >
                  <PencilSimple size={20} weight="fill" />
                </button>
                <button
                  onClick={() => deleteBranch(branch.id)}
                  className="p-2.5 bg-white text-[#FF3B30] rounded-full hover:bg-[#FFF0F0] active:scale-[0.95] transition-all outline-none ml-2 hidden md:flex"
                  title="Eliminar sucursal"
                >
                  <Trash size={20} weight="fill" />
                </button>
              </div>
            </div>
          ))}
          {filteredBranches.length === 0 && (
            <div className="p-10 text-center text-[#8E8E93]">No hay sucursales que coincidan con la búsqueda.</div>
          )}
        </div>
      </div>

      <BranchFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        branch={editingBranch} 
      />
    </div>
  );
};

export default AdminBranches;
