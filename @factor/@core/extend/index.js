export default (Factor, options = {}) => {
  return new (class {
    constructor() {
      this.setup()
      this.initialize()
    }

    async setup() {
      Factor.config.productionTip = false
      Factor.config.devtools = false
      Factor.config.silent = false

      Factor.$globals = Factor.prototype.$globals = Factor.observable({
        routeClass: []
      })

      this._install("tools", require("@factor/tools").default)
      this._install("log", require("@factor/core-log").default)

      this._install("filters", require("@factor/filters").default)
      this._install("config", require("@factor/config").default)

      this._install("paths", require("@factor/paths").default) // Filler

      this._install("setting", require("@factor/settings").default)
    }

    _install(id, plugin) {
      Factor.use({
        install(Factor) {
          Factor[`$${id}`] = Factor.prototype[`$${id}`] = plugin(Factor)
        }
      })
    }

    loadPlugins() {
      const loaderPlugins = require("~/.factor/loader-app")
      const optionPlugins = options.plugins || {}
      const plugins = { ...loaderPlugins, ...optionPlugins }
      for (var _p in plugins) {
        if (plugins[_p]) {
          const plugin = plugins[_p]

          if (typeof plugin == "function") {
            this._install(_p, plugin)
          }
        }
      }
    }

    // After plugins added
    async initialize() {
      if (options.settings) {
        Factor.$setting.add(options.settings)
      }

      this.loadPlugins()

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
