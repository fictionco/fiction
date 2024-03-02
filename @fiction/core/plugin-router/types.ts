import type { vueRouter } from '../utils/libraries'
import type { User } from '../plugin-user/types'
import type { FactorUser } from '../plugin-user'
import type { FactorRouter } from '.'

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
  factorRouter?: FactorRouter
  factorUser?: FactorUser
  route: vueRouter.RouteLocationNormalized
}) =>
| Promise<
  { navigate: NavigateRoute, id: string, reason?: string } | undefined
    >
    | { navigate: NavigateRoute, id: string, reason?: string }
    | undefined
