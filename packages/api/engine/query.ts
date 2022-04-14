import dayjs from "dayjs"
import knex, { Knex } from "knex"
import { logger } from "../logger"
import { _stop } from "../error"
import { isNode, isVite } from "../utils"
import type { EndpointResponse, ErrorConfig } from "../types"
import { getDb } from "./db"
import type { EndpointMeta } from "./endpoint"

export abstract class Query {
  qu!: Knex // always set on server
  getDb!: typeof getDb // always set on server
  isNode: typeof isNode
  readonly dayjs: typeof dayjs
  stop: typeof _stop
  constructor() {
    /**
     * Add standard utilities
     */
    this.dayjs = dayjs
    this.isNode = isNode
    this.stop = _stop

    // set knex utility if node
    // w sitemap we use the built server app so knex is replaced
    // thus need to check if is a function also
    if (this.isNode && !isVite() && typeof knex == "function") {
      this.qu = knex({ client: "pg" })
      this.getDb = getDb
    }
  }

  /**
   * Base query method
   */
  abstract run(
    params: unknown,
    meta?: EndpointMeta,
  ): Promise<EndpointResponse<unknown>>

  /**
   * Wrapper to catch errors
   * @note must await the result of run or it wont catch
   */
  async serve(
    params: Parameters<this["run"]>[0],
    meta: Parameters<this["run"]>[1],
  ): Promise<Awaited<ReturnType<this["run"]>>> {
    try {
      const result = await this.run(params, meta)

      return result as Awaited<ReturnType<this["run"]>>
    } catch (error: unknown) {
      const e = error as ErrorConfig

      logger.error(this.constructor.name, `QueryError: ${e.message}`, {
        error: e,
      })

      const response = {
        status: "error",
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
