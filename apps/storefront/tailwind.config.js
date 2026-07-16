/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0066CC",
          hover: "#0052A3",
          light: "#E8F0FE",
        },
        secondary: {
          DEFAULT: "#00A86B",
          hover: "#008A57",
          light: "#E6F7F1",
        },
        accent: "#FF6B35",
        background: "#F5F7FA",
        surface: "#FFFFFF",
        text: "#1A1A2E",
        muted: "#6B7280",
        border: "#E2E8F0",
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
      },
      fontFamily: {
        heading: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 8px rgba(0,0,0,0.08)",
        "card-hover": "0 8px 24px rgba(0,0,0,0.12)",
      },
    },
  },
  plugins: [],
};
