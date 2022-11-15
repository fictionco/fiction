import { toLabel } from "./utils"
export type ColorScale =
  | 0
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
  | 1000

export const colors = [
  "amber",
  "pink",
  "primary",
  "emerald",
  "sky",
  "cyan",
  "slate",
  "blue",
  "black",
  "white",
] as const

export type ThemeColor = typeof colors[number]

type ColorRecord = {
  [P in ColorScale]?: string
}

export type ColorScheme =
  | "slate"
  | "slateInverted"
  | "gray"
  | "grayInverted"
  | "zinc"
  | "zincInverted"
  | "blue"
  | "blueInverted"
  | "cyan"
  | "cyanInverted"
  | "sky"
  | "skyInverted"
  | "emerald"
  | "emeraldInverted"
  | "pink"
  | "pinkInverted"
  | "amber"
  | "amberInverted"
  | "primary"
  | "primaryInverted"
  | "teal"
  | "tealInverted"
  | "red"
  | "redInverted"
  | "orange"
  | "orangeInverted"
  | "yellow"
  | "yellowInverted"
  | "green"
  | "greenInverted"
  | "purple"
  | "purpleInverted"
  | "indigo"
  | "indigoInverted"
  | "fuchsia"
  | "fuchsiaInverted"
  | "rose"
  | "roseInverted"
  | "stone"
  | "stoneInverted"
  | "neutral"
  | "neutralInverted"
  | "violet"
  | "violetInverted"

export type ColorSchemeDetail = {
  name: string
  value: ColorScheme
  colors: Record<ColorScale, string>
}

/**
 * https://github.com/tailwindlabs/tailwindcss/blob/master/src/public/colors.js
 */
