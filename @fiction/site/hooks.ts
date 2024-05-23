import '@fiction/core/plugin-env/hooks'
import type { CardConfigPortable } from './tables'
import type { Site } from './site'
import type { setPages } from './utils/page'

declare module '@fiction/core/plugin-env/hooks' {
  interface FictionEnvHookDictionary {
    setPages: { args: [CardConfigPortable[], Site | undefined] }
  }
}
