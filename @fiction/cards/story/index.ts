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
    mediaItems: z.array(z.object({
      name: z.string().optional(),
    })).optional(),
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
        title: 'The Unexpected Call',
        content: `In my final year at Oxford, a government agent approached me with an offer I couldn't refuse. My skills in languages, physical fitness, and problem-solving had caught their attention. Little did I know, this was the beginning of my journey into the world of espionage.
        In my final year at Oxford, a government agent approached me with an offer I couldn't refuse. My skills in languages, physical fitness, and problem-solving had caught their attention. Little did I know, this was the beginning of my journey into the world of espionage.`,
      },
      {
        title: 'The Rigorous Training',
        content: `I was taken to a top-secret facility where I underwent intense training. Hand-to-hand combat, marksmanship, advanced driving, and psychological conditioning were just the beginning. The training was grueling, but it transformed me into a highly skilled operative.`,
      },
      {
        title: 'Mastering the Craft',
        content: `Beyond the physical training, I learned to handle sophisticated gadgets, conduct covert surveillance, and execute cyber-operations. My ability to blend in and adapt to different cultures was refined through numerous field exercises, making me ready for any mission.`,
      },
      {
        title: 'The First Mission',
        content: `My first mission was to infiltrate a high-profile event and gather intelligence on a potential threat. With nerves of steel and skills honed to perfection, I successfully completed the mission, proving that I was ready for the challenges that lay ahead.`,
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
