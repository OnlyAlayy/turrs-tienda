import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Configurar axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Verificar token al cargar
  useEffect(() => {
    // 1. Check for token in URL parameters (from Google OAuth redirect)
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');

    if (urlToken) {
      setToken(urlToken);
      // Clean up URL to hide token
      window.history.replaceState({}, document.title, window.location.pathname + window.location.search.replace(/([?&])token=[^&]+(&|$)/, '$1').replace(/[?&]$/, ''));
    }

    const verifyToken = async () => {
      const activeToken = urlToken || token;
      if (activeToken) {
        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${activeToken}`;
          const response = await axios.get(`${API_URL}/api/auth/verify`);
          setUser(response.data); // ✅ CAMBIAR: response.data en lugar de response.data.user
        } catch (error) {
          // Token inválido o expirado. El navegador ya mostrará el 401 en la red, 
          // no necesitamos hacer spam en la consola de React.
          logout();
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password
      });

      const { token: newToken, user: userData } = response.data;
      setToken(newToken);
      setUser(userData);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error en el login'
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, userData);

      const { token: newToken, user: userDataResponse } = response.data;
      setToken(newToken);
      setUser(userDataResponse);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error en el registro'
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};