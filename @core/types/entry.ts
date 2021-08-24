import { HeadClient } from "@vueuse/head"
import { App } from "vue"
import { Router, RouteRecordRaw } from "vue-router"
import { Store } from "vuex"
import { FullUser } from "./user"
import { EndpointConfig } from "./endpoint"
import { LogHandler, DataProcessor, SiteMapConfig } from "./server"
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

export interface UserConfigServerOptions {
  appName?: string
  appEmail?: string
  appUrl?: string
  appDomain?: string
  endpoints?: EndpointConfig[]
  sitemaps?: SiteMapConfig[]
  log?: LogHandler
  plugins?: (FactorPluginConfigServer | Promise<FactorPluginConfigServer>)[]
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
