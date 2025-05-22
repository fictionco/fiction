import type { StandardUserConfig } from '@fiction/site/schema'
import { fontFamilySchema, MediaSchema } from '@fiction/core'
import { createOption } from '@fiction/ui'
import { z } from 'zod/v4'

export const SchemaTicker = z.object({
  text: z.string().optional().meta({ ai: true, description: 'Text content to display' }),
  href: z.string().optional().meta({ ai: false, description: 'Optional link URL' }),

  // Animation
  speed: z.number().min(0).max(100).default(50).optional().meta({ ai: false, description: 'Base animation speed' }),
  direction: z.enum(['left', 'right']).default('left').optional().meta({ ai: false, description: 'Scroll direction' }),

  // Styling
  font: fontFamilySchema.optional().meta({ ai: false, description: 'Custom font family' }),
  backgroundColor: z.string().optional().meta({ ai: false, description: 'Background color' }),
  backgroundColorLight: z.string().optional().meta({ ai: false, description: 'Background color in light mode' }),
  outline: z.boolean().default(false).optional().meta({ ai: false, description: 'Apply text outline effect' }),

  divider: z.object({
    isEnabled: z.boolean().optional().meta({ ai: false, description: 'Enable divider' }),
    color: z.string().optional().meta({ ai: false, description: 'Divider color' }),
    icon: MediaSchema.optional().meta({ ai: true, description: 'Divider character' }),
    shouldRotate: z.boolean().optional().meta({ ai: false, description: 'Rotate divider' }),
  }).optional().meta({ ai: false, description: 'Divider configuration' }),

  // 3D Transform
  transform: z.object({
    rotateX: z.number().min(-30).max(30).default(0).optional().meta({ ai: false, description: '3D rotation around X-axis' }),
    rotateY: z.number().min(-30).max(30).default(0).optional().meta({ ai: false, description: '3D rotation around Y-axis' }),
    rotateZ: z.number().min(-30).max(30).default(0).optional().meta({ ai: false, description: '3D rotation around Z-axis' }),
  }).default({}).optional().meta({ ai: false, description: '3D transformation settings' }),
})

// Schema with improved organization and descriptions
export const schema = z.object({
  fontSize: z.number().min(5).max(15).optional().meta({ ai: false, description: 'Base font size in viewport width units' }),
  scrollEffect: z.boolean().default(true).optional().meta({ ai: false, description: 'Enable scroll-based animation speed effect' }),
  scrollIntensity: z.number().min(0).max(100).default(25).optional().meta({ ai: false, description: 'How much scroll position affects animation speed (%)' }),

  items: z.array(SchemaTicker).default([]).meta({ ai: true, description: 'Array of ticker items', label: 'Ticker Items' }),
})

export type UserConfig = z.infer<typeof schema> & StandardUserConfig

export type TickerConfig = z.infer<typeof SchemaTicker>

