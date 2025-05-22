import type { GradientSetting } from '../schemas/index.js'
import { z } from 'zod/v4'

export const colorThemeBright = ['teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose', 'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald'] as const
export const colorTheme = [...colorThemeBright, 'slate', 'gray', 'zinc', 'neutral', 'stone', 'black', 'white'] as const
export const onlyUserColorTheme = ['primary', 'default', 'overlay', 'theme', 'muted'] as const
export const colorThemeUser = [...onlyUserColorTheme, ...colorTheme] as const

// Create a union type that includes both regular and inverted colors
export const ColorThemeBrightSchema = z.enum(colorThemeBright)
export type ColorThemeBright = z.infer<typeof ColorThemeBrightSchema>
export type ColorTheme = (typeof colorTheme)[number]
export type ColorThemeUser = (typeof colorThemeUser)[number]

export const colorThemeWithInvert = [
  ...colorThemeUser,
  ...colorThemeUser.map(c => `${c}Inverted` as const),
] as const

export type ColorThemeWithInvert = (typeof colorThemeWithInvert)[number]

export const ColorScaleSchema = z.union([z.literal(0), z.literal(25), z.literal(50), z.literal(100), z.literal(200), z.literal(300), z.literal(400), z.literal(500), z.literal(600), z.literal(700), z.literal(800), z.literal(900), z.literal(950), z.literal(975), z.literal(1000)])
export type ColorScale = z.infer<typeof ColorScaleSchema>

type ColorRecord = {
  [P in ColorScale]: string
}

