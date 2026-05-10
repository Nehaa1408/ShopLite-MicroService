/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {

      colors: {
        // CORE
        background: "#f9f5ff",
        surface: "#ffffff",

        // PRIMARY
        primary: "#2563eb",
        "primary-soft": "#3b82f6",

        // SURFACES
        "surface-low": "#f2f1ff",
        "surface-mid": "#e6e4ff",

        // TEXT
        "text-main": "#2b2a51",
        "text-muted": "#6b6a85",

        // BORDER
        border: "#e6e4ff",

        // STATUS
        success: "#10b981",
        warning: "#f59e0b",
        danger: "#ef4444",
      },

      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Manrope", "sans-serif"],
      },

      boxShadow: {
        // LIGHTWEIGHT SHADOWS
        soft: "0 2px 12px rgba(43,42,81,0.06)",
        medium: "0 8px 24px rgba(43,42,81,0.08)",
        hover: "0 12px 28px rgba(43,42,81,0.10)",

        // GLOW
        glow: "0 0 18px rgba(37,99,235,0.18)",
        "glow-soft": "0 0 10px rgba(37,99,235,0.12)",
      },

      borderRadius: {
        xl: "12px",
        "2xl": "18px",
        "3xl": "28px",
      },

      keyframes: {

        floatY: {
          "0%, 100%": {
            transform: "translateY(0px)",
          },

          "50%": {
            transform: "translateY(-10px)",
          },
        },

        fadeIn: {
          from: {
            opacity: "0",
            transform: "translateY(10px)",
          },

          to: {
            opacity: "1",
            transform: "translateY(0px)",
          },
        },
      },

      animation: {
        floatY: "floatY 4s ease-in-out infinite",
        fadeIn: "fadeIn 0.3s ease forwards",
      },

      backdropBlur: {
        xs: "2px",
      },
    },
  },

  plugins: [],
};