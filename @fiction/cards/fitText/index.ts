import { vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site'
import { z } from 'zod'
import type { InputOption } from '@fiction/ui'

const templateId = 'fitText'

const schema = z.object({
  lines: z.number().optional(),
  text: z.string().optional(),
  minFontSize: z.number().optional(),
  maxFontSize: z.number().optional(),
  font: z.string().optional(),
})

export type UserConfig = z.infer<typeof schema>

const options: InputOption[] = [
]

export const templates = [
  new CardTemplate({
    templateId,
    category: ['content'],
    description: 'Text that fits the container',
    icon: 'i-tabler-adjustments',
    colorTheme: 'orange',
    isPublic: false,
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
