import plugins from "~/.factor/loader-app"
import { importPlugins } from "./util"
import Factor from "@factor/core"
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

      const core = {
        log: () => import("@factor/core-log"),
        tools: () => import("@factor/tools"),
        filters: () => import("@factor/filters"),
        paths: () => import("@factor/paths"),
        config: () => import("@factor/config"),
        setting: () => import("@factor/settings")
      }

      await importPlugins(core)

      await this.initialize(options)
    }

    // After plugins added
    async initialize() {
      const { plugins: __plugins = {}, settings: __settings } = options
      if (__settings) Factor.$setting.add(__settings)

      const optionPlugins = __plugins || {}
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
