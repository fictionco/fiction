import { applyFilters, runCallbacks } from "@factor/tools/filters"
import Vue from "vue"

Vue.config.productionTip = false
Vue.config.silent = false

let __observables = {}

export async function extendApp(options = {}) {
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

// Add before plugins import
// Observable values that can change at any time
function setupGlobalObservable() {
  __observables = Vue.observable(applyFilters("register-global-observables", {}))
}

export function getObservables(): any {
  return __observables
}

function addClientDirectives() {
  if (process.env.FACTOR_SSR == "client") {
    const directives = applyFilters("client-directives", {})

    for (const __ in directives) {
      if (directives[__]) Vue.directive(__, directives[__])
    }
  }
}
