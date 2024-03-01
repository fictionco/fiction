const primary = {
  DEFAULT: '#5233FF',
  50: '#EBEBFF',
  100: '#D6DBFF',
  200: '#a2a2ff',
  300: '#a2a2ff',
  400: '#7268ff',
  500: '#5233FF',
  600: '#4A19D2',
  700: '#4400B3',
  800: '#290075',
  900: '#190033',
}

module.exports = {
  plugins: [require('@tailwindcss/forms')],
  content: ['./src/**/*.{ts,vue}'],
  theme: {
    extend: {
      colors: {
        primary,
      },
      gridCols: {
        24: 'repeat(24, minmax(0, 1fr))',
      },
      gridColumnStart: {
        13: '13',
        14: '14',
        15: '15',
        16: '16',
        17: '17',
        18: '18',
        19: '19',
        20: '20',
        21: '21',
        22: '22',
        23: '23',
      },
      boxShadow: {
        'real-low': `0px 0.4px 0.6px hsl(var(--shadow-color) / 0),
        0px 0.7px 1px hsl(var(--shadow-color) / 0.07),
        0px 1px 2.3px hsl(var(--shadow-color) / 0.1)`,
        'real': `0px 0.4px 0.6px hsl(var(--shadow-color) / 0),
        0px 1.5px 2.3px hsl(var(--shadow-color) / 0.01),
        0px 2.5px 3.8px hsl(var(--shadow-color) / 0.05),
        0px 4.3px 6.5px hsl(var(--shadow-color) / 0.08),
        0.1px 7.3px 11px hsl(var(--shadow-color) / 0.12);`,
        'real-high': `0px 0.4px 0.6px hsl(var(--shadow-color) / 0),
        0px 3.1px 4.7px hsl(var(--shadow-color) / 0.02),
        0.1px 5.5px 8.3px hsl(var(--shadow-color) / 0.03),
        0.1px 7.7px 11.6px hsl(var(--shadow-color) / 0.05),
        0.1px 10.2px 15.3px hsl(var(--shadow-color) / 0.06),
        0.1px 13.3px 20px hsl(var(--shadow-color) / 0.08),
        0.2px 17.1px 25.7px hsl(var(--shadow-color) / 0.1),
        0.2px 22.1px 33.2px hsl(var(--shadow-color) / 0.11),
        0.3px 28.5px 42.8px hsl(var(--shadow-color) / 0.13),
        0.4px 36.6px 54.9px hsl(var(--shadow-color) / 0.14);`,
      },

      fontFamily: {
        sans: `-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Helvetica Neue","Ubuntu"`,
        brand: `"urbanist", -apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Helvetica Neue","Ubuntu"`,
      },
    },
  },
}
