import type { CardFactory } from '@fiction/site/cardFactory'
import type { StandardUserConfig } from '@fiction/site/schema'
import type { StockMedia } from '@fiction/ui/stock'
import { colorThemeUser, MediaSchema } from '@fiction/core'
import { createOption } from '@fiction/ui'
import { z } from 'zod/v4'

// Schema definitions
const MediaItemSchema = z.object({
  title: z.string().optional().describe('Add a title to make your image more meaningful'),
  content: z.string().optional().describe('Tell the story behind this image'),
  href: z.string().optional().describe('Link to more details or related content'),
  media: MediaSchema.optional()
    .describe('Choose an engaging image or video'),
  cols: z.enum(['1', '2', '3', '4']).optional().describe('Control how much horizontal space this item takes'),
  rows: z.enum(['1', '2', '3', '4']).optional().describe('Define the vertical presence of this item'),
  theme: z.enum(colorThemeUser).optional().describe('Add a color theme to enhance visual impact'),
  showText: z.boolean().optional().describe('Show text overlay for this specific item'),
})

const schema = z.object({
  layout: z.object({
    gapSize: z.enum(['none', 'sm', 'md', 'lg']).optional().describe('Space between gallery items'),
    aspectRatio: z.enum(['dynamic', 'square', 'video', 'portrait']).optional().describe('Control the shape of your gallery items'),
    animation: z.enum(['fade', 'slide', 'none']).optional().describe('How items appear when they enter the viewport'),
    showAllText: z.boolean().optional().describe('Show text overlay on all gallery items'),
    baseRowHeight: z.number().optional().describe('Base height for a single row (default: 250px)'),
  }).optional(),
  lightbox: z.object({
    enabled: z.boolean().optional().describe('Allow images to open in full screen'),
    showCaption: z.boolean().optional().describe('Display image details in lightbox view'),
  }).optional(),
  items: z.array(MediaItemSchema).optional(),
})

export type MediaItem = z.infer<typeof MediaItemSchema>
export type UserConfig = z.infer<typeof schema> & StandardUserConfig

// Input options for the admin interface
const options = [
  createOption({
    schema,
    key: 'content',
    label: 'Content',
    icon: { class: 'i-tabler-align-left' },
    input: 'group',
    options: [
      createOption({
        schema,
        input: 'InputList',
        key: 'items',
        label: 'Gallery Items',
        props: {
          itemName: 'Image',
          itemLabel: args => (args?.item as MediaItem)?.title ?? 'Untitled',
        },
        options: [
          createOption({
            key: 'group.content',
            label: 'Content',
            input: 'group',
            icon: { class: 'i-tabler-highlight' },
            options: [
              createOption({
                schema,
                key: 'items.0.title',
                label: 'Title',
                input: 'InputText',
                props: { placeholder: 'Give your image a meaningful title' },
              }),
              createOption({
                schema,
                key: 'items.0.content',
                label: 'Description',
                input: 'InputTextarea',
                props: { placeholder: 'Tell the story behind this image' },
              }),
              createOption({
                schema,
                key: 'items.0.media',
                label: 'Media',
                input: 'InputMedia',
                props: { aspectRatio: 'dynamic' },
              }),
              createOption({
                schema,
                key: 'items.0.href',
                label: 'Link / URL',
                input: 'InputSiteRoute',
                props: { placeholder: 'Add a link to more details or related content' },
              }),
            ],
          }),
          createOption({
            key: 'group.design',
            label: 'Design',
            input: 'group',
            icon: { class: 'i-tabler-palette' },
            options: [
              createOption({
                schema,
                key: 'items.0.cols',
                label: 'Width',
                input: 'InputRadioButton',
                props: { uiSize: 'sm' },
                list: ['1', '2', '3', '4'],
              }),
              createOption({
                schema,
                key: 'items.0.rows',
                label: 'Height',
                input: 'InputRadioButton',
                props: { uiSize: 'sm' },
                list: ['1', '2', '3', '4'],
              }),
              createOption({
                schema,
                key: 'items.0.theme',
                label: 'Color Theme',
                input: 'InputSelect',
                list: colorThemeUser,
              }),
              createOption({
                schema,
                key: 'items.0.showText',
                label: 'Show Text Overlay',
                input: 'InputToggle',
              }),
            ],
          }),

        ],
      }),
    ],
  }),

  createOption({
    schema,
    key: 'layout',
    label: 'Layout',
    icon: { class: 'i-tabler-layout-2' },
    input: 'group',
    options: [
      createOption({
        schema,
        key: 'layout.showAllText',
        label: 'Show All Text Overlays',
        input: 'InputToggle',
      }),
      createOption({
        schema,
        key: 'layout.baseRowHeight',
        label: 'Base Row Height',
        input: 'InputNumber',
        props: {
          min: 100,
          max: 500,
          step: 50,
          placeholder: '250',
        },
      }),
      createOption({
        schema,
        key: 'layout.gapSize',
        label: 'Spacing Between Items',
        input: 'InputSelect',
        props: { list: ['none', 'sm', 'md', 'lg'] },
      }),
      createOption({
        schema,
        key: 'layout.aspectRatio',
        label: 'Item Shape',
        input: 'InputSelect',
        props: { list: ['dynamic', 'square', 'video', 'portrait'] },
      }),
      createOption({
        schema,
        key: 'layout.animation',
        label: 'Entrance Animation',
        input: 'InputSelect',
        props: { list: ['fade', 'slide', 'none'] },
      }),
      createOption({
        schema,
        key: 'lightbox.enabled',
        label: 'Enable Lightbox View',
        input: 'InputToggle',
      }),
      createOption({
        schema,
        key: 'lightbox.showCaption',
        label: 'Show Image Details',
        input: 'InputToggle',
      }),
    ],
  }),
]

