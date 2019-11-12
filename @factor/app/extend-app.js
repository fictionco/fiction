import { applyFilters, runCallbacks } from "@factor/tools/filters"
import Vue from "vue"

Vue.config.productionTip = false
Vue.config.silent = false

let __observables = {}
let __components = {}

export async function extendApp(options = {}) {
  await runCallbacks("before-app-plugins", options)

  // eslint-disable-next-line import/no-unresolved
  require("~/.factor/loader-app")

  setupGlobalObservable()
  addGlobalComponents()
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

export function getComponents() {
  return __components
}

function addGlobalComponents() {
  __components = {}
  const comps = applyFilters("components", {})

  for (var _ in comps) {
    if (comps[_]) {
      // @ts-ignore
      Vue.component(_, comps[_])
      __components[_] = comps[_]
    }
  }

  const globalComponents = applyFilters("global-components", [])

  globalComponents.forEach(({ component, name }) => {
    // @ts-ignore
    Vue.component(name, component)
    __components[name] = component
  })
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
