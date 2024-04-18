import '@fiction/core/plugin-env/hooks'
import type { TableCardConfig } from '@fiction/site/tables'
import type { templates } from '.'

declare module '@fiction/core/plugin-env/hooks' {
  interface FictionEnvHookDictionary {
    adminPages: { args: [TableCardConfig[], { templates: typeof templates }] }
  }
}
