import process from 'node:process'
import type { RunVars } from '../inject'

/**
 * checks if environment variables from the server or client is set
 */
export function hasCrossVar(name: string, value?: string): boolean {
  if (typeof window !== 'undefined' && window.fictionRunVars?.[name as keyof RunVars])
    return value ? window.fictionRunVars?.[name as keyof RunVars] === value : true
  else if (typeof process !== 'undefined' && process.env && process.env[name])
    return value ? process.env[name] === value : true

  return false
}
/**
 * Gets environment variables from the server or client
 */
export function getCrossVar<T extends keyof RunVars>(name: T | string): RunVars[T] | string | undefined {
  if (typeof window !== 'undefined' && window.fictionRunVars?.[name as keyof RunVars])
    return window.fictionRunVars?.[name as T]
  else if (typeof process !== 'undefined' && process.env[name])
    return process.env[name]
}

export const isNode = () => !!(typeof process !== 'undefined' && process.versions && process.versions.node)
export const isActualBrowser = (): boolean => !isNode()
export const hasWindow = (): boolean => typeof window !== 'undefined'
export const isTest = () => hasCrossVar('IS_TEST')
export const isApp = () => hasCrossVar('IS_VITE')
export const isDev = () => hasCrossVar('NODE_ENV', 'development')
export const isProd = () => !isDev()
export const isDebug = () => hasCrossVar('DEBUG')
export const isRestart = () => hasCrossVar('IS_RESTART')
export const getVersion = () => getCrossVar('RUNTIME_VERSION')
export const getCommit = () => getCrossVar('RUNTIME_COMMIT')
