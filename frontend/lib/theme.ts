import type { CSSProperties } from "react";
import type { StoreConfig } from "./store-config.schema";

export type ThemeMode = "light" | "dark";

/** Chave do localStorage com a escolha do visitante. */
export const THEME_STORAGE_KEY = "vaib-theme";

/**
 * "#C98A5E" -> "201 138 94".
 * O Tailwind precisa dos canais separados para aplicar opacidade
 * (`bg-accent/15` vira `rgb(201 138 94 / 0.15)`).
 */
export function hexToRgbChannels(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

/**
 * CSS variables do acento, aplicadas no <html> pelo layout raiz.
 * globals.css decide qual par vale em cada tema.
 */
export function themeStyle(theme: StoreConfig["theme"]): CSSProperties {
  return {
    "--accent-light": hexToRgbChannels(theme.accent),
    "--accent-light-strong": hexToRgbChannels(theme.accentStrong),
    "--accent-dark": hexToRgbChannels(theme.accentDark),
    "--accent-dark-strong": hexToRgbChannels(theme.accentDarkStrong),
  } as CSSProperties;
}

/** Tema que o servidor escreve no HTML antes de o script decidir. */
export function serverTheme(theme: StoreConfig["theme"]): ThemeMode {
  return theme.defaultMode === "dark" ? "dark" : "light";
}

/**
 * Script inline no <head>: aplica o tema antes do primeiro paint, para a
 * página não piscar no tema errado. Ordem: escolha salva > padrão do config
 * > preferência do sistema (quando o padrão é "system").
 * Precisa ser autocontido: roda antes do React.
 */
export function themeInitScript(defaultMode: StoreConfig["theme"]["defaultMode"]): string {
  return `(function(){var d=document.documentElement;try{var s=localStorage.getItem(${JSON.stringify(
    THEME_STORAGE_KEY,
  )});var m=${JSON.stringify(defaultMode)};var t=s==="light"||s==="dark"?s:m==="system"?(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"):m;d.dataset.theme=t;}catch(e){}})();`;
}
