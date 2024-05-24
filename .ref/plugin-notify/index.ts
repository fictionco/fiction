import type { FictionPluginSettings } from '@fiction/core'
import { FictionPlugin, emitEvent, envConfig, safeDirname } from '@fiction/core'

envConfig.register({ name: 'NOTIFY_PLUGIN_ROOT', onLoad: ({ fictionEnv }) => { fictionEnv.addUiRoot(safeDirname(import.meta.url)) } })

export class FictionNotify extends FictionPlugin<FictionPluginSettings> {
  constructor(settings: FictionPluginSettings) {
    super('notify', { root: safeDirname(import.meta.url), ...settings })
  }

  notifySuccess(message: string) {
    emitEvent('notify', { type: 'success', message })
  }
}
