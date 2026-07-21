import React, { useState, useEffect, Suspense, lazy } from 'react';
import { AnimatePresence } from 'framer-motion';
import { MagnifyingGlass, Storefront } from '@phosphor-icons/react';
import Header from '../components/Header';
import CategoryNav from '../components/CategoryNav';
import ProductCard from '../components/ProductCard';
import PromoCarousel from '../components/PromoCarousel';
import PullToRefresh from '../components/PullToRefresh';
import { ProductCardSkeleton } from '../components/SkeletonComponents';
import { ProductsContext } from '../context/ProductsContext';

const ProductModal = lazy(() => import('../components/ProductModal'));
const CartPanel = lazy(() => import('../components/CartPanel'));
const Sidebar = lazy(() => import('../components/Sidebar'));
const OrdersPanel = lazy(() => import('../components/OrdersPanel'));
const WalletPanel = lazy(() => import('../components/WalletPanel'));
const StoresPanel = lazy(() => import('../components/StoresPanel'));
const PromosPanel = lazy(() => import('../components/PromosPanel'));
const HelpPanel = lazy(() => import('../components/HelpPanel'));
const FavoritesPanel = lazy(() => import('../components/FavoritesPanel'));
const OrderTrackingScreen = lazy(() => import('../components/OrderTrackingScreen'));
const ChatPanel = lazy(() => import('../components/ChatPanel'));
const ProfileScreen = lazy(() => import('../components/ProfileScreen'));

// Number of skeleton cards to show — matches a typical initial render count
const SKELETON_COUNT = 10;

const Home = () => {
  const { products } = React.useContext(ProductsContext);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activePanel, setActivePanel] = useState(null);
  const [activeChat, setActiveChat] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  // Simulate initial data fetch (600ms)
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

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

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  return (
    <div className="bg-[#F3F4F6] min-h-screen">
      <div className="sticky top-0 z-20 w-full bg-white pt-[max(0px,env(safe-area-inset-top))]">
        <Header
          onOpenCart={() => setIsCartOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onMenuToggle={() => setIsSidebarOpen(true)}
          onOpenProfile={() => setShowProfile(true)}
        />
        <CategoryNav
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      <PullToRefresh onRefresh={handleRefresh}>
        <div className="w-full pb-[max(1rem,env(safe-area-inset-bottom))]">
          <PromoCarousel onProductSelect={setSelectedProduct} isLoading={isLoading} />
          {isLoading ? (
            <div className="max-w-7xl mx-auto p-4 sm:p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="max-w-7xl mx-auto p-4 sm:p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={setSelectedProduct}
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
          <Suspense fallback={null}>
            <Sidebar 
              isOpen={isSidebarOpen} 
              onClose={() => setIsSidebarOpen(false)} 
              onMenuSelect={(panelId) => {
                setActivePanel(panelId);
                setIsSidebarOpen(false);
              }}
              onOpenProfile={() => setShowProfile(true)}
            />
          </Suspense>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedProduct && (
          <Suspense fallback={null}>
            <ProductModal
              product={selectedProduct}
              onClose={() => setSelectedProduct(null)}
            />
          </Suspense>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCartOpen && (
          <Suspense fallback={null}>
            <CartPanel onClose={() => setIsCartOpen(false)} />
          </Suspense>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {activePanel === 'orders' && (
          <Suspense fallback={null}>
            <OrdersPanel onClose={() => setActivePanel(null)} />
          </Suspense>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {activePanel === 'wallet' && (
          <Suspense fallback={null}>
            <WalletPanel onClose={() => setActivePanel(null)} />
          </Suspense>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {activePanel === 'stores' && (
          <Suspense fallback={null}>
            <StoresPanel onClose={() => setActivePanel(null)} />
          </Suspense>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {activePanel === 'promos' && (
          <Suspense fallback={null}>
            <PromosPanel onClose={() => setActivePanel(null)} />
          </Suspense>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {activePanel === 'help' && (
          <Suspense fallback={null}>
            <HelpPanel onClose={() => setActivePanel(null)} onOpenChat={() => setActiveChat('support')} />
          </Suspense>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {activePanel === 'favorites' && (
          <Suspense fallback={null}>
            <FavoritesPanel onClose={() => setActivePanel(null)} onProductClick={setSelectedProduct} />
          </Suspense>
        )}
      </AnimatePresence>

      <Suspense fallback={null}>
        <OrderTrackingScreen onOpenChat={(type) => setActiveChat(type)} />
      </Suspense>
      
      <AnimatePresence>
        {activeChat && (
          <Suspense fallback={null}>
            <ChatPanel isOpen={!!activeChat} onClose={() => setActiveChat(null)} recipient={activeChat} />
          </Suspense>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showProfile && (
          <Suspense fallback={null}>
            <ProfileScreen onClose={() => setShowProfile(false)} onOpenOrders={() => setActivePanel('orders')} onOpenFavorites={() => setActivePanel('favorites')} />
          </Suspense>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
