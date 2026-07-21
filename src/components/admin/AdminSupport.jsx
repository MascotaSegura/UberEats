import React, { useState, useContext, useRef, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { ChatCircle, Check, CaretDown, Trash, MagnifyingGlass, PaperPlaneRight, CaretLeft } from '@phosphor-icons/react';

const TICKET_STATUS_FILTERS = ['Todos', 'Abierto', 'En progreso', 'Resuelto'];

const AdminSupport = () => {
  const { tickets, updateTicketStatus, deleteTicket, addTicketMessage } = useContext(AdminContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [recentOnly, setRecentOnly] = useState(false);
  const [activeTicketId, setActiveTicketId] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const chatScrollRef = useRef(null);

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

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeTicketId) return;
    addTicketMessage(activeTicketId, messageInput.trim(), 'admin');
    setMessageInput('');
  };

  const filteredTickets = tickets.filter(t => {
    const matchesSearch =
      t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Todos' || t.status === statusFilter;
    const matchesRecent = !recentOnly || (Date.now() - new Date(t.date).getTime() < 86400000);
    return matchesSearch && matchesStatus && matchesRecent;
  });

  const activeTicket = tickets.find(t => t.id === activeTicketId);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [activeTicket?.messages]);

  if (activeTicket) {
    return (
      <div className="flex-1 flex flex-col h-full bg-[#F3F4F6] relative z-10 animate-fade-in pb-24 md:pb-0">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 bg-white shrink-0 shadow-none pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTicketId(null)}
              className="w-10 h-10 bg-[#F3F4F6] rounded-full flex items-center justify-center text-[#1E1E1E] hover:bg-[#ECECEE] transition-all outline-none"
            >
              <CaretLeft size={20} weight="bold" />
            </button>
            <div className="flex flex-col">
              <span className="font-bold text-[#1E1E1E] text-[16px]">{activeTicket.user}</span>
              <span className="text-[13px] text-[#8E8E93]">{activeTicket.subject}</span>
            </div>
          </div>
          <button
            onClick={() => cycleStatus(activeTicket.id, activeTicket.status)}
            className={`px-4 py-2 rounded-full font-bold text-[13px] flex items-center gap-1.5 transition-all outline-none active:scale-95 ${
              activeTicket.status === 'Resuelto' 
                ? 'bg-[#E5F7ED] text-[#06C167]' 
                : activeTicket.status === 'En progreso' 
                  ? 'bg-[#FFF4E5] text-[#FF9500]'
                  : 'bg-[#F3F4F6] text-[#1E1E1E] hover:bg-[#ECECEE]'
            }`}
          >
            {activeTicket.status === 'Resuelto' && <Check size={16} weight="bold" />}
            {activeTicket.status}
            {activeTicket.status !== 'Resuelto' && <CaretDown size={14} weight="bold" />}
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4" ref={chatScrollRef}>
          {(!activeTicket.messages || activeTicket.messages.length === 0) ? (
            <div className="flex-1 flex items-center justify-center text-[#8E8E93] text-[14px]">No hay mensajes en este ticket.</div>
          ) : (
            activeTicket.messages.map(msg => {
              const isAdmin = msg.sender === 'admin';
              return (
                <div key={msg.id} className={`flex flex-col max-w-[80%] ${isAdmin ? 'self-end items-end' : 'self-start items-start'}`}>
                  <div className={`px-4 py-2.5 rounded-2xl ${isAdmin ? 'bg-[#1E1E1E] text-white rounded-tr-sm' : 'bg-white text-[#1E1E1E] rounded-tl-sm'}`}>
                    <p className="text-[15px]">{msg.text}</p>
                  </div>
                  <span className="text-[11px] text-[#8E8E93] mt-1 mx-1">{formatDate(msg.date)}</span>
                </div>
              );
            })
          )}
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-white shrink-0 pt-4">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Escribe tu respuesta..."
              className="flex-1 bg-[#F3F4F6] rounded-full px-5 py-3 text-[15px] text-[#1E1E1E] outline-none focus:bg-[#ECECEE] transition-colors"
            />
            <button
              type="submit"
              disabled={!messageInput.trim()}
              className="w-12 h-12 bg-[#06C167] rounded-full flex items-center justify-center text-white hover:bg-[#05a055] disabled:opacity-50 disabled:cursor-not-allowed transition-all outline-none shrink-0"
            >
              <PaperPlaneRight size={20} weight="fill" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto pb-24 md:pb-8">
      <div className="mb-6 md:mb-8 mt-2 md:mt-0 px-2 md:px-0 flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1E1E1E]">Servicio al Cliente</h1>
          <p className="text-[#8E8E93] text-[15px] mt-1">Gestiona los tickets de soporte y chatea con los clientes.</p>
        </div>
        
        <div className="relative">
          <MagnifyingGlass size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8E8E93]" weight="bold" />
          <input
            type="text"
            placeholder="Buscar ticket por cliente o asunto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white rounded-full h-12 pl-11 pr-4 text-[15px] text-[#1E1E1E] outline-none border border-transparent focus:border-[#E5E5EA] transition-all"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {TICKET_STATUS_FILTERS.map(filter => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-4 py-2 rounded-full text-[13px] font-bold whitespace-nowrap outline-none transition-all active:scale-95 ${
                statusFilter === filter
                  ? 'bg-[#1E1E1E] text-white'
                  : 'bg-white text-[#1E1E1E] hover:bg-[#E5E5E7]'
              }`}
            >
              {filter}
            </button>
          ))}
          <button
            onClick={() => setRecentOnly(prev => !prev)}
            className={`px-4 py-2 rounded-full text-[13px] font-bold whitespace-nowrap outline-none transition-all active:scale-95 ${
              recentOnly
                ? 'bg-[#1E1E1E] text-white'
                : 'bg-white text-[#1E1E1E] hover:bg-[#E5E5E7]'
            }`}
          >
            Recientes (24h)
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl flex-1 p-2 md:p-4 mx-2 md:mx-0">
        <div className="flex flex-col gap-2">
          {filteredTickets.map(ticket => (
            <div 
              key={ticket.id} 
              onClick={() => setActiveTicketId(ticket.id)}
              className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-[#F3F4F6] rounded-2xl hover:bg-[#ECECEE] transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 text-[#1E1E1E] group-hover:scale-105 transition-transform">
                  <ChatCircle size={24} weight="fill" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-[#1E1E1E] text-[16px]">{ticket.subject}</span>
                  <span className="text-[13px] text-[#8E8E93] mt-0.5">
                    De: {ticket.user} • {formatDate(ticket.date)}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-4 md:mt-0 justify-end" onClick={e => e.stopPropagation()}>
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
          {filteredTickets.length === 0 && (
            <div className="p-10 text-center text-[#8E8E93]">No hay tickets que coincidan con los filtros.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSupport;
