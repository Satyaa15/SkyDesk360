import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('userName');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (token) {
      setUser({ name, isAdmin });
    }
  }, []);

  const login = (userData) => {
    localStorage.setItem('token', userData.access_token);
    localStorage.setItem('userName', userData.full_name);
    localStorage.setItem('isAdmin', userData.is_admin);
    localStorage.setItem('user_id', userData.user_id);
    setUser({ name: userData.full_name, isAdmin: userData.is_admin });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);