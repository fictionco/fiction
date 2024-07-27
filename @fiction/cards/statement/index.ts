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
      { shape: 'circle', position: { origin: 'topLeft', offsetX: 23, offsetY: 0 }, scale: 3, opacity: 0.05 },
    ],
  } })

  return [shapeEffect]
}

async function getUserConfig(_args: { site: Site }): Promise<UserConfig & SiteUserConfig> {
  return {
    items: [
      {
        title: 'Struggling to Stand Out?',
        content: `Many people find it challenging to market themselves in today's noisy world. Building a personal brand is essential. We're here to help you shine.`,
        actions: [{ name: 'Join Our Network', href: '#', theme: 'outline' }],
      },
      {
        title: 'Need a Unique Voice?',
        content: `Finding your unique voice can be tough. Developing a personal brand is the key to distinguishing yourself. Let us guide you through the process.`,
        actions: [{ name: 'Join Our Network', href: '#', theme: 'outline' }],
      },
      {
        title: 'Overwhelmed by Self-Doubt?',
        content: `Overcoming self-doubt is crucial to effective self-marketing. Our expertise in personal branding can help you build confidence and attract opportunities.`,
        actions: [{ name: 'Join Our Network', href: '#', theme: 'outline' }],
      },
    ],
    standard: {
      scheme: {
        base: {
          bg: {
            format: 'video',
            url: 'https://videos.pexels.com/video-files/4179289/4179289-uhd_2560_1440_30fps.mp4',
            overlay: {
              opacity: 0.80,
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
    getBaseConfig: () => ({ standard: { spacing: { verticalSpacing: 'xl', contentWidth: 'none' } } }),
    getUserConfig: _ => getUserConfig(_),
    getEffects: async _ => getEffects(_),
    demoPage: async (_) => {
      const userConfig = await getUserConfig(_)
      const effects = await getEffects(_)
      return { cards: [
        { templateId, userConfig, effects },
        { templateId, userConfig: {
          items: [
            {
              title: 'Build Your Personal Brand',
              content: 'Take control of your online presence with our platform. Create a stunning website, capture email subscribers, and engage with your audience effortlessly. Elevate your personal brand and stand out in your industry.',
              actions: [{ name: 'Get Started', href: '#', theme: 'primary' as const }],
            },
          ],
        } },
      ] }
    },
  }),
] as const
