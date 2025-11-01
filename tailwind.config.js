const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,jsx,ts,tsx}",
  ],

  safelist: [
    // Nur nötig für deine dynamischen Farbwerte (z. B. bg-${color}-500)
    {
      pattern:
        /((hover|focus):)?(bg|text|border|ring|fill|stroke|from|via|to)-(blue|violet|pink|orange|green|teal|yellow|rose|slate|cyan|lime|purple)-(100|200|300|400|500|600|700|800)/,
    },
  ],

  theme: {
    extend: {},
  },

  plugins: [nextui({ addCommonColors: true })],
};