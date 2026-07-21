import React, { useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { User, Trash } from '@phosphor-icons/react';

const AdminUsers = () => {
  const { users, deleteUser } = useContext(AdminContext);

  return (
    <div className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto">
      <div className="mb-6 md:mb-8 mt-2 md:mt-0 px-2 md:px-0">
        <h1 className="text-2xl font-bold text-[#1E1E1E]">Usuarios Registrados</h1>
        <p className="text-[#8E8E93] text-[15px] mt-1">Directorio de clientes de la plataforma.</p>
      </div>

      <div className="bg-white rounded-2xl flex-1 p-2 md:p-4 mx-2 md:mx-0">
        <div className="flex flex-col gap-2">
          {users.map(user => (
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
              <div className="flex flex-col md:items-end mt-4 md:mt-0 border-t md:border-t-0 border-white pt-3 md:pt-0">
                <span className="text-[12px] text-[#8E8E93] font-medium mb-2 md:mb-0">Registrado: {user.registered}</span>
                <button
                  onClick={() => {
                    if(confirm(`¿Estás seguro de eliminar a ${user.name}?`)) deleteUser(user.id);
                  }}
                  className="hidden md:flex p-2.5 bg-white text-[#FF3B30] rounded-full hover:bg-[#FFF0F0] active:scale-[0.95] transition-all outline-none"
                >
                  <Trash size={20} weight="fill" />
                </button>
              </div>
            </div>
          ))}
          {users.length === 0 && (
            <div className="p-10 text-center text-[#8E8E93]">No hay usuarios registrados.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
