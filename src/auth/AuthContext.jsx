import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = (email, password) => {
    // Simulasi autentikasi admin
    if (email === 'admin@nindyamart.com' && password === 'admin123') {
      const adminUser = {
        id: 1,
        name: 'Admin NindyaMart',
        email,
        role: 'admin',
        token: 'admin-token-123'
      };
      setUser(adminUser);
      return { success: true, user: adminUser };
    }
    
    // Simulasi user biasa
    if (email === 'user@nindyamart.com' && password === 'user123') {
      const regularUser = {
        id: 2,
        name: 'Customer NindyaMart',
        email,
        role: 'user',
        token: 'user-token-456'
      };
      setUser(regularUser);
      return { success: true, user: regularUser };
    }

    // Default user untuk testing
    if (email === 'customer@nindyamart.com' && password === 'customer123') {
      const customerUser = {
        id: 3,
        name: 'Pelanggan',
        email,
        role: 'user',
        token: 'customer-token-789'
      };
      setUser(customerUser);
      return { success: true, user: customerUser };
    }

    return { success: false, message: 'Email atau password salah' };
  };

  const logout = () => {
    setUser(null);
  };

  const isAdmin = () => user?.role === 'admin';
  const isUser = () => user?.role === 'user';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;