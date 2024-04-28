import type { FictionPluginSettings } from '@fiction/core'
import { FictionPlugin, safeDirname } from '@fiction/core'

 type FictionEditorSettings = FictionPluginSettings
export class FictionEditor extends FictionPlugin<FictionEditorSettings> {
  constructor(settings: FictionEditorSettings) {
    super('FictionEditor', { ...settings, root: safeDirname(import.meta.url) })
  }
}
