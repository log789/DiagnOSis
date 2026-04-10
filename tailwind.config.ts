import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        medical: {
          50: "#eef8ff",
          100: "#d8eeff",
          200: "#b6deff",
          300: "#82c8ff",
          400: "#46a8ff",
          500: "#1e84ff",
          600: "#0b69f0",
          700: "#0953c2",
          800: "#0c499d",
          900: "#113f7b"
        }
      },
      boxShadow: {
        medical: "0 10px 30px rgba(30, 132, 255, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
