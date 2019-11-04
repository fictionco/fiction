import { applyFilters, runCallbacks } from "@factor/tools"
import Factor from "@factor/core"
import "@factor/app"

Factor.config.productionTip = false
Factor.config.devtools = false
Factor.config.silent = false

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

  const globalComponents = applyFilters("global-components", [])

  globalComponents.forEach(({ component, name }) => {
    Factor.component(name, component)
    Factor.$components[name] = component
  })
}

function addClientDirectives() {
  console.log("process.env.FACTOR_SSR", process.env.FACTOR_SSR, process.env.FACTOR_TARGET)
  if (process.env.FACTOR_SSR == "client") {
    const directives = applyFilters("client-directives", {})

    for (var __ in directives) {
      if (directives[__]) Factor.directive(__, directives[__])
    }
  }
}
