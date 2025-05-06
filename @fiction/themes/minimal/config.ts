import type { ThemeConfig, ThemeConfigArgs } from '@fiction/site'

import type { StockMedia } from '@fiction/ui/stock'
import { cardConfig } from '@fiction/cards/index'

type SectionArgs = ThemeConfigArgs & {
  stock: StockMedia
}

export async function getPages(args: SectionArgs) {
  const { factory } = args

  const { defaultMap } = await import('@fiction/cards/user/maps/config')

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
          templateId: 'cardBlogV1',
        }),
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
