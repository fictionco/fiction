import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'

const templateId = 'fitText'

const schema = z.object({
  lines: z.number().optional().describe('Number of lines to fit the text into'),
  text: z.string().optional().describe('Text to fit into the container'),
  minFontSize: z.number().optional().describe('Minimum font size'),
  maxFontSize: z.number().optional().describe('Maximum font size'),
  font: z.string().optional().describe('Font to use (google font key)'),
})

export type UserConfig = z.infer<typeof schema>

const options: InputOption[] = [
  new InputOption({ key: 'text', label: 'Text', input: 'InputText' }),
  new InputOption({ key: 'lines', label: 'Lines', input: 'InputNumber' }),
  new InputOption({ key: 'minFontSize', label: 'Min Font Size', input: 'InputNumber' }),
  new InputOption({ key: 'maxFontSize', label: 'Max Font Size', input: 'InputNumber' }),
  new InputOption({ key: 'font', label: 'Font', input: 'InputFont' }),
]

export const templates = [
  cardTemplate({
    templateId,
    category: ['content'],
    description: 'Text that fits the container',
    icon: 'i-tabler-adjustments',
    colorTheme: 'orange',
    isPublic: true,
    schema,
    options,
    el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),
    demoPage: async () => {
      return {
        cards: [
          { templateId, userConfig: { text: 'Mystical Sorcerer', lines: 1, maxFontSize: 160, font: 'Cinzel' } },
          { templateId, userConfig: { text: 'Guardian of the Ancient Realms', lines: 1, maxFontSize: 160, font: 'Playfair Display' } },
          { templateId, userConfig: { text: 'Master of Spells and Enchantments', lines: 2, font: 'Merriweather' } },
          { templateId, userConfig: { text: 'Keeper of Arcane Knowledge', lines: 2, font: 'Lora' } },
          { templateId, userConfig: { text: 'Wielder of the Arcane Staff', lines: 3, font: 'Cinzel' } },
          { templateId, userConfig: { text: 'Archmage Eldrin', lines: 1, font: 'Cinzel' } },
          { templateId, userConfig: { text: 'Wise, Powerful, and Mysterious', lines: 2, font: 'Merriweather' } },
          { templateId, userConfig: { text: 'Guardian of the Realms, Master of Spells, and Keeper of Ancient Secrets', maxFontSize: 60, lines: 3, font: 'highlight' } },
        ],
      }
    },
  }),
] as const
