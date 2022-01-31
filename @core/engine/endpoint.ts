import { EndpointResponse } from "@factor/types"
import axios, { AxiosRequestConfig, AxiosError } from "axios"
import { clientToken, logger } from "@factor/api"
import { Query } from "./query"

export type EndpointOptions = {
  baseURL: string
  basePath: string
}
export type EndpointMethodOptions<T extends Query> = {
  key: string
  queryHandler: T
}

export class Endpoint<T extends Query> {
  readonly baseURL: string
  readonly basePath: string
  readonly key: string
  queryHandler: T
  constructor(options: EndpointOptions & EndpointMethodOptions<T>) {
    const { baseURL, basePath, key, queryHandler } = options
    this.basePath = basePath
    this.baseURL = baseURL

    this.key = key
    this.queryHandler = queryHandler
  }

  public request(params: Parameters<T["run"]>[0]): ReturnType<T["run"]> {
    return this.http(this.key, params) as ReturnType<T["run"]>
  }

  public async serveRequest(
    params: Record<string, unknown>,
  ): Promise<EndpointResponse> {
    return await this.queryHandler.run(params)
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
        Authorization: `Bearer ${bearerToken}`,
        from: "dashboard",
      },
      baseURL: this.baseURL,
      url,
      data,
    }

    logger.log({
      level: "info",
      context: `Endpoint:${this.basePath}`,
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
        context: `Endpoint:${this.basePath}`,
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
      context: `Endpoint:${this.basePath}`,
      description: "http response",
      data: responseData,
    })

    return responseData
  }
}
