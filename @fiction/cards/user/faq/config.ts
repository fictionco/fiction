import type { CardFactory } from '@fiction/site/cardFactory'

import type { StandardUserConfig } from '@fiction/site/schema'
import type { InputOption } from '@fiction/ui'
import type { StockMedia } from '@fiction/ui/stock'
import { ActionAreaSchema, PostSchema } from '@fiction/core'
import { createOption } from '@fiction/ui'
import { z } from 'zod/v4'

const faqItemSchema = PostSchema.pick({
  title: true,
  content: true,
  icon: true,
  media: true,
}).meta({ ai: true, description: 'FAQ item with question and answer' })

export const schema = z.object({
  items: z.array(faqItemSchema).optional().meta({ ai: true, description: 'List of FAQ questions and answers' }),
  support: z.object({
    text: z.string().optional().meta({ ai: true, description: 'Help text shown below FAQs' }),
    action: ActionAreaSchema.optional().meta({ ai: true, description: 'Support actions like contact buttons' }),
  }).optional().meta({ ai: true, description: 'Additional support section below FAQs' }),
})

export type UserConfig = z.infer<typeof schema> & StandardUserConfig
export type FaqItem = z.infer<typeof faqItemSchema>

const options: InputOption[] = [
  createOption({
    key: 'items',
    label: 'FAQ Items',
    input: 'InputList',
    props: {
      itemLabel: args => (args?.item as FaqItem)?.title ?? 'Untitled',
      itemName: 'FAQ Item',
    },
    options: [
      createOption({
        key: 'items.0.title',
        label: 'Question/Title',
        input: 'InputText',
        props: { placeholder: '' },
      }),
      createOption({
        key: 'items.0.content',
        label: 'Answer/Content',
        input: 'InputTextarea',
        props: { rows: 3 },
      }),
      createOption({
        key: 'items.0.media',
        label: 'Media',
        input: 'InputMedia',
      }),
    ],
  }),
  createOption({
    key: 'support.text',
    label: 'Additional Text',
    input: 'InputText',
    props: { placeholder: 'Need additional help?' },
  }),
  createOption({
    key: 'support.action.buttons',
    label: 'Buttons',
    input: 'InputActions',
  }),
]

function getDefaultConfig(args: { stock: StockMedia }): UserConfig {
  const { stock } = args
  return {
    items: [
      {
        title: 'How can I make my FAQ section more engaging?',
        content: 'Imagine your FAQ as a friendly conversation guide. Use clear, conversational language and organize questions from most to least common.',
        icon: { class: 'i-tabler-message-circle-2' },
      },
      {
        title: 'Should I add media to my FAQ answers?',
        content: 'Visual elements can transform complex explanations. Diagrams, screenshots, or illustrations make concepts clearer.',
        icon: { class: 'i-tabler-photo' },
        media: stock.getRandomByTags(['aspect:landscape']),
      },
    ],
    support: {},
  }
}

export async function getConfig(args: { templateId: string, factory: CardFactory }) {
  const { factory } = args
  const stock = await factory.getStockMedia()
  const defaultConfig = getDefaultConfig({ stock })
  return {
    schema,
    options,
    userConfig: defaultConfig,
    demoPage: {
      cards: [
        { templateId: args.templateId, userConfig: defaultConfig },
      ],
    },
  }
}
