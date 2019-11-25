import Vuex, { Store } from "vuex"
import Vue from "vue"

Vue.use(Vuex)

import { addCallback } from "@factor/tools/filters"

addCallback("before-server-plugins", () => getStore())

const __store = new Vuex.Store({
  strict: false,
  state: () => {
    return {}
  },
  getters: {
    getItem: state => item => state[item]
  },
  mutations: {
    setItem: (state, { item, value }) => {
      Vue.set(state, item, value)
    }
  }
})

// prime the store with server-initialized state.
// the state is determined during SSR and inlined in the page markup.
// Make sure this is done after store modules are setup and added
if (typeof window != "undefined" && window.__INITIAL_STATE__) {
  __store.replaceState(window.__INITIAL_STATE__)
}

export function getStore() {
  return __store
}

export function storeItem(item, value) {
  return __store.commit("setItem", { item, value })
}

export function stored(key: string) {
  return __store.getters["getItem"](key)
}

export function getStoreState() {
  return __store.state
}

// // Factor helper function for global/flat store pattern
// __store.add = (item, value) => __store.commit("setItem", { item, value })

// __store.val = key => __store.getters["getItem"](key)

//Vue.$store = __store
