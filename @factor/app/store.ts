import Vuex from "vuex"
import Vue from "vue"
import { Store } from "vuex/types"
import { ObjectId } from "@factor/post/types"

let __store: Store<Record<string, any>> | undefined

declare global {
  interface Window {
    __INITIAL_STATE__: any
  }
}

export const createFactorStore = (): Store<Record<string, any>> => {
  __store = new Vuex.Store({
    strict: false,
    state: (): Record<string, any> => {
      return {}
    },
    getters: {
      getItem: (state: Record<string, any>) => (item: string): any => state[item],
    },
    mutations: {
      setItem: (state, { item, value }): void => {
        Vue.set(state, item, value)
      },
    },
  })

  /**
   * prime the store with server-initialized state.
   * the state is determined during SSR and inlined in the page markup.
   */
  if (typeof window != "undefined" && window.__INITIAL_STATE__) {
    __store.replaceState(window.__INITIAL_STATE__)
  }

  return __store
}

export const getStore = (): Store<Record<string, any>> | undefined => {
  return __store
}

/**
 * Store an item in application store/cache
 *
 * If a typical app function is used in an endpoint, then there will be no store
 * However we don't want to break code that would otherwise work
 */
export const storeItem = (item: string, value: any): void => {
  if (!__store) return

  return __store.commit("setItem", { item, value })
}

/**
 * Get a reactive value from the application store
 * @param key - ID in the flat store
 */
export const stored = (key?: string | ObjectId | number): any => {
  if (!__store || !key) return

  return __store.getters["getItem"](key)
}

export const getStoreState = (): Store<Record<string, any>>["state"] => {
  if (!__store) return {}
  return __store.state
}
