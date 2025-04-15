import type { RunVars } from '../inject.js'
import type { FictionEnv } from '../plugin-env/index.js'
import process from 'node:process'
import { toCamel } from './casing.js'
import { randomBetween } from './utils.js'

export class CrossVarManager {
  private managedKeys: Set<string> = new Set()
  /**
   * Determines if the window object is defined and has fictionRunVars.
   */
  private isWindowAvailable(): boolean {
    return typeof window !== 'undefined' && window.fictionRunVars !== undefined
  }

  /**
   * Determines if the process object is defined and has env.
   */
  private isProcessAvailable(): boolean {
    return typeof process !== 'undefined' && process.env !== undefined
  }

  /**
   * Returns the available storage for environment variables.
   */
  vars(): Partial<RunVars> {
    let out = {}
    if (this.isWindowAvailable())
      out = { ...window.fictionRunVars }

    if (this.isProcessAvailable())
      out = { ...process.env, ...out } as Partial<RunVars>

    return out
  }

  /**
   * Checks if a variable exists and optionally if it matches a specific value.
   */
  has<T extends keyof RunVars>(name: T, value?: RunVars[T]): boolean {
    const storage = this.vars()
    return storage[name] !== undefined && (value ? storage[name] === value : true)
  }

  /**
   * Gets a cross-environment variable.
   */
  get<T extends keyof RunVars>(name: T | string, opts?: { errorOnUndefined?: boolean }): RunVars[T] | string | undefined {
    const { errorOnUndefined = false } = opts || {}
    const storage = this.vars()
    const out = storage[name as T]

    if (errorOnUndefined && out === undefined)
      throw new Error(`CrossVarManager: ${name} is not set`)

    return out
  }

  /**
   * Sets a RunVar
   */
  set<T extends keyof RunVars>(name: T, value: RunVars[T]): void {
    this.setAny(name, value as string)
  }

  setAny(name: string, value: string): void {
    if (this.isWindowAvailable())
      window.fictionRunVars[name] = value

    if (this.isProcessAvailable())
      process.env[name] = value

    this.managedKeys.add(name)
  }

  // Sets a general global var
  setVar(name: string, value: string): void {
    if (this.isWindowAvailable())
      window.fictionRunVars[name] = value

    if (this.isProcessAvailable())
      process.env[name] = value

    this.managedKeys.add(name)
  }

  /**
   * Deletes a cross-environment variable.
   */
  delete<T extends keyof RunVars>(name: T): void {
    if (this.isWindowAvailable())
      delete window.fictionRunVars[name]

    if (this.isProcessAvailable())
      delete process.env[name]

    this.managedKeys.delete(name as string)
  }

  /**
   * Clears all variables set by this CrossVarManager instance
   */
  clear(): void {
    for (const key of this.managedKeys) {
      if (this.isWindowAvailable())
        delete window.fictionRunVars[key]

      if (this.isProcessAvailable())
        delete process.env[key]
    }
    this.managedKeys.clear()
  }
}

export const crossVar = new CrossVarManager()

export const isNode = () => !!(typeof process !== 'undefined' && process.versions && process.versions.node)
export const isActualBrowser = (): boolean => !isNode()
export const hasWindow = (): boolean => typeof window !== 'undefined'
export const isTest = () => crossVar.has('IS_TEST')
export const isSSR = () => import.meta.env?.SSR
export const isApp = () => crossVar.has('IS_APP_SSR') || crossVar.has('IS_APP_CLIENT')

export const isCi = () => crossVar.has('CI')
export const isDev = () => crossVar.has('NODE_ENV', 'development')
export const isProd = () => !isDev()
export const isDebug = () => crossVar.has('DEBUG')
export const isRestart = () => crossVar.has('IS_RESTART')
export const getVersion = () => crossVar.get('BUILD_VERSION')
export const getCommit = () => crossVar.get('BUILD_COMMIT')

type Camelize<S extends string> = S extends `${infer T}_${infer U}`
  ? `${Lowercase<T>}${Capitalize<Camelize<U>>}`
  : Lowercase<S>

type CamelizeEnvVars<T extends string, R = string> = {
  [K in T as Camelize<K>]: R;
}

export function getEnvVars<T extends readonly string[]>(fictionEnv: FictionEnv, envVarNames: T): CamelizeEnvVars<T[number]> {
  const envVars = {} as CamelizeEnvVars<T[number]>

  envVarNames.forEach((name) => {
    const camelCaseName = toCamel(name) as keyof CamelizeEnvVars<T[number]>

    const value = fictionEnv.var(name)

    envVars[camelCaseName] = value as any
  })

  return envVars
}

export function setupTestPorts<T extends readonly string[]>(args: { opts: Record<string, any>, envVars: T, context: 'node' | 'app' }) {
  const { opts, envVars, context } = args

  const portVars = {} as CamelizeEnvVars<T[number], number>

  for (const envVar of envVars) {
    const varName = toCamel(envVar) as keyof CamelizeEnvVars<T[number], number>
    let val = opts[varName]
    if (context === 'app') {
      val = +(crossVar.get(envVar) || '')
    }
    else {
      val = val || randomBetween(10000, 50000)
      crossVar.setVar(envVar, String(val))
    }

    portVars[varName] = (+val as any)
  }

  return portVars
}
