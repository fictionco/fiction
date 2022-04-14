import { HeadClient } from "@vueuse/head"
import { App, Component } from "vue"
import { Router } from "vue-router"
import { InlineConfig as ViteInlineConfig } from "vite"
import type { AppRoute } from "../router"
import type { ManageUserParams } from "../plugin-user"
import type { Endpoint, EndpointMeta } from "../engine/endpoint"
import type { ServerModuleDef } from "../render/buildPlugins"
import type { HookType } from "../engine/hookDictionary"
import { DataProcessor } from "../processor"
import { FullUser } from "./user"
import { LogHandler, SiteMapConfig } from "./server"

export interface FactorAppEntry {
  app: App
  meta: HeadClient
  router: Router
}

export type EntryModuleExports = {
  runApp: (c: {
    renderUrl?: string
    isSSR?: boolean
  }) => Promise<FactorAppEntry>
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
  root?: string
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
  vite?: Partial<ViteInlineConfig>
  userProcessors?: DataProcessor<
    FullUser,
    { meta?: EndpointMeta; params?: ManageUserParams }
  >[]
}
