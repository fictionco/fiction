import { importPlugins } from "./util"
import Factor from "@factor/core"
import { applyFilters } from "@factor/tools"
export default (options = {}) =>
  new (class {
    constructor() {}

    async extend() {
      Factor.config.productionTip = false
      Factor.config.devtools = false
      Factor.config.silent = false

      Factor.$globals = Factor.prototype.$globals = Factor.observable({
        routeClass: []
      })

      await importPlugins({
        paths: () => import("@factor/paths"),
        config: () => import("@factor/config"),
        setting: () => import("@factor/settings"),
        __router: () => import("@factor/app/router"),
        __store: () => import("@factor/app/store")
      })

      await Factor.$setting.create()
      Factor.$__router.create()
      Factor.$__store.create()

      await this.initialize(options)
    }

    // After plugins added
    async initialize() {
      const { default: plugins } = await import("~/.factor/loader-app")

      const { plugins: __plugins = {}, settings: __settings } = options

      const optionPlugins = __plugins || {}
      const allPlugins = { ...plugins, ...optionPlugins }

      await importPlugins(allPlugins)

      // Add settings from tests, etc.
      if (__settings) Factor.$setting.add(__settings)

      Factor.$components = {}
      const comps = applyFilters("components", {})
      for (var _ in comps) {
        if (comps[_]) {
          Factor.component(_, comps[_])
          Factor.$components[_] = comps[_]
        }
      }

      if (Factor.FACTOR_SSR == "client") {
        const directives = applyFilters("client-directives", {})

        for (var _ in directives) {
          if (directives[_]) {
            Factor.directive(_, directives[_])
          }
        }
      }

      await Factor.$filters.run("initialize-app")
    }
  })()
