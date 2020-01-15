import { Request, Response } from "express"
import { addCallback, addFilter, applyFilters } from "@factor/api/hooks"
import log from "@factor/api/logger"

import { FactorUser, CurrentUserState } from "@factor/user/types"
import { endpointPath } from "@factor/endpoint"
import { getSinglePost } from "@factor/post/server"
import { parse } from "qs"
import createError, { HttpError } from "http-errors"
import {
  EndpointItem,
  EndpointMeta,
  EndpointRequestConfig,
  EndpointRequestParams,
  ResponseType
} from "./types"

/**
 * An error that allows for a code property ideally suited for endpoint HTTP errors
 * @param code - the http error code
 * @param message - the error message
 *
 * @category server
 */
export const endpointError = (
  code: string | number,
  message: string
): NodeJS.ErrnoException => {
  const error: NodeJS.ErrnoException = new Error(message)
  error.code = String(code)
  return error
}

/**
 * Takes authorization header with bearer token and converts it into a user for subsequent endpoint operations
 * @param bearerToken - JWT token sent from client in authorization header
 *
 * @category server
 */
export const setAuthorizedUser = async (
  bearerToken: string
): Promise<CurrentUserState> => {
  let user
  try {
    if (bearerToken && bearerToken.startsWith("Bearer ")) {
      const token = bearerToken.split("Bearer ")[1]

      user = token ? ((await getSinglePost({ token })) as FactorUser) : undefined
    }
  } catch (error) {
    throw endpointError(401, error.message)
  }

  return user
}

export const runEndpointMethod = async ({
  id,
  handler,
  data,
  meta
}: EndpointRequestParams & EndpointItem): Promise<any> => {
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

/**
 * Processes requests made to a specific endpoint with a provided handler
 *
 * @param config
 * @param config.request - Express request object
 * @param config.response - Express response object
 * @param config.handler - An object consisting of methods that can be accessed at the endpoint
 */
export const processEndpointRequest = async ({
  request,
  response,
  handler
}: EndpointRequestConfig): Promise<void> => {
  const { query, body, headers } = request

  const meta: EndpointMeta = { request, response }

  const data = { ...body, ...parse(query) }

  const { authorization = "" } = headers

  const responseJson: { result?: ResponseType; error?: HttpError } = {}

  // Authorization / Bearer.
  meta.bearer = await setAuthorizedUser(authorization)

  // Run Endpoint Method
  try {
    responseJson.result = await handler({ data, meta })
  } catch (error) {
    responseJson.error = createError(error.code ?? 500, error.message)
    log.error(error)
  }

  response
    .status(200)
    .jsonp(responseJson)
    .end()

  return
}

/**
 * Adds endpoints into the middleware filter
 *
 */
export const initializeEndpointServer = (): void => {
  addFilter({
    key: "endpoints",
    hook: "middleware",
    callback: (_: object[]) => {
      applyFilters("endpoints", []).forEach(({ id, handler }: EndpointItem) => {
        _.push({
          path: endpointPath(id),
          middleware: [
            async (request: Request, response: Response): Promise<void> => {
              return await processEndpointRequest({
                request,
                response,
                handler: __ => runEndpointMethod({ ...__, id, handler })
              })
            }
          ],
          id
        })
      })

      return _
    }
  })
}

export const setup = (): void => {
  // Run after other imports have added themselves
  addCallback({
    hook: "initialize-server",
    key: "addEndpoints",
    callback: () => initializeEndpointServer()
  })
}

setup()
