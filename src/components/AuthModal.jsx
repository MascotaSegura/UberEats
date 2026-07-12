import React, { useState, useContext, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, User, Phone, CaretLeft } from '@phosphor-icons/react';
import { AuthContext } from '../context/AuthContext';

const AuthModal = ({ isOpen, onClose, initialView = 'login' }) => {
  const { user, login, register, logout } = useContext(AuthContext);
  
  // Views: 'phone_input', 'verify_code', 'name_input', 'profile'
  const [view, setView] = useState('phone_input');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+52');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  
  const isSignup = initialView === 'signup';
  useEffect(() => {
    if (isOpen) {
      if (user) {
        setView('profile');
      } else {
        setView('phone_input');
      }
      setPhone('');
      setCode('');
      setName('');
      setError('');
    }
  }, [isOpen, initialView, user]);

  console.log('AuthModal render, isOpen:', isOpen);

  if (!isOpen) return null;

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (phone.length < 10) {
      setError('Ingresa un número de teléfono válido (10 dígitos).');
      return;
    }
    setView('verify_code');
  };

  const submitCode = (currentCode) => {
    setError('');
    if (currentCode.length < 4) {
      setError('Ingresa el código de 4 dígitos.');
      return;
    }
    
    if (isSignup) {
      setView('name_input');
    } else {
      login(phone);
      onClose();
    }
  };

  const handleCodeSubmit = (e) => {
    e.preventDefault();
    submitCode(code);
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (name.trim().length < 2) {
      setError('Ingresa un nombre válido (mínimo 2 letras).');
      return;
    }
    register(phone, name.trim());
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-end md:items-center justify-center bg-[#1E1E1E]/40 md:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full h-auto max-h-[80vh] md:max-w-[400px] flex flex-col rounded-t-2xl md:rounded-2xl overflow-hidden relative animate-slide-up md:animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-4 shrink-0 relative">
          {view === 'verify_code' && (
            <button
              onClick={() => setView('phone_input')}
              className="absolute left-4 w-9 h-9 flex items-center justify-center rounded-full bg-[#F3F4F6] hover:bg-[#ECECEE] active:bg-[#ECECEE] transition-all outline-none"
            >
              <CaretLeft size={20} weight="bold" color="#1E1E1E" />
            </button>
          )}
          {view === 'name_input' && (
            <button
              onClick={() => setView('verify_code')}
              className="absolute left-4 w-9 h-9 flex items-center justify-center rounded-full bg-[#F3F4F6] hover:bg-[#ECECEE] active:bg-[#ECECEE] transition-all outline-none"
            >
              <CaretLeft size={20} weight="bold" color="#1E1E1E" />
            </button>
          )}
          <h2 className="flex-1 text-center font-semibold text-lg text-[#1E1E1E]">
            {view === 'phone_input' && (isSignup ? 'Crea tu cuenta' : 'Iniciar sesión')}
            {view === 'verify_code' && 'Verifica tu número'}
            {view === 'name_input' && 'Ingresa tu nombre'}
            {view === 'profile' && 'Mi Perfil'}
          </h2>
          <button
            className="absolute right-4 w-9 h-9 bg-[#F3F4F6] rounded-full flex items-center justify-center hover:bg-[#ECECEE] active:bg-[#ECECEE] active:scale-[0.95] outline-none focus-visible:bg-[#ECECEE] transition-all shrink-0"
            onClick={onClose}
          >
            <X size={18} weight="bold" color="#1E1E1E" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          {view === 'profile' ? (
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-[#F3F4F6] rounded-full flex items-center justify-center mb-4">
                <User size={48} weight="fill" color="#D1D1D6" />
              </div>
              <h3 className="text-xl font-bold text-[#1E1E1E] mb-1">{user.name}</h3>
              <p className="text-[#8E8E93] mb-8">{user.phone || user.email}</p>
              
              <button
                className="w-full bg-[#F3F4F6] text-[#1E1E1E] py-3.5 rounded-full font-medium hover:bg-[#ECECEE] active:bg-[#ECECEE] transition-all active:scale-[0.98] outline-none focus-visible:bg-[#ECECEE]"
                onClick={() => {
                  logout();
                  onClose();
                }}
              >
                Cerrar Sesión
              </button>
            </div>
          ) : view === 'phone_input' ? (
            <form onSubmit={handlePhoneSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5 mt-2">
                <p className="text-[15px] text-[#8E8E93] mb-4 text-center">
                  {isSignup 
                    ? 'Ingresa tu número de celular para crear una cuenta nueva.'
                    : 'Ingresa tu número de celular para acceder a tu cuenta.'}
                </p>
                <div className="flex items-center bg-[#F3F4F6] rounded-2xl px-4 h-14 focus-within:bg-[#ECECEE] transition-colors relative">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="absolute inset-y-0 left-0 w-20 opacity-0 cursor-pointer"
                  >
                    <option value="+52">🇲🇽 +52</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+34">🇪🇸 +34</option>
                    <option value="+54">🇦🇷 +54</option>
                    <option value="+57">🇨🇴 +57</option>
                  </select>
                  <div className="text-[15px] font-medium text-[#1E1E1E] pr-3 mr-3 flex items-center pointer-events-none">
                    {countryCode}
                  </div>
                  <Phone size={20} color="#8E8E93" className="mr-2 shrink-0 pointer-events-none" />
                  <input
                    type="tel"
                    autoComplete="tel"
                    placeholder="55 0000 0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="flex-1 bg-transparent outline-none text-[16px] text-[#1E1E1E] placeholder:text-[#8E8E93] min-w-0"
                    autoFocus
                  />
                </div>
              </div>

              {error && (
                <p className="text-[#FF3B30] text-[13px] mt-1 text-center font-medium">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-[#1E1E1E] text-white py-4 rounded-full font-medium mt-4 hover:bg-[#2C2C2E] active:bg-[#2C2C2E] transition-all active:scale-[0.98] outline-none"
              >
                Continuar
              </button>
            </form>
          ) : view === 'verify_code' ? (
            <form onSubmit={handleCodeSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5 mt-2 text-center">
                <p className="text-[15px] text-[#8E8E93] mb-4">
                  Ingresa el código de 4 dígitos enviado al <span className="font-semibold text-[#1E1E1E]">{countryCode} {phone}</span>
                </p>
                <div className="flex items-center justify-center bg-[#F3F4F6] rounded-2xl px-4 h-14 mx-auto w-48 focus-within:bg-[#ECECEE] transition-colors">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="one-time-code"
                    maxLength={4}
                    placeholder="0000"
                    value={code}
                    onChange={(e) => {
                      const newCode = e.target.value.replace(/\D/g, '').slice(0, 4);
                      setCode(newCode);
                      if (newCode.length === 4) {
                        submitCode(newCode);
                      }
                    }}
                    className="w-full bg-transparent outline-none text-[24px] tracking-[0.5em] text-center font-semibold text-[#1E1E1E] placeholder:text-[#D1D1D6] ml-3"
                    autoFocus
                  />
                </div>
              </div>

              {error && (
                <p className="text-[#FF3B30] text-[13px] mt-1 text-center font-medium">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-[#1E1E1E] text-white py-4 rounded-full font-medium mt-4 hover:bg-[#2C2C2E] active:bg-[#2C2C2E] transition-all active:scale-[0.98] outline-none"
              >
                Verificar código
              </button>
              
              <button
                type="button"
                className="text-[14px] text-[#8E8E93] font-medium hover:text-[#1E1E1E] transition-colors mt-2 outline-none"
              >
                Reenviar código
              </button>
            </form>
          ) : (
            <form onSubmit={handleNameSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5 mt-2 text-center">
                <p className="text-[15px] text-[#8E8E93] mb-4">
                  ¿Cómo te llamas?
                </p>
                <div className="flex items-center justify-center bg-[#F3F4F6] rounded-2xl px-4 h-14 w-full focus-within:bg-[#ECECEE] transition-colors">
                  <input
                    type="text"
                    autoComplete="name"
                    autoCapitalize="words"
                    placeholder="Nombre completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-transparent outline-none text-[16px] text-center font-medium text-[#1E1E1E] placeholder:text-[#D1D1D6]"
                    autoFocus
                  />
                </div>
              </div>

              {error && (
                <p className="text-[#FF3B30] text-[13px] mt-1 text-center font-medium">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-[#1E1E1E] text-white py-4 rounded-full font-medium mt-4 hover:bg-[#2C2C2E] active:bg-[#2C2C2E] transition-all active:scale-[0.98] outline-none"
              >
                Crear cuenta
              </button>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AuthModal;
