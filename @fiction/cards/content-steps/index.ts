import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site/card'

const templateId = 'cardStepsV1'

// Main template definition with minimal synchronous code
export const template = cardTemplate({
  templateId,
  category: ['marketing'],
  title: 'Number Steps',
  subTitle: 'Engaging list of key points with optional media',
  description: 'Transform complex ideas into clear, sequential steps with rich media support. Perfect for tutorials, processes, or feature highlights. Each point can include images and custom styling to boost engagement.',
  icon: 'i-tabler-list-numbers',
  colorTheme: 'rose',

  isPublic: true,
  el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),

  // Config implementation
  getConfig: async (args) => {
    const { getConfig } = await import('./config')
    return getConfig(args)
  },
  screenshot: {
    light: new URL('img/screen-light.svg', import.meta.url).href,
    dark: new URL('img/screen-dark.svg', import.meta.url).href,
  },
})

// Export type for use in other components
export type { UserConfig } from './config'
