import '@fiction/core/plugin-env/hooks'
import type { FictionDbTable } from './objects.js'
import type { FictionDb } from './index.js'

declare module '@fiction/core/plugin-env/hooks.js' {
  interface FictionEnvHookDictionary {
    dbOnConnected: { args: [FictionDb] }
    dbOnTables: { args: [FictionDbTable[]] }
  }
}
