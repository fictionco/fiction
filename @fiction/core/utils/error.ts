import type { EndpointMeta } from './endpoint'

export type ErrorCategory = 'error' | 'fail' | 'success'

export type ErrorCode = 'OPERATION_FAILED' | 'INVALID_INPUT' | 'RESOURCE_NOT_FOUND' | 'AUTHENTICATION_FAILED' | 'PERMISSION_DENIED' | 'TOKEN_ERROR' | string

export type ErrorConfig = {
  status?: ErrorCategory
  message?: string
  code?: ErrorCode
  httpStatus?: 400 | 401 | 403 | 404 | 500
  location?: string
  data?: Record<string, any> | Error
  expose?: boolean
  stack?: string
  failedField?: string
  suggestedAction?: string
  retryable?: boolean
  expected?: boolean
  reason?: string
} & EndpointMeta

export class EndpointError extends Error {
  status: string
  httpStatus: number
  code: string
  data: any
  expose: boolean
  failedField?: string
  suggestedAction?: string
  retryable: boolean
  reason: string

  constructor(message: string, config: ErrorConfig = {}) {
    super(config.expected || config.expectError ? `[EXPECTED] ${message}` : message)

    const {
      status = 'error',
      code = 'OPERATION_FAILED',
      data = undefined,
      expose = true,
      failedField = undefined,
      suggestedAction = undefined,
      retryable = false,
      reason = 'unknown',
    } = config

    const httpStatus = config.httpStatus || defaultHttpStatus(code)

    this.name = 'EndpointError'
    this.status = status
    this.httpStatus = httpStatus
    this.code = code
    this.data = data
    this.expose = expose
    this.failedField = failedField
    this.suggestedAction = suggestedAction
    this.retryable = retryable
    this.reason = reason
  }
}
export function abort(message: string, config: ErrorConfig = {}): Error {
  return new EndpointError(message, config)
}
export const _stop = abort

/**
 * Determines the HTTP status code based on the error code.
 * @param code The error code.
 * @returns The corresponding HTTP status code.
 */
function defaultHttpStatus(code: string): number {
  switch (code) {
    case 'INVALID_INPUT': return 400
    case 'RESOURCE_NOT_FOUND': return 404
    case 'AUTHENTICATION_FAILED': return 401
    case 'TOKEN_ERROR': return 401
    case 'PERMISSION_DENIED': return 403
    default: return 500 // Default to 500 for unspecified errors
  }
}
