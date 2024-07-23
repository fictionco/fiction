import type { FictionEnv } from '@fiction/core'
import { safeDirname } from '@fiction/core'
import { Theme } from '@fiction/site/theme.js'
import { getCardTemplates } from '@fiction/cards/index.js'
import type { Site } from '@fiction/site/site.js'
import { CardFactory } from '@fiction/site/cardFactory.js'
import { templates as templatesMinimalHeader } from './cards/minimal-header/index.js'
import { templates as templatesMinimalFooter } from './cards/minimal-footer/index.js'

async function getTemplates() {
  const t = await getCardTemplates()
  const templates = [
    ...t,
    ...templatesMinimalHeader,
    ...templatesMinimalFooter,
  ] as const

  return templates
}
async function getPages(args: { factory: CardFactory<Awaited<ReturnType<typeof getTemplates>>>, site: Site }) {
  const { factory } = args
  return [
    await factory.create({
      slug: '_home',
      title: 'Home',
      isHome: true,
      cards: [
        await factory.create({
          templateId: 'overSlide',
          userConfig: {
            items: [
              {
                title: 'Your Name',
                subTitle: 'A quick tagline or description',
                // textBlend: 'difference',
                media: {
                  format: 'url',
                  url: 'https://images.unsplash.com/photo-1554774853-719586f82d77?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                },
                mediaBackground: {
                  format: 'url',
                  url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                },
              },
              {
                title: 'Another Slide',
                subTitle: 'A bit more information',
                // textBlend: 'difference',
                media: {
                  format: 'url',
                  url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                },
                mediaBackground: {
                  format: 'url',
                  url: 'https://images.unsplash.com/photo-1555421689-3f034debb7a6?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                },
              },
            ],
          },
        }),
        await factory.create({
          templateId: 'ticker',
          userConfig: {
            items: [
              { text: 'Your Name', outline: true, rotateX: 3, rotateY: 3, rotateZ: -3 },
            ],
          },
        }),
        await factory.create({
          templateId: 'showcase',
        }),
      ],
    }),
    await factory.create({
      slug: 'about',
      title: 'About',
      cards: [
        await factory.create({ templateId: 'profile', userConfig: { } }),
      ],
    }),
    await factory.create({
      regionId: 'main',
      templateId: 'wrap',
      slug: 'contact',
      title: 'Contact',
      cards: [
        await factory.create({ templateId: 'maps', userConfig: { } }),
      ],
    }),
  ]
}

export async function setup(args: { fictionEnv: FictionEnv }) {
  const { fictionEnv } = args

  const templates = await getTemplates()

  return new Theme({
    fictionEnv,
    root: safeDirname(import.meta.url),
    themeId: 'minimal',
    title: 'Minimal',
    description: 'Minimal personal branding theme',
    screenshot: new URL('./img/screenshot.jpg', import.meta.url).href,
    version: '1.0.0',
    templates,
    isPublic: true,
    getConfig: async ({ site }) => {
      const factory = new CardFactory({ templates, site })
      return {
        pages: await getPages({ factory, site }),
        sections: {
          header: await factory.create({
            regionId: 'header',
            templateId: 'area',
            cards: [
              await factory.create({ templateId: 'nav', userConfig: {
                logo: { html: `Minimal Theme` },
                navA: [
                  { name: 'About', href: '/about' },
                ],
                navB: [
                  { name: 'Contact', href: '/contact', itemStyle: 'buttonStandard' },
                ],
              } }),
            ],
          }),
          footer: await factory.create({
            regionId: 'footer',
            templateId: 'area',
            cards: [
              await factory.create({ templateId: 'footer', userConfig: {
                logo: {
                  format: 'html',
                  html: `Minimal Theme`,
                },
                nav: [
                  {
                    name: 'About',
                    href: '/about',
                  },
                  {
                    name: 'Contact',
                    href: '/contact',
                  },
                ],
                legal: {
                  privacyPolicyUrl: `#`,
                  termsOfServiceUrl: `#`,
                  copyrightText: `Your Company or Name, Inc.`,
                },
                socials: [
                  {
                    href: 'https://www.linkedin.com/company/fictionco',
                    target: '_blank',
                    name: 'LinkedIn',
                    icon: `linkedin`,
                  },
                  {
                    href: 'https://github.com/fictionco',
                    target: '_blank',
                    name: 'Github',
                    icon: `github`,
                  },
                  {
                    href: 'https://www.twitter.com/fictionco',
                    target: '_blank',
                    name: 'X',
                    icon: 'x',
                  },

                ],

                badges: [],
              } }),
            ],
          }),
        },
        userConfig: {},
      }
    },

  })
}
