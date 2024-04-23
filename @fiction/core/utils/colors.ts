export function isDarkOrLightMode(element: HTMLElement | null): 'light' | 'dark' {
  while (element) {
    if (element.classList.contains('dark'))
      return 'dark'
    if (element.classList.contains('light'))
      return 'light'
    element = element.parentElement
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export type ColorScale =
  | 0
  | 25
  | 50
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900
  | 950
  | 975
  | 1000

export const colorList = {
  slate: {
    0: '#ffffff',
    25: '#f7fafc',
    50: '#f3f6f9',
    100: '#e2e6ef',
    200: '#c5cad4',
    300: '#a6adb9',
    400: '#7e899e',
    500: '#5e6e85',
    600: '#3c4a5f',
    700: '#2d3748',
    800: '#202838',
    900: '#161d2f',
    950: '#0d1424',
    975: '#0a0f1d',
    1000: '#000000',
  },
  gray: {
    0: '#ffffff',
    25: '#fbfdff',
    50: '#F8F9FD',
    100: '#e6e9f1',
    200: '#DEDFE2',
    300: '#b3b9c5',
    400: '#7A8599',
    500: '#646E82',
    600: '#394151',
    700: '#1e2026',
    800: '#131519',
    900: '#0e0f11', // Adjusted to ensure a smooth transition to the darker end
    950: '#0A0B0D',
    975: '#08090A',
    1000: '#000000',
  },
  zinc: {
    0: '#ffffff',
    25: '#fcfcfc',
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
    950: '#09090b',
    975: '#020204',
    1000: '#000000',
  },
  neutral: {
    0: '#ffffff',
    25: '#fcfcfc',
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
    975: '#020202',
    1000: '#000000',
  },
  stone: {
    0: '#ffffff',
    25: '#fbfbfa',
    50: '#fafaf9',
    100: '#f5f5f4',
    200: '#e7e5e4',
    300: '#d6d3d1',
    400: '#a8a29e',
    500: '#78716c',
    600: '#57534e',
    700: '#44403c',
    800: '#292524',
    900: '#1c1917',
    950: '#0c0a09',
    975: '#020201',
    1000: '#000000',
  },
  red: {
    0: '#ffffff',
    25: '#fff0f0',
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a',
    975: '#3f0606',
    1000: '#000000',
  },
  orange: {
    0: '#ffffff',
    25: '#fffaf0',
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
    950: '#431407',
    975: '#3d1004',
    1000: '#000000',
  },
  amber: {
    0: '#ffffff',
    25: '#fffdf0',
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
    975: '#401700',
    1000: '#000000',
  },
  yellow: {
    0: '#ffffff',
    25: '#fffef0',
    50: '#fefce8',
    100: '#fef9c3',
    200: '#fef08a',
    300: '#fde047',
    400: '#facc15',
    500: '#eab308',
    600: '#ca8a04',
    700: '#a16207',
    800: '#854d0e',
    900: '#713f12',
    950: '#422006',
    975: '#3c1c00',
    1000: '#000000',
  },
  lime: {
    0: '#ffffff',
    25: '#f9ffe8',
    50: '#f7fee7',
    100: '#ecfccb',
    200: '#d9f99d',
    300: '#bef264',
    400: '#a3e635',
    500: '#84cc16',
    600: '#65a30d',
    700: '#4d7c0f',
    800: '#3f6212',
    900: '#365314',
    950: '#1a2e05',
    975: '#162b00',
    1000: '#000000',
  },
  green: {
    0: '#ffffff',
    25: '#e8fff0',
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
    975: '#032b14',
    1000: '#000000',
  },
  emerald: {
    0: '#ffffff',
    25: '#e5ffef',
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
    950: '#022c22',
    975: '#022920',
    1000: '#000000',
  },
  teal: {
    0: '#ffffff',
    25: '#e8fffd',
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6',
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
    950: '#042f2e',
    975: '#032d2c',
    1000: '#000000',
  },
  cyan: {
    0: '#ffffff',
    25: '#e0fefe',
    50: '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#22d3ee',
    500: '#06b6d4',
    600: '#0891b2',
    700: '#0e7490',
    800: '#155e75',
    900: '#164e63',
    950: '#083344',
    975: '#062f40',
    1000: '#000000',
  },
  sky: {
    0: '#ffffff',
    25: '#e6faff',
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
    950: '#082f49',
    975: '#062d45',
    1000: '#000000',
  },
  blue: {
    0: '#f8f9fa',
    25: '#d3e1ff',
    50: '#F0F3F9',
    100: '#e4ebfb',
    200: '#dae4fc',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#2C67FF',
    600: '#1453f5',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
    975: '#121c3b',
    1000: '#0a0b0d',
  },
  indigo: {
    0: '#ffffff',
    25: '#eeeff8',
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
    950: '#1e1b4b',
    975: '#1b1845',
    1000: '#000000',
  },
  violet: {
    0: '#ffffff',
    25: '#f3f0ff',
    50: '#f5f3ff',
    100: '#ede9fe',
    200: '#ddd6fe',
    300: '#c4b5fd',
    400: '#a78bfa',
    500: '#8b5cf6',
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95',
    950: '#2e1065',
    975: '#2b0e5e',
    1000: '#000000',
  },
  purple: {
    0: '#ffffff',
    25: '#faf0ff',
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7e22ce',
    800: '#6b21a8',
    900: '#581c87',
    950: '#3b0764',
    975: '#37065e',
    1000: '#000000',
  },
  fuchsia: {
    0: '#ffffff',
    25: '#fdf0ff',
    50: '#fdf4ff',
    100: '#fae8ff',
    200: '#f5d0fe',
    300: '#f0abfc',
    400: '#e879f9',
    500: '#d946ef',
    600: '#c026d3',
    700: '#a21caf',
    800: '#86198f',
    900: '#701a75',
    950: '#4a044e',
    975: '#45044a',
    1000: '#000000',
  },
  pink: {
    0: '#ffffff',
    25: '#fff0f4',
    50: '#fdf2f8',
    100: '#fce7f3',
    200: '#fbcfe8',
    300: '#f9a8d4',
    400: '#f472b6',
    500: '#ec4899',
    600: '#db2777',
    700: '#be185d',
    800: '#9d174d',
    900: '#831843',
    950: '#500724',
    975: '#4b0620',
    1000: '#000000',
  },
  rose: {
    0: '#ffffff',
    25: '#fff0f2',
    50: '#fff1f2',
    100: '#ffe4e6',
    200: '#fecdd3',
    300: '#fda4af',
    400: '#fb7185',
    500: '#f43f5e',
    600: '#e11d48',
    700: '#be123c',
    800: '#9f1239',
    900: '#881337',
    950: '#4c0519',
    975: '#470516',
    1000: '#000000',
  },
} as const

export const colors = Object.keys(colorList)

export type ThemeColor = (typeof colors)[number]

type ColorRecord = {
  [P in ColorScale]?: string
}

export type ColorScheme = keyof typeof colorList

export function hexToRgb(hex: string) {
  const result = /^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(hex.toLowerCase())
  return result
    ? [
        Number.parseInt(result[1], 16),
        Number.parseInt(result[2], 16),
        Number.parseInt(result[3], 16),
      ].join(' ')
    : undefined
}

export function tailwindVarColorScheme(args: {
  variable: string
  color?: ColorScheme
  scheme?: ColorRecord
}): Record<ColorScale | 'DEFAULT', string> {
  const { variable, color } = args
  let { scheme } = args
  if (color && !scheme)
    scheme = getColorScheme(color)

  const entries = Object.entries(scheme || {}).map(([key, value]) => {
    const defaultValue = value.includes('#') ? hexToRgb(value) : value
    return [Number.parseInt(key), `rgb(var(--${variable}-${key}, ${defaultValue}) / <alpha-value>)`]
  })

  const out = Object.fromEntries(entries) as Record<ColorScale | 'DEFAULT', string>

  out.DEFAULT = out[500]

  return out
}

export function getColorScheme(schemeId: ColorScheme | string, options: { isDarkMode?: boolean, outputFormat?: 'rgb' | 'hex' } = {}): ColorRecord {
  const scheme = colorList[schemeId as ColorScheme] || colorList.slate // Default to 'slate' if schemeId not found
  const format = options.outputFormat || 'rgb'

  return Object.entries(scheme).reduce((acc, [key, value]) => {
    const colorValue = options.isDarkMode ? scheme[1000 - Number(key) as ColorScale] || value : value
    acc[Number(key) as ColorScale] = format === 'rgb' ? hexToRgb(colorValue) : colorValue
    return acc
  }, {} as ColorRecord)
}

export function colorStandard(params: {
  color?: ThemeColor
  level?: ColorScale
  opacity?: number
} = {}): string {
  const { color = 'primary', level = 500, opacity = 1 } = params

  const colorMap: Record<ThemeColor, ColorRecord | string> = {
    black: '0,0,0',
    white: '255,255,255',
    primary: {
      0: '255,255,255',
      50: '239, 246, 255',
      100: '219, 234, 254',
      200: '191, 219, 254',
      300: '147, 197, 253',
      400: '96, 165, 250',
      500: '59, 130, 246',
      600: '37, 99, 235',
      700: '29, 78, 216',
      800: '30, 64, 175',
      900: '30, 58, 138',
      950: '23, 37, 84',
      1000: '0, 0, 0',
    },
    cyan: {
      0: '255,255,255',
      50: '236, 254, 255',
      100: '207, 250, 254',
      200: '165, 243, 252',
      300: '103, 232, 249',
      400: '34, 211, 238',
      500: '6, 182, 212',
      600: '8, 145, 178',
      700: '14, 116, 144',
      800: '21, 94, 117',
      900: '22, 78, 99',
      950: '8, 51, 68',
      1000: '0, 0, 0',
    },
    blue: {
      0: '255,255,255',
      50: '239, 246, 255',
      100: '219, 234, 254',
      200: '191, 219, 254',
      300: '147, 197, 253',
      400: '96, 165, 250',
      500: '59, 130, 246',
      600: '37, 99, 235',
      700: '29, 78, 216',
      800: '30, 64, 175',
      900: '30, 58, 138',
      950: '23, 37, 84',
      1000: '0, 0, 0',
    },

    amber: {
      0: '255,255,255',
      50: '254,243,199',
      100: '253,230,138',
      200: '252,211,77',
      300: '251,191,36',
      400: '245,158,11',
      500: '245,158,11',
      600: '217,119,6',
      700: '180,83,9',
      800: '146,64,14',
      900: '120,53,15',
      950: '69, 26, 3',
      1000: '0, 0, 0',
    },
    pink: {
      0: '255,255,255',
      50: '253,242,248',
      100: '252,231,243',
      200: '251,207,232',
      300: '249,168,212',
      400: '244,114,182',
      500: '236,72,153',
      600: '219,39,119',
      700: '190,24,93',
      800: '157,23,77',
      900: '131,24,67',
      950: '80, 7, 36',
      1000: '0, 0, 0',
    },
    sky: {
      0: '255,255,255',
      50: '240,249,255',
      100: '224,242,254',
      200: '186,230,253',
      300: '125,211,252',
      400: '56,189,248',
      500: '14,165,233',
      600: '2,132,199',
      700: '3,105,161',
      800: '7,89,133',
      900: '12,74,110',
      950: '8, 47, 73',
      1000: '0, 0, 0',
    },
    emerald: {
      0: '255,255,255',
      50: '236,253,245',
      100: '209,250,229',
      200: '167,243,208',
      300: '110,231,183',
      400: '52,211,153',
      500: '16,185,129',
      600: '5,150,105',
      700: '4,120,87',
      800: '6,95,70',
      900: '6,78,59',
      950: '2, 44, 34',
      1000: '0, 0, 0',
    },
    slate: {
      0: '255,255,255',
      50: '248,250,252',
      100: '241,245,249',
      200: '226,232,240',
      300: '203,213,225',
      400: '148,163,184',
      500: '100,116,139',
      600: '71,85,105',
      700: '51,65,85',
      800: '30,41,59',
      900: '15,23,42',
      950: '2, 6, 23',
      1000: '10,15,28',
    },
    gray: {
      0: '249,250,251',
      50: '243,244,246',
      100: '229,231,235',
      200: '209,213,219',
      300: '203,213,225',
      400: '156,163,175',
      500: '107,114,128',
      600: '75,85,99',
      700: '55,65,81',
      800: '31,41,55',
      900: '17,24,39',
      950: '3,7,18',
      1000: '0,0,0',
    },
  }

  if (typeof colorMap[color] === 'string')
    return `rgba(${colorMap[color] as string}, ${opacity})`
  else
    return `rgba(${colorMap[color][level]}, ${opacity})`
}

export function colorMulti(): string[] {
  return [
    colorStandard(),
    colorStandard({ color: 'slate', level: 300 }),
    colorStandard({ color: 'pink' }),
    colorStandard({ color: 'sky' }),
    colorStandard({ color: 'amber' }),
    colorStandard({ color: 'emerald' }),
    colorStandard({ color: 'amber', level: 300 }),
    colorStandard({ color: 'primary', level: 700 }),
    colorStandard({ color: 'emerald', level: 300 }),
    colorStandard({ color: 'sky', level: 300 }),
    colorStandard({ color: 'pink', level: 600 }),
    colorStandard({ color: 'amber', level: 600 }),
  ]
}
