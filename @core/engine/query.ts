import dayjs from "dayjs"
import knex, { Knex } from "knex"
import { EndpointResponse } from "@factor/types"
import { _stop, isNode } from "@factor/api"
import { getDb } from "./db"
import { EndpointMeta } from "./endpoint"
export type QueryOptions = {
  dbName: string
}

export abstract class Query {
  readonly dbName: string
  qu!: Knex // always set on server
  db!: typeof getDb // always set on server
  isNode: boolean
  readonly dayjs: typeof dayjs
  stop: typeof _stop
  constructor(options: QueryOptions) {
    const { dbName } = options ?? {}

    this.dbName = dbName
    /**
     * Add standard utilities
     */
    this.dayjs = dayjs
    this.isNode = isNode
    this.stop = _stop

    if (this.isNode) {
      this.qu = knex({ client: "pg" })
      this.db = getDb
    }
  }

  abstract run(
    params: unknown,
    meta: EndpointMeta,
  ): Promise<EndpointResponse<unknown>>
}

export abstract class FactorQuery extends Query {
  readonly cacheQuery?: boolean
  readonly cacheKey?: string
  constructor() {
    super({ dbName: process.env.POSTGRES_DB ?? "factor" })
  }
}
