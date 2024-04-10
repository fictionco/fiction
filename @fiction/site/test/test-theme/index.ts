import { type FictionEnv, safeDirname, vue } from '@fiction/core'
import { standardCardTemplates } from '@fiction/cards'
import { CardTemplate } from '../../card'
import { Theme, createCard } from '../../theme'

const def = vue.defineAsyncComponent

export const templates = [
  ...standardCardTemplates,
  new CardTemplate({
    templateId: 'testWrap',
    el: def(() => import('./TemplateWrap.vue')),
    sections: {
      test: createCard({ templates: standardCardTemplates, cards: [] }),
    },
  }),
] as const

export function setup(args: { fictionEnv: FictionEnv }) {
  const { fictionEnv } = args
  const mediaGridCard = createCard({
    templates,
    templateId: 'marquee',
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
  return new Theme({
    root: safeDirname(import.meta.url),
    fictionEnv,
    themeId: 'test',
    title: 'Standard',
    description: 'Standard and minimal',
    screenshot: new URL('./img/screenshot.jpg', import.meta.url).href,
    version: '1.0.0',
    templates,
    pages: () => [
      createCard({
        templates,
        slug: '_home',
        title: 'Default Page',
        isHome: true,
        cards: [mediaGridCard, { templateId: 'hero' }, { templateId: 'area', cards: [{ templateId: 'hero' }] }, { templateId: 'hero' }],
      }),
      createCard({
        templates,
        slug: 'example',
        title: 'Example Page',
        templateId: 'testWrap',
        cards: [{ templateId: 'area', cards: [{ templateId: 'hero' }] }],
      }),
    ],
    sections: () => {
      return {
        header: createCard({ templates, cards: [] }),
        footer: createCard({ templates, cards: [] }),
      }
    },
  })
}
