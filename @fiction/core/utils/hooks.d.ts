import '@fiction/core/plugin-env/hooks'
import type { Notification } from './notify'

declare module '@fiction/core/plugin-env/hooks' {
  interface FictionEnvHookDictionary {
    notify: { args: [Notification] }
  }
}
