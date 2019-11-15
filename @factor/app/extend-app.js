import { applyFilters, runCallbacks } from "@factor/tools/filters"
import Vue from "vue"

Vue.config.productionTip = false
Vue.config.silent = false

let __observables = {}

export async function extendApp(options = {}) {
  await runCallbacks("before-app-plugins", options)

  // eslint-disable-next-line import/no-unresolved
  require("~/.factor/loader-app")

  setupGlobalObservable()

  addClientDirectives()

  await runCallbacks("initialize-app", options)
}

// Add before plugins import
// Observable values that can change at any time
function setupGlobalObservable() {
  // @ts-ignore
  __observables = Vue.observable(applyFilters("register-global-observables", {}))
}

export function getObservables() {
  return __observables
}

function addClientDirectives() {
  if (process.env.FACTOR_SSR == "client") {
    const directives = applyFilters("client-directives", {})

    for (var __ in directives) {
      // @ts-ignore
      if (directives[__]) Vue.directive(__, directives[__])
    }
  }
}
