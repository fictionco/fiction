/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { vue } from "./libraries"

declare global {
  // eslint-disable-next-line no-var
  var factorState: Record<string, any>
  // eslint-disable-next-line no-var
  var __INITIAL_STATE__: Record<string, any>
}

const globalObject = typeof window != "undefined" ? window : global

export const getState = (): Record<string, any> => {
  return vue.reactive({})
}
/**
 * Gets the primary store and creates it if it doesn't exist
 */
export const getStore = (): Record<string, any> => {
  if (!globalObject.factorState) {
    globalObject.factorState = getState()
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return globalObject.factorState
}
/**
 * Store an item in application store/cache
 *
 * If a typical app function is used in an endpoint, then there will be no store
 * However we don't want to break code that would otherwise work
 */
export const storeItem = <T = unknown>(key: string, value: T): void => {
  const s = getStore()

  s[key] = value
}
/**
 * Get a reactive value from the application store
 * @param key - ID in the flat store
 */
export const stored = <T = unknown>(key?: string | number): T | undefined => {
  if (!key) return

  return getStore()[key] as T | undefined
}
