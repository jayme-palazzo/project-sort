import React, { createContext, useState, useContext, useEffect } from 'react';
import AuthService from '../services/AuthService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Validate token on initial load
  useEffect(() => {
    const validateAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Add a validate endpoint call to check if token is valid and user exists
          const userData = await AuthService.validateToken();
          setUser(userData);
        } catch (error) {
          console.log('Invalid token or user not found:', error);
          // Clear invalid authentication data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    validateAuth();
  }, []);

  const login = async (email, password) => {
    const data = await AuthService.login(email, password);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  const register = async (username, email, password) => {
    const data = await AuthService.register(username, email, password);
    setUser(data.user);
    return data;
  };

  if (loading) {
    return <div>Loading...</div>; // Or your loading component
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
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
