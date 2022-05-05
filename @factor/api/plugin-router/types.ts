import { Ref } from "vue"

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
