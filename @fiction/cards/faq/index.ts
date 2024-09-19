import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'

const templateId = 'faq'

const schema = z.object({
  heading: z.string().optional().describe('Feature heading for the element [ai]'),
  subHeading: z.string().optional().describe('Feature Sub heading for the element [ai]'),
  items: z.array(z.object({
    name: z.string().optional(),
    desc: z.string().optional(),
  })).optional().describe('List of items faq, values, similar [ai seconds=10 label="List Items"]'),
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
  heading: 'Frequently Asked Questions',
  items: [
    { name: `How much does it cost?`, desc: `Our pricing varies depending on your specific needs. Please contact us for a personalized quote.` },
    { name: `What happens if I need to cancel?`, desc: `We understand that circumstances change. Please refer to our cancellation policy for details on the process and any applicable fees.` },
    { name: `How long does it usually take?`, desc: `The timeline can vary based on the complexity of your request. We strive to provide efficient service while ensuring quality results.` },
    { name: `What happens if I'm not satisfied?`, desc: `Your satisfaction is our priority. If you're not happy with our service, please contact us to discuss how we can address your concerns.` },
  ],
}

export const templates = [
  cardTemplate({
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
