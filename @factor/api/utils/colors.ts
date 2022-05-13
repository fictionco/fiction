type ColorScale =
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

export type ThemeColor =
  | "amber"
  | "pink"
  | "primary"
  | "emerald"
  | "sky"
  | "slate"
  | "black"
  | "white"

type ColorRecord = {
  [P in ColorScale]?: string
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
    amber: {
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
    },
    pink: {
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
    },
    sky: {
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
    },
    emerald: {
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
    },
    slate: {
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
    primary: {
      50: "235,235,255",
      100: "214,219,255",
      200: "173,180,255",
      300: "121,134,252",
      400: "103,92,255",
      500: "82,51,255",
      600: "74,25,210",
      700: "68,0,179",
      800: "41,0,117",
      900: "25,0,51",
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
