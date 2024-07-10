import { type FictionEnv, safeDirname, vue } from '@fiction/core'
import { standardCardTemplates } from '@fiction/cards'
import { staticFileUrl } from '../../utils/site.js'
import { CardTemplate } from '../../card.js'
import { Theme, createCard } from '../../theme.js'

const def = vue.defineAsyncComponent

export const templates = [
  ...standardCardTemplates,
  new CardTemplate({
    templateId: 'testWrap',
    el: def(async () => import('./TemplateWrap.vue')),
    sections: {
      test: createCard({ templates: standardCardTemplates, cards: [] }),
    },
  }),
] as const

export function setup(args: { fictionEnv: FictionEnv }) {
  const { fictionEnv } = args

  return new Theme({
    root: safeDirname(import.meta.url),
    fictionEnv,
    themeId: 'test',
    title: 'Standard',
    description: 'Standard and minimal',
    screenshot: new URL('./img/screenshot.jpg', import.meta.url).href,
    version: '1.0.0',
    templates,
    pages: async (args) => {
      const { site } = args
      const obama = staticFileUrl({ site, filename: 'obama.webp' })
      const mediaGridCard = createCard({
        templates,
        templateId: 'marquee',
        userConfig: {
          items: [
            {
              name: 'Barack Obama',
              desc: 'Personal Site',
              tags: ['Politics'],
              media: { url: obama },
            },
          ],
        },
      })
      return [
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
      ]
    },
    sections: () => {
      return {
        header: createCard({ templates, cards: [] }),
        footer: createCard({ templates, cards: [] }),
      }
    },
  })
}
