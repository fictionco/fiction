import type { ActionArea } from '@fiction/core'
import type { CardFactory } from '@fiction/site/cardFactory'
import type { StandardUserConfig } from '@fiction/site/schema'
import type { InputOption } from '@fiction/ui'
import type { StockMedia } from '@fiction/ui/stock/index.js'
import { ActionAreaSchema, colorThemeUser, MediaSchema, SizeSchema, SuperTitleSchema } from '@fiction/core'
import { createOption } from '@fiction/ui'
import { z } from 'zod/v4'

const BentoItemSchema = z.object({
  // Content Elements
  superTitle: SuperTitleSchema.optional().meta({ ai: true, description: 'Short attention-grabbing text above title' }),
  title: z.string().optional().meta({ ai: true, description: 'Main headline for this content box' }),
  content: z.string().optional().meta({ ai: true, description: 'Supporting text that expands on your title - aim for 1-2 sentences' }),
  media: MediaSchema.optional().meta({ ai: true, description: 'Visual content to display in this box' }),
  href: z.string().optional().meta({ ai: false, description: 'Make entire box clickable' }),
  action: ActionAreaSchema.optional().meta({ ai: true, description: 'Add buttons or interactive elements' }),

  // Visual Style
  bg: MediaSchema.optional().meta({ ai: true, description: 'Background image or video' }),
  theme: z.enum(colorThemeUser).optional().meta({ ai: false, description: 'Color theme for this box' }),
  themeMode: z.enum(['light', 'dark', 'auto']).optional().meta({ ai: false, description: 'Adjust content contrast against background' }),

  // Layout Controls
  cols: z.number().min(1).max(12).optional().meta({ ai: false, description: 'Box width in columns (1-12)' }),
  rows: z.number().min(1).max(12).optional().meta({ ai: false, description: 'Box height in rows (1-12)' }),
  verticalPosition: z.enum(['top', 'center', 'bottom']).optional().meta({ ai: false, description: 'Vertical content alignment' }),
  horizontalPosition: z.enum(['left', 'center', 'right']).optional().meta({ ai: false, description: 'Horizontal content alignment' }),
})

export const schema = z.object({
  items: z.array(BentoItemSchema).meta({ ai: true, description: 'Collection of content boxes in grid layout' }),
  gapSize: SizeSchema.optional().meta({ ai: false, description: 'Spacing between boxes' }),
  animate: z.enum(['expand', 'swipe', '']).optional().meta({ ai: false, description: 'Animation style for box appearance' }),
})

export type BentoItem = z.infer<typeof BentoItemSchema>
export type UserConfig = z.infer<typeof schema> & StandardUserConfig

