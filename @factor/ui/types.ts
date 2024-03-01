import type { vueRouter } from '@factor/api'

export interface MenuItem {
  name: string
  group?: string
  location?: 'dashboard' | 'development' | 'admin' | 'site'
  path?: string
  component?: () => Promise<any>
  meta?: Record<string, any>
  icon?: string
  key?: string
  items?: MenuItem[]
  children?: (MenuItem & vueRouter.RouteRecordRaw)[]
  active?: boolean
  priority?: number
  query?: Record<string, any>
  accessLevel?: number
}

export interface MenuGroup {
  group: string
  hideTitle?: true
  menu: MenuItem[]
}
