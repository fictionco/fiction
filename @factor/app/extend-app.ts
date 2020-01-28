import { applyFilters, runCallbacks } from "@factor/api/hooks"
import Vue, { DirectiveFunction } from "vue"

Vue.config.productionTip = false
Vue.config.silent = false

let __observables = {}

/**
 * Add a utility for observable values that can change at any time
 * Load before plugins as they will hook into these and watch them
 */
const setupGlobalObservable = (): void => {
  __observables = Vue.observable(applyFilters("register-global-observables", {}))
}

/**
 * Gets the observables object
 */
export const getObservables = (): Record<string, any> => {
  return __observables
}

/**
 * Add Vue directives
 */
const addClientDirectives = (): void => {
  if (process.env.FACTOR_BUILD_ENV == "client") {
    const directives: { [key: string]: DirectiveFunction } = applyFilters(
      "client-directives",
      {}
    )

    for (const __ in directives) {
      if (directives[__]) Vue.directive(__, directives[__])
    }
  }
}

/**
 * Load into application targeted extensions
 * @param options - application extension options
 */
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
