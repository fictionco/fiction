import { getCache, nLog } from '@kaption/utils'
import dayjs from 'dayjs'
import type {
  ComparedDataItem,
  QueryFormat,
  QueryMapItem,
  ResponseData,
} from './types'
import { chart } from './chart'
import { aggregation } from './aggregation'
import { list } from './list'
import { clickList } from './heatmap'
import { listReplay } from './replay'
import { dimensionChart, dimensionTable } from './dimension'
import { activeUsers } from './queryActiveUser'
import * as securityQueries from './security/server'
import * as technicalQueries from './technical/server'

type MQuery = {
  [key in QueryFormat]?: (q: QueryMapItem<unknown>) => Promise<ComparedDataItem>
}
export const mappedQuery: MQuery = {
  activeUsers,
  dimensionTable,
  dimensionChart,
  aggregation,
  chart,
  list,
  clickList,
  listReplay,
  ...securityQueries,
  ...technicalQueries,
}

export async function runMapQuery(q: QueryMapItem): Promise<QueryMapItem<ResponseData>> {
  const cache = await getCache()

  if (!q.queryFormat && !q.query)
    return { ...q, data: { main: [] } }

  if (!q.realtime && !q.noCache) {
    const cachedQuery: string | null = await cache.get(`queryCache:${q.hash}`)

    if (cachedQuery)
      return JSON.parse(cachedQuery) as QueryMapItem<ResponseData>
  }
  else if (q.realtime) {
    q.interval = 'minute'
    q.timeEnd = dayjs()
    q.timeStart = dayjs().subtract(30, 'minute')
  }

  let data: ResponseData | undefined = { main: [] }

  if (q.query) {
    data = await q.query(q)
  }
  else if (q.queryFormat) {
    const mapped = mappedQuery[q.queryFormat]
    if (mapped)
      data = await mapped(q)
    else
      nLog('error', `missing query in map ${q.queryFormat}`)
  }

  const result = { ...q, data }

  await cache.set(`queryCache:${q.hash}`, JSON.stringify(result), 'EX', 60 * 20) // expires in 20 minutes

  return result
}
