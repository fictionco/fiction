import { applyFilters, runCallbacks } from "@factor/tools"
import Factor from "@factor/core"
// eslint-disable-next-line import/no-unresolved
import "~/.factor/loader-app"

//import { importPlugins } from "./util"

Factor.config.productionTip = false
Factor.config.devtools = false
Factor.config.silent = false

export async function extendApp(options = {}) {
  setupGlobalObservable()

  await runCallbacks("before-app-plugins", options)

  addGlobalComponents()
  addClientDirectives()

  await runCallbacks("initialize-app", options)
}

// Add before plugins import
// Observable values that can change at any time
function setupGlobalObservable() {
  Factor.$globals = Factor.prototype.$globals = Factor.observable(
    applyFilters("register-global-observables", {})
  )
}

function addGlobalComponents() {
  Factor.$components = {}
  const comps = applyFilters("components", {})
  for (var _ in comps) {
    if (comps[_]) {
      Factor.component(_, comps[_])
      Factor.$components[_] = comps[_]
    }
  }
}

function addClientDirectives() {
  if (process.env.FACTOR_SSR == "client") {
    const directives = applyFilters("client-directives", {})

    for (var _ in directives) {
      if (directives[_]) Factor.directive(_, directives[_])
    }
  }
}
