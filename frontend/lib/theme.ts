import type { CSSProperties } from "react";
import type { StoreConfig } from "./store-config.schema";

/**
 * "#FF7E67" -> "255 126 103".
 * O Tailwind precisa dos canais separados para aplicar opacidade
 * (`bg-coral/12` vira `rgb(255 126 103 / 0.12)`).
 */
export function hexToRgbChannels(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

/** CSS variables de tema, aplicadas no <html> pelo layout raiz. */
export function themeStyle(theme: StoreConfig["theme"]): CSSProperties {
  return {
    "--accent": hexToRgbChannels(theme.accent),
    "--accent-strong": hexToRgbChannels(theme.accentStrong),
  } as CSSProperties;
}
