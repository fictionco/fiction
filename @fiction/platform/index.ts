import type { FictionEnv, FictionPluginSettings } from '@fiction/core'
import { FictionPlugin } from '@fiction/core'

export * from '@fiction/core'
export * from '@fiction/site'
export * from '@fiction/cards'
export * from '@fiction/ui'

export type SitesPluginSettings = {
  fictionEnv: FictionEnv
} & FictionPluginSettings

export class FictionPlatform extends FictionPlugin<SitesPluginSettings> {}
