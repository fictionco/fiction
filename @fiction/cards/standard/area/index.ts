import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site/card'

const templateId = 'cardPageAreaV1'

// Main template definition with minimal synchronous code
export const template = cardTemplate({
  templateId,
  title: 'Content Area',
  description: 'A flexible container that groups and styles content elements. Perfect for creating distinct sections within your page.',
  subTitle: 'Group and style content elements with custom backgrounds, spacing, and layouts',
  icon: 'i-tabler-layout-board',
  colorTheme: 'blue',
  isContainer: true, // ui drawer
  isPublic: false,
  el: vue.defineAsyncComponent(async () => import('./ElArea.vue')),

  // Base configuration
  getBaseConfig: () => {
    return {
      standard: { spaceSize: 'none', widthSize: 'none' } as const,
    }
  },

  // Config implementation
  getConfig: async (args) => {
    const { getConfig } = await import('./config')
    return getConfig({ ...args, templateId })
  },

  screenshot: {
    light: new URL('img/screen-light.svg', import.meta.url).href,
    dark: new URL('img/screen-dark.svg', import.meta.url).href,
  },
})

// Export type for use in other components
export type { UserConfig } from './config'
