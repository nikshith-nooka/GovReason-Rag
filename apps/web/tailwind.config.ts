import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        forest:  { DEFAULT: "#123C35", light: "#1B5247" },
        jade:    { DEFAULT: "#2F6B5F", light: "#3D8474" },
        saffron: { DEFAULT: "#E8A317", light: "#F5BC45" },
        mint:    { DEFAULT: "#D8F3EA", dark: "#B2E2CE" },
        ivory:   { DEFAULT: "#FAFAF7", alt: "#F4F5F1" },
        civic: {
          text:      "#17211F",
          secondary: "#71807B",
          muted:     "#9AABA5",
          border:    "#E5E9E6",
          success:   "#16805A",
          error:     "#C94A4A",
          warning:   "#C47F0C",
        }
      },
      fontFamily: {
        sans:    ["Inter", "Manrope", "system-ui", "sans-serif"],
        display: ["Manrope", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        xs:  "0 1px 2px rgba(23,33,31,0.06)",
        sm:  "0 2px 6px rgba(23,33,31,0.08), 0 1px 2px rgba(23,33,31,0.04)",
        md:  "0 4px 16px rgba(23,33,31,0.10), 0 1px 4px rgba(23,33,31,0.06)",
        lg:  "0 8px 32px rgba(23,33,31,0.12), 0 2px 8px rgba(23,33,31,0.06)",
      },
      borderRadius: {
        "2": "2px",
        "3": "3px",
        "4": "4px",
        "6": "6px",
        "8": "8px",
        "10": "10px",
        "12": "12px",
        "16": "16px",
      }
    },
  },
  plugins: [],
};
export default config;
