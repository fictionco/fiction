import { RouteConfig } from "vue-router"

export interface MenuItem {
  name: string
  group?: string
  location?: "dashboard" | "development" | "admin" | "site"
  path?: string
  component?: () => Promise<any>
  meta?: Record<string, any>
  icon?: string
  key?: string
  items?: MenuItem[]
  children?: (MenuItem & RouteConfig)[]
  active?: boolean
  priority?: number
  query?: Record<string, any>
  accessLevel?: number
}

export type MenuGroup = {
  group: string
  hideTitle?: true
  menu: MenuItem[]
}
