export default Factor => {
  return new (class {
    constructor() {
      this.setup()
    }

    setup() {
      Factor.config.productionTip = false
      Factor.config.devtools = true
      Factor.config.silent = false

      Factor.$globals = Factor.prototype.$globals = Factor.observable({
        routeClass: []
      })

      this._install("tools", require("@factor/tools").default)
      this._install("log", require("@factor/core-log").default)

      this._install("filters", require("@factor/filters").default)
      this._install("config", require("@factor/config").default)

      this._install("paths", require("@factor/paths").default) // Filler

      this.loadPlugins()

      this.initializeApp()
    }

    _install(id, plugin) {
      Factor.use({
        install(Factor) {
          Factor[`$${id}`] = Factor.prototype[`$${id}`] = plugin(Factor)
        }
      })
    }

    loadPlugins() {
      const plugins = require("~/.factor/loader-app")
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
    initializeApp() {
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

      Factor.$filters.run("initialize-app")
    }
  })()
}
