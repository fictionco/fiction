import Factor from "vue"
import extendApp from "@factor/app-extend"
import { createStore } from "@factor/app-store"
import FactorRouter from "@factor/app-router"

export default () => {
  // Extend with plugins, happens before router and store so we can add hooks for them
  extendApp(Factor)

  const store = createStore()
  const router = FactorRouter(Factor).create()

  // Extend with mixins, etc... happens after router and store
  Factor.$filters.run("before-app")

  return { router, store }
}
