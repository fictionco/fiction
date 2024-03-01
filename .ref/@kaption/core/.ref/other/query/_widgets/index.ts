import { fastHash } from '@kaption/browser-utils/shared'
import { nLog } from '@kaption/utils'
import type { EndpointResponse } from '@kaption/types'
import lodash from 'lodash'
import deepMerge from 'deepmerge'
import { refineDataRequest } from '../base'
import type { EPAction } from '../serverTypes'
import type { WidgetDataMap } from './map'
import { widgetDataMap } from './map'
import type {
  ComparedDataItem,
  FinalQueryWidgetConfig,
  QueryMap,
  QueryMapItem,
  RequestFullAnalyticsRefined,
} from './types'
import { runMapQuery } from './query'

export * from './types'

function getQueryHash(args: RequestFullAnalyticsRefined, q: FinalQueryWidgetConfig): string {
  const env = process.env.NODE_ENV ?? 'production'

  const merged = deepMerge(args, q)

  const hashItems = lodash.pick(merged, [
    'queryFormat',
    'filters',
    'timeStartIso',
    'timeEndIso',
    'dimension',
    'compare',
    'interval',
    'mode',
    'projectId',
    'page',
    'groupBy',
    'where',
    'options',
  ])

  return fastHash({ ...hashItems, env })
}

export async function buildQueries(args: RequestFullAnalyticsRefined): Promise<QueryMap> {
  const { layout, mode, ...restQuery } = args

  let allWidgets: FinalQueryWidgetConfig[] = []

  layout?.forEach((_) => {
    const current = widgetDataMap[_.widget]

    if (!current)
      nLog('error', `widget is missing in map: ${_.widget}`)

    const widgetData = { ..._, ...current }

    // don't make queries for realtime that aren't needed
    if (mode === 'realtime' && !widgetData.realtime)
      return

    allWidgets.push(widgetData)

    // require other widgets, simpler way?
    const req = (widgetData.requires || []) as (keyof WidgetDataMap)[]

    req.forEach((r) => {
      if (!layout.some(_ => _.widget === r))
        allWidgets.push(widgetDataMap[r])
    })
  })

  allWidgets = allWidgets.map((_) => {
    const hash = getQueryHash(args, _)

    return { ..._, hash }
  })

  const queries: QueryMap = {}
  allWidgets.forEach((w) => {
    if (!w.hash)
      return
    delete w.widget
    const existing = queries[w.hash]
    const existingWidgetIds = existing?.widgetIds ?? []
    const existingSelectors = existing?.selector ?? []
    const { selector = [], widgetId = '', ...restWidget } = w
    const widgetIds = [...existingWidgetIds, widgetId].filter(_ => _)

    queries[w.hash] = {
      ...restQuery,
      ...existing,
      ...restWidget,
      widgetIds,
      selector: [...existingSelectors, ...selector],
    }
  })

  nLog(
    'request',
    `${allWidgets?.length} widget requests / ${
      Object.keys(queries).length
    } queries`,
  )

  return queries
}

async function getResult(q: QueryMapItem<unknown>): Promise<EndpointResponse<QueryMapItem<ComparedDataItem>[]>> {
  try {
    const r = await runMapQuery(q)

    return { status: 'success', data: [r] }
  }
  catch (error: any) {
    nLog('error', `engine error @${q.queryFormat}`, error)
    nLog('error', `engine params @${q.queryFormat}`, q)

    const data = error.data
    return {
      status: 'error',
      message: error.expose ? error.message : '',
      code: error.code,
      data: [{ ...q, data }],
    }
  }
}

export const widgets: EPAction<'widgets'> = async (args) => {
  // If no layout, send empty response
  const { layout } = args
  if (!layout || layout.length === 0)
    return { status: 'success', data: undefined }

  const refined = refineDataRequest(args)

  const queries = await buildQueries(refined)

  const callback = args.cb

  if (callback) {
    // detach async
    Object.values(queries).forEach(async (q) => {
      const r = await getResult(q)

      callback(r)
    })
  }

  return { status: 'success' }
}
