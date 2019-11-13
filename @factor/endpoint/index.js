import { userToken, handleTokenError } from "@factor/user/token"
import { emitEvent } from "@factor/tools"
import axios from "axios"
import { currentUrl } from "@factor/tools/permalink"
export async function endpointRequest({ id, method, params = {}, headers = {} }) {
  try {
    if (!method) {
      throw new Error(`Endpoint request to "${id}" requires a method.`)
    }

    const {
      data: { result, error }
    } = await authorizedRequest(endpointPath(id), { method, params }, { headers })

    if (error) {
      handleTokenError(error, {
        onTokenError: () => {
          emitEvent("error", error)
          throw new Error(error)
        }
      })
    }

    return result
  } catch (error) {
    throw new Error(error)
  }
}

export function endpointPath(_id) {
  return `/_api_/${_id}`
}

export async function authorizedRequest(path, data, options = {}) {
  const { headers = {} } = options

  options.headers = { Authorization: bearerToken(), ...headers }

  options.baseURL = currentUrl()

  return await axios.post(path, data, options)
}

export function bearerToken() {
  return `Bearer ${userToken()}`
}
