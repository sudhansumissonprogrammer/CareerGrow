/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        "skeuo-toggle":
          "0 14px 28px rgba(0,0,0,0.2), inset -2px -2px 4px rgba(255,255,255,0.15), inset 3px 3px 6px rgba(0,0,0,0.18)",
        "skeuo-toggle-hover":
          "0 16px 32px rgba(0,0,0,0.25), 0 0 24px rgba(130,185,255,0.28), inset -2px -2px 4px rgba(255,255,255,0.15), inset 3px 3px 6px rgba(0,0,0,0.18)",
        "skeuo-glow": "0 0 22px rgba(120,170,255,0.45)",
      },
      backgroundImage: {
        "skeuo-light": "linear-gradient(135deg, #f7eec2 0%, #dbe9ff 50%, #b9d9ff 100%)",
        "skeuo-dark": "linear-gradient(135deg, #090f21 0%, #111f3f 52%, #1f2f58 100%)",
      },
      transitionTimingFunction: {
        luxury: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      keyframes: {
        "icon-pulse": {
          "0%": { transform: "scale(1)" },
          "40%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)" },
        },
        "glow-sweep": {
          "0%": { opacity: "0", transform: "translateX(-120%)" },
          "35%": { opacity: "0.85" },
          "100%": { opacity: "0", transform: "translateX(140%)" },
        },
      },
      animation: {
        "icon-pulse": "icon-pulse 560ms cubic-bezier(0.4, 0, 0.2, 1) both",
        "glow-sweep": "glow-sweep 620ms cubic-bezier(0.4, 0, 0.2, 1) both",
      },
    },
  },
  plugins: [],
}
