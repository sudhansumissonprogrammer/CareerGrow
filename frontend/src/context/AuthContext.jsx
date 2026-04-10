/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from "react";
import { apiRequest } from "../api/client";
import { clearStoredUser, getStoredUser, setStoredUser } from "../utils/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser());
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      setLoading(true);
      const response = await apiRequest("/api/v1/user/me");
      const nextUser = response.user || null;
      setUser(nextUser);
      setStoredUser(nextUser);
      return nextUser;
    } catch {
      setUser(null);
      clearStoredUser();
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = (nextUser) => {
    setUser(nextUser || null);
    setStoredUser(nextUser || null);
  };

  const logout = async () => {
    try {
      await apiRequest("/api/v1/user/logout", { method: "POST" });
    } catch {
      // Clear local auth even if the server is unavailable.
    }

    clearStoredUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
