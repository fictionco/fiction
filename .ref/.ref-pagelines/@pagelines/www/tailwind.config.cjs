const colors = require('tailwindcss/colors')

module.exports = {
  content: ['./src/**/*.{ts,vue}'],
  theme: {
    extend: {
      colors: {
        primary: colors.blue,
      },
    },
  },
}
