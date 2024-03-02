import type { MediaConfig } from "@factor/api"

export type GradientItem = {
  color?: string
  percent?: number
}
export type GradientSetting = {
  angle?: number
  stops?: GradientItem[]
  css?: string
}

export type OverlaySetting = {
  gradient?: GradientSetting
  opacity?: number
  blendMode?: string
}

export const imageFilters = [
  "brightness",
  "opacity",
  "contrast",
  "blur",
  "grayscale",
  "sepia",
  "saturate",
  "invert",
  "hue-rotate",
] as const

export type ImageFilter = typeof imageFilters[number]

export type ImageFilterConfig = {
  filter: ImageFilter
  percent?: number
  value?: string
}

export type MediaDisplayObject = MediaConfig & {
  filters?: ImageFilterConfig[]
  overlay?: OverlaySetting
}

export const getGradientCss = (
  gradient?: GradientSetting,
  options?: { noAngle?: boolean },
): string => {
  const { noAngle } = options || {}
  if (!gradient?.stops) return ""

  const st = gradient.stops.map((i) => i.color).filter(Boolean)

  // to force render if only one stop
  if (st.length == 1) {
    st.push(st[0])
  }

  const li = st.join(", ")

  const angle = noAngle || !gradient.angle ? 90 : gradient.angle
  return li ? `linear-gradient(${angle}deg, ${li})` : ""
}

export const getImageFilter = (f: ImageFilter, a?: number): string => {
  if (typeof a == "undefined") return ""

  let v: string = ""
  if (f == "blur") {
    v = `blur(${(a / 100) * 10}px)`
  } else if (f == "opacity") {
    v = `opacity(${a / 100})`
  } else if (f == "grayscale") {
    v = `grayscale(${a / 100})`
  } else if (f == "invert") {
    v = `invert(${a / 100})`
  } else if (f == "sepia") {
    v = `sepia(${a / 100})`
  } else if (f == "brightness") {
    v = `brightness(${(a / 100) * 2})`
  } else if (f == "saturate") {
    v = `saturate(${(a / 100) * 2})`
  } else if (f == "hue-rotate") {
    v = `hue-rotate(${(a / 100) * 360}deg)`
  } else if (f == "contrast") {
    v = `contrast(${(a / 100) * 2})`
  }

  return v
}
