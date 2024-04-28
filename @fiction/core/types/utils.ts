import type { Component, ComputedRef, Ref } from 'vue'
import type { TableMediaConfig } from '../plugin-media'
import type { User } from '../plugin-user'

export type MediaDisplayObject = {
  _key?: string
  filters?: ImageFilterConfig[]
  overlay?: OverlaySetting
  html?: string
  text?: string
  classes?: string
  format?: 'url' | 'video' | 'iframe' | 'html' | 'audio' | 'text'
} & TableMediaConfig

export type GradientItem = { color?: string, percent?: number }
export type GradientSetting = { angle?: number, stops?: GradientItem[], css?: string }
export type OverlaySetting = { gradient?: GradientSetting, opacity?: number, blendMode?: string }

export type BackgroundStyle = {
  color?: string
  gradient?: GradientSetting
  image?: string
  repeat?: 'repeat' | 'no-repeat' | 'repeat-x' | 'repeat-y'
  position?: 'center' | 'top' | 'bottom' | 'left' | 'right'
  size?: 'cover' | 'contain' | 'auto'
}

export const imageFilters = ['brightness', 'opacity', 'contrast', 'blur', 'grayscale', 'sepia', 'saturate', 'invert', 'hue-rotate'] as const

export type ImageFilter = typeof imageFilters[number]

export interface ImageFilterConfig {
  filter: ImageFilter
  percent?: number
  value?: string
}

export interface ListItem {
  name?: string
  value?: string | number
  desc?: string
  selected?: boolean
  isDefault?: boolean
  icon?: string
  callback?: () => any
  actions?: ListItem[]
  items?: ListItem[]
  [key: string]: unknown
}

export type ClickHandler = (args: { event?: MouseEvent, item?: NavItem }) => any | Promise<any>

export interface NavItem {
  name?: string
  desc?: string
  icon?: string
  href?: string
  isActive?: boolean
  key?: string
  onClick?: ClickHandler
  priority?: number
  class?: string
  target?: string
  items?: NavItem[]
}

export type ActionItem = NavItem & {
  btn?: 'default' | 'danger' | 'primary' | 'caution' | 'success'
  size?: 'sm' | 'lg' | 'md' | 'xl'
  target?: string
  loading?: boolean
}

export type MediaItem = {
  media?: MediaDisplayObject
  overlays?: MediaDisplayObject[]
  tags?: string[]
  actions?: ActionItem[]
} & NavItem

export interface NavItemGroup {
  title?: string
  key?: string
  items: NavItem[] | readonly NavItem[]
  class?: string
}

export interface NavGroup {
  title?: string
  key?: string
  class?: string
  items: NavItem[]
}

export type Figure = { el?: Component, props?: Record<string, any> }

export type IndexItem = {
  images?: MediaDisplayObject[]
  links?: ActionItem[]
  actions?: ActionItem[]
  category?: ActionItem[]
  tags?: ActionItem[]
  authors?: User[]
  figure?: Figure
} & NavItem

// @deprecated
export type MenuItem = {
  sup?: string
  key?: string
  name: string
  icon?: string
  href?: string
  link?: Ref<string>

  // @deprecated
  route?: Ref<string> | ComputedRef<string>
  // @deprecated
  url?: Ref<string>
  active?: Ref<boolean> | ComputedRef<string>
  onClick?: (evnt?: MouseEvent, item?: MenuItem) => void | Promise<void>
  priority?: number
  btn?: string
  loading?: boolean
  target?: string
} & ListItem

export interface MenuGroup {
  groupName?: string
  groupKey?: string
  class?: string
  menu: MenuItem[] | readonly MenuItem[]
}

export type InArray<T extends Array<any>> = T extends (infer U)[] ? U : never

// sql where operators.value
export interface DataFilter {
  field: string
  value: string | number | string[] | number[] | boolean
  operator:
    | '='
    | '!='
    | '>'
    | '<'
    | '>='
    | '<='
    | 'like'
    | 'not like'
    | 'in'
    | 'not in'
}
