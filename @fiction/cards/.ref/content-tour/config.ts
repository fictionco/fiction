import type { CardFactory } from '@fiction/site/cardFactory'
import type { StockMedia } from '@fiction/ui/stock'
import { createOption } from '@fiction/ui'
import { z } from 'zod'
import { getOptions as getHeroOptions, schema as heroSchema } from '../content-hero/config'

// Main tour schema
export const schema = z.object({
  items: z.array(heroSchema).describe('Your story chapters - each a unique visual narrative'),
})

export type HeroConfig = z.infer<typeof heroSchema>
export type UserConfig = z.infer<typeof schema>

const options = [
  createOption({
    input: 'group',
    key: 'tourItemGroup',
    label: 'Tour Items',
    options: [
      createOption({
        key: 'items',
        input: 'InputList',
        props: {
          itemName: 'Tour Item',
          itemLabel: args => (args?.item as HeroConfig)?.title ?? 'Untitled',
        },
        options: getHeroOptions(),
      }),
    ],
  }),

]

// Create engaging demo content


export async function getConfig(args: { templateId: string, factory: CardFactory }) {
  const stock = await args.factory.getStockMedia()
  const demo = await getDemoContent({ ...args, stock })

  return {
    schema,
    options,
    userConfig: {
      items: [demo.items[0]], // Start with single compelling example
    },
    demoPage: {
      cards: [{ templateId: args.templateId, userConfig: demo }],
    },
  }
}
