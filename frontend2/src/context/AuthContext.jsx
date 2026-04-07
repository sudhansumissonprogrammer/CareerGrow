import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest } from "../api/client";
import { clearStoredUser, getStoredUser, setStoredUser } from "../utils/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser());
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiRequest("/api/v1/user/me");
      const nextUser = response.user || null;
      setUser(nextUser);
      setStoredUser(nextUser);
      return nextUser;
    } catch (_error) {
      setUser(null);
      clearStoredUser();
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = useCallback((nextUser) => {
    setUser(nextUser || null);
    setStoredUser(nextUser || null);
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiRequest("/api/v1/user/logout", { method: "POST" });
    } catch (_error) {
      // Ignore logout network errors and clear local auth state anyway.
    }
    clearStoredUser();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      refreshUser,
      login,
      logout,
      isAuthenticated: Boolean(user),
    }),
    [user, loading, refreshUser, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
