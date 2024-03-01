import type { FactorPluginSettings } from '@factor/api'
import { FactorPlugin, emitEvent, safeDirname } from '@factor/api'

export class FactorNotify extends FactorPlugin<FactorPluginSettings> {
  constructor(settings: FactorPluginSettings) {
    super('notify', { root: safeDirname(import.meta.url), ...settings })
  }

  notifySuccess(message: string) {
    emitEvent('notify', { type: 'success', message })
  }
}
