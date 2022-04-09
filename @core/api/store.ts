/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { reactive } from "vue"
declare global {
  interface Window {
    __INITIAL_STATE__: Record<string, any>
  }
}

const globalObject = (): any => (typeof window != "undefined" ? window : global)

export const getState = (): Record<string, any> => {
  return reactive({})
}
/**
 * Gets the primary store and creates it if it doesn't exist
 */
export const getStore = (): Record<string, any> => {
  if (!globalObject().factorState) {
    globalObject().factorState = getState()
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return globalObject().factorState
}
/**
 * Store an item in application store/cache
 *
 * If a typical app function is used in an endpoint, then there will be no store
 * However we don't want to break code that would otherwise work
 */
export const storeItem = <T = unknown>(key: string, value: T): void => {
  getStore()[key] = value
}
/**
 * Get a reactive value from the application store
 * @param key - ID in the flat store
 */
export const stored = <T = unknown>(key?: string | number): T | undefined => {
  if (!key) return

  return getStore()[key] as T | undefined
}
