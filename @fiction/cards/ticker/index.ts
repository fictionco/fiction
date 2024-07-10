import { vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site'
import { z } from 'zod'
import { InputOption } from '@fiction/ui'
import { standardOption } from '../inputSets'

const TickerSchema = z.object({
  text: z.string(),
}).optional()

export type Quote = z.infer<typeof TickerSchema>
const defaultQuote: Quote[] = [{
  text: 'An investment in knowledge pays the best interest.',

}]

const UserConfigSchema = z.object({
  items: z.array(TickerSchema).optional(),
})

export type UserConfig = z.infer<typeof UserConfigSchema>
const templateId = 'ticker'
export const templates = [
  new CardTemplate({
    templateId,
    category: ['marketing'],
    description: 'Side-scrolling ticker of text and images.',
    icon: 'i-tabler-quote',
    colorTheme: 'green',
    el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),
    isPublic: false,
    options: [
      standardOption.ai(),
      new InputOption({
        input: 'InputList',
        key: `items`,
        options: [
          new InputOption({ key: 'text', label: 'Quote Text', input: 'InputText' }),
        ],
      }),
    ],
    schema: UserConfigSchema,
    userConfig: { items: defaultQuote },
    demoPage: async () => {
      return { cards: [{ templateId, userConfig: { } }] }
    },
  }),
] as const
