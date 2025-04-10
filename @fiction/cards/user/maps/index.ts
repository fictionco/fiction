import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site/card'

export const templateId = 'cardMapsV1'

export const template = cardTemplate({
  templateId,
  category: ['advanced'],
  title: 'Interactive Map',
  subTitle: 'Beautiful interactive maps in a variety of styles',
  description: 'Add interactive maps to showcase locations, highlight regions of interest, and provide contextual geographic information. Perfect for business locations, travel itineraries, or geographic data visualization.',
  icon: 'i-tabler-map-2',
  colorTheme: 'blue',
  isPublic: true,
  el: vue.defineAsyncComponent(() => import('./ElCard.vue')),

  // Use async getConfig for better bundle splitting
  async getConfig(args) {
    const { getConfig } = await import('./config')
    return getConfig({ ...args, templateId })
  },
  screenshot: {
    light: new URL('img/screen-light.svg', import.meta.url).href,
    dark: new URL('img/screen-dark.svg', import.meta.url).href,
  },
})

export type { MapUserConfig, UserConfig } from './config'
