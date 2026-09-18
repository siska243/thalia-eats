/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    // rizzui est utilise par l'application : sans ce chemin, Tailwind purge
    // les classes de la bibliotheque et ses composants perdent leur style.
    "./node_modules/rizzui/dist/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Orange Thalia. Le produit en portait quatre : #fc8a06 ici, #f28a3c
        // sur les barres de defilement, #e3732c au survol, et #F99D1C sur le
        // mobile. C'est cette derniere qui fait foi — le mobile est refait
        // dessus, et une marque n'a qu'une couleur.
        brand: {
          50: "#FFF8ED",
          100: "#FEEBC8",
          200: "#FDD68D",
          300: "#FCBC52",
          400: "#FAA92C",
          500: "#F99D1C",
          600: "#DB7E0B",
          700: "#B25F0C",
        },
        ink: {
          DEFAULT: "#111827",
          muted: "#6B7280",
          subtle: "#9CA3AF",
          inverse: "#FFFFFF",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          sunken: "#F5F6F8",
          border: "#E9EAEE",
        },
        success: {DEFAULT: "#0F9D58", surface: "#E7F6EE"},
        danger: {DEFAULT: "#D93025", surface: "#FCEBEA"},
        warning: {DEFAULT: "#B26B00", surface: "#FFF4E0"},

        // Anciens noms, conserves comme alias : 47 fichiers les utilisent, et
        // les renommer d'un coup serait une refonte a l'aveugle. Ils pointent
        // desormais sur la couleur de marque unique, ce qui suffit a unifier
        // l'apparence sans toucher a ces fichiers.
        primaryColor: "#F99D1C",
        secondaryColor: "#03081f",
        thirdColor: "#ededed",
        fourthColor: "#FAFAFA",
      },
      borderRadius: {
        card: "20px",
        control: "14px",
        pill: "999px",
      },
      fontSize: {
        caption: ["13px", {lineHeight: "18px"}],
        body: ["15px", {lineHeight: "22px"}],
        title: ["20px", {lineHeight: "26px"}],
        display: ["28px", {lineHeight: "34px"}],
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,24,40,0.06), 0 4px 12px rgba(16,24,40,0.05)",
        raised: "0 2px 6px rgba(16,24,40,0.08), 0 12px 28px rgba(16,24,40,0.10)",
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
      },
    },
  },
  plugins: [],
};
