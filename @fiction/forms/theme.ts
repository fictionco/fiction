import { Theme } from '@fiction/site/theme.js'
import type { FictionEnv } from '@fiction/core/index.js'
import { safeDirname } from '@fiction/core/index.js'
import { CardFactory } from '@fiction/site/cardFactory'
import { getTemplates } from './templates'

async function getPages(args: { factory: CardFactory<Awaited<ReturnType<typeof getTemplates>>> }) {
  const { factory } = args
  return [
    await factory.create({ slug: '_home', title: 'Form', templateId: 'formWrap' }),
  ]
}

export async function setup(args: { fictionEnv: FictionEnv }) {
  const { fictionEnv } = args

  const templates = await getTemplates()

  return new Theme({
    fictionEnv,
    root: safeDirname(import.meta.url),
    themeId: 'forms',
    title: 'Forms',
    screenshot: '#',
    version: '1.0.0',
    isPublic: false,
    templates,
    getConfig: async ({ site }) => {
      const factory = new CardFactory({ templates, site })
      const pages = await getPages({ factory })
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
