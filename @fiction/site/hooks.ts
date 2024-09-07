import type { Site } from './site.js'
import type { CardConfigPortable } from './tables.js'
import '@fiction/core/plugin-env/hooks'

declare module '@fiction/core/plugin-env/hooks.js' {
  interface FictionEnvHookDictionary {
    setPages: { args: [CardConfigPortable[], Site | undefined] }
  }
}
