import type { Card } from '@fiction/site'
import type { CardFactory } from '@fiction/site/cardFactory'
import type { StandardUserConfig } from '@fiction/site/schema'
import type { StockMedia } from '@fiction/ui/stock'
import { ActionAreaSchema, MediaBasicSchema, SuperTitleSchema } from '@fiction/core'
import { createOption } from '@fiction/ui'
import { z } from 'zod'

const LayerMediaScheme = z.object({
  media: MediaBasicSchema.optional().describe('Layer image [@ai]'),
  position: z.enum(['top', 'bottom', 'left', 'right', 'center', 'bottomRight', 'topRight', 'bottomLeft', 'topLeft']).optional().describe('Layer placement'),
  widthPercent: z.number().optional().describe('Layer width %'),
})

export const HeroSchema = z.object({
  layout: z.enum(['justify', 'center', 'left', 'right']).optional().describe('Content alignment'),
  title: z.string().optional().describe('Main headline (3-13 words) [@ai]'),
  subTitle: z.string().optional().describe('Supporting message (10-30 words) [@ai]'),
  superTitle: SuperTitleSchema.optional().describe('Small text above title [@ai]'),
  media: MediaBasicSchema.optional().describe('Primary visual'),
  caption: z.string().optional().describe('Media description [@ai]'),
  action: ActionAreaSchema.optional().describe('Call-to-action buttons [@ai]'),
  overlays: z.array(LayerMediaScheme).optional().describe('Decorative image layers'),
})

export type HeroConfig = z.infer<typeof HeroSchema>

export const schema = z.object({
  items: z.array(HeroSchema).describe('Your story chapters - each a unique visual narrative'),
})

type UserConfig = z.infer<typeof schema> & StandardUserConfig

