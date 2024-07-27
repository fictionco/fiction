import { ActionButtonSchema, vue } from '@fiction/core'
import type { Site, TableCardConfig } from '@fiction/site'
import { CardTemplate } from '@fiction/site'
import { z } from 'zod'
import { InputOption } from '@fiction/ui'
import type { SiteUserConfig } from '@fiction/site/schema'
import { CardFactory } from '@fiction/site/cardFactory'
import { standardOption } from '../inputSets'
import { getCardTemplates } from '../index.js'

const templateId = 'statement'

const StatementSchema = z.object({
  title: z.string().optional(),
  content: z.string(),
  actions: z.array(ActionButtonSchema).optional(),
})

export type Statement = z.infer<typeof StatementSchema>

const UserConfigSchema = z.object({
  items: z.array(StatementSchema).optional(),
})

export type UserConfig = z.infer<typeof UserConfigSchema>

async function getEffects(args: { site: Site }): Promise<TableCardConfig[]> {
  const { site } = args
  const templates = await getCardTemplates()
  const factory = new CardFactory({ templates, site })
  const shapeEffect = await factory.create({ templateId: 'effectShape', userConfig: {
    shapes: [
      { shape: 'circle', position: { origin: 'topRight', offsetX: -14, offsetY: -4 }, scale: 3, color: 'blue' },
    ],
  } })

  return [shapeEffect]
}

async function getUserConfig(_args: { site: Site }): Promise<UserConfig & SiteUserConfig> {
  return {
    items: [
      {
        title: 'Are you struggling to market yourself amidst the noise?',
        content: `Most people are. That's why you need to create a personal brand and learn to market yourself. That's where we come in.  `,
        actions: [{ name: 'Add To Network', href: '#', theme: 'primary' }],
      },

    ],
    standard: {
      scheme: {
        base: {
          bg: {
            format: 'video',
            url: 'https://videos.pexels.com/video-files/2421545/2421545-uhd_2560_1440_30fps.mp4',
            overlay: {
              opacity: 0.75,
              color: 'black',
            },
          },
        },
      },

    },

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
    description: 'Display a statement to focus and highlight your mission, objective, goals, etc. .',
    icon: 'i-tabler-message-bolt',
    colorTheme: 'emerald',
    el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),
    isPublic: false,
    options,
    schema: UserConfigSchema,
    getBaseConfig: () => ({ standard: { spacing: { verticalSpacing: 'xl' } } }),
    getUserConfig: _ => getUserConfig(_),
    getEffects: async _ => getEffects(_),
    demoPage: async (_) => {
      const userConfig = await getUserConfig(_)
      const effects = await getEffects(_)
      return { cards: [{ templateId, userConfig, effects }] }
    },
  }),
] as const
