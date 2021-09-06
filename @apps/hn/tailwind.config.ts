module.exports = {
  mode: "jit",
  purge: {
    content: ["./src/**/*.{vue,js,ts,jsx,tsx,html}"],
  },
  plugins: [require("@tailwindcss/forms")],

  theme: {
    colors: {
      ...require("tailwindcss/colors"),
      transparent: "transparent",
      primary: {
        DEFAULT: "#FF6600",
        "50": "#FFF0E5",
        "100": "#FFE0CC",
        "200": "#FFC299",
        "300": "#FFA366",
        "400": "#FF8533",
        "500": "#FF6600",
        "600": "#E65C00",
        "700": "#CC5200",
        "800": "#B34700",
        "900": "#993D00",
      },
      color: {
        DEFAULT: "#34495E",
        "50": "#9AB0C7",
        "100": "#8BA5BF",
        "200": "#6D8EAE",
        "300": "#557799",
        "400": "#44607C",
        "500": "#34495E",
        "600": "#2D3F51",
        "700": "#253544",
        "800": "#1E2A37",
        "900": "#172029",
      },
    },
  },
}
