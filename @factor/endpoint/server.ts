import { addCallback, addFilter, applyFilters, log } from "@factor/tools"
import { endpointPath } from "@factor/endpoint"
import { getSinglePost } from "@factor/post/server"
import { parse } from "qs"
import { Request, Response } from "express"
import { FactorUser } from "@factor/user/types"
import {
  responseType,
  EndpointRequestParams,
  EndpointItem,
  EndpointMeta,
  EndpointRequestConfig
} from "./types"

// Run after other imports have added themselves
addCallback("initialize-server", () => initializeEndpointServer())

export function addEndpoint({ id, handler }: EndpointItem): void {
  addCallback("endpoints", { id, handler })
}

export function initializeEndpointServer(): void {
  addFilter("middleware", (_: object[]) => {
    applyFilters("endpoints", []).forEach(({ id, handler }: EndpointItem) => {
      _.push({
        path: endpointPath(id),
        middleware: [
          async (request: Request, response: Response): Promise<void> => {
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

export async function runEndpointMethod({
  id,
  handler,
  data,
  meta
}: EndpointRequestParams & EndpointItem): Promise<any> {
  const { method, params = {} } = data

  if (!method) {
    throw new Error(`No method provided for "${id}" request`)
  }

  const _ep = typeof handler == "function" ? handler() : handler

  if (!_ep[method] || typeof _ep[method] !== "function") {
    throw new Error(`Endpoint method ${id}:${method} is missing.`)
  }

  try {
    if (typeof _ep.permissions == "function") {
      await _ep.permissions({ method, meta, params })
    }
    return await _ep[method](params, meta)
  } catch (error) {
    log.error(`${error.message} in ${id}:${method}`)
    throw new Error(error)
  }
}

export async function processEndpointRequest({
  request,
  response,
  handler
}: EndpointRequestConfig): Promise<void> {
  const { query, body, headers } = request

  const meta: EndpointMeta = { request, response }

  const data = { ...body, ...parse(query) }

  const { authorization } = headers

  const responseJson: { result: responseType; error: object } = { result: "", error: {} }

  // Authorization / Bearer
  // If there is an error leave as null bearer but still run method
  try {
    if (authorization && authorization.startsWith("Bearer ")) {
      const token = authorization.split("Bearer ")[1]

      meta.bearer = token ? ((await getSinglePost({ token })) as FactorUser) : undefined
    }
  } catch (error) {
    responseJson.error = error.message || 500
    log.error(error)
  }

  // Run Endpoint Method
  try {
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
