const { resolve } = require("path")
const parse = require("qs").parse
const merge = require("deepmerge")

const cors = require("cors")({ origin: true })
module.exports = (Factor, { baseDir, env, setup }) => {
  return new (class {
    constructor() {
      Factor.FACTOR_ENV = "cloud"
      this.setup()
      this.endpointService = Factor.$filters.apply("endpoint-service")
      this.bearerTokenService = Factor.$filters.apply("auth-token-service")
    }

    setup() {
      Factor.config.productionTip = false
      Factor.config.devtools = false
      Factor.config.silent = true

      this.addCoreExtension("filters", require("@factor/filters"))

      Factor.FACTOR_CONFIG = this.config()

      this.addCoreExtension("paths", require("@factor/build-paths"))
      this.addCoreExtension("theme", require("@factor/core-theme/build"))
      this.addCoreExtension("stack", require("@factor/core-stack/build"))
      this.addCoreExtension("keys", require("@factor/build-keys"))
      this.addCoreExtension("files", require("@factor/build-files"))
      this.addCoreExtension("config", require("@factor/cloud-config"))
      this.insertLoadedExtensions()
    }

    insertLoadedExtensions() {
      const cloudExtensions = require(Factor.$paths.get("plugins-loader-cloud"))
      Object.keys(cloudExtensions).forEach(key => {
        const { id, target, module, mainFile } = cloudExtensions[key]
        if (target && (target == "cloud" || target.includes("cloud"))) {
          const moduleName = mainFile ? mainFile : module
          this.addCoreExtension(id, require(moduleName).default)
        }
      })
    }

    addCoreExtension(id, extension) {
      Factor.use({
        install(Factor) {
          Factor[`$${id}`] = Factor.prototype[`$${id}`] = extension(Factor)
        }
      })
    }

    config() {
      if (typeof setup == "function") {
        setup()
      }

      let { factor: USER_CONFIG = {} } = require(resolve(baseDir, "package"))

      let configFile = require(resolve(baseDir, "factor-config"))

      const configObjects = [configFile[env], configFile.config].filter(_ => typeof _ != "undefined")
      USER_CONFIG = { ...USER_CONFIG, ...merge.all(configObjects) }

      return {
        baseDir,
        env,
        ...USER_CONFIG
      }
    }

    endpoints() {
      const endpoints = {}

      // Get extensions that are endpoints
      const cloudExtensions = require(Factor.$paths.get("plugins-loader-cloud"))

      // Endpoint Modules can either expose a 'requestHandler' method
      // Or the endpoint service will wrap the entire module
      Object.keys(cloudExtensions).forEach(key => {
        const { target, module } = cloudExtensions[key]
        if (target && (target == "endpoint" || target.includes("endpoint"))) {
          const pluginModule = require(module).default
          const pluginClass = pluginModule(Factor)
          const { requestHandler } = pluginClass

          let handler =
            requestHandler && typeof requestHandler == "function"
              ? requestHandler.call(pluginClass) // Need to pass pluginClass as "this" is there a better way?
              : this.requestHandler(pluginModule)

          endpoints[key] = this.endpointService(handler)
        }
      })

      //this._runCallbacks(Factor.$filters.apply(Factor.FACTOR_TARGET, {}))

      return endpoints
    }

    async handler(plugin, ENDPOINT_ARGS) {
      const { action = "", uid = "", report = "", endpoint = "", auth = false, ...args } = ENDPOINT_ARGS

      let out = {}
      let user
      let ep
      try {
        if (!action) {
          throw new Error("[API] No Endpoint Action Provided", plugin)
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
  })()
}
