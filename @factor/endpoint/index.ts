import { emitEvent } from "@factor/api/events"
import { isNode } from "@factor/api/utils"
import { localhostUrl } from "@factor/api/url"
import { userInitialized } from "@factor/user"
import { userToken, handleTokenError } from "@factor/user/token"
import axios, { AxiosResponse, AxiosRequestConfig } from "axios"

export interface EndpointRequestConfig {
  id: string;
  method: string;
  params: object;
  headers?: object;
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
 */
export const bearerToken = async (): Promise<string> => {
  await userInitialized()

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
  data: object,
  options: AxiosRequestConfig = {}
): Promise<AxiosResponse> => {
  const { headers = {} } = options

  // Must be capitalized as name is a standard
  const Authorization = await bearerToken()

  options.headers = { Authorization, ...headers }

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
export const endpointRequest = async ({
  id,
  method,
  params = {},
  headers = {}
}: EndpointRequestConfig): Promise<unknown | Error> => {
  if (!method) {
    throw new Error(`Endpoint request to "${id}" requires a method.`)
  }

  const {
    data: { result, error }
  } = await authorizedRequest(endpointPath(id), { method, params }, { headers })

  if (error) {
    handleTokenError(error, {
      onError: (): void => {
        const err = new Error(error.message.replace("Error: ", ""))
        emitEvent("error", err)
        throw err
      }
    })
  }

  return result
}
