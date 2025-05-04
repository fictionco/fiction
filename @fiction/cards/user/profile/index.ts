import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site/card.js'

export const templateId = 'cardProfileV1'

export const template = cardTemplate({
  templateId,
  tags: ['content'],
  frequency: 'standard',
  title: 'Profile',
  description: 'Create compelling personal profiles with dynamic layouts combining professional photos, bio content, and social connections. Perfect for team pages, speaker bios, or personal websites.',
  subTitle: 'Transform your personal brand into an engaging visual story',
  icon: 'i-tabler-user-circle',
  colorTheme: 'blue',
  isPublic: true,
  el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),

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

// Optional: Export type for use in other components
export type { UserConfig } from './config'
