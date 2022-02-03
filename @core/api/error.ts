import { EndpointResponse, ErrorConfig } from "@factor/types"

/**
 * An object meant to be thrown, stop execution and report issues to users
 */
export const _stop = (config: ErrorConfig | string): EndpointResponse => {
  if (typeof config == "string") {
    config = { message: config }
  }
  const {
    status = "error",
    message,
    code = "STOP",
    data = undefined,
    expose = true,
  } = config
  return { status, message, code, data, expose }
}
