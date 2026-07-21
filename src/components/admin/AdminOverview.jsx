import React, { useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { ProductsContext } from '../../context/ProductsContext';
import { CurrencyDollar, Package, Users, ShoppingBag } from '@phosphor-icons/react';

const AdminOverview = () => {
  const { orders, users } = useContext(AdminContext);
  const { products } = useContext(ProductsContext);

  const totalSales = orders.reduce((acc, curr) => acc + curr.total, 0);

  const cards = [
    { label: 'Ventas Totales', value: `$${totalSales.toFixed(2)}`, icon: CurrencyDollar, color: 'text-[#06C167]', bg: 'bg-[#F3F4F6]' },
    { label: 'Órdenes Activas', value: orders.length, icon: ShoppingBag, color: 'text-[#1E1E1E]', bg: 'bg-[#F3F4F6]' },
    { label: 'Productos', value: products.length, icon: Package, color: 'text-[#1E1E1E]', bg: 'bg-[#F3F4F6]' },
    { label: 'Usuarios', value: users.length, icon: Users, color: 'text-[#1E1E1E]', bg: 'bg-[#F3F4F6]' },
  ];

  return (
    <div className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto">
      <div className="mb-6 md:mb-8 mt-2 md:mt-0 px-2 md:px-0">
        <h1 className="text-2xl font-bold text-[#1E1E1E]">Resumen General</h1>
        <p className="text-[#8E8E93] text-[15px] mt-1">Métricas clave de tu negocio.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-2 md:px-0">
        {cards.map((card, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[13px] text-[#8E8E93] font-medium">{card.label}</span>
              <span className="text-2xl font-bold text-[#1E1E1E] mt-1">{card.value}</span>
            </div>
            <div className={`w-12 h-12 rounded-full ${card.bg} flex items-center justify-center ${card.color}`}>
              <card.icon size={24} weight="fill" />
            </div>
          </div>
        ))}
      </div>

      {/* Actividad Reciente */}
      <div className="mt-8 px-2 md:px-0 flex-1 flex flex-col min-h-[300px]">
        <div className="bg-white rounded-2xl flex-1 flex flex-col overflow-hidden p-2 md:p-4">
          <div className="p-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#1E1E1E]">Órdenes Recientes</h2>
          </div>
          <div className="flex flex-col gap-2 p-2">
            {orders.slice(0, 5).map(order => (
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
                <div className="mt-3 md:mt-0 flex justify-end">
                  <span className="px-3 py-1 bg-white text-[#1E1E1E] rounded-full text-[13px] font-bold">
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
