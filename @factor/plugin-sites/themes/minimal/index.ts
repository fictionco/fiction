import type { ServiceList } from '@factor/api'
import { Theme, themeCard } from '../../theme'
import { templates } from './templates'

const globalRegions = [

]

const pg = [
  themeCard({
    templates,
    regionId: 'main',
    templateId: 'wrap',
    slug: '_default',
    title: 'Welcome to my site',
    isDefault: true,
    cards: [
      themeCard({
        templates,
        templateId: 'minimalProfile',
        userConfig: { },
      }),
    ],
  }),
]

export function setup(_args: ServiceList) {
  const pages = [...pg]

  return new Theme({
    themeId: 'minimal',
    title: 'Minimal',
    description: 'Minimal personal branding theme',
    screenshot: new URL('./img/screenshot.jpg', import.meta.url).href,
    version: '1.0.0',
    templates,
    isPublic: true,
    pages,
    spacing: {
      contentWidthClass: 'max-w-screen-2xl px-4 sm:px-6 lg:px-20 mx-auto',
      spacingClass: `py-[calc(1.5rem+4vw)]`,
    },
    sections: {
      header: themeCard({
        templates,
        regionId: 'header',
        templateId: 'area',
        cards: [
          themeCard({
            templates,
            templateId: 'minimalHeader',
          }),
        ],
      }),
      footer: themeCard({
        templates,
        regionId: 'footer',
        templateId: 'area',
        cards: [
          themeCard({
            templates,
            templateId: 'minimalFooter',
          }),
        ],
      }),
    },
  })
}
