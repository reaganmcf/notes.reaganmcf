module.exports = {
  content: ["./src/**/*.{html,tsx}"],
  theme: {
    extend: {},
    colors: {
      transparent: "transparent",
      black: "#000",
      white: "#fff",
      "gray-light": "#F9FBFC",
      "gray-dark": "#E5E6E9",
    },
    fontFamily: {
      sans: ["Nunito"],
    },
  },

  plugins: [require("@tailwindcss/typography")],
}
