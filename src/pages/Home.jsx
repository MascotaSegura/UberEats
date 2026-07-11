import React, { useState } from 'react';
import { MagnifyingGlass, Storefront } from '@phosphor-icons/react';
import Header from '../components/Header';
import CategoryNav from '../components/CategoryNav';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import CartPanel from '../components/CartPanel';
import Sidebar from '../components/Sidebar';
import OrdersPanel from '../components/OrdersPanel';
import WalletPanel from '../components/WalletPanel';
import StoresPanel from '../components/StoresPanel';
import PromosPanel from '../components/PromosPanel';
import HelpPanel from '../components/HelpPanel';
import { products } from '../data/products';
import { useCart } from '../context/useCart';

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activePanel, setActivePanel] = useState(null);

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

  const showCart = isCartOpen || orderStatus;

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

      {/* Navigation Drawer */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onMenuSelect={(panelId) => {
          setActivePanel(panelId);
          setIsSidebarOpen(false);
        }}
      />

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {showCart && <CartPanel onClose={() => setIsCartOpen(false)} />}
      
      {activePanel === 'orders' && <OrdersPanel onClose={() => setActivePanel(null)} />}
      {activePanel === 'wallet' && <WalletPanel onClose={() => setActivePanel(null)} />}
      {activePanel === 'stores' && <StoresPanel onClose={() => setActivePanel(null)} />}
      {activePanel === 'promos' && <PromosPanel onClose={() => setActivePanel(null)} />}
      {activePanel === 'help' && <HelpPanel onClose={() => setActivePanel(null)} />}
    </div>
  );
};

export default Home;
