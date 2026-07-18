import React, { useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CaretLeft, Receipt, MapPin, CreditCard, Heart, Gear, SignOut, PencilSimple, Bell, EnvelopeSimple, NavigationArrow, Plus, Trash } from '@phosphor-icons/react';
import { AuthContext } from '../context/AuthContext';
import { useCart } from '../context/useCart';

const handleKeyDown = (fn) => (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    fn();
  }
};

const ToggleSwitch = ({ checked, onChange }) => (
  <div 
    className={`w-12 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors ${checked ? 'bg-[#06C167]' : 'bg-[#E5E5E7]'}`}
    onClick={onChange}
    role="switch"
    aria-checked={checked}
    tabIndex={0}
    onKeyDown={handleKeyDown(onChange)}
  >
    <motion.div 
      className="bg-white w-5 h-5 rounded-full"
      layout
      transition={{ type: "spring", stiffness: 700, damping: 30 }}
      style={{ x: checked ? 20 : 0 }}
    />
  </div>
);

const getCardType = (number) => {
  const clean = number.replace(/\D/g, '');
  if (clean.startsWith('4')) return 'Visa';
  if (/^5[1-5]/.test(clean) || /^2[2-7]/.test(clean)) return 'Mastercard';
  if (/^3[47]/.test(clean)) return 'Amex';
  return 'Tarjeta';
};

const formatCardNumber = (val) => {
  const clean = val.replace(/\D/g, '');
  const type = getCardType(clean);
  if (type === 'Amex') {
    const match = clean.match(/^(\d{0,4})(\d{0,6})(\d{0,5})$/);
    if (!match) return clean.slice(0, 15);
    return [match[1], match[2], match[3]].filter(Boolean).join(' ');
  } else {
    const match = clean.match(/^(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})$/);
    if (!match) return clean.slice(0, 16);
    return [match[1], match[2], match[3], match[4]].filter(Boolean).join(' ');
  }
};

const formatExpiry = (val) => {
  const clean = val.replace(/\D/g, '');
  if (clean.length >= 3) {
    return `${clean.slice(0, 2)}/${clean.slice(2, 4)}`;
  }
  return clean;
};

