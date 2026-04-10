/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useMemo } from "react";

const ThemeContext = createContext(null);
const LIGHT_THEME = "light";

export function ThemeProvider({ children }) {
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", LIGHT_THEME);
    root.style.colorScheme = LIGHT_THEME;
  }, []);

  const value = useMemo(
    () => ({
      theme: LIGHT_THEME,
      isDark: false,
      setTheme: () => {},
      toggleTheme: () => {},
    }),
    [],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return context;
}
