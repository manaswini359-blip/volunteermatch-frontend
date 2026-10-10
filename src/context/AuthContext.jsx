import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = authService.getToken();
    const savedUser = authService.getCurrentUser();
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    if (res.data) {
      setUser(res.data);
      setToken(res.data.token);
    }
    return res;
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    if (res.data) {
      setUser(res.data);
      setToken(res.data.token);
    }
    return res;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const updateUser = (updatedFields) => {
    const newUser = { ...user, ...updatedFields };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const isVolunteer = user?.role === 'VOLUNTEER';
  const isOrganization = user?.role === 'ORGANIZATION';
  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateUser,
        isVolunteer,
        isOrganization,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
