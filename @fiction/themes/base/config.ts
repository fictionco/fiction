import type { ThemeConfigArgs } from '@fiction/site'

import { cardConfig } from '@fiction/cards'

export async function getPages(args: ThemeConfigArgs) {
  return [
    cardConfig({
      slug: 'home',
      isHome: true,
      nav: 'show',
      cards: [cardConfig({ templateId: 'cardBlogV1' })],
    }),
  ]
}

export async function getConfig(args: Omit<ThemeConfigArgs, 'stock'>) {
  const { factory } = args
  const stock = await factory.getStockMedia()
  const a = { ...args, stock }

  return {
    pages: await getPages(a),
  }
}
