import { type ActionItem, colorTheme, vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site'
import { InputOption } from '@fiction/ui'
import { z } from 'zod'
import { options as heroOptions, schema as heroSchema } from '../hero/index'
import dogs from './img/dogs.jpg'
import dogs2 from './img/dogs2.jpg'
import dogs3 from './img/dogs3.jpg'
import fish from './img/fish.jpg'
import clownfish from './img/clownfish.jpg'
import farm from './img/farm.jpg'
import savannah from './img/savannah.jpg'
import asian from './img/asian.jpg'
import ukraine from './img/ukraine.jpg'

const templateId = 'tour'

const schema = z.object({
  items: z.array(heroSchema).optional(),
})

export type UserConfig = z.infer<typeof schema>

const options: InputOption[] = [
  new InputOption({ key: 'items', label: 'Tour Items', input: 'InputList', options: heroOptions }),
]

const defaultConfig: UserConfig = {
  items: [
    {
      heading: 'The Life of Dogs',
      subHeading: 'Perfect for pet lovers looking to add a touch of canine charm to their space.',
      splash: { url: dogs },
      layout: 'left',
      overlays: [{ media: { url: dogs2 }, position: 'bottomLeft' }, { media: { url: dogs3 }, position: 'topRight' }],
      actions: [
        { name: 'View Dog Gallery', href: '#', btn: 'primary' },
        { name: 'Contact Me', href: '#', btn: 'naked' as const },
      ],
    },
    {
      heading: 'Under the Sea',
      subHeading: 'Illustrations to take you underneath the waves.',
      splash: { url: fish },
      layout: 'right',
      overlays: [{ media: { url: clownfish }, position: 'bottomLeft' }],
      actions: [
        { name: 'View Dog Gallery', href: '#', btn: 'primary' },
        { name: 'Contact Me', href: '#', btn: 'naked' as const },
      ],
    },
    {
      heading: 'Landscape Illustrations',
      subHeading: 'Ideal for adding serene and picturesque views to your decor.',
      splash: { url: savannah },
      overlays: [
        { media: { url: farm } },
        { media: { url: asian }, position: 'bottomLeft' },
        { media: { url: ukraine }, position: 'topRight', widthPercent: 15 },
      ],
      actions: [
        { name: 'View Landscapes', href: '#', btn: 'primary' },
        { name: 'Contact Me', href: '#', btn: 'naked' as const },
      ],
    },
  ],
}

export const templates = [
  new CardTemplate({
    templateId,
    category: ['marketing'],
    description: 'A tour section with left and right hero images and text',
    icon: 'i-tabler-compass',
    colorTheme: 'green',
    el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),
    options,
    userConfig: { ...defaultConfig },
    demoPage: async () => {
      return {
        cards: [
          { templateId, userConfig: { ...defaultConfig } },
        ],
      }
    },
  }),
] as const
