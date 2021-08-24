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
  value?: any
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
  name: string
  icon?: string
  route?: string
  url?: string
  onClick?: (item: MenuItem) => void
  action?: "navigate" | "callback" | string
  [key: string]: any
}

export interface MenuGroup {
  groupName?: string
  menu: MenuItem[]
}

export type InArray<T extends Array<any>> = T extends (infer U)[] ? U : never