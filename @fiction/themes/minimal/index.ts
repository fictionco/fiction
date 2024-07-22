import type { FictionEnv } from '@fiction/core'
import { safeDirname } from '@fiction/core'
import { Theme, createCard } from '@fiction/site/theme.js'
import { templates } from './templates.js'

function pages() {
  return [
    createCard({
      templates,
      regionId: 'main',
      templateId: 'wrap',
      slug: '_home',
      title: 'Home',
      isHome: true,
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
    pages: () => pages(),
    userConfig: { },

    sections: () => {
      return {
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
      }
    },
  })
}
