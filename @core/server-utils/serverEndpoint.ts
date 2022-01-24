import { addFilter } from "@factor/api"
import {
  EndpointConfig,
  EndpointResponse,
  PrivateUser,
  ErrorConfig,
} from "@factor/types"
import express from "express"
import { logger } from "./serverLogger"

export const addEndpoint = ({ route, handler }: EndpointConfig): void => {
  const key = typeof route == "string" ? route : route.toString()

  addFilter({
    hook: "endpoints",
    key,
    callback: (_) => {
      const r = [..._, { route, handler }]

      return r
    },
  })
}

export const processEndpointRequest = <T extends Record<string, any>>(
  request: express.Request,
): {
  args: T[keyof T] & {
    userId: string
    bearer: PrivateUser
  }
  _method?: keyof T
  url: string
} => {
  const _method = request.params._method as keyof T | undefined
  const args = request.body as T[keyof T] & {
    userId?: string
    bearer?: PrivateUser
  }
  const { userId } = request.bearer ?? {}

  args.userId = userId
  args.bearer = request.bearer

  return { _method: String(_method), args, url: request.url }
}

export const endpointErrorResponse = (
  error: ErrorConfig,
  request: express.Request,
): EndpointResponse => {
  const details = processEndpointRequest(request)
  logger({
    level: "error",
    context: details.url,
    description: `endpoint error: ${details._method}`,
    data: { error, ...details },
  })

  return {
    status: "error",
    message: error.expose ? error.message : "",
    code: error.code,
    expose: error.expose,
  }
}
