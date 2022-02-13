import axios, { AxiosRequestConfig, AxiosError } from "axios"
import type express from "express"
import { clientToken, logger, emitEvent, updateUser } from "@factor/api"
import { EndpointResponse, PrivateUser } from "@factor/types"
import { serverUrl } from "./url"

import { Query } from "./query"

export type EndpointOptions = {
  baseURL: string
  basePath: string
}
export type EndpointMethodOptions<T extends Query> = {
  queryHandler?: T
  requestHandler?: (e: express.Request) => Promise<EndpointResponse>
  key?: string
  basePath?: string
}

export type EndpointMeta = {
  bearer?: Partial<PrivateUser> & { userId: string }
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
  readonly baseURL: string
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
      baseURL: this.baseURL,
      url,
      data,
    }

    logger.log({
      level: "info",
      context: `ep:${url}`,
      description: `request:${url}`,
      data: options,
    })

    let responseData: EndpointResponse<U>
    try {
      const response = await axios.request<EndpointResponse<U>>(options)
      responseData = response.data
    } catch (error: unknown) {
      const e = error as AxiosError

      logger.log({
        level: "error",
        context: `ep:${url}`,
        description: `error: ${method}`,
        data: e,
      })

      responseData = {
        status: "error",
        message: "http request error",
      }
    }

    logger.log({
      level: "info",
      context: `ep:${url}`,
      description: "http response",
      data: responseData,
    })

    return responseData
  }
}

export class FactorEndpoint<T extends Query = Query> extends Endpoint<T> {
  constructor(options: { basePath: string } & EndpointMethodOptions<T>) {
    super({ baseURL: serverUrl(), ...options })
  }
}
