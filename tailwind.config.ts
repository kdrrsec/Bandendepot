import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0E2A47", // Donkerblauw
          dark: "#0A1F35",
          light: "#1E3A5F",
          button: "#3B82F6", // Light blue voor buttons
        },
        secondary: {
          DEFAULT: "#1F2937",
          light: "#374151",
        },
        accent: {
          DEFAULT: "#F6B21A", // Geel accent
          dark: "#E5A018",
          light: "#FFC84A",
        },
        neutral: {
          DEFAULT: "#FFFFFF",
          light: "#F3F4F6",
          gray: "#F5F5F5",
        },
      },
    },
  },
  plugins: [],
};
export default config;







