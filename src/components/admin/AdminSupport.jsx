import React, { useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { ChatCircle, Check, CaretDown, Trash } from '@phosphor-icons/react';

const AdminSupport = () => {
  const { tickets, updateTicketStatus, deleteTicket } = useContext(AdminContext);

  const statuses = ['Abierto', 'En progreso', 'Resuelto'];

  const cycleStatus = (id, currentStatus) => {
    const currentIndex = statuses.indexOf(currentStatus);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    updateTicketStatus(id, nextStatus);
  };

  const formatDate = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto pb-24 md:pb-8">
      <div className="mb-6 md:mb-8 mt-2 md:mt-0 px-2 md:px-0">
        <h1 className="text-2xl font-bold text-[#1E1E1E]">Servicio al Cliente</h1>
        <p className="text-[#8E8E93] text-[15px] mt-1">Gestiona los tickets de soporte y consultas.</p>
      </div>

      <div className="bg-white rounded-2xl flex-1 p-2 md:p-4 mx-2 md:mx-0">
        <div className="flex flex-col gap-2">
          {tickets.map(ticket => (
            <div key={ticket.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-[#F3F4F6] rounded-2xl hover:bg-[#ECECEE] transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0 text-[#1E1E1E]">
                  <ChatCircle size={24} weight="fill" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-[#1E1E1E] text-[16px]">{ticket.subject}</span>
                  <span className="text-[13px] text-[#8E8E93] mt-0.5">
                    De: {ticket.user} • {formatDate(ticket.date)}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-4 md:mt-0 justify-end">
                <button
                  onClick={() => cycleStatus(ticket.id, ticket.status)}
                  className={`px-4 py-2 rounded-full font-bold text-[13px] flex items-center gap-1.5 transition-all outline-none active:scale-95 ${
                    ticket.status === 'Resuelto' 
                      ? 'bg-[#E5F7ED] text-[#06C167]' 
                      : ticket.status === 'En progreso' 
                        ? 'bg-[#FFF4E5] text-[#FF9500]'
                        : 'bg-white text-[#1E1E1E] hover:bg-[#E5E5E7]'
                  }`}
                >
                  {ticket.status === 'Resuelto' && <Check size={16} weight="bold" />}
                  {ticket.status}
                  {ticket.status !== 'Resuelto' && <CaretDown size={14} weight="bold" />}
                </button>
                <button
                  onClick={() => deleteTicket(ticket.id)}
                  className="p-2.5 bg-white text-[#FF3B30] rounded-full hover:bg-[#FFF0F0] active:scale-[0.95] transition-all outline-none ml-2 hidden md:flex"
                  title="Eliminar ticket"
                >
                  <Trash size={20} weight="fill" />
                </button>
              </div>
            </div>
          ))}
          {tickets.length === 0 && (
            <div className="p-10 text-center text-[#8E8E93]">No hay tickets de soporte activos.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSupport;
