module.exports = {
  content: ["./src/**/*.{vue,js,ts,jsx,tsx,html}"],
  plugins: [require("@tailwindcss/forms")],

  theme: {
    extend: {
      fontSize: {
        "input-size": [
          "var(--input-size)",
          {
            lineHeight: "calc(var(--input-size) * 1.4)",
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
          50: "#f6f5ff",
          100: "#eeebff",
          200: "#d4ccff",
          300: "#baadff",
          400: "#8670ff",
          500: "#5233ff",
          600: "#4a2ee6",
          700: "#3e26bf",
          800: "#311f99",
          900: "#220082",
        },
        input: {
          primary: "var(--input-primary, var(--color-primary))",
          "primary-text": "var(--input-primary-text,var(--color-primary-text))",
          edge: "var(--input-edge, var(--color-edge))",
          "edge-light": "var(--input-edge-light, , var(--color-edge-light))",
          body: "var(--input-body, var(--color-body))",
          "body-light": "var(--input-body-light, var(--color-body-light))",
          base: "var(--input-base, var(--color-base))",
          "base-alt": "var(--input-base-alt, var(--color-base-alt))",
          placeholder: "var(--input-placeholder, var(--color-placeholder))",
        },
      },
    },
  },
}
