import type { Config } from "tailwindcss";

// Cores semânticas: cada uma lê uma CSS variable de app/globals.css, que muda
// com o tema (data-theme). Nenhum componente usa hex fixo.
const rgb = (v: string) => `rgb(var(--${v}) / <alpha-value>)`;

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: rgb("canvas"),
        raised: rgb("raised"),
        fg: rgb("fg"),
        muted: rgb("muted"),
        accent: { DEFAULT: rgb("accent"), strong: rgb("accent-strong") },
        "on-accent": rgb("on-accent"),
        danger: rgb("danger"),
      },
      fontFamily: {
        sans: ["var(--font-geist)", "system-ui", "sans-serif"],
        display: ["var(--font-geist)", "system-ui", "sans-serif"],
        serif: ["var(--font-instrument)", "Georgia", "serif"],
      },
      borderRadius: { xl2: "1.25rem", panel: "1.75rem" },
      boxShadow: { soft: "var(--glass-shadow)" },
      letterSpacing: { display: "-0.035em" },
    },
  },
  plugins: [],
};
export default config;
