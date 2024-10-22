import type { EndpointResponse, ResponseStatus, ValidationReason } from '@fiction/core'
import type { Knex } from 'knex'
import type { FictionDb } from './index.js'
import { Query } from '../query.js'
import { toSlug } from '../utils/index.js'

type QuerySettings = { fictionDb: FictionDb }

type UsernameResult = { available: ResponseStatus, reason: ValidationReason }

export type CheckColumnValue = { name: string, value: string, minLength?: number, allowReserved?: boolean, allowAnyValue?: boolean }

type CheckUsernameParams = { table: string, columns: CheckColumnValue[] }

export class CheckUsername extends Query<QuerySettings> {
  isUrlFriendly(username: string): boolean {
    return /^[\w-]+$/.test(username)
  }

  async getWords(): Promise<Set<string>> {
    const { words } = await import('../utils/lib/words.js')
    return new Set(words)
  }

  async run(
    params: CheckUsernameParams,
  ): Promise<EndpointResponse<UsernameResult>> {
    const wordsSet = await this.getWords()
    const { fictionDb } = this.settings
    const { table, columns } = params

    let result: UsernameResult = { available: 'loading', reason: 'loading' }

    try {
      for (const col of columns) {
        const { value, minLength = 3, allowReserved = false, allowAnyValue = false } = col
        const prepped = allowAnyValue ? value.trim() : toSlug(value.trim())

        if (prepped.length < minLength) {
          result = { available: 'fail', reason: 'short' }
          break
        }
        else if (!allowAnyValue && !this.isUrlFriendly(prepped)) {
          result = { available: 'fail', reason: 'invalid' }
          break
        }
        else if (!allowReserved && wordsSet.has(prepped)) {
          result = { available: 'fail', reason: 'reserved' }
          break
        }

        const r = await fictionDb.db?.table(table).where((builder) => {
          columns.forEach(({ name, value }) => {
            const v = allowAnyValue ? value.trim() : toSlug(value.trim())
            void builder.andWhere(name, v)
          })
        }).first()

        if (r) {
          result = { available: 'fail', reason: 'taken' }
          break
        }
      }

      if (result.available === 'loading') { // All checks passed
        result = { available: 'success', reason: 'success' }
      }

      return { status: 'success', data: result }
    }
    catch (error) {
      this.log.error('Error checking username', { error, data: params })
      result = { available: 'error', reason: 'error' }
      return { status: 'error', data: result }
    }
  }
}

type GetTopValuesParams = {
  table: string
  column: string
  limit?: number
  minCount?: number
  search?: string
  arrayColumn?: boolean
  orgId: string
}

type TopValueResult = {
  value: string
  count: number
}

type QueryResult = {
  value: string
  count: string | number
}

export class GetTopValues extends Query<QuerySettings> {
  async run(
    params: GetTopValuesParams,
  ): Promise<EndpointResponse<TopValueResult[]>> {
    const { fictionDb } = this.settings
    const {
      table,
      column,
      limit = 50,
      minCount = 1,
      search = '',
      arrayColumn = false,
      orgId,
    } = params

    const db = fictionDb.db

    if (!db) {
      throw new Error('db not initialized')
    }

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
      const results = await query
        .having(db.raw('count(*)'), '>=', minCount)
        .orderBy([
          { column: 'count', order: 'desc' },
          { column: arrayColumn ? 'v' : column, order: 'asc' },
        ])
        .limit(limit)

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
