module.exports = {
  content: ["./src/**/*.{html,tsx}"],
  theme: {
    extend: {},
    colors: {
      transparent: 'transparent',
      black: '#000',
      white: '#fff',
      blue: "#25283D",
      "light-blue": "#98DFEA",
    },
    fontFamily: {
      sans: ["Nunito"]
    }
  },

  plugins: [require('@tailwindcss/typography')],
}
