import type { FictionDb } from './index.js'
import type { FictionDbTable } from './objects.js'
import '@fiction/core/plugin-env/hooks'

declare module '@fiction/core/plugin-env/hooks.js' {
  interface FictionEnvHookDictionary {
    dbOnConnected: { args: [FictionDb] }
    dbOnTables: { args: [FictionDbTable[]] }
  }
}
