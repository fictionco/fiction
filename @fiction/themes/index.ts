import type { FictionCards } from '@fiction/cards'
import type { FictionEnv, FictionPluginSettings } from '@fiction/core'
import type { FictionSites } from '@fiction/site'
import { FictionPlugin, safeDirname } from '@fiction/core'

export type FictionThemesSettings = {
  fictionEnv: FictionEnv
  fictionSites: FictionSites
  fictionCards: FictionCards
} & FictionPluginSettings

export class FictionThemes extends FictionPlugin<FictionThemesSettings> {
  constructor(settings: FictionThemesSettings) {
    const s = { ...settings, root: safeDirname(import.meta.url) }

    super('FictionThemes', s)
  }
}