export const colorList: Record<ColorTheme, ColorRecord> = {
  black: { 0: '#ffffff', 25: '#404040', 50: '#333333', 100: '#262626', 200: '#1a1a1a', 300: '#0d0d0d', 400: '#080808', 500: '#000000', 600: '#000000', 700: '#000000', 800: '#000000', 900: '#000000', 950: '#000000', 975: '#000000', 1000: '#000000' },
  white: { 0: '#ffffff', 25: '#ffffff', 50: '#ffffff', 100: '#ffffff', 200: '#ffffff', 300: '#fafafa', 400: '#f5f5f5', 500: '#f0f0f0', 600: '#dedede', 700: '#cccccc', 800: '#bfbfbf', 900: '#b3b3b3', 950: '#a6a6a6', 975: '#999999', 1000: '#000000' },
  slate: { 0: '#ffffff', 25: '#f7fafc', 50: '#f3f6f9', 100: '#e2e6ef', 200: '#c5cad4', 300: '#a6adb9', 400: '#7e899e', 500: '#5e6e85', 600: '#3c4a5f', 700: '#2d3748', 800: '#202838', 900: '#161d2f', 950: '#0d1424', 975: '#0a0f1d', 1000: '#000000' },
  gray: { 0: '#ffffff', 25: '#fbfdff', 50: '#F8F9FD', 100: '#e6e9f1', 200: '#DEDFE2', 300: '#b3b9c5', 400: '#7A8599', 500: '#646E82', 600: '#394151', 700: '#1e2026', 800: '#131519', 900: '#0e0f11', 950: '#0A0B0D', 975: '#08090A', 1000: '#000000' },
  zinc: { 0: '#ffffff', 25: '#fcfcfc', 50: '#fafafa', 100: '#f4f4f5', 200: '#e4e4e7', 300: '#d4d4d8', 400: '#a1a1aa', 500: '#71717a', 600: '#52525b', 700: '#3f3f46', 800: '#27272a', 900: '#0f1013', 950: '#09090b', 975: '#020204', 1000: '#000000' },
  neutral: { 0: '#ffffff', 25: '#fcfcfc', 50: '#fafafa', 100: '#f5f5f5', 200: '#e5e5e5', 300: '#d4d4d4', 400: '#a3a3a3', 500: '#737373', 600: '#525252', 700: '#404040', 800: '#262626', 900: '#171717', 950: '#0a0a0a', 975: '#020202', 1000: '#000000' },
  stone: { 0: '#ffffff', 25: '#fbfbfa', 50: '#fafaf9', 100: '#f5f5f4', 200: '#e7e5e4', 300: '#d6d3d1', 400: '#a8a29e', 500: '#78716c', 600: '#57534e', 700: '#44403c', 800: '#292524', 900: '#1c1917', 950: '#0c0a09', 975: '#020201', 1000: '#000000' },
  red: { 0: '#ffffff', 25: '#fff0f0', 50: '#fef2f2', 100: '#fee2e2', 200: '#fecaca', 300: '#fca5a5', 400: '#f87171', 500: '#ef4444', 600: '#dc2626', 700: '#b91c1c', 800: '#991b1b', 900: '#7f1d1d', 950: '#450a0a', 975: '#3f0606', 1000: '#000000' },
  orange: { 0: '#ffffff', 25: '#fffaf0', 50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa', 300: '#fdba74', 400: '#fb923c', 500: '#f97316', 600: '#ea580c', 700: '#c2410c', 800: '#9a3412', 900: '#7c2d12', 950: '#431407', 975: '#3d1004', 1000: '#000000' },
  amber: { 0: '#ffffff', 25: '#fffdf0', 50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d', 400: '#fbbf24', 500: '#f59e0b', 600: '#d97706', 700: '#b45309', 800: '#92400e', 900: '#78350f', 950: '#451a03', 975: '#401700', 1000: '#000000' },
  yellow: { 0: '#ffffff', 25: '#fffef0', 50: '#fefce8', 100: '#fef9c3', 200: '#fef08a', 300: '#fde047', 400: '#facc15', 500: '#eab308', 600: '#ca8a04', 700: '#a16207', 800: '#854d0e', 900: '#713f12', 950: '#422006', 975: '#3c1c00', 1000: '#000000' },
  lime: { 0: '#ffffff', 25: '#f9ffe8', 50: '#f7fee7', 100: '#ecfccb', 200: '#d9f99d', 300: '#bef264', 400: '#a3e635', 500: '#84cc16', 600: '#65a30d', 700: '#4d7c0f', 800: '#3f6212', 900: '#365314', 950: '#1a2e05', 975: '#162b00', 1000: '#000000' },
  green: { 0: '#ffffff', 25: '#e8fff0', 50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 300: '#86efac', 400: '#4ade80', 500: '#22c55e', 600: '#16a34a', 700: '#15803d', 800: '#166534', 900: '#14532d', 950: '#052e16', 975: '#032b14', 1000: '#000000' },
  emerald: { 0: '#ffffff', 25: '#e5ffef', 50: '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0', 300: '#6ee7b7', 400: '#34d399', 500: '#10b981', 600: '#059669', 700: '#047857', 800: '#065f46', 900: '#064e3b', 950: '#022c22', 975: '#022920', 1000: '#000000' },
  teal: { 0: '#ffffff', 25: '#e8fffd', 50: '#f0fdfa', 100: '#ccfbf1', 200: '#99f6e4', 300: '#5eead4', 400: '#2dd4bf', 500: '#14b8a6', 600: '#0d9488', 700: '#0f766e', 800: '#115e59', 900: '#134e4a', 950: '#042f2e', 975: '#032d2c', 1000: '#000000' },
  cyan: { 0: '#ffffff', 25: '#e0fefe', 50: '#ecfeff', 100: '#cffafe', 200: '#a5f3fc', 300: '#67e8f9', 400: '#22d3ee', 500: '#06b6d4', 600: '#0891b2', 700: '#0e7490', 800: '#155e75', 900: '#164e63', 950: '#083344', 975: '#062f40', 1000: '#000000' },
  sky: { 0: '#ffffff', 25: '#e6faff', 50: '#f0f9ff', 100: '#e0f2fe', 200: '#bae6fd', 300: '#7dd3fc', 400: '#38bdf8', 500: '#0ea5e9', 600: '#0284c7', 700: '#0369a1', 800: '#075985', 900: '#0c4a6e', 950: '#082f49', 975: '#062d45', 1000: '#000000' },
  blue: { 0: '#ffffff', 25: '#f5f8ff', 50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a', 950: '#172554', 975: '#111c44', 1000: '#000000' },
  indigo: { 0: '#ffffff', 25: '#eeeff8', 50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe', 300: '#a5b4fc', 400: '#818cf8', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca', 800: '#3730a3', 900: '#312e81', 950: '#1e1b4b', 975: '#1b1845', 1000: '#000000' },
  violet: { 0: '#ffffff', 25: '#f3f0ff', 50: '#f5f3ff', 100: '#ede9fe', 200: '#ddd6fe', 300: '#c4b5fd', 400: '#a78bfa', 500: '#8b5cf6', 600: '#7c3aed', 700: '#6d28d9', 800: '#5b21b6', 900: '#4c1d95', 950: '#2e1065', 975: '#2b0e5e', 1000: '#000000' },
  purple: { 0: '#ffffff', 25: '#faf0ff', 50: '#faf5ff', 100: '#f3e8ff', 200: '#e9d5ff', 300: '#d8b4fe', 400: '#c084fc', 500: '#a855f7', 600: '#9333ea', 700: '#7e22ce', 800: '#6b21a8', 900: '#581c87', 950: '#3b0764', 975: '#37065e', 1000: '#000000' },
  fuchsia: { 0: '#ffffff', 25: '#fdf0ff', 50: '#fdf4ff', 100: '#fae8ff', 200: '#f5d0fe', 300: '#f0abfc', 400: '#e879f9', 500: '#d946ef', 600: '#c026d3', 700: '#a21caf', 800: '#86198f', 900: '#701a75', 950: '#4a044e', 975: '#45044a', 1000: '#000000' },
  pink: { 0: '#ffffff', 25: '#fff0f4', 50: '#fdf2f8', 100: '#fce7f3', 200: '#fbcfe8', 300: '#f9a8d4', 400: '#f472b6', 500: '#ec4899', 600: '#db2777', 700: '#be185d', 800: '#9d174d', 900: '#831843', 950: '#500724', 975: '#4b0620', 1000: '#000000' },
  rose: { 0: '#ffffff', 25: '#fff0f2', 50: '#fff1f2', 100: '#ffe4e6', 200: '#fecdd3', 300: '#fda4af', 400: '#fb7185', 500: '#f43f5e', 600: '#e11d48', 700: '#be123c', 800: '#9f1239', 900: '#881337', 950: '#4c0519', 975: '#470516', 1000: '#000000' },
} as const

// @deprecated use ColorTheme
// export type ThemeColor = (typeof colors)[number]

export function getTextColorTheme(text: string): ColorTheme {
  // Simple hash function
  let hash = 0
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }

  // Use the absolute value of the hash to ensure it's positive
  const positiveHash = Math.abs(hash)

  // Use modulo to get an index within the range of the colorTheme array
  const colorIndex = positiveHash % colorThemeBright.length

  return colorThemeBright[colorIndex]
}

export function hexToRgbString(hex: string) {
  const result = hexToRgb(hex)
  if (!result)
    return `0 0 0`

  return `${result.r} ${result.g} ${result.b}`
}
/**
 * Convert hex color to RGB.
 * @param hex Hex color string
 * @returns RGB components or undefined if invalid
 */
function hexToRgb(hex: string): { r: number, g: number, b: number } | undefined {
  let normalizedHex = hex.replace('#', '')

  if (!/^[0-9A-F]{3}$|^[0-9A-F]{6}$/i.test(normalizedHex)) {
    return undefined
  }

  if (normalizedHex.length === 3) {
    normalizedHex = normalizedHex.split('').map(h => h + h).join('')
  }

  const bigint = Number.parseInt(normalizedHex, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255

  return { r, g, b }
}
/**
 * Calculate the luminance of a color.
 * @param r Red component (0-255)
 * @param g Green component (0-255)
 * @param b Blue component (0-255)
 * @returns Luminance value
 */
function luminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map((v) => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  })
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722
}

export function tailwindVarColorScheme(args: {
  variable?: string
  color?: ColorTheme
  scheme?: Partial<ColorRecord>
}): Record<ColorScale | 'DEFAULT', string> {
  const { variable, color } = args
  let { scheme } = args
  if (color && !scheme)
    scheme = getColorScheme(color)

  const entries = Object.entries(scheme || {}).map(([key, value]) => {
    const defaultValue = value.includes('#') ? hexToRgbString(value) : value
    const clr = variable ? `var(--${variable}-${key}, ${defaultValue})` : defaultValue
    return [Number.parseInt(key), `rgb(${clr} / var(--${variable}-${key}-alpha, <alpha-value>))`]
  })

  const out = Object.fromEntries(entries) as Record<ColorScale | 'DEFAULT', string>

  out.DEFAULT = out[500]

  return out
}

export function isDarkOrLightMode(element?: HTMLElement | null | undefined): 'light' | 'dark' {
  if (typeof document === 'undefined' || typeof window === 'undefined' || !window?.matchMedia)
    return 'light'

  if (!element)
    element = document.querySelector('body')

  while (element) {
    if (element.classList.contains('dark'))
      return 'dark'
    if (element.classList.contains('light'))
      return 'light'
    element = element.parentElement
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function getColorScheme(schemeIdWithInvert: ColorThemeWithInvert, options: { invert?: boolean, outputFormat?: 'rgb' | 'hex' } = {}): ColorRecord {
  const schemeId = schemeIdWithInvert.replace('Inverted', '') as ColorTheme

  const scheme = colorList[schemeId] || colorList.gray

  const format = options.outputFormat || 'rgb'

  const invert = options.invert || schemeIdWithInvert.endsWith('Inverted')

  return Object.entries(scheme).reduce((acc, [key, value]) => {
    const colorValue = invert ? scheme[1000 - Number(key) as ColorScale] || value : value
    acc[Number(key) as ColorScale] = format === 'rgb' ? hexToRgbString(colorValue) : colorValue
    return acc
  }, {} as ColorRecord)
}

/**
 * Get the appropriate text color (black or white) based on the background color.
 * @param backgroundColor Hex color string for the background
 * @returns Hex color string for the text color
 */
export function getTextColorBasedOnBackground(backgroundColor: string): string {
  const result = hexToRgb(backgroundColor)

  const { r, g, b } = result || { r: 255, g: 255, b: 255 }
  const bgLuminance = luminance(r, g, b)

  // Prefer white text color most of the time
  return bgLuminance > 0.35 ? '#000000' : '#FFFFFF'
}

type ColorInput = {
  color: string
  opacity?: number
}

export function normalizeColor({ color, opacity }: ColorInput): string {
  const parseRgb = (rgb: string): number[] => rgb.match(/-?\d+(\.\d+)?/g)?.map(Number) || []

  const clamp = (num: number, min: number, max: number) => Math.min(max, Math.max(min, num))

  color = color.trim().toLowerCase()

  let [r, g, b, a] = [0, 0, 0, opacity ?? 1]

  if (color.startsWith('#')) {
    const rgb = hexToRgb(color)
    if (rgb)
      [r, g, b] = [rgb.r, rgb.g, rgb.b]
  }
  else if (color.startsWith('rgb')) {
    const values = parseRgb(color);
    [r, g, b] = values
    if (values[3] !== undefined && opacity === undefined) {
      a = values[3]
    }
  }
  else {
    const namedColors: { [key: string]: number[] } = {
      red: [255, 0, 0],
      green: [0, 128, 0],
      blue: [0, 0, 255],
      // Add more as needed
    };
    [r, g, b] = namedColors[color] || [0, 0, 0]
  }

  [r, g, b] = [r, g, b].map(v => clamp(Math.round(v), 0, 255))
  a = clamp(a, 0, 1)

  return `rgba(${r} ${g} ${b} / ${a.toFixed(2)})`
}

export function colorStandard(params: { color?: ColorTheme, level?: ColorScale, opacity?: number } = {}): string {
  const { color = 'blue', level = 500, opacity = 1 } = params

  const sch = getColorScheme(color, { outputFormat: 'rgb' })

  return `rgba(${sch[level]}, ${opacity})`
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
    colorStandard({ color: 'blue', level: 700 }),
    colorStandard({ color: 'emerald', level: 300 }),
    colorStandard({ color: 'sky', level: 300 }),
    colorStandard({ color: 'pink', level: 600 }),
    colorStandard({ color: 'amber', level: 600 }),
  ]
}

export function getGradientCss(gradient?: GradientSetting, options?: { noAngle?: boolean }): string {
  if (!gradient?.stops?.length)
    return ''

  const stops = gradient.stops.map((stop) => {
    const opacity = (stop.opacity ?? 1).toFixed(2)
    const position = stop.position !== undefined ? ` ${stop.position}%` : ''

    // Handle theme colors
    if (stop.theme) {
      if (['primary', 'theme'].includes(stop.theme || '')) {
        const scale = stop.scale || 500
        const themeVar = stop.theme === 'theme' ? 'theme' : 'primary'
        const rgbVar = `var(--${themeVar}-${scale})`
        return `rgba(${rgbVar} / ${stop.opacity ?? 1})`
      }
      else {
        const scheme = getColorScheme(stop.theme, { outputFormat: 'rgb' })
        return `rgba(${scheme[stop.scale || 500]} / ${opacity})${position}`
      }
    }

    // Handle direct colors
    if (stop.color) {
      const normalized = normalizeColor({ color: stop.color }).replace(/\d+\.?\d*\)$/, `${opacity})`)
      return `${normalized}${position}`
    }

    return null
  }).filter(Boolean)

  if (!stops.length)
    return ''
  if (stops.length === 1)
    stops.push(stops[0])

  const angle = options?.noAngle || !gradient.angle ? 90 : gradient.angle
  return `linear-gradient(${angle}deg, ${stops.join(', ')})`
}
