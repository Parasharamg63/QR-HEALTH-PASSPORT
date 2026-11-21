import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [passport, setPassport] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  const initAuth = async () => {
    setLoading(true);
    try {
      if (token) {
        const res = await api.getMe();
        if (res.success) {
          setUser(res.user);
          setPassport(res.passport);
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Initial auth fetch error, switching to default demo user:', err.message);
    }

    // Default to Patient Rameshwar Gowda demo user if no token or expired
    try {
      const demoRes = await api.switchDemo({ role: 'patient' });
      if (demoRes.success) {
        localStorage.setItem('token', demoRes.token);
        setToken(demoRes.token);
        setUser(demoRes.user);
        setPassport(demoRes.passport);
      }
    } catch (err) {
      console.error('Failed to load default demo user:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initAuth();
  }, []);

  const switchPersona = async (role, email) => {
    setLoading(true);
    try {
      const res = await api.switchDemo({ role, email });
      if (res.success) {
        localStorage.setItem('token', res.token);
        setToken(res.token);
        setUser(res.user);
        setPassport(res.passport);
      }
    } catch (err) {
      console.error('Switch demo persona error:', err.message);
    } finally {
      setLoading(false);
    }
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
    <AuthContext.Provider value={{ user, passport, token, loading, switchPersona, refreshPassport }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
