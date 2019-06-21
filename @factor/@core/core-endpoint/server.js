const cors = require("cors")({ origin: true })
const parse = require("qs").parse

module.exports.default = Factor => {
  const util = require(".").default(Factor)
  const server = new (class {
    constructor() {
      this.endpointBase = "/_api"
      Factor.$filters.add("initialize-server", () => {
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
          return await this.parseRequest({ id, handler, request, response })
        })
      }
    }

    // Parse "Authorization: Bearer [token]"
    // https://security.stackexchange.com/questions/108662/why-is-bearer-required-before-the-token-in-authorization-header-in-a-http-re
    async authenticatedRequest(authorization) {
      if (authorization && authorization.startsWith("Bearer ")) {
        const token = authorization.split("Bearer ")[1]

        return await Factor.$user.retrieveUser({ token })
      }
    }

    async parseRequest({ id, handler, request, response }) {
      const {
        query,
        body,
        headers: { authorization }
      } = request

      const { method, params = {} } = { ...body, ...parse(query) }

      params.user = await this.authenticatedRequest(authorization)

      const data = await this.runMethod({ id, handler, params, method })

      response
        .status(200)
        .jsonp(data)
        .end()
    }

    async runMethod({ id, handler, params, method }) {
      let result = ""
      let error = ""
      try {
        if (!method) {
          Factor.$error.throw(500, `No endpoint method provided for ${id} request`)
        }

        const _ep = typeof handler == "function" ? handler(Factor) : handler

        if (!_ep[method] || typeof _ep[method] !== "function") {
          Factor.$error.throw(500, `Endpoint method ${method} is missing.`)
        }

        result = await _ep[method](params)
      } catch (error2) {
        error2 = Factor.$error.create(error2)
        Factor.$log.error(err)
      }

      return { result, error }
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
