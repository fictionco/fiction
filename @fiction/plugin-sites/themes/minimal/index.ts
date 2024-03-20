import type { ServiceList } from '@fiction/core'
import { Theme, createCard } from '../../theme'
import { templates } from './templates'

function pages() {
  return [
    createCard({
      templates,
      regionId: 'main',
      templateId: 'wrap',
      slug: '_home',
      title: 'Welcome to my site',
      isHome: true,
      cards: [
        createCard({
          templates,
          templateId: 'minimalProfile',
          userConfig: { },
        }),
      ],
    }),
  ]
}

export function setup(_args: ServiceList) {
  return new Theme({
    themeId: 'minimal',
    title: 'Minimal',
    description: 'Minimal personal branding theme',
    screenshot: new URL('./img/screenshot.jpg', import.meta.url).href,
    version: '1.0.0',
    templates,
    isPublic: true,
    pages,
    userConfig: {
      spacing: {
        contentWidthClass: 'max-w-screen-2xl px-4 sm:px-6 lg:px-20 mx-auto',
        spacingClass: `py-[calc(1.5rem+4vw)]`,
      },
    },

    sections: () => {
      return {
        header: createCard({
          templates,
          regionId: 'header',
          templateId: 'area',
          cards: [
            createCard({
              templates,
              templateId: 'minimalHeader',
            }),
          ],
        }),
        footer: createCard({
          templates,
          regionId: 'footer',
          templateId: 'area',
          cards: [
            createCard({
              templates,
              templateId: 'minimalFooter',
            }),
          ],
        }),
      }
    },
  })
}