const options: InputOption[] = [
  createOption({
    key: 'group.items',
    label: 'Content',
    input: 'group',
    icon: { class: 'i-tabler-align-left' },
    options: [
      createOption({
        key: 'items',
        label: 'Bento Items',
        input: 'InputList',
        props: {
          itemName: 'Bento Box',
          itemLabel: args => (args?.item as BentoItem)?.title ?? 'Untitled',
        },
        options: [
          createOption({
            key: 'group.layout',
            label: 'Layout',
            input: 'group',
            icon: { class: 'i-tabler-layout' },
            options: [
              createOption({ schema, key: 'items.0.cols', label: 'Columns', input: 'InputNumber', props: { min: 1, max: 12 } }),
              createOption({ schema, key: 'items.0.rows', label: 'Rows', input: 'InputNumber', props: { min: 1, max: 12 } }),
              createOption({ schema, key: 'items.0.verticalPosition', label: 'Vertical Position', input: 'InputSelect', list: ['top', 'center', 'bottom'] }),
              createOption({ schema, key: 'items.0.horizontalPosition', label: 'Horizontal Position', input: 'InputSelect', list: ['left', 'center', 'right'] }),
            ],
          }),
          createOption({
            key: 'group.content',
            label: 'Content',
            input: 'group',
            icon: { class: 'i-tabler-highlight' },
            options: [
              createOption({ schema, key: 'items.0.title', label: 'Title', input: 'InputText' }),
              createOption({ schema, key: 'items.0.content', label: 'Content', input: 'InputTextarea' }),
              createOption({ schema, key: 'items.0.superTitle', label: 'Super Title', input: 'InputSuperTitle' }),
              createOption({ schema, key: 'items.0.media', label: 'Inline Media', input: 'InputMedia' }),
              createOption({ schema, key: 'items.0.href', label: 'Item URL', input: 'InputSiteRoute' }),
              createOption({ schema, key: 'items.0.action.buttons', label: 'Action Area', input: 'InputActions' }),
            ],
          }),
          createOption({
            key: 'group.style',
            label: 'Color and Style',
            input: 'group',
            icon: { class: 'i-tabler-palette' },
            options: [
              createOption({
                key: 'bg',
                label: 'Background Media',
                input: 'InputMedia',
                props: { isBackground: true },
              }),
              createOption({ key: 'theme', label: 'Color Theme', input: 'InputColorTheme' }),
              createOption({
                key: 'themeMode',
                label: 'Theme Mode',
                subLabel: 'Select lighter or darker tones',
                input: 'InputRadioButton',
                props: { uiSize: 'sm' },
                list: ['light', 'dark', 'auto'],
              }),
            ],
          }),

        ],
      }),
    ],
  }),

  createOption({
    key: 'group.settings',
    label: 'Design',
    input: 'group',
    icon: { class: 'i-tabler-layout' },
    options: [
      createOption({
        key: 'gapSize',
        label: 'Gap',
        input: 'InputStandardSize',
      }),
      createOption({
        key: 'animate',
        label: 'Animation',
        subLabel: 'Select an animation style for the tiles',
        input: 'InputRadioButton',
        props: { uiSize: 'sm' },
        list: ['expand', 'swipe'],
      }),
    ],
  }),

]

export async function getUserConfig(args: { factory: CardFactory, templateId: string, stock: StockMedia }): Promise<UserConfig> {
  const { stock } = args
  const action = {
    buttons: [
      { label: 'Learn More', href: '#' },
    ],
  } satisfies ActionArea
  return {
    items: [
      {
        cols: 4,
        rows: 2,
        title: 'Feature Title Here',
        superTitle: { text: 'Badge Text' },
        content: 'Add a brief description of your feature. Keep it concise and compelling - about 1-2 lines.',
        action,
      },
      {
        cols: 4,
        rows: 2,
        title: 'Second Feature',
        content: 'Add a brief description of your feature. Keep it concise and compelling - about 1-2 lines.',
        action,
      },
      {
        cols: 4,
        rows: 2,
        title: 'Third Feature',
        content: 'Add a brief description of your feature. Keep it concise and compelling - about 1-2 lines.',
        action,
      },
      {
        cols: 12,
        rows: 2,
        title: 'Card With Media',
        content: 'Add media or background images to create visual interest.',
        bg: {
          ...stock.getRandomByTags(['background']),
          effects: { overlay: { opacity: 0.4 } }, // Adjust overlay opacity: 0-1
        },
        verticalPosition: 'center', // Try: top, center, bottom
        horizontalPosition: 'center', // Try: left, center, right
        action,
      },
    ],
  }
}

