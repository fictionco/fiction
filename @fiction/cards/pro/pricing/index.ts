import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site/card.js'

const templateId = 'cardPricingV1'

export const template = cardTemplate({
  templateId,
  category: ['marketing', 'conversion'],
  classification: {
    category: ['content'],
    useCase: ['pricing'],
    type: ['text'],
  },
  title: 'Pricing Plans',
  description: 'Create compelling pricing tables that convert visitors into customers. Features interactive toggles for monthly/annual pricing, customizable tiers, and visual hierarchy to highlight your best plans.',
  subTitle: 'Design strategic pricing tables that guide customers to the perfect plan',
  icon: 'i-tabler-report-money',
  colorTheme: 'emerald',
  isPublic: true,
  el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),

  async getConfig(args) {
    const { getConfig } = await import('./config')
    return getConfig({ ...args, templateId })
  },

  screenshot: {
    light: new URL('img/screen-light.svg', import.meta.url).href,
    dark: new URL('img/screen-dark.svg', import.meta.url).href,
  },
})
