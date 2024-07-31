import { vue } from '@fiction/core'
import type { Site } from '@fiction/site'
import { CardTemplate } from '@fiction/site'
import { z } from 'zod'
import { InputOption } from '@fiction/ui'
import type { SiteUserConfig } from '@fiction/site/schema'
import { standardOption } from '../inputSets'

const templateId = 'mason'

const MediaItemSchema = z.object({
  title: z.string().optional(),
  content: z.string(),
  href: z.string().optional(),
  media: z.object({
    format: z.enum(['url', 'video']).optional(),
    url: z.string().optional(),
  }).optional(),
  columns: z.enum(['1', '2', '3', '4']).optional(),
  rows: z.enum(['1', '2', '3', '4']).optional(),
})

export type MediaItem = z.infer<typeof MediaItemSchema>

const UserConfigSchema = z.object({
  items: z.array(MediaItemSchema).optional(),
})

export type UserConfig = z.infer<typeof UserConfigSchema>

async function getUserConfig(_args: { site: Site }): Promise<UserConfig & SiteUserConfig> {
  return {
    items: [
      {
        title: 'Agent to the Stars',
        content: `This platform revolutionized my online presence. Through my site and newsletter I've radically changed my business.`,
        media: { format: 'url', url: `https://imagedelivery.net/mxykd8B2Zc6Xxmx1NDi9mA/1ef69a86-f589-4394-b8a0-1418b1633700/public` },
        columns: '1',
      },
      {
        title: `Winner Best Director '22`,
        content: `Fiction helps me stay connected with my audience like no other tool. It does the work of an entire PR agency, but better.`,
        media: { format: 'url', url: `https://imagedelivery.net/mxykd8B2Zc6Xxmx1NDi9mA/409fc2dd-c35a-4712-d25b-2a4926dc8200/public` },
        columns: '2',
      },
      {
        title: '10k+ followers gained in 3 months',
        content: `I used to struggle with all the tools needed to market myself. I haven't had a problem since using Fiction.`,
        media: { format: 'url', url: `https://imagedelivery.net/mxykd8B2Zc6Xxmx1NDi9mA/4348dcd3-8229-4fbe-8c26-3a5ab89b9500/public` },
        columns: '1',
      },
      {
        title: '',
        content: `I'm not a tech person, but Fiction made it easy for me to create a beautiful online presence that I can manage myself.`,
        media: { format: 'url', url: `https://imagedelivery.net/mxykd8B2Zc6Xxmx1NDi9mA/a7fd5370-2a94-4460-91b5-c6a0f6298900/public` },
        columns: '1',
        rows: '2',
      },
      {
        title: '',
        content: `I didn't know what I was missing until I started using Fiction. It's like having a personal assistant for my online presence.`,
        media: { format: 'url', url: `https://imagedelivery.net/mxykd8B2Zc6Xxmx1NDi9mA/e5a68a49-f5d9-4e66-84a9-b52050aacc00/public` },
        columns: '1',
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
    title: 'Mason Gallery',
    category: ['media'],
    description: 'A masonry layout for a gallery of images or videos with captions.',
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
          { templateId, userConfig: { ...userConfig, standard: { headers: { title: 'Standard Layout' } } } },
        ],
      }
    },
  }),
] as const
