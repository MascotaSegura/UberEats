import { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [orderStatus, setOrderStatus] = useState(null);
  const [deliveryMode, setDeliveryMode] = useState('delivery'); // 'delivery' | 'pickup'

  const [addresses, setAddresses] = useState([
    { id: 'addr-1', label: 'Casa', detail: 'Calle Principal 123' },
    { id: 'addr-2', label: 'Oficina', detail: 'Av. Reforma 456' },
  ]);
  const [branches] = useState([
    { id: 'br-1', label: 'Sucursal Centro', detail: '15-20 min' },
    { id: 'br-2', label: 'Sucursal Norte', detail: '20-30 min' },
  ]);
  const [deliveryAddress, setDeliveryAddress] = useState(addresses[0]);
  const [pickupBranch, setPickupBranch] = useState(branches[0]);

  const addToCart = (product, quantity, customizations = [], specialInstructions = '') => {
    setCartItems((prev) => {
      const sortedCustoms = [...customizations].sort();
      const existing = prev.find((item) => {
        const itemCustoms = [...(item.customizations || [])].sort();
        return (
          item.productId === product.id &&
          JSON.stringify(itemCustoms) === JSON.stringify(sortedCustoms) &&
          (item.specialInstructions || '') === specialInstructions
        );
      });
      
      if (existing) {
        return prev.map((item) =>
          item.id === existing.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          ...product,
          id: Date.now() + Math.random(),
          productId: product.id,
          quantity,
          customizations,
          specialInstructions,
        },
      ];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
    );
  };

  const clearCart = () => setCartItems([]);

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const placeOrder = () => {
    setOrderStatus('preparing');
    clearCart();
    setTimeout(() => setOrderStatus('on-the-way'), 3000);
    setTimeout(() => setOrderStatus('delivered'), 6000);
  };

  const resetOrder = () => setOrderStatus(null);

  const addAddress = (address) => {
    const newAddress = { ...address, id: `addr-${Date.now()}` };
    setAddresses((prev) => [...prev, newAddress]);
    setDeliveryAddress(newAddress);
  };

  const removeAddress = (id) => {
    setAddresses((prev) => {
      const filtered = prev.filter(a => a.id !== id);
      if (deliveryAddress?.id === id) {
        setDeliveryAddress(filtered.length > 0 ? filtered[0] : null);
      }
      return filtered;
    });
  };

  const updateAddress = (id, updatedData) => {
    setAddresses((prev) => {
      const updated = prev.map(a => a.id === id ? { ...a, ...updatedData } : a);
      if (deliveryAddress?.id === id) {
        setDeliveryAddress(updated.find(a => a.id === id));
      }
      return updated;
    });
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        placeOrder,
        resetOrder,
        orderStatus,
        setOrderStatus,
        deliveryMode,
        setDeliveryMode,
        addresses,
        branches,
        deliveryAddress,
        setDeliveryAddress,
        pickupBranch,
        setPickupBranch,
        addAddress,
        removeAddress,
        updateAddress,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
