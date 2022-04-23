import axios, { AxiosRequestConfig } from "axios"
import type express from "express"
import { PrivateUser } from "../plugin-user/types"
import { EndpointResponse } from "../types"

import { logger } from "../logger"
import { emitEvent } from "../utils/event"

import type { FactorUser } from "../plugin-user"
import { Query } from "./query"

type EndpointServerUrl = (() => string | undefined) | string | undefined

export type EndpointOptions = {
  serverUrl: EndpointServerUrl
  basePath: string
  factorUser?: FactorUser
}
export type EndpointMethodOptions<T extends Query> = {
  queryHandler?: T
  requestHandler?: (e: express.Request) => Promise<EndpointResponse>
  key: string
  basePath?: string
  serverUrl: string
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

export type EndpointMap<T extends Record<string, Query>> = {
  [P in keyof T]: Endpoint<T[P]>
}

export class Endpoint<T extends Query = Query, U extends string = string> {
  readonly serverUrl: EndpointServerUrl
  readonly basePath: string
  readonly key: string
  factorUser?: FactorUser
  queryHandler?: T
  requestHandler?: (e: express.Request) => Promise<EndpointResponse>
  constructor(options: EndpointOptions & EndpointMethodOptions<T>) {
    const { serverUrl, basePath, queryHandler, requestHandler, key } = options
    this.basePath = basePath
    this.serverUrl = serverUrl
    this.key = key as U

    this.queryHandler = queryHandler
    this.requestHandler = requestHandler
    this.factorUser = options.factorUser
  }

  setup() {
    return {}
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

    if (this.factorUser) {
      if (r.user) {
        await this.factorUser.updateUser(() => r.user as PrivateUser)
      }

      if (r.token) {
        this.factorUser.clientToken({ action: "set", token: r.token as string })
      }
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

  private getBaseUrl(): string {
    const baseUrl =
      typeof this.serverUrl == "function" ? this.serverUrl() : this.serverUrl

    if (!baseUrl) {
      throw new Error("serverUrl is missing")
    }

    return baseUrl
  }

  public async http<U>(
    method: string,
    data: unknown,
  ): Promise<EndpointResponse<U>> {
    const bearerToken = this.factorUser?.clientToken({ action: "get" })

    const url = `${this.basePath}/${method}`

    const options: AxiosRequestConfig = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${bearerToken ?? ""}`,
        from: "dashboard",
      },
      baseURL: this.getBaseUrl(),
      url,
      data,
    }

    const fullUrl = `${this.getBaseUrl()}${url}`

    logger.debug("Endpoint", `request at ${fullUrl}`, {
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

    logger.debug("Endpoint", `response from ${url}`, { data: responseData })

    return responseData
  }
}
