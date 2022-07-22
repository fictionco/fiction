import { HeadClient } from "@vueuse/head"
import type { JSONSchema } from "json-schema-to-typescript"
import { vue } from "../utils"
import { PackageJson } from "../types"
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
  app: vue.App
  meta: HeadClient
  service: ServiceList
}

export type EntryModuleExports = {
  runApp: (c: { renderUrl?: string }) => Promise<FactorAppEntry>
  RootComponent: vue.Component
  mainFile: MainFile
}

export type MainFile = {
  setup?: (
    serviceConfig: ServiceConfig,
  ) => Promise<ServiceConfig> | ServiceConfig
  factorApp?: FactorApp
  factorServer?: FactorServer
  factorEnv?: FactorEnv
  [key: string]: unknown
}

export type ServiceList = Record<
  string,
  FactorPlugin | string | Record<string, unknown> | unknown[] | vue.Ref<unknown>
>

export type ServiceConfig = {
  paths?: string[]
  service?: ServiceList
  [key: string]: unknown
}

export type CliOptions = {
  name?: string
  inspector?: boolean
  exit?: boolean
  appPort?: number
  serverPort?: number
  serve?: boolean
  render?: boolean
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
  originalCliOptions?: string[]
  [key: string]: unknown
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
