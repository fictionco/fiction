import dayjs from "dayjs"
import knex, { Knex } from "knex"
import { EndpointResponse, ErrorConfig, PrivateUser } from "@factor/types"
import { _stop, isNode } from "@factor/api"
import { getDb, postgresConnectionUrl } from "./db"
export type QueryOptions = {
  dbName: string
}

export abstract class Query {
  readonly dbName: string
  readonly dayjs: () => dayjs.Dayjs
  qu?: Knex
  db?: Promise<Knex>
  isNode: boolean
  stop: (config: ErrorConfig) => EndpointResponse
  constructor(options: QueryOptions) {
    const { dbName } = options ?? {}

    this.dbName = dbName
    /**
     * Add standard utilities
     */
    this.dayjs = (): dayjs.Dayjs => dayjs()
    this.isNode = isNode
    this.stop = _stop

    if (this.isNode) {
      this.qu = knex({ client: "pg" })
      if (postgresConnectionUrl()) {
        this.db = getDb()
      }
    }
  }

  abstract run(
    params: unknown,
    meta: { bearer?: PrivateUser },
  ): Promise<EndpointResponse<unknown>>
}

export abstract class FactorQuery extends Query {
  readonly cacheQuery?: boolean
  readonly cacheKey?: string
  constructor() {
    super({ dbName: process.env.POSTGRES_DB ?? "factor" })
  }
}
