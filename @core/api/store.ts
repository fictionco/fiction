/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { reactive } from "vue"
import { getGlobal, setGlobal } from "./global"
declare global {
  interface Window {
    __INITIAL_STATE__: Record<string, any>
  }
}

export const getState = (): Record<string, any> => {
  return reactive({})
}
/**
 * Gets the primary store and creates it if it doesn't exist
 */
export const getStore = () => {
  let state: Record<string, any> | undefined = getGlobal("store")
  if (!state) {
    state = getState()
    setGlobal("store", state)
  }
  return state
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
