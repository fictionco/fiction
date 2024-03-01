import type { EndpointResponse, ErrorConfig } from '@kaption/types'

/**
 * An object meant to be thrown, stop execution and report issues to users
 */
export function _stop(config: ErrorConfig): EndpointResponse {
  const { status = 'error', message, code = 'STOP', data } = config
  return { status, message, code, data, expose: true }
}
