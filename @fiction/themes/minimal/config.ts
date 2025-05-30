import type { ThemeConfig, ThemeConfigArgs } from '@fiction/site'

import type { StockMedia } from '@fiction/ui/stock'
import { cardConfig } from '@fiction/cards/index'

type SectionArgs = ThemeConfigArgs & {
  stock: StockMedia
}

export async function getPages() {
  return [
    cardConfig({
      slug: 'home',
      title: 'Home',
      isHome: true,
      templateId: 'cardPageWrapV1',
      cards: [
        cardConfig({ templateId: 'cardProfileV1' }),
        cardConfig({ templateId: 'cardBentoV1' }),
        cardConfig({ templateId: 'cardQuotesV1' }),
      ],
    }),
    cardConfig({
      slug: 'blog',
      templateId: 'cardPageWrapV1',
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
  const pages = await getPages()
  return {
    pages,
  }
}
