import React, { useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { CaretDown, Check } from '@phosphor-icons/react';

const AdminOrders = () => {
  const { orders, updateOrderStatus } = useContext(AdminContext);

  const statuses = ['Preparando', 'En camino', 'Entregado'];

  const cycleStatus = (orderId, currentStatus) => {
    const currentIndex = statuses.indexOf(currentStatus);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    updateOrderStatus(orderId, nextStatus);
  };

  return (
    <div className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto">
      <div className="mb-6 md:mb-8 mt-2 md:mt-0 px-2 md:px-0 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-[#1E1E1E]">Gestión de Pedidos</h1>
          <p className="text-[#8E8E93] text-[15px] mt-1">Monitorea y actualiza el estado de las órdenes.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl flex-1 p-2 md:p-4 mx-2 md:mx-0">
        <div className="flex flex-col gap-2">
          {orders.map(order => (
            <div key={order.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-[#F3F4F6] rounded-2xl hover:bg-[#ECECEE] transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0 text-[#1E1E1E] font-bold">
                  #{order.id.split('-')[1]}
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-[#1E1E1E] text-[15px]">{order.customer}</span>
                  <span className="text-[13px] text-[#8E8E93] mt-0.5">{order.items} items • ${order.total.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-4 md:mt-0 justify-end">
                <button
                  onClick={() => cycleStatus(order.id, order.status)}
                  className={`px-4 py-2 rounded-full font-bold text-[13px] flex items-center gap-2 outline-none transition-all active:scale-95 ${
                    order.status === 'Entregado' ? 'bg-[#E5F7ED] text-[#06C167]' : 'bg-white text-[#1E1E1E] hover:bg-[#E5E5E7]'
                  }`}
                >
                  {order.status === 'Entregado' && <Check size={16} weight="bold" />}
                  {order.status}
                  {order.status !== 'Entregado' && <CaretDown size={14} weight="bold" />}
                </button>
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <div className="p-10 text-center text-[#8E8E93]">No hay pedidos activos.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
