import axios, { AxiosRequestConfig } from "axios"
import type express from "express"
import { PrivateUser } from "../plugin-user/types"
import { EndpointResponse } from "../types"
import { clientToken } from "../jwt"
import { logger } from "../logger"
import { emitEvent } from "../event"
import { updateUser } from "../plugin-user/userClient"
import { serverUrl } from "./url"

import { Query } from "./query"

export type EndpointOptions = {
  baseURL: () => string
  basePath: string
}
export type EndpointMethodOptions<T extends Query> = {
  queryHandler?: T
  requestHandler?: (e: express.Request) => Promise<EndpointResponse>
  key: string
  basePath?: string
}

export type EndpointMeta = {
  bearer?: Partial<PrivateUser> & { userId: string; iat?: number }
  server?: boolean
}

export type EndpointManageAction =
  | "create"
  | "retrieve"
  | "update"
  | "delete"
  | "list"
  | "cancel"
  | "restore"
  | "setDefault"
  | "attach"
  | "transfer"

export class Endpoint<T extends Query = Query, U extends string = string> {
  readonly baseURL: () => string
  readonly basePath: string
  readonly key: string
  queryHandler?: T
  requestHandler?: (e: express.Request) => Promise<EndpointResponse>
  constructor(options: EndpointOptions & EndpointMethodOptions<T>) {
    const { baseURL, basePath, queryHandler, requestHandler, key } = options
    this.basePath = basePath
    this.baseURL = baseURL
    this.key = key as U

    this.queryHandler = queryHandler
    this.requestHandler = requestHandler
  }

  public pathname(): string {
    return `${this.basePath}/${this.key}`
  }

  public async request(
    params: Parameters<T["run"]>[0],
  ): Promise<Awaited<ReturnType<T["run"]>>> {
    const r = await this.http(this.key, params)

    if (r.message) {
      const notifyType = r.status == "error" ? "notifyError" : "notifySuccess"
      emitEvent(notifyType, { message: r.message, more: r.more })
    }

    if (r.user) {
      await updateUser(() => r.user as PrivateUser)
    }

    if (r.token) {
      clientToken({ action: "set", token: r.token as string })
    }

    return r as Awaited<ReturnType<T["run"]>>
  }

  public async serveRequest(
    request: express.Request,
  ): Promise<EndpointResponse> {
    if (this.requestHandler) {
      return await this.requestHandler(request)
    } else if (this.queryHandler) {
      const params = request.body as Record<string, any>
      const meta = { bearer: request.bearer }

      return await this.queryHandler.serveRequest(params, meta)
    } else {
      return { status: "error", more: "no query or request handler" }
    }
  }

  public async http<U>(
    method: string,
    data: unknown,
  ): Promise<EndpointResponse<U>> {
    const bearerToken = clientToken({ action: "get" })

    const url = `${this.basePath}/${method}`

    const options: AxiosRequestConfig = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${bearerToken ?? ""}`,
        from: "dashboard",
      },
      baseURL: this.baseURL(),
      url,
      data,
    }

    logger.debug("Endpoint", `request at ${url}`, {
      data: options,
    })

    let responseData: EndpointResponse<U>
    try {
      const response = await axios.request<EndpointResponse<U>>(options)
      responseData = response.data
    } catch (error: unknown) {
      logger.error("Endpoint", `error: ${method}`, { error })

      responseData = { status: "error", message: "http request error" }
    }

    logger.debug("Endpoint", `response from ${url}`, {
      data: responseData,
    })

    return responseData
  }
}

export class FactorEndpoint<T extends Query = Query> extends Endpoint<T> {
  constructor(options: { basePath: string } & EndpointMethodOptions<T>) {
    super({ baseURL: () => serverUrl(), ...options })
  }
}

type RequestMap<T extends Record<string, Query>> = {
  [P in keyof T]: FactorEndpoint<T[P]>
}

export const GetRequestMap = <T extends Record<string, Query>>(
  Queries: T,
  endpointClass: new (options: any) => FactorEndpoint,
): RequestMap<T> => {
  return Object.fromEntries(
    Object.entries(Queries).map(([key, query]) => {
      return [key, new endpointClass({ key, queryHandler: query })]
    }),
  ) as RequestMap<T>
}
