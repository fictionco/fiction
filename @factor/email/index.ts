import { endpointRequest } from "@factor/endpoint"
import { EmailTransactionalConfig } from "./util"
export const sendEmailRequest = async (
  method: string,
  params: EmailTransactionalConfig
): Promise<object> => {
  return await endpointRequest({ id: "email", method, params })
}
