import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site/card.js'

export const templateId = 'cardPeopleV1'

export const template = cardTemplate({
  templateId,
  tags: ['content'],
  frequency: 'niche',
  title: 'Team Showcase',
  subTitle: 'Build trust and connection with faces.',
  description: 'Transform your about page with a dynamic team showcase that highlights the human side of your business. Perfect for building credibility, showcasing expertise, and creating meaningful connections with your audience through professional profiles, achievements, and social presence.',
  icon: 'i-tabler-users-group',
  colorTheme: 'blue',
  isPublic: true,
  el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),

  getConfig: async (args) => {
    const { getConfig } = await import('./config')
    return getConfig({ ...args, templateId })
  },
  screenshot: {
    light: new URL('img/screen-light.svg', import.meta.url).href,
    dark: new URL('img/screen-dark.svg', import.meta.url).href,
  },
})

export type { UserConfig } from './config'
