import '@fiction/core/plugin-env/hooks'
import type { Widget } from './dashboard/widget.js'

declare module '@fiction/core/plugin-env/hooks.js' {
  interface FictionEnvHookDictionary {
    widgetMap: { args: [Record<string, Widget[]>] }
  }
}
