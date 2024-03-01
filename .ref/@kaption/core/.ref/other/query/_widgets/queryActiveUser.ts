import dayjs from 'dayjs'
import { dateQuery, qu, runQuery } from '../base'
import type { ActiveUserResponse, ComparedDataItem, QueryMapItem } from './types'

export async function activeUsers(q: QueryMapItem): Promise<ComparedDataItem<ActiveUserResponse>> {
  const halfHourQuery = {
    ...q,
    timeEnd: dayjs(),
    timeStart: dayjs().subtract(30, 'minute'),
  }

  const fiveMinuteQuery = {
    ...q,
    timeEnd: dayjs(),
    timeStart: dayjs().subtract(5, 'minute'),
  }

  const selectDate = `formatDateTime(toStartOfMinute(timestamp), '%FT%T.000Z', 'UTC')`
  const select = [
    `${selectDate} as date`,
    `uniq(clientId) as uniqueVisitors`,
    `countIf(eventName='view') as views`,
    `countIf(eventType='micro') as micro`,
    `countIf(eventType='macro') as macro`,
    `sum(value) as value`,
  ]

  const chartQuery = dateQuery(halfHourQuery)
    .select(qu().raw(select.join(',')))
    .groupByRaw('date WITH ROLLUP')
    .orderBy('date')

  const activeQuery = dateQuery(fiveMinuteQuery)
    .select(qu().raw(select.join(',')))
    .groupByRaw('date WITH ROLLUP')
    .orderBy('date')

  const [{ data: r }, { data: tTotal }] = await Promise.all([
    runQuery<ActiveUserResponse[]>(chartQuery),
    runQuery<ActiveUserResponse[]>(activeQuery),
  ])

  const main = r
  const mainTotals = main.shift()

  const compare = tTotal
  const compareTotals = compare.shift()

  return { main, mainTotals, compare, compareTotals }
}
