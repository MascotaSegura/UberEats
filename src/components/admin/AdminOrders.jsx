import React, { useContext, useState } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { CaretDown, Check, MagnifyingGlass } from '@phosphor-icons/react';

const ORDER_STATUS_FILTERS = ['Todos', 'Preparando', 'En camino', 'Entregado'];

const AdminOrders = () => {
  const { orders, updateOrderStatus } = useContext(AdminContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');

  const statuses = ['Preparando', 'En camino', 'Entregado'];

  const cycleStatus = (orderId, currentStatus) => {
    const currentIndex = statuses.indexOf(currentStatus);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    updateOrderStatus(orderId, nextStatus);
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch =
      o.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Todos' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto pb-24 md:pb-8">
      <div className="mb-6 md:mb-8 mt-2 md:mt-0 px-2 md:px-0 flex flex-col gap-4">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-[#1E1E1E]">Gestión de Pedidos</h1>
            <p className="text-[#8E8E93] text-[15px] mt-1">Monitorea y actualiza el estado de las órdenes.</p>
          </div>
        </div>

        <div className="relative">
          <MagnifyingGlass size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8E8E93]" weight="bold" />
          <input
            type="text"
            placeholder="Buscar por cliente o ID de orden..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white rounded-full h-12 pl-11 pr-4 text-[15px] text-[#1E1E1E] outline-none border border-transparent focus:border-[#E5E5EA] transition-all"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {ORDER_STATUS_FILTERS.map(filter => (
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
        </div>
      </div>

      <div className="bg-white rounded-2xl flex-1 p-2 md:p-4 mx-2 md:mx-0">
        <div className="flex flex-col gap-2">
          {filteredOrders.map(order => (
            <div key={order.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-[#F3F4F6] rounded-2xl hover:bg-[#ECECEE] transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 text-[#1E1E1E] font-bold text-[13px]">
                  #{order.id.split('-')[1]}
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-[#1E1E1E] text-[15px]">{order.customer}</span>
                  <span className="text-[13px] text-[#8E8E93] mt-0.5">{order.items} items • ${order.total.toFixed(2)}</span>
                  {order.date && <span className="text-[12px] text-[#8E8E93] mt-0.5">{formatDate(order.date)}</span>}
                </div>
              </div>
              <div className="flex items-center gap-3 mt-4 md:mt-0 justify-end">
                <button
                  onClick={() => cycleStatus(order.id, order.status)}
                  className={`px-4 py-2 rounded-full font-bold text-[13px] flex items-center gap-2 outline-none transition-all active:scale-95 ${
                    order.status === 'Entregado' ? 'bg-[#E5F7ED] text-[#06C167]' :
                    order.status === 'En camino' ? 'bg-[#FFF4E5] text-[#FF9500]' :
                    'bg-white text-[#1E1E1E] hover:bg-[#E5E5E7]'
                  }`}
                >
                  {order.status === 'Entregado' && <Check size={16} weight="bold" />}
                  {order.status}
                  {order.status !== 'Entregado' && <CaretDown size={14} weight="bold" />}
                </button>
              </div>
            </div>
          ))}
          {filteredOrders.length === 0 && (
            <div className="p-10 text-center text-[#8E8E93]">No hay pedidos que coincidan con la búsqueda.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
