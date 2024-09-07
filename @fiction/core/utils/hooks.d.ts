import type { Notification } from './notify'
import '@fiction/core/plugin-env/hooks'

declare module '@fiction/core/plugin-env/hooks' {
  interface FictionEnvHookDictionary {
    notify: { args: [Notification] }
  }
}
