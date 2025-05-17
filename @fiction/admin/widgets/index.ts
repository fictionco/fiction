import type { Query, vue } from '@fiction/core'
import type { Card } from '@fiction/site'
import type { FictionAdmin } from '..'

export type WidgetConfig = {
  el: vue.Component
  title?: string
  description?: string
  priority?: number
  query?: Query
  valueKey?: string
}

export type WidgetLoader = { key: string, loader: (args: { fictionAdmin: FictionAdmin, card: Card }) => WidgetConfig | Promise<WidgetConfig> }
