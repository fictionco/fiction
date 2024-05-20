import '@fiction/core/plugin-env/hooks'
import type { CardConfigPortable } from './tables'

declare module '@fiction/core/plugin-env/hooks' {
  interface FictionEnvHookDictionary {
    setPages: { args: [CardConfigPortable[] ] }
  }
}
