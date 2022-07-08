import type { FormData as FormDataNode } from "formdata-node"
import { PrivateUser } from "../plugin-user/types"
import { EndpointResponse } from "../types"
import { log } from "../plugin-log"
import type { FactorUser } from "../plugin-user"
import type { FactorRouter } from "../plugin-router"
import type { Query } from "../query"
import { express, axios } from "./libraries"
import { notify } from "./notify"
import { deepMergeAll } from "./utils"
import { isApp } from "./vars"
type EndpointServerUrl = (() => string | undefined) | string | undefined

export type EndpointOptions = {
  serverUrl: EndpointServerUrl
  basePath: string
  middleware?: () => express.RequestHandler[]
  factorUser?: FactorUser
  factorRouter?: FactorRouter
  unauthorized?: boolean
}

type RequestHandler = (
  req: express.Request,
  res: express.Response,
) => Promise<EndpointResponse>
export type EndpointMethodOptions<T extends Query> = {
  queryHandler?: T
  requestHandler?: RequestHandler
  key: string
  basePath?: string
  serverUrl: string
}

export type EndpointMeta = {
  bearer?: Partial<PrivateUser> & { userId: string; iat?: number }
  server?: boolean
  returnAuthority?: boolean
  caller?: string
  request?: express.Request
  response?: express.Response
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

export type EndpointSettings<T extends Query = Query> = EndpointOptions &
  EndpointMethodOptions<T>

export class Endpoint<T extends Query = Query, U extends string = string> {
  readonly serverUrl: EndpointServerUrl
  readonly basePath: string
  readonly key: string
  factorUser?: FactorUser
  factorRouter?: FactorRouter
  queryHandler?: T
  requestHandler?: RequestHandler
  middleware: express.RequestHandler[]
  constructor(options: EndpointSettings<T>) {
    const {
      serverUrl,
      basePath,
      queryHandler,
      requestHandler,
      key,
      unauthorized,
      middleware,
    } = options
    this.basePath = basePath
    this.serverUrl = serverUrl
    this.key = key as U

    this.queryHandler = queryHandler
    this.requestHandler = requestHandler

    this.middleware = middleware && !isApp() ? middleware() : []

    this.factorRouter = options.factorRouter
    if (!unauthorized && options.factorUser) {
      this.factorUser = options.factorUser
    }
  }

  setup() {
    return {}
  }

  public pathname(): string {
    return `${this.basePath}/${this.key}`
  }

  get requestUrl(): string {
    return `${this.getBaseUrl()}${this.basePath}/${this.key}`
  }

  async upload(data: FormData | FormDataNode): Promise<ReturnType<T["run"]>> {
    const r = await fetch(this.requestUrl, {
      body: data as BodyInit,
      method: "post",
      headers: {
        Authorization: this.bearerHeader,
      },
    })

    const response = (await r.json()) as Awaited<ReturnType<T["run"]>>

    return response
  }

  public async request(
    params: Parameters<T["run"]>[0],
    userRequestConfig?: axios.AxiosRequestConfig,
  ): Promise<Awaited<ReturnType<T["run"]>>> {
    const r = await this.http(this.key, params, userRequestConfig)

    if (r.message) {
      notify.emit(r.status as "success" | "error", r.message)
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
    response: express.Response,
  ): Promise<EndpointResponse> {
    if (this.requestHandler) {
      return await this.requestHandler(request, response)
    } else if (this.queryHandler) {
      const params = request.body as Record<string, any>
      const meta: EndpointMeta = { bearer: request.bearer, request, response }

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

  get bearerHeader() {
    const bearerToken = this.factorUser?.clientToken({ action: "get" })
    return `Bearer ${bearerToken ?? ""}`
  }

  public async http<U>(
    method: string,
    data: unknown,
    userRequestConfig?: axios.AxiosRequestConfig,
  ): Promise<EndpointResponse<U>> {
    const url = `${this.basePath}/${method}`

    let options: axios.AxiosRequestConfig = {
      method: "POST",
      headers: {
        Authorization: this.bearerHeader,
      },
      baseURL: this.getBaseUrl(),
      url,
      data,
    }

    if (userRequestConfig) {
      options = deepMergeAll([options, userRequestConfig])
    }

    const fullUrl = `${this.getBaseUrl()}${url}`

    log.debug("Endpoint", `request at ${fullUrl}`, {
      data: options,
    })

    let responseData: EndpointResponse<U>
    try {
      const response = await axios.default.request<EndpointResponse<U>>(options)
      responseData = response.data
    } catch (error: unknown) {
      log.error("Endpoint", `error: ${method}`, { error })

      responseData = {
        status: "error",
        message: `http request error @${options.url}`,
      }
    }

    log.debug("Endpoint", `response from ${url}`, { data: responseData })

    return responseData
  }
}
