import { _stop } from '@kaption/utils'
import type { Knex } from 'knex'
import { dateQuery, qu, refineDataRequest, runQuery } from '../base'
import type { AggregationResponse } from '../types'
import type { EPAction } from '../serverTypes'

type QueryBuilder = Knex.QueryBuilder<any, any>

export const searchDimension: EPAction<'searchDimension'> = async (args) => {
  const refined = refineDataRequest(args)
  const { limit = 20, dimension, search } = refined

  if (!dimension)
    throw _stop({ message: 'no dimension field provided' })
  const base: QueryBuilder = dateQuery(refined)

  const select = [
    qu().raw(`uniq(*) as count`),
    qu().raw(`?? as name`, [dimension as string]),
  ]

  const dbQuery = base
    .select(select)
    .groupBy(dimension)
    .orderBy('count', 'desc')
    .whereNot({ [dimension]: '' })
    .limit(limit)

  if (search)
    dbQuery.whereRaw(qu().raw(`?? like '%?%'`, [dimension as string, search]))

  const { data: r } = await runQuery<AggregationResponse[]>(dbQuery)

  return { status: 'success', data: r }
}
