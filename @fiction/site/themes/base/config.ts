import type { template as captureTemplate } from '@fiction/cards/convert-capture'
import type { template as textEffectsTemplate } from '@fiction/cards/effect-text'

import type { template as contentModalTemplate } from '@fiction/cards/modal-media'
import type { template as areaTemplate } from '@fiction/cards/page-area'
import type { template as templateFooterPersonal } from '@fiction/cards/page-footer-personal'
import type { template as navTemplate } from '@fiction/cards/page-nav'

import type { Site } from '@fiction/site'
import type { CardFactory } from '@fiction/site/cardFactory'
import type { SiteUserConfig } from '@fiction/site/schema'
import type { StockMedia } from '@fiction/ui/stock'

type SectionArgs = {
  factory: CardFactory
  stock: StockMedia
  site: Site
  userConfig: SiteUserConfig
}

export async function getPages(args: SectionArgs) {
  const { factory } = args

  return [
    await factory.fromTemplate({
      slug: '_home',
      cards: [],
    }),
  ]
}

const defaultLogo = { variant: 'typography', typography: { label: 'Hello World' } } as const

export async function getHeader(args: SectionArgs) {
  const { factory } = args

  return await factory.fromTemplate<typeof areaTemplate>({
    regionId: 'header',
    templateId: 'cardPageAreaV1',
    cards: [
      await factory.fromTemplate<typeof navTemplate>({
        templateId: 'cardSiteNavV1',
        userConfig: {
          brand: {
            logo: defaultLogo,
          },
        },
      }),
    ],
  })
}

export async function getFooter(args: SectionArgs) {
  const { factory } = args
  return await factory.fromTemplate<typeof areaTemplate>({
    regionId: 'footer',
    templateId: 'cardPageAreaV1',
    cards: [

      await factory.fromTemplate<typeof templateFooterPersonal>({
        templateId: 'cardFooterPersonalV1',
        userConfig: {
          brand: {
            logo: defaultLogo,
          },
          menus: [],
          additional: {
            list1: [],
            list2: [
              { label: '© 2024 Name' },
            ],
          },
        },
      }),
    ],
  })
}

export async function getHidden(args: SectionArgs) {
  const { factory } = args

  return await factory.fromTemplate({
    cards: [
      await factory.fromTemplate<typeof contentModalTemplate>({ templateId: 'cardModalMediaV1', userConfig: { } }),
      await factory.fromTemplate<typeof textEffectsTemplate>({ templateId: 'cardTextEffectV1', userConfig: { } }),
      await factory.fromTemplate<typeof captureTemplate>({ templateId: 'cardCaptureV1', userConfig: { } }),
    ],
  })
}

export async function getConfig(args: Omit<SectionArgs, 'stock'>) {
  const { factory } = args
  const stock = await factory.getStockMedia()
  const a = { ...args, stock }
  const configs = await Promise.all([
    getPages(a),
    getHeader(a),
    getFooter(a),
    getHidden(a),
  ])

  const [pages, header, footer, hidden] = configs

  return {
    sections: { header, footer, hidden },
    pages,
  }
}
