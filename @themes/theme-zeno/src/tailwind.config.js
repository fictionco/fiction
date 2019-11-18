module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Source Sans Pro', 'sans-serif']
      },
      listStyleType: {
        square: 'square',
        roman: 'upper-roman'
      },
      colors: {
        gray: {
          100: '#f3f4fa', //Custom
          200: '#edf2f7',
          300: '#e2e8f0',
          400: '#cbd5e0',
          500: '#a0aec0',
          600: '#718096',
          700: '#4a5568',
          800: '#2d3748',
          900: '#1a202c',
        },
        teal: {
          100: '#E8FFF9', //Custom
          200: '#C6FFEF', //Custom
          300: '#A4FFE6', //Custom
          400: '#5FFED3', //Custom
          500: '#1BFEC0', //Custom
          600: '#18E5AD', //Custom
          700: '#109873', //Custom
          800: '#0C7256', //Custom
          900: '#084C3A', //Custom
        },
        purple: {
          100: '#faf5ff',
          200: '#e9d8fd',
          300: '#d6bcfa',
          400: '#b794f4',
          500: '#9f7aea',
          600: '#805ad5',
          700: "#6515DD", //Custom
          800: '#553c9a',
          900: "#0B092E" //Custom
        },
      }
    }
  },
  variants: {
    backgroundColor: ['responsive', 'hover', 'focus'],
    textColor: ['responsive', 'hover', 'focus']
  },
  plugins: []
}