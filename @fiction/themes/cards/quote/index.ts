import { vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site'
import { z } from 'zod'
import { InputOption } from '@fiction/ui'
import { standardOption } from '../inputSets'

const MediaSchema = z.object({
  url: z.string().optional(),
  html: z.string().optional(),
  format: z.enum(['html', 'url']).optional(),
}).optional()

const QuoteSchema = z.object({
  text: z.string(),
  author: z.object({
    name: z.string(),
    title: z.string().optional(),
    image: MediaSchema,
    href: z.string().optional(),
  }).optional(),
  org: z.object({
    name: z.string().optional(),
    image: MediaSchema,
    href: z.string().optional(),
  }).optional(),
}).optional()

export type Quote = z.infer<typeof QuoteSchema>

const UserConfigSchema = z.object({
  quotes: z.array(QuoteSchema).optional(),
})

export type UserConfig = z.infer<typeof UserConfigSchema>

export const templates = [
  new CardTemplate({
    templateId: 'quotes',
    category: ['marketing'],
    description: 'A quote card with author and organization information',
    icon: 'i-tabler-quote',
    iconTheme: 'green',
    el: vue.defineAsyncComponent(() => import('./ElQuote.vue')),
    isPublic: true,
    options: [
      standardOption.ai(),
      new InputOption({
        input: 'InputList',
        key: `quotes`,
        options: [
          new InputOption({ key: 'text', label: 'Quote Text', input: 'InputText' }),
          new InputOption({ key: 'author.name', label: 'Author', input: 'InputText' }),
          new InputOption({ key: 'author.title', label: 'Title', input: 'InputText' }),
          new InputOption({ key: 'author.image', label: 'Author Image', input: 'InputMedia' }),
          new InputOption({ key: 'author.href', label: 'Author Link', input: 'InputUrl' }),
          new InputOption({ key: 'org.name', label: 'Organization', input: 'InputText' }),
          new InputOption({ key: 'org.image', label: 'Organization Image', input: 'InputMedia' }),
          new InputOption({ key: 'org.href', label: 'Organization Link', input: 'InputUrl' }),
        ],
      }),
    ],
    schema: UserConfigSchema,
  }),
] as const
