import type { FactorUser, Query } from '@factor/api'
import { fastHash, omit, vue } from '@factor/api'

import type {
  AggregationFormat,
  QueryParams,
  RequestDataFilter,
  ValueFormat,
} from './types'

export const widgetCategories = [
  'traffic',
  'conversion',
  'behavior',
  'events',
  'technical',
  'general',
  'core',
] as const

type WidgetCategory = (typeof widgetCategories)[number]

export type WidgetConfig = {
  queryHandler?: Query
  el: () => Promise<vue.Component>
  widgetKey: string
  hashId?: string
  ui?: WidgetOptionUi
  noCache?: boolean
  title?: string
  description?: string
  layoutHandling?: LayoutModes
  rowSpan?: number
  colSpan?: number
  params?: QueryParams
  dimension?: string
  category?: WidgetCategory[]
}

export type WidgetOptions = Omit<WidgetConfig, 'queryHandler'> & {
  queryHandler?: ((w: Widget) => Query) | Query
}

export type PortableWidget = Omit<WidgetConfig, 'el' | 'queryHandler'>

type LayoutModes =
  | 'list'
  | 'chart'
  | 'theater'
  | 'full'
  | 'fullShort'
  | 'mini'
  | 'panel'

export interface WidgetOptionUi {
  changeFormat?: 'inverse' | 'standard'
  valueFormat?: ValueFormat
  aggregationFormat?: AggregationFormat
  icon?: string
  noCustomDashboard?: boolean
}

export class Widget {
  ui: WidgetOptionUi
  queryHandler?: Query
  widgetKey: string
  isRealtime?: boolean
  noCache?: boolean
  title: vue.Ref<string> = vue.ref('')
  description: vue.Ref<string> = vue.ref('')
  rowSpan: vue.Ref<number> = vue.ref(1)
  colSpan: vue.Ref<number> = vue.ref(3)
  layoutHandling: vue.Ref<LayoutModes> = vue.ref('list')
  el: () => Promise<vue.Component>
  dimension?: string
  filters?: RequestDataFilter[]
  params?: QueryParams
  category: WidgetCategory[]
  constructor(options: WidgetOptions) {
    const {
      queryHandler,
      layoutHandling = 'list',
      rowSpan,
      colSpan,
      el,
    } = options

    this.widgetKey = options.widgetKey
    this.layoutHandling.value = layoutHandling
    this.category = options.category || ['core']

    if (this.layoutHandling.value === 'full') {
      this.rowSpan.value = 1
      this.colSpan.value = 12
    }
    else if (this.layoutHandling.value === 'fullShort') {
      this.rowSpan.value = 1
      this.colSpan.value = 12
    }
    else if (this.layoutHandling.value === 'theater') {
      this.rowSpan.value = 2
      this.colSpan.value = 9
    }
    else if (this.layoutHandling.value === 'chart') {
      this.rowSpan.value = 1
      this.colSpan.value = 6
    }
    else if (this.layoutHandling.value === 'mini') {
      this.rowSpan.value = 1
      this.colSpan.value = 3
    }

    if (rowSpan)
      this.rowSpan.value = rowSpan
    if (colSpan)
      this.colSpan.value = colSpan

    this.ui = options.ui || {}
    this.title.value = options.title || ''
    this.description.value = options.description || ''
    // this.isRealtime = options.isRealtime || false
    this.params = options.params || {}
    this.el = el

    if (typeof queryHandler === 'function')
      this.queryHandler = queryHandler(this)
    else
      this.queryHandler = queryHandler

    if (options.dimension)
      this.dimension = options.dimension
  }

  public toOptions(): WidgetConfig {
    const layoutHandling = this.layoutHandling.value
    const out: WidgetConfig = {
      ui: this.ui,
      widgetKey: this.widgetKey,
      title: this.title.value,
      description: this.description.value,
      layoutHandling,
      // isRealtime: this.isRealtime,
      noCache: this.noCache,
      dimension: this.dimension,
      el: this.el,
      queryHandler: this.queryHandler,
      params: this.params,
    }

    if (!layoutHandling) {
      out.colSpan = this.colSpan.value
      out.rowSpan = this.rowSpan.value
    }

    return out
  }

  /**
   * Gets config for the widget for app
   * Removes component since it can't be reactive
   */
  public toPortable(): PortableWidget {
    const opts = this.toOptions() as Record<string, unknown>
    delete opts.el
    delete opts.queryHandler
    return opts as PortableWidget
  }

  toJSON(): Record<string, unknown> {
    const inst = omit(this.toOptions(), 'queryHandler', 'el')

    return inst
  }
}

type ClientWidgetSettings = {
  factorUser: FactorUser
} & WidgetConfig
export class ClientWidget<T = unknown> extends Widget {
  loading: vue.Ref<boolean> = vue.ref(false)
  data: vue.Ref<T | undefined> = vue.ref()
  errorMessage: vue.Ref<string | undefined> = vue.ref()
  factorUser: FactorUser

  constructor(options: ClientWidgetSettings) {
    super(options)
    this.factorUser = options.factorUser
  }

  hashId = vue.computed(() => {
    const hashId = fastHash({
      widgetKey: this.widgetKey,
      organizationId: this.factorUser.activeOrganizationId.value,
    })
    return hashId
  })

  public toOptions(): WidgetConfig {
    const opts = super.toOptions()
    return { ...opts, hashId: this.hashId.value }
  }

  public toPortable(): PortableWidget {
    const opts = super.toPortable()
    return { ...opts, hashId: this.hashId.value }
  }

  toJSON() {
    return this.toOptions()
  }
}
