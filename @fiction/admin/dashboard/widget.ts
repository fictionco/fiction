import type { QueryParams } from '@fiction/analytics/types'
import type { Query } from '@fiction/core'
import { FictionObject, vue } from '@fiction/core'

export const layoutModes = {
  list: { colSpan: 3, rowSpan: 1 },
  chart: { colSpan: 6, rowSpan: 1 },
  theater: { colSpan: 9, rowSpan: 2 },
  full: { colSpan: 12, rowSpan: 1 },
  fullShort: { colSpan: 12, rowSpan: 1 },
  mini: { colSpan: 3, rowSpan: 1 },
  panel: { colSpan: 3, rowSpan: 1 },
}

export type WidgetConfig = {
  key: string
  el: vue.Component
  title?: string
  description?: string
  layoutHandling?: keyof typeof layoutModes
  location?: 'primary' | 'secondary'
}

export class Widget<T extends WidgetConfig = WidgetConfig> extends FictionObject<T> {
  key = this.settings.key
  errorMessage = vue.ref('')
  loading = vue.ref(false)
  constructor(settings: T) {
    super('Widget', settings)
  }
}

export type AnalyticsWidgetConfig<T extends Query = Query> = {
  query?: T
  params?: QueryParams
  valueKey?: T['dataKeys'] extends readonly string[] ? T['dataKeys'][number] : undefined
} & WidgetConfig

export class AnalyticsWidget<T extends Query = Query> extends Widget<AnalyticsWidgetConfig<T>> {
  query = this.settings.query

  hashId = vue.ref('')
  constructor(settings: AnalyticsWidgetConfig<T>) {
    super(settings)
  }
}
