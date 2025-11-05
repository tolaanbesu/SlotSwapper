// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { setAuthToken } from '../api';

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(() => {
//     try {
//       return JSON.parse(localStorage.getItem('user')) || null;
//     } catch { return null; }
//   });
//   const [token, setToken] = useState(() => localStorage.getItem('token') || null);

//   useEffect(() => {
//     setAuthToken(token);
//     if (token) localStorage.setItem('token', token); else localStorage.removeItem('token');
//     if (user) localStorage.setItem('user', JSON.stringify(user)); else localStorage.removeItem('user');
//   }, [token, user]);

//   const login = (t, u) => { setToken(t); setUser(u); };
//   const logout = () => { setToken(null); setUser(null); };

//   return <AuthContext.Provider value={{ user, token, login, logout }}>{children}</AuthContext.Provider>;
// }

// export function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error('useAuth must be within AuthProvider');
//   return ctx;
// }

// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { setAuthToken, api, MOCK_COLORS } from '../api';

const AuthContext = createContext();

function useProvideAuth() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false); // ✅ Add ready flag

  // Load user/token from localStorage once on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedToken) setToken(storedToken);

    setReady(true); // ✅ AuthProvider is ready
  }, []);

  // Sync token/user to localStorage and API header
  useEffect(() => {
    setAuthToken(token);
    if (token) localStorage.setItem('token', token); else localStorage.removeItem('token');
    if (user) localStorage.setItem('user', JSON.stringify(user)); else localStorage.removeItem('user');
  }, [token, user]);

  const login = (t, u) => { setToken(t); setUser(u); };
  const logout = () => { setToken(null); setUser(null); };

  const handleAuth = async (path, credentials) => {
    setLoading(true);
    try {
      const endpoint = path === 'login' ? '/auth/login' : '/auth/signup';
      const response = await api.post(endpoint, credentials);
      const { token, user: userData } = response.data;
      login(token, userData);
      return { success: true };
    } catch (error) {
      console.error("Auth error:", error.response ? error.response.data : error.message);
      return { 
        success: false, 
        message: error.response?.data?.message || "Authentication failed."
      };
    } finally {
      setLoading(false);
    }
  };

  return { user, token, loading, ready, login, logout, handleAuth, MOCK_COLORS };
}

export function AuthProvider({ children }) {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be within AuthProvider');
  return ctx;
}

