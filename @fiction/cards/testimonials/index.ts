import { MediaDisplaySchema, vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site'
import { z } from 'zod'
import { InputOption } from '@fiction/ui'
import { h } from 'vue'
import { standardOption } from '../inputSets'

const templateId = 'ticker'

const TestimonialSchema = z.object({
  title: z.string().optional().describe('The title of the testimonial'),
  content: z.string().optional().describe('The content of the testimonial'),
  media: MediaDisplaySchema.optional().describe('The image associated with the testimonial'),
  author: z.object({
    fullName: z.string().optional().describe('The name of the author'),
    title: z.string().optional().describe('The title of the author'),
    avatar: MediaDisplaySchema.optional().describe('The image of the author'),
    href: z.string().optional().describe('The link to the author\'s website'),
  }).optional().describe('The author of the testimonial'),
  stars: z.number().min(0).max(5).optional().describe('The number of stars for the testimonial'),
}).describe('Schema for individual testimonial item')

export const UserConfigSchema = z.object({
  layout: z.enum(['slider', 'grid', 'hero', 'mega']).optional().describe('The layout of the testimonial items'),
  items: z.array(TestimonialSchema).describe('Array of ticker items').optional(),
})

export type Testimonial = z.infer<typeof TestimonialSchema>
export type UserConfig = z.infer<typeof UserConfigSchema>

const options: InputOption[] = [
  standardOption.ai(),
  new InputOption({
    input: 'InputList',
    key: `items`,
    options: [

    ],
  }),
]

const defaultConfig: UserConfig = {
  items: [],
}

const demoCard2: UserConfig = {
  items: [],
}

export const templates = [
  new CardTemplate({
    templateId,
    category: ['marketing'],
    description: 'Side-scrolling ticker of text and images.',
    icon: 'i-tabler-quote',
    colorTheme: 'green',
    el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),
    isPublic: true,
    options,
    schema: UserConfigSchema,
    getUserConfig: () => defaultConfig,
    demoPage: async () => {
      return { cards: [
        { templateId, userConfig: { ...defaultConfig } },
        { templateId, userConfig: { ...demoCard2 } },
      ] }
    },
  }),
] as const
