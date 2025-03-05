import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site/card'

export const templateId = 'cardTimelineV1'

export const template = cardTemplate({
  templateId,
  category: ['content', 'marketing'],
  classification: {
    type: ['text'],
    category: ['content'],
    useCase: ['timeline', 'list', 'roadmap', 'cv'],
  } as const,
  icon: 'i-tabler-timeline',
  title: 'Milestone Timeline',
  subTitle: 'Visualize a resume/cv, journey, or series of events',
  description: 'Transform your professional journey into an engaging visual story. Perfect for about pages, portfolios, and career highlights.',
  colorTheme: 'green',
  isPublic: true,
  el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),

  getConfig: async (args) => {
    const { getConfig } = await import('./config')
    return getConfig(args)
  },
  screenshot: {
    light: new URL('img/screen-light.svg', import.meta.url).href,
    dark: new URL('img/screen-dark.svg', import.meta.url).href,
  },
})

export type { UserConfig } from './config'
