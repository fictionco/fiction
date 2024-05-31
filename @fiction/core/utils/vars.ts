import process from 'node:process'
import type { RunVars } from '../inject'
import type { FictionEnv } from '../plugin-env'
import { toCamel } from './casing'

export class CrossVarManager {
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
  get<T extends keyof RunVars>(name: T | string): RunVars[T] | string | undefined {
    const storage = this.vars()
    return storage[name as T]
  }

  /**
   * Sets a cross-environment variable.
   */
  set<T extends keyof RunVars>(name: T, value: RunVars[T]): void {
    if (this.isWindowAvailable())
      window.fictionRunVars[name] = value

    if (this.isProcessAvailable())
      process.env[name] = value as NodeJS.ProcessEnv[T]
  }

  /**
   * Deletes a cross-environment variable.
   */
  delete<T extends keyof RunVars>(name: T): void {
    if (this.isWindowAvailable())
      delete window.fictionRunVars[name]

    if (this.isProcessAvailable())
      delete process.env[name]
  }
}

export const crossVar = new CrossVarManager()

export const isNode = () => !!(typeof process !== 'undefined' && process.versions && process.versions.node)
export const isActualBrowser = (): boolean => !isNode()
export const hasWindow = (): boolean => typeof window !== 'undefined'
export const isTest = () => crossVar.has('IS_TEST')
export const isApp = () => crossVar.has('IS_VITE')
export const isCi = () => crossVar.has('CI')
export const isDev = () => crossVar.has('NODE_ENV', 'development')
export const isProd = () => !isDev()
export const isDebug = () => crossVar.has('DEBUG')
export const isRestart = () => crossVar.has('IS_RESTART')
export const getVersion = () => crossVar.get('RUNTIME_VERSION')
export const getCommit = () => crossVar.get('RUNTIME_COMMIT')

type Camelize<S extends string> = S extends `${infer T}_${infer U}`
  ? `${Lowercase<T>}${Capitalize<Camelize<U>>}`
  : Lowercase<S>

type CamelizeEnvVars<T extends string> = {
  [K in T as Camelize<K>]: string;
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
