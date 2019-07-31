const cors = require("cors")
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
            middleware: [
              cors(),
              async (request, response, next) => {
                return await Factor.$http.process({
                  request,
                  response,
                  handler: _ => this.runMethod({ ..._, id, handler })
                })
              }
            ],
            id
          })
        })
        return _
      })
    }

    async runMethod({ id, handler, data, meta }) {
      const { method, params = {} } = data

      if (!method) {
        throw new Error(`No method provided for "${id}" request`)
      }

      const _ep = typeof handler == "function" ? handler(Factor, meta) : handler

      if (!_ep[method] || typeof _ep[method] !== "function") {
        throw new Error(`Endpoint method ${id}:${method} is missing.`)
      }

      try {
        return await _ep[method](params, meta)
      } catch (error) {
        throw new Error(error)
      }
    }
  })()

  return Factor.$lodash.merge(util, server)
}
