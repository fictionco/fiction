import { cardConfig, getCardTemplates } from '@fiction/cards'
import { safeDirname, vue } from '@fiction/core'
import { z } from 'zod/v4'
import { cardTemplate } from '../../card.js'
import { Theme } from '../../theme.js'
import '@fiction/site'

const def = vue.defineAsyncComponent

async function getTemplates() {
  const tpl = await getCardTemplates({ caller: 'testTheme' })
  return [
    ...tpl,
    cardTemplate({
      templateId: 'testWrap',
      el: def(async () => import('./TemplateWrap.vue')),
      isPageCard: true,
      sections: {
        test: cardConfig({ cards: [] }),
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
}

type TemplatesType = Awaited<ReturnType<typeof getTemplates>>

export const theme = new Theme({
  root: safeDirname(import.meta.url),
  themeId: 'test',
  title: 'Standard',
  description: 'Standard and minimal',
  version: '1.0.0',
  getTemplates: async () => {
    return getTemplates()
  },
  getConfig: async (args) => {
    const { site, factory } = args

    const mediaGridCard = cardConfig({
      templateId: 'cardMarqueeV1',
      userConfig: {
        items: [
          {
            title: 'Barack Obama',
            subTitle: 'Personal Site',
            media: { url: '' },
          },
        ],
      },
    })
    return {
      userConfig: {},
      sections: {
        header: cardConfig({ cards: [] }),
        footer: cardConfig({ cards: [] }),
      },
      pages: [
        cardConfig({
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
        cardConfig<TemplatesType>({
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
