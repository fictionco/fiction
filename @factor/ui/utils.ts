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
