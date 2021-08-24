const colors = require("tailwindcss/colors")
const tw = require("@factor/server-utils/tailwind")

const darwin = {
  50: "#f6f5ff",
  100: "#eeebff",
  200: "#d4ccff",
  300: "#baadff",
  400: "#8670ff",
  500: "#5233ff",
  600: "#4a2ee6",
  700: "#3e26bf",
  800: "#311f99",
  900: "#211c36",
}
const darwinDark = {
  50: "#f6f5ff",
  100: "#e4dfed",
  200: "#e4d7fc",
  300: "#baadff",
  400: "#8670ff",
  500: "#5233ff",
  600: "#48416e",
  700: "#3e26bf",
  800: "#2b2645",
  900: "#211c36",
}

const color = {
  25: "#fafafa",
  50: "#F8FAFC",
  75: "#F8FAFC",
  100: "#e3eaf3",
  200: "#E3E8EE",
  300: "#d1dce5",
  400: "#aec2d2",
  500: "#8ba8bf",
  600: "#7d97ac",
  700: "#687e8f",
  800: "#536573",
  900: "#44525e",
}

delete colors.lightBlue

module.exports = {
  mode: "jit",
  purge: {
    content: ["./src/**/*.{vue,js,ts,jsx,tsx,html}", ...tw.paths],
  },
  plugins: [require("@tailwindcss/forms")],

  theme: {
    colors: {
      ...colors,
      transparent: "transparent",
      primary: darwin,
      dark: darwinDark,
      bluegray: color,
      color,
    },
  },
}
