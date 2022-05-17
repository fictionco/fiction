import express from "express"
import { ErrorCode } from "./error"
import { UserRoles } from "./roles"

export type IndexMeta = {
  count?: number
  offset?: number
  limit?: number
}

export type EndpointResponse<T = unknown> = {
  status: "success" | "error" | "fail" | "loading"
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

export type EndpointConfig = {
  route: string | RegExp | Array<string | RegExp>
  auth?: UserRoles
  handler: (ctx: express.Request) => Promise<EndpointResponse>
  availableActions?: string[]
}
