import type { EndpointResponse } from '../types'

export type ErrorCategory = 'error' | 'fail' | 'success'

export type ErrorCode = 'OPERATION_FAILED' | 'INVALID_INPUT' | 'RESOURCE_NOT_FOUND' | 'AUTHENTICATION_FAILED' | 'PERMISSION_DENIED' | 'TOKEN_ERROR' | string

export interface ErrorConfig {
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
}

/**
 * Aborts the process, generating a structured error response based on the provided code and message.
 * @param message The error message to display.
 * @param config Additional configuration for handling the error.
 * @returns A structured error response object.
 */
export function abort<T = unknown>(message: string, config: ErrorConfig = {}): EndpointResponse<T> {
  const {
    status = 'error',
    code = 'OPERATION_FAILED',
    data = undefined,
    expose = true,
    failedField = undefined,
    suggestedAction = undefined,
    retryable = false,
  } = config

  const httpStatus = config.httpStatus || defaultHttpStatus(code)

  return {
    status,
    httpStatus,
    message,
    code,
    data: data as T,
    expose,
    stack: new Error(message).stack,
    failedField,
    suggestedAction,
    retryable,
  }
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
