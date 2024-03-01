import type { EndpointResponse, ErrorConfig } from '../types'

/**
 * An object meant to be thrown, stop execution and report issues to users
 */
export function _stop<T = unknown>(message: string, config: ErrorConfig = {}): EndpointResponse<T> {
  const {
    status = 'error',
    httpStatus = 200,
    location,
    code = 'STOP',
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
    stack: new Error('stack').stack,
  }
}
