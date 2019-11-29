import { emitEvent } from "@factor/tools/events"
import { isNode } from "@factor/tools/external"
import { localhostUrl } from "@factor/tools/url"
import { userToken, handleTokenError } from "@factor/user/token"
import axios, { AxiosResponse, AxiosRequestConfig } from "axios"

export interface EndpointRequest {
  id: string;
  method: string;
  params: object;
  headers: object;
}

export async function endpointRequest({
  id,
  method,
  params = {},
  headers = {}
}: EndpointRequest): Promise<object> {
  try {
    if (!method) {
      throw new Error(`Endpoint request to "${id}" requires a method.`)
    }

    const {
      data: { result, error }
    } = await authorizedRequest(endpointPath(id), { method, params }, { headers })

    if (error) {
      handleTokenError(error, {
        onError: (): void => {
          emitEvent("error", error)
          // eslint-disable-next-line no-console
          console.error(error)
        }
      })
    }

    return result
  } catch (error) {
    throw new Error(error)
  }
}

export function endpointPath(_id: string): string {
  return `/_api_/${_id}`
}

export async function authorizedRequest(
  path: string,
  data: object,
  options: AxiosRequestConfig = {}
): Promise<AxiosResponse> {
  const { headers = {} } = options

  options.headers = { Authorization: bearerToken(), ...headers }

  if (isNode) {
    options.baseURL = localhostUrl() //currentUrl()
  }

  return await axios.post(path, data, options)
}

export function bearerToken(): string {
  return `Bearer ${userToken()}`
}
