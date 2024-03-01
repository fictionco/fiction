import { performance } from 'node:perf_hooks'
import { nLog } from '@kaption/utils'
import { dateQuery, runQuery } from '../../base'
import type { AnalyticsDataPoint, ComparedDataItem, QueryMapItem } from '../types'

export async function clickList(q: QueryMapItem): Promise<ComparedDataItem<AnalyticsDataPoint>> {
  const p1 = performance.now()

  let main: AnalyticsDataPoint[] = []
  let mainTotals: AnalyticsDataPoint | undefined

  // Don't run heatmap if no pathname filter is active
  if (q.filters?.find(_ => _.name === 'pathname')) {
    const base = dateQuery(q)
      .select('*')
      .where({ eventName: 'click' })
      .orderBy('timestamp', 'desc')
      .limit(3000)

    const r = await runQuery<AnalyticsDataPoint[]>(base)

    main = r.data

    mainTotals = main.shift()

    nLog('info', `heatmap query ${performance.now() - p1}`)
  }

  let title = `Heatmap`

  if (main.length > 0)
    title += ` - Showing ${main.length} Saved Clicks`

  return { main, mainTotals, title }
}
