import dayjs from "dayjs"
import knex, { Knex } from "knex"
import { EndpointResponse, ErrorConfig } from "@factor/types"
import { logger } from "@factor/api"
import { _stop } from "@factor/api/error"
import { isNode } from "@factor/api/utils"
import { getDb } from "./db"
import { EndpointMeta } from "./endpoint"

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
    if (this.isNode) {
      this.qu = knex({ client: "pg" })
      this.getDb = getDb
    }
  }

  abstract run(
    params: unknown,
    meta?: EndpointMeta,
  ): Promise<EndpointResponse<unknown>>

  serve(
    params: Parameters<this["run"]>[0],
    meta: Parameters<this["run"]>[1],
  ): ReturnType<this["run"]> {
    try {
      return this.run(params, meta) as ReturnType<this["run"]>
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

      return response as ReturnType<this["run"]>
    }
  }
}
