/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // CORE SYSTEM (clean + premium)
        background: "#f9f5ff",
        surface: "#ffffff",

        primary: "#2563eb",        // clean modern blue
        "primary-soft": "#3b82f6", // lighter blue

        // SURFACE SYSTEM (minimal)
        "surface-low": "#f2f1ff",
        "surface-mid": "#e6e4ff",

        //  TEXT
        "text-main": "#2b2a51",
        "text-muted": "#6b6a85",

        //  UTIL
        border: "#e6e4ff",
      },

      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Manrope", "sans-serif"],
      },

      boxShadow: {
        soft: "0 4px 20px rgba(43, 42, 81, 0.06)",
        hover: "0 12px 32px rgba(43, 42, 81, 0.10)",


        glow: "0 4px 20px rgba(37, 99, 235, 0.25)",
        "glow-soft": "0 2px 10px rgba(37, 99, 235, 0.15)",
        "glow-white": "0 0 20px rgba(255,255,255,0.6)",
      },

      borderRadius: {
        xl: "12px",
        "2xl": "16px",
      },
      keyframes: {
        floatY: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
      },
      animation: {
        floatY: 'floatY 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};