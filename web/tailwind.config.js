/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        flash: {
          50:  "#FFF8DB",
          100: "#FFEFAF",
          200: "#F7D970",
          300: "#E9BC3D",
          400: "#D59B21",
          500: "#B97816",
          600: "#96580F",
          700: "#79420B",
          800: "#5B3009",
          900: "#3B2007",
          950: "#1F1003",
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
        glow: "0 14px 60px -12px rgba(213, 155, 33, 0.58)",
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
