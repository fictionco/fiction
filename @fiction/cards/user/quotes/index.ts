import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site/card.js'

export const templateId = 'cardQuotesV1'

// Move the template definition to be more concise
export const template = cardTemplate({
  templateId,
  tags: ['content'],
  frequency: 'standard',
  title: 'Elegant Quotes',
  description: 'Transform customer testimonials into compelling social proof that builds trust and drives conversions. Perfect for showcasing client success stories, expert endorsements, and team perspectives.',
  subTitle: 'Watch your results soar with beautifully designed quotes that capture attention and inspire action',
  icon: 'i-tabler-quote',
  colorTheme: 'emerald',
  isPublic: true,
  el: vue.defineAsyncComponent(() => import('./ElQuote.vue')),

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
