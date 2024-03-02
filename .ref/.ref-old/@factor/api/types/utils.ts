/**
 * Standard list format
 */

import { Ref } from "vue"

export interface MenuListItem extends ListItem {
  selected?: boolean
  action?: "navigate" | "callback" | string
  icon?: string
  callback?: (value: string) => any
}
export type ListItem = {
  name?: string
  value?: string | number
  desc?: string
  selected?: boolean
  isDefault?: boolean
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

export type MenuItem = {
  key?: string
  name: string
  icon?: string
  href?: string
  link?: Ref<string>
  // @deprecated
  route?: Ref<string>
  // @deprecated
  url?: Ref<string>
  active?: Ref<boolean>
  onClick?: (evnt?: MouseEvent, item?: MenuItem) => void | Promise<void>
  priority?: number
} & ListItem

export type ActionItem = MenuItem & {
  btn?: "default" | "danger" | "primary" | "caution" | "success"
  size?: "sm" | "lg" | "md" | "xl" | string
}

export interface MenuGroup {
  groupName?: string
  groupKey?: string
  menu: MenuItem[] | readonly MenuItem[]
}

export type InArray<T extends Array<any>> = T extends (infer U)[] ? U : never

export type DataFilter = {
  field: string
  value: string | number
  operator: "==" | "!="
}
