import { HeadClient } from "@vueuse/head"
import { App, Component } from "vue"
import { Router } from "vue-router"
import { Store } from "vuex"
import { AppRoute } from "@factor/api/router"
import { ManageUserParams } from "@factor/engine/userAuth"
import { Endpoint, EndpointMeta } from "@factor/engine/endpoint"
import type { ServerModuleDef } from "@factor/render/buildPlugins"
import { HookType, HookDictionary } from "@factor/engine/hookDictionary"
import { FullUser } from "./user"
import { LogHandler, DataProcessor, SiteMapConfig } from "./server"
export interface FactorAppEntry {
  app: App
  meta: HeadClient
  router: Router
  store: Store<Record<string, any>>
}

export type EntryModuleExports = {
  runApp: (c: { renderUrl?: string }) => Promise<FactorAppEntry>
  RootComponent: Component
  mainFile: MainFile
}

export type MainFile = { setup?: () => Promise<UserConfig> | UserConfig }
export interface UserConfig {
  name?: string
  // need a generic to fix typing error in setupPlugins function
  server?: () =>
    | UserConfig
    | undefined
    | void
    | Promise<UserConfig | undefined | void>
  variables?: Record<
    string,
    | string
    | number
    | Record<string, string>
    | string[]
    | Record<string, string>[]
  >
  cwd?: string
  paths?: string[]
  endpoints?: Endpoint[]
  port?: string
  portApp?: string
  serverOnlyImports?: ServerModuleDef[]
  routes?: AppRoute<string>[]
  sitemaps?: SiteMapConfig[]
  log?: LogHandler
  plugins?: (UserConfig | Promise<UserConfig>)[]
  hooks?: HookType[]
  userProcessors?: DataProcessor<
    FullUser,
    { meta?: EndpointMeta; params?: ManageUserParams }
  >[]
}
