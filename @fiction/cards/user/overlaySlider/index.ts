import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site/card'

export const templateId = 'cardOverlaySliderV1'

// Main template definition with minimal synchronous code
export const template = cardTemplate({
  templateId,
  tags: ['slider', 'hero'],
  frequency: 'standard',
  title: 'Overlay Slider',
  subTitle: 'Create an engaging visual journey with this dynamic slider',
  description: 'Create an engaging visual journey with this dynamic slider featuring overlaid text and smooth transitions. Perfect for showcasing team members, services, or key offerings with impact.',
  icon: 'i-tabler-layers-intersect',
  colorTheme: 'teal',
  isPublic: true,
  el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),

  // Config implementation
  getConfig: async (args) => {
    const { getConfig } = await import('./config')
    return getConfig({ ...args, templateId })
  },

  getBaseConfig: () => ({ standard: { spaceSize: 'sm' } as const }),

  screenshot: {
    light: new URL('img/screen-light.svg', import.meta.url).href,
    dark: new URL('img/screen-dark.svg', import.meta.url).href,
  },
})

// Optional: Export type for use in other components
export type { UserConfig } from './config'
