import { Ref } from "vue"
import { vueRouter } from "../utils/libraries"
import type { FullUser } from "../plugin-user/types"
import type { FactorRouter } from "."

export type BaseCompiledConfig = {
  routes: string
  ui: string
  endpoints: string
  commands: string
  menus: string
}

export type RouteReplacer = {
  key: string
  val: Ref<string | undefined> | string | undefined
}

export type NavigateRoute =
  | undefined
  | boolean
  | vueRouter.RouteLocationRaw
  | string
  | Promise<boolean | vueRouter.RouteLocationRaw | undefined | string>

export type RouteAuthCallback = (args: {
  user?: FullUser
  isSearchBot?: boolean
  factorRouter?: FactorRouter
  route: vueRouter.RouteLocationNormalized
}) =>
  | Promise<{ navigate: NavigateRoute; id: string } | undefined>
  | { navigate: NavigateRoute; id: string } | undefined
