/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // Use CSS variables so dark mode works everywhere automatically
      colors: {
        ink: "rgb(var(--ink) / <alpha-value>)",
        canvas: "rgb(var(--canvas) / <alpha-value>)",
        "soft-cloud": "rgb(var(--soft-cloud) / <alpha-value>)",

        charcoal: "rgb(var(--charcoal) / <alpha-value>)",
        ash: "rgb(var(--ash) / <alpha-value>)",
        mute: "rgb(var(--mute) / <alpha-value>)",
        stone: "rgb(var(--stone) / <alpha-value>)",

        hairline: "rgb(var(--hairline) / <alpha-value>)",
        "hairline-soft": "rgb(var(--hairline-soft) / <alpha-value>)",

        sale: "#d30005",
        "sale-deep": "#780700",
        success: "#007d48",
        "success-bright": "#1eaa52",
        info: "#1151ff",
        "info-deep": "#0034e3",
      },

      borderRadius: {
        "nike-none": "0px",
        "nike-sm": "18px",
        "nike-md": "24px",
        "nike-lg": "30px",
        pill: "9999px",
      },

      spacing: {
        xxs: "2px",
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "18px",
        xl: "24px",
        xxl: "30px",
        section: "48px",
      },

      fontFamily: {
        sans: ["Inter", "system-ui", "Arial", "sans-serif"],
        display: ["Bebas Neue", "Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};