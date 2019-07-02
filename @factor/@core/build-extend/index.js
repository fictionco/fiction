module.exports.default = Factor => {
  return new (class {
    constructor() {}

    reload() {
      this.loadCore()
      this.loadPlugins()
    }

    run() {
      Factor.FACTOR_CONFIG = require("@factor/build-config").default(Factor)
      Factor.FACTOR_TARGET = "server"

      this.loadCore()

      // Loading plugins is sometimes not desireable e.g. when creating loaders
      if (Factor.FACTOR_CONFIG.loadPlugins !== false) {
        this.loadPlugins()
        this.initialize()
      }
    }

    loadCore() {
      this._install("log", require("@factor/core-log/server").default)
      this._install("tools", require("@factor/tools").default)

      this._install("filters", require("@factor/filters").default)
      this._install("paths", require("@factor/build-paths").default)

      this._install("files", require("@factor/build-files").default)
      this._install("theme", require("@factor/core-theme").default)
      this._install("stack", require("@factor/core-stack").default)

      this._install("config", require("@factor/server-config").default)

      require("@factor/build-transpiler").default(Factor)

      // This just adds the dirname to config and other paths
      require("@factor/app/build").default(Factor)
    }

    _install(id, plugin) {
      Factor.use({
        install(Factor) {
          try {
            Factor[`$${id}`] = Factor.prototype[`$${id}`] = plugin(Factor)
          } catch (error) {
            Factor.$log.error(error)
          }
        }
      })
    }

    initialize() {
      const { setup } = Factor.FACTOR_CONFIG

      // config defined setup hook/callback
      // Useful for overriding and programmatic config
      if (typeof setup == "function") {
        setup(Factor)
      }

      Factor.$filters.run("initialize-server")
    }

    loadPlugins() {
      const plugins = require(Factor.$paths.get("loader-server"))

      this.injectPlugins(plugins)

      return
    }

    injectPlugins(plugins) {
      for (var _p in plugins) {
        if (plugins[_p]) {
          if (typeof plugins[_p] == "function") {
            this._install(_p, plugins[_p])
          }
        }
      }
    }
  })()
}
