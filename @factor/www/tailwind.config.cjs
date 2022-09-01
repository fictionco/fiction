module.exports = {
  content: ["./src/**/*.{vue,js,ts,jsx,tsx,html}"],
  plugins: [require("@tailwindcss/forms")],

  theme: {
    extend: {
      colors: {
        transparent: "transparent",
      },
    },
  },
}
