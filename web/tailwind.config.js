/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        flash: {
          50:  "#FBF6EA",
          100: "#F5E9C8",
          200: "#EAD296",
          300: "#DDB95F",
          400: "#CFA23C",
          500: "#B6862A",
          600: "#996E1E",
          700: "#7C5818",
          800: "#5F4314",
          900: "#46300F",
          950: "#271B08",
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
        glow: "0 10px 60px -10px rgba(153, 110, 30, 0.40)",
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
