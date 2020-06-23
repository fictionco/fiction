import { emitEvent } from "@factor/api/events"
import { isNode, setting } from "@factor/api"
import log from "@factor/api/logger"
import { localhostUrl } from "@factor/api/url"
import { userInitialized } from "@factor/user"
import { userToken, handleTokenError } from "@factor/user/token"
import axios, { AxiosResponse, AxiosRequestConfig } from "axios"
import { ObjectId } from "@factor/post/types"
import { getUserGeolocationSync } from "@factor/user/geo"
import { UserGeolocation } from "@factor/user/types"
export interface EndpointRequestConfig {
  id: string
  method: string
  params: EndpointParameters
  headers?: Record<string, any>
}

export interface EndpointParameters {
  token?: string
  [key: string]: Record<string, any> | string | number | undefined | boolean | ObjectId
}

interface StandardEndpointRequestData {
  method: string
  params: EndpointParameters
  geo?: UserGeolocation
}

/**
 * Standard endpoint structure
 * @param _id - Endpoint Id
 */
export const endpointPath = (_id: string): string => {
  return `/_api_/${_id}`
}

/**
 * Structures the bearer token for requests
 * @remarks
 * This always wait for user initialization, unless token is set in params
 */
export const bearerToken = async (data: any): Promise<string> => {
  if (typeof data !== "object" || data == null || !data.params || !data.params.token) {
    await userInitialized()
  }

  return `Bearer ${userToken()}`
}

/**
 * Make a request with Authorization header which represents the auth
 * state of the logged in user (bearer)
 * @param path - path to make request
 * @param data - data to request with
 * @param options  - axios request options
 */
export const authorizedRequest = async (
  path: string,
  data: unknown,
  options: AxiosRequestConfig = {}
): Promise<AxiosResponse> => {
  const { headers = {} } = options

  // Must be capitalized as name is a standard
  const Authorization = await bearerToken(data)

  // Allow endpoints to deduce which app is requesting from them
  const source = setting("package.name") ?? ""

  options.headers = { Authorization, from: source, ...headers }

  options.timeout = 30000

  if (isNode) {
    options.baseURL = localhostUrl()
  }

  return await axios.post(path, data, options)
}

/**
 * Make an HTTP request to an endpoint
 * @param id - endpoint ID, tied to the path
 * @param method - the method at the endpoint to call
 * @param params - the data to call the endpoint method with
 * @param headers - the headers on the request
 */
export const endpointRequest = async <T = unknown>({
  id,
  method,
  params = {},
  headers = {},
}: EndpointRequestConfig): Promise<T> => {
  if (!method) {
    throw new Error(`Endpoint request to "${id}" requires a method.`)
  }

  const requestData = { method, params } as StandardEndpointRequestData

  const geo = getUserGeolocationSync()
  if (geo) {
    requestData.geo = geo
  }

  const {
    data: { result, error },
  } = await authorizedRequest(endpointPath(id), requestData, { headers })

  if (error) {
    handleTokenError(error, {
      onError: (): void => {
        const err = new Error(error.message.replace("Error: ", ""))
        emitEvent("error", err)

        /**
         * Don't rethrow errors as they will cause SSR errors for requests made during SSR
         * This prevents page load
         */
        if (isNode) {
          log.error(err)
        } else {
          throw err
        }
      },
    })
  }

  return result
}
