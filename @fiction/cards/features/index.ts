import { colorThemeUser, MediaIconSchema, vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'

const templateId = 'features'

const schema = z.object({
  heading: z.string().optional(),
  subHeading: z.string().optional(),
  superHeading: z.string().optional(),
  superIcon: MediaIconSchema.optional().describe('Icon for the super heading'),
  superColor: z.enum(colorThemeUser).optional().describe('change color of super heading'),
  items: z.array(z.object({
    name: z.string().optional(),
    desc: z.string().optional(),
    icon: MediaIconSchema.optional(),
    color: z.enum(colorThemeUser).optional(),
  })).optional(),
})

export type UserConfig = z.infer<typeof schema>

const options: InputOption[] = [
  new InputOption({ key: 'heading', label: 'Heading', input: 'InputText' }),
  new InputOption({ key: 'subHeading', label: 'Sub Heading', input: 'InputText' }),
  new InputOption({ key: 'superHeading', label: 'Super Heading', input: 'InputText' }),
  new InputOption({ key: 'superColor', input: 'InputSelect', label: 'Color of Super Header', list: colorThemeUser }),
  new InputOption({ key: 'superIcon', input: 'InputIcon', label: 'Super Header Icon' }),
  new InputOption({ key: 'items', label: 'Items', input: 'InputList', props: { itemName: 'Feature' }, options: [
    new InputOption({ key: 'name', label: 'Name', input: 'InputText' }),
    new InputOption({ key: 'desc', label: 'Description', input: 'InputText' }),
    new InputOption({ key: 'icon', label: 'Icon', input: 'InputIcon' }),
    new InputOption({ key: 'color', input: 'InputSelect', label: 'Color', list: colorThemeUser }),
  ] }),
]

const defaultConfig: UserConfig = {
  superColor: 'primary',
  superIcon: { iconId: 'check' },
  superHeading: 'Industry Recognition',
  heading: 'Main Product or Service',
  subHeading: 'Brief description of your core offering and its unique value proposition.',
  items: [
    { name: 'Key Feature 1', desc: 'Description of the first key feature and its benefits to the customer.', icon: { iconId: 'check' }, color: 'blue' },
    { name: 'Key Feature 2', desc: 'Explanation of the second key feature and how it addresses customer needs.', icon: { iconId: 'check' }, color: 'green' },
    { name: 'Key Feature 3', desc: 'Details about the third key feature and its advantages over competitors.', icon: { iconId: 'check' }, color: 'yellow' },
    { name: 'Additional Service 1', desc: 'Information about an additional service that complements the main offering.', icon: { iconId: 'check' }, color: 'red' },
    { name: 'Additional Service 2', desc: 'Description of another complementary service or product available to customers.', icon: { iconId: 'check' }, color: 'purple' },
    { name: 'Customer Benefit', desc: 'Highlight of a significant benefit or convenience offered to customers.', icon: { iconId: 'check' }, color: 'orange' },
  ],
}

export const templates = [
  cardTemplate({
    templateId,
    category: ['marketing'],
    description: 'Discuss the features of your product or service.',
    icon: 'i-tabler-discount-check',
    colorTheme: 'indigo',
    el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),
    schema,
    options,
    getUserConfig: () => defaultConfig,
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
