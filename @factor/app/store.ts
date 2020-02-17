import Vuex from "vuex"
import Vue from "vue"
import { Store } from "vuex/types"
import { ObjectId } from "@factor/post/types"
Vue.use(Vuex)

let __store: Store<object> | undefined

export const getStore = (): Store<object> => {
  __store = new Vuex.Store({
    strict: false,
    state: (): Record<string, any> => {
      return {}
    },
    getters: {
      getItem: (state: Record<string, any>) => (item: string): any => state[item]
    },
    mutations: {
      setItem: (state, { item, value }): void => {
        Vue.set(state, item, value)
      }
    }
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

export const storeItem = (item: string, value: any): void => {
  if (!__store) {
    throw new Error(`Store not available for ${item}:${value}`)
  }
  return __store.commit("setItem", { item, value })
}

export const stored = (key?: string | ObjectId): any => {
  return __store && key ? __store.getters["getItem"](key) : undefined
}

export const getStoreState = (): Store<object>["state"] => {
  if (!__store) {
    throw new Error("Store not available for state.")
  }
  return __store.state
}
