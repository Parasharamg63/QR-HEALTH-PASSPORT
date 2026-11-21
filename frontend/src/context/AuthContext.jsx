import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [passport, setPassport] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  // Initialize auth from existing token if present
  const initAuth = async () => {
    setLoading(true);
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      try {
        const res = await api.getMe();
        if (res.success && res.user) {
          setUser(res.user);
          setPassport(res.passport);
          setToken(savedToken);
        } else {
          // Token invalid or expired
          localStorage.removeItem('token');
          setToken('');
          setUser(null);
          setPassport(null);
        }
      } catch (err) {
        console.warn('Session expired or invalid, logging out:', err.message);
        localStorage.removeItem('token');
        setToken('');
        setUser(null);
        setPassport(null);
      }
    } else {
      setUser(null);
      setPassport(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    initAuth();
  }, []);

  // Standard Login
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.login({ email, password });
      if (res.success) {
        localStorage.setItem('token', res.token);
        setToken(res.token);
        setUser(res.user);
        setPassport(res.passport || null);
        return { success: true, user: res.user };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (err) {
      return { success: false, message: err.message || 'Invalid email or password' };
    } finally {
      setLoading(false);
    }
  };

  // Standard Register
  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await api.register(userData);
      if (res.success) {
        localStorage.setItem('token', res.token);
        setToken(res.token);
        setUser(res.user);
        setPassport(res.passport || null);
        return { success: true, user: res.user, passport: res.passport };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } catch (err) {
      return { success: false, message: err.message || 'Registration error' };
    } finally {
      setLoading(false);
    }
  };

  // Standard Logout
  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
    setPassport(null);
  };

  const refreshPassport = async () => {
    try {
      const res = await api.getMyPassport();
      if (res.success) {
        setPassport(res.passport);
      }
    } catch (err) {
      console.error('Refresh passport error:', err.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, passport, token, loading, login, register, logout, refreshPassport }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
