import { getCardTemplates } from '@fiction/cards/index.js'
import { safeDirname } from '@fiction/core'
import { Theme } from '@fiction/site/theme.js'

export const theme = new Theme({
  root: safeDirname(import.meta.url),
  themeId: 'minimal',
  title: 'Minimal',
  subTitle: 'Elegant simplicity that lets your content shine',
  description: 'A refined, distraction-free theme that puts your work center stage. Perfect for creatives, photographers, and professionals who want their content to make the strongest impact. Features thoughtfully crafted typography, intentional white space, and smooth transitions that guide visitors through your story.',
  icon: 'i-tabler-layout-grid',
  colorTheme: 'green',
  category: ['portfolio', 'personal'],
  version: '1.0.0',
  screenshots: {
    light: { desktop: new URL('./img/light-desktop.png', import.meta.url).href },
    dark: { desktop: new URL('./img/dark-desktop.png', import.meta.url).href },
  },

  isPublic: true,
  getTemplates: () => getCardTemplates({ caller: 'minimalTheme' }),

  getConfig: async (args) => {
    const { getConfig } = await import('./config')

    return getConfig(args)
  },
})
