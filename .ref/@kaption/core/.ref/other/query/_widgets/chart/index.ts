import { performance } from 'node:perf_hooks'
import { logger } from '@factor/api'
import type { Knex } from 'knex'
import { dateQuery, eventSessionDateQuery, qu, runQuery } from '../../base'
import type {
  AggregationResponse,
  ChartResponse,
  ComparedDataItem,
  QueryMapItem,
} from '../types'
import { formatDateTimeSelect } from '../helpers'

type QueryBuilder = Knex.QueryBuilder<any, any>

async function chartQuery(q: QueryMapItem): Promise<ChartResponse[]> {
  const p1 = performance.now()
  const { selector = [], table = 'event', interval, where, timeZone } = q

  let base: QueryBuilder
  let timeField: 'timestamp' | 'session_timestamp' = 'timestamp'

  if (table === 'eventSession') {
    base = eventSessionDateQuery(q)
    timeField = 'session_timestamp'
  }
  else {
    base = dateQuery(q)
  }

  if (where)
    base = base.where(where)

  // https://clickhouse.tech/docs/en/sql-reference/functions/date-time-functions/#formatdatetime
  const selectDate = formatDateTimeSelect({ interval, timeField, timeZone })
  const dbQuery = base
    .select(qu().raw(`${selectDate} as date, ${selector.join(', ')}`))
    .groupByRaw('date WITH ROLLUP')
    .orderBy('date')

  const { data: r } = await runQuery<ChartResponse[]>(dbQuery)

  // console.log("CHART", dbQuery.toString())
  logger.log({
    level: 'info',
    context: `chartQuery`,
    description: `time: ${performance.now() - p1}`,
  })

  return r
}

export async function chart(q: QueryMapItem): Promise<ComparedDataItem<ChartResponse | AggregationResponse>> {
  const qCompare = {
    ...q,
    timeEnd: q.compareEnd,
    timeStart: q.compareStart,
  }

  const qs: ChartResponse[][] = await Promise.all([
    chartQuery(q),
    chartQuery(qCompare),
  ])

  const [main, compare] = qs

  const mainTotals = main.shift()
  const compareTotals = compare.shift()

  return { main, mainTotals, compare, compareTotals }
}
