import { dateQuery, qu, runQuery } from '../../base'
import type { AggregationResponse, ComparedDataItem, QueryMapItem } from '../types'

export async function errorAggregation(q: QueryMapItem): Promise<ComparedDataItem<AggregationResponse>> {
  const { limit = 12 } = q

  const select = [
    `count(*) as count`,
    `pathname as name`,
    `groupUniqArray(3)([label, trace]) as list`,
  ]

  const dbQuery = dateQuery(q)
    .select(qu().raw(select.join(',')))
    .groupByRaw('pathname WITH ROLLUP')
    .where({ eventName: 'error' })
    .whereNot({ label: '' })
    .orderBy('count', 'desc')
    .limit(limit)

  // console.log("Q", dbQuery.toString())

  const { data: r } = await runQuery<
  (AggregationResponse & { list: string[][] })[]
    >(dbQuery,
    )

  const main: AggregationResponse[] = r.map((res) => {
    const list = res?.list?.map(([_label, trace]) => {
      return [_label, trace ? JSON.parse(trace) : '']
        .filter(_ => _)
        .join(', ') as string
    })
    return { ...res, list }
  })

  const mainTotals = main.shift()

  return { main, mainTotals }
}
