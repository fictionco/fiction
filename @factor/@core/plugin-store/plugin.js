module.exports.default = Factor => {
  const handler = new class {
    constructor() {
      this.storeLibrary = require("vuex")
      Factor.use(this.storeLibrary)
      this.createStore()
    }

    getStore() {
      return this.store || null
    }
    createStore() {
      const root = {
        strict: false,
        plugins: [],
        state: () => {},
        getters: {
          getItem: state => item => {
            return state[item]
          }
        },
        mutations: {
          setItem: (state, { item, value }) => {
            Factor.set(state, item, value)
          }
        },
        actions: {},
        modules: Factor.$filters.get("stores", {})
      }
      for (var mod in root.modules) {
        if (root.modules[mod]) {
          root.modules[mod].namespaced = true
        } else {
          delete root.modules[mod]
        }
      }

      const FactorStore = this.storeLibrary.Store

      this.store = new FactorStore(root)

      this.maybeHydrate()

      return
    }

    // prime the store with server-initialized state.
    // the state is determined during SSR and inlined in the page markup.
    // Make sure this is done after store modules are setup and added
    maybeHydrate() {
      if (typeof window != "undefined" && window.__INITIAL_STATE__) {
        this.store.replaceState(window.__INITIAL_STATE__)
      }
    }
  }()

  return handler.getStore()
}
