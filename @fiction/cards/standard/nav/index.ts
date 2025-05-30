import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site/card'

export const templateId = 'cardSiteNavV1'

// Main template definition with minimal synchronous code
export const template = cardTemplate({
  templateId,
  icon: 'i-tabler-menu-2',
  title: 'Site Navigation',
  subTitle: 'Sophisticated navigation for modern websites',
  colorTheme: 'green',
  description: `Create an engaging brand experience with this premium navigation component.
    Features intelligent layouts, mega menus, and contextual user interactions.
    Perfect for modern digital brands that need sophisticated information architecture
    with visual hierarchy and clear user pathways.`,
  isPublic: false,
  el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),

  // Config implementation loaded asynchronously
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
