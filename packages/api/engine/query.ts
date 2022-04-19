import { Knex } from "knex"
import { contextLogger } from "../logger"
import { _stop } from "../error"
import type { EndpointResponse, ErrorConfig } from "../types"
import * as utils from "../utils"
import type { FactorDb } from "../plugin-db"
import type { EndpointMeta } from "./endpoint"

type QuerySettings =
  | {
      db?: FactorDb
    }
  | undefined

export abstract class Query<T extends QuerySettings = {}> {
  db?: FactorDb
  stop = _stop
  utils = utils
  log = contextLogger(this.constructor.name)

  constructor(settings?: T) {
    this.db = settings?.db
  }

  getDb(): Knex {
    const dbClient = this.db?.client()

    if (!dbClient) throw new Error("no db client")

    return dbClient
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

      this.log.error(`QueryError: ${e.message}`, { error: e })

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
