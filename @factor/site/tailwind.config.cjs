module.exports = {
  content: ["./src/**/*.{vue,js,ts,jsx,tsx,html}"],
  plugins: [require("@tailwindcss/forms")],

  theme: {
    extend: {
      maxWidth: {
        input: "var(--input-max-width, 100%)",
        "input-lg": "var(--input-max-width-lg, 100%)",
      },
      fontSize: {
        "input-size": [
          "var(--input-size)",
          {
            lineHeight: "calc(var(--input-size) * 1.4)",
          },
        ],
        "input-label-size": [
          "var(--input-label-size, .875rem)",
          {
            lineHeight: "calc(var(--input-label-size) * 1.4)",
          },
        ],
      },
      spacing: {
        "input-x": "var(--input-x, .75rem)",
        "input-y": "var(--input-y, .375rem)",
      },
      colors: {
        transparent: "transparent",
        primary: {
          DEFAULT: "#5233FF",
          50: "#EBEBFF",
          100: "#D6DBFF",
          200: "#ADB4FF",
          300: "#7986FC",
          400: "#675CFF",
          500: "#5233FF",
          600: "#4A19D2",
          700: "#4400B3",
          800: "#290075",
          900: "#190033",
        },
        input: {
          primary: "var(--input-primary, var(--color-primary))",
          "primary-body": "var(--input-primary-body,var(--color-primary-body))",
          edge: "var(--input-edge, var(--color-edge))",
          "edge-light": "var(--input-edge-light, var(--color-edge-light))",
          body: "var(--input-body, var(--color-body))",
          "body-light": "var(--input-body-light, var(--color-body-light))",
          base: "var(--input-base, var(--color-base))",
          "base-alt": "var(--input-base-alt, var(--color-base-alt))",
          placeholder: "var(--input-placeholder, var(--color-placeholder))",
          shadow: "var(--input-shadow, var(--button-shadow))",
        },
      },
    },
  },
}
