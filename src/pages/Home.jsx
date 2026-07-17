import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { MagnifyingGlass, Storefront } from '@phosphor-icons/react';
import Header from '../components/Header';
import CategoryNav from '../components/CategoryNav';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import PullToRefresh from '../components/PullToRefresh';
import CartPanel from '../components/CartPanel';
import Sidebar from '../components/Sidebar';
import OrdersPanel from '../components/OrdersPanel';
import WalletPanel from '../components/WalletPanel';
import StoresPanel from '../components/StoresPanel';
import PromosPanel from '../components/PromosPanel';
import HelpPanel from '../components/HelpPanel';
import OrderTrackingScreen from '../components/OrderTrackingScreen';
import ChatPanel from '../components/ChatPanel';
import { products } from '../data/products';
import { useCart } from '../context/useCart';

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activePanel, setActivePanel] = useState(null);
  const [activeChat, setActiveChat] = useState(null);

  const { orderStatus } = useCart();

  const trimmedQuery = searchQuery.trim().toLowerCase();

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      trimmedQuery === '' ||
      p.name.toLowerCase().includes(trimmedQuery) ||
      p.description.toLowerCase().includes(trimmedQuery);
    return matchesCategory && matchesSearch;
  });

  const showCart = isCartOpen;

  const handleRefresh = async () => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Usually you would fetch new products here
  };

  return (
    <div className="bg-[#F3F4F6] min-h-screen">
      <div className="sticky top-0 z-20 w-full bg-white pt-[max(0px,env(safe-area-inset-top))]">
        <Header
          onOpenCart={() => setIsCartOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onMenuToggle={() => setIsSidebarOpen(true)}
        />
        <CategoryNav
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      <PullToRefresh onRefresh={handleRefresh}>
        <div className="w-full pb-[max(1rem,env(safe-area-inset-bottom))]">
          {filteredProducts.length > 0 ? (
            <div className="max-w-7xl mx-auto p-4 sm:p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={(p) => setSelectedProduct(p)}
                />
              ))}
            </div>
          ) : (
            <div className="max-w-md mx-auto mt-12 p-10 bg-white rounded-2xl flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-[#F3F4F6] rounded-full flex items-center justify-center mb-6">
                {trimmedQuery !== '' ? (
                  <MagnifyingGlass size={40} weight="bold" color="#D1D1D6" />
                ) : (
                  <Storefront size={40} weight="fill" color="#D1D1D6" />
                )}
              </div>
              <h3 className="text-xl font-semibold text-[#1E1E1E] mb-2">
                {trimmedQuery !== '' ? 'Sin resultados' : 'Categoría vacía'}
              </h3>
              <p className="text-[15px] text-[#8E8E93] leading-snug">
                {trimmedQuery !== ''
                  ? `No encontramos ningún platillo que coincida con "${searchQuery}". Prueba con otras palabras.`
                  : 'En este momento no hay productos disponibles en esta categoría.'}
              </p>
            </div>
          )}
        </div>
      </PullToRefresh>

      {/* Navigation Drawer */}
      <AnimatePresence>
        {isSidebarOpen && (
          <Sidebar 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)} 
            onMenuSelect={(panelId) => {
              setActivePanel(panelId);
              setIsSidebarOpen(false);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCart && <CartPanel onClose={() => setIsCartOpen(false)} />}
      </AnimatePresence>
      
      <AnimatePresence>
        {activePanel === 'orders' && <OrdersPanel onClose={() => setActivePanel(null)} />}
      </AnimatePresence>
      <AnimatePresence>
        {activePanel === 'wallet' && <WalletPanel onClose={() => setActivePanel(null)} />}
      </AnimatePresence>
      <AnimatePresence>
        {activePanel === 'stores' && <StoresPanel onClose={() => setActivePanel(null)} />}
      </AnimatePresence>
      <AnimatePresence>
        {activePanel === 'promos' && <PromosPanel onClose={() => setActivePanel(null)} />}
      </AnimatePresence>
      <AnimatePresence>
        {activePanel === 'help' && <HelpPanel onClose={() => setActivePanel(null)} onOpenChat={() => setActiveChat('support')} />}
      </AnimatePresence>

      <OrderTrackingScreen onOpenChat={(type) => setActiveChat(type)} />
      
      <AnimatePresence>
        {activeChat && <ChatPanel isOpen={!!activeChat} onClose={() => setActiveChat(null)} recipient={activeChat} />}
      </AnimatePresence>
    </div>
  );
};

export default Home;
