import { colorTheme, vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site'
import { z } from 'zod'
import { InputOption } from '@fiction/ui'

const templateId = 'features'

const schema = z.object({
  heading: z.string().optional(),
  subHeading: z.string().optional(),
  superHeading: z.string().optional(),
  superIcon: z.string().optional().describe('Icon for the super heading'),
  superColor: z.enum(colorTheme).optional().describe('change color of super heading'),
  items: z.array(z.object({
    name: z.string().optional(),
    desc: z.string().optional(),
    icon: z.string().optional(),
    color: z.enum(colorTheme).optional(),
  })).optional(),
})

export type UserConfig = z.infer<typeof schema>

const options: InputOption[] = [
  new InputOption({ key: 'heading', label: 'Heading', input: 'InputText' }),
  new InputOption({ key: 'subHeading', label: 'Sub Heading', input: 'InputText' }),
  new InputOption({ key: 'superHeading', label: 'Super Heading', input: 'InputText' }),
  new InputOption({ key: 'superColor', input: 'InputSelect', label: 'Color of Super Header', list: colorTheme }),
  new InputOption({ key: 'superIcon', input: 'InputText', label: 'Super Header Icon', placeholder: 'i-tabler-check', description: 'Any tabler icon in the format i-tabler-[icon]' }),
  new InputOption({ key: 'items', label: 'Items', input: 'InputList', options: [
    new InputOption({ key: 'name', label: 'Name', input: 'InputText' }),
    new InputOption({ key: 'desc', label: 'Description', input: 'InputText' }),
    new InputOption({ key: 'icon', label: 'Icon', input: 'InputIcon' }),
    new InputOption({ key: 'color', input: 'InputSelect', label: 'Color', list: colorTheme }),
  ] }),
]

const defaultConfig: UserConfig = {
  superColor: 'indigo',
  superIcon: 'i-tabler-chef-hat',
  superHeading: 'Voted Best Bakery 2024',
  heading: `Excellence in Baking`,
  subHeading: `We offer exceptional services for people that don't just want a cake, but an experience.`,
  items: [
    { name: 'Custom Cakes', desc: 'Award-winning custom cakes crafted for every special occasion, made to your exact specifications.', icon: 'i-tabler-cake', color: 'rose' },
    { name: 'Gourmet Pastries', desc: 'Indulge in an array of gourmet pastries, freshly baked and perfect for any time of the day.', icon: 'i-tabler-brand-cakephp', color: 'emerald' },
    { name: 'Artisan Bread', desc: 'Experience the taste of artisanal bread, made from the finest ingredients and baked to perfection.', icon: 'i-tabler-bread', color: 'orange' },
    { name: 'Baking Classes', desc: 'Join exclusive baking classes and learn the secrets behind the chef’s world-renowned creations.', icon: 'i-tabler-school', color: 'blue' },
    { name: 'Decadent Cookies', desc: 'Savor our selection of freshly baked cookies, perfect for any occasion or just a sweet treat.', icon: 'i-tabler-cookie', color: 'yellow' },
    { name: 'Nationwide Delivery', desc: 'Enjoy our baked goods from anywhere with our reliable and fast nationwide delivery service.', icon: 'i-tabler-truck', color: 'purple' },
  ],
}

export const templates = [
  new CardTemplate({
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
