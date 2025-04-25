import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site/card.js'

export const templateId = 'cardShowcaseGalleryV1'

export const template = cardTemplate({
  templateId,
  category: ['portfolio', 'content'],
  title: 'Showcase',
  description: 'Create an immersive gallery experience with a responsive grid layout and elegant popup viewer. Perfect for portfolios, product catalogs, case studies, or any visual storytelling needs.',
  subTitle: 'Transform your visual content into an engaging story that captures attention and drives interaction',
  icon: 'i-tabler-photo-up',
  colorTheme: 'amber',
  isPublic: true,
  el: vue.defineAsyncComponent(async () => import('./ElShowcase.vue')),

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