function getOptions(args: { card?: Card<UserConfig> }) {
  const { card } = args

  const isVisible = (args: { index?: number }) => {
    const { index = -1 } = args
    const out = !!(!card || card?.userConfig.value?.items?.[index]?.media?.url)
    return out
  }
  return [
    createOption({
      input: 'group',
      key: 'group.items',
      label: 'Hero Items',
      icon: { class: 'i-tabler-list' },
      options: [
        createOption({
          key: 'items',
          input: 'InputList',
          props: {
            itemName: 'Hero',
            itemLabel: args => (args?.item as HeroConfig)?.title ?? 'Untitled',
          },
          options: [
            createOption({
              key: 'layout',
              label: 'Layout Style',
              input: 'InputRadioButton',
              props: { uiSize: 'sm' },
              list: [
                { value: 'center' },
                { value: 'left' },
                { value: 'right' },
                { value: 'justify' },
              ],
              schema: HeroSchema,
            }),

            createOption({
              key: 'title',
              label: 'Title',
              input: 'InputText',
              schema: HeroSchema,
            }),
            createOption({
              key: 'subTitle',
              label: 'Sub Title',
              input: 'InputTextarea',
              props: { rows: 3 },
              schema: HeroSchema,
            }),
            createOption({
              key: 'superTitle',
              label: 'Context Title',
              input: 'InputSuperTitle',
              isClosed: true,
              schema: HeroSchema,
            }),
            createOption({
              key: 'action.buttons',
              label: 'Buttons',
              input: 'InputActions',
              schema: HeroSchema,
            }),
            createOption({
              key: 'media',
              label: 'Media',
              input: 'InputMedia',
              schema: HeroSchema,
            }),
            createOption({
              schema: HeroSchema,
              key: 'media.aspect',
              label: 'Media Aspect',
              input: 'InputRadioButton',
              list: [
                { label: 'Auto', value: 'auto' },
                { label: 'Square', value: 'square' },
                { label: 'Portrait', value: 'portrait' },
                { label: 'Landscape', value: 'landscape' },
              ],
              isVisible,
            }),

            createOption({
              input: 'InputList',
              schema: HeroSchema,
              key: 'overlays',
              props: { itemName: 'Overlay' },
              icon: { class: 'i-tabler-layers-subtract' },
              isVisible,
              options: [
                createOption({
                  key: 'overlays.0.media',
                  label: 'Overlay Image',
                  input: 'InputMedia',
                  schema: HeroSchema,
                }),
                createOption({
                  key: 'overlays.0.position',
                  label: 'Position',
                  input: 'InputSelect',
                  list: [
                    { label: 'Top Left', value: 'topLeft' },
                    { label: 'Top Center', value: 'top' },
                    { label: 'Top Right', value: 'topRight' },
                    { label: 'Bottom Left', value: 'bottomLeft' },
                    { label: 'Bottom Center', value: 'bottom' },
                    { label: 'Bottom Right', value: 'bottomRight' },
                    { label: 'Center', value: 'center' },
                  ],
                  schema: HeroSchema,
                }),
                createOption({
                  key: 'overlays.0.widthPercent',
                  label: 'Width %',
                  input: 'InputRange',
                  props: { min: 0, max: 100, step: 5, startValue: 30 },
                  schema: HeroSchema,
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  ]
}

// Structured input options for the design interface

async function getDemoContent(args: { templateId: string, stock: StockMedia }) {
  const { stock, templateId } = args

  const userConfig = {
    items: [
      {
        layout: 'right',
        title: 'Witness Your Vision Take Flight',
        subTitle: 'Watch as your ideas transform into stunning reality. Our intuitive platform empowers creators to build remarkable experiences with confidence.',
        superTitle: {
          text: 'Begin Your Journey',
          icon: { class: 'i-tabler-rocket' },
          theme: 'blue',
        },
        media: stock.getRandomByTags(['aspect:landscape']),
        overlays: [
          { media: stock.getRandomByTags(['object']), position: 'bottomLeft', widthPercent: 25 },
          { media: stock.getRandomByTags(['abstract']), position: 'topRight', widthPercent: 25 },
        ],
        action: {
          buttons: [
            { label: 'Start Creating', theme: 'primary', design: 'solid' },
            { label: 'See Examples', theme: 'default', design: 'ghost' },
          ],
        },
      },
      {
        layout: 'left',
        title: 'Craft Stories That Captivate',
        subTitle: 'Feel the difference as you shape narratives that resonate. Our tools help you create emotional connections that turn visitors into devoted followers.',
        superTitle: {
          text: 'Master Storytelling',
          icon: { class: 'i-tabler-brush' },
          theme: 'purple',
        },
        media: stock.getRandomByTags(['object', 'aspect:landscape']),
        overlays: [
          { media: stock.getRandomByTags(['object']), position: 'bottomRight', widthPercent: 30 },
        ],
        action: {
          buttons: [
            { label: 'Explore Tools', theme: 'primary', design: 'solid' },
            { label: 'View Gallery', theme: 'default', design: 'ghost' },
          ],
        },
      },
      {
        layout: 'center',
        title: 'Unleash Your Creative Power',
        subTitle: 'Experience the freedom to experiment boldly. Our platform gives you the confidence to push boundaries and create unforgettable digital experiences.',
        superTitle: {
          text: 'Limitless Creativity',
          icon: { class: 'i-tabler-sparkles' },
          theme: 'indigo',
        },
        media: stock.getRandomByTags(['abstract', 'aspect:landscape']),
        overlays: [
          { media: stock.getRandomByTags(['object']), position: 'bottomLeft', widthPercent: 25 },
          { media: stock.getRandomByTags(['object']), position: 'topRight', widthPercent: 25 },
        ],
        action: {
          buttons: [
            { label: 'Get Started Now', theme: 'primary', design: 'solid', icon: { iconId: 'rocket' } },
            { label: 'Watch Demo', theme: 'default', design: 'ghost' },
          ],
        },
      },
    ],
  }

  return {
    templateId,
    userConfig,
  }
}

function getDefaultContent(): UserConfig {
  return {
    items: [
      {
        title: 'Hello',
        action: {
          buttons: [],
        },
      },
    ],
  }
}

export async function getConfig(args: { templateId: string, factory: CardFactory, card?: Card<UserConfig> }) {
  const stock = await args.factory.getStockMedia()
  const demoPage = await getDemoContent({ ...args, stock })
  return {
    schema,
    options: await getOptions(args),
    userConfig: getDefaultContent(),
    demoPage,
  }
}

export type { UserConfig }
export type OverlayConfig = z.infer<typeof LayerMediaScheme>
