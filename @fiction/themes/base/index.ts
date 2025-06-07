import { cardConfig, getCardTemplates } from '@fiction/cards'
import { safeDirname } from '@fiction/core'
import { Theme } from '@fiction/site/theme.js'
import { getPageTemplates } from './pages/index.js'

export const theme = new Theme({
  root: safeDirname(import.meta.url),
  themeId: 'base',
  title: 'Base',
  subTitle: 'Base theme.',
  description: 'The base theme provides a standard blog layout.',
  icon: 'i-tabler-layout-grid',
  colorTheme: 'blue',
  version: '1.0.0',
  screenshots: {
    light: { desktop: new URL('./img/light-desktop.png', import.meta.url).href },
    dark: { desktop: new URL('./img/dark-desktop.png', import.meta.url).href },
  },

  isPublic: true,
  getTemplates: () => getCardTemplates({ caller: 'baseTheme' }),
  getPageTemplates,
  getConfig: async () => {
    return {
      pages: [
        cardConfig({
          slug: 'home',
          isHome: true,
          nav: 'hide',
          templateId: 'cardPageWrapV1',
          cards: [
            cardConfig({
              templateId: 'cardBlogV1',
              userConfig: {
                featuredCount: 1,
                title: '[@hero]',
                subTitle: 'Latest articles by [@name]',
                media: {
                  format: 'image',
                  url: '[@avatar]',
                },
              },
            }),
          ],
        }),
      ],
    }
  },
})
