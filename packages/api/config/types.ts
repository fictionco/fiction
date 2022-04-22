import { HeadClient } from "@vueuse/head"
import { App, Component } from "vue"
import { Router } from "vue-router"
import { InlineConfig as ViteInlineConfig } from "vite"
import type { AppRoute } from "../utils/router"
import type { Endpoint } from "../engine/endpoint"
import type { ServerModuleDef } from "../render/buildPlugins"

import { LogHandler, SiteMapConfig } from "../types/server"
import { HookType } from "../utils/hook"
import type { HookDictionary } from "./hookDictionary"
export interface FactorAppEntry {
  app: App
  meta: HeadClient
  router: Router
}

export type EntryModuleExports = {
  runApp: (c: { renderUrl?: string }) => Promise<FactorAppEntry>
  RootComponent: Component
  mainFile: MainFile
}

export type MainFile = {
  setup?: (userConfig: UserConfig) => Promise<UserConfig> | UserConfig
  [key: string]: unknown
}
export interface UserConfig {
  name?: string
  mode?: "development" | "production"

  appName?: string
  appEmail?: string
  appUrl?: string

  // need a generic to fix typing error in setupPlugins function
  server?: () =>
    | UserConfig
    | undefined
    | void
    | Promise<UserConfig | undefined | void>

  cwd?: string
  root?: string
  port?: string
  portApp?: string
  serverUrl?: string
  log?: LogHandler
  // extend
  paths?: string[]
  endpoints?: Endpoint[]
  routes?: AppRoute<string>[]
  sitemaps?: SiteMapConfig[]
  plugins?: (UserConfig | Promise<UserConfig>)[]
  hooks?: HookType<HookDictionary>[]
  service?: { key: string; run: () => Promise<void> | void }[]
  // build
  vite?: Partial<ViteInlineConfig>
  serverOnlyImports?: ServerModuleDef[]
  generateStaticConfig?: boolean
  variables?: Record<
    string,
    | string
    | number
    | Record<string, string>
    | string[]
    | Record<string, string>[]
  >
}
