
import React, { createContext, useContext, useEffect, useState } from "react";
import { setAuthToken, api } from "../api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Set global API token
    setAuthToken(token);

    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");

    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [token, user]);

  const login = (t, u) => {
    setToken(t);
    setUser(u);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const handleAuth = async (path, credentials) => {
    setLoading(true);
    try {
      const endpoint = path === "login" ? "/auth/login" : "/auth/signup";
      const response = await api.post(endpoint, credentials);
      const { token, user: userData } = response.data;
      login(token, userData);
      return { success: true };
    } catch (error) {
      console.error("Auth error:", error.response ? error.response.data : error.message);
      return {
        success: false,
        message: error.response?.data?.message || "Authentication failed.",
      };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        handleAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}


