import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site/card'

export const templateId = 'cardCtaV1'

// Main template definition with minimal synchronous code
export const template = cardTemplate({
  templateId,
  category: ['conversion'],
  classification: {
    category: ['conversion'],
    useCase: ['conversion', 'subscribe', 'lead'],
    type: ['text', 'input'],
  },
  icon: 'i-tabler-speakerphone',
  title: 'Call To Action',
  colorTheme: 'red',
  subTitle: 'Convert visitors into subscribers, customers, or leads with compelling offers',
  description: `Create high-converting sections that drive user action through clear value propositions,
social proof, and benefit-focused content. Includes multiple layouts for email capture, product trials,
demo requests, and other conversion goals. Features customizable messaging, benefit highlights, and
community social proof to boost conversion rates.`,
  isPublic: true,
  el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),

  // Config implementation
  getConfig: async () => {
    const { getConfig } = await import('./config')
    return getConfig({ templateId })
  },

  getBaseConfig: () => {
    return { standard: { spaceSize: 'xs' } }
  },

  screenshot: {
    light: new URL('img/screen-light.svg', import.meta.url).href,
    dark: new URL('img/screen-dark.svg', import.meta.url).href,
  },
})

// Optional: Export type for use in other components
export type { UserConfig } from './config'