async function getDemoConfig(args: { stock: StockMedia }): Promise<UserConfig> {
  const { stock } = args

  return {
    layout: {
      gapSize: 'md',
      aspectRatio: 'dynamic',
      animation: 'fade',
      showAllText: false,
      baseRowHeight: 250,
    },
    lightbox: {
      enabled: true,
      showCaption: true,
    },
    items: [
      {
        title: 'Create Visual Impact',
        content: 'Notice how this taller image commands attention? Use larger tiles strategically to highlight your most compelling content. This 1x2 format is perfect for portraits and key storytelling moments.',
        media: stock.getRandomByTags(['object', 'aspect:portrait']),
        cols: '1',
        rows: '2',
        theme: 'blue',
      },
      {
        title: 'Balance Through Scale',
        content: 'See how this larger tile creates a natural focal point? Combine different sizes to guide your viewer\'s journey through the gallery. The 2x3 format provides ample space for showcasing detailed imagery.',
        media: stock.getRandomByTags(['object', 'aspect:portrait']),
        cols: '2',
        rows: '3',
        theme: 'emerald',
        showText: true,
      },
      {
        title: 'Create Rhythm',
        content: 'Vertical tiles like this help create visual rhythm. Alternate between heights to keep your viewers engaged as they scroll through your gallery.',
        media: stock.getRandomByTags(['object', 'aspect:portrait']),
        cols: '1',
        rows: '2',
        theme: 'violet',
      },
      {
        title: 'Quick Impact',
        content: 'Small squares are perfect for creating quick visual moments. Use them to break up larger images and add variety to your layout.',
        media: stock.getRandomByTags(['object', 'object']),
        cols: '1',
        rows: '1',
      },
      {
        title: 'Build Harmony',
        content: 'Another small square helps maintain balance. Notice how it works with its neighbor to create a pleasing visual rhythm.',
        media: stock.getRandomByTags(['object', 'aspect:square']),
        cols: '1',
        rows: '1',
      },
      {
        title: 'Make a Statement',
        content: 'Wide format tiles like this are perfect for landscapes or group shots. The 3x2 format creates a dramatic panoramic effect that naturally draws the eye.',
        media: stock.getRandomByTags(['object', 'aspect:landscape']),
        cols: '3',
        rows: '2',
        theme: 'amber',
        showText: true,
      },
      {
        title: 'Perfect Proportions',
        content: 'The 2x2 square format offers balanced proportions for complex images. Use it when your content needs room to breathe.',
        media: stock.getRandomByTags(['object', 'aspect:square']),
        cols: '2',
        rows: '2',
      },
      {
        title: 'Dynamic Pairing',
        content: 'These two wide tiles work together to create a harmonious flow. Consider how your images complement each other when placing them side by side.',
        media: stock.getRandomByTags(['object', 'aspect:landscape']),
        cols: '2',
        rows: '1',
        theme: 'indigo',
        showText: true,
      },
      {
        title: 'Visual Flow',
        content: 'Paired with its neighbor, this tile helps guide the eye across the gallery. Think about the journey you want your viewers to take.',
        media: stock.getRandomByTags(['object', 'aspect:landscape']),
        cols: '2',
        rows: '1',
      },
      {
        title: 'Create Focus',
        content: 'Vertical tiles excel at drawing attention to specific details. Use them to highlight products or portraits.',
        media: stock.getRandomByTags(['object', 'aspect:tall']),
        cols: '1',
        rows: '2',
        theme: 'rose',
      },
      {
        title: 'Mirror Elements',
        content: 'Echo similar formats to create consistency. This matching vertical tile helps frame the wider elements above.',
        media: stock.getRandomByTags(['object', 'aspect:tall']),
        cols: '1',
        rows: '2',
      },
      {
        title: 'Breathing Room',
        content: 'Use wider tiles to give your gallery moments of expansion. This helps prevent visual fatigue as viewers explore your content.',
        media: stock.getRandomByTags(['object', 'aspect:wide']),
        cols: '2',
        rows: '1',
        theme: 'cyan',
      },
      {
        title: 'Bold Presence',
        content: 'Another 2x2 square creates a strong anchor point in your layout. Perfect for images that need more visual weight.',
        media: stock.getRandomByTags(['object', 'aspect:square']),
        cols: '2',
        rows: '2',
        showText: true,
      },
      {
        title: 'Dramatic Finish',
        content: 'End your gallery with impact. This tall 1x3 format creates a strong finishing note that leaves a lasting impression.',
        media: stock.getRandomByTags(['object', 'aspect:wide']),
        cols: '1',
        rows: '3',
        theme: 'slate',
        showText: true,
      },
    ],
  }
}

