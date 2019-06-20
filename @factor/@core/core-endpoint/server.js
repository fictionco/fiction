const cors = require("cors")({ origin: true })
const parse = require("qs").parse

module.exports.default = Factor => {
  const util = require(".").default(Factor)
  const server = new (class {
    constructor() {
      this.endpointBase = "/endpoints"
      Factor.$filters.callback("initialize-server", () => {
        this.addEndpointMiddleware()
      })
    }

    addEndpointMiddleware() {
      const endpoints = Factor.$filters.apply("endpoints", [])

      Factor.$filters.add("middleware", _ => {
        endpoints.forEach(({ id, handler }) => {
          _.push({
            path: `${this.endpointBase}/${id}`,
            callback: () => this.requestMiddleware({ handler, id }),
            id
          })
        })
        return _
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

  return Factor.$lodash.merge(util, server)
}
