import type { SiteUserConfig } from '@fiction/site/schema'
import { getCardTemplates } from '@fiction/cards/index.js'
import { safeDirname } from '@fiction/core'
import { Theme } from '@fiction/site/theme.js'

export const theme = new Theme({
  root: safeDirname(import.meta.url),
  themeId: 'base',
  title: 'Base',
  subTitle: 'Base theme with no specific features',
  description: 'Base theme with no specific features, no default pages or sections',
  icon: 'i-tabler-layout-grid',
  colorTheme: 'blue',
  version: '1.0.0',
  screenshots: {
    light: { desktop: new URL('./img/light-desktop.png', import.meta.url).href },
    dark: { desktop: new URL('./img/dark-desktop.png', import.meta.url).href },
  },

  isPublic: true,
  getTemplates: () => getCardTemplates(),
  getBaseConfig: () => {
    return {
      site: {
        fonts: { },
        prefersColorScheme: 'dark',
      },
    } satisfies SiteUserConfig
  },
  getConfig: async (args) => {
    const { getConfig } = await import('./config')

    return getConfig(args)
  },
})
