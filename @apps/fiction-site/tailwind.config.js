const colors = require("tailwindcss/colors")

const fiction = {
  50: "#fff2f8",
  100: "#ffe6f1",
  200: "#ffbfdd",
  300: "#ff99c8",
  400: "#ff4d9f",
  500: "#ff0076",
  600: "#e6006a",
  700: "#bf0059",
  800: "#990047",
  900: "#7d003a",
}

const factor = {
  50: "#f2f8ff",
  100: "#e6f1ff",
  200: "#c0dcff",
  300: "#9bc6ff",
  400: "#4f9cff",
  500: "#0471ff",
  600: "#0466e6",
  700: "#0355bf",
  800: "#024499",
  900: "#02377d",
}

// const grays = {
//   50: "#F4F7FA",
//   100: "#ebedee",
//   200: "#ced1d4",
//   300: "#b0b6bb",
//   400: "#8ba8bf",
//   500: "#3a4854",
//   600: "#34414c",
//   700: "#2c363f",
//   800: "#3a4854",
//   900: "#3a4854",
// }

const emerald = {
  50: "#ECFDF5",
  100: "#D1FAE5",
  200: "#A7F3D0",
  300: "#17ffa6",
  400: "#34D399",
  500: "#10B981",
  600: "#059669",
  700: "#047857",
  800: "#065F46",
  900: "#064E3B",
}

module.exports = {
  purge: ["./src/index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  plugins: [
    require("@tailwindcss/forms"),
    require("tailwindcss-responsive-embed"),
    require("tailwindcss-aspect-ratio"),
    require("@tailwindcss/typography"),
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      spacing: {
        108: "27rem",
        120: "30rem",
        132: "33rem",
      },
      typography: {
        DEFAULT: {
          css: {
            h1: {
              color: "#fff",
            },
            h2: {
              color: "#fff",
            },
            h3: {
              color: "#fff",
            },
            a: {
              color: "#fff",
              "&:hover": {
                color: "#D4D4D8",
              },
            },
          },
        },
      },
    },
    colors: {
      ...colors,
      transparent: "transparent",
      primary: fiction,
      pink: fiction,
      blue: factor,
      green: emerald,
    },
    aspectRatio: {
      square: [1, 1],
      screen: [1, 2],
    },
  },
}
