import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site/card.js'

export const templateId = 'cardTestimonialsV1'

export const template = cardTemplate({
  templateId,
  category: ['content'],
  title: 'Testimonials',
  description: 'Transform customer stories into compelling visual testimonials. Choose from multiple layouts to create emotional connections and build trust through authentic experiences.',
  subTitle: 'Share customer success stories that resonate and inspire trust',
  icon: 'i-tabler-messages',
  colorTheme: 'emerald',
  isPublic: true,
  el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),

  // Config implementation
  async getConfig(args) {
    const { getConfig } = await import('./config')
    return getConfig({ ...args, templateId })
  },
  screenshot: {
    light: new URL('img/screen-light.svg', import.meta.url).href,
    dark: new URL('img/screen-dark.svg', import.meta.url).href,
  },
})

// Export config types for use in components
export type { Testimonial, UserConfig } from './config'
