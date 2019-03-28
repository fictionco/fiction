const { resolve } = require("path")
const parse = require("qs").parse

const cors = require("cors")({ origin: true })
module.exports = (Factor, FACTOR_CONFIG) => {
  return new class {
    constructor() {
      Factor.FACTOR_CONFIG = FACTOR_CONFIG
      Factor.FACTOR_ENV = "endpoint"
      this.setup()
      this.endpointService = Factor.$filters.apply("endpoint-service")
      this.bearerTokenService = Factor.$filters.apply("auth-token-service")
      console.log("this.bearerTokenService", this.endpointService, typeof this.bearerTokenService)
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
          const pluginModule = require(module).default
          const { requestHandler } = pluginModule

          let handler =
            requestHandler && typeof requestHandler == "function"
              ? requestHandler.call(pluginModule(Factor))
              : this.requestHandler(pluginModule)

          endpoints[key] = this.endpointService(handler)
        }
      })

      this.initializeBuild()

      return endpoints
    }

    async handler(plugin, ENDPOINT_ARGS) {
      const {
        action = "",
        uid = "",
        report = "",
        endpoint = "",
        auth = false,
        ...args
      } = ENDPOINT_ARGS

      let out = {}
      let user
      let ep
      try {
        if (!action) {
          throw new Error("[API] No Action Provided")
        }

        Factor.$headers = { auth }

        ep = plugin(Factor)

        if (ep[action] && typeof ep[action] == "function") {
          out = await ep[action](args)
        } else {
          throw new Error(`[API] Method for "${action}" does not exist.`)
        }
      } catch (error) {
        const { message, stack } = error
        out = {
          error: { message, stack }
        }
      }
      return out
    }

    requestHandler(plugin) {
      return (req, res) => {
        return cors(req, res, async () => {
          return await this.onRequest(plugin, req, res)
        })
      }
    }

    // Parse "Authorization: Bearer [token]"
    // https://security.stackexchange.com/questions/108662/why-is-bearer-required-before-the-token-in-authorization-header-in-a-http-re
    async authenticatedRequest(req) {
      let auth = false
      const {
        headers: { authorization }
      } = req

      if (authorization && authorization.startsWith("Bearer ")) {
        const bearerToken = authorization.split("Bearer ")[1]

        auth = await this.bearerTokenService(bearerToken)
      }

      return auth
    }

    async onRequest(plugin, req, res) {
      const { query, body } = req

      const GET = parse(query)

      const POST = this._isJson(body) ? JSON.parse(body) : body

      const auth = await this.authenticatedRequest(req)

      const ENDPOINT_ARGS = { ...POST, ...GET, auth }

      const out = await this.handler(plugin, ENDPOINT_ARGS)

      res
        .status(200)
        .jsonp(out)
        .end()

      return
    }

    _isJson(str) {
      try {
        JSON.parse(str)
      } catch (error) {
        return false
      }
      return true
    }
  }()
}
