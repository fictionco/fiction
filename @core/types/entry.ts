import { HeadClient } from "@vueuse/head"
import { App } from "vue"
import { Router } from "vue-router"
import { Store } from "vuex"
import { AppRoute } from "@factor/api/router"
import { ManageUserParams } from "@factor/engine/userAuth"
import { Endpoint, EndpointMeta } from "@factor/engine/endpoint"
import type { ServerModuleDef } from "@factor/render/buildPlugins"
import { FullUser } from "./user"
import { LogHandler, DataProcessor, SiteMapConfig } from "./server"
import { CallbackDictionary } from "./dictionary"
export interface FactorAppEntry {
  app: App
  meta: HeadClient
  router: Router
  store: Store<Record<string, any>>
}

export type EntryModuleExports = {
  factorApp: (c: { renderUrl: string }) => Promise<FactorAppEntry>
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
  variables?: Record<
    string,
    | string
    | number
    | Record<string, string>
    | string[]
    | Record<string, string>[]
  >
  cwd?: string
  endpoints?: Endpoint[]
  port?: string
  portApp?: string
  serverOnlyImports?: ServerModuleDef[]
  routes?: AppRoute<string>[]
  sitemaps?: SiteMapConfig[]
  log?: LogHandler
  plugins?: (FactorPluginConfigServer | Promise<FactorPluginConfigServer>)[]
  hooks?: HookType<CallbackDictionary>[]
  userProcessors?: DataProcessor<
    FullUser,
    { meta?: EndpointMeta; params?: ManageUserParams }
  >[]
}

export type UserConfigApp = Partial<UserConfigAppOptions>

export interface UserConfigAppOptions {
  name?: string
  routes: AppRoute<string>[]
  plugins: FactorPluginConfig<UserConfigAppOptions>[]
}
