import { cardConfig } from '@fiction/cards'
import { getCardTemplates } from '@fiction/cards/index.js'
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
  getPageTemplates: () => getPageTemplates(),
  getConfig: async () => {
    return {
      pages: [
        cardConfig({
          slug: 'home',
          isHome: true,
          nav: 'hide',
          cards: [
            cardConfig({
              templateId: 'cardBlogV1',
              userConfig: {
                featuredCount: 1,
                title: '[@name]',
                subTitle: '[@headline]',
                media: {
                  type: 'image',
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
