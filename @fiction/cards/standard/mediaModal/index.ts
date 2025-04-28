import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site/card.js'

const templateId = 'cardModalMediaV1'

export const template = cardTemplate({
  templateId,
  title: 'Media Modal',
  description: 'Dynamic modal popup system for videos, audio, and external content. Automatically handles various content types like YouTube, Vimeo, Spotify, and more. Perfect for showcasing media content without leaving your page.',
  subTitle: 'Create engaging media experiences with automatic content detection',
  icon: 'i-tabler-player-play',
  colorTheme: 'pink',
  isPublic: true,
  el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),
  isDetached: () => true,
  isEffect: true,
  async getConfig(args) {
    const { getConfig } = await import('./config')
    return getConfig({ ...args, templateId })
  },
})

export type { UserConfig } from './config'
