import type { MediaConfig } from "."

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
