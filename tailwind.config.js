/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/rizzui/dist/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryColor: "#fc8a06",
        secondaryColor: "#03081f",
        thirdColor: "#ededed",
        fourthColor: "#FAFAFA",
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite', // Rotation plus lente
      },
    },
  },
  plugins: [],
};
