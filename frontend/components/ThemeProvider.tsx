"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { THEME_STORAGE_KEY, type ThemeMode } from "@/lib/theme";

type ThemeContextValue = { theme: ThemeMode; setTheme: (t: ThemeMode) => void; toggle: () => void };

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Mantém em estado React o tema que o script do <head> já aplicou no
 * <html data-theme>. Não decide o tema inicial (isso é do script, antes do
 * paint); só lê, troca e persiste a escolha do visitante.
 */
export function ThemeProvider({ children, initial }: { children: React.ReactNode; initial: ThemeMode }) {
  const [theme, setThemeState] = useState<ThemeMode>(initial);

  useEffect(() => {
    const atual = document.documentElement.dataset.theme;
    if (atual === "light" || atual === "dark") setThemeState(atual);
  }, []);

  const setTheme = useCallback((t: ThemeMode) => {
    document.documentElement.dataset.theme = t;
    setThemeState(t);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, t);
    } catch {
      // Navegação privada sem storage: o tema vale só para esta visita.
    }
  }, []);

  const toggle = useCallback(() => setTheme(theme === "dark" ? "light" : "dark"), [theme, setTheme]);

  return <ThemeContext.Provider value={{ theme, setTheme, toggle }}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme precisa estar dentro de <ThemeProvider>");
  return ctx;
}
