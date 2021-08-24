import { snakeCaseKeys } from "@factor/api"
import { FactorPost } from "@factor/types"

import { getDb } from "./serverDbInit"

interface QueryOptions {
  upsert: boolean
  limit: number
  offset: number
  page: number
}

interface PostQueryResult {
  rows: FactorPost[]
  command: string
}

const postTableName = "post"
/**
 * Get a single post from db
 */
export const find = async (
  conditions: Record<string, any>,
  options: Partial<QueryOptions> = {},
): Promise<FactorPost[] | []> => {
  const db = await getDb()

  const { limit = 20, page } = options
  let { offset = 0 } = options

  // allow a page input that calculates offset
  if (page) {
    offset = page * limit - limit
  }

  const query = await db
    .table(postTableName)
    .select()
    .where(snakeCaseKeys(conditions))
    .limit(limit)
    .offset(offset)
    .toQuery()

  const result: PostQueryResult = await db.raw(query)

  return result.rows ?? []
}

/**
 * Get a single post from db
 */
export const findOne = async (
  conditions: Record<string, any>,
  options: Partial<QueryOptions> = {},
): Promise<FactorPost | undefined> => {
  const result = await find(conditions, options)
  return result.pop()
}
