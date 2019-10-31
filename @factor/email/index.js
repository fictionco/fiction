import { endpointRequest } from "@factor/endpoint"

export async function sendEmailRequest(method, params) {
  return await endpointRequest({ id: "email", method, params })
}
1
