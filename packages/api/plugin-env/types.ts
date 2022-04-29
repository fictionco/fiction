import { HeadClient } from "@vueuse/head"
import { App, Component } from "vue"
import { Router } from "vue-router"
import { InlineConfig as ViteInlineConfig } from "vite"
import type { JSONSchema } from "json-schema-to-typescript"
import { PackageJson } from "../types"
import type { ServerModuleDef } from "../plugin-build/types"
import type { FactorApp } from "../plugin-app"
import type { FactorServer } from "../plugin-server"
import type { FactorEnv } from "../plugin-env"
import type { FactorPlugin } from "../plugin"

export type FactorEnvHookDictionary = {
  runCommand: {
    args: [string, CliOptions]
  }
  staticConfig: {
    args: [Record<string, unknown>]
  }
  staticSchema: {
    args: [JSONSchema["properties"]]
  }
}

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
  setup?: (
    serviceConfig: ServiceConfig,
  ) => Promise<ServiceConfig> | ServiceConfig
  factorApp?: FactorApp
  factorServer?: FactorServer
  factorEnv?: FactorEnv<string>
  [key: string]: unknown
}
export interface ServiceConfig {
  name?: string

  server?: () =>
    | ServiceConfig
    | undefined
    | void
    | Promise<ServiceConfig | undefined | void>

  cwd?: string
  paths?: string[]
  service?: Record<string, FactorPlugin | string | object | unknown[]>
  vite?: Partial<ViteInlineConfig>
  serverOnlyImports?: ServerModuleDef[]
  variables?: Record<
    string,
    | string
    | number
    | Record<string, string>
    | string[]
    | Record<string, string>[]
  >
  [key: string]: unknown
}

export type CliOptions = {
  name?: string
  inspector?: boolean
  exit?: boolean
  appPort?: number
  serverPort?: number
  serve?: boolean
  prerender?: boolean
  patch?: boolean
  skipTests?: boolean
  moduleName?: string
  bundleMode?: "script" | "app"
  pkg?: PackageJson
  commit?: string
  pathname?: string
  cwd?: string
  mode?: "development" | "production"
  command?: string
}

export type Configurations = {
  pkg?: PackageJson
  serviceConfig?: ServiceConfig
}

export type RunConfig = CliOptions

export interface StandardPaths {
  cwd: string
  dist: string
  distServer: string
  distClient: string
  distStatic: string
  distServerEntry: string
  sourceDir: string
  publicDir: string
  mainFilePath: string
  rootComponentPath: string
  mountFilePath: string
}
