import { log } from "./plugin-log"
import { _stop } from "./utils/error"
import type { EndpointResponse, ErrorConfig } from "./types"
import * as utils from "./utils"
import type { EndpointMeta } from "./utils/endpoint"

export abstract class Query<T extends Record<string, unknown> = {}> {
  settings: T
  stop = _stop
  utils = utils
  log = log.contextLogger(this.constructor.name)

  constructor(settings: T) {
    this.settings = settings
  }

  allowed(
    _params: Parameters<this["run"]>[0],
    _meta: Parameters<this["run"]>[1],
  ): boolean | Promise<boolean> {
    return true
  }

  /**
   * Base query method
   */
  abstract run(
    params: unknown,
    meta?: EndpointMeta,
  ): Promise<EndpointResponse<unknown> | void>

  /**
   * Wrapper to catch errors
   * @note must await the result of run or it wont catch
   */
  async serve(
    params: Parameters<this["run"]>[0],
    meta: Parameters<this["run"]>[1],
  ): Promise<Awaited<ReturnType<this["run"]>>> {
    try {
      const allowed = await this.allowed(params, meta)

      if (!allowed) {
        throw this.stop("unauthorized")
      }

      const result = await this.run(params, meta)

      return result as Awaited<ReturnType<this["run"]>>
    } catch (error: unknown) {
      const e = error as ErrorConfig

      this.log.error(`QueryError: ${e.message}`, { error: e, data: e.data })

      const response = {
        status: "error",
        httpStatus: e.httpStatus || 200,
        location: e.location,
        message: e.expose ? e.message : "",
        expose: e.expose,
        code: e.code,
        data: e.data,
        context: this.constructor.name,
      }

      return response as Awaited<ReturnType<this["run"]>>
    }
  }

  async serveRequest(
    params: Parameters<this["run"]>[0],
    meta: Parameters<this["run"]>[1],
  ): Promise<Awaited<ReturnType<this["run"]>>> {
    return await this.serve(params, meta)
  }
}