async function getDefaultConfig(args: { stock: StockMedia }): Promise<UserConfig> {
  const { stock } = args

  return {
    layout: {
      gapSize: 'md',
      aspectRatio: 'dynamic',
      animation: 'fade',
    },
    items: [
      {
        title: 'Featured Image',
        content: 'Add your main image here. This wider format provides the perfect stage for your key visual story.',
        media: stock.getRandomByTags(['aspect:square', 'object']),
        cols: '2',
        rows: '2',
        theme: 'blue',
        showText: true,
      },
      {
        title: 'Supporting Detail',
        content: 'Add a complementary image that enhances your story. Single-column images work great for portraits or detailed shots.',
        media: stock.getRandomByTags(['aspect:portrait', 'object']),
        cols: '1',
        rows: '2',
        theme: 'emerald',
        showText: true,
      },
      {
        title: 'Visual Context',
        content: 'Complete your narrative with another supporting image. Keep the story flowing with thoughtfully chosen visuals.',
        media: stock.getRandomByTags(['aspect:portrait', 'object']),
        cols: '1',
        rows: '2',
        theme: 'violet',
        showText: true,
      },
    ],
  }
}

export async function getConfig(args: { templateId: string, factory: CardFactory }) {
  const { templateId } = args
  const stock = await args.factory.getStockMedia()

  return {
    schema,
    options,
    userConfig: await getDemoConfig({ stock }),
    demoPage: {
      cards: [
        {
          templateId,
          userConfig: await getDemoConfig({ stock }),
        },
        {
          templateId,
          userConfig: await getDefaultConfig({ stock }),
        },
      ],
    },
  }
}