export function getOptions() {
  return [
    createOption({
      schema,
      key: 'group.ticker',
      label: 'Ticker Items',
      input: 'group',
      icon: { class: 'i-tabler-arrow-autofit-width' },
      options: [
        createOption({
          schema,
          key: 'items',
          label: 'Ticker Items',
          input: 'InputList',
          description: 'Add scrolling text elements',
          props: {
            itemName: 'Ticker',
            itemLabel: args => (args?.item as TickerConfig)?.text ?? 'Untitled',
          },
          options: [
            createOption({ schema, key: 'items.0.text', label: 'Text', input: 'InputText', isRequired: true }),
            createOption({ schema, key: 'items.0.href', label: 'Link URL', input: 'InputSiteRoute' }),
            createOption({
              schema,
              key: 'items.0.animation',
              label: 'Animation',
              input: 'group',
              icon: { class: 'i-tabler-arrow-move-right' },
              options: [
                createOption({
                  schema,
                  key: 'items.0.speed',
                  label: 'Speed',
                  input: 'InputRange',
                  props: { min: 0, max: 100, step: 5 },
                }),
                createOption({
                  schema,
                  key: 'items.0.direction',
                  label: 'Direction',
                  input: 'InputRadioButton',
                  props: { uiSize: 'sm' },
                  list: [
                    { label: 'Left', value: 'left' },
                    { label: 'Right', value: 'right' },
                  ],
                }),
              ],
            }),
            createOption({
              schema,
              key: 'font',
              label: 'Font',
              input: 'group',
              icon: { class: 'i-tabler-text-size' },
              options: [
                createOption({ schema, key: 'items.0.font', label: 'Font', input: 'InputFont' }),
              ],
            }),
            createOption({
              schema,
              key: 'appearance',
              label: 'Appearance',
              input: 'group',
              icon: { class: 'i-tabler-palette' },
              isClosed: true,
              options: [
                createOption({ schema, key: 'items.0.backgroundColor', label: 'Background Color', input: 'InputColor' }),
                createOption({ schema, key: 'items.0.backgroundColorLight', label: 'Background Color (Light Mode)', input: 'InputColor' }),
                createOption({ schema, key: 'items.0.outline', label: 'Text Outline', input: 'InputToggle' }),
              ],
            }),
            createOption({
              schema,
              key: 'transform',
              label: '3D Transform',
              input: 'group',
              icon: { class: 'i-tabler-cube' },
              isClosed: true,
              options: [
                createOption({ schema, key: 'items.0.transform.rotateX', label: 'Tilt Forward/Back', input: 'InputRange', props: { min: -30, max: 30, step: 1 } }),
                createOption({ schema, key: 'items.0.transform.rotateY', label: 'Tilt Left/Right', input: 'InputRange', props: { min: -30, max: 30, step: 1 } }),
                createOption({ schema, key: 'items.0.transform.rotateZ', label: 'Rotate', input: 'InputRange', props: { min: -30, max: 30, step: 1 } }),
              ],
            }),
            createOption({
              schema,
              key: 'divider',
              label: 'Divider',
              input: 'group',
              isClosed: true,
              icon: { class: 'i-tabler-divide' },
              options: [
                createOption({ schema, key: 'items.0.divider.isEnabled', label: 'Enable Divider', input: 'InputToggle' }),
                createOption({ schema, key: 'items.0.divider.icon', label: 'Divider Icon', input: 'InputIcon' }),
                createOption({ schema, key: 'items.0.divider.color', label: 'Divider Color', input: 'InputColor' }),
                createOption({ schema, key: 'items.0.divider.shouldRotate', label: 'Rotate Divider', input: 'InputToggle' }),
              ],
            }),
          ],
        }),
      ],
    }),

    createOption({
      schema,
      key: 'group.settings',
      label: 'Settings',
      input: 'group',
      icon: { class: 'i-tabler-settings' },
      options: [
        createOption({
          schema,
          key: 'fontSize',
          label: 'Font Size',
          input: 'InputRange',
          props: { min: 5, max: 15, step: 0.5 },
        }),
        createOption({
          schema,
          key: 'scrollEffect',
          label: 'Scroll Animation',
          input: 'InputToggle',
          description: 'Speed up animation while scrolling',
        }),
        createOption({
          schema,
          key: 'scrollIntensity',
          label: 'Scroll Effect Intensity',
          input: 'InputRange',
          props: { min: 0, max: 100, step: 5 },
          description: 'How much scroll affects animation speed',
        }),
      ],
    }),

  ]
}

function getDefaultConfig(): UserConfig {
  return {
    fontSize: 8,
    scrollEffect: true,
    scrollIntensity: 25,
    items: [{
      text: 'Add your first ticker message here — perfect for announcements, news, or promotions.',
      speed: 30,
      direction: 'left',
      transform: {
        rotateX: 5,
        rotateY: 5,
        rotateZ: -2,
      },
    }],
  }
}

export function getDemoConfigs(templateId: string): Record<string, { templateId: string, userConfig: UserConfig }> {
  return {
    default: {
      templateId,
      userConfig: getDefaultConfig(),
    },
    business: {
      templateId,
      userConfig: {
        fontSize: 6,
        scrollEffect: true,
        scrollIntensity: 25,
        items: [
          {
            text: '🎉 Special offer: Get 20% off all products with code SUMMER2024',
            speed: 40,
            direction: 'left',
            backgroundColorLight: '#2563eb',
            backgroundColor: '#1e40af',
            href: '#special-offer',
          },
          {
            text: '📦 Free shipping on orders over $50 • Limited time only',
            speed: 45,
            direction: 'right',
            backgroundColorLight: '#059669',
            backgroundColor: '#065f46',
          },
        ],
      },
    },
    creative: {
      templateId,
      userConfig: {
        fontSize: 7,
        scrollEffect: true,
        scrollIntensity: 35,
        items: [
          {
            text: 'Create • Innovate • Inspire',
            speed: 30,
            direction: 'left',
            outline: true,
            transform: {
              rotateX: -5,
              rotateY: 10,
              rotateZ: 2,
            },
          },
          {
            text: 'Design • Develop • Deploy',
            speed: 35,
            direction: 'right',
            font: { family: 'highlight' },
            transform: {
              rotateX: 5,
              rotateY: -10,
              rotateZ: -2,
            },
          },
        ],
      },
    },
  }
}

export async function getConfig(args: { templateId: string }) {
  const { templateId } = args
  return {
    schema,
    options: getOptions(),
    userConfig: getDefaultConfig(),
    demoPage: {
      cards: Object.values(getDemoConfigs(templateId)),
    },
  }
}
