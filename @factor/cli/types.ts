/**
 * The types of builds that we show progress for
 */
export type BuildTypes = "bundle" | "environment"

/**
 * Control files are additional files that can be added to loaders from filters
 * @param target - the loader to target
 * @param file - the full path to the original file
 */
export type ControlFile = {
  target: LoadTargets
  file?: string
  writeFile?: { filename: string; content: string }
}

/**
 * Types of modules in Factor
 */
export enum ExtendTypes {
  Theme = "theme",
  Plugin = "plugin",
  App = "app",
}

/**
 * Different context targets for module auto-loaders
 */
export enum LoadTargets {
  Server = "server",
  App = "app",
  Style = "style",
  Settings = "settings",
  Lang = "lang",
}

/**
 * Options available for Factor CLI
 */
export interface CommandOptions {
  command?: string
  filter?: string
  install?: boolean
  NODE_ENV?: string
  PORT?: string
  analyze?: boolean
  debug?: boolean
  staticFiles?: boolean
  watchServer?: boolean
  clean?: boolean
  inspect?: boolean
  cwd?: string
  controlFiles?: ControlFile[]
  skipVerifyDeps?: boolean
}

export interface FactorPackageJson {
  name: string
  version: string
  description?: string
  license: string
  private?: boolean
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  gitHooks?: Record<string, string>
  scripts?: Record<string, string>
  workspaces?: string[]
  factor?: {
    title?: string
    _id?: string
    load?: LoadTarget
    extend?: ExtendTypes
    priority?: number
    disable?: string[]
    installed?: boolean
    installRoutine?: "account" | "full"
  }
  repository?: { type?: string; url: string }
  [key: string]: any
}

export type LoadTarget = string[] | string | NormalizedLoadTarget

export type NormalizedLoadTarget = {
  [key: string]: { file: string; _id?: string; priority?: number }[]
  app: { file: string; _id?: string; priority?: number }[]
  server: { file: string; _id?: string; priority?: number }[]
}

export interface FactorExtension {
  isCwd: boolean
  _id: string
  priority: number
  extend: string
  main: string
  name: string
  version: string
  load: NormalizedLoadTarget
}
