import { Request, Response } from "express"

import { CurrentUserState, UserGeolocation } from "@factor/user/types"

export type ResponseType =
  | Record<string, any>
  | (string | Record<string, any> | number)[]
  | string
  | void

export interface EndpointRequestHandler {
  ({ data, meta }: EndpointRequestParams): Promise<ResponseType>
}

export interface EndpointRequestParams {
  data: { method: string; params: Record<string, any> }
  meta: EndpointMeta
  url: string
  bearer: CurrentUserState
}

export interface EndpointItem {
  id: string
  handler:
    | (() => Record<string, (p: EndpointRequestParams) => any>)
    | Record<string, (p: any) => any>
    | Record<string, (e: any, m: any) => any>
}

export interface EndpointMeta {
  request?: Request
  response?: Response
  bearer?: CurrentUserState
  source?: string
  url?: string
  serverRequest?: true
  geo?: UserGeolocation
}

export interface EndpointRequestConfig {
  request: Request
  response: Response
  handler: EndpointRequestHandler
}
