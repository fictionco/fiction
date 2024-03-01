import type { ErrorCode } from './__error'

export interface EndpointResponse<T = unknown> {
  status: 'success' | 'fail' | 'error'
  data?: T
  message?: string
  code?: ErrorCode
  expose?: boolean
}
