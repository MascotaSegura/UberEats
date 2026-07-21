import React, { createContext, useState, useEffect } from 'react';

export const AdminContext = createContext();

const loadSaved = (key, defaultVal) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
};

export const AdminProvider = ({ children }) => {
  // Orders State (Simulated)
  const [orders, setOrders] = useState(() => loadSaved('admin_orders', [
    { id: 'ord-1', customer: 'Juan Pérez', items: 2, total: 248, status: 'Preparando', date: new Date().toISOString() },
    { id: 'ord-2', customer: 'María Gómez', items: 1, total: 179, status: 'En camino', date: new Date().toISOString() },
    { id: 'ord-3', customer: 'Carlos López', items: 3, total: 450, status: 'Entregado', date: new Date().toISOString() }
  ]));

  // Promos State (Replaces validPromos in CartContext)
  const [promos, setPromos] = useState(() => loadSaved('admin_promos', [
    { id: 'p-1', code: 'FREESHIP', discount: 25.00, type: 'shipping' },
    { id: 'p-2', code: 'BURGER20', discount: 0.20, type: 'percentage' }
  ]));

  // Branches State
  const [branches, setBranches] = useState(() => loadSaved('admin_branches', [
    { id: 'br-1', label: 'Sucursal Centro', detail: '15-20 min', address: 'Av. Reforma 220, Col. Centro', isActive: true },
    { id: 'br-2', label: 'Sucursal Norte', detail: '20-30 min', address: 'Blvd. Valle Verde 1450', isActive: true },
  ]));

  // Users State (Simulated list for dashboard)
  const [users, setUsers] = useState(() => loadSaved('admin_users', [
    { id: 'u-1', name: 'Juan Pérez', email: 'juan@uber.com', phone: '5551234567', registered: '2023-10-01' },
    { id: 'u-2', name: 'María Gómez', email: 'maria@uber.com', phone: '5559876543', registered: '2023-11-15' },
    { id: 'u-3', name: 'Carlos López', email: 'carlos@uber.com', phone: '5554567890', registered: '2024-01-20' },
  ]));

  // Persist
  useEffect(() => localStorage.setItem('admin_orders', JSON.stringify(orders)), [orders]);
  useEffect(() => localStorage.setItem('admin_promos', JSON.stringify(promos)), [promos]);
  useEffect(() => localStorage.setItem('admin_branches', JSON.stringify(branches)), [branches]);
  useEffect(() => localStorage.setItem('admin_users', JSON.stringify(users)), [users]);

  // Orders CRUD
  const updateOrderStatus = (id, newStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };
  const deleteOrder = (id) => setOrders(prev => prev.filter(o => o.id !== id));

  // Promos CRUD
  const addPromo = (promo) => setPromos(prev => [...prev, { ...promo, id: `p-${Date.now()}` }]);
  const updatePromo = (id, data) => setPromos(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  const deletePromo = (id) => setPromos(prev => prev.filter(p => p.id !== id));

  // Branches CRUD
  const addBranch = (branch) => setBranches(prev => [...prev, { ...branch, id: `br-${Date.now()}` }]);
  const updateBranch = (id, data) => setBranches(prev => prev.map(b => b.id === id ? { ...b, ...data } : b));
  const deleteBranch = (id) => setBranches(prev => prev.filter(b => b.id !== id));

  // Users CRUD
  const deleteUser = (id) => setUsers(prev => prev.filter(u => u.id !== id));

  // Support Tickets State
  const [tickets, setTickets] = useState(() => loadSaved('admin_tickets', [
    { 
      id: 't-1', user: 'Ana Silva', subject: 'Problema con mi pedido #ord-1', status: 'Abierto', date: new Date().toISOString(),
      messages: [
        { id: 'm1', sender: 'user', text: 'Hola, mi pedido no ha llegado y ya pasó el tiempo estimado.', date: new Date(Date.now() - 3600000).toISOString() }
      ]
    },
    { 
      id: 't-2', user: 'Carlos Díaz', subject: 'Duda sobre cupones de descuento', status: 'Resuelto', date: new Date(Date.now() - 86400000).toISOString(),
      messages: [
        { id: 'm1', sender: 'user', text: '¿Puedo usar dos cupones a la vez?', date: new Date(Date.now() - 86400000).toISOString() },
        { id: 'm2', sender: 'admin', text: 'Hola Carlos, de momento solo se puede usar un cupón por pedido.', date: new Date(Date.now() - 86000000).toISOString() }
      ]
    },
  ]));

  useEffect(() => localStorage.setItem('admin_tickets', JSON.stringify(tickets)), [tickets]);

  const updateTicketStatus = (id, newStatus) => setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  const deleteTicket = (id) => setTickets(prev => prev.filter(t => t.id !== id));
  
  const addTicketMessage = (ticketId, text, sender = 'admin') => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          messages: [...(t.messages || []), { id: `m-${Date.now()}`, sender, text, date: new Date().toISOString() }],
          status: sender === 'admin' ? 'En progreso' : t.status
        };
      }
      return t;
    }));
  };

  return (
    <AdminContext.Provider value={{
      orders, updateOrderStatus, deleteOrder,
      promos, addPromo, updatePromo, deletePromo,
      branches, addBranch, updateBranch, deleteBranch,
      users, deleteUser,
      tickets, updateTicketStatus, deleteTicket, addTicketMessage
    }}>
      {children}
    </AdminContext.Provider>
  );
};
