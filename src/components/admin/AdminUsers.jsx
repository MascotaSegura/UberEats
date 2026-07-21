import React, { useContext, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { User, Trash, MagnifyingGlass } from '@phosphor-icons/react';

const AdminUsers = () => {
  const { users, deleteUser } = useContext(AdminContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.phone.includes(searchTerm)
  );

  const handleDeleteClick = (id) => {
    setConfirmDeleteId(id);
  };

  const handleConfirmDelete = () => {
    if (confirmDeleteId) {
      deleteUser(confirmDeleteId);
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto pb-24 md:pb-8">
      <div className="mb-6 md:mb-8 mt-2 md:mt-0 px-2 md:px-0 flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1E1E1E]">Usuarios Registrados</h1>
          <p className="text-[#8E8E93] text-[15px] mt-1">Directorio de clientes de la plataforma.</p>
        </div>

        <div className="relative">
          <MagnifyingGlass size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8E8E93]" weight="bold" />
          <input
            type="text"
            placeholder="Buscar por nombre, correo o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white rounded-full h-12 pl-11 pr-4 text-[15px] text-[#1E1E1E] outline-none border border-transparent focus:border-[#E5E5EA] transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl flex-1 p-2 md:p-4 mx-2 md:mx-0">
        <div className="flex flex-col gap-2">
          {filteredUsers.map(user => (
            <div key={user.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-[#F3F4F6] rounded-2xl hover:bg-[#ECECEE] transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 text-[#1E1E1E]">
                  <User size={24} weight="fill" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-[#1E1E1E] text-[16px]">{user.name}</span>
                  <span className="text-[13px] text-[#8E8E93] mt-0.5">{user.email} • {user.phone}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-4 md:mt-0 pt-3 md:pt-0 justify-end">
                <span className="text-[12px] text-[#8E8E93] font-medium">Registrado: {user.registered}</span>
                <button
                  onClick={() => handleDeleteClick(user.id)}
                  className="hidden md:flex p-2.5 bg-white text-[#FF3B30] rounded-full hover:bg-[#FFF0F0] active:scale-[0.95] transition-all outline-none"
                >
                  <Trash size={20} weight="fill" />
                </button>
              </div>
            </div>
          ))}
          {filteredUsers.length === 0 && (
            <div className="p-10 text-center text-[#8E8E93]">No hay usuarios que coincidan con la búsqueda.</div>
          )}
        </div>
      </div>

      {/* Custom Delete Confirmation Modal (no native confirm()) */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#1E1E1E]/40 p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 flex flex-col gap-4 animate-fade-in">
            <h3 className="text-[18px] font-bold text-[#1E1E1E]">¿Eliminar usuario?</h3>
            <p className="text-[15px] text-[#8E8E93]">
              Esta acción eliminará a <strong className="text-[#1E1E1E]">{users.find(u => u.id === confirmDeleteId)?.name}</strong> del directorio. No se puede deshacer.
            </p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 py-3 rounded-full bg-[#F3F4F6] text-[#1E1E1E] font-bold text-[15px] hover:bg-[#ECECEE] active:scale-[0.98] transition-all outline-none"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-3 rounded-full bg-[#FF3B30] text-white font-bold text-[15px] hover:bg-[#E0342A] active:scale-[0.98] transition-all outline-none"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
