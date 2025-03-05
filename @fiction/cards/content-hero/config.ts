import type { CardFactory } from '@fiction/site/cardFactory'
import type { InputOption } from '@fiction/ui'
import { ActionAreaSchema, MediaBasicSchema, SuperTitleSchema } from '@fiction/core'
import { createOption } from '@fiction/ui'
import { z } from 'zod'

const LayerMediaScheme = z.object({
  media: MediaBasicSchema.optional().describe('Layer image [@ai]'),
  position: z.enum(['top', 'bottom', 'left', 'right', 'center', 'bottomRight', 'topRight', 'bottomLeft', 'topLeft']).optional().describe('Layer placement'),
  widthPercent: z.number().optional().describe('Layer width %'),
})

export const schema = z.object({
  layout: z.enum(['justify', 'center', 'left', 'right']).optional().describe('Content alignment'),
  title: z.string().optional().describe('Main headline (3-13 words) [@ai]'),
  subTitle: z.string().optional().describe('Supporting message (10-30 words) [@ai]'),
  superTitle: SuperTitleSchema.optional().describe('Small text above title [@ai]'),
  media: MediaBasicSchema.optional().describe('Primary visual'),
  caption: z.string().optional().describe('Media description [@ai]'),
  action: ActionAreaSchema.optional().describe('Call-to-action buttons [@ai]'),
  overlays: z.array(LayerMediaScheme).optional().describe('Decorative image layers'),
})
type UserConfig = z.infer<typeof schema>

// Default configuration showcasing best practices
const defaultContent: UserConfig = {
  title: 'Enter Your Title',
  subTitle: 'Write a sentence or two that adds context to your headline',
  action: {
    buttons: [],
  },
}

// Structured input options for the design interface
export function getOptions(): InputOption[] {
  return [
    createOption({
      key: 'content',
      label: 'Content',
      input: 'group',
      options: [
        createOption({
          key: 'title',
          label: 'Title',
          input: 'InputText',
          schema,
        }),
        createOption({
          key: 'subTitle',
          label: 'Sub Title',
          input: 'InputTextarea',
          props: { rows: 3 },
          schema,
        }),
        createOption({
          key: 'superTitle',
          label: 'Super Title',
          input: 'InputSuperTitle',
          isClosed: true,
          schema,
        }),
      ],
    }),
    createOption({
      key: 'style',
      label: 'Layout + Style',
      input: 'group',
      options: [
        createOption({
          key: 'layout',
          label: 'Layout Style',
          input: 'InputRadioButton',
          props: { uiSize: 'sm' },
          list: [{ value: 'center' }, { value: 'left' }, { value: 'right' }, { value: 'justify' }],
          schema,
        }),
      ],
    }),
    createOption({
      key: 'media',
      label: 'Media',
      input: 'group',
      options: [
        createOption({
          key: 'media',
          label: 'Media',
          input: 'InputMedia',
          schema,
        }),
        createOption({
          key: 'media.aspect',
          label: 'Media Aspect',
          input: 'InputRadioButton',
          list: [
            { label: 'Square', value: 'aspect:square' },
            { label: 'Portrait', value: 'aspect:portrait' },
            { label: 'Landscape', value: 'aspect:landscape' },
          ],
        }),
        createOption({
          key: 'caption',
          label: 'Image Caption',
          input: 'InputText',
          schema,
        }),
        createOption({
          key: 'group.overlays',
          label: 'Image Overlays',
          icon: { class: 'i-tabler-layers-subtract' },
          input: 'group',
          schema,
          isClosed: true,
          options: [
            createOption({
              input: 'InputList',
              schema,
              key: 'overlays',
              options: [
                createOption({
                  key: 'overlays.0.media',
                  label: 'Overlay Image',
                  input: 'InputMedia',
                  schema,
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
                  schema,
                }),
                createOption({
                  key: 'overlays.0.widthPercent',
                  label: 'Width %',
                  input: 'InputRange',
                  props: { min: 0, max: 100, step: 5, startValue: 30 },
                  schema,
                }),
              ],
            }),

          ],
        }),
      ],
    }),
    createOption({
      key: 'actionGroup',
      label: 'Actions and Links',
      input: 'group',
      schema,
      options: [
        createOption({
          key: 'action',
          label: 'Action Area',
          input: 'InputActionArea',
          schema,
        }),
      ],
    }),

  ]
}

// Demo configurations showing various use cases
async function getDemoPage(args: { templateId: string, factory: CardFactory }) {
  const { templateId, factory } = args
  const stock = await factory.getStockMedia()
  const splash = (aspect: 'aspect:square' | 'aspect:portrait' = 'aspect:square') => stock.getRandomByTags(['object', aspect])

  const cards: { templateId: string, userConfig: UserConfig }[] = [
    // Product Launch Hero
    {
      templateId,
      userConfig: {
        layout: 'right',
        title: 'Revolutionize Your Workspace',
        subTitle: 'Experience the future of productivity with our AI-powered platform. Automate tasks, collaborate seamlessly, and achieve more in less time.',
        superTitle: { text: 'New Release', icon: { class: 'i-tabler-sparkles' }, theme: 'blue' },

        media: splash('aspect:portrait'),
        action: {
          buttons: [
            { label: 'Start Free Trial', theme: 'primary', design: 'solid', size: 'xl' },
            { label: 'Watch Demo', theme: 'default', design: 'ghost', size: 'xl' },
          ],
        },
      },
    },
    // Service Showcase Hero
    {
      templateId,
      userConfig: {
        layout: 'left',
        title: 'Craft Your Perfect Digital Presence',
        subTitle: 'From stunning websites to powerful marketing tools, we provide everything you need to grow your online business and connect with your audience.',
        superTitle: { text: 'Professional Services', icon: { class: 'i-tabler-brush' }, theme: 'purple' },
        media: splash('aspect:portrait'),
        action: {
          buttons: [
            { label: 'Explore Services', theme: 'primary', design: 'solid', size: 'xl' },
            { label: 'View Portfolio', theme: 'default', design: 'ghost', size: 'xl' },
          ],
        },
      },
    },
    // Event Promotion Hero
    {
      templateId,
      userConfig: {
        layout: 'center',
        title: 'Join the Future of Tech',
        subTitle: 'Be part of the largest virtual tech conference of 2024. Connect with industry leaders, discover emerging trends, and shape the future of technology.',
        superTitle: { text: 'Virtual Summit 2024', icon: { class: 'i-tabler-calendar-event' }, theme: 'indigo' },
        media: splash(),
        action: {
          buttons: [
            { label: 'Register Now', theme: 'primary', design: 'solid', size: 'xl' },
            { label: 'View Schedule', theme: 'default', design: 'ghost', size: 'xl' },
          ],
        },
      },
    },
    {
      templateId,
      userConfig: defaultContent,
    },
  ]

  return {
    cards,
  }
}

export async function getConfig(args: { templateId: string, factory: CardFactory }) {
  return {
    schema,
    options: getOptions(),
    userConfig: defaultContent,
    demoPage: await getDemoPage(args),
  }
}

export type { UserConfig }
export type OverlayConfig = z.infer<typeof LayerMediaScheme>
