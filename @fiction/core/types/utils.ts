import type { ComputedRef, Ref } from 'vue'
import type { MediaDisplayObject } from '../plugin-media'
import type { User } from '../plugin-user'

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

/**
 * Object with a priority key for sorting
 */
export interface PriorityItem {
  priority?: number
  [key: string]: any
}

export type RawListItem = ListItem | string

export type ClickHandler = (args: {
  event?: MouseEvent
  item?: NavItem
}) => void | Promise<void>

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

export type IndexItem = {
  images?: MediaDisplayObject[]
  links?: ActionItem[]
  actions?: ActionItem[]
  category?: ActionItem[]
  tags?: ActionItem[]
  authors?: User[]
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
