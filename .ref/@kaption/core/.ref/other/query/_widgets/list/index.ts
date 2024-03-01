import { performance } from 'node:perf_hooks'
import { nLog } from '@kaption/utils'
import type { Knex } from 'knex'
import { dateQuery, qu, runQuery } from '../../base'
import type { AnalyticsDataPoint, ComparedDataItem, QueryMapItem } from '../types'

type QueryBuilder = Knex.QueryBuilder<any, any>

export async function list(q: QueryMapItem): Promise<ComparedDataItem<AnalyticsDataPoint>> {
  const p1 = performance.now()
  const { selector = [], limit = 100 } = q

  const base: QueryBuilder = dateQuery(q)

  const select = []

  if (selector.length > 0)
    select.push(...selector)

  const dbQuery = base
    .select(qu().raw(select.join(',')))
    .where({ eventName: 'init' })
    .limit(limit)

  const { data: r } = await runQuery<AnalyticsDataPoint[]>(dbQuery)
  nLog('info', `list query ${performance.now() - p1}`)
  return { main: r }
}
