module.exports = (Factor, FACTOR_CONFIG) => {
  return new class {
    constructor() {
      Factor.FACTOR_CONFIG = FACTOR_CONFIG

      Factor.FACTOR_ENV = "build"
      this.setup()
    }

    setup() {
      Factor.config.productionTip = false
      Factor.config.devtools = true
      Factor.config.silent = false

      this.addCoreExtension("filters", require(`@factor/filters`))
      this.addCoreExtension("paths", require(`@factor/build-paths`))

      const aliases = Factor.$paths.getAliases()

      this.addCoreExtension("keys", require(`@factor/build-keys`))
      this.addCoreExtension("files", require(`@factor/build-files`))
      this.addCoreExtension("config", require(`@factor/admin-config`))

      const transpiler = require("@factor/build-transpiler")(Factor)

      transpiler.register({ target: "build" })

      require(`@factor/app`)(Factor, { target: "build" })

      const plugins = require(Factor.$paths.get("plugins-loader-build"))
      this.injectPlugins(plugins)
      this.initializeBuild()
      transpiler.copyTranspilerConfig()
    }

    addCoreExtension(id, extension) {
      Factor.use({
        install(Factor) {
          Factor[`$${id}`] = Factor.prototype[`$${id}`] = extension(Factor)
        }
      })
    }

    initializeBuild() {
      this._runCallbacks(Factor.$filters.apply("initialize-build", {}))
    }

    _runCallbacks(callbacks) {
      for (var key in callbacks) {
        const cb = callbacks[key]
        if (cb && typeof cb == "function") {
          cb()
        }
      }
    }

    injectPlugins(plugins) {
      for (var _p in plugins) {
        if (plugins[_p]) {
          if (typeof plugins[_p] == "function") {
            Factor.use({
              install(Factor) {
                const h = `$${_p}`
                Factor[h] = Factor.prototype[h] = plugins[_p](Factor)
              }
            })
          }
        }
      }
    }
  }()
}
