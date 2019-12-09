import { applyFilters, runCallbacks } from "@factor/api/hooks"
import Vue from "vue"

Vue.config.productionTip = false
Vue.config.silent = false

let __observables = {}

// Add before plugins import
// Observable values that can change at any time
const setupGlobalObservable = (): void => {
  __observables = Vue.observable(applyFilters("register-global-observables", {}))
}

export const getObservables = (): Record<string, any> => {
  return __observables
}

const addClientDirectives = (): void => {
  if (process.env.FACTOR_SSR == "client") {
    const directives = applyFilters("client-directives", {})

    for (const __ in directives) {
      if (directives[__]) Vue.directive(__, directives[__])
    }
  }
}

export const extendApp = async (options = {}): Promise<void> => {
  await runCallbacks("before-app-plugins", options)

  try {
    // eslint-disable-next-line import/no-unresolved
    require("__CWD__/.factor/loader-app")
  } catch (error) {
    if (error.code !== "MODULE_NOT_FOUND") throw new Error(error)
  }

  setupGlobalObservable()

  addClientDirectives()

  await runCallbacks("initialize-app", options)
}
