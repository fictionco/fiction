import type { FictionUser } from '../plugin-user/index.js'
import type { User } from '../plugin-user/types.js'
import type { vueRouter } from '../utils/libraries.js'
import type { FictionRouter } from './index.js'

export interface BaseCompiledConfig {
  routes: string
  ui: string
  endpoints: string
  commands: string
  menus: string
}

export type NavigateRoute =
  | boolean
  | vueRouter.RouteLocationRaw
  | Promise<boolean | vueRouter.RouteLocationRaw>

export type RouteAuthCallback = (args: {
  user?: User
  isSearchBot?: boolean
  fictionRouter?: FictionRouter
  fictionUser?: FictionUser
  route: vueRouter.RouteLocationNormalized
}) =>
  | Promise<
  { navigate: NavigateRoute, id: string, reason?: string } | undefined
  >
  | { navigate: NavigateRoute, id: string, reason?: string }
  | undefined