export const colorSchemes = (): ColorSchemeDetail[] => {
  const schemes: Record<string, Record<number, string>> = {
    slate: {
      50: "#f8fafc",
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e1",
      400: "#94a3b8",
      500: "#64748b",
      600: "#475569",
      700: "#334155",
      800: "#1e293b",
      900: "#0f172a",
      950: "#090e1b",
    },
    gray: {
      50: "#f9fafb",
      100: "#f3f4f6",
      200: "#e5e7eb",
      300: "#d1d5db",
      400: "#9ca3af",
      500: "#6b7280",
      600: "#4b5563",
      700: "#374151",
      800: "#1f2937",
      900: "#111827",
      950: "#111827",
    },
    zinc: {
      50: "#fafafa",
      100: "#f4f4f5",
      200: "#e4e4e7",
      300: "#d4d4d8",
      400: "#a1a1aa",
      500: "#71717a",
      600: "#52525b",
      700: "#3f3f46",
      800: "#27272a",
      900: "#18181b",
      950: "#18181b",
    },
    neutral: {
      50: "#fafafa",
      100: "#f5f5f5",
      200: "#e5e5e5",
      300: "#d4d4d4",
      400: "#a3a3a3",
      500: "#737373",
      600: "#525252",
      700: "#404040",
      800: "#262626",
      900: "#171717",
      950: "#171717",
    },
    stone: {
      50: "#fafaf9",
      100: "#f5f5f4",
      200: "#e7e5e4",
      300: "#d6d3d1",
      400: "#a8a29e",
      500: "#78716c",
      600: "#57534e",
      700: "#44403c",
      800: "#292524",
      900: "#1c1917",
      950: "#1c1917",
    },
    red: {
      50: "#fef2f2",
      100: "#fee2e2",
      200: "#fecaca",
      300: "#fca5a5",
      400: "#f87171",
      500: "#ef4444",
      600: "#dc2626",
      700: "#b91c1c",
      800: "#991b1b",
      900: "#7f1d1d",
      950: "#7f1d1d",
    },
    orange: {
      50: "#fff7ed",
      100: "#ffedd5",
      200: "#fed7aa",
      300: "#fdba74",
      400: "#fb923c",
      500: "#f97316",
      600: "#ea580c",
      700: "#c2410c",
      800: "#9a3412",
      900: "#7c2d12",
      950: "#7c2d12",
    },
    amber: {
      50: "#fffbeb",
      100: "#fef3c7",
      200: "#fde68a",
      300: "#fcd34d",
      400: "#fbbf24",
      500: "#f59e0b",
      600: "#d97706",
      700: "#b45309",
      800: "#92400e",
      900: "#78350f",
      950: "#78350f",
    },
    yellow: {
      50: "#fefce8",
      100: "#fef9c3",
      200: "#fef08a",
      300: "#fde047",
      400: "#facc15",
      500: "#eab308",
      600: "#ca8a04",
      700: "#a16207",
      800: "#854d0e",
      900: "#713f12",
      950: "#713f12",
    },
    lime: {
      50: "#f7fee7",
      100: "#ecfccb",
      200: "#d9f99d",
      300: "#bef264",
      400: "#a3e635",
      500: "#84cc16",
      600: "#65a30d",
      700: "#4d7c0f",
      800: "#3f6212",
      900: "#365314",
      950: "#365314",
    },
    green: {
      50: "#f0fdf4",
      100: "#dcfce7",
      200: "#bbf7d0",
      300: "#86efac",
      400: "#4ade80",
      500: "#22c55e",
      600: "#16a34a",
      700: "#15803d",
      800: "#166534",
      900: "#14532d",
      950: "#14532d",
    },
    emerald: {
      50: "#ecfdf5",
      100: "#d1fae5",
      200: "#a7f3d0",
      300: "#6ee7b7",
      400: "#34d399",
      500: "#10b981",
      600: "#059669",
      700: "#047857",
      800: "#065f46",
      900: "#064e3b",
      950: "#064e3b",
    },
    teal: {
      50: "#f0fdfa",
      100: "#ccfbf1",
      200: "#99f6e4",
      300: "#5eead4",
      400: "#2dd4bf",
      500: "#14b8a6",
      600: "#0d9488",
      700: "#0f766e",
      800: "#115e59",
      900: "#134e4a",
      950: "#134e4a",
    },
    cyan: {
      50: "#ecfeff",
      100: "#cffafe",
      200: "#a5f3fc",
      300: "#67e8f9",
      400: "#22d3ee",
      500: "#06b6d4",
      600: "#0891b2",
      700: "#0e7490",
      800: "#155e75",
      900: "#164e63",
      950: "#164e63",
    },
    sky: {
      50: "#f0f9ff",
      100: "#e0f2fe",
      200: "#bae6fd",
      300: "#7dd3fc",
      400: "#38bdf8",
      500: "#0ea5e9",
      600: "#0284c7",
      700: "#0369a1",
      800: "#075985",
      900: "#0c4a6e",
      950: "#0c4a6e",
    },
    blue: {
      50: "#eff6ff",
      100: "#dbeafe",
      200: "#bfdbfe",
      300: "#93c5fd",
      400: "#60a5fa",
      500: "#3b82f6",
      600: "#2563eb",
      700: "#1d4ed8",
      800: "#1e40af",
      900: "#1e3a8a",
      950: "#1e3a8a",
    },
    indigo: {
      50: "#eef2ff",
      100: "#e0e7ff",
      200: "#c7d2fe",
      300: "#a5b4fc",
      400: "#818cf8",
      500: "#6366f1",
      600: "#4f46e5",
      700: "#4338ca",
      800: "#3730a3",
      900: "#312e81",
      950: "#312e81",
    },
    violet: {
      50: "#f5f3ff",
      100: "#ede9fe",
      200: "#ddd6fe",
      300: "#c4b5fd",
      400: "#a78bfa",
      500: "#8b5cf6",
      600: "#7c3aed",
      700: "#6d28d9",
      800: "#5b21b6",
      900: "#4c1d95",
      950: "#4c1d95",
    },
    purple: {
      50: "#faf5ff",
      100: "#f3e8ff",
      200: "#e9d5ff",
      300: "#d8b4fe",
      400: "#c084fc",
      500: "#a855f7",
      600: "#9333ea",
      700: "#7e22ce",
      800: "#6b21a8",
      900: "#581c87",
      950: "#581c87",
    },
    fuchsia: {
      50: "#fdf4ff",
      100: "#fae8ff",
      200: "#f5d0fe",
      300: "#f0abfc",
      400: "#e879f9",
      500: "#d946ef",
      600: "#c026d3",
      700: "#a21caf",
      800: "#86198f",
      900: "#701a75",
      950: "#701a75",
    },
    pink: {
      50: "#fdf2f8",
      100: "#fce7f3",
      200: "#fbcfe8",
      300: "#f9a8d4",
      400: "#f472b6",
      500: "#ec4899",
      600: "#db2777",
      700: "#be185d",
      800: "#9d174d",
      900: "#831843",
      950: "#831843",
    },
    rose: {
      50: "#fff1f2",
      100: "#ffe4e6",
      200: "#fecdd3",
      300: "#fda4af",
      400: "#fb7185",
      500: "#f43f5e",
      600: "#e11d48",
      700: "#be123c",
      800: "#9f1239",
      900: "#881337",
      950: "#881337",
    },
  }

  return Object.entries(schemes).flatMap(([value, colors]) => {
    colors[0] = "#ffffff"
    colors[1000] = "#000000"
    const colorsInverted = Object.fromEntries(
      Object.entries(colors).map(([level, color]) => [1000 - +level, color]),
    )
    const schemeInverted = `${value}Inverted`
    const name = toLabel(value)
    return [
      { value, name: toLabel(value), colors },
      {
        value: schemeInverted,
        name: `${name} (Dark Mode)`,
        colors: colorsInverted,
      },
    ]
  }) as ColorSchemeDetail[]
}

