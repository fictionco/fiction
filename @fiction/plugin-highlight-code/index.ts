import type { FictionPluginSettings } from '@fiction/core'
import { FictionPlugin } from '@fiction/core'

export class FictionHighlightCode extends FictionPlugin<FictionPluginSettings> {
  constructor(settings: FictionPluginSettings) {
    super('highlightCode', settings)
  }
}
