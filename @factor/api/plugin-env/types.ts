import type { MergeHead } from '@unhead/schema'
import type { VueHeadClient } from '@unhead/vue'
import type { JSONSchema } from 'json-schema-to-typescript'
import type { Router } from 'vue-router'
import type { vue } from '../utils'
import type { PackageJson } from '../types'
import type { FactorApp } from '../plugin-app'
import type { FactorServer } from '../plugin-server'
import type { FactorEnv } from '../plugin-env'
import type { FactorObject, FactorPlugin } from '../plugin'
import type { RunVars } from '../inject'

export type FactorEnvHookDictionary = {
  runCommand: {
    args: [string, CliOptions]
  }
  staticConfig: {
    args: [Record<string, unknown>]
  }
  staticSchema: {
    args: [JSONSchema['properties']]
  }
}

export interface FactorAppEntry<T extends ServiceList = ServiceList> {
  app: vue.App
  router: Router
  meta: VueHeadClient<MergeHead>
  service: T
}

export interface EntryModuleExports {
  runApp: (c: { renderUrl?: string }) => Promise<FactorAppEntry>
  RootComponent: vue.Component
  mainFile: MainFile
}

export interface MainFile {
  setup: () => Promise<ServiceConfig> | ServiceConfig
  factorApp?: FactorApp
  factorServer?: FactorServer
  factorEnv?: FactorEnv
  [key: string]: unknown
}

export type ServiceList = Record<string, FactorPlugin | FactorObject > & { factorEnv?: FactorEnv }

export type CliVars = {
  RUNTIME_VERSION: string
  RUNTIME_COMMIT: string
  COMMAND: string
  COMMAND_OPTS: string
}

export type ServiceConfig = {
  factorEnv: FactorEnv
  runCommand?: (args: { context: 'node' | 'app', command: string, cliVars?: Partial<CliVars>, runVars?: Partial<RunVars>, options?: CliOptions }) => Promise<void> | void
  createService?: (args: { serviceConfig: ServiceConfig } & ({ context: 'app', runVars: Partial<RunVars> } | { context: 'node', cliVars: Partial<CliVars> } | { context: 'test' })) => Promise<ServiceList> | ServiceList
  createMount?: (args: { renderRoute?: string, runVars: Partial<RunVars>, service: ServiceList, serviceConfig: ServiceConfig }) => Promise<FactorAppEntry> | FactorAppEntry
}

export interface CliOptions {
  name?: string
  inspector?: boolean
  exit?: boolean
  appPort?: number
  serverPort?: number
  serve?: boolean
  build?: boolean
  render?: boolean
  patch?: boolean
  skipTests?: boolean
  moduleName?: string
  bundleMode?: 'script' | 'app'
  pkg?: PackageJson
  commit?: string
  pathname?: string
  cwd?: string
  mode?: 'development' | 'production'
  command?: string
  originalCliOptions?: string[]
  [key: string]: unknown
}

export interface Configurations {
  pkg?: PackageJson
  serviceConfig?: ServiceConfig
}

export type RunConfig = CliOptions

export interface ServerModuleDef {
  id: string
  additional?: string[]
  external?: boolean
  resolvedId?: string
}
