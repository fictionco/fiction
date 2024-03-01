import type express from 'express'
import type { ErrorCode } from './error'
import type { UserRoles } from './roles'

export interface IndexMeta {
  count?: number
  offset?: number
  limit?: number
  order?: 'asc' | 'desc'
  orderBy?: string
}

export type ResponseStatus = 'success' | 'error' | 'fail' | 'loading' | 'unknown'

export type ValidationReason = 'long' | 'invalid' | 'reserved' | 'taken' | 'short' | 'success' | 'error' | 'loading' | 'unknown' | 'current'

export interface EndpointResponse<
  T = unknown,
  U = ResponseStatus,
> {
  status: U
  data?: T
  message?: string
  more?: string
  error?: Error | unknown
  code?: ErrorCode
  expose?: boolean
  context?: string
  internal?: unknown
  loading?: any | Promise<any>
  indexMeta?: IndexMeta
  [key: string]: any
}

export interface EndpointConfig {
  route: string | RegExp | Array<string | RegExp>
  auth?: UserRoles
  handler: (ctx: express.Request) => Promise<EndpointResponse>
  availableActions?: string[]
}
