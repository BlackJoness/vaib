import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        coral: { DEFAULT: "#FF7E67", 600: "#F2654D" },
        manha: "#FFC857",
        brisa: "#7FD8BE",
        sereno: "#8EC5E8",
        creme: "#FFF8F0",
        grafite: "#33303E",
        ameixa: "#5B3E7E",
      },
      fontFamily: {
        display: ["var(--font-poppins)", "sans-serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: { xl2: "1.25rem" },
      boxShadow: { soft: "0 10px 30px -12px rgba(91,62,126,0.18)" },
    },
  },
  plugins: [],
};
export default config;