export const getColorScheme = (v: ColorScheme) => {
  return colorSchemes().find((s) => s.value === v) || colorSchemes()[0]
}

export const colorStandard = (
  params: {
    color?: ThemeColor
    level?: ColorScale
    opacity?: number
  } = {},
): string => {
  const { color = "primary", level = 500, opacity = 1 } = params

  const colorMap: Record<ThemeColor, ColorRecord | string> = {
    black: "0,0,0",
    white: "255,255,255",
    primary: {
      0: "255,255,255",
      50: "235,235,255",
      100: "214,219,255",
      200: "173,180,255",
      300: "121,134,252",
      400: "103,92,255",
      500: "82,51,255",
      600: "74,46,230",
      700: "68,0,179",
      800: "41,0,117",
      900: "25,0,51",
      1000: "0, 0, 0",
    },
    cyan: {
      0: "255,255,255",
      50: "236, 254, 255",
      100: "207, 250, 254",
      200: "165, 243, 252",
      300: "103, 232, 249",
      400: "34, 211, 238",
      500: "6, 182, 212",
      600: "8, 145, 178",
      700: "14, 116, 144",
      800: "21, 94, 117",
      900: "22, 78, 99",
      1000: "0, 0, 0",
    },
    blue: {
      0: "255,255,255",
      50: "239, 246, 255",
      100: "219, 234, 254",
      200: "191, 219, 254",
      300: "147, 197, 253",
      400: "96, 165, 250",
      500: "59, 130, 246",
      600: "37, 99, 235",
      700: "29, 78, 216",
      800: "30, 64, 175",
      900: "30, 58, 138",
      1000: "0, 0, 0",
    },

    amber: {
      0: "255,255,255",
      50: "254,243,199",
      100: "253,230,138",
      200: "252,211,77",
      300: "251,191,36",
      400: "245,158,11",
      500: "245,158,11",
      600: "217,119,6",
      700: "180,83,9",
      800: "146,64,14",
      900: "120,53,15",
      1000: "0, 0, 0",
    },
    pink: {
      0: "255,255,255",
      50: "253,242,248",
      100: "252,231,243",
      200: "251,207,232",
      300: "249,168,212",
      400: "244,114,182",
      500: "236,72,153",
      600: "219,39,119",
      700: "190,24,93",
      800: "157,23,77",
      900: "131,24,67",
      1000: "0, 0, 0",
    },
    sky: {
      0: "255,255,255",
      50: "240,249,255",
      100: "224,242,254",
      200: "186,230,253",
      300: "125,211,252",
      400: "56,189,248",
      500: "14,165,233",
      600: "2,132,199",
      700: "3,105,161",
      800: "7,89,133",
      900: "12,74,110",
      1000: "0, 0, 0",
    },
    emerald: {
      0: "255,255,255",
      50: "236,253,245",
      100: "209,250,229",
      200: "167,243,208",
      300: "110,231,183",
      400: "52,211,153",
      500: "16,185,129",
      600: "5,150,105",
      700: "4,120,87",
      800: "6,95,70",
      900: "6,78,59",
      1000: "0, 0, 0",
    },
    slate: {
      0: "255,255,255",
      50: "248,250,252",
      100: "241,245,249",
      200: "226,232,240",
      300: "203,213,225",
      400: "148,163,184",
      500: "100,116,139",
      600: "71,85,105",
      700: "51,65,85",
      800: "30,41,59",
      900: "15,23,42",
      1000: "10,15,28",
    },
  }

  if (typeof colorMap[color] == "string") {
    return `rgba(${colorMap[color]}, ${opacity})`
  } else {
    return `rgba(${colorMap[color][level]}, ${opacity})`
  }
}

export const colorMulti = (): string[] => [
  colorStandard(),
  colorStandard({ color: "slate", level: 300 }),
  colorStandard({ color: "pink" }),
  colorStandard({ color: "sky" }),
  colorStandard({ color: "amber" }),
  colorStandard({ color: "emerald" }),
  colorStandard({ color: "amber", level: 300 }),
  colorStandard({ color: "primary", level: 700 }),
  colorStandard({ color: "emerald", level: 300 }),
  colorStandard({ color: "sky", level: 300 }),
  colorStandard({ color: "pink", level: 600 }),
  colorStandard({ color: "amber", level: 600 }),
]
