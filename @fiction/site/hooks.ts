import '@fiction/core/plugin-env/hooks'
import type { CardConfigPortable } from './tables.js'
import type { Site } from './site.js'

declare module '@fiction/core/plugin-env/hooks.js' {
  interface FictionEnvHookDictionary {
    setPages: { args: [CardConfigPortable[], Site | undefined] }
  }
}
