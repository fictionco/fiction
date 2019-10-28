const cors = require("cors")
import Factor from "@factor/core"
import { parse } from "qs"
import { getSinglePost } from "@factor/post/server"
import { addFilter, applyFilters } from "@factor/filters/util"
import log from "@factor/logger"
export default () => {
  const util = require(".").default(Factor)
  const server = new (class {
    constructor() {
      this.endpointBase = "/_api"
      addFilter("initialize-server", () => {
        this.addEndpointMiddleware()
      })
    }

    addEndpointMiddleware() {
      const endpoints = applyFilters("endpoints", [])

      addFilter("middleware", _ => {
        endpoints.forEach(({ id, handler }) => {
          _.push({
            path: `${this.endpointBase}/${id}`,
            middleware: [
              //cors(),
              async (request, response, next) => {
                return await this.process({
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
        if (typeof handler.permissions == "function") {
          await _ep.permissions({ method, meta, params })
        }
        return await _ep[method](params, meta)
      } catch (error) {
        log.error(`${error.message} in ${id}:${method}`)
        throw new Error(error)
      }
    }

    async process({ request, response, handler }) {
      const { query, body, headers } = request

      const meta = { request, response }
      const data = { ...body, ...parse(query) }

      const { authorization } = headers

      const responseJson = { result: "", error: "" }

      try {
        if (authorization && authorization.startsWith("Bearer ")) {
          const token = authorization.split("Bearer ")[1]

          meta.bearer = await getSinglePost({ token })
        }

        responseJson.result = await handler({ data, meta })
      } catch (error) {
        responseJson.error = error.message || 500
        log.error(error)
      }

      response
        .status(200)
        .jsonp(responseJson)
        .end()

      return
    }
  })()

  return Factor.$lodash.merge(util, server)
}
