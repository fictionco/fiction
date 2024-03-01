import path from "path"
import type { FormData as FormDataNode } from "formdata-node"
//import nodeFetch, { BodyInit as NodeFetchBodyInit } from "node-fetch"
import nodeFetch from "node-fetch"
import { PrivateUser } from "../plugin-user/types"
import { EndpointResponse } from "../types"

import type { FactorUser } from "../plugin-user"
import type { FactorRouter } from "../plugin-router"
import type { Query } from "../query"
import { log } from "../plugin-log"
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
  useNaked?: boolean
}

type RequestHandler = (
  req: express.Request,
  res: express.Response,
) => Promise<EndpointResponse | void>
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
  returnAuthority?: string[]
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
  useNaked?: boolean
  log = log.contextLogger("endpoint")
  constructor(options: EndpointSettings<T>) {
    const {
      serverUrl,
      basePath,
      queryHandler,
      requestHandler,
      key,
      unauthorized,
      middleware,
      useNaked,
    } = options
    this.basePath = basePath
    this.useNaked = useNaked
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

  public pathname(): string {
    const paths = [this.basePath]
    if (!this.useNaked) {
      paths.push(this.key)
    }

    return path.join(...paths)
  }

  get requestUrl(): string {
    return new URL(this.pathname(), this.getBaseUrl()).href
  }

  async upload(args: {
    data: FormData | FormDataNode
    progress?: (progress: number) => void
  }): Promise<ReturnType<T["run"]> | void> {
    const { data, progress } = args
    try {
      const r = await axios.default.request<ReturnType<T["run"]>>({
        method: "post",
        url: this.requestUrl,
        data,
        headers: { Authorization: this.bearerHeader },
        onUploadProgress: (p: { loaded: number; total?: number }) => {
          if (progress && p.total) {
            progress(p.loaded / p.total)
          }
        },
      })

      const response = r.data

      return response
    } catch (error) {
      this.log.error("upload error", { error })
    }
  }

  // async upload(
  //   data: FormData | FormDataNode,
  // ): Promise<ReturnType<T["run"]> | void> {
  //   try {
  //     /**
  //      * @todo - support native fetch in node, currently it fails
  //      *  and doesn't actually upload image... mostly this is needed for testing
  //      */
  //     const fetcher = isApp() ? fetch : (nodeFetch as typeof fetch)

  //     const r = await fetcher(this.requestUrl, {
  //       body: data as BodyInit,
  //       method: "post",
  //       headers: { Authorization: this.bearerHeader },
  //     })

  //     const response = (await r.json()) as Awaited<ReturnType<T["run"]>>

  //     return response
  //   } catch (error) {
  //     this.log.error("upload error", { error })
  //   }
  // }

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
  ): Promise<EndpointResponse | void> {
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
      log.error("endpoint", `error: ${method}`, { error })

      responseData = {
        status: "error",
        message: `http request error @${options.url}`,
      }
    }

    log.debug("endpoint", `response from ${url}`, { data: responseData })

    return responseData
  }
}
