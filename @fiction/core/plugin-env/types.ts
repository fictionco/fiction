import type { MergeHead } from '@unhead/schema'
import type { VueHeadClient } from '@unhead/vue'
import type { Router } from 'vue-router'
import type { vue } from '../utils'
import type { PackageJson } from '../types'
import type { FictionApp } from '../plugin-app'
import type { FictionServer } from '../plugin-server'
import type { FictionEnv } from '../plugin-env'
import type { FictionObject, FictionPlugin } from '../plugin'
import type { RunVars } from '../inject'

export interface FictionAppEntry<T extends ServiceList = ServiceList> {
  app: vue.App
  router: Router
  meta: VueHeadClient<MergeHead>
  service: T
}

export interface EntryModuleExports {
  runApp: (c: { renderUrl?: string }) => Promise<FictionAppEntry>
  RootComponent: vue.Component
  mainFile: MainFile
}

export interface MainFile {
  setup: () => Promise<ServiceConfig> | ServiceConfig
  fictionApp?: FictionApp
  fictionServer?: FictionServer
  fictionEnv?: FictionEnv
  [key: string]: unknown
}

export type ServiceList = Record<string, FictionPlugin | FictionObject | Function | Record<string, unknown>> & { fictionEnv?: FictionEnv }

export type CliVars = {
  RUNTIME_VERSION: string
  RUNTIME_COMMIT: string
  COMMAND: string
  COMMAND_OPTS: string
}

export type ServiceConfig = {
  fictionEnv: FictionEnv
  runCommand?: (args: { context: 'node' | 'app', command: string, cliVars?: Partial<CliVars>, runVars?: Partial<RunVars>, options?: CliOptions }) => Promise<void> | void
  createService?: (args: { serviceConfig: ServiceConfig } & ({ context: 'app', runVars: Partial<RunVars> } | { context: 'node', cliVars: Partial<CliVars> } | { context: 'test' })) => Promise<ServiceList> | ServiceList
  createMount?: (args: { renderRoute?: string, runVars: Partial<RunVars>, service: ServiceList, serviceConfig: ServiceConfig }) => Promise<FictionAppEntry> | FictionAppEntry
  close?: () => Promise<void> | void
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
