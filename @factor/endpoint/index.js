import { userToken } from "@factor/user"
import { emitEvent } from "@factor/tools"
import axios from "axios"

export async function endpointRequest({ id, method, params = {}, headers = {} }) {
  try {
    if (!method) {
      throw new Error(`Endpoint request to "${id}" requires a method.`)
    }

    const {
      data: { result, error }
    } = await authorizedRequest(endpointPath(id), { method, params }, { headers })

    if (error) {
      emitEvent("error", error)
      throw new Error(error)
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

  console.log("sending request with headers", options.headers)

  if (process.env.PORT) {
    options.proxy = {
      host: "0.0.0.0",
      port: process.env.PORT
    }
  }

  return await axios.post(path, data, options)
}

export function bearerToken() {
  return userToken() ? `Bearer ${userToken()}` : ""
}
