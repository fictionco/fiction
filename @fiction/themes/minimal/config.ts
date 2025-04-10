import type { ThemeConfig, ThemeConfigArgs } from '@fiction/site'

import type { StockMedia } from '@fiction/ui/stock'
import { cardConfig } from '@fiction/cards/index'
import { getDemoUserConfig } from '@fiction/cards/posts/magazine/config'

type SectionArgs = ThemeConfigArgs & {
  stock: StockMedia
}

export async function getPages(args: SectionArgs) {
  const { factory } = args

  const { defaultMap } = await import('@fiction/cards/user/maps/config')

  const stock = await factory.getStockMedia()

  return [
    cardConfig({
      slug: 'home',
      title: 'Home',
      isHome: true,
      cards: [
        cardConfig({ templateId: 'cardProfileV1' }),
        cardConfig({ templateId: 'cardBentoV1' }),
        cardConfig({ templateId: 'cardQuotesV1' }),
      ],
    }),
    cardConfig({
      slug: 'blog',
      cards: [
        cardConfig({
          templateId: 'cardPostsMagazineV1',
          userConfig: await getDemoUserConfig({ factory, stock }),
        }),
      ],
    }),
    cardConfig({
      slug: 'contact',
      cards: [
        cardConfig({
          templateId: 'cardHeroV1',
          userConfig: {
            items: [
              {
                title: 'Contact Us',
                subTitle: `We'll get back to you as soon as possible.`,
                superTitle: { text: 'Get in Touch', icon: { class: 'i-tabler-phone' }, theme: 'orange' },
              },
            ],
          },
        }),
        cardConfig({ templateId: 'cardContactV1', userConfig: {

        } }),
        cardConfig({ templateId: 'cardMapsV1', userConfig: {
          standard: {
            headers: {
              title: 'Company Location',
              subTitle: 'Visit us at our headquarters',
            },

          },
          maps: [{ ...defaultMap, aspectRatio: 'ultrawide' }],
        } }),
      ],
    }),
  ]
}

export async function getConfig(args: Omit<SectionArgs, 'stock'>): Promise<ThemeConfig> {
  const { factory } = args
  const stock = await factory.getStockMedia()
  const a = { ...args, stock }
  const pages = await getPages(a)
  return {
    pages,
  }
}
