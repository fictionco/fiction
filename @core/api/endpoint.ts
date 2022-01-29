import { updateUser } from "@factor/api"
import { serverUrl } from "@factor/api/url"
import { EndpointResponse, PrivateUser, ErrorConfig } from "@factor/types"
import axios, { AxiosRequestConfig } from "axios"

import { emitEvent } from "./event"
import { clientToken } from "./jwt"
import { logger } from "./logger"

type ErrorResponse = {
  error: ErrorConfig | Error | unknown
  params?: any
  context?: string
  description?: string
}
export const endpointErrorResponse = (
  options?: ErrorResponse,
): EndpointResponse => {
  const { error, params, context = "???", description = "???" } = options ?? {}

  logger.log({ level: "error", context, description, data: params })
  const e = error as ErrorConfig
  return {
    status: "error",
    message: e.expose ? e.message : "",
    code: e.code,
    error,
  }
}

/**
 * Make a request with Authorization header which represents the auth
 * state of the logged in user (bearer)
 */
export const endpointRequest = async <T = unknown>(
  options: AxiosRequestConfig = {},
): Promise<EndpointResponse<T | Error>> => {
  const { headers = {}, method } = options

  // Must be capitalized as name is a standard
  const Authorization = `Bearer ${clientToken({ action: "get" })}`

  // Allow endpoints to deduce which app is requesting from them
  const source = "factor"

  options.headers = { Authorization, from: source, ...headers }

  options.method = method ?? "POST"

  options.baseURL = serverUrl()

  logger.log({
    level: "info",
    context: "endpointRequest",
    description: `url:${options.url}`,
    data: { options },
  })

  let data: EndpointResponse<T | Error>
  try {
    const response = await axios.request<EndpointResponse<T>>(options)
    data = response.data
  } catch (error: unknown) {
    const e = error as Error
    logger.log({
      level: "error",
      context: "endpointRequest",
      description: "request error",
      data: { e },
    })
    data = {
      status: "error",
      message: "request error",
      data: e,
    }
  }

  logger.log({
    level: "info",
    context: "endpointRequest",
    description: `response:${options.url}`,
    data,
  })

  return data
}

export type EndpointAction = {
  endpoint: string
  request: Record<string, any>
  response: EndpointResponse
}

export const endpointFetch = async <T extends EndpointAction>(
  url: T["endpoint"],
  data: T["request"],
  options: AxiosRequestConfig = {},
): Promise<T["response"]> => {
  const r = await endpointRequest({
    url: url as string,
    data,
    ...options,
  })

  if (r.message) {
    const notifyType = r.status == "error" ? "notifyError" : "notifySuccess"
    emitEvent(notifyType, { message: r.message, more: r.more })
  }

  if (r.user) {
    await updateUser(() => r.user as PrivateUser)
  }

  if (r.token) {
    clientToken({ action: "set", token: r.token as string })
  }

  return r
}
