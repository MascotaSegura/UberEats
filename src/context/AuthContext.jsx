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
  const [user, setUser] = useState(() => loadSaved('didi_user', null));

  useEffect(() => {
    if (user) {
      localStorage.setItem('didi_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('didi_user');
    }
  }, [user]);

  const login = (phone) => {
    // Simulated login with phone
    setUser({
      name: `Usuario ${phone.slice(-4)}`,
      email: `${phone}@uber.com`,
      phone: phone
    });
  };

  const register = (phone, name) => {
    // Simulated registration
    setUser({
      name: name,
      email: `${phone}@uber.com`,
      phone: phone
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
