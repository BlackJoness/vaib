/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        coral: "#FF7E67",
        manha: "#FFC857",
        brisa: "#7FD8BE",
        sereno: "#8EC5E8",
        creme: "#FFF8F0",
        grafite: "#33303E",
        ameixa: "#5B3E7E",
      },
      boxShadow: { soft: "0 10px 30px -12px rgba(91,62,126,0.18)" },
      borderRadius: { xl2: "1.25rem" },
    },
  },
  plugins: [],
};
