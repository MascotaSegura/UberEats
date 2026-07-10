import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

const loadSaved = (key, defaultVal) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => loadSaved('didi_cart', []));
  const [orderStatus, setOrderStatus] = useState(null);
  const [deliveryMode, setDeliveryMode] = useState(() => loadSaved('didi_mode', 'delivery')); // 'delivery' | 'pickup'

  const [addresses, setAddresses] = useState(() => loadSaved('didi_addresses', []));
  
  const [branches] = useState([
    { id: 'br-1', label: 'Sucursal Centro', detail: '15-20 min' },
    { id: 'br-2', label: 'Sucursal Norte', detail: '20-30 min' },
  ]);
  
  const [deliveryAddress, setDeliveryAddress] = useState(() => {
    const loadedAddresses = loadSaved('didi_addresses', []);
    const activeId = loadSaved('didi_active_addr', null);
    if (activeId) {
       const found = loadedAddresses.find(a => a.id === activeId);
       if (found) return found;
    }
    return loadedAddresses.length > 0 ? loadedAddresses[0] : null;
  });

  const [pickupBranch, setPickupBranch] = useState(() => {
    const activeId = loadSaved('didi_active_branch', null);
    return branches.find(b => b.id === activeId) || branches[0];
  });

  useEffect(() => {
    localStorage.setItem('didi_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('didi_addresses', JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    localStorage.setItem('didi_mode', JSON.stringify(deliveryMode));
  }, [deliveryMode]);

  useEffect(() => {
    if (deliveryAddress) {
      localStorage.setItem('didi_active_addr', JSON.stringify(deliveryAddress.id));
    } else {
      localStorage.removeItem('didi_active_addr');
    }
  }, [deliveryAddress]);

  useEffect(() => {
    if (pickupBranch) {
      localStorage.setItem('didi_active_branch', JSON.stringify(pickupBranch.id));
    }
  }, [pickupBranch]);

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
