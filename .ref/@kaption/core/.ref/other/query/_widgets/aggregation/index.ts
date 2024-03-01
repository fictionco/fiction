import { _stop } from '@kaption/utils'
import type { Knex } from 'knex'
import { dateQuery, eventSessionDateQuery, qu, runQuery } from '../../base'
import type { AggregationResponse, ComparedDataItem, QueryMapItem } from '../types'

/**
 * Standard format for an aggregation listing
 */
async function aggregationQuery(q: QueryMapItem): Promise<AggregationResponse[]> {
  const { groupBy, selector = [], table = 'event', limit = 12, where } = q

  let { countOn = 'uniq(clientId)' } = q

  if (!groupBy)
    throw _stop({ message: 'aggregation: no groupBy' })

  let base: Knex.QueryBuilder
  if (table === 'eventSession') {
    base = eventSessionDateQuery(q)
    countOn = countOn.replace('clientId', 'session_clientId')
  }
  else {
    base = dateQuery(q)
  }

  base = base.whereNot({ [groupBy]: '' })

  if (where)
    base = base.where(where)

  const select = [`${countOn} as count`, `${groupBy} as name`]

  if (selector.length > 0)
    select.push(...selector)

  const dbQuery = base
    .select(qu().raw(select.join(',')))
    .groupByRaw(`${groupBy} with ROLLUP`)
    .orderBy('count', 'desc')
    .limit(limit)

  const { data: r } = await runQuery<AggregationResponse[]>(dbQuery)

  return r
}

export async function aggregation(q: QueryMapItem): Promise<ComparedDataItem<AggregationResponse>> {
  const main = await aggregationQuery(q)

  const mainTotals = main.shift()

  return { main, mainTotals }
}
