import dayjs from "dayjs"
import knex, { Knex } from "knex"
import { EndpointResponse, ErrorConfig } from "@factor/types"
import { logger } from "@factor/api"
import { _stop } from "@factor/api/error"
import { isNode } from "@factor/api/utils"
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
    if (this.isNode && typeof knex == "function") {
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

      logger.log({
        level: "error",
        context: this.constructor.name,
        description: `QueryError: ${e.message}`,
        data: e,
      })

      const response = {
        status: "error",
        message: e.message,
        expose: e.expose,
        code: e.code,
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
