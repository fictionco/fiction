export default Factor => {
  return new (class {
    constructor() {}

    reload() {
      this.loadCore()
      this.loadPlugins()
    }

    async extend(_arguments) {
      const { loadPlugins = true, restart = false } = _arguments || {}
      process.env.FACTOR_TARGET = "server"

      this.loadCore()

      // Loading plugins is sometimes not desireable e.g. when creating loaders
      if (loadPlugins !== false) {
        this.loadPlugins()

        await Factor.$filters.run("initialize-server")

        if (!restart) Factor.$filters.run("after-first-server-extend")
      }
    }

    loadCore() {
      this._install("log", require("@factor/core-log/server").default)
      this._install("tools", require("@factor/tools").default)
      this._install("filters", require("@factor/filters").default)
      this._install("paths", require("@factor/paths/server").default)
      this._install("loaders", require("@factor/build/loaders").default)
      this._install("theme", require("@factor/core-override").default)
      this._install("configServer", require("@factor/config/server").default)
      this._install("setting", require("@factor/settings").default)

      // Add router and store to node, for utilities that need them
      // For example: sitemaps need information from router.
      require("@factor/app/store")
        .default(Factor)
        .create()
      require("@factor/app/router")
        .default(Factor)
        .create()
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

    loadPlugins() {
      const { pathExistsSync } = require("fs-extra")

      if (!pathExistsSync(Factor.$paths.get("loader-server"))) {
        if (process.env.FACTOR_ENV == "test") return

        console.warn(
          "Factor loaders are missing. Did you forget to run 'yarn factor build' before serving your app?"
        )
      }

      const plugins = require(Factor.$paths.get("loader-server"))

      this.injectPlugins(plugins)

      return
    }

    injectPlugins(plugins) {
      for (var _p in plugins) {
        if (plugins[_p] && typeof plugins[_p] == "function") {
          this._install(_p, plugins[_p])
        }
      }
    }
  })()
}
