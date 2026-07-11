import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Home />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
