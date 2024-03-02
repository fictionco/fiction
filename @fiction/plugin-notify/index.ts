import type { FactorPluginSettings } from '@fiction/core'
import { FactorPlugin, emitEvent, safeDirname } from '@fiction/core'

export class FactorNotify extends FactorPlugin<FactorPluginSettings> {
  constructor(settings: FactorPluginSettings) {
    super('notify', { root: safeDirname(import.meta.url), ...settings })
  }

  notifySuccess(message: string) {
    emitEvent('notify', { type: 'success', message })
  }
}
