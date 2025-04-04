import type { template as MarqueeTemplate } from '@fiction/cards/media-marquee'
import { getCardTemplates } from '@fiction/cards'
import { safeDirname, vue } from '@fiction/core'
import { z } from 'zod'
import { cardTemplate } from '../../card.js'
import { CardFactory } from '../../cardFactory.js'
import { Theme } from '../../theme.js'
import { staticFileUrl } from '../../utils/site.js'

const def = vue.defineAsyncComponent

export const theme = new Theme({
  root: safeDirname(import.meta.url),
  themeId: 'test',
  title: 'Standard',
  description: 'Standard and minimal',
  version: '1.0.0',
  getTemplates: async () => {
    const tpl = await getCardTemplates()
    const factory = new CardFactory({ templates: tpl, caller: 'testThemeSetup' })
    return [
      ...tpl,
      cardTemplate({
        templateId: 'testWrap',
        el: def(async () => import('./TemplateWrap.vue')),
        isPageCard: true,
        sections: {
          test: await factory.fromTemplate({ cards: [] }),
        },
      }),
      cardTemplate({
        templateId: 'testBlog',
        el: def(async () => import('./TemplateWrap.vue')),
        getConfig: async () => {
          return {
            schema: z.object({
              posts: z.array(z.object({ slug: z.string(), title: z.string(), content: z.string() })),
            }),
          }
        },

        getContentPaths: async ({ card, viewPath }) => {
          const posts = card.userConfig.value.posts || []
          return posts.map((post) => {
            return {
              type: 'post',
              path: `${viewPath}/${post.slug}`,
            }
          })
        },
      }),
    ]
  },
  getConfig: async (args) => {
    const { site, factory } = args
    const obama = staticFileUrl({ site, filename: 'obama.webp' })

    const mediaGridCard = await factory.fromTemplate<typeof MarqueeTemplate>({
      templateId: 'cardMarqueeV1',
      userConfig: {
        items: [
          {
            title: 'Barack Obama',
            subTitle: 'Personal Site',
            media: { url: obama },
          },
        ],
      },
    })
    return {
      userConfig: {},
      sections: {
        header: await factory.fromTemplate({ cards: [] }),
        footer: await factory.fromTemplate({ cards: [] }),
      },
      pages: [
        await factory.fromTemplate({
          slug: 'welcome',
          isHome: true,
          title: 'Default Page',
          cards: [
            mediaGridCard,
            { templateId: 'cardHeroV1' },
            { templateId: 'cardPageAreaV1', cards: [
              { templateId: 'cardHeroV1' },
            ] },
            { templateId: 'cardHeroV1' },
          ],
        }),
        await factory.fromTemplate({
          slug: 'example',
          title: 'Example Page',
          templateId: 'testWrap',
          cards: [{
            templateId: 'cardPageAreaV1',
            cards: [{ templateId: 'cardHeroV1' }],
          }],
        }),
      ],
    }
  },

})
