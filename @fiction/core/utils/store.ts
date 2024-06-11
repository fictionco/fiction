/* eslint-disable vars-on-top, no-var */
import { vue } from './libraries.js'

declare global {
  var fictionState: Record<string, any>
  var __INITIAL_STATE__: Record<string, any>
}

const globalObject = typeof window === 'undefined' ? globalThis : window

export function getState(): Record<string, any> {
  return vue.reactive({})
}
/**
 * Gets the primary store and creates it if it doesn't exist
 */
export function getStore(): Record<string, any> {
  if (!globalObject.fictionState)
    globalObject.fictionState = getState()

  return globalObject.fictionState
}
/**
 * Store an item in application store/cache
 *
 * If a typical app function is used in an endpoint, then there will be no store
 * However we don't want to break code that would otherwise work
 */
export function storeItem<T = unknown>(key: string, value: T): void {
  const s = getStore()

  s[key] = value
}
/**
 * Get a reactive value from the application store
 * @param key - ID in the flat store
 */
export function stored<T = unknown>(key?: string | number): T | undefined {
  if (!key)
    return

  return getStore()[key] as T | undefined
}
