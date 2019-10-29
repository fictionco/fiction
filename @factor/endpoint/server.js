import cors from "cors"
import { parse } from "qs"
import { getSinglePost } from "@factor/post/server"

import log from "@factor/logger"
import { addFilter, applyFilters } from "@factor/tools"

import { endpointPath } from "@factor/endpoint"

// Run after other imports have added themselves
addFilter("initialize-server", () => {
  initializeEndpointServer()
})

export function initializeEndpointServer() {
  addFilter("middleware", _ => {
    applyFilters("endpoints", []).forEach(({ id, handler }) => {
      _.push({
        path: endpointPath(id),
        middleware: [
          //cors(),
          async (request, response, next) => {
            return await processEndpointRequest({
              request,
              response,
              handler: _ => runEndpointMethod({ ..._, id, handler })
            })
          }
        ],
        id
      })
    })
    return _
  })
}

export async function runEndpointMethod({ id, handler, data, meta }) {
  const { method, params = {} } = data

  if (!method) {
    throw new Error(`No method provided for "${id}" request`)
  }

  const _ep = typeof handler == "function" ? handler() : handler

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

export async function processEndpointRequest({ request, response, handler }) {
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
