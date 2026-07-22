import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Storefront, Package, Users, Tag, ListDashes, ChartPieSlice, SignOut
} from '@phosphor-icons/react';
import AdminOverview from '../components/admin/AdminOverview';
import AdminProducts from './AdminScreen'; // The old one we renamed basically
import AdminOrders from '../components/admin/AdminOrders';
import AdminPromos from '../components/admin/AdminPromos';
import AdminBranches from '../components/admin/AdminBranches';
import AdminUsers from '../components/admin/AdminUsers';
import AdminSupport from '../components/admin/AdminSupport';
import { Headset } from '@phosphor-icons/react';

const AdminLayout = () => {
  const { user } = useContext(AuthContext);
  
  // Extraer el tab desde el hash: #/admin?tab=orders
  const getTabFromHash = () => {
    const params = new URLSearchParams(window.location.hash.split('?')[1]);
    return params.get('tab') || 'overview';
  };
  
  const [activeTab, setActiveTab] = useState(getTabFromHash());

  useEffect(() => {
    const handleHash = () => setActiveTab(getTabFromHash());
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const changeTab = (tabId) => {
    window.location.hash = `#/admin?tab=${tabId}`;
  };

  if (!user || !user.isAdmin) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] flex flex-col items-center justify-center p-6 text-center">
        <Storefront size={64} weight="fill" color="#8E8E93" className="mb-4" />
        <h1 className="text-2xl font-bold text-[#1E1E1E] mb-2">Acceso Restringido</h1>
        <p className="text-[#8E8E93] mb-8 max-w-[300px]">
          Esta sección es únicamente para administradores del sistema.
        </p>
        <button
          onClick={() => { window.location.hash = ''; }}
          className="bg-[#1E1E1E] text-white px-8 py-3.5 rounded-full font-medium hover:bg-[#2C2C2E] active:scale-[0.98] outline-none transition-all"
        >
          Volver a la Tienda
        </button>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: ChartPieSlice },
    { id: 'orders', label: 'Pedidos', icon: ListDashes },
    { id: 'products', label: 'Productos', icon: Package },
    { id: 'promos', label: 'Promociones', icon: Tag },
    { id: 'branches', label: 'Sucursales', icon: Storefront },
    { id: 'users', label: 'Usuarios', icon: Users },
    { id: 'support', label: 'Soporte', icon: Headset },
  ];

  const handleDragEnd = (e, { offset, velocity }) => {
    const swipe = offset.x;
    if (swipe < -50) {
      // swipe left -> next tab
      const currentIndex = tabs.findIndex(t => t.id === activeTab);
      if (currentIndex < tabs.length - 1) {
        changeTab(tabs[currentIndex + 1].id);
      }
    } else if (swipe > 50) {
      // swipe right -> prev tab
      const currentIndex = tabs.findIndex(t => t.id === activeTab);
      if (currentIndex > 0) {
        changeTab(tabs[currentIndex - 1].id);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-[260px] bg-white h-screen sticky top-0 shrink-0">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-[#1E1E1E]">Dashboard</h2>
          <p className="text-[#8E8E93] text-[13px] mt-1">Uber Eats Admin</p>
        </div>
        <div className="flex-1 px-4 flex flex-col gap-2 overflow-y-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => changeTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all outline-none text-left font-medium text-[15px] ${activeTab === tab.id ? 'bg-[#1E1E1E] text-white' : 'text-[#1E1E1E] hover:bg-[#F3F4F6]'}`}
            >
              <tab.icon size={20} weight={activeTab === tab.id ? 'fill' : 'regular'} />
              {tab.label}
            </button>
          ))}
        </div>
        <div className="p-4 mt-auto">
          <button
            onClick={() => { window.location.hash = ''; }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#F3F4F6] hover:bg-[#ECECEE] text-[#1E1E1E] rounded-2xl transition-colors outline-none font-medium text-[15px]"
          >
            <SignOut size={20} />
            Salir del panel
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0 pb-[64px] md:pb-0">
        <div className="flex-1 flex flex-col relative w-full h-full max-w-full overflow-hidden overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              className="flex-1 flex flex-col absolute inset-0 bg-[#F3F4F6]"
            >
              {activeTab === 'overview' && <AdminOverview />}
              {activeTab === 'products' && <AdminProducts isEmbedded />}
              {activeTab === 'orders' && <AdminOrders />}
              {activeTab === 'promos' && <AdminPromos />}
              {activeTab === 'branches' && <AdminBranches />}
              {activeTab === 'users' && <AdminUsers />}
              {activeTab === 'support' && <AdminSupport />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white shadow-none pt-1 pb-[env(safe-area-inset-bottom)] z-50 flex items-center justify-around px-2 border-t border-[#F3F4F6]">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => changeTab(tab.id)}
            className={`flex flex-col items-center justify-center w-14 h-14 outline-none transition-colors ${activeTab === tab.id ? 'text-[#1E1E1E]' : 'text-[#8E8E93]'}`}
          >
            <tab.icon size={22} weight={activeTab === tab.id ? 'fill' : 'regular'} />
            <span className="text-[10px] font-medium mt-0.5">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminLayout;
