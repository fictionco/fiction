import { endpointRequest } from "@factor/endpoint"
import { EmailTransactionalConfig } from "./util"
export async function sendEmailRequest(
  method: string,
  params: EmailTransactionalConfig
): Promise<object> {
  return await endpointRequest({ id: "email", method, params })
}
