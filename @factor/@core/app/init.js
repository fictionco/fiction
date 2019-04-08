import Factor from "vue"

// // Config
import extendApp from "@factor/app-extend"
import { createStore } from "@factor/app-store"
import { createRouter } from "@factor/app-router"

export default ({ target }) => {
  // Extend with plugins, happens before router and store so we can add hooks for them
  const loader = extendApp(Factor, process.env.FACTOR_CONFIG, target)

  loader.initializeApp()

  const store = createStore({ target })
  const router = createRouter({ target })

  // Extend with mixins, etc... happens after router and store
  loader.mixinApp()

  return { router, store }
}
