import '@fiction/core/plugin-env/hooks'
import type { TableCardConfig } from '@fiction/site/tables.js'
import type { templates } from './index.js'

declare module '@fiction/core/plugin-env/hooks.js' {
  interface FictionEnvHookDictionary {
    adminPages: { args: [TableCardConfig[], { templates: typeof templates }] }
  }
}
