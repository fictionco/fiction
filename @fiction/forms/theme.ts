import { Theme } from '@fiction/site/theme.js'
import type { FictionEnv } from '@fiction/core/index.js'
import { safeDirname } from '@fiction/core/index.js'

async function getPages() {
  return [

  ]
}

export async function setup(args: { fictionEnv: FictionEnv }) {
  const { fictionEnv } = args

  return new Theme({
    fictionEnv,
    root: safeDirname(import.meta.url),
    themeId: 'forms',
    title: 'Forms',
    screenshot: '#',
    version: '1.0.0',
    isPublic: false,
    getConfig: async ({ site }) => {
      const pages = await getPages()
      return {
        pages,
        sections: {},
        userConfig: {},
        templates: [],
      }
    },
    templateDefaults: { page: 'formWrap' },

  })
}
