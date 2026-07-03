/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1E4D3D",
        "primary-hover": "#163A2E",
        secondary: "#7EA36E",
        accent: "#D4A84F",
        background: "#F8FAF8",
        surface: "#FFFFFF",
        text: "#1F2937",
        muted: "#6B7280",
        border: "#E5E7EB",
      },
      fontFamily: {
        heading: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      borderRadius: {
        xl: "16px",
        "2xl": "20px",
      },
    },
  },
  plugins: [],
};