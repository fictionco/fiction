import { numberFormats, vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'

const templateId = 'metrics'
export const schema = z.object({
  heading: z.string().optional(),
  subHeading: z.string().optional(),
  items: z.array(z.object({
    name: z.string().optional(),
    desc: z.string().optional(),
    value: z.number().optional(),
    format: z.enum(numberFormats).optional(),
    icon: z.string().optional(),
    color: z.string().optional(),
  })).optional(),
})

export type UserConfig = z.infer<typeof schema>

const options: InputOption[] = [
  new InputOption({ key: 'heading', label: 'Heading', input: 'InputText' }),
  new InputOption({ key: 'subHeading', label: 'Sub Heading', input: 'InputText' }),
  new InputOption({ key: 'items', label: 'Items', input: 'InputList', options: [
    new InputOption({ key: 'name', label: 'Name', input: 'InputText' }),
    new InputOption({ key: 'desc', label: 'Description', input: 'InputText' }),
    new InputOption({ key: 'value', label: 'Value', input: 'InputNumber' }),
    new InputOption({ key: 'format', label: 'Format', input: 'InputSelect', list: numberFormats }),
    new InputOption({ key: 'icon', label: 'Icon', input: 'InputText' }),
    new InputOption({ key: 'color', label: 'Color', input: 'InputColor' }),
  ] }),
]

async function getDefaultConfig(): Promise<UserConfig> {
  return {
    heading: 'The numbers speak for themselves',
    subHeading: 'Check out these key metrics from my career',
    items: [
      {
        name: 'Movies Directed',
        desc: 'Total number of movies directed',
        value: 15,
        format: 'number',
        icon: 'i-tabler-film',
        color: '#ff5733',
      },
      {
        name: 'Box Office Revenue',
        desc: 'Total box office revenue generated',
        value: 520500000,
        format: 'abbreviatedDollar',
        icon: 'i-tabler-currency-dollar',
        color: '#33ff57',
      },
      {
        name: 'Awards Won',
        desc: 'Total number of awards won',
        value: 25,
        format: 'number',
        icon: 'i-tabler-trophy',
        color: '#ffd700',
      },
      {
        name: 'Scenes Cut',
        desc: 'Number of scenes cut during editing',
        value: 453,
        format: 'number',
        icon: 'i-tabler-scissors',
        color: '#ff33a8',
      },
      {
        name: 'Days on Set',
        desc: 'Total number of days spent on set',
        value: 1200,
        format: 'number',
        icon: 'i-tabler-clock',
        color: '#3399ff',
      },
      {
        name: 'Coffee Cups',
        desc: 'Total number of coffee cups consumed',
        value: 5500,
        format: 'number',
        icon: 'i-tabler-coffee',
        color: '#ff9933',
      },
    ],
  }
}

export const templates = [
  new CardTemplate({
    templateId,
    category: ['stats'],
    description: 'Display key metrics in a visually appealing way',
    icon: 'i-tabler-number',
    colorTheme: 'sky',
    isPublic: true,
    schema,
    el: vue.defineAsyncComponent(async () => import('./ElMetrics.vue')),
    options,
    getUserConfig: async () => getDefaultConfig(),
    demoPage: async () => {
      const userConfig = await getDefaultConfig()
      return {
        cards: [
          { templateId, userConfig },
        ],
      }
    },
  }),
] as const
