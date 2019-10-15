import plugins from "~/.factor/loader-app"
import { importPlugins } from "./util"

export default (Factor, options = {}) => {
  return new (class {
    constructor() {}

    async extend() {
      Factor.config.productionTip = false
      Factor.config.devtools = false
      Factor.config.silent = false

      Factor.$globals = Factor.prototype.$globals = Factor.observable({
        routeClass: []
      })

      const core = {
        log: () => import("@factor/core-log"),
        tools: () => import("@factor/tools"),
        filters: () => import("@factor/filters"),
        paths: () => import("@factor/paths"),
        config: () => import("@factor/config"),
        setting: () => import("@factor/settings")
      }

      await importPlugins(core)

      await this.initialize()
    }

    // After plugins added
    async initialize() {
      if (options.settings) Factor.$setting.add(options.settings)

      const optionPlugins = options.plugins || {}
      const allPlugins = { ...plugins, ...optionPlugins }

      await importPlugins(allPlugins)

      Factor.$components = {}
      const comps = Factor.$filters.apply("components", {})
      for (var _ in comps) {
        if (comps[_]) {
          Factor.component(_, comps[_])
          Factor.$components[_] = comps[_]
        }
      }

      if (Factor.FACTOR_SSR == "client") {
        const directives = Factor.$filters.apply("client-directives", {})

        for (var _ in directives) {
          if (directives[_]) {
            Factor.directive(_, directives[_])
          }
        }
      }

      await Factor.$filters.run("initialize-app")
    }
  })()
}
