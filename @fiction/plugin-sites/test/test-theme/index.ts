import { type FictionApp, vue } from '@fiction/core'
import { CardTemplate } from '../../card'
import { standardCardTemplates } from '../../cards'
import { Theme, themeCard } from '../../theme'

const def = vue.defineAsyncComponent

export const templates = [
  ...standardCardTemplates,
  new CardTemplate({
    templateId: 'testWrap',
    el: def(() => import('./TemplateWrap.vue')),
    sections: {
      test: themeCard({ templates: standardCardTemplates, cards: [] }),
    },
  }),
] as const

const mediaGridCard = themeCard({
  templates,
  templateId: 'mediaGrid',
  userConfig: {
    items: [
      {
        name: 'Barack Obama',
        desc: 'Personal Site',
        tags: ['Politics'],
        media: {
          url: new URL('img/screenshot.jpg', import.meta.url).href,
        },
      },
    ],
  },
})

export function setup(_args: { fictionApp: FictionApp }) {
  return new Theme({
    themeId: 'test',
    title: 'Standard',
    description: 'Standard and minimal',
    screenshot: new URL('./img/screenshot.jpg', import.meta.url).href,
    version: '1.0.0',
    templates,
    pages: [
      themeCard({
        templates,
        slug: '_default',
        title: 'Default Page',
        isDefault: true,
        cards: [mediaGridCard, { templateId: 'hero' }, { templateId: 'area', cards: [{ templateId: 'hero' }] }, { templateId: 'hero' }],
      }),
      themeCard({
        templates,
        slug: 'example',
        title: 'Example Page',
        templateId: 'testWrap',
        cards: [{ templateId: 'area', cards: [{ templateId: 'hero' }] }],
      }),
    ],
    sections: {
      header: themeCard({ templates, cards: [] }),
      footer: themeCard({ templates, cards: [] }),
    },
  })
}
