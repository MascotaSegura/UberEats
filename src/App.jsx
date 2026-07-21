import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import PWABadge from './components/PWABadge';

import { useState, useEffect } from 'react';
import { AdminProvider } from './context/AdminContext';
import { ProductsProvider } from './context/ProductsContext';
import AdminLayout from './pages/AdminLayout';

function App() {
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => setCurrentHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Obtenemos la ruta base para el routing simulado
  const basePath = currentHash.split('?')[0];

  return (
    <AuthProvider>
      <AdminProvider>
        <CartProvider>
          <ProductsProvider>
            {basePath === '#/admin' ? (
              <AdminLayout />
            ) : (
              <>
                <Home />
                <PWABadge />
              </>
            )}
          </ProductsProvider>
        </CartProvider>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;
