import { EndpointResponse, ErrorConfig } from "@factor/types"

/**
 * An object meant to be thrown, stop execution and report issues to users
 */
export const _stop = (config: ErrorConfig): EndpointResponse => {
  const {
    status = "error",
    message,
    code = "STOP",
    data = null,
    expose = true,
  } = config
  return { status, message, code, data, expose }
}
