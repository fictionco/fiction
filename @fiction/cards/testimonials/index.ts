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
  items: z.array(TestimonialSchema).optional(),
})

export type UserConfig = z.infer<typeof UserConfigSchema>

async function getUserConfig(_args: { site: Site }): Promise<UserConfig & SiteUserConfig> {
  return {
    items: [
      {
        title: 'From Unknown to Influencer',
        content: `This platform revolutionized my online presence!`,
        user: {
          fullName: 'Sarah Johnson',
          avatar: { url: `https://images.unsplash.com/photo-1542596594-649edbc13630?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D` },
          title: 'Influencer',
        },
      },
      {
        title: `Featured in Forbes "30 Under 30"`,
        content: `I've tripled my client base since using this tool.`,
        user: {
          fullName: 'David Chase',
          avatar: { url: `https://images.unsplash.com/photo-1597651711127-600d0c2e78b0?q=80&w=3314&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D` },
          title: 'Entrepreneur',
        },
      },
      {
        title: '10k+ followers gained in 3 months',
        content: `Easy to use and incredibly effective. A must-have!`,
        user: {
          fullName: 'Max Cambell',
          avatar: { url: `https://images.unsplash.com/photo-1624224971170-2f84fed5eb5e?q=80&w=3398&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D` },
          title: 'Author / Speaker',
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
    getBaseConfig: () => ({ standard: { spacing: { contentWidth: 'none' } } }),
    getUserConfig: _ => getUserConfig(_),
    demoPage: async (_) => {
      const userConfig = await getUserConfig(_)
      return {
        cards: [
          { templateId, userConfig },
        ],
      }
    },
  }),
] as const
