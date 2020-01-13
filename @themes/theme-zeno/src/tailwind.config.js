module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ["Maven Pro", "sans-serif"]
      },
      listStyleType: {
        square: "square",
        roman: "upper-roman"
      },
      maxHeight: {
        "0": "0",
        "1/4": "25%",
        "1/2": "50%",
        "3/4": "75%",
        full: "100%"
      },
      colors: {
        gray: {
          100: "#f3f4fa",
          200: "#edf2f7",
          300: "#e2e8f0",
          400: "#cbd5e0",
          500: "#a0aec0",
          600: "#717485",
          700: "#4a5568",
          800: "#2d3748",
          900: "#1a202c"
        },
        teal: {
          100: "#E8FFF9",
          200: "#C6FFEF",
          300: "#A4FFE6",
          400: "#5FFED3",
          500: "#1BFEC0",
          600: "#18E5AD",
          700: "#109873",
          800: "#0C7256",
          900: "#084C3A"
        },
        purple: {
          100: "#F0E8FC",
          200: "#D9C5F7",
          300: "#C1A1F1",
          400: "#935BE7",
          500: "#6515DD",
          600: "#5B13C7",
          700: "#3D0D85",
          800: "#2D0963",
          900: "#0B092E"
        }
      }
    },
    fill: theme => ({
      purple: theme("colors.purple.500")
    })
  },
  variants: {
    backgroundColor: ["responsive", "hover", "focus", "active", "even", "odd"],
    textColor: ["responsive", "hover", "focus"]
  },
  plugins: []
}
