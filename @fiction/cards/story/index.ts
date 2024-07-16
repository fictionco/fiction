import { type ActionItem, vue } from '@fiction/core'
import type { Site } from '@fiction/site'
import { CardTemplate } from '@fiction/site'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'
import { staticFileUrls } from '@fiction/site/utils/site'

const templateId = 'story'

const schema = z.object({
  items: z.array(z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    media: z.object({
      url: z.string().optional(),
      html: z.string().optional(),
      format: z.enum(['url', 'video', 'html']).optional(),
    }).optional(),
    actions: z.array(z.object({
      name: z.string().optional(),
      href: z.string().optional(),
    })).optional(),
  })),
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
    items: [
      {
        content: `In my final year at the Academy, I was approached by a mysterious envoy bearing a proposal I could not dismiss. My prowess in rhetoric, physical discipline, and strategic thinking had not gone unnoticed. This encounter marked the inception of my odyssey into the realm of political intrigue.`,
        media: { url: urls.bond1, format: 'url' },
        actions: [{ name: 'Read More', href: 'https://en.wikipedia.org/wiki/James_Bond' }],
      },
      {
        content: `I was whisked away to a clandestine location where I endured rigorous training. Mastery of oratory, the art of persuasion, defensive strategies, and mental fortitude were merely the beginning. The strenuous regimen refined me into a formidable advocate of the Republic.`,
        media: { url: urls.bond2, format: 'url' },
      },
      {
        content: `Beyond the corporeal drills, I honed my skills in utilizing sophisticated communication tools, conducting discreet observations, and orchestrating clandestine operations. My ability to navigate and integrate into various cultural milieus was sharpened through extensive exercises, preparing me for any diplomatic endeavor.`,
        media: { url: urls.bond3, format: 'url' },
      },
      {
        content: `My inaugural mission was to penetrate a prestigious assembly and gather intelligence on a looming conspiracy. With unwavering resolve and meticulously honed abilities, I accomplished the mission, affirming my readiness for the intricate challenges that lay ahead in the service of England.`,
        media: { url: urls.bond4, format: 'url' },
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
