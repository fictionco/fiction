module.exports = Factor => {
  return new (class {
    constructor() {
      this.setup()
    }

    async setup() {
      Factor.FACTOR_CONFIG = require("@factor/build-config").default(Factor)
      Factor.FACTOR_ENV = "server"

      this.addCoreExtension("log", require("@factor/core-log/build").default)
      this.addCoreExtension("tools", require("@factor/tools").default)
      this.addCoreExtension("filters", require("@factor/filters").default)
      this.addCoreExtension("paths", require("@factor/build-paths").default)

      this.addCoreExtension("files", require("@factor/build-files").default)
      this.addCoreExtension("theme", require("@factor/core-theme").default)
      this.addCoreExtension("stack", require("@factor/core-stack").default)

      this.addCoreExtension("config", require("@factor/server-config").default)

      require("@factor/build-transpiler").default(Factor)

      // This just adds the dirname to config and other paths
      require("@factor/app/build").default(Factor)

      this.loadPlugins()
    }

    loadPlugins() {
      const plugins = require(Factor.$paths.get("loader-server"))

      this.injectPlugins(plugins)

      const { setup } = Factor.FACTOR_CONFIG

      // config defined setup hook/callback
      // Useful for overriding and programmatic config
      if (typeof setup == "function") {
        setup(Factor)
      }

      Factor.$filters.run("initialize-build")

      return `Loaded ${Object.keys(plugins).length} build modules`
    }

    addCoreExtension(id, extension) {
      Factor.use({
        install(Factor) {
          Factor[`$${id}`] = Factor.prototype[`$${id}`] = extension(Factor)
        }
      })
    }

    injectPlugins(plugins) {
      for (var _p in plugins) {
        if (plugins[_p]) {
          if (typeof plugins[_p] == "function") {
            Factor.use({
              install(Factor) {
                const h = `$${_p}`
                try {
                  const init = plugins[_p](Factor)
                  Factor[h] = Factor.prototype[h] = init
                } catch (error) {
                  Factor.$log.error(error)
                }
              }
            })
          }
        }
      }
    }
  })()
}
