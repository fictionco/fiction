import { PostSchema, vue } from '@fiction/core'
import type { Site } from '@fiction/site'
import { CardTemplate } from '@fiction/site'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'
import { staticFileUrls } from '@fiction/site/utils/site'

const templateId = 'story'

const schema = z.object({
  postMode: z.enum(['global', 'custom']).optional(),
  customPosts: z.array(PostSchema).optional(),
})

export type UserConfig = z.infer<typeof schema>

const options: InputOption[] = [
  new InputOption({ key: 'items', label: 'Tour Items', input: 'InputList', options: [] }),
]

async function defaultConfig(args: { site: Site }): Promise<UserConfig> {
  const { site } = args

  const filenames = ['bond1.png', 'bond2.jpg', 'bond3.jpg', 'bond4.png'] as const

  const urls = staticFileUrls({ site, filenames })

  return {
    customPosts: [
      {
        title: 'Post 1',
        subTitle: 'The Academy',
        authors: [{ fullName: 'Andrew Powers', email: 'arpowers@gmail.com' }],
        content: `In my final year at the Academy, I was approached by a mysterious envoy bearing a proposal I could not dismiss. My prowess in rhetoric, physical discipline, and strategic thinking had not gone unnoticed. This encounter marked the inception of my odyssey into the realm of political intrigue.`,
        image: { url: urls.bond1, format: 'url' },
      },
    ],
  }
}

export const templates = [
  new CardTemplate({
    templateId,
    category: ['content'],
    description: 'Text that reveals itself as you scroll, with scrolling media items',
    icon: 'i-tabler-compass',
    colorTheme: 'green',
    el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),
    options,
    isPublic: false,
    getUserConfig: async args => defaultConfig(args),
    demoPage: async (args) => {
      const userConfig = await defaultConfig(args)
      return {
        cards: [
          { templateId, userConfig },
        ],
      }
    },
  }),
] as const