const ProfileScreen = ({ onClose, onOpenOrders, onOpenFavorites }) => {
  const { user, logout, updateUser } = useContext(AuthContext);
  const { savedCards, addCard, removeCard, updateCard } = useCart();
  const [currentView, setCurrentView] = useState('menu'); // 'menu', 'edit', 'settings', 'payments', 'payment_form'
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  // Edit Form State
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');

  // Payment Form State
  const [editingCard, setEditingCard] = useState(null);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardError, setCardError] = useState(null);

  // Settings State
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('ubereats_settings');
      return saved ? JSON.parse(saved) : { notifications: true, promos: false, location: true };
    } catch (e) {
      return { notifications: true, promos: false, location: true };
    }
  });

  useEffect(() => {
    localStorage.setItem('ubereats_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
      setEditPhone(user.phone || '');
      setEditEmail(user.email || '');
    }
  }, [user]);

  if (!user) return null;

  const handleSaveProfile = () => {
    updateUser({ name: editName, phone: editPhone, email: editEmail });
    setCurrentView('menu');
  };

  const handleEditCard = (card) => {
    setEditingCard(card);
    setCardNumber(card.number || `XXXX XXXX XXXX ${card.last4}`);
    setExpiry(card.expiry || '12/25');
    setCvv(card.cvv || '123');
    setCardError(null);
    setCurrentView('payment_form');
  };

  const handleAddCardClick = () => {
    setEditingCard(null);
    setCardNumber('');
    setExpiry('');
    setCvv('');
    setCardError(null);
    setCurrentView('payment_form');
  };

  const handleSaveCard = () => {
    setCardError(null);
    const cleanNum = cardNumber.replace(/\D/g, '');
    const type = getCardType(cleanNum);
    const requiredLength = type === 'Amex' ? 15 : 16;
    
    const isMasked = cardNumber.includes('XXXX');
    if (!isMasked && cleanNum.length !== requiredLength) {
      setCardError('Número de tarjeta inválido.');
      return;
    }
    if (expiry.length < 5) {
      setCardError('Fecha inválida.');
      return;
    }
    const requiredCvv = type === 'Amex' ? 4 : 3;
    if (cvv.length !== requiredCvv) {
      setCardError(`CVV debe ser de ${requiredCvv} dígitos.`);
      return;
    }
    
    const cardData = {
      type: isMasked ? editingCard.type : type,
      last4: isMasked ? editingCard.last4 : cleanNum.slice(-4),
      number: cardNumber,
      expiry,
      cvv
    };

    if (editingCard) {
      updateCard(editingCard.id, cardData);
    } else {
      addCard(cardData);
    }
    setCurrentView('payments');
  };

  const handleDeleteCard = () => {
    if (editingCard) {
      removeCard(editingCard.id);
    }
    setCurrentView('payments');
  };

  const menuItems = [
    { id: 'orders', icon: <Receipt size={24} weight="fill" />, label: 'Mis Pedidos', action: onOpenOrders },
    { id: 'addresses', icon: <MapPin size={24} weight="fill" />, label: 'Direcciones Guardadas' },
    { id: 'payments', icon: <CreditCard size={24} weight="fill" />, label: 'Métodos de Pago', action: () => setCurrentView('payments') },
    { id: 'favorites', icon: <Heart size={24} weight="fill" />, label: 'Favoritos', action: onOpenFavorites },
    { id: 'settings', icon: <Gear size={24} weight="fill" />, label: 'Configuración', action: () => setCurrentView('settings') },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 h-[100dvh] w-screen z-[150] flex items-end md:items-stretch justify-center md:justify-end bg-[#1E1E1E]/40 md:p-0 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Mi Perfil"
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={{ left: 0, right: 0.5 }}
        onDragEnd={(e, info) => {
          if (info.offset.x > 100 || info.velocity.x > 500) {
            onClose();
          }
        }}
        className="bg-[#F3F4F6] w-full h-full max-h-[100dvh] md:h-full md:max-w-[480px] flex flex-col md:rounded-l-2xl rounded-t-2xl md:rounded-tr-none overflow-hidden relative isolate"
      >
        {/* Header */}
        <div className="bg-white flex items-center px-4 py-4 pt-[max(1rem,env(safe-area-inset-top,1rem))] shrink-0 sticky top-0 z-10">
          <button
            onClick={() => {
              if (currentView === 'menu') onClose();
              else if (currentView === 'payment_form') setCurrentView('payments');
              else setCurrentView('menu');
            }}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[#F3F4F6] hover:bg-[#ECECEE] active:bg-[#ECECEE] transition-all outline-none active:scale-[0.95]"
            aria-label={currentView === 'menu' ? "Cerrar perfil" : "Volver"}
          >
            <CaretLeft size={24} weight="bold" color="#1E1E1E" />
          </button>
          <h1 className="flex-1 text-center text-lg font-bold text-[#1E1E1E] pr-10">
            {currentView === 'menu' && 'Mi Perfil'}
            {currentView === 'edit' && 'Editar Perfil'}
            {currentView === 'settings' && 'Configuración'}
            {currentView === 'payments' && 'Métodos de Pago'}
            {currentView === 'payment_form' && (editingCard ? 'Editar Tarjeta' : 'Nueva Tarjeta')}
          </h1>
        </div>

        <div className="flex-1 overflow-x-hidden overflow-y-auto pb-[max(2rem,env(safe-area-inset-bottom,2rem))] relative">
          <AnimatePresence mode="wait">
            {currentView === 'menu' && (
              <motion.div 
                key="menu"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="w-full flex flex-col"
              >
                {/* User Info Card */}
                <div className="bg-white px-6 py-8 flex flex-col items-center">
                  <div className="w-24 h-24 bg-[#1E1E1E] rounded-full flex items-center justify-center mb-4 text-white text-3xl font-bold relative">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <h2 className="text-2xl font-bold text-[#1E1E1E] text-center mb-1">{user.name}</h2>
                  <p className="text-[15px] font-medium text-[#8E8E93] text-center mb-5">{user.phone || user.email}</p>
                  
                  <button 
                    onClick={() => setCurrentView('edit')}
                    className="bg-[#F3F4F6] text-[#1E1E1E] px-6 py-2.5 rounded-full font-medium text-[14px] hover:bg-[#ECECEE] active:scale-[0.95] transition-all outline-none flex items-center gap-2"
                  >
                    <PencilSimple size={16} weight="bold" />
                    Editar Perfil
                  </button>
                </div>

                {/* Menu Items */}
                <div className="mt-4 bg-white flex flex-col py-2 px-4">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (item.action) {
                          if (item.id === 'settings' || item.id === 'payments') {
                            item.action();
                          } else {
                            item.action();
                            onClose();
                          }
                        }
                      }}
                      className="flex items-center gap-4 w-full py-4 text-left rounded-2xl hover:bg-[#F3F4F6] active:bg-[#F3F4F6] transition-all outline-none focus-visible:bg-[#F3F4F6] active:scale-[0.98] px-4"
                    >
                      <div className="text-[#1E1E1E] shrink-0">
                        {item.icon}
                      </div>
                      <span className="text-[16px] font-medium text-[#1E1E1E] flex-1">
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Logout Button */}
                <div className="mt-8 px-6">
                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="w-full bg-[#E5E5E7] text-[#1E1E1E] hover:text-[#FF3B30] hover:bg-[#FF3B30]/10 py-4 rounded-full font-bold text-[16px] active:scale-[0.98] transition-all outline-none focus-visible:opacity-80 flex items-center justify-center gap-2"
                  >
                    <SignOut size={20} weight="bold" />
                    Cerrar Sesión
                  </button>
                </div>
              </motion.div>
            )}

            {currentView === 'edit' && (
              <motion.div 
                key="edit"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="w-full flex flex-col bg-white min-h-full px-6 py-6"
              >
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-medium text-[#1E1E1E]">Nombre Completo</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      className="w-full bg-[#F3F4F6] rounded-2xl px-4 py-3 text-[15px] outline-none text-[#1E1E1E] focus:bg-[#ECECEE] transition-colors"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-medium text-[#1E1E1E]">Teléfono</label>
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={e => setEditPhone(e.target.value)}
                      className="w-full bg-[#F3F4F6] rounded-2xl px-4 py-3 text-[15px] outline-none text-[#1E1E1E] focus:bg-[#ECECEE] transition-colors"
                      placeholder="Tu teléfono"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-medium text-[#1E1E1E]">Correo Electrónico</label>
                    <input
                      type="email"
                      value={editEmail}
                      onChange={e => setEditEmail(e.target.value)}
                      className="w-full bg-[#F3F4F6] rounded-2xl px-4 py-3 text-[15px] outline-none text-[#1E1E1E] focus:bg-[#ECECEE] transition-colors"
                      placeholder="Tu correo"
                    />
                  </div>
                </div>

                <div className="mt-10 pt-4">
                  <button
                    onClick={handleSaveProfile}
                    className="w-full bg-[#1E1E1E] text-white py-4 rounded-full font-bold text-[16px] hover:bg-[#2C2C2E] active:bg-[#2C2C2E] transition-all active:scale-[0.98] outline-none focus-visible:opacity-90"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </motion.div>
            )}

            {currentView === 'settings' && (
              <motion.div 
                key="settings"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="w-full flex flex-col min-h-full"
              >
                <div className="bg-white flex flex-col py-2 px-4 mt-4">
                  <div className="flex items-center justify-between py-4 px-4 border-b border-[#F3F4F6] last:border-0">
                    <div className="flex items-center gap-4">
                      <Bell size={24} weight="fill" color="#1E1E1E" />
                      <span className="text-[16px] font-medium text-[#1E1E1E]">Notificaciones Push</span>
                    </div>
                    <ToggleSwitch 
                      checked={settings.notifications} 
                      onChange={() => setSettings(s => ({ ...s, notifications: !s.notifications }))} 
                    />
                  </div>
                  <div className="flex items-center justify-between py-4 px-4 border-b border-[#F3F4F6] last:border-0">
                    <div className="flex items-center gap-4">
                      <EnvelopeSimple size={24} weight="fill" color="#1E1E1E" />
                      <span className="text-[16px] font-medium text-[#1E1E1E]">Promos por Correo</span>
                    </div>
                    <ToggleSwitch 
                      checked={settings.promos} 
                      onChange={() => setSettings(s => ({ ...s, promos: !s.promos }))} 
                    />
                  </div>
                  <div className="flex items-center justify-between py-4 px-4 border-b border-[#F3F4F6] last:border-0">
                    <div className="flex items-center gap-4">
                      <NavigationArrow size={24} weight="fill" color="#1E1E1E" />
                      <span className="text-[16px] font-medium text-[#1E1E1E]">Usar Ubicación</span>
                    </div>
                    <ToggleSwitch 
                      checked={settings.location} 
                      onChange={() => setSettings(s => ({ ...s, location: !s.location }))} 
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {currentView === 'payments' && (
              <motion.div 
                key="payments"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="w-full flex flex-col bg-white min-h-full px-6 py-6"
              >
                <div className="flex flex-col gap-3">
                  {savedCards.map((card) => (
                    <div 
                      key={card.id} 
                      onClick={() => handleEditCard(card)}
                      className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-colors outline-none bg-[#F3F4F6] hover:bg-[#ECECEE] focus-visible:opacity-80 group"
                    >
                      <div className="w-12 h-8 rounded-2xl flex items-center justify-center bg-white shrink-0">
                        <CreditCard size={20} weight="fill" color="#1E1E1E" />
                      </div>
                      <div className="flex-1 flex flex-col">
                        <span className="font-semibold text-[#1E1E1E] text-[15px]">{card.type}</span>
                        <span className="text-[13px] text-[#8E8E93]">•••• {card.last4}</span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center group-hover:bg-[#E5E5E7] transition-colors">
                        <PencilSimple size={16} weight="bold" color="#1E1E1E" />
                      </div>
                    </div>
                  ))}
                  
                  <div 
                    className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer outline-none focus-visible:opacity-80 transition-all hover:bg-[#F3F4F6] active:bg-[#F3F4F6] mt-2"
                    onClick={handleAddCardClick}
                  >
                    <div className="w-10 h-10 bg-[#F3F4F6] rounded-full flex items-center justify-center">
                      <Plus size={20} weight="bold" color="#1E1E1E" />
                    </div>
                    <span className="font-semibold text-[#1E1E1E] text-[15px]">Agregar método de pago</span>
                  </div>
                </div>
              </motion.div>
            )}

            {currentView === 'payment_form' && (
              <motion.div 
                key="payment_form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="w-full flex flex-col bg-white min-h-full px-6 py-6"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-medium text-[#1E1E1E]">Número de Tarjeta</label>
                    <input 
                      type="text" 
                      placeholder="Número de tarjeta" 
                      className={`w-full rounded-2xl h-12 px-4 outline-none text-[15px] text-[#1E1E1E] placeholder:text-[#8E8E93] transition-colors ${cardError?.includes('Número') ? 'bg-[#FFF0F0] text-[#FF3B30]' : 'bg-[#F3F4F6] focus:bg-[#ECECEE]'}`}
                      value={cardNumber}
                      onChange={(e) => {
                         setCardNumber(formatCardNumber(e.target.value));
                         setCardError(null);
                      }}
                    />
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex flex-col gap-2 flex-1">
                      <label className="text-[14px] font-medium text-[#1E1E1E]">Expiración</label>
                      <input 
                        type="text" 
                        placeholder="MM/YY" 
                        className={`w-full rounded-2xl h-12 px-4 outline-none text-[15px] text-[#1E1E1E] placeholder:text-[#8E8E93] transition-colors ${cardError?.includes('Fecha') ? 'bg-[#FFF0F0] text-[#FF3B30]' : 'bg-[#F3F4F6] focus:bg-[#ECECEE]'}`}
                        value={expiry}
                        onChange={(e) => {
                           setExpiry(formatExpiry(e.target.value));
                           setCardError(null);
                        }}
                      />
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                      <label className="text-[14px] font-medium text-[#1E1E1E]">CVV</label>
                      <input 
                        type="text" 
                        placeholder="CVV" 
                        maxLength={getCardType(cardNumber) === 'Amex' ? 4 : 3}
                        className={`w-full rounded-2xl h-12 px-4 outline-none text-[15px] text-[#1E1E1E] placeholder:text-[#8E8E93] transition-colors ${cardError?.includes('CVV') ? 'bg-[#FFF0F0] text-[#FF3B30]' : 'bg-[#F3F4F6] focus:bg-[#ECECEE]'}`}
                        value={cvv}
                        onChange={(e) => {
                           setCvv(e.target.value.replace(/\D/g, '').slice(0, 4));
                           setCardError(null);
                        }}
                      />
                    </div>
                  </div>

                  {cardError && (
                    <span className="text-[13px] text-[#FF3B30] font-medium px-1 animate-fade-in">{cardError}</span>
                  )}
                </div>

                <div className="mt-10 flex flex-col gap-3">
                  <button
                    onClick={handleSaveCard}
                    className="w-full bg-[#1E1E1E] text-white py-4 rounded-full font-bold text-[16px] hover:bg-[#2C2C2E] active:bg-[#2C2C2E] transition-all active:scale-[0.98] outline-none focus-visible:opacity-90 disabled:opacity-50"
                    disabled={cardNumber.length < 15 || expiry.length < 5 || cvv.length < 3}
                  >
                    Guardar Tarjeta
                  </button>
                  {editingCard && (
                    <button
                      onClick={handleDeleteCard}
                      className="w-full bg-white text-[#FF3B30] py-4 rounded-full font-bold text-[16px] hover:bg-[#FFF0F0] active:bg-[#FFF0F0] transition-all active:scale-[0.98] outline-none flex items-center justify-center gap-2"
                    >
                      <Trash size={20} weight="bold" />
                      Eliminar Tarjeta
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-[#1E1E1E]/40"
              onClick={() => setShowLogoutConfirm(false)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white w-full max-w-[320px] p-6 rounded-[24px] relative z-10 flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-[#FF3B30]/10 rounded-full flex items-center justify-center mb-4 text-[#FF3B30]">
                <SignOut size={32} weight="bold" />
              </div>
              <h3 className="text-xl font-bold text-[#1E1E1E] text-center mb-2">¿Cerrar Sesión?</h3>
              <p className="text-[#8E8E93] text-center text-[15px] mb-8">
                Tendrás que volver a ingresar para ver tus pedidos y favoritos.
              </p>
              
              <div className="flex w-full gap-3">
                <button 
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 bg-[#F3F4F6] text-[#1E1E1E] font-bold py-3.5 rounded-full hover:bg-[#ECECEE] active:bg-[#ECECEE] transition-all active:scale-[0.98] outline-none"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  className="flex-1 bg-[#FF3B30] text-white font-bold py-3.5 rounded-full hover:bg-[#E0332A] active:bg-[#E0332A] transition-all active:scale-[0.98] outline-none"
                >
                  Salir
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProfileScreen;
