/**
 * Standard list format
 */

export interface MenuListItem extends ListItem {
  selected?: boolean
  action?: "navigate" | "callback" | string
  icon?: string
  callback?: (value: string) => any
}
export type ListItem = {
  name?: string
  value?: string
  desc?: string
  selected?: boolean
  [key: string]: any
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
  route?: string
  url?: string
  path?: string
  active?: boolean
  onClick?: (item: MenuItem) => void
  action?: "navigate" | "callback" | string
}

export interface MenuGroup {
  groupName?: string
  menu: MenuItem[]
}

export type InArray<T extends Array<any>> = T extends (infer U)[] ? U : never