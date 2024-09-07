import { vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'

const templateId = 'faq'

const schema = z.object({
  heading: z.string().optional(),
  subHeading: z.string().optional(),
  items: z.array(z.object({
    name: z.string().optional(),
    desc: z.string().optional(),
  })).optional(),
})

export type UserConfig = z.infer<typeof schema>

const options: InputOption[] = [
  new InputOption({ key: 'heading', label: 'Heading', input: 'InputText' }),
  new InputOption({ key: 'subHeading', label: 'Sub Heading', input: 'InputText' }),
  new InputOption({ key: 'items', label: 'Items', input: 'InputList', options: [
    new InputOption({ key: 'name', label: 'Name', input: 'InputText' }),
    new InputOption({ key: 'desc', label: 'Description', input: 'InputText' }),
  ] }),
]

const defaultConfig: UserConfig = {
  heading: 'Treasure Hunting Services',
  items: [
    { name: 'Expedition Planning', desc: 'Comprehensive planning and logistics for successful treasure hunting expeditions.' },
    { name: 'Map Deciphering', desc: 'Skilled interpretation of ancient maps and clues to locate hidden treasures.' },
    { name: 'Site Excavation', desc: 'Professional excavation services to uncover and preserve valuable artifacts.' },
    { name: 'Treasure Appraisal', desc: 'Accurate appraisal of discovered treasures to determine their historical and monetary value.' },
  ],
}

export const templates = [
  new CardTemplate({
    templateId,
    category: ['basic'],
    description: 'A list element great for FAQs, values, etc. ',
    icon: 'i-tabler-map',
    colorTheme: 'emerald',
    el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),
    options,
    getUserConfig: () => {
      return defaultConfig
    },
    schema,
    isPublic: true,
    demoPage: async () => {
      return {
        cards: [
          { templateId, userConfig: defaultConfig },
        ],
      }
    },
  }),
] as const
