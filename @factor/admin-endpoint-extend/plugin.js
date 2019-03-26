const { resolve } = require("path")

module.exports = (Factor, FACTOR_CONFIG) => {
  return new class {
    constructor() {
      Factor.FACTOR_CONFIG = FACTOR_CONFIG
      Factor.FACTOR_ENV = "endpoint"
      this.setup()
      this.endpointService = Factor.$filters.apply("endpoint-service")
    }

    setup() {
      Factor.config.productionTip = false
      Factor.config.devtools = false
      Factor.config.silent = true

      this.addCoreExtension("filters", require(`@factor/filters`))

      if (typeof FACTOR_CONFIG.setup == "function") {
        FACTOR_CONFIG.setup()
      }

      this.addCoreExtension("paths", require(`@factor/build-paths`))
      this.addCoreExtension("keys", require(`@factor/build-keys`))
      this.addCoreExtension("files", require(`@factor/build-files`))
      this.addCoreExtension("config", require(`@factor/admin-config`))
      this.addCoreExtension("endpoint", require(`@factor/admin-endpoint`))
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

    endpoints() {
      const endpoints = {}

      // Get extensions that are endpoints
      const serverlessExtensions = require(Factor.$paths.get("plugins-loader-serverless"))

      // Endpoint Modules can either expose a 'requestHandler' method
      // Or the endpoint service will wrap the entire module
      Object.keys(serverlessExtensions).forEach(key => {
        const { target, module } = serverlessExtensions[key]
        if (target == "endpoint" || target.includes("endpoint")) {
          const pluginModule = require(module).default(Factor)
          const { requestHandler } = pluginModule

          const handler =
            requestHandler && typeof requestHandler == "function"
              ? requestHandler.call(pluginModule)
              : Factor.$endpoint.requestHandler(pluginModule)

          endpoints[key] = this.endpointService(handler)
        }
      })

      this.initializeBuild()

      return endpoints
    }
  }()
}
