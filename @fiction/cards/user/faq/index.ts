import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site/card.js'

const templateId = 'cardFaqV1'

export const template = cardTemplate({
  templateId,
  tags: ['content'],
  frequency: 'niche',
  icon: 'i-tabler-list-details',
  title: 'FAQ & Accordion',
  subTitle: 'Simple expandable questions and answers',
  description: 'Add a clean, expandable FAQ section to answer common questions. Perfect for product pages, support sections, or any content that benefits from a Q&A format.',
  colorTheme: 'emerald',
  el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),

  isPublic: true,
  async getConfig(args) {
    const { getConfig } = await import('./config')
    return getConfig({ ...args, templateId })
  },
  screenshot: {
    light: new URL('img/screen-light.svg', import.meta.url).href,
    dark: new URL('img/screen-dark.svg', import.meta.url).href,
  },
})
