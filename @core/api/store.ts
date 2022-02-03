import * as Vuex from "vuex"

import { getAppGlobal, setAppGlobal } from "./utils"
declare global {
  interface Window {
    __INITIAL_STATE__: Record<string, any>
  }
}
/**
 * Create a vuex store
 */
export const createStore = (): Vuex.Store<Record<string, any>> => {
  const store = new Vuex.Store({
    strict: false,
    state: (): Record<string, any> => {
      return {}
    },
    getters: {
      getItem:
        (state: Record<string, any>) =>
        (item: string): any => {
          return state[item]
        },
    },
    mutations: {
      setItem: (
        state,
        { item, value }: { item: string; value: unknown },
      ): void => {
        state[item] = value
      },
    },
  })

  /**
   * prime the store with server-initialized state.
   * the state is determined during SSR and inlined in the page markup.
   */
  if (typeof window != "undefined" && window.__INITIAL_STATE__) {
    store.replaceState(window.__INITIAL_STATE__)
  }

  return store
}
/**
 * Gets the primary store and creates it if it doesn't exist
 */
export const getStore = (): Vuex.Store<Record<string, any>> => {
  let store: Vuex.Store<Record<string, any>> | undefined = getAppGlobal("store")
  if (!store) {
    store = createStore()
    setAppGlobal("store", store)
  }
  return store
}
/**
 * Store an item in application store/cache
 *
 * If a typical app function is used in an endpoint, then there will be no store
 * However we don't want to break code that would otherwise work
 */
export const storeItem = <T = unknown>(item: string, value: T): void => {
  return getStore().commit("setItem", { item, value })
}
/**
 * Get a reactive value from the application store
 * @param key - ID in the flat store
 */
export const stored = <T = unknown>(
  key?: string | number | Date,
): T | undefined => {
  if (!key) return

  return getStore().getters["getItem"](key)
}

export const getStoreState = (): Vuex.Store<Record<string, any>>["state"] => {
  return getStore().state
}
