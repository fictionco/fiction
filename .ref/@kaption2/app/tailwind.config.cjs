/* eslint-disable @typescript-eslint/no-unsafe-call */

module.exports = async () => {
  const util = await import('@factor/api/utils/colors')
  return {
    content: ['./src/**/*.{ts,vue}'],
    theme: {
      extend: {
        colors: {
          primary: util.tailwindVarColorScheme({
            variable: 'primary',
            color: 'blue',
            // scheme: {
            //   0: "#FFFFFF",
            //   50: "#F5F7FA",
            //   100: "#E6ECF4",
            //   200: "#C8D3E9",
            //   300: "#A3B1E1",
            //   400: "#7382D8",
            //   500: "#252EA1",
            //   600: "#22307C",
            //   700: "#1E2D5C",
            //   800: "#1A2742",
            //   900: "#121A27",
            //   950: "#121A27",
            //   1000: "#000000",
            // },
          }),
          secondary: util.tailwindVarColorScheme({
            variable: 'secondary',
            color: 'pink',
          }),
        },
      },
    },
  }
}
