import { vue } from '@fiction/core'
import type { Site } from '@fiction/site'
import { CardTemplate } from '@fiction/site'
import { z } from 'zod'
import { InputOption } from '@fiction/ui'
import type { SiteUserConfig } from '@fiction/site/schema'
import { standardOption } from '../inputSets'

const templateId = 'testimonials'

const TestimonialSchema = z.object({
  title: z.string().optional(),
  content: z.string(),
  href: z.string().optional(),
  media: z.object({
    format: z.enum(['url', 'video']).optional(),
    url: z.string().optional(),
  }).optional(),
  user: z.object({
    fullName: z.string().optional(),
    title: z.string().optional(),
    avatar: z.object({
      format: z.enum(['url']).optional(),
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
  layout: z.enum(['slider', 'mega']).optional(),
  items: z.array(TestimonialSchema).optional(),
})

export type UserConfig = z.infer<typeof UserConfigSchema>

async function getUserConfig(_args: { site: Site }): Promise<UserConfig & SiteUserConfig> {
  return {
    items: [
      {
        title: 'Agent to the Stars',
        content: `This platform revolutionized my online presence. Through my site and newsletter I've radically changed my business.`,
        media: { url: `https://imagedelivery.net/mxykd8B2Zc6Xxmx1NDi9mA/1ef69a86-f589-4394-b8a0-1418b1633700/public` },
        user: {
          fullName: 'Amida Cheng',
          avatar: { url: `https://imagedelivery.net/mxykd8B2Zc6Xxmx1NDi9mA/7775964a-21c4-4920-6011-f01335cd4e00/public` },
          title: 'Celebrity Agent',
        },
      },
      {
        title: `Winner Best Director '22`,
        content: `Fiction helps me stay connected with my audience like no other tool. It does the work of an entire PR agency, but better.`,
        media: { url: `https://imagedelivery.net/mxykd8B2Zc6Xxmx1NDi9mA/409fc2dd-c35a-4712-d25b-2a4926dc8200/public` },

        user: {
          fullName: 'Xavier Williams',
          avatar: { url: `https://imagedelivery.net/mxykd8B2Zc6Xxmx1NDi9mA/377bd836-bd44-46fc-66df-4d602ee5fd00/public` },
          title: 'Director',
        },
      },
      {
        title: '10k+ followers gained in 3 months',
        content: `I used to struggle with all the tools needed to market myself. I haven't had a problem since using Fiction.`,
        media: { url: `https://imagedelivery.net/mxykd8B2Zc6Xxmx1NDi9mA/4348dcd3-8229-4fbe-8c26-3a5ab89b9500/public` },
        user: {
          fullName: 'Darius Ahmadi',
          avatar: { url: `https://imagedelivery.net/mxykd8B2Zc6Xxmx1NDi9mA/411b7e75-6fa4-412e-5632-7d85e8c4fa00/public` },
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
    getUserConfig: _ => getUserConfig(_),
    demoPage: async (_) => {
      const userConfig = await getUserConfig(_)
      return {
        cards: [
          { templateId, userConfig: { ...userConfig, layout: 'mega' as const } },
          { templateId, userConfig },
        ],
      }
    },
  }),
] as const
