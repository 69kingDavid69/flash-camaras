/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        flash: {
          50:  "#FFF1F2",
          100: "#FFE0E3",
          200: "#FCC2C8",
          300: "#F79CA5",
          400: "#EE6873",
          500: "#DE2A3C",
          600: "#C8102E",
          700: "#A10C24",
          800: "#7A0A1C",
          900: "#560614",
          950: "#2E0009",
        },
        ink: {
          DEFAULT: "#0A0A0A",
          soft: "#1A1A1A",
          mute: "#3F3F3F",
        },
        bone: {
          DEFAULT: "#FAFAF7",
          soft: "#F5F5F2",
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', "serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 10px 60px -10px rgba(200, 16, 46, 0.35)",
        card: "0 20px 50px -20px rgba(10,10,10,0.18)",
      },
      animation: {
        "fade-up": "fadeUp 0.7s ease-out both",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(24px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
