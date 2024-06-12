import type { DataCompared, QueryParams } from '@fiction/analytics/types'
import type { Query, vue } from '@fiction/core'
import { FictionObject } from '@fiction/core'

const layoutModes = {
  list: { colSpan: 3, rowSpan: 1 },
  chart: { colSpan: 6, rowSpan: 1 },
  theater: { colSpan: 9, rowSpan: 2 },
  full: { colSpan: 12, rowSpan: 1 },
  fullShort: { colSpan: 12, rowSpan: 1 },
  mini: { colSpan: 3, rowSpan: 1 },
  panel: { colSpan: 3, rowSpan: 1 },
}

export type WidgetConfig<T extends Query = Query> = {
  key: string
  query?: T
  el: vue.Component
  hashId?: string
  noCache?: boolean
  title?: string
  description?: string
  layoutHandling?: keyof typeof layoutModes
  params?: QueryParams
  dimension?: string
}

export class Widget<T extends Query = Query> extends FictionObject<WidgetConfig<T>> {
  query = this.settings.query
  constructor(settings: WidgetConfig<T>) {
    super('Widget', settings)
  }
}
