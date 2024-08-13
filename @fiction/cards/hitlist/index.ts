import { vue } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import { CardTemplate } from '@fiction/site'
import { z } from 'zod'

const templateId = 'hitlist'

const schema = z.object({
  title: z.string().optional(),
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

function getUserConfig(): UserConfig {
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
    getUserConfig: async () => getUserConfig(),
    demoPage: async () => {
      return {
        cards: [
          { templateId, userConfig: getUserConfig() },
        ],
      }
    },
  }),
] as const
