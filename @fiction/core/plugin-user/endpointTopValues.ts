import type { EndpointMeta, EndpointResponse } from '@fiction/platform'
import type { Knex } from 'knex'
import type { UserQuerySettings } from './endpoint'
import { Query } from '../query'

type GetTopValuesParams = {
  table: string
  column: string
  limit?: number
  minCount?: number
  search?: string
  arrayColumn?: boolean
} & ({ orgId?: string, where: { orgId: string } } | { orgId: string, where?: { orgId?: string } })

export type TopValueResult = {
  value: string
  count: number
}

type QueryResult = {
  value: string
  count: string | number
}

export class GetTopValues extends Query<UserQuerySettings> {
  async run(
    params: GetTopValuesParams,
    _meta: EndpointMeta,
  ): Promise<EndpointResponse<TopValueResult[]>> {
    const { fictionDb } = this.settings
    const {
      table,
      column,
      limit = 50,
      minCount = 1,
      search = '',
      arrayColumn = false,
      where,
    } = params

    const db = fictionDb.db

    if (!db) {
      throw new Error('db not initialized')
    }

    const orgId = where?.orgId || params.orgId

    try {
      let query: Knex.QueryBuilder

      if (arrayColumn) {
        // For array columns, we need to select the unnested array elements
        query = db.table(table)
          .select(db.raw('v as value'))
          .select(db.raw('count(*) as count'))
          .where({ orgId })
          .crossJoin(db.raw('unnest(??) as v', [column]))
          .groupBy('v')

        // Add search filter if provided
        if (search) {
          query = query.andWhere('v', 'ilike', `%${search}%`)
        }
      }
      else {
        // For regular columns, just group by the column directly
        query = db.table(table)
          .select(`${column} as value`)
          .count('* as count')
          .where({ orgId })
          .groupBy(column)

        // Add search filter if provided
        if (search) {
          query = query.andWhere(column, 'ilike', `%${search}%`)
        }
      }

      // Add having clause for minimum count and sort
      const q = query
        .having(db.raw('count(*)'), '>=', minCount)
        .orderBy([
          { column: 'count', order: 'desc' },
          { column: arrayColumn ? 'v' : column, order: 'asc' },
        ])
        .limit(limit)

      const results = await q

      const rs = results as QueryResult[]

      const data = rs.map(r => ({
        value: r.value,
        count: Number(r.count),
      }))

      return {
        status: 'success',
        data,
      }
    }
    catch (error) {
      this.log.error('Error getting top values', { error, data: params })
      return {
        status: 'error',
        data: [],
      }
    }
  }
}
