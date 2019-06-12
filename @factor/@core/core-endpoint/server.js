const cors = require("cors")({ origin: true })
const parse = require("qs").parse
var bodyParser = require("body-parser")

module.exports.default = Factor => {
  return new (class {
    constructor() {
      this.endpointBase = "/endpoints"
      Factor.$filters.callback("initialize-server", () => {
        const endpoints = Factor.$filters.apply("endpoints", [])

        this.addEndpointMiddleware(endpoints)
      })
    }

    addEndpointMiddleware(endpoints) {
      const middlewares = []
      endpoints.forEach(({ id, handler }) => {
        middlewares.push({
          path: `${this.endpointBase}/${id}`,
          callback: this.requestMiddleware({ handler, id })
        })
      })

      Factor.$filters.add("middleware", _ => {
        return _.concat(middlewares)
      })
    }

    requestMiddleware({ handler, id }) {
      return (request, response, next) => {
        return cors(request, response, async () => {
          return await this.onRequest({ id, handler, request, response })
        })
      }
    }

    async onRequest({ id, handler, request, response }) {
      const { query, body } = request

      const GET = parse(query)

      const POST = this._isJson(body) ? JSON.parse(body) : body

      const { method, params } = { ...POST, ...GET }
      const auth = await this.authenticatedRequest(request)

      const json = await this.runMethod({ id, handler, params, auth, method })

      response
        .status(200)
        .jsonp(json)
        .end()

      return
    }

    async runMethod({ id, handler, params, auth, method }) {
      // const { method = "", uid = "", report = "", endpoint = "", auth = false, ...args } = ENDPOINT_ARGS

      let out = {}

      try {
        if (!method) {
          throw new Error(`Server: No endpoint method provided for ${id} request`)
        }

        Factor.$headers = { auth }

        if (handler[method] && typeof handler[method] == "function") {
          out = await handler[method](params)
        } else {
          throw new Error(`Server: Method named:${method} does not exist.`)
        }
      } catch (error) {
        const { message, stack } = error
        out = {
          error: { message, stack }
        }
      }
      return out
    }

    // Parse "Authorization: Bearer [token]"
    // https://security.stackexchange.com/questions/108662/why-is-bearer-required-before-the-token-in-authorization-header-in-a-http-re
    async authenticatedRequest(request) {
      let auth = false
      const {
        headers: { authorization }
      } = request

      if (authorization && authorization.startsWith("Bearer ")) {
        const bearerToken = authorization.split("Bearer ")[1]

        auth = await Factor.$stack.service("auth-token-service", bearerToken)
      }

      return auth
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
