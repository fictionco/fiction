import { Query } from "@factor/engine/query"

export abstract class QueryFactor extends Query {
  readonly cacheQuery?: boolean
  readonly cacheKey?: string
  constructor() {
    super({ dbName: process.env.POSTGRES_DB ?? "factor" })
  }
}
