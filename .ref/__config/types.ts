import { HeadClient } from "@vueuse/head"
import { App, Component } from "vue"
import { Router } from "vue-router"
import { InlineConfig as ViteInlineConfig } from "vite"
import type { ServerModuleDef } from "../plugin-build/types"
import type { FactorApp } from "../plugin-app"
import type { HookType } from "../utils/hook"
import type { FactorServer } from "../plugin-server"
import type { FactorEnv } from "../plugin-env"
import type { FactorPlugin } from "../utils/plugin"
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
  factorApp?: FactorApp
  factorServer?: FactorServer
  factorEnv?: FactorEnv<string>
  [key: string]: unknown
}
export interface UserConfig {
  name?: string

  server?: () =>
    | UserConfig
    | undefined
    | void
    | Promise<UserConfig | undefined | void>

  cwd?: string

  paths?: string[]

  plugins?: FactorPlugin[]
  hooks?: HookType<HookDictionary>[]

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
