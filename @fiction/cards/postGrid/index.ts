import { PostSchema, vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'

const templateId = 'story'

const schema = z.object({
  postMode: z.enum(['global', 'custom']).optional(),
  customPosts: z.array(PostSchema).optional(),
})

export type UserConfig = z.infer<typeof schema>

const options: InputOption[] = [
  new InputOption({ key: 'items', label: 'Tour Items', input: 'InputList', options: [] }),
]

async function defaultConfig(): Promise<UserConfig> {
  return {
    customPosts: [
      {
        title: 'Post 1',
        subTitle: 'The Academy',
        authors: [{ fullName: 'Andrew Powers', email: 'arpowers@gmail.com' }],
        content: `In my final year at the Academy, I was approached by a mysterious envoy bearing a proposal I could not dismiss. My prowess in rhetoric, physical discipline, and strategic thinking had not gone unnoticed. This encounter marked the inception of my odyssey into the realm of political intrigue.`,
        media: { url: '', format: 'url' },
      },
    ],
  }
}

export const templates = [
  cardTemplate({
    templateId,
    category: ['content'],
    description: 'Text that reveals itself as you scroll, with scrolling media items',
    icon: 'i-tabler-compass',
    colorTheme: 'green',
    el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),
    options,
    isPublic: false,
    getUserConfig: async () => defaultConfig(),
    demoPage: async () => {
      const userConfig = await defaultConfig()
      return {
        cards: [
          { templateId, userConfig },
        ],
      }
    },
  }),
] as const