export async function getDemoUserConfig(args: { factory: CardFactory, stock: StockMedia }): Promise<UserConfig> {
  const { stock } = args

  const uc: UserConfig = {
    animate: 'expand',
    gapSize: 'lg', // Generous spacing creates visual breathing room
    items: [
      // Hero Section - Full Width Impact
      {
        cols: 12,
        rows: 4,
        superTitle: { text: 'Welcome to Bento' },
        title: 'Imagine Your Content as Art',
        content: 'Notice how different sized tiles create visual rhythm and guide your viewer\'s attention. Start with a bold statement that spans the full width.',
        theme: 'blue',
        themeMode: 'dark',
        verticalPosition: 'bottom',
        horizontalPosition: 'left',
        bg: {
          ...stock.getRandomByTags(['abstract', 'aspect:landscape']),
          effects: { overlay: { opacity: 0.3 } },
        },
        action: {
          buttons: [
            { label: 'See Examples' },
            { label: 'Try It Now' },
          ],
        },
      },

      // Left Feature Block - Visual Balance
      {
        cols: 6,
        rows: 4,
        superTitle: { text: 'Pro Tip' },
        title: 'Create Visual Balance',
        content: 'See what happens when you pair a larger tile with smaller companions? The asymmetry draws the eye while maintaining harmony. Try adjusting the column and row spans to find your perfect balance.',
        theme: 'emerald',
        themeMode: 'dark',
        bg: {
          ...stock.getRandomByTags(['object']),
          effects: { overlay: { opacity: 0.4 } },
        },
      },

      // Right Top - Quick Win
      {
        cols: 6,
        rows: 2,
        title: 'Add Depth with Color',
        superTitle: { text: 'Design Tip' },
        content: 'Notice how alternating light and dark themes creates depth? Experiment with theme colors and modes to establish visual hierarchy.',
        theme: 'violet',
        themeMode: 'light',
      },

      // Right Bottom - Quick Win
      {
        cols: 6,
        rows: 2,
        title: 'Perfect Your Text',
        superTitle: { text: 'Typography' },
        content: 'Watch how text automatically adjusts to tile size. Try different vertical and horizontal positions to find the sweet spot.',
        theme: 'amber',
        themeMode: 'dark',
        verticalPosition: 'center',
        horizontalPosition: 'center',
      },

      // Media Showcase - Full Width
      {
        cols: 12,
        rows: 3,
        title: 'Bring Your Content to Life',
        content: 'Images transform your tiles into immersive experiences. Watch how overlay opacity affects text readability - adjust it until you find the perfect balance.',
        verticalPosition: 'center',
        horizontalPosition: 'center',
        theme: 'slate',
        themeMode: 'dark',
        bg: {
          ...stock.getRandomByTags(['technology']),
          effects: { overlay: { opacity: 0.5 } },
        },
        action: {
          buttons: [
            { label: 'Learn About Images', design: 'outline' },
          ],
        },
      },

      // Feature Grid - 3 Column Balance
      {
        cols: 4,
        rows: 3,
        title: 'Start Simple',
        superTitle: { text: '01' },
        content: 'Begin with a basic layout. You can always add complexity as you go.',
        theme: 'rose',
        themeMode: 'light',
      },
      {
        cols: 4,
        rows: 3,
        title: 'Add Variety',
        superTitle: { text: '02' },
        content: 'Mix up your content types. Try combining text, images, and calls-to-action.',
        theme: 'cyan',
        themeMode: 'light',
      },
      {
        cols: 4,
        rows: 3,
        title: 'Perfect It',
        superTitle: { text: '03' },
        content: 'Fine-tune spacing and alignment. Small adjustments make a big difference.',
        theme: 'indigo',
        themeMode: 'light',
      },

      // Bottom Impact Tiles
      {
        cols: 8,
        rows: 4,
        title: 'Make a Statement',
        content: 'Larger tiles naturally draw attention. Use them strategically for your most important messages. See how this tile commands attention through size and contrast?',
        theme: 'blue',
        themeMode: 'dark',
        verticalPosition: 'center',
        horizontalPosition: 'left',
        bg: {
          ...stock.getRandomByTags(['abstract']),
          effects: { overlay: { opacity: 0.4 } },
        },
      },
      {
        cols: 4,
        rows: 4,
        title: 'Ready to Create?',
        superTitle: { text: 'Get Started' },
        content: 'Your perfect layout is just a few clicks away. Start with this template and make it your own.',
        theme: 'emerald',
        themeMode: 'dark',
        verticalPosition: 'center',
        horizontalPosition: 'center',
        action: {
          buttons: [
            { label: 'Start Building' },
          ],
        },
      },
    ],
  }

  return uc
}

export async function getDemo(args: { factory: CardFactory, templateId: string, stock: StockMedia }) {
  const { templateId, stock } = args
  const uc = await getDemoUserConfig({ ...args, stock })
  return { cards: [{ templateId, userConfig: uc }] }
}

export async function getConfig(args: { templateId: string, factory: CardFactory }) {
  const stock = await args.factory.getStockMedia()
  return {
    schema,
    options,
    userConfig: await getUserConfig({ ...args, stock }),
    demoPage: await getDemo({ ...args, stock }),
  }
}
