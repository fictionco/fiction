import type { FictionEnv } from '@fiction/core'
import { safeDirname } from '@fiction/core'
import { Theme, createCard } from '@fiction/site/theme.js'
import { getCardTemplates } from '@fiction/cards/index.js'
import type { Site } from '@fiction/site/site.js'
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
async function getPages(args: { templates: Awaited<ReturnType<typeof getTemplates>>, site: Site }) {
  const { templates } = args
  return [
    createCard({
      templates,
      slug: '_home',
      title: 'Home',
      isHome: true,
      cards: [
        createCard({
          templates,
          templateId: 'overSlide',
          userConfig: {
            items: [
              {
                title: 'Minimal Theme',
                subTitle: 'A minimal personal branding theme',
                media: {
                  format: 'url',
                  url: 'https://images.unsplash.com/photo-1680702785292-b1bcf398fa12?q=80&w=3276&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                },
                mediaBackground: {
                  format: 'url',
                  url: 'https://images.unsplash.com/photo-1693409268199-1d17cfe33d5e?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                },
              },
            ],
          },
        }),
        createCard({
          templates,
          templateId: 'showcase',
        }),
      ],
    }),
    createCard({
      templates,
      slug: 'about',
      title: 'About',
      cards: [
        createCard({ templates, templateId: 'profile', userConfig: { } }),
      ],
    }),
    createCard({
      templates,
      regionId: 'main',
      templateId: 'wrap',
      slug: 'contact',
      title: 'Contact',
      cards: [
        createCard({ templates, templateId: 'maps', userConfig: { } }),
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
      return {
        pages: await getPages({ templates, site }),
        sections: {
          header: createCard({
            templates,
            regionId: 'header',
            templateId: 'area',
            cards: [createCard({ templates, templateId: 'nav', userConfig: {
              logo: { html: `Minimal Theme` },
              navA: [
                { name: 'About', href: '/about' },

              ],
              navB: [
                { name: 'Contact', href: '/contact', itemStyle: 'buttonStandard' },
              ],
            } })],
          }),
          footer: createCard({
            templates,
            regionId: 'footer',
            templateId: 'area',
            cards: [createCard({ templates, templateId: 'footer', userConfig: {
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
            } })],
          }),
        },
        userConfig: {},
      }
    },

  })
}
