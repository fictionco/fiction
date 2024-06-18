import type { QueryParams } from '@fiction/analytics/types'
import type { Query } from '@fiction/core'
import { FictionObject, vue } from '@fiction/core'

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
  params?: QueryParams
  el: vue.Component
  title?: string
  description?: string
  layoutHandling?: keyof typeof layoutModes
  location?: 'primary' | 'secondary'
  valueKey?: T['dataKeys'] extends readonly string[] ? T['dataKeys'][number] : undefined
}

export class Widget<T extends Query = Query> extends FictionObject<WidgetConfig<T>> {
  query = this.settings.query
  errorMessage = vue.ref('')
  loading = vue.ref(false)
  hashId = vue.ref('')
  key = this.settings.key
  constructor(settings: WidgetConfig<T>) {
    super('Widget', settings)
  }
}
