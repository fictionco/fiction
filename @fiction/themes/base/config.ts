import type { template as templateHero } from '@fiction/cards/content-hero'
import type { template as captureTemplate } from '@fiction/cards/convert-capture'
import type { template as textEffectsTemplate } from '@fiction/cards/effect-text'

import type { template as contentModalTemplate } from '@fiction/cards/modal-media'
import type { template as areaTemplate } from '@fiction/cards/page/area'
import type { template as templateFooterPersonal } from '@fiction/cards/page/footer-personal'
import type { template as navTemplate } from '@fiction/cards/page/nav'

import type { ThemeConfigArgs } from '@fiction/site'

export async function getPages(args: ThemeConfigArgs) {
  const { factory } = args

  return [
    await factory.fromTemplate({
      slug: 'home',
      isHome: true,
      cards: [
        await factory.fromTemplate<typeof templateHero>({
          templateId: 'cardHeroV1',
          userConfig: {
            title: 'Hello World',
            subTitle: 'Welcome to your new site',
          },
        }),
      ],
    }),
  ]
}

const defaultLogo = { variant: 'brandName', typography: { label: 'Hello World' } } as const

export async function getHeader(args: ThemeConfigArgs) {
  const { factory } = args

  return await factory.fromTemplate<typeof areaTemplate>({
    regionId: 'header',
    templateId: 'cardPageAreaV1',
    cards: [
      await factory.fromTemplate<typeof navTemplate>({
        templateId: 'cardSiteNavV1',
        userConfig: {
          layout: 'justified',
          brand: {
            logo: defaultLogo,
          },
          nav: {
            primary: [
              { label: 'Home', href: '/' },
              { label: 'About', href: '/about' },
            ],
            utility: [
            ],
          },
        },
      }),
    ],
  })
}

export async function getFooter(args: ThemeConfigArgs) {
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
              { label: '© 2024 [@brand_name]' },
            ],
          },
        },
      }),
    ],
  })
}

export async function getHidden(args: ThemeConfigArgs) {
  const { factory } = args

  return await factory.fromTemplate({
    cards: [
      await factory.fromTemplate<typeof contentModalTemplate>({ templateId: 'cardModalMediaV1', userConfig: { } }),
      await factory.fromTemplate<typeof textEffectsTemplate>({ templateId: 'cardTextEffectV1', userConfig: { } }),
      await factory.fromTemplate<typeof captureTemplate>({ templateId: 'cardCaptureV1', userConfig: { } }),
    ],
  })
}

export async function getConfig(args: Omit<ThemeConfigArgs, 'stock'>) {
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
