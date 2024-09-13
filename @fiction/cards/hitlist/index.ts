import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'
import { InputOption } from '@fiction/ui'
import { stockMediaHandler } from '@fiction/ui/stock/index.js'
import { z } from 'zod'

const templateId = 'hitlist'

const schema = z.object({
  layout: z.enum(['default', 'left', 'right']).optional(),
  title: z.string().optional(),
  media: z.object({
    format: z.enum(['url', 'video', 'image']).optional(),
    url: z.string().optional(),
  }).optional(),
  items: z.array(z.object({
    content: z.string().optional(),
  })),
})

export type UserConfig = z.infer<typeof schema>

const options: InputOption[] = [
  new InputOption({ key: 'label', label: 'Label', input: 'InputText' }),
  new InputOption({ key: 'layout', label: 'Layout', input: 'InputSelect', list: ['inline', 'stacked'] }),
  new InputOption({ key: 'title', label: 'Title', input: 'InputText' }),
  new InputOption({ key: 'media', label: 'Media', input: 'InputMedia' }),
  new InputOption({ key: 'items', label: 'Items', input: 'InputList', options: [
    new InputOption({ key: 'content', label: 'Text', input: 'InputText' }),
  ] }),
]

function isThisYouConfig(): UserConfig {
  return {
    title: 'Tell Me, Is This You?',
    items: [
      {
        content: `Your reputation isn't growing as quickly as you expected, and you're not sure why.`,
      },
      {
        content: `You share work-related content randomly, without a clear purpose or long-term plan.`,
      },
      {
        content: `Your professional network and visibility have stopped expanding, but you don't know how to reignite growth.`,
      },
      {
        content: `Peers in your field are gaining more recognition than you, even though your work is just as valuable.`,
      },
      {
        content: `Your career is succeeding in most areas, but you know improving your professional visibility could lead to even bigger opportunities.`,
      },
      {
        content: `You know showcasing your work is important, but you're having trouble making it look professional online.`,
      },
    ],

  }
}

function imagineConfig(): UserConfig {
  return {
    title: 'Imagine If...',
    media: stockMediaHandler.getRandomByTags(['person', 'aspect:portrait']),

    items: [
      {
        content: `You had a clear strategy to build your professional reputation, knowing exactly who your target audience is and how to engage them effectively.`,
      },
      {
        content: `You could confidently adapt your expertise to various digital formats, making your content feel current and relevant.`,
      },
      {
        content: `Every piece of content you shared aligned perfectly with your long-term career goals and personal brand vision.`,
      },
      {
        content: `You understood the exact steps to take to expand your professional network and increase your visibility in your industry.`,
      },
      {
        content: `Your unique value was widely recognized, leading to exciting opportunities and collaborations in your field.`,
      },
      {
        content: `Your personal brand became a powerful asset, opening doors to new career heights and business growth you've always dreamed of.`,
      },
    ],
  }
}

function getUserConfig(): UserConfig {
  return {
    title: 'Introducing Fiction',
    media: stockMediaHandler.getRandomByTags(['person', 'aspect:portrait']),

    items: [
      {
        content: `Craft stunning websites that showcase your expertise and captivate your audience, setting you apart in your industry.`,
      },
      {
        content: `Design professional emails that resonate with your network, turning connections into valuable opportunities.`,
      },
      {
        content: `Create engaging newsletters that keep your audience informed and position you as a thought leader in your field.`,
      },
      {
        content: `Develop smart forms that capture leads and insights, growing your professional network strategically.`,
      },
      {
        content: `Integrate seamlessly across platforms, ensuring your personal brand remains consistent and impactful wherever your audience finds you.`,
      },
      {
        content: `Leverage data-driven insights to refine your strategy, continuously improving your professional marketing efforts for maximum impact.`,
      },
    ],

  }
}

export const templates = [
  cardTemplate({
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
