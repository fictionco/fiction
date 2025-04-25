import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site/card.js'

const templateId = 'cardLogosV1'

export const template = cardTemplate({
  templateId,
  category: ['marketing'],
  title: 'Logo Showcase',
  description: 'Build trust and credibility by showcasing brands that use or endorse your product. Features multiple layout options with hover animations and customizable styling.',
  subTitle: 'Display partner logos, client brands, or featured press mentions',
  icon: 'i-tabler-building-store',
  colorTheme: 'yellow',
  isPublic: true,
  el: vue.defineAsyncComponent(async () => import('./ElLogos.vue')),

  async getConfig(args) {
    const { getConfig } = await import('./config')
    return getConfig({ ...args, templateId })
  },
  screenshot: {
    light: new URL('img/screen-light.svg', import.meta.url).href,
    dark: new URL('img/screen-dark.svg', import.meta.url).href,
  },
})

export type { UserConfig } from './config'
