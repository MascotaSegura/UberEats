import { createContext, useState, useEffect, useContext } from 'react';
import { AdminContext } from './AdminContext';

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
  const [cartItems, setCartItems] = useState(() => loadSaved('ubereats_cart', []));
  const [activeOrder, setActiveOrder] = useState(() => loadSaved('ubereats_active_order', null));
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  
  const orderStatus = isTrackingOpen ? 'tracking' : (activeOrder ? 'active' : null);
  const setOrderStatus = (status) => {
    if (status === 'tracking') setIsTrackingOpen(true);
    else if (status === null) setIsTrackingOpen(false);
  };
  const [deliveryMode, setDeliveryMode] = useState(() => loadSaved('ubereats_mode', 'delivery')); // 'delivery' | 'pickup'
  const [favorites, setFavorites] = useState(() => loadSaved('ubereats_favorites', []));

  const [addresses, setAddresses] = useState(() => loadSaved('ubereats_addresses', []));
  const [activePromo, setActivePromo] = useState(() => loadSaved('ubereats_promo', null));
  const [savedCards, setSavedCards] = useState(() => loadSaved('ubereats_cards', [
    { id: '1', type: 'Visa', last4: '1234' },
    { id: '2', type: 'Mastercard', last4: '5678' },
  ]));
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(() => {
    const active = loadSaved('ubereats_active_card', null);
    if (active) return active;
    const cards = loadSaved('ubereats_cards', [
      { id: '1', type: 'Visa', last4: '1234' },
      { id: '2', type: 'Mastercard', last4: '5678' }
    ]);
    return cards.length > 0 ? cards[0] : null;
  });
  
  const { branches, promos: adminPromos } = useContext(AdminContext);
  
  const [deliveryAddress, setDeliveryAddress] = useState(() => {
    const loadedAddresses = loadSaved('ubereats_addresses', []);
    const activeId = loadSaved('ubereats_active_addr', null);
    if (activeId) {
       const found = loadedAddresses.find(a => a.id === activeId);
       if (found) return found;
    }
    return loadedAddresses.length > 0 ? loadedAddresses[0] : null;
  });

  const [pickupBranch, setPickupBranch] = useState(() => {
    const activeId = loadSaved('ubereats_active_branch', null);
    return branches?.find(b => b.id === activeId) || branches?.[0] || null;
  });

  useEffect(() => {
    localStorage.setItem('ubereats_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (activeOrder) {
      localStorage.setItem('ubereats_active_order', JSON.stringify(activeOrder));
    } else {
      localStorage.removeItem('ubereats_active_order');
    }
  }, [activeOrder]);

  useEffect(() => {
    localStorage.setItem('ubereats_addresses', JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    localStorage.setItem('ubereats_mode', JSON.stringify(deliveryMode));
  }, [deliveryMode]);

  useEffect(() => {
    localStorage.setItem('ubereats_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('ubereats_promo', JSON.stringify(activePromo));
  }, [activePromo]);

  useEffect(() => {
    localStorage.setItem('ubereats_cards', JSON.stringify(savedCards));
  }, [savedCards]);

  useEffect(() => {
    localStorage.setItem('ubereats_active_card', JSON.stringify(selectedPaymentMethod));
  }, [selectedPaymentMethod]);

  useEffect(() => {
    if (deliveryAddress) {
      localStorage.setItem('ubereats_active_addr', JSON.stringify(deliveryAddress.id));
    } else {
      localStorage.removeItem('ubereats_active_addr');
    }
  }, [deliveryAddress]);

  useEffect(() => {
    if (pickupBranch) {
      localStorage.setItem('ubereats_active_branch', JSON.stringify(pickupBranch.id));
    }
  }, [pickupBranch]);

  const addToCart = (product, quantity, customizations = [], specialInstructions = '', selectedVariants = {}) => {
    setCartItems((prev) => {
      let finalPrice = product.price;
      if (product.singleChoiceOptions) {
        product.singleChoiceOptions.forEach(opt => {
          const selectedLabel = selectedVariants[opt.title];
          const optionDef = opt.options.find(o => o.label === selectedLabel);
          if (optionDef && optionDef.priceAdd) {
            finalPrice += optionDef.priceAdd;
          }
        });
      }

      const sortedCustoms = [...customizations].sort();
      const existing = prev.find((item) => {
        const itemCustoms = [...(item.customizations || [])].sort();
        return (
          item.productId === product.id &&
          JSON.stringify(itemCustoms) === JSON.stringify(sortedCustoms) &&
          (item.specialInstructions || '') === specialInstructions &&
          JSON.stringify(item.selectedVariants || {}) === JSON.stringify(selectedVariants)
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
          price: finalPrice,
          quantity,
          customizations,
          specialInstructions,
          selectedVariants,
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
    setActiveOrder({
      id: Date.now().toString(),
      createdAt: Date.now(),
      status: 'active'
    });
    setIsTrackingOpen(true);
    clearCart();
  };

  const resetOrder = () => setIsTrackingOpen(false);
  const completeOrder = () => {
    setActiveOrder(null);
    setIsTrackingOpen(false);
  };

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
    const promo = adminPromos.find(p => p.code.toUpperCase() === code.toUpperCase());
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

  const removeCard = (id) => {
    setSavedCards((prev) => {
      const filtered = prev.filter(c => c.id !== id);
      if (selectedPaymentMethod?.id === id) {
        setSelectedPaymentMethod(filtered.length > 0 ? filtered[0] : null);
      }
      return filtered;
    });
  };

  const updateCard = (id, updatedData) => {
    setSavedCards((prev) => {
      const updated = prev.map(c => c.id === id ? { ...c, ...updatedData } : c);
      if (selectedPaymentMethod?.id === id) {
        setSelectedPaymentMethod(updated.find(c => c.id === id));
      }
      return updated;
    });
  };

  const toggleFavorite = (productId) => {
    setFavorites((prev) => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
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
        activeOrder,
        completeOrder,
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
        removeCard,
        updateCard,
        selectedPaymentMethod,
        setSelectedPaymentMethod,
        favorites,
        toggleFavorite,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
