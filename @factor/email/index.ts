import { endpointRequest } from "@factor/endpoint"
import { EmailTransactionalConfig } from "./util"
export const sendEmailRequest = async (
  method = "sendTransactional",
  params: EmailTransactionalConfig
): Promise<void> => {
  await endpointRequest({ id: "email", method, params })
  return
}
