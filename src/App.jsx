import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import PWABadge from './components/PWABadge';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Home />
        <PWABadge />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
