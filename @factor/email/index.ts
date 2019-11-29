import { endpointRequest } from "@factor/endpoint"

export async function sendEmailRequest(method: string, params: object): Promise<object> {
  return await endpointRequest({ id: "email", method, params })
}
1
