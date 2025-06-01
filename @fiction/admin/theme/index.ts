import type { CardFactory } from '@fiction/site/cardFactory.js'
import type { SiteGlobalUserConfig } from '@fiction/site/schema.js'
import type { Site } from '@fiction/site/site.js'
import type { FictionAdmin } from '../index.js'
import { cardConfigCustom, getCardTemplates } from '@fiction/cards'
import { safeDirname } from '@fiction/core/index.js'
import { Theme } from '@fiction/site/theme.js'
import favicon from '@fiction/ui/brand/favicon.svg'
import icon from '@fiction/ui/brand/icon.png'
import shareImage from '@fiction/ui/brand/shareImage.png'
import { authTemplate, dashTemplate } from '../dashboard/templates.js'

export const fictionLogo = `<svg viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-north-star"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12h18" /><path d="M12 21v-18" /><path d="M7.5 7.5l9 9" /><path d="M7.5 16.5l9 -9" /></svg>`

const standardTemplates = [
  dashTemplate,
  authTemplate,
]

export async function getTemplates(args: { site: Site }) {
  const { site } = args || {}
  const service = site.fictionSites.fictionEnv.getService<{ fictionAdmin: FictionAdmin }>()

  const adminTemplates = await service.fictionAdmin.getAdminTemplates()
  const tpl = await getCardTemplates({ caller: 'adminTheme' })
  return [...tpl, ...standardTemplates, ...adminTemplates]
}

export type AdminTemplates = Awaited<ReturnType<typeof getTemplates>>

export async function getPages(args: { factory: CardFactory, site: Site }) {
  return [
    cardConfigCustom<AdminTemplates>({
      regionId: 'main',
      templateId: 'dash',
      slug: '_404',
      title: 'Not Found (404)',
      cards: [
        cardConfigCustom<AdminTemplates>({ templateId: 'card404ErrorV1' }),
      ],
    }),
    cardConfigCustom<AdminTemplates>({
      templateId: 'cardTransactionViewV1',
      slug: 'auth',
      title: 'Settings',
      cards: [
        cardConfigCustom<AdminTemplates>({
          templateId: 'authPage',
          userConfig: {
            homeUrl: 'https://www.fiction.com',
            logo: { format: 'html' as const, html: fictionLogo },
            standard: { spaceSize: 'none', showOnSingle: true },
          },
        }),
      ],
    }),
  ]
}

export const theme = new Theme({
  root: safeDirname(import.meta.url),
  themeId: 'admin',
  title: 'Admin',
  version: '1.0.0',
  isPublic: false,
  getTemplates: async args => await getTemplates(args),
  getConfig: async (args) => {
    const { factory, site } = args
    const pg = await getPages(args)
    const service = site.fictionSites.fictionEnv.getService<{ fictionAdmin: FictionAdmin }>()

    const adminPages = await service.fictionAdmin.getAdminPages({ factory })
    const pages = [...pg, ...adminPages]
    return {
      pages,
      sections: {},
      userConfig: {
        shareImage: { url: shareImage, format: 'image' },
        favicon: { url: favicon, format: 'image' },
        icon: { url: icon, format: 'image' },
        standard: {
          fonts: {
            body: { stack: 'sans' },
            sans: { stack: 'sans' },
          },
          buttons: { design: 'solid', rounding: 'full', hover: 'fade' },
          widthSize: 'sm',
          spaceSize: 'none',
        },
      } satisfies SiteGlobalUserConfig,

    }
  },
  templateDefaults: { page: 'dash', transaction: 'cardTransactionViewV1' },
  getBaseConfig: () => {
    return {
      userConfig: {
        spacing: { contentWidthSize: 'sm', spacingSize: `none` },
        brand: {
          logo: { format: 'html' as const, html: fictionLogo },
        },
      },
    }
  },

})
