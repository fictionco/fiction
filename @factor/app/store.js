import Factor from "@factor/core"
import Vuex from "vuex"
Factor.use(Vuex)
import { applyFilters, addCallback } from "@factor/tools"

addCallback("before-server-plugins", () => createStore())

let __store

export function createStore() {
  const root = {
    // allow direct state changes: https://vuex.vuejs.org/api/#strict
    strict: false,
    state: () => {},
    getters: {
      getItem: state => item => state[item]
    },
    mutations: {
      setItem: (state, { item, value }) => {
        Factor.set(state, item, value)
      }
    },

    modules: applyFilters("stores", {})
  }

  __store = new Vuex.Store(root)

  // Factor helper function for global/flat store pattern
  __store.add = (item, value) => __store.commit("setItem", { item, value })

  __store.val = key => __store.getters["getItem"](key)

  Factor.$store = __store

  // prime the store with server-initialized state.
  // the state is determined during SSR and inlined in the page markup.
  // Make sure this is done after store modules are setup and added
  if (typeof window != "undefined" && window.__INITIAL_STATE__) {
    __store.replaceState(window.__INITIAL_STATE__)
  }

  return __store
}

export function storeItem(key, item) {
  return __store.add(key, item)
}

export function stored(key) {
  return __store.val(key)
}

export function getStoreState() {
  return __store.state
}
