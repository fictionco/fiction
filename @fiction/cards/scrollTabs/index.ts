import { url } from 'node:inspector'
import { type ActionItem, vue } from '@fiction/core'
import type { Site } from '@fiction/site'
import { CardTemplate } from '@fiction/site'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'
import { staticFileUrls } from '@fiction/site/utils/site'

const templateId = 'story'

const schema = z.object({
  items: z.array(z.object({
    header: z.string().optional(),
    subHeader: z.string().optional(),
    media: z.object({
      url: z.string().optional(),
      html: z.string().optional(),
      format: z.enum(['url', 'video', 'html']).optional(),
    }).optional(),
  })),
})

export type UserConfig = z.infer<typeof schema>

const options: InputOption[] = [
  new InputOption({ key: 'items', label: 'Tour Items', input: 'InputList', options: [] }),
]

async function defaultConfig(args: { site: Site }): Promise<UserConfig> {
  const { site } = args

  const filenames = ['bond1.png', 'bond2.jpg'] as const

  const urls = staticFileUrls({ site, filenames })

  return {
    items: [
      {
        header: `Title`,
        subHeader: `Subtitle`,
        media: { url: urls.bond1, format: 'url' },
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
    schema,
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
