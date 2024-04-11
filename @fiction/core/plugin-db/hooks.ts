import '@fiction/core/plugin-env/hooks'
import type { FictionDbTable } from './objects'
import type { FictionDb } from '.'

declare module '@fiction/core/plugin-env/hooks' {
  interface FictionEnvHookDictionary {
    dbOnConnected: { args: [FictionDb] }
    dbOnTables: { args: [FictionDbTable[]] }
  }
}
