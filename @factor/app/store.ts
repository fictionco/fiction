import Vuex from "vuex"
import Vue from "vue"
import { Store } from "vuex/types"

Vue.use(Vuex)

import { addCallback } from "@factor/tools/filters"

const __store = new Vuex.Store({
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

export const getStore = (): Store<object> => {
  return __store
}

addCallback("before-server-plugins", () => getStore())

// prime the store with server-initialized state.
// the state is determined during SSR and inlined in the page markup.
// Make sure this is done after store modules are setup and added
if (typeof window != "undefined" && window.__INITIAL_STATE__) {
  __store.replaceState(window.__INITIAL_STATE__)
}

export const storeItem = (item: string, value: any): void => {
  return __store.commit("setItem", { item, value })
}

export const stored = (key: string): any => {
  return __store.getters["getItem"](key)
}

export const getStoreState = (): Store<object>["state"] => {
  return __store.state
}
