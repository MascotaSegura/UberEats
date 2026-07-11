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
  const [activePromo, setActivePromo] = useState(() => loadSaved('didi_promo', null));
  const [savedCards, setSavedCards] = useState(() => loadSaved('didi_cards', [
    { id: '1', type: 'Visa', last4: '1234' },
    { id: '2', type: 'Mastercard', last4: '5678' },
  ]));
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(() => {
    const active = loadSaved('didi_active_card', null);
    if (active) return active;
    const cards = loadSaved('didi_cards', [
      { id: '1', type: 'Visa', last4: '1234' },
      { id: '2', type: 'Mastercard', last4: '5678' }
    ]);
    return cards.length > 0 ? cards[0] : null;
  });
  
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
    localStorage.setItem('didi_promo', JSON.stringify(activePromo));
  }, [activePromo]);

  useEffect(() => {
    localStorage.setItem('didi_cards', JSON.stringify(savedCards));
  }, [savedCards]);

  useEffect(() => {
    localStorage.setItem('didi_active_card', JSON.stringify(selectedPaymentMethod));
  }, [selectedPaymentMethod]);

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

  const applyPromo = (code) => {
    const validPromos = {
      'FREESHIP': { code: 'FREESHIP', discount: 25.00, type: 'shipping' },
      'BURGER20': { code: 'BURGER20', discount: 0.20, type: 'percentage' }
    };
    const promo = validPromos[code.toUpperCase()];
    if (promo) {
      setActivePromo(promo);
      return { success: true };
    }
    return { success: false, error: 'Código inválido o expirado.' };
  };

  const removePromo = () => setActivePromo(null);

  const addCard = (card) => {
    const newCard = { ...card, id: `card-${Date.now()}` };
    setSavedCards((prev) => [...prev, newCard]);
    setSelectedPaymentMethod((prev) => prev || newCard);
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
        activePromo,
        applyPromo,
        removePromo,
        savedCards,
        addCard,
        selectedPaymentMethod,
        setSelectedPaymentMethod,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
