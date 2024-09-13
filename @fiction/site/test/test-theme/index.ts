import { standardCardTemplates } from '@fiction/cards'
import { type FictionEnv, safeDirname, vue } from '@fiction/core'
import { z } from 'zod'
import { cardTemplate } from '../../card.js'
import { CardFactory } from '../../cardFactory.js'
import { Theme } from '../../theme.js'
import { staticFileUrl } from '../../utils/site.js'

const def = vue.defineAsyncComponent

export async function setup(args: { fictionEnv: FictionEnv }) {
  const { fictionEnv } = args

  const factory = new CardFactory({ templates: standardCardTemplates })

  const templates = [
    ...standardCardTemplates,
    cardTemplate({
      templateId: 'testWrap',
      el: def(async () => import('./TemplateWrap.vue')),
      isPageCard: true,
      sections: {
        test: await factory.create({ cards: [] }),
      },
    }),
    cardTemplate({
      templateId: 'testBlog',
      el: def(async () => import('./TemplateWrap.vue')),
      schema: z.object({
        posts: z.array(z.object({
          slug: z.string(),
          title: z.string(),
          content: z.string(),
        })),
      }),
      getSitemapPaths: async ({ card, pagePath }) => {
        const posts = card.userConfig.value.posts || []
        return posts.map(post => `${pagePath}/${post.slug}`)
      },
    }),
  ] as const

  return new Theme({
    root: safeDirname(import.meta.url),
    fictionEnv,
    themeId: 'test',
    title: 'Standard',
    description: 'Standard and minimal',
    screenshot: new URL('./img/screenshot.jpg', import.meta.url).href,
    version: '1.0.0',
    templates,
    getConfig: async (args) => {
      const { site } = args
      const obama = staticFileUrl({ site, filename: 'obama.webp' })
      const factory = new CardFactory({ templates, site })
      const mediaGridCard = await factory.create({
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
      return {
        userConfig: {},
        sections: {
          header: await factory.create({ cards: [] }),
          footer: await factory.create({ cards: [] }),
        },
        pages: [
          await factory.create({
            slug: '_home',
            title: 'Default Page',
            isHome: true,
            cards: [mediaGridCard, { templateId: 'hero' }, { templateId: 'area', cards: [{ templateId: 'hero' }] }, { templateId: 'hero' }],
          }),
          await factory.create({
            slug: 'example',
            title: 'Example Page',
            templateId: 'testWrap',
            cards: [{ templateId: 'area', cards: [{ templateId: 'hero' }] }],
          }),
        ],
      }
    },

  })
}
