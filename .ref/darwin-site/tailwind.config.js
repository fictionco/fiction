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
  75: "#eef0fa",
  100: "#e3eaf3",
  200: "#E3E8EE",
  300: "#d1dce5",
  400: "#aec2d2",
  500: "#8ba8bf",
  600: "#7d97ac",
  700: "#687e8f",
  800: "#536573",
  900: "#44525e",
  DEFAULT: "#33334f",
}
delete colors.lightBlue
module.exports = {
  mode: "jit",
  purge: {
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}", ...tw.paths],
    options: {
      safelist: ["bg-primary-600"],
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("tailwindcss-responsive-embed"),
    require("tailwindcss-aspect-ratio"),
    require("@tailwindcss/typography"),
  ],
  darkMode: false, // or 'media' or 'class'
  variants: {
    extend: {
      translate: ["group-hover"],
    },
  },
  theme: {
    extend: {
      spacing: {
        108: "27rem",
        120: "30rem",
        132: "33rem",
      },
      height: {
        "fit-content": "fit-content",
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme("colors.bluegray.700"),
            a: {
              color: theme("colors.primary.500"),
              "&:hover": {
                color: theme("colors.primary.600"),
              },
            },
            code: {
              background: theme("colors.primary.50"),
              fontWeight: "normal",
              padding: ".2rem .25rem",
              borderRadius: "0.5rem",
            },
            "code::before": {
              content: '""',
            },
            "code::after": {
              content: '""',
            },
            h1: {
              fontWeight: "600",
            },
            h2: {
              fontWeight: "600",
            },
            h3: {
              fontWeight: "500",
            },
            h4: {
              fontWeight: "500",
            },
          },
        },
      }),
    },
    colors: {
      ...colors,
      transparent: "transparent",
      primary: darwin,
      dark: darwinDark,
      bluegray: color,
      color,
      gray: color,
    },
    aspectRatio: {
      square: [1, 1],
      screen: [1, 2],
    },
  },
}
