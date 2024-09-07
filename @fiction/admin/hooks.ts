import type { Widget } from './dashboard/widget.js'
import '@fiction/core/plugin-env/hooks'

declare module '@fiction/core/plugin-env/hooks.js' {
  interface FictionEnvHookDictionary {
    widgetMap: { args: [Record<string, Widget[]>] }
  }
}
