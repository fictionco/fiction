import type { ThemeConfigArgs } from '@fiction/site'

import { cardConfig } from '@fiction/cards'

export async function getPages(args: ThemeConfigArgs) {
  return [
    cardConfig({
      slug: 'home',
      isHome: true,
      cards: [
        cardConfig({
          templateId: 'cardHeroV1',
          userConfig: {
            items: [
              {
                title: 'Hello World',
                subTitle: 'Welcome to your new site',
              },
            ],
          },
        }),
      ],
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
