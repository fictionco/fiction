import { vue } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import { CardTemplate } from '@fiction/site'
import { z } from 'zod'

const templateId = 'hitlist'

const schema = z.object({
  layout: z.enum(['default', 'left', 'right']).optional(),
  title: z.string().optional(),
  content: z.string().optional(),
  media: z.object({
    format: z.enum(['url', 'video']).optional(),
    url: z.string().optional(),
  }).optional(),
  items: z.array(z.object({
    title: z.string().optional(),
    subTitle: z.string().optional(),
  })),
})

export type UserConfig = z.infer<typeof schema>

const options: InputOption[] = [
  new InputOption({ key: 'label', label: 'Label', input: 'InputText' }),
  new InputOption({ key: 'layout', label: 'Layout', input: 'InputSelect', list: ['inline', 'stacked'] }),
  new InputOption({ key: 'items', label: 'Items', input: 'InputList', options: [
    new InputOption({ key: 'name', label: 'Name', input: 'InputText' }),
    new InputOption({ key: 'href', label: 'Link', input: 'InputText' }),
    new InputOption({ key: 'media', label: 'Image URL', input: 'InputMediaDisplay' }),
  ] }),
]

function isThisYouConfig(): UserConfig {
  return {
    title: 'Tell Me, Is This You?',
    items: [
      {
        title: `Your reputation isn't growing as quickly as you expected, and you're not sure why.`,
      },
      {
        title: `You share work-related content randomly, without a clear purpose or long-term plan.`,
      },
      {
        title: `Your professional network and visibility have stopped expanding, but you don't know how to reignite growth.`,
      },
      {
        title: `Peers in your field are gaining more recognition than you, even though your work is just as valuable.`,
      },
      {
        title: `Your career is succeeding in most areas, but you know improving your professional visibility could lead to even bigger opportunities.`,
      },
      {
        title: `You know showcasing your work is important, but you're having trouble making it look professional online.`,
      },
    ],

  }
}

function imagineConfig(): UserConfig {
  return {
    title: 'Imagine If...',
    media: { format: 'url' as const, url: 'https://imagedelivery.net/mxykd8B2Zc6Xxmx1NDi9mA/9621afe1-115d-4f7d-6e37-b348c851ae00/public' },

    items: [
      {
        title: `You had a clear strategy to build your professional reputation, knowing exactly who your target audience is and how to engage them effectively.`,
      },
      {
        title: `You could confidently adapt your expertise to various digital formats, making your content feel current and relevant.`,
      },
      {
        title: `Every piece of content you shared aligned perfectly with your long-term career goals and personal brand vision.`,
      },
      {
        title: `You understood the exact steps to take to expand your professional network and increase your visibility in your industry.`,
      },
      {
        title: `Your unique value was widely recognized, leading to exciting opportunities and collaborations in your field.`,
      },
      {
        title: `Your personal brand became a powerful asset, opening doors to new career heights and business growth you've always dreamed of.`,
      },
    ],
  }
}

function getUserConfig(): UserConfig {
  return {
    title: 'Introducing Fiction',
    media: { format: 'url' as const, url: 'https://imagedelivery.net/mxykd8B2Zc6Xxmx1NDi9mA/440c92f7-268c-4ae9-24ed-08632303c200/public' },

    items: [
      {
        title: `Craft stunning websites that showcase your expertise and captivate your audience, setting you apart in your industry.`,
      },
      {
        title: `Design professional emails that resonate with your network, turning connections into valuable opportunities.`,
      },
      {
        title: `Create engaging newsletters that keep your audience informed and position you as a thought leader in your field.`,
      },
      {
        title: `Develop smart forms that capture leads and insights, growing your professional network strategically.`,
      },
      {
        title: `Integrate seamlessly across platforms, ensuring your personal brand remains consistent and impactful wherever your audience finds you.`,
      },
      {
        title: `Leverage data-driven insights to refine your strategy, continuously improving your professional marketing efforts for maximum impact.`,
      },
    ],

    content: `Fiction: Your All-in-One Personal Marketing Platform

A comprehensive solution empowering professionals to elevate their personal brand from overlooked to outstanding. Fiction provides the tools and strategies to create a cohesive online presence, attract the right opportunities, and achieve the professional recognition you've always deserved.

Transform your digital footprint into a powerful asset that opens doors, builds credibility, and drives your career or business to new heights.`,
  }
}

export const templates = [
  new CardTemplate({
    templateId,
    category: ['marketing'],
    description: 'A staggered list of talking points',
    icon: 'i-tabler-list',
    colorTheme: 'rose',
    el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),
    schema,
    options,
    isPublic: true,
    getUserConfig: async () => isThisYouConfig(),
    demoPage: async () => {
      return {
        cards: [
          { templateId, userConfig: isThisYouConfig() },
          { templateId, userConfig: {
            ...imagineConfig(),
            layout: 'left' as const,
          } },
          { templateId, userConfig: {
            ...getUserConfig(),
            layout: 'right' as const,
          } },
        ],
      }
    },
  }),
] as const
