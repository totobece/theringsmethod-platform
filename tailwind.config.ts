import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        slidein: {
          from: { opacity: "0", transform: "translateY(-10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        slidein: "slidein 1s ease 300ms",
      },
      colors: {
        white: "#ffffff",
        darkgrad: "rgba(0, 0, 0, 0.7)",
        cream: "#EFEEE7",
        wine: "#58011D",
        winedark: "#320013",
        darkwine: "#3F1723",
        darkerwine: "#38101B",
        gray: {
          100: "#ffffff",
          200: "#B3B3B3",
          300: "#61605e",
          400: "#ffffff",
          500: "#63625D",
          600: "#434343",
          700: "#202020",
        },
        /* New design system */
        pink: "#ff6b9d",
        "dark-red": "#8b2635",
        "green-primary": "#4CAF50",
        "green-dark": "#2E7D32",
        "trm-black": "#000000",
        "trm-bg": "#1a1a1a",
        "trm-bg-alt": "#111111",
        "trm-muted": "#888888",
      },
    },
  },
  plugins: [],
};
export default config;