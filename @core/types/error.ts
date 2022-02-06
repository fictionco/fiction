export type ErrorCategory = "error" | "fail" | "success"

export type ErrorCode = "TOKEN_ERROR" | "STOP"

export type ErrorConfig = {
  status?: ErrorCategory
  message: string
  code?: ErrorCode
  httpStatus?: number
  data?: Record<string, any> | Error
  expose?: boolean
  stack?: string
}
