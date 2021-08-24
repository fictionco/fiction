import { updateUser } from "@factor/api"
import { serverUrl } from "@factor/api/url"
import { EndpointResponse } from "@factor/types"
import axios, { AxiosRequestConfig } from "axios"

import { emitEvent } from "./event"
import { clientToken } from "./jwt"
import { dLog } from "./logger"

/**
 * Make a request with Authorization header which represents the auth
 * state of the logged in user (bearer)
 */
export const endpointRequest = async <T = unknown>(
  options: AxiosRequestConfig = {},
): Promise<EndpointResponse<T>> => {
  const { headers = {}, method } = options

  // Must be capitalized as name is a standard
  const Authorization = `Bearer ${clientToken({ action: "get" })}`

  // Allow endpoints to deduce which app is requesting from them
  const source = "factor"

  options.headers = { Authorization, from: source, ...headers }

  options.method = method ?? "POST"

  options.baseURL = serverUrl()

  dLog("info", "http request", options)

  let data: EndpointResponse<T>
  try {
    const response = await axios.request(options)
    data = response.data
  } catch (error) {
    dLog("error", "server request error", error)
    data = { status: "error", message: "server request error", data: error }
  }

  dLog("info", "http response", data)

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
    updateUser(() => r.user)
  }

  if (r.token) {
    clientToken({ action: "set", token: r.token })
  }

  return r
}
