import type { CardFactory } from '@fiction/site/cardFactory.js'
import type { StandardUserConfig } from '@fiction/site/schema'
import type { StockMedia } from '@fiction/ui/stock'
import { PostSchema } from '@fiction/core'
import { createOption } from '@fiction/ui'
import { z } from 'zod/v4'

const SlideSchema = PostSchema.pick({
  title: true,
  subTitle: true,
  media: true,
}).extend({
  textBlend: z.enum(['normal', 'difference']).meta({ ai: false, description: 'Text overlay blend mode' }),
})

export const schema = z.object({
  autoSlide: z.boolean().optional().meta({ ai: false, description: 'Animate slide transition automatically' }),
  items: z.array(SlideSchema).optional().meta({ ai: true, description: 'Slides for slider with media, title, and subtitle', seconds: 12 }),
})

export type UserConfig = z.infer<typeof schema> & StandardUserConfig
type SlideUserConfig = z.infer<typeof SlideSchema>

export const options = [
  createOption({
    schema,
    input: 'group',
    key: 'group.slides',
    label: 'Slides',
    icon: { class: 'i-tabler-slideshow' },
    options: [
      createOption({
        schema,
        key: 'items',
        label: 'items',
        input: 'InputList',
        props: {
          itemName: 'Slide',
          itemLabel: args => (args?.item as SlideUserConfig)?.title ?? 'Untitled',
        },
        options: [
          createOption({
            schema,
            key: 'items.0.media',
            label: 'Background Media',
            input: 'InputMedia',
          }),
          createOption({
            schema,
            key: 'items.0.title',
            label: 'Main Heading',
            placeholder: 'Enter a title',
            input: 'InputText',
          }),
          createOption({
            schema,
            key: 'items.0.subTitle',
            label: 'Supporting Text',
            placeholder: 'Enter a subtitle',
            input: 'InputText',
          }),
          createOption({
            schema,
            key: 'items.0.textBlend',
            label: 'Text Visibility',
            input: 'InputRadioButton',
            props: { uiSize: 'sm' },
            list: [
              { label: 'Standard', value: 'normal' },
              { label: 'Difference', value: 'difference' },
            ],
          }),
        ],
      }),
    ],
  }),
  createOption({
    schema,
    input: 'group',
    key: 'group.settings',
    label: 'Settings',
    icon: { class: 'i-tabler-settings' },
    options: [
      createOption({
        schema,
        key: 'autoSlide',
        label: 'Auto-Advance Slides',
        input: 'InputToggle',
      }),
    ],
  }),

]

export async function getDefaultConfig(args: { stock: StockMedia }): Promise<UserConfig> {
  const { stock } = args
  return {
    autoSlide: true,
    items: [
      {
        title: 'First and Last Name',
        subTitle: 'Tagline or Key Achievement Here',
        textBlend: 'difference',
        media: stock.getRandomByTags(['aspect:landscape']),
      },
      {
        title: 'Featured In Publications',
        subTitle: 'As Seen in Forbes, TIME, and WSJ',
        textBlend: 'difference',
        media: stock.getRandomByTags(['aspect:landscape']),
      },
      {
        title: 'Latest Book Release',
        subTitle: 'Now a #1 International Bestseller',
        textBlend: 'normal',
        media: stock.getRandomByTags(['aspect:landscape']),
      },
      {
        title: 'Next Live Event',
        subTitle: 'Join Me This Summer in New York',
        textBlend: 'difference',
        media: stock.getRandomByTags(['aspect:landscape']),
      },
    ],
  }
}

export async function getDemoConfig(args: { stock: StockMedia }): Promise<UserConfig> {
  const { stock } = args
  return {
    autoSlide: true,
    items: [
      // Visual Impact Demo
      {
        title: 'Notice the Visual Impact',
        subTitle: 'See how imagery draws attention instantly',
        textBlend: 'difference',
        media: stock.getRandomByTags(['aspect:landscape']),
      },
      // Text Contrast Demo
      {
        title: 'Experience Perfect Clarity',
        subTitle: 'Watch how text adapts to any background',
        textBlend: 'normal',
        media: stock.getRandomByTags(['aspect:landscape']),
      },
      // Motion Demo
      {
        title: 'Feel the Smooth Motion',
        subTitle: 'Imagine your content flowing effortlessly',
        textBlend: 'difference',
        media: stock.getRandomByTags(['aspect:landscape', 'video']),
      },
      // Call to Action Demo
      {
        title: 'Transform Your Story',
        subTitle: 'Start creating your perfect slider now',
        textBlend: 'difference',
        media: stock.getRandomByTags(['aspect:landscape']),
      },
    ],
  }
}

export async function getConfig({ templateId, factory }: { templateId: string, factory: CardFactory }) {
  const stock = await factory.getStockMedia()
  const defaultConfig = await getDefaultConfig({ stock })
  const demoConfig = await getDemoConfig({ stock })

  return {
    schema,
    options,
    userConfig: defaultConfig,
    demoPage: {
      cards: [
        // Personal Brand Example
        {
          templateId,
          userConfig: defaultConfig,
        },
        // Feature Demo Example
        {
          templateId,
          userConfig: demoConfig,
        },
        // Product Showcase Example
        {
          templateId,
          userConfig: {
            autoSlide: true,
            items: [
              {
                title: 'Discover What\'s Possible',
                subTitle: 'Feel the difference our products make',
                textBlend: 'difference',
                media: stock.getRandomByTags(['aspect:landscape']),
              },
              {
                title: 'See the Innovation',
                subTitle: 'Notice how every detail matters',
                textBlend: 'normal',
                media: stock.getRandomByTags(['aspect:landscape']),
              },
              {
                title: 'Imagine the Impact',
                subTitle: 'Watch as your vision comes to life',
                textBlend: 'difference',
                media: stock.getRandomByTags(['aspect:landscape']),
              },
            ],
          } satisfies UserConfig,
        },
      ],
    },
  }
}
