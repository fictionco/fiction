import { vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site'
import { z } from 'zod'
import { InputOption } from '@fiction/ui'
import { standardOption } from '../inputSets'

const templateId = 'ticker'

const TickerSchema = z.object({
  text: z.string().describe('The text to display in the ticker'),
  speed: z.number().min(1).max(10).optional().describe('The speed of the scrolling text'),
  direction: z.enum(['left', 'right']).optional().describe('The direction of the ticker scroll'),
  font: z.string().optional().describe('The font family of the text'),
  bgColor: z.string().optional().describe('The color background of the ticker'),
  bgColorDark: z.string().optional().describe('The color background of the ticker in dark mode'),
  outline: z.boolean().optional().describe('Whether to add an outline to the text'),
  rotateX: z.number().optional().describe('The rotation angle around the X-axis for 3D effects'),
  rotateY: z.number().optional().describe('The rotation angle around the Y-axis for 3D effects'),
  rotateZ: z.number().optional().describe('The rotation angle around the Z-axis for 3D effects'),
}).describe('Schema for individual ticker item configuration')

export const UserConfigSchema = z.object({
  items: z.array(TickerSchema).describe('Array of ticker items').optional(),
  fontSize: z.number().min(5).max(15).optional().describe('The font size of the text'),
})

export type Ticker = z.infer<typeof TickerSchema>
export type UserConfig = z.infer<typeof UserConfigSchema>

const options: InputOption[] = [
  standardOption.ai(),
  new InputOption({ key: 'fontSize', label: 'Font Size', input: 'InputRange', props: { min: 5, max: 15 } }),
  new InputOption({ key: 'speed', label: 'Speed', input: 'InputRange', props: { min: -10, max: 10 } }),
  new InputOption({
    input: 'InputList',
    key: `items`,
    options: [
      new InputOption({ key: 'text', label: 'Ticker Text', input: 'InputText' }),
      new InputOption({ key: 'direction', label: 'Direction', input: 'InputSelect', props: { options: ['left', 'right'] } }),
      new InputOption({ key: 'font', label: 'Font', input: 'InputFont' }),
      new InputOption({ key: 'bgColor', label: 'Background Color', input: 'InputColor' }),
      new InputOption({ key: 'bgColorDark', label: 'Background Color (Dark Mode)', input: 'InputColor' }),
      new InputOption({ key: 'outline', label: 'Outline', input: 'InputToggle' }),
      new InputOption({ key: 'rotateX', label: 'Rotate X', input: 'InputRange', props: { min: -10, max: 10 } }),
      new InputOption({ key: 'rotateY', label: 'Rotate Y', input: 'InputRange', props: { min: -10, max: 10 } }),
      new InputOption({ key: 'rotateZ', label: 'Rotate Z', input: 'InputRange', props: { min: -10, max: 10 } }),
    ],
  }),
]

const defaultConfig: UserConfig = {
  items: [{
    text: 'Non nobis solum nati sumus.',
    rotateX: 5,
    rotateY: 5,
    rotateZ: -2,
    speed: -2,
  }, {
    text: 'Non nobis solum nati sumus.',
    rotateX: 5,
    rotateY: -5,
    rotateZ: 2,
    direction: 'right',
    outline: true,
    speed: 2,
  }],
}

const demoCard2: UserConfig = {
  fontSize: 6,
  items: [
    {
      text: 'Non nobis solum nati sumus.',
      direction: 'left',
      bgColor: '#000',
      bgColorDark: '#FFF',
    },
    {
      text: 'Non nobis solum nati sumus.',
      direction: 'right',
      font: 'sans',
      bgColor: '#dc2626',
    },
    {
      text: 'Non nobis solum nati sumus.',
      direction: 'left',
      font: 'Dancing Script',
      bgColor: '#2563eb',
    },
    {
      text: 'Non nobis solum nati sumus.',
      direction: 'right',
      font: 'highlight',
      outline: true,
    },
  ],
}

export const templates = [
  new CardTemplate({
    templateId,
    category: ['marketing'],
    description: 'Side-scrolling ticker of text and images.',
    icon: 'i-tabler-quote',
    colorTheme: 'green',
    el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),
    isPublic: true,
    options,
    schema: UserConfigSchema,
    userConfig: defaultConfig,
    demoPage: async () => {
      return { cards: [
        { templateId, userConfig: { ...defaultConfig } },
        { templateId, userConfig: { ...demoCard2 } },
      ] }
    },
  }),
] as const
