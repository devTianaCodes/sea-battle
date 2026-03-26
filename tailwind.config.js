/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Avenir Next", "Trebuchet MS", "sans-serif"],
        body: ["Avenir Next", "Segoe UI", "sans-serif"],
      },
      colors: {
        abyss: "#09111f",
        cyan: "#00d4ff",
        coral: "#ff6b6b",
        foam: "#dff7ff",
        lagoon: "#118ab2",
        mint: "#4ade80",
        navy: "#0f172a",
        storm: "#172033",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(0, 212, 255, 0.18), 0 18px 60px rgba(4, 14, 34, 0.45)",
      },
    },
  },
  plugins: [],
};
