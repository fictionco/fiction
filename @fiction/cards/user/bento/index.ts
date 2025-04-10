import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'

export const templateId = 'cardBentoV1'

export const template = cardTemplate({
  templateId,
  category: ['layout', 'content'],
  title: 'Bento Grid',
  description: 'Create visually striking layouts with a flexible grid system that combines images, text, and interactive elements. Perfect for showcasing features, portfolios, or content collections in an engaging masonry-style format.',
  subTitle: 'Transform your content into an engaging visual story with customizable grid layouts',
  icon: 'i-tabler-layout-grid',
  colorTheme: 'violet',
  isPublic: true,
  el: vue.defineAsyncComponent(async () => import('./ElBento.vue')),

  async getConfig(args) {
    const { getConfig } = await import('./config')
    return getConfig({ ...args, templateId })
  },

  screenshot: {
    light: new URL('img/screen-light.svg', import.meta.url).href,
    dark: new URL('img/screen-dark.svg', import.meta.url).href,
  },
})
