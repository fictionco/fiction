import { vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site'
import { z } from 'zod'
import { InputOption } from '@fiction/ui'
import type { SiteUserConfig } from '@fiction/site/schema'
import { standardOption } from '../inputSets'
import { stockMediaHandler } from '../stock/index.js'

const templateId = 'testimonials'

const TestimonialSchema = z.object({
  title: z.string().optional(),
  content: z.string(),
  href: z.string().optional(),
  media: z.object({
    format: z.enum(['url', 'video', 'image']).optional(),
    url: z.string().optional(),
  }).optional(),
  user: z.object({
    fullName: z.string().optional(),
    title: z.string().optional(),
    avatar: z.object({
      format: z.enum(['url', 'video', 'image']).optional(),
      url: z.string().optional(),
    }).optional(),
  }).optional(),
  action: z.object({
    name: z.string().optional(),
    href: z.string().optional(),
  }).optional(),
})

export type Testimonial = z.infer<typeof TestimonialSchema>

const UserConfigSchema = z.object({
  layout: z.enum(['slider', 'mega', 'masonry']).optional(),
  items: z.array(TestimonialSchema).optional(),
})

export type UserConfig = z.infer<typeof UserConfigSchema>

async function getUserConfig(): Promise<UserConfig & SiteUserConfig> {
  return {
    items: [
      {
        title: 'Agent to the Stars',
        content: `This platform revolutionized my online presence. Through my site and newsletter I've radically changed my business.`,
        media: stockMediaHandler.getRandomByTags(['person', 'aspect:landscape', 'woman', 'silhouette']),
        user: {
          fullName: 'Amida Cheng',
          avatar: stockMediaHandler.getRandomByTags(['person', 'aspect:square', 'silhouette', 'woman']),
          title: 'Celebrity Agent',
        },
      },
      {
        title: `Winner Best Director '22`,
        content: `Fiction helps me stay connected with my audience like no other tool. It does the work of an entire PR agency, but better.`,
        media: stockMediaHandler.getRandomByTags(['person', 'aspect:landscape', 'midshot', 'man']),

        user: {
          fullName: 'Xavier Williams',
          avatar: stockMediaHandler.getRandomByTags(['person', 'aspect:square', 'silhouette', 'man']),
          title: 'Director',
        },
      },

      {
        title: '',
        content: `I'm not a tech person, but Fiction made it easy for me to create a beautiful online presence that I can manage myself.`,
        media: stockMediaHandler.getRandomByTags(['person', 'aspect:landscape', 'midshot', 'woman']),
        user: {
          fullName: 'Forest MontClair',
          avatar: stockMediaHandler.getRandomByTags(['person', 'aspect:square', 'silhouette', 'woman']),
          title: 'Influencer',
        },
      },
      {
        title: '',
        content: `I didn't know what I was missing until I started using Fiction. It's like having a personal assistant for my online presence.`,
        media: stockMediaHandler.getRandomByTags(['person', 'aspect:landscape', 'midshot', 'woman']),
        user: {
          fullName: 'Casey Moreau',
          avatar: stockMediaHandler.getRandomByTags(['person', 'aspect:square', 'silhouette', 'woman']),
          title: 'Fashion Designer',
        },
      },
      {
        title: '10k+ followers gained in 3 months',
        content: `I used to struggle with all the tools needed to market myself. I haven't had a problem since using Fiction.`,
        media: stockMediaHandler.getRandomByTags(['person', 'aspect:landscape', 'midshot', 'man']),
        user: {
          fullName: 'Darius Ahmadi',
          avatar: stockMediaHandler.getRandomByTags(['person', 'aspect:square', 'silhouette', 'man']),
          title: 'Author / Coach',
        },

      },
    ],

  }
}

const options = [
  standardOption.ai(),
  new InputOption({
    input: 'InputList',
    key: `items`,
    options: [
      new InputOption({ key: 'content', label: 'Quote Text', input: 'InputText' }),
    ],
  }),
]

export const templates = [
  new CardTemplate({
    templateId,
    category: ['content', 'basic'],
    description: 'Testimonials from happy customers or users.',
    icon: 'i-tabler-message-bolt',
    colorTheme: 'emerald',
    el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),
    isPublic: false,
    options,
    schema: UserConfigSchema,
    getBaseConfig: () => ({ standard: { } }),
    getUserConfig: () => getUserConfig(),
    demoPage: async (_) => {
      const userConfig = await getUserConfig()
      return {
        cards: [
          { templateId, userConfig: { ...userConfig, layout: 'mega' as const, standard: { headers: { title: 'Mega Layout' } } } },
          { templateId, userConfig: { ...userConfig, layout: 'masonry' as const, standard: { headers: { title: 'Masonry Layout' } } } },
          { templateId, userConfig: { ...userConfig, standard: { headers: { title: 'Slider Layout' } } } },
        ],
      }
    },
  }),
] as const
