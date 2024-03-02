import type { FictionPluginSettings } from '@fiction/core'
import { FictionPlugin, emitEvent, safeDirname } from '@fiction/core'

export class FictionNotify extends FictionPlugin<FictionPluginSettings> {
  constructor(settings: FictionPluginSettings) {
    super('notify', { root: safeDirname(import.meta.url), ...settings })
  }

  notifySuccess(message: string) {
    emitEvent('notify', { type: 'success', message })
  }
}
