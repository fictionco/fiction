module.exports = Factor => {
  return new (class {
    constructor() {
      this.setup()
    }

    async setup() {
      Factor.FACTOR_CONFIG = require("@factor/build-config")()
      Factor.FACTOR_ENV = "build"
      Factor.config.productionTip = false
      Factor.config.devtools = true
      Factor.config.silent = false
      this.addCoreExtension("log", require("@factor/core-log/build"))
      this.addCoreExtension("filters", require("@factor/filters"))
      this.addCoreExtension("paths", require("@factor/build-paths"))

      this.addCoreExtension("keys", require("@factor/build-keys"))
      this.addCoreExtension("files", require("@factor/build-files"))
      this.addCoreExtension("theme", require("@factor/core-theme/build"))
      this.addCoreExtension("stack", require("@factor/core-stack"))

      // This loads in different files based on name inside stack folders, needs to be refactored out/changed
      // (The reason it is needed is that different stack environments need different code)
      this.addCoreExtension("stackBuild", require("@factor/core-stack/build"))
      this.addCoreExtension("config", require("@factor/cloud-config"))

      const transpiler = require("@factor/build-transpiler")(Factor)

      transpiler.register({ target: "build" })

      Factor.$filters.apply("after-build-config")

      // This just adds the dirname to config and other paths
      require("@factor/app/build")(Factor)

      this.loadPlugins()
    }

    loadPlugins() {
      const plugins = require(Factor.$paths.get("plugins-loader-build"))

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
