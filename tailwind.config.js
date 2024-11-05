/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryColor: "#fc8a06",
        secondaryColor: "#03081f",
        thirdColor: "#ededed",
        fourthColor: "#FAFAFA",
      },
    },
  },
  plugins: [],
};
