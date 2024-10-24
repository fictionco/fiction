import { EndpointResponse, ErrorConfig } from "../types"
/**
 * An object meant to be thrown, stop execution and report issues to users
 */
export const _stop = <T = unknown>(
  config: ErrorConfig | string,
): EndpointResponse<T> => {
  if (typeof config == "string") {
    config = { message: config }
  } else if (config instanceof Error) {
    config = { status: "error", message: config.message, expose: false }
  }
  const {
    status = "error",
    message,
    httpStatus = 200,
    location,
    code = "STOP",
    data = undefined,
    expose = true,
  } = config

  return {
    status,
    httpStatus,
    location,
    message,
    code,
    data: data as T,
    expose,
  }
}
