export type ErrorCategory = "error" | "fail" | "success"

export type ErrorCode = "TOKEN_ERROR" | "STOP" | string

export type ErrorConfig = {
  status?: ErrorCategory
  message: string
  code?: ErrorCode
  httpStatus?: 200 | 301 | 404 | 500
  location?: string
  data?: Record<string, any> | Error
  expose?: boolean
  stack?: string
}
