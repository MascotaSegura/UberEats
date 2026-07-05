import React, { useState } from 'react';
import Header from '../components/Header';
import CategoryNav from '../components/CategoryNav';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import CartPanel from '../components/CartPanel';
import { products } from '../data/products';
import { useCart } from '../context/useCart';

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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
      <div className="sticky top-0 z-20 w-full bg-white shadow-none pt-[max(0px,env(safe-area-inset-top))]">
        <Header
          onOpenCart={() => setIsCartOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
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
          <div className="p-8 text-center text-[#8E8E93]">
            {trimmedQuery !== ''
              ? `Sin resultados para "${searchQuery}".`
              : 'No hay productos en esta categoría.'}
          </div>
        )}
      </div>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {showCart && <CartPanel onClose={() => setIsCartOpen(false)} />}
    </div>
  );
};

export default Home;
