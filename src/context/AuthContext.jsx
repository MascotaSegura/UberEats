import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const loadSaved = (key, defaultVal) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => loadSaved('ubereats_user', null));

  useEffect(() => {
    if (user) {
      localStorage.setItem('ubereats_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ubereats_user');
    }
  }, [user]);

  const login = (phone) => {
    // Simulated login with phone
    const isAdmin = phone === '9999999999';
    setUser({
      name: isAdmin ? 'Administrador' : `Usuario ${phone.slice(-4)}`,
      email: `${phone}@uber.com`,
      phone: phone,
      isAdmin: isAdmin
    });
  };

  const register = (phone, name) => {
    // Simulated registration
    const isAdmin = phone === '9999999999' || name.toLowerCase().includes('admin');
    setUser({
      name: name,
      email: `${phone}@uber.com`,
      phone: phone,
      isAdmin: isAdmin
    });
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (data) => {
    setUser(prev => {
      if (!prev) return prev;
      return { ...prev, ...data };
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
