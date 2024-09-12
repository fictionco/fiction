import { ButtonDesignSchema, colorThemeUser, vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'
import { CardFactory } from '@fiction/site/cardFactory'
import { InputOption } from '@fiction/ui'
import { stockMediaHandler } from '@fiction/ui/stock/index.js'
import { z } from 'zod'
import type { Site, TableCardConfig } from '@fiction/site'
import type { SiteUserConfig } from '@fiction/site/schema'
import { getCardTemplates } from '../index.js'
import { standardOption } from '../inputSets'

const templateId = 'statement'

const StatementSchema = z.object({
  title: z.string().optional().describe('The title of the statement.'),
  content: z.string().describe('The content of the statement.'),
  actions: z.array(z.object({
    name: z.string().describe('The name of the action button.'),
    href: z.string().describe('The URL the action button should link to.'),
    theme: z.enum(colorThemeUser).optional().describe('The color theme of the action button.'),
    design: ButtonDesignSchema.optional().describe('The design of the action button.'),
  })).optional().describe('Action buttons to display with the statement.'),
})

export type Statement = z.infer<typeof StatementSchema>

const UserConfigSchema = z.object({
  items: z.array(StatementSchema).optional().describe('The statements to display.'),
})

export type UserConfig = z.infer<typeof UserConfigSchema>

const options: InputOption[] = [
  standardOption.ai(),
  new InputOption({
    input: 'InputList',
    key: `items`,
    props: { itemName: 'Statement' },
    options: [
      new InputOption({ key: 'title', label: 'Title', input: 'InputText' }),
      new InputOption({ key: 'content', label: 'Content', input: 'InputTextarea' }),
      new InputOption({ key: 'actions', label: 'Actions', input: 'InputList', options: [
        new InputOption({ key: 'name', label: 'Name', input: 'InputText' }),
        new InputOption({ key: 'href', label: 'Link', input: 'InputText' }),
        new InputOption({ key: 'theme', label: 'Theme', input: 'InputSelect', list: colorThemeUser }),
        new InputOption({ key: 'design', label: 'Design', input: 'InputSelect', list: ButtonDesignSchema.options }),
      ] }),
    ],
  }),
]

async function getEffects(args: { site?: Site }): Promise<TableCardConfig[]> {
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

async function getUserConfig(): Promise<UserConfig & SiteUserConfig> {
  return {
    items: [
      {
        title: 'Title Goes Here',
        content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce sit amet feugiat orci. Many people struggle to make themselves heard in a crowded marketplace. A strong personal brand can be the difference between blending in and standing out. Donec vel dui vitae lorem efficitur tincidunt.`,
        actions: [{ name: 'Call to Action', href: '#', theme: 'overlay', design: 'outline' }],
      },
      {
        title: 'Another Title Here',
        content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent at nisi nec nulla pharetra dictum. Developing a unique voice is challenging but vital for personal branding. Ut facilisis nibh nec ligula varius, a efficitur ante vestibulum. We can help you find your voice and stand out.`,
        actions: [{ name: 'Call to Action', href: '#', theme: 'overlay', design: 'outline' }],
      },
      {
        title: 'Yet Another Title',
        content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vestibulum lacus non lorem aliquet, id hendrerit lectus fringilla. Self-doubt can be a major barrier to effective self-promotion. Curabitur auctor neque vel sapien gravida, vel vehicula odio efficitur. Our services will help you gain confidence and attract the opportunities you deserve.`,
        actions: [{ name: 'Call to Action', href: '#', theme: 'overlay', design: 'outline' }],
      },
    ],
    standard: {
      scheme: {
        base: {
          bg: {
            ...stockMediaHandler.getRandomByTags(['aspect:landscape', 'video', 'background']),
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

export const templates = [
  cardTemplate({
    templateId,
    category: ['content', 'basic'],
    description: 'Display a statement to focus and highlight your mission, objective, goals, etc. .',
    icon: 'i-tabler-message-bolt',
    colorTheme: 'emerald',
    el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),
    isPublic: true,
    options,
    schema: UserConfigSchema,
    getBaseConfig: () => ({ standard: { spacing: { verticalSpacing: 'xl', contentWidth: 'none' } } }),
    getUserConfig: () => getUserConfig(),
    getEffects: async _ => getEffects(_),
    demoPage: async (_) => {
      const userConfig = await getUserConfig()
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
