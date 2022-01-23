import { HeadClient } from "@vueuse/head"
import { App } from "vue"
import { Router, RouteRecordRaw } from "vue-router"
import { Store } from "vuex"
import { FullUser } from "./user"
import { EndpointConfig } from "./endpoint"
import { LogHandler, DataProcessor, SiteMapConfig } from "./server"
import { CallbackDictionary } from "./dictionary"
export interface FactorAppEntry {
  app: App
  head: HeadClient
  router: Router
  store: Store<Record<string, any>>
}

export type FactorPluginConfig<T> = {
  name: string
  // need a generic to fix typing error in setupPlugins function
  setup?: <U = T>() =>
    | U
    | Promise<U>
    | undefined
    | void
    | Promise<undefined>
    | Promise<void>
}

export type FactorPluginConfigServer = {
  name: string
  // need a generic to fix typing error in setupPlugins function
  setup?: () =>
    | UserConfigServerOptions
    | undefined
    | void
    | Promise<UserConfigServerOptions | undefined | void>
} & UserConfigServerOptions

export type FactorPluginConfigApp = FactorPluginConfig<UserConfigAppOptions>

export type UserConfigServer = Partial<UserConfigServerOptions>

export type AnyUserConfig = UserConfigApp & UserConfigServer

/**
 * Determine callback by hook
 * https://github.com/microsoft/TypeScript/issues/36444
 */
type HookType<T extends Record<string, any[]>> = {
  [K in keyof T]: {
    hook: K
    callback: (..._arguments: T[K]) => Promise<void>
  }
}[keyof T]

export interface UserConfigServerOptions {
  variables?: Record<string, string>
  endpoints?: EndpointConfig[]
  endpointPort?: number
  sitemaps?: SiteMapConfig[]
  log?: LogHandler
  plugins?: (FactorPluginConfigServer | Promise<FactorPluginConfigServer>)[]
  hooks?: HookType<CallbackDictionary>[]
  user?: {
    processors?: DataProcessor<FullUser>[]
    onVerified?: (user: FullUser) => Promise<void> | void
  }
}

export type UserConfigApp = Partial<UserConfigAppOptions>

export interface UserConfigAppOptions {
  name?: string
  routes: RouteRecordRaw[]
  plugins: FactorPluginConfig<UserConfigAppOptions>[]
}
