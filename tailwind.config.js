/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#3498db",
        success: "#2ecc71",
        danger: "#e74c3c",
        "dark-gray": "#2c3e50",
        "light-gray": "#ecf0f1",
      },
    },
  },
  plugins: [],
};
