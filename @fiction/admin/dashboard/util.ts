import type { AnalyticsQuery } from '@fiction/analytics/query'
import { createEndpointRequests, log } from '@fiction/core'
import { refineParams } from '@fiction/analytics/utils/refine'
import type { FictionAdmin, WidgetMap } from '..'
import type { Widget } from './widget'

const logger = log.contextLogger('widgets')

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
    if (widget.query) {
      acc[widget.query.key] = widget.query
    }
    return acc
  }, {} as Record<string, AnalyticsQuery>)

  const promises = Object.entries(q).map(async ([key, query]) => {
    const endpoint = reqs[key]
    const params = query.queryParams.value
    const refinedParams = refineParams(params)
    const r = await endpoint.projectRequest(refinedParams)

    const data = r.data

    if (r.status !== 'success' || !data) {
      const message = `${r.status}: Failed to fetch data for widget ${key} (${r.message})`
      logger.error(message)
      throw new Error(message)
    }

    query.data.value = data
  })

  await Promise.all(promises)
}

function getWidgetQueries(args: { widgetMap: WidgetMap }): Record<string, AnalyticsQuery> {
  const { widgetMap } = args
  const entries = Object.entries(widgetMap)
  return entries.reduce((acc, [_key, widgets]) => {
    widgets.forEach((widget) => {
      if (widget.query) {
        acc[widget.query.key] = widget.query
      }
    })

    return acc
  }, {} as Record<string, AnalyticsQuery>)
}

export function createWidgetEndpoints(args: { widgetMap: WidgetMap, fictionAdmin: FictionAdmin }) {
  const queries = getWidgetQueries(args)
  const { fictionServer, fictionUser } = args.fictionAdmin.settings
  return createEndpointRequests({ queries, basePath: '/widgets', fictionServer, fictionUser })
}
