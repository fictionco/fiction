import type { Query } from '@fiction/core'
import type { FictionAdmin } from '..'
import type { AnalyticsWidget, Widget } from './widget'
import { createEndpointRequests, log } from '@fiction/core'

const logger = log.contextLogger('widgets')

function isAnalyticsWidget(widget: Widget): widget is AnalyticsWidget {
  return 'query' in widget && widget.query !== undefined
}

export function getWidgetMap(args: { fictionAdmin: FictionAdmin }): Record<string, Widget[]> {
  const { fictionAdmin } = args

  const widgetMapRaw = fictionAdmin.widgetMapRaw.value
  const widgetRegister = fictionAdmin.widgetRegister.value
  const widgetMap: Record<string, Widget[]> = {}
  for (const [widgetArea, widgetKeys] of Object.entries(widgetMapRaw)) {
    const sortedWidgetKeys = widgetKeys.sort((a, b) => (a.priority ?? 100) - (b.priority ?? 100))
    widgetMap[widgetArea] = sortedWidgetKeys.map((entry) => {
      const w = widgetRegister.find(widget => widget.key === entry.key)
      if (!w) {
        fictionAdmin.log.warn(`Widget not found for key: ${entry.key}`)
      }

      return w
    }).filter(Boolean) as Widget[]
  }

  return widgetMap
}

export async function runWidgetRequests(args: { widgets?: Widget[], fictionAdmin: FictionAdmin }) {
  const { widgets, fictionAdmin } = args

  if (!widgets) {
    return
  }
  const reqs = fictionAdmin.widgetRequests
  if (!reqs) {
    throw new Error('widgetRequests not initialized')
  }

  const q = widgets.reduce((acc, widget) => {
    if (isAnalyticsWidget(widget) && widget.query?.key) {
      acc[widget.query.key] = widget.query
    }
    return acc
  }, {} as Record<string, Query>)

  const promises = Object.entries(q).filter(([_k, q]) => q.getParams).map(async ([key, query]) => {
    const endpoint = reqs[key]
    const params = query.getParams?.() || {}

    // const refinedParams = refineParams(params)
    const r = await endpoint.projectRequest(params)

    if (!r) {
      const message = `Failed to fetch data for widget ${key}`
      logger.error(message)
      throw new Error(message)
    }

    const data = r.data

    if (r.status !== 'success' || !data) {
      const message = `${r.status}: Failed to fetch data for widget ${key} (${r.message})`
      logger.error(message)
      throw new Error(message)
    }

    if (query.dataRef)
      query.dataRef.value = data
  })

  await Promise.all(promises)
}

function getWidgetQueries(args: { fictionAdmin: FictionAdmin }): Record<string, Query> {
  const { fictionAdmin } = args

  const widgetMap = getWidgetMap({ fictionAdmin })
  const entries = Object.entries(widgetMap)
  return entries.reduce((acc, [_key, widgets]) => {
    widgets.forEach((widget) => {
      if (isAnalyticsWidget(widget) && widget.query?.key) {
        acc[widget.query.key] = widget.query
      }
    })

    return acc
  }, {} as Record<string, Query>)
}

export function createWidgetEndpoints(args: { fictionAdmin: FictionAdmin }) {
  const queries = getWidgetQueries(args)
  const { fictionServer, fictionUser } = args.fictionAdmin.settings
  return createEndpointRequests({ queries, basePath: '/widgets', fictionServer, fictionUser })
}
