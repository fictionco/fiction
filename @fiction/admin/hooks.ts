import '@fiction/core/plugin-env/hooks'
import type { TableCardConfig } from '@fiction/site/tables.js'
import type { templates } from './theme/index.js'
import type { WidgetMap } from './types'

declare module '@fiction/core/plugin-env/hooks.js' {
  interface FictionEnvHookDictionary {
    adminPages: { args: [TableCardConfig[], { templates: typeof templates }] }
    widgetMap: { args: [WidgetMap] }
  }
}
