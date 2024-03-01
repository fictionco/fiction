const primary = {
  50: '#E5F4FF',
  100: '#CCE8FF',
  200: '#99D1FF',
  300: '#66BAFF',
  400: '#33A3FF',
  500: '#008BFF',
  600: '#0070CC',
  700: '#005499',
  800: '#003866',
  900: '#001C33',
  950: '#000E19',
}

module.exports = {
  plugins: [require('@tailwindcss/forms')],

  variants: {
    extend: {},
  },
  theme: {
    extend: {
      colors: {
        primary,
        indigo: primary,
      },
    },
  },
}
