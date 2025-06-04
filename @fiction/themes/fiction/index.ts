import { safeDirname } from '@fiction/core'
import { Theme } from '@fiction/site/theme.js'
import { getWebsiteTemplates } from './templates'

export const theme = new Theme({
  root: safeDirname(import.meta.url),
  themeId: 'fiction',
  title: 'Fiction',
  subTitle: 'The theme for fiction.com',
  description: 'Fiction website',
  category: [],
  version: '1.0.0',
  isPublic: false,
  getTemplates: () => getWebsiteTemplates(),
  getBaseConfig: () => ({
    userConfig: {
      standard: {
        fonts: { },
      },
    },
  }),
  getConfig: async (args) => {
    const { site } = args
    const { getConfig } = await import('./config')
    const fictionEnv = site.fictionSites.fictionEnv
    const domain = fictionEnv.meta?.domain || 'fiction.com'

    return await getConfig({ ...args, domain })
  },

})
